export const generatePortraitUrl = (description: string): string => {
  const baseUrl = "https://image.pollinations.ai/prompt/";
  
  // We add "flavor text" to the prompt to make sure the AI stays on-theme
  const flavorText = "hyperrealistic-dnd-character-portrait-on-old-yellowed-parchment";
  
  // Clean up the text so it's URL-safe
  const cleanDescription = encodeURIComponent(`${description} ${flavorText}`);
  
  return `${baseUrl}${cleanDescription}?width=600&height=600&nologo=true`;
};
