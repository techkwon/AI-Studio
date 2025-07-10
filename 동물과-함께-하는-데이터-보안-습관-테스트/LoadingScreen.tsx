
import React from 'react';

const MagnifyingGlassIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 md:w-20 md:h-20 text-pink-300" // Softer pink
    style={{animation: 'magnifyPulseCute 2.2s ease-in-out infinite'}}
  >
    <style>{`
      @keyframes magnifyPulseCute {
        0%, 100% { transform: scale(1) rotate(-2deg); opacity: 0.7; }
        50% { transform: scale(1.18) rotate(3deg); opacity: 1; } /* More playful pulse */
      }
    `}</style>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const AnimalSilhouette: React.FC<{ char: string; delay: string; duration: string; index: number; total: number }> = ({ char, delay, duration, index, total }) => {
    const startX = index % 2 === 0 ? '-20%' : '120%'; 
    const endX = index % 2 === 0 ? '120%' : '-20%';
    const startY = `${(index / total) * 65 + 10}%`; // Adjusted Y spread
    const midYOffset = `${(Math.random() - 0.5) * 60}%`; 
    const randomRotationStart = (Math.random() - 0.5) * 40;
    const randomRotationEnd = (Math.random() - 0.5) * 40;

    return (
    <div 
        className="absolute text-4xl md:text-5xl opacity-0 text-white/50" // Softer opacity
        style={{
            animation: `cuteAnimalSlide ${duration} ease-in-out ${delay} infinite`,
            top: startY,
            left: startX, 
        }}
    >
        {char}
        <style>{`
            @keyframes cuteAnimalSlide {
                0% { transform: translate(0, 0) rotate(${randomRotationStart}deg) scale(0.7); opacity: 0; }
                15% { opacity: 0.6; transform: translate(calc((${endX} - ${startX}) * 0.15), ${midYOffset} * 0.3) rotate(${randomRotationStart * 0.5}deg) scale(0.9); }
                50% { transform: translate(calc((${endX} - ${startX}) * 0.5), ${midYOffset}) rotate(0deg) scale(1.1); } /* Mid-point bounce */
                85% { opacity: 0.6; transform: translate(calc((${endX} - ${startX}) * 0.85), ${midYOffset} * 0.7) rotate(${randomRotationEnd * 0.5}deg) scale(0.9); }
                100% { transform: translate(calc(${endX} - ${startX}), 0) rotate(${randomRotationEnd}deg) scale(0.7); opacity: 0; }
            }
        `}</style>
    </div>
    );
};


const LoadingScreen: React.FC = () => {
  const animals = ["🦊", "🐻‍❄️", "🐹", "🦉", "🦦", "🦎", "🐶", "🐺", "🦜", "🍓"]; // Added a cute strawberry for fun
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 text-white relative overflow-hidden">
      {/* Animated Dot Grid Pattern - Cuter */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="animatedDotPattern" width="25" height="25" patternUnits="userSpaceOnUse">
                <circle cx="2.5" cy="2.5" r="1.2" fill="rgba(255,255,255,0.4)" />
            </pattern>
            <pattern id="animatedDotGrid" width="100" height="100" patternUnits="userSpaceOnUse" 
                     style={{animation: 'dotGridFlow 8s linear infinite'}}>
                <rect width="100" height="100" fill="url(#animatedDotPattern)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#animatedDotGrid)" />
        </svg>
      </div>
      
      <div className="relative w-full h-64 md:h-80 overflow-hidden z-10 mb-4">
        {animals.map((animal, idx) => (
            <AnimalSilhouette 
                key={idx} 
                char={animal} 
                delay={`${idx * 0.3}s`} 
                duration={`${Math.random() * 2 + 4}s`} 
                index={idx}
                total={animals.length}
            />
        ))}
      </div>
      <div className="relative z-10 text-center">
        <MagnifyingGlassIcon />
        <h2 className="text-2xl sm:text-3xl font-semibold mt-6 mb-2 text-glow animate-text-char-by-char">두근두근... 당신의 보안 DNA 분석 중!</h2>
        <p className="text-md sm:text-lg text-slate-200 opacity-90 animate-text-char-by-char" style={{animationDelay: '0.6s'}}>결과가 거의 다 준비됐어요! ✨</p>
      </div>
    </div>
  );
};

export default LoadingScreen;