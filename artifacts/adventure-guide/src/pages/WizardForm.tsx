import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  ArrowLeft, 
  Wand2, 
  Sparkles, 
  Info, 
  Shield, 
  Swords, 
  ScrollText 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Types & Constants ---

interface NameQuote {
  text: string;
  source: string;
  work: string;
  year: number;
}

const NAME_QUOTES: NameQuote[] = [
  { text: "Words are pale shadows of forgotten names. As names have power, words have power.", source: "Patrick Rothfuss", work: "The Name of the Wind", year: 2007 },
  { text: "Not all those who wander are lost.", source: "J.R.R. Tolkien", work: "The Fellowship of the Ring", year: 1954 },
  { text: "Fear of a name increases fear of the thing itself.", source: "J.K. Rowling", work: "Harry Potter", year: 1997 },
  { text: "To light a candle is to cast a shadow.", source: "Ursula K. Le Guin", work: "A Wizard of Earthsea", year: 1968 },
  { text: "A reader lives a thousand lives before he dies.", source: "George R.R. Martin", work: "A Dance with Dragons", year: 2011 }
];

const FANTASY_NAMES = ['Aelindra', 'Arannis', 'Aravel', 'Ardyn', 'Caelindra', 'Caius', 'Corvin', 'Daemar', 'Drystan', 'Elowen', 'Faelion', 'Garrick', 'Idris', 'Kaelen', 'Lucan', 'Nyxara', 'Phelan', 'Riordan', 'Sariel', 'Thalion', 'Valdris', 'Xanathos', 'Zorindel'];
const FANTASY_SURNAMES = ['Ashveil', 'Blackthorn', 'Bloodmoon', 'Dawnbringer', 'Emberveil', 'Frostweave', 'Greywarden', 'Ironveil', 'Moonwhisper', 'Nightshade', 'Silverblade', 'Stormcaller', 'Wildborn', 'Wyrmtongue'];

const RACES = [
  'Aarakocra', 'Aasimar', 'Astral Elf', 'Autognome', 'Bugbear', 'Centaur', 'Changeling',
  'Deep Gnome', 'Dhampir', 'Dragonborn', 'Drow', 'Duergar', 'Dwarf', 'Elf', 'Fairy', 
  'Firbolg', 'Genasi', 'Githyanki', 'Gnome', 'Goblin', 'Goliath', 'Half-Elf', 
  'Half-Orc', 'Halfling', 'Human', 'Kenku', 'Kobold', 'Lizardfolk', 'Orc', 
  'Tabaxi', 'Tiefling', 'Tortle', 'Warforged'
];

const CLASSES = ['Artificer', 'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'];

const RACE_FACTS = [
  { race: "Aarakocra", text: "Aarakocra originate from the Elemental Plane of Air and can fly up to 50 feet per round." },
  { race: "Aasimar", text: "Every Aasimar is guided by a celestial being that communicates through dreams and visions." },
  { race: "Bugbear", text: "Despite their size, Bugbears are naturally stealthy and have a surprising melee reach." },
  { race: "Changeling", text: "A Changeling's true face is a featureless mask until they choose a shape." },
  { race: "Deep Gnome", text: "Also known as Svirfneblin, they possess superior Darkvision up to 120 feet." },
  { race: "Dragonborn", text: "Their breath weapon is determined by their Draconic Ancestry." },
  { race: "Tabaxi", text: "Native to distant lands, Tabaxi are driven by curiosity and a love for artifacts." },
  { race: "Warforged", text: "Constructs built for war, they do not need to eat or breathe." }
];

// --- Sub-Components ---

function D20Face({ num, isRolling }: { num: number; isRolling?: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      className="w-10 h-10 shrink-0"
      animate={isRolling ? { rotate: [0, -25, 32, -20, 26, 0], y: [0, -10, 0] } : {}}
      transition={{ duration: 1.5 }}
    >
      <polygon points="32,3 7,17 32,16" fill="rgba(234,179,8,0.17)" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="32,3 32,16 57,17" fill="rgba(234,179,8,0.13)" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="32,16 16,43 48,43" fill="rgba(234,179,8,0.28)" stroke="currentColor" strokeWidth="2" />
      <text x="32" y="34" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="bold" fill="currentColor">{num}</text>
    </motion.svg>
  );
}

// --- Main Form ---

export default function WizardForm() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [race, setRace] = useState('Human');
  const [charClass, setCharClass] = useState('Fighter');
  const [isRolling, setIsRolling] = useState(false);
  const [rollNum, setRollNum] = useState(20);

  const quote = NAME_QUOTES[Math.floor(Math.random() * NAME_QUOTES.length)];

  const handleRollName = () => {
    setIsRolling(true);
    let count = 0;
    const interval = setInterval(() => {
      setRollNum(Math.floor(Math.random() * 20) + 1);
      count++;
      if (count > 15) {
        clearInterval(interval);
        const first = FANTASY_NAMES[Math.floor(Math.random() * FANTASY_NAMES.length)];
        const last = FANTASY_SURNAMES[Math.floor(Math.random() * FANTASY_SURNAMES.length)];
        setName(`${first} ${last}`);
        setRollNum(20);
        setIsRolling(false);
      }
    }, 80);
  };

  const selectedFact = RACE_FACTS.find(f => f.race === race)?.text || "Each race brings unique traits and abilities to your adventure.";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-card border-2 border-border rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Progress Bar */}
        <div className="h-2 bg-muted flex">
          {[1, 2, 3].map((s) => (
            <div key={s} className={cn("flex-1 transition-all duration-500", step >= s ? "bg-primary" : "bg-transparent")} />
          ))}
        </div>

        <div className="p-8 space-y-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-display font-bold text-primary flex items-center gap-2">
                    <PenLine className="w-8 h-8" /> What is your name?
                  </h2>
                  <p className="text-muted-foreground italic text-sm">"{quote.text}" — {quote.source}</p>
                </div>
                
                <div className="flex gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Character Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-muted/50 border-2 border-transparent focus:border-primary/40 rounded-xl px-4 py-3 outline-none transition-all"
                      placeholder="Type a name..."
                    />
                  </div>
                  <button onClick={handleRollName} disabled={isRolling} className="p-1 hover:scale-105 transition-transform">
                    <D20Face num={rollNum} isRolling={isRolling} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-3xl font-display font-bold text-primary flex items-center gap-2">
                  <Shield className="Choose your lineage" /> Choose your lineage
                </h2>
                <select 
                  value={race} 
                  onChange={(e) => setRace(e.target.value)}
                  className="w-full bg-muted p-4 rounded-xl border-none outline-none ring-2 ring-transparent focus:ring-primary/50 appearance-none"
                >
                  {RACES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex gap-3">
                  <Info className="w-5 h-5 text-primary shrink-0" />
                  <p className="text-sm leading-relaxed">{selectedFact}</p>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-center py-4">
                <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-display font-bold">Ready to Begin?</h2>
                <p className="text-muted-foreground">Your {race} {charClass}, <span className="text-foreground font-bold">{name || "Unnamed Traveler"}</span>, is ready for the call to adventure.</p>
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="bg-muted/50 p-4 rounded-xl">
                    <span className="text-xs font-bold text-muted-foreground block uppercase">Class</span>
                    <select value={charClass} onChange={(e) => setCharClass(e.target.value)} className="bg-transparent border-none outline-none font-bold w-full">
                      {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between pt-6 border-t border-border/50">
            <Button variant="ghost" disabled={step === 1} onClick={() => setStep(s => s - 1)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            {step < 3 ? (
              <Button onClick={() => setStep(s => s + 1)} className="px-8 rounded-xl shadow-lg shadow-primary/20">
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button className="px-8 rounded-xl bg-primary shadow-lg shadow-primary/30">
                Generate <Wand2 className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
