
import React from 'react';
import { Character } from '../types';
import { UserIcon, LightBulbIcon } from './IconComponents';

interface MysteryNoteProps {
  character: Character | null;
  clues: string[];
}

const MysteryNote: React.FC<MysteryNoteProps> = ({ character, clues }) => {
  return (
    <div className="bg-yellow-50/80 backdrop-blur-sm shadow-lg rounded-lg p-5 border-2 border-dashed border-amber-300">
      <h3 className="text-xl font-bold text-amber-900 font-serif border-b-2 border-amber-200 pb-2 mb-4">탐정 수첩</h3>
      
      {character && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <UserIcon className="w-5 h-5 text-amber-800" />
            <h4 className="font-bold text-gray-700">탐정: {character.name}</h4>
          </div>
          <div className="flex items-start gap-3 text-sm text-gray-600 bg-amber-100/50 p-2 rounded-md">
            <LightBulbIcon className="w-4 h-4 mt-0.5 text-amber-700 flex-shrink-0" />
            <span>특징: {character.trait}</span>
          </div>
        </div>
      )}

      <div>
        <h4 className="font-bold text-gray-700 mb-3">수집한 단서</h4>
        {clues.length === 0 ? (
          <p className="text-sm text-gray-500 italic">아직 발견된 단서가 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {clues.map((clue, index) => (
              <li key={index} className="text-gray-800 bg-white/70 p-2 rounded-md border-l-4 border-amber-400 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                {clue}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MysteryNote;
