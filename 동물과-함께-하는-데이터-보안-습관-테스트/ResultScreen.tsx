
import React, { useState, useEffect, useRef } from 'react';
import { AnimalPersona } from '../types';
import { ANIMAL_PERSONAS } from '../constants';
import StyledButton from './StyledButton';

interface ResultScreenProps {
  animalPersona: AnimalPersona;
  onRestart: () => void;
  onShowAllPersonas: () => void; // New prop
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; controls: string; id: string }> = ({ active, onClick, children, controls, id }) => (
  <StyledButton
    variant="tab"
    onClick={onClick}
    role="tab"
    aria-selected={active}
    aria-controls={controls}
    id={id}
    className="flex-grow sm:flex-grow-0 py-2.5 sm:py-3"
  >
    {children}
  </StyledButton>
);

const ShareIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
        <path d="M13 4.5a2.5 2.5 0 1 1 .702 4.242l-4.135 2.412a2.502 2.502 0 0 1 0 1.692l4.135 2.412a2.5 2.5 0 1 1-.285.808A2.508 2.508 0 0 1 13 15.5a2.5 2.5 0 0 1-2.003-1.01l-4.135-2.412a2.5 2.5 0 1 1 0-4.156l4.135-2.412A2.5 2.5 0 0 1 13 4.5Z" />
    </svg>
);

const PaletteIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M6 3.75A2.25 2.25 0 0 1 8.25 1.5h3.5A2.25 2.25 0 0 1 14 3.75v.443c.57.123 1.07.348 1.5.642V2.812A2.25 2.25 0 0 0 13.25.563H6.75A2.25 2.25 0 0 0 4.5 2.812V10.5A2.25 2.25 0 0 0 6.75 12.75H9v1.018a3.738 3.738 0 0 1-.624.202 3.75 3.75 0 0 1-4.75-4.75V3.75Zm9.75 2.692A2.216 2.216 0 0 0 14 6.375v.193a2.216 2.216 0 0 0 1.75.068V6.442ZM11.5 14.25a.75.75 0 0 0 0 1.5h2.002a3.736 3.736 0 0 1 .495-1.5H11.5Zm.28-3.718a3.752 3.752 0 0 1 4.412-2.316 2.216 2.216 0 0 0-3.346-2.032A3.752 3.752 0 0 1 9.998 8.16a.75.75 0 0 0 .75.75h.734c.102.484.282.934.516 1.342ZM5.25 10.5A2.25 2.25 0 0 1 3 8.25V6.75a2.25 2.25 0 0 1 2.25-2.25H10.5a.75.75 0 0 0 0-1.5H5.25A3.75 3.75 0 0 0 1.5 6.75v1.5A3.75 3.75 0 0 0 5.25 12h.05a3.738 3.738 0 0 1 .2-1.5H5.25Z" clipRule="evenodd" />
    <path d="M11.66 11.84a3.748 3.748 0 0 1 3.512 4.908A2.216 2.216 0 0 0 17 16.682v-.193a2.216 2.216 0 0 0-1.75-.068 3.748 3.748 0 0 1-3.59-4.582Z" />
  </svg>
);


const ResultScreen: React.FC<ResultScreenProps> = ({ animalPersona, onRestart, onShowAllPersonas }) => {
  const [activeTab, setActiveTab] = useState<'tendency' | 'strengths' | 'weaknesses'>('tendency');
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const resultContainerRef = useRef<HTMLDivElement>(null);
  const [tabContentKey, setTabContentKey] = useState(0);

  const fantasticDuo = ANIMAL_PERSONAS[animalPersona.fantasticDuo.key];
  const nightmarePartner = ANIMAL_PERSONAS[animalPersona.nightmarePartner.key];

  const handleShare = async () => {
    const appUrl = window.location.origin;
    const resultText = `💖 나의 데이터 보안 타입은 [${animalPersona.name}]! 💖\n"${animalPersona.oneLiner}"\n내 타입이 궁금하다면? ${appUrl} 에서 테스트해봐! ✨ #데이터보안DNA테스트`;
    try {
      await navigator.clipboard.writeText(resultText);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2800);
    } catch (err) {
      alert('결과 복사에 실패했어요 😥 수동으로 복사해주세요!');
      console.error('Failed to copy text: ', err);
    }
  };

  useEffect(() => {
    if (!resultContainerRef.current) return;
    const container = resultContainerRef.current;

    const fireworksToLaunch = 6 + Math.floor(Math.random() * 4);

    for (let i = 0; i < fireworksToLaunch; i++) {
        setTimeout(() => {
            const particleContainer = document.createElement('div');
            particleContainer.className = 'firework-particle-container';
            particleContainer.style.left = `${Math.random() * 70 + 15}%`;
            particleContainer.style.top = `${Math.random() * 60 + 20}%`;
            particleContainer.style.animationDelay = `${Math.random() * 0.4}s`;

            const numParticles = 18 + Math.floor(Math.random() * 12);
            const colors = ['#FFC0CB', '#FFB6C1', '#ADD8E6', '#98FB98', '#FFDEAD', '#E6E6FA', '#dda0dd'];

            for (let j = 0; j < numParticles; j++) {
                const particle = document.createElement('div');
                particle.className = 'firework-particle';
                const angle = Math.random() * 360;
                const distance = Math.random() * 60 + 35;
                particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                particle.style.transform = `rotate(${angle}deg) translateX(${distance}px) scale(${Math.random() * 0.6 + 0.6})`;
                particle.style.animationDelay = `${0.5 + Math.random() * 0.35}s`;
                particleContainer.appendChild(particle);
            }
            container.prepend(particleContainer);
            setTimeout(() => particleContainer.remove(), 2200);
        }, i * 180);
    }

  }, [animalPersona]);

  const handleTabChange = (tab: 'tendency' | 'strengths' | 'weaknesses') => {
    setActiveTab(tab);
    setTabContentKey(prev => prev + 1);
  }

  const TabContent: React.FC<{id: string, labelledby: string, children: React.ReactNode, visible: boolean}> =
    ({id, labelledby, children, visible}) => {
      if (!visible) {
        return null;
      }
      return (
        <div
            id={id} role="tabpanel" tabIndex={0} aria-labelledby={labelledby}
            className="text-sm sm:text-base leading-relaxed animate-fadeIn"
            key={tabContentKey}
        >
            {children}
        </div>
      );
    };


  return (
    <div ref={resultContainerRef} id="result-container" className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 relative overflow-hidden">
      <div
        className="relative z-10 glass-card p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-lg md:max-w-2xl my-8 opacity-0 animate-slide-up-fade-in"
        style={{ animationDelay: '0.15s' }}
      >
        <div className="text-center mb-4 md:mb-6">
          <div className="mx-auto mb-3 md:mb-4 w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full p-1.5 bg-gradient-to-br from-pink-400/70 via-purple-400/70 to-indigo-400/70 shadow-xl animate-fadeIn" style={{animationDelay: '0.4s', opacity: 0}}>
            <img
              src={animalPersona.imageUrl}
              alt={`${animalPersona.name} 이미지`}
              className="w-full h-full object-cover rounded-full border-4 border-slate-800/50 shadow-lg transform transition-transform duration-500 ease-out "
              style={{animation: 'subtlePulseGlow 3.5s infinite ease-in-out, fadeIn 1s ease-out 0.6s forwards', transform: 'scale(0.85)', opacity: 0, animationFillMode: 'forwards'}}
            />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300 text-glow animate-text-char-by-char" style={{animationDelay: '0.8s'}}>{animalPersona.name}</h2>
          <p className="text-md sm:text-lg md:text-xl italic mt-1.5 text-slate-100 animate-text-char-by-char" style={{animationDelay: '1.1s'}}>&ldquo;{animalPersona.oneLiner}&rdquo;</p>
        </div>

        <div className="mb-5 md:mb-6" role="tablist" aria-label="결과 상세 정보">
          <div className="flex border-b-2 border-white/10 mb-1 space-x-1 justify-around sm:justify-start">
            <TabButton id="tab-tendency" active={activeTab === 'tendency'} onClick={() => handleTabChange('tendency')} controls="panel-tendency">나의 성향</TabButton>
            <TabButton id="tab-strengths" active={activeTab === 'strengths'} onClick={() => handleTabChange('strengths')} controls="panel-strengths">강점</TabButton>
            <TabButton id="tab-weaknesses" active={activeTab === 'weaknesses'} onClick={() => handleTabChange('weaknesses')} controls="panel-weaknesses">주의할 점 & 팁</TabButton>
          </div>
          <div className="p-3.5 sm:p-4 bg-slate-800/60 rounded-b-lg overflow-y-auto text-slate-100 glass-card-soft shadow-inner" style={{minHeight: '120px'}}> {/* Added minHeight */}
            <TabContent id="panel-tendency" labelledby="tab-tendency" visible={activeTab === 'tendency'}>{animalPersona.description}</TabContent>
            <TabContent id="panel-strengths" labelledby="tab-strengths" visible={activeTab === 'strengths'}>
              <ul className="list-disc list-inside space-y-2">
                {animalPersona.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </TabContent>
            <TabContent id="panel-weaknesses" labelledby="tab-weaknesses" visible={activeTab === 'weaknesses'}>
              <ul className="list-disc list-inside space-y-2">
                {animalPersona.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </TabContent>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 mb-6 md:mb-8 text-sm sm:text-base">
          <div className="bg-green-600/60 border border-green-400/70 p-3.5 sm:p-4 rounded-xl shadow-lg glass-card-soft hover:shadow-xl hover:scale-[1.03] transition-all duration-300">
            <div className="flex items-center gap-3">
              <img src={fantasticDuo.imageUrl} alt={`${fantasticDuo.name} 이미지`} className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-full border-2 border-green-300/60 shadow-md flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-md sm:text-lg text-green-200 animate-text-char-by-char" style={{animationDelay: '1.4s'}}>🤝 환상의 짝꿍: {fantasticDuo.name}</h4>
                <p className="text-slate-100 text-xs sm:text-sm mt-1">{animalPersona.fantasticDuo.reason}</p>
              </div>
            </div>
          </div>
          <div className="bg-red-600/60 border border-red-400/70 p-3.5 sm:p-4 rounded-xl shadow-lg glass-card-soft hover:shadow-xl hover:scale-[1.03] transition-all duration-300">
             <div className="flex items-center gap-3">
              <img src={nightmarePartner.imageUrl} alt={`${nightmarePartner.name} 이미지`} className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-full border-2 border-red-300/60 shadow-md flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-md sm:text-lg text-red-200 animate-text-char-by-char" style={{animationDelay: '1.6s'}}>🤔 환장의 짝꿍: {nightmarePartner.name}</h4>
                <p className="text-slate-100 text-xs sm:text-sm mt-1">{animalPersona.nightmarePartner.reason}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
            <div className="flex flex-col sm:flex-row gap-3.5">
                <StyledButton
                onClick={handleShare}
                variant="primary"
                fullWidth
                aria-label="결과 클립보드에 복사하기"
                className="flex items-center justify-center gap-2"
                >
                <ShareIcon className="opacity-90" /> {showCopiedMessage ? '✅ 복사 완료!' : '결과 공유하기'}
                </StyledButton>
                <StyledButton
                onClick={onRestart}
                variant="secondary"
                fullWidth
                aria-label="테스트 다시 시작하기"
                >
                테스트 다시하기 🔄
                </StyledButton>
            </div>
            <StyledButton
              onClick={onShowAllPersonas}
              variant="secondary" 
              fullWidth
              aria-label="모든 유형 살펴보기"
              className="bg-purple-600/60 hover:bg-purple-500/80 focus:ring-purple-400/70 flex items-center justify-center gap-2"
            >
              <PaletteIcon className="opacity-90" /> ✨ 모든 유형 살펴보기
            </StyledButton>
        </div>
      </div>
       <p className="text-xs text-slate-300/80 mt-2 text-center px-4 animate-fadeIn" style={{animationDelay: '1.8s'}}>
          본 테스트는 재미를 위한 것으로, 실제 보안 전문가의 진단과는 다를 수 있습니다.
          <br />
          항상 공식적인 보안 가이드라인을 최우선으로 참고하세요! 😊
        </p>
        <p className="text-xs text-slate-400/70 mt-3 text-center px-4 animate-fadeIn" style={{animationDelay: '2.0s'}}>
          이 테스트는 TechKwon에 의해 제작되었습니다. 🐰✨
        </p>
    </div>
  );
};

export default ResultScreen;