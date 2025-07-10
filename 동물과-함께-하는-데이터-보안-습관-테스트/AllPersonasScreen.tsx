
import React from 'react';
import { AnimalPersona } from '../types';
import StyledButton from './StyledButton';

interface AllPersonasScreenProps {
  personas: AnimalPersona[];
  onGoHome: () => void;
}

const PersonaCard: React.FC<{ persona: AnimalPersona, animationDelay: string }> = ({ persona, animationDelay }) => {
  return (
    <div
      className="glass-card p-4 sm:p-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] flex flex-col items-center text-center animate-slide-up-fade-in opacity-0"
      style={{ animationDelay }}
    >
      <img
        src={persona.imageUrl}
        alt={`${persona.name} 이미지`}
        className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-full border-2 border-white/30 shadow-lg mb-3"
      />
      <h3 className="text-lg sm:text-xl font-semibold text-pink-300 mb-1 text-glow">{persona.name}</h3>
      <p className="text-xs sm:text-sm text-slate-200 px-1 italic">&ldquo;{persona.oneLiner}&rdquo;</p>
    </div>
  );
};

const AllPersonasScreen: React.FC<AllPersonasScreenProps> = ({ personas, onGoHome }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative">
      <div className="w-full max-w-4xl animate-slide-up-fade-in">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-10 text-glow text-center animate-text-char-by-char">
          ✨ 다양한 데이터 보안 동물 유형들 ✨
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {personas.map((persona, index) => (
            <PersonaCard 
              key={persona.key} 
              persona={persona} 
              animationDelay={`${index * 0.07}s`}
            />
          ))}
        </div>

        <div className="text-center">
          <StyledButton
            onClick={onGoHome}
            variant="primary"
            className="text-lg sm:text-xl px-8 sm:px-10 py-3 sm:py-4"
            aria-label="홈으로 가기"
          >
            🏠 홈으로 가기
          </StyledButton>
        </div>
      </div>
      <p className="text-xs text-slate-400/70 mt-10 text-center px-4 animate-fadeIn" style={{animationDelay: `${personas.length * 0.07 + 0.5}s`}}>
        각 동물 유형은 데이터 보안에 대한 다양한 접근 방식을 나타냅니다.<br/>자신의 성향을 이해하고 발전시키는 데 도움이 되길 바랍니다!
      </p>
    </div>
  );
};

export default AllPersonasScreen;
