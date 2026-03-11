export type CharacterMode = 'hero' | 'npc';
export type PowerLevel = 'Commoner' | 'Elite' | 'Legendary';

export interface Stats {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface Character {
  id: string;
  mode: CharacterMode;
  name: string;
  race: string;
  charClass: string;
  personality: string;
  powerLevel?: PowerLevel;
  stats: Stats;
  backstory: string;
  portraitUrl: string;
  createdAt: number;
}

export function calculateModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

const CLASS_STAT_PRIORITIES: Record<string, keyof Stats[]> = {
  Barbarian: ['str', 'con', 'dex', 'wis', 'cha', 'int'],
  Bard: ['cha', 'dex', 'con', 'int', 'wis', 'str'],
  Cleric: ['wis', 'con', 'str', 'cha', 'int', 'dex'],
  Druid: ['wis', 'con', 'dex', 'int', 'cha', 'str'],
  Fighter: ['str', 'con', 'dex', 'wis', 'int', 'cha'],
  Monk: ['dex', 'wis', 'con', 'str', 'int', 'cha'],
  Paladin: ['str', 'cha', 'con', 'wis', 'int', 'dex'],
  Ranger: ['dex', 'wis', 'con', 'str', 'int', 'cha'],
  Rogue: ['dex', 'int', 'con', 'cha', 'wis', 'str'],
  Sorcerer: ['cha', 'con', 'dex', 'wis', 'int', 'str'],
  Warlock: ['cha', 'con', 'dex', 'wis', 'int', 'str'],
  Wizard: ['int', 'con', 'dex', 'wis', 'cha', 'str'],
  Other: ['str', 'dex', 'con', 'int', 'wis', 'cha'],
};

export function generateStats(charClass: string, powerLevel?: PowerLevel): Stats {
  // Base standard array
  let baseScores = [15, 14, 13, 12, 10, 8];
  
  // Adjust based on NPC power level
  if (powerLevel === 'Commoner') {
    baseScores = [12, 11, 10, 10, 9, 8];
  } else if (powerLevel === 'Elite') {
    baseScores = [18, 16, 14, 14, 12, 10];
  } else if (powerLevel === 'Legendary') {
    baseScores = [22, 20, 18, 16, 14, 12];
  }

  const priorities = CLASS_STAT_PRIORITIES[charClass] || CLASS_STAT_PRIORITIES['Other'];
  
  const stats: Partial<Stats> = {};
  
  // Assign scores based on class priority
  priorities.forEach((statName, index) => {
    // Add a tiny bit of randomness to make it feel organic (+0 to +2)
    const randomBump = Math.floor(Math.random() * 3);
    let finalScore = baseScores[index] + randomBump;
    
    // Cap at 20 for heroes, 24 for legendary NPCs
    const cap = powerLevel === 'Legendary' ? 24 : 20;
    if (finalScore > cap) finalScore = cap;
    
    stats[statName] = finalScore;
  });

  return stats as Stats;
}

export function generateBackstory(name: string, race: string, charClass: string, personality: string): string {
  const p1 = `Born to a lineage of ${race}s, ${name}'s path was never destined to be ordinary. Even in their youth, the calling of the ${charClass} echoed in their soul, driving them away from the safety of hearth and home and into the unforgiving embrace of the wild world. They learned early that survival requires more than just steel or spells; it demands an unbreakable will.`;
  
  const p2 = `The trials they faced tempered them like a blade in the forge. Marked by their distinct nature—${personality.toLowerCase()}—they often found themselves at odds with both friend and foe. A fateful encounter in a shadowed ruin left a lasting mark on their spirit, a grim reminder of the sacrifices required by their chosen profession.`;
  
  const p3 = `Now, ${name} walks a lonely road, driven by an unyielding purpose. Whether seeking a long-lost artifact, vengeance for a fallen comrade, or simply the next great challenge, they stand ready. The world is vast and dangerous, but so is the fire that burns within them.`;
  
  return `${p1}\n\n${p2}\n\n${p3}`;
}

export function generatePortraitUrl(race: string, charClass: string, personality: string): string {
  const seed = Math.floor(Math.random() * 1000000);
  const prompt = `dark fantasy rpg portrait painting of a ${race} ${charClass}, ${personality}, highly detailed, concept art, atmospheric lighting, gothic`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true&seed=${seed}`;
}
