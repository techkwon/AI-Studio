
import React, { useState } from 'react';
import { Character } from '../types';
import { SCENARIOS, TRAITS } from '../constants';
import LoadingSpinner from './LoadingSpinner';

interface CharacterCreationScreenProps {
  onStart: (character: Character, scenario: string) => void;
  isLoading: boolean;
}

const CharacterCreationScreen: React.FC<CharacterCreationScreenProps> = ({ onStart, isLoading }) => {
  const [name, setName] = useState('');
  const [trait, setTrait] = useState(TRAITS[0]);
  const [scenario, setScenario] = useState(SCENARIOS[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && trait && scenario) {
      onStart({ name: name.trim(), trait }, scenario);
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm shadow-xl rounded-lg p-6 md:p-10 max-w-2xl mx-auto border border-stone-200">
      <h2 className="text-2xl font-bold text-center text-amber-900 font-serif mb-6">탐정 정보 입력</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">탐정 이름:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 transition bg-white text-gray-900 placeholder:text-gray-400"
            placeholder="이름을 입력하세요"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">특징 선택:</label>
          <div className="space-y-2">
            {TRAITS.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTrait(t)}
                className={`w-full text-left px-4 py-3 border rounded-md transition duration-200 ${trait === t ? 'bg-amber-600 text-white border-amber-600 ring-2 ring-amber-300' : 'bg-white hover:bg-amber-50 border-gray-300'}`}
                disabled={isLoading}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">시나리오 선택:</label>
          <div className="space-y-2">
             {SCENARIOS.map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => setScenario(s.id)}
                className={`w-full text-left px-4 py-3 border rounded-md transition duration-200 ${scenario === s.id ? 'bg-stone-700 text-white border-stone-700 ring-2 ring-stone-300' : 'bg-white hover:bg-stone-100 border-gray-300'}`}
                disabled={isLoading}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !name.trim()}
          className="w-full bg-amber-800 text-white font-bold py-3 px-4 rounded-md hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center gap-2"
        >
          {isLoading && <LoadingSpinner />}
          {isLoading ? '이야기 생성 중...' : '모험 시작하기'}
        </button>
      </form>
    </div>
  );
};

export default CharacterCreationScreen;
