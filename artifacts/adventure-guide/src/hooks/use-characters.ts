import { useState, useEffect } from 'react';
import { Character } from '@/lib/dnd-engine';

const STORAGE_KEY = 'adventure-guide-characters';

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCharacters(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored characters", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveCharacter = (character: Character) => {
    const updated = [character, ...characters.filter(c => c.id !== character.id)];
    setCharacters(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteCharacter = (id: string) => {
    const updated = characters.filter(c => c.id !== id);
    setCharacters(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const getCharacter = (id: string) => {
    return characters.find(c => c.id === id);
  };

  return {
    characters,
    isLoaded,
    saveCharacter,
    deleteCharacter,
    getCharacter
  };
}
