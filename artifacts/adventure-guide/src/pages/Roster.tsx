import React from 'react';
import { Link } from 'wouter';
import { useCharacters } from '@/hooks/use-characters';
import { Button } from '@/components/ui/button';
import { ScrollText, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Roster() {
  const { characters, isLoaded } = useCharacters();

  if (!isLoaded) return <div className="p-8 text-center text-primary">Loading...</div>;

  return (
    <div className="flex-1 flex flex-col w-full p-6 pb-24">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary text-glow mb-2">
          The Roster
        </h2>
        <p className="text-muted-foreground tracking-wide uppercase text-sm">
          Saved Heroes & Villains
        </p>
      </div>

      {characters.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="w-24 h-24 rounded-full bg-card border-2 border-primary/20 flex items-center justify-center mb-6">
            <ScrollText className="w-10 h-10 text-primary/50" />
          </div>
          <h3 className="text-xl font-display text-foreground mb-2">The Archives are Empty</h3>
          <p className="text-muted-foreground mb-8">No tales have been written yet. Return to the forge to create your first character.</p>
          <Link href="/">
            <Button className="bg-primary/20 text-primary border border-primary/50 hover:bg-primary hover:text-primary-foreground">
              <Plus className="w-5 h-5 mr-2" /> Forge New Character
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {characters.map((char, i) => (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/sheet/${char.id}`}>
                <div className="w-full flex items-center p-3 bg-card border border-primary/20 rounded-2xl hover-elevate cursor-pointer group">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-primary/40 mr-4 relative">
                    <img src={char.portraitUrl} alt={char.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-display font-bold text-lg text-primary truncate text-glow group-hover:text-accent transition-colors">
                      {char.name}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate font-serif">
                      {char.race} {char.charClass}
                      {char.mode === 'npc' && <span className="text-accent ml-2 text-xs uppercase tracking-wider">[{char.powerLevel}]</span>}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
