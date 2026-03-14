import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  ArrowLeft, 
  Wand2, 
  Sparkles, 
  Info, 
  Shield, 
  PenLine,
  User,
  Trash2,
  PlusCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Types & Constants ---

interface Character {
  id: string;
  name: string;
  race: string;
  charClass: string;
  date: string;
}

interface NameQuote {
  text: string;
  source: string;
}

const NAME_QUOTES: NameQuote[] = [
  { text: "Words are pale shadows of forgotten names.", source: "Patrick Rothfuss" },
  { text: "Not all those who wander are lost.", source: "J.R.R. Tolkien" },
  { text: "Fear of a name increases fear of the thing itself.", source: "J.K. Rowling" },
  { text: "To light a candle is to cast a shadow.", source: "Ursula K. Le Guin" }
];

const FANTASY_NAMES = ['Aelindra', 'Arannis', 'Aravel', 'Ardyn', 'Caelindra', 'Caius', 'Corvin', 'Daemar', 'Drystan', 'Elowen'];
const FANTASY_SURNAMES = ['Ashveil', 'Blackthorn', 'Bloodmoon', 'Dawnbringer', 'Emberveil', 'Frostweave'];
const RACES = ['Aarakocra', 'Aasimar', 'Astral Elf', 'Autognome', 'Bugbear', 'Centaur', 'Changeling', 'Deep Gnome', 'Dhampir', 'Dragonborn', 'Drow', 'Duergar', 'Dwarf', 'Elf', 'Fairy', 'Firbolg', 'Genasi', 'Githyanki', 'Gnome', 'Goblin', 'Goliath', 'Half-Elf', 'Half-Orc', 'Halfling', 'Human', 'Kenku', 'Kobold', 'Lizardfolk', 'Orc', 'Tabaxi', 'Tiefling', 'Tortle', 'Warforged'];
const CLASSES = ['Artificer', 'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'];

const RACE_FACTS = [
  { race: "Aarakocra", text: "Aarakocra originate from the Elemental Plane of Air and can fly up to 50 feet per round." },
  { race: "Aasimar", text: "Every Aasimar is guided by a celestial being that communicates through dreams and visions." },
  { race: "Warforged", text: "Constructs built for war, they do not need to eat or breathe." }
];

// --- Sub-Components ---

function D20Face({ num, isRolling }: { num: number; isRolling?: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      className="w-10 h-10 shrink-0 text-yellow-500"
      animate={isRolling ? { rotate: [0, -25, 32, -20, 26, 0], y: [0, -10, 0] } : {}}
      transition={{ duration: 1.5 }}
    >
      <polygon points="32,3 7,17 32,16" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="32,3 32,16 57,17" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="32,16 16,43 48,43" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" />
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
  
  const [library, setLibrary] = useState<Character[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  // Load characters from browser storage on startup
  useEffect(() => {
    const saved = localStorage.getItem('adventure_guide_chars');
    if (saved) {
      try {
        setLibrary(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load library", e);
      }
    }
  }, []);

  const [quote] = useState(() => NAME_QUOTES[Math.floor(Math.random() * NAME_QUOTES.length)]);

  const handleRollName = () => {
    setIsRolling(true);
    let count = 0;
    const interval = setInterval(() => {
      setRollNum(Math.floor(Math.random() * 20) + 1);
      count++;
      if (count > 12) {
        clearInterval(interval);
        const first = FANTASY_NAMES[Math.floor(Math.random() * FANTASY_NAMES.length)];
        const last = FANTASY_SURNAMES[Math.floor(Math.random() * FANTASY_SURNAMES.length)];
        setName(`${first} ${last}`);
        setRollNum(20);
        setIsRolling(false);
      }
    }, 80);
  };

  const saveCharacter = () => {
    const newChar: Character = {
      id: crypto.randomUUID(),
      name: name || "Unnamed Traveler",
      race,
      charClass,
      date: new Date().toLocaleDateString()
    };
    
    const newLibrary = [newChar, ...library];
    setLibrary(newLibrary);
    localStorage.setItem('adventure_guide_chars', JSON.stringify(newLibrary));
    setIsComplete(true);
  };

  const deleteCharacter = (id: string) => {
    const newLibrary = library.filter(c => c.id !== id);
    setLibrary(newLibrary);
    localStorage.setItem('adventure_guide_chars', JSON.stringify(newLibrary));
  };

  const resetForm = () => {
    setName('');
    setRace('Human');
    setCharClass('Fighter');
    setStep(1);
    setIsComplete(false);
  };

  const selectedFact = RACE_FACTS.find(f => f.race === race)?.text || "Each race brings unique traits and abilities to your adventure.";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 gap-12">
      {/* Wizard Card */}
      <div className="w-full max-w-2xl bg-card border-2 border-border rounded-3xl overflow-hidden shadow-2xl transition-all">
        
        <div className="h-2 bg-muted flex">
          {[1, 2, 3].map((s) => (
            <div key={s} className={cn("flex-1 transition-all duration-500", step >= s ? "bg-primary" : "bg-transparent")} />
          ))}
        </div>

        <div className="p-8 space-y-8">
          <AnimatePresence mode="wait">
            {!isComplete ? (
              <motion.div key="form-steps">
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-display font-bold text-primary flex items-center gap-2">
                        <PenLine className="w-8 h-8" /> Identity
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
                      <button onClick={handleRollName} disabled={isRolling} className="p-1 hover:scale-110 transition-transform">
                        <D20Face num={rollNum} isRolling={isRolling} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <h2 className="text-3xl font-display font-bold text-primary flex items-center gap-2">
                      <Shield className="w-8 h-8" /> Lineage
                    </h2>
                    <select 
                      value={race} 
                      onChange={(e) => setRace(e.target.value)}
                      className="w-full bg-muted p-4 rounded-xl border-none outline-none ring-2 ring-transparent focus:ring-primary/40 appearance-none text-foreground"
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
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-center py-4">
                    <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h2 className="text-3xl font-display font-bold">The Final Call</h2>
                    <p className="text-muted-foreground">The {race} {charClass} known as <span className="text-foreground font-bold">{name || "Unnamed"}</span> is ready.</p>
                    <div className="bg-muted/50 p-4 rounded-xl text-left border border-border/50">
                      <span className="text-xs font-bold text-muted-foreground block uppercase mb-1">Select Profession</span>
                      <select value={charClass} onChange={(e) => setCharClass(e.target.value)} className="bg-transparent border-none outline-none font-bold w-full text-foreground cursor-pointer">
                        {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-6 py-8">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Wand2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">Character Chronicled!</h2>
                  <p className="text-muted-foreground">Your hero has been stored in your local library.</p>
                </div>
                <Button onClick={resetForm} variant="outline" className="rounded-xl border-primary/20 hover:bg-primary/5">
                  <PlusCircle className="w-4 h-4 mr-2" /> Create Another
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {!isComplete && (
            <div className="flex justify-between pt-6 border-t border-border/50">
              <Button variant="ghost" disabled={step === 1} onClick={() => setStep(s => s - 1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              {step < 3 ? (
                <Button onClick={() => setStep(s => s + 1)} className="rounded-xl px-6">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={saveCharacter} className="bg-primary rounded-xl px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                  Generate & Save <Wand2 className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Library Section */}
      {library.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold flex items-center gap-2 text-foreground/80">
              <User className="w-5 h-5" /> Your Adventurers
            </h3>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">{library.length} saved</span>
          </div>
          
          <div className="grid gap-3">
            <AnimatePresence>
              {library.map((char) => (
                <motion.div 
                  key={char.id} 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group bg-card border border-border p-5 rounded-2xl flex justify-between items-center shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary/60 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{char.name}</h4>
                      <p className="text-sm text-muted-foreground italic">
                        {char.race} {char.charClass} — <span className="text-xs opacity-70">Saved {char.date}</span>
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteCharacter(char.id)} 
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
}
