// This function takes a raw score (like 15) and returns the D&D modifier (like +2)
export const calculateModifier = (score: number): string => {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

// This function simulates rolling 4 six-sided dice and dropping the lowest one
export const rollAbilityScore = (): number => {
  const rolls = [0, 0, 0, 0].map(() => Math.floor(Math.random() * 6) + 1);
  rolls.sort((a, b) => a - b); // Sort smallest to largest
  return rolls[1] + rolls[2] + rolls[3]; // Sum the top three
};
