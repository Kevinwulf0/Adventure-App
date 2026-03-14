import React from 'react';
import { calculateModifier } from '../lib/stats-logic';

export const CharacterCard = ({ name, race, characterClass, stats, imageUrl }) => {
  return (
    // The main container with a "parchment" background color
    <div className="max-w-sm rounded-lg border-4 border-amber-900 bg-[#fdf6e3] p-6 shadow-2xl font-serif">
      
      {/* Header Area */}
      <div className="border-b-2 border-amber-900 mb-4 pb-2">
        <h2 className="text-3xl font-bold text-amber-950 uppercase">{name}</h2>
        <p className="text-amber-800 italic">{race} {characterClass}</p>
      </div>

      {/* Image and Stats Grid */}
      <div className="flex gap-4">
        <img src={imageUrl} alt={name} className="w-32 h-32 border-2 border-amber-900 rounded-md object-cover" />
        
        <div className="grid grid-cols-2 gap-2 w-full">
          {Object.entries(stats).map(([statName, value]) => (
            <div key={statName} className="bg-amber-100 p-2 border border-amber-200 text-center rounded">
              <p className="text-[10px] font-bold uppercase text-amber-900">{statName}</p>
              <p className="text-lg font-bold">{value}</p>
              <p className="text-xs text-amber-700">{calculateModifier(value as number)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
