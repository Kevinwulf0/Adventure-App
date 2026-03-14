import React, { useEffect, useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useCharacters } from '@/hooks/use-characters';
import { Character, calculateModifier } from '@/lib/dnd-engine';
import { Portrait } from '@/components/wizard/Portrait';
import { StatBlock } from '@/components/wizard/StatBlock';
import { Button } from '@/components/ui/button';
import { Copy, ArrowLeft, Trash2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function Sheet() {
  const [, params] = useRoute('/sheet/:id');
  const { getCharacter, deleteCharacter } = useCharacters();
  const [char, setChar] = useState<Character | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (params?.id) {
      const found = getCharacter(params.id);
      if (found) setChar(found);
    }
  }, [params?.id, getCharacter]);

  if (!char) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#fdf6e3]">
        <h2 className="text-2xl font-display text-amber-900 mb-4 tracking-widest uppercase">Scroll Not Found</h2>
        <Link href="/">
          <Button variant="outline" className="border-amber-900 text-amber-900">Return to Forge</Button>
        </Link>
      </div>
    );
  }

  const handleExport = async () => {
    const text = `
CHARACTER RECORD: ${char.name}
----------------------------------------
Lineage: ${char.race}
Path: ${char.charClass}
${char.powerLevel ? `Power Level: ${char.powerLevel}\n` : ''}
ATTRIBUTES
STR: ${char.stats.str} (${calculateModifier(char.stats.str) >= 0 ? '+' : ''}${calculateModifier(char.stats.str)})
DEX: ${char.stats.dex} (${calculateModifier(char.stats.dex) >= 0 ? '+' : ''}${calculateModifier(char.stats.dex)})
CON: ${char.stats.con} (${calculateModifier(char.stats.con) >= 0 ? '+' : ''}${calculateModifier(char.stats.con)})
INT: ${char.stats.int} (${calculateModifier(char.stats.int) >= 0 ? '+' : ''}${calculateModifier(char.stats.int)})
WIS: ${char.stats.wis} (${calculateModifier(char.stats.wis) >= 0 ? '+' : ''}${calculateModifier(char.stats.wis)})
CHA: ${char.stats.cha} (${calculateModifier(char.stats.cha) >= 0 ? '+' : ''}${calculateModifier(char.stats.cha)})

TALE
${char.backstory}
    `.trim();

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Exported to Clipboard",
        description: "The scrolls have been copied for sharing.",
        duration: 3000,
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast({
        title: "Export Failed",
        description: "Could not copy text.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    deleteCharacter(char.id);
    window.location.href = '/roster';
  };

  const statEntries = [
    { label: 'STR', val: char.stats.str },
    { label: 'DEX', val: char.stats.dex },
    { label: 'CON', val: char.stats.con },
    { label: 'INT', val: char.stats.int },
    { label: 'WIS', val: char.stats.wis },
    { label: 'CHA', val: char.stats.cha },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col w-full pb-20 bg-[#fdf6e3] min-h-screen" // Added parchment background color
    >
      {/* Top Action Bar */}
      <div className="flex justify-between items-center p-4">
        <Link href="/roster">
          <Button variant="ghost" size="icon" className="rounded-full bg-amber-100/50 border border-amber-900/20 text-amber-900">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleExport} className="rounded-full bg-amber-100/50 border border-amber-900/20 text-amber-900">
            {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete} className="rounded-full bg-red-100/50 border border-red-900/30 text-red-900 hover:bg-red-200">
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="px-6 pb-8 flex flex-col items-center">
        {/* The Portrait with a thematic border */}
        <div className="p-2 border-4 border-amber-900 bg-white shadow-xl rotate-1 mt-2 mb-8">
          <Portrait src={char.portraitUrl} alt={char.name} className="w-48 h-48 md:w-64 md:h-64 object-cover" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-display font-bold text-amber-950 text-center mb-2 uppercase tracking-tighter">
          {char.name}
        </h2>
        
        <div className="flex items-center space-x-3 mb-10">
          <div className="px-4 py-1.5 rounded-sm border-2 border-amber-900 bg-amber-200/30 text-amber-950 font-display font-bold text-sm tracking-widest uppercase shadow-sm">
            {char.race}
          </div>
          <span className="text-amber-900/50 text-xl font-serif">⚔️</span>
          <div className="px-4 py-1.5 rounded-sm border-2 border-amber-900 bg-amber-200/30 text-amber-950 font-display font-bold text-sm tracking-widest uppercase shadow-sm">
            {char.charClass}
          </div>
        </div>

        {/* Stats Grid - Using the "Body" logic from earlier */}
        <div className="w-full relative px-2 mb-12 max-w-2xl">
          <div className="absolute inset-0 bg-[#fff9eb] border-2 border-amber-900/30 rounded-lg -z-10 shadow-inner" />
          <h3 className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#fdf6e3] px-4 text-sm font-display font-bold text-amber-900 tracking-widest uppercase border border-amber-900/20 rounded-full">Attributes</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 pt-8 pb-6 px-4">
            {statEntries.map(s => (
              <StatBlock 
                key={s.label}
                label={s.label} 
                score={s.val} 
                modifier={calculateModifier(s.val)} 
              />
            ))}
          </div>
        </div>

        {/* Backstory - Designed to look like an old scroll */}
        <div className="w-full max-w-2xl text-left space-y-6 bg-[#fff9eb] border-2 border-amber-900/20 rounded-lg p-6 md:p-8 shadow-md relative">
          <div className="absolute top-4 right-4 text-6xl text-amber-900/10 font-serif leading-none opacity-50 select-none">📜</div>
          <h3 className="text-2xl font-display text-amber-950 border-b-2 border-amber-900/20 pb-2 mb-6 uppercase tracking-tight">The Tale</h3>
          {char.backstory.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-stone-800 leading-relaxed text-lg font-serif">
              {i === 0 && <span className="float-left text-5xl font-display text-amber-900 leading-[0.8] mr-2 mt-1">{paragraph.charAt(0)}</span>}
              {i === 0 ? paragraph.slice(1) : paragraph}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
