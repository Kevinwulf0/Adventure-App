import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { CharacterMode, PowerLevel, generateStats, generateBackstory, generatePortraitUrl, Character } from '@/lib/dnd-engine';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Wand2, Sparkles, PenLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCharacters } from '@/hooks/use-characters';

const RACES = [
  'Aarakocra', 'Aasimar', 'Astral Elf', 'Autognome',
  'Bugbear', 'Centaur', 'Changeling',
  'Deep Gnome', 'Dhampir', 'Dragonborn', 'Dwarf',
  'Eladrin', 'Elf', 'Fairy', 'Firbolg',
  'Genasi', 'Giff', 'Githyanki', 'Githzerai', 'Gnome', 'Goblin', 'Goliath', 'Grung',
  'Hadozee', 'Half-Elf', 'Half-Orc', 'Halfling', 'Harengon', 'Hexblood', 'Hobgoblin', 'Human',
  'Kalashtar', 'Kenku', 'Kobold',
  'Leonin', 'Lizardfolk', 'Locathah', 'Loxodon',
  'Minotaur',
  'Orc', 'Owlin',
  'Plasmoid',
  'Reborn',
  'Satyr', 'Sea Elf', 'Shadar-kai', 'Shifter', 'Simic Hybrid',
  'Tabaxi', 'Thri-kreen', 'Tiefling', 'Tortle', 'Triton',
  'Vedalken', 'Verdan',
  'Warforged',
  'Yuan-ti Pureblood',
  'Other',
];

const CLASSES = ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'];

interface WizardFormProps {
  mode: CharacterMode;
}

export default function WizardForm({ mode }: WizardFormProps) {
  const [, setLocation] = useLocation();
  const { saveCharacter } = useCharacters();
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const [name, setName] = useState('');
  const [race, setRace] = useState('');
  const [customRace, setCustomRace] = useState('');
  const [charClass, setCharClass] = useState('');
  const [personality, setPersonality] = useState('');
  const [powerLevel, setPowerLevel] = useState<PowerLevel>('Commoner');

  const effectiveRace = race === 'Other' ? customRace.trim() : race;

  const steps = [
    { title: "The Name", desc: "Who are you?" },
    { title: "Lineage", desc: "Choose your ancestry" },
    { title: "Calling", desc: "Choose your path" },
    { title: "Essence", desc: "Traits & Flaws" },
    ...(mode === 'npc' ? [{ title: "Might", desc: "Set power level" }] : []),
  ];

  const totalSteps = steps.length;

  const isNextDisabled =
    (step === 0 && !name) ||
    (step === 1 && (!race || (race === 'Other' && !customRace.trim()))) ||
    (step === 2 && !charClass) ||
    (step === 3 && !personality);

  const handleNext = () => {
    if (isNextDisabled) return;
    if (step < totalSteps - 1) {
      setStep(s => s + 1);
    } else {
      generateFinalCharacter();
    }
  };

  const generateFinalCharacter = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 2000));

    const stats = generateStats(charClass, mode === 'npc' ? powerLevel : undefined);
    const backstory = generateBackstory(name, effectiveRace, charClass, personality);
    const portraitUrl = generatePortraitUrl(effectiveRace, charClass, personality);

    const newChar: Character = {
      id: Math.random().toString(36).substring(2, 9),
      mode,
      name,
      race: effectiveRace,
      charClass,
      personality,
      powerLevel: mode === 'npc' ? powerLevel : undefined,
      stats,
      backstory,
      portraitUrl,
      createdAt: Date.now()
    };

    saveCharacter(newChar);
    setLocation(`/sheet/${newChar.id}`);
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground text-lg italic text-center mb-8">
              "Every great saga begins with a name spoken into the void."
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kaelen Shadowweaver"
              className="w-full bg-background border-2 border-primary/30 rounded-xl px-6 py-4 text-xl md:text-2xl font-display text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all text-center"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && name && handleNext()}
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-4 pb-8">
            <div className="grid grid-cols-2 gap-3">
              {RACES.map(r => (
                <button
                  key={r}
                  onClick={() => {
                    setRace(r);
                    if (r !== 'Other') setCustomRace('');
                  }}
                  className={cn(
                    "px-4 py-4 rounded-xl border-2 font-display tracking-wider text-sm transition-all duration-300 hover-elevate text-left",
                    race === r
                      ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                      : "bg-card border-border text-foreground hover:border-primary/50"
                  )}
                >
                  {r === 'Other' ? (
                    <span className="flex items-center gap-2">
                      <PenLine className="w-4 h-4 shrink-0" />
                      Other…
                    </span>
                  ) : r}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {race === 'Other' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2 pb-1">
                    <p className="text-muted-foreground text-sm italic mb-3 text-center">
                      Name your lineage — homebrew, lore-expansion, or legend of your own making.
                    </p>
                    <input
                      type="text"
                      value={customRace}
                      onChange={(e) => setCustomRace(e.target.value)}
                      placeholder="e.g. Duergar, Shadar-kai, Kenku hybrid…"
                      className="w-full bg-background border-2 border-primary/60 rounded-xl px-5 py-4 text-base font-display text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all text-center"
                      autoFocus
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pb-8">
            {CLASSES.map(c => (
              <button
                key={c}
                onClick={() => setCharClass(c)}
                className={cn(
                  "px-3 py-4 rounded-xl border-2 font-display tracking-wider text-sm transition-all duration-300 hover-elevate",
                  charClass === c
                    ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                    : "bg-card border-border text-foreground hover:border-primary/50"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground text-center mb-4 italic">
              Describe their ideals, bonds, flaws, or general demeanor.
            </p>
            <textarea
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="A brooding wanderer who speaks to spirits, fiercely loyal to their coin purse but terrified of enclosed spaces..."
              className="w-full h-48 bg-background border-2 border-primary/30 rounded-xl px-5 py-4 text-base font-sans text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all resize-none"
            />
          </div>
        );

      case 4:
        return mode === 'npc' ? (
          <div className="space-y-12 pt-8 pb-4">
            <div className="flex justify-between px-2 text-sm font-display font-bold text-primary">
              <span>Commoner</span>
              <span>Elite</span>
              <span>Legendary</span>
            </div>
            <div className="relative w-full h-2 bg-secondary rounded-full">
              <input
                type="range"
                min="0"
                max="2"
                step="1"
                value={powerLevel === 'Commoner' ? 0 : powerLevel === 'Elite' ? 1 : 2}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setPowerLevel(val === 0 ? 'Commoner' : val === 1 ? 'Elite' : 'Legendary');
                }}
                className="absolute inset-0 w-full opacity-0 cursor-pointer h-8 -top-3"
              />
              <div
                className="absolute h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${powerLevel === 'Commoner' ? 0 : powerLevel === 'Elite' ? 50 : 100}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)] border-2 border-background transition-all duration-300 pointer-events-none"
                style={{ left: `calc(${powerLevel === 'Commoner' ? 0 : powerLevel === 'Elite' ? 50 : 100}% - 12px)` }}
              >
                <div className="absolute inset-1 border border-background/30 rounded-full" />
              </div>
            </div>

            <div className="text-center p-6 bg-card border border-primary/20 rounded-xl">
              <h3 className="text-xl font-display text-primary mb-2">{powerLevel}</h3>
              <p className="text-muted-foreground text-sm">
                {powerLevel === 'Commoner' && "Standard stats (8–12). Suitable for townsfolk, guards, or minor threats."}
                {powerLevel === 'Elite' && "Enhanced stats (14–18). Suitable for captains, veterans, or tough adversaries."}
                {powerLevel === 'Legendary' && "Godlike stats (20–24). Suitable for bosses, champions, or mythical figures."}
              </p>
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  if (isGenerating) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 relative mb-8"
        >
          <div className="absolute inset-0 border-4 border-t-primary border-r-primary border-b-primary/20 border-l-primary/20 rounded-full" />
          <div className="absolute inset-4 border-4 border-t-accent/20 border-r-accent/20 border-b-accent border-l-accent rounded-full" />
          <Sparkles className="absolute inset-0 m-auto w-12 h-12 text-primary animate-pulse" />
        </motion.div>
        <h2 className="text-3xl font-display font-bold text-primary mb-4">Weaving Fates...</h2>
        <p className="text-muted-foreground text-lg italic">
          Consulting the ancient tomes and conjuring visions of {name || 'the unknown'}...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col pt-8 px-6 pb-20">
      <div className="w-full flex space-x-2 mb-8">
        {steps.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-500",
              i <= step ? "bg-primary shadow-[0_0_8px_rgba(234,179,8,0.5)]" : "bg-primary/20"
            )}
          />
        ))}
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary text-glow mb-2">
          {steps[step].title}
        </h2>
        <p className="text-muted-foreground tracking-wide uppercase text-sm">
          {steps[step].desc}
        </p>
      </div>

      <div className="flex-1 relative overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-primary/20 mt-auto">
        <Button
          variant="ghost"
          onClick={() => setStep(s => Math.max(0, s - 1))}
          className={cn("px-2", step === 0 && "opacity-0 pointer-events-none")}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <Button
          variant="default"
          onClick={handleNext}
          disabled={isNextDisabled}
          className="w-40 bg-gradient-to-r from-primary to-accent border-0 text-primary-foreground font-bold shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:shadow-[0_0_25px_rgba(234,179,8,0.5)]"
        >
          {step === totalSteps - 1 ? (
            <>Forge <Wand2 className="w-5 h-5 ml-2" /></>
          ) : (
            <>Next <ArrowRight className="w-5 h-5 ml-2" /></>
          )}
        </Button>
      </div>
    </div>
  );
}
