
import React from 'react';
import StyledButton from './StyledButton';

interface SplashScreenProps {
  onStart: () => void;
}

const PawPrint: React.FC<{ delay: string; top?: string; left?: string; right?: string; bottom?: string; size?: string; rotation?: string }> = ({ delay, top, left, right, bottom, size = "text-3xl md:text-4xl", rotation = "rotate-0" }) => (
  <span
    className={`absolute ${size} text-pink-300/20 animate-paw ${rotation}`} // Cuter color & opacity
    style={{ animationDelay: delay, top, left, right, bottom, filter: 'blur(0.5px)' }}
  >
    🐾
  </span>
);

const SubtleGlowShape: React.FC<{ 
  delay: string; 
  duration: string; 
  top?: string; 
  left?: string; 
  right?: string;
  bottom?: string;
  size: string; 
  color: string; 
  shape: 'circle' | 'square'; 
}> = 
  ({ delay, duration, top, left, right, bottom, size, color, shape }) => (
  <div
    className={`absolute opacity-25 animate-float ${shape === 'circle' ? 'rounded-full' : 'rounded-2xl'} ${color}`} // Softer opacity, more rounded square
    style={{
      width: size,
      height: size,
      top,
      left,
      right,
      bottom,
      animationDelay: delay,
      animationDuration: duration,
      filter: 'blur(12px)', 
      zIndex: 0
    }}
  />
);


const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background elements */}
      <PawPrint delay="0s" top="12%" left="18%" rotation="rotate-[-20deg]" />
      <PawPrint delay="0.35s" top="22%" right="12%" size="text-2xl md:text-3xl" rotation="rotate-[15deg]"/>
      <PawPrint delay="0.7s" bottom="18%" left="28%" rotation="rotate-[8deg]"/>
      <PawPrint delay="1.05s" bottom="28%" right="22%" size="text-xl md:text-2xl" rotation="rotate-[-25deg]"/>
      <PawPrint delay="1.4s" top="38%" left="8%" rotation="rotate-[30deg]"/>
      <PawPrint delay="1.75s" bottom="8%" right="8%" size="text-2xl md:text-3xl" rotation="rotate-[-10deg]"/>

      <SubtleGlowShape delay="0.2s" duration="11s" top="10%" left="8%" size="70px" color="bg-pink-400/30" shape="circle" />
      <SubtleGlowShape delay="2.2s" duration="13s" top="65%" right="12%" size="110px" color="bg-purple-400/30" shape="square" />
      <SubtleGlowShape delay="4.2s" duration="10s" top="70%" left="18%" size="50px" color="bg-indigo-400/30" shape="circle" />
      <SubtleGlowShape delay="1.2s" duration="16s" top="8%" right="28%" size="90px" color="bg-sky-400/20" shape="square" />


      <div className="relative z-10 glass-card p-6 sm:p-8 md:p-12 rounded-2xl shadow-2xl max-w-lg md:max-w-2xl animate-slide-up-fade-in animate-float">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-glow animate-text-char-by-char">
          나의 데이터 보안 습관은 어떤 동물과 닮았을까?
        </h1>
        <p className="text-md sm:text-lg md:text-xl mb-6 md:mb-8 text-slate-100 animate-text-char-by-char" style={{ animationDelay: '0.4s'}}>
          교사들을 위한 데이터 보안 성향 테스트!
          <br />
          몇 가지 질문을 통해 당신의 보안 DNA를 확인해보세요.
        </p>
        <StyledButton 
            onClick={onStart} 
            variant="primary" 
            className="text-lg sm:text-xl px-8 sm:px-10 py-3 sm:py-4"
            aria-label="테스트 시작하기"
        >
          테스트 시작! 🚀
        </StyledButton>
        <p className="text-xs sm:text-sm mt-6 md:mt-8 text-slate-300 opacity-80">
          본 테스트는 어떠한 개인정보도 수집하거나 저장하지 않습니다. 안심하고 참여하세요.
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;