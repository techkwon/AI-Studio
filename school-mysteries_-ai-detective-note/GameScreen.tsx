
import React from 'react';
import { GameState, GamePhase } from '../types';
import MysteryNote from './MysteryNote';
import LoadingSpinner from './LoadingSpinner';
import { ClipboardListIcon, XIcon } from './IconComponents';

interface GameScreenProps {
  gameState: GameState;
  onChoice: (choice: string) => void;
  onRestart: () => void;
  isNoteVisible: boolean;
  onToggleNote: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ gameState, onChoice, onRestart, isNoteVisible, onToggleNote }) => {
  const { currentScene, isLoading, character, clues, phase, error, epilogue } = gameState;

  return (
    <div className="relative w-full">
      <div className="w-full flex flex-col md:flex-row gap-6">
        <div className="flex-grow md:w-2/3 bg-white/60 backdrop-blur-sm shadow-xl rounded-lg border border-stone-200 overflow-hidden flex flex-col">
          {isLoading && !currentScene && (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-6 min-h-[400px]">
                <LoadingSpinner className="w-12 h-12 mb-4" />
                <p className="text-lg text-gray-600 font-semibold">AI가 당신의 첫 번째 장면을 만들고 있습니다...</p>
                <p className="text-sm text-gray-500">잠시만 기다려 주세요.</p>
            </div>
          )}
          
          {currentScene && (
            <>
              <div className="aspect-w-16 aspect-h-9 w-full relative">
                  <img
                      key={currentScene.image}
                      src={currentScene.image}
                      alt="Scene illustration"
                      className="object-cover w-full h-full animate-fade-in"
                  />
                  {isLoading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <LoadingSpinner />
                      </div>
                  )}
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="font-serif text-lg leading-relaxed text-gray-800 mb-6 whitespace-pre-wrap">
                      {currentScene.description}
                  </div>
                  
                  {phase === GamePhase.GAME_OVER ? (
                      <div className="text-center p-6 bg-amber-100/70 rounded-md border border-amber-200 shadow-inner">
                          <h3 className="text-2xl font-bold text-amber-900 font-serif">사건 해결!</h3>
                          {epilogue && (
                              <p className="mt-4 text-gray-800 font-serif leading-relaxed text-left whitespace-pre-wrap animate-fade-in border-t border-amber-200 pt-4">
                                  {epilogue}
                              </p>
                          )}
                          <button
                              onClick={onRestart}
                              className="mt-6 bg-amber-800 text-white font-bold py-2 px-6 rounded-md hover:bg-amber-900 transition-colors"
                          >
                              새로운 모험 시작하기
                          </button>
                      </div>
                  ) : error ? (
                      <div className="text-center p-4 bg-red-100 rounded-md">
                          <h3 className="text-xl font-bold text-red-800 font-serif">오류 발생</h3>
                          <p className="mt-2 text-red-700">{error}</p>
                          <button
                              onClick={onRestart}
                              className="mt-4 bg-red-700 text-white font-bold py-2 px-6 rounded-md hover:bg-red-800 transition-colors"
                          >
                              다시 시작하기
                          </button>
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 gap-3">
                      {currentScene.choices.map((choice, index) => (
                          <button
                          key={index}
                          onClick={() => onChoice(choice)}
                          disabled={isLoading || currentScene.choices.length === 0}
                          className="w-full text-left bg-white font-semibold py-3 px-5 rounded-md border border-gray-300 hover:bg-amber-100 hover:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-wait transition-all duration-200 shadow-sm"
                          >
                          {`-> ${choice}`}
                          </button>
                      ))}
                      </div>
                  )}
              </div>
            </>
          )}
        </div>

        {/* Desktop Mystery Note */}
        <div className="hidden md:block md:w-1/3">
          <MysteryNote character={character} clues={clues} />
        </div>
      </div>
      
      {/* Mobile Note Toggle Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={onToggleNote}
          className="p-4 bg-amber-800 text-white rounded-full shadow-lg hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-transform hover:scale-110"
          aria-label="탐정 수첩 열기"
        >
          <ClipboardListIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Note Panel */}
      {isNoteVisible && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={onToggleNote}></div>
          {/* Panel */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-amber-50 shadow-2xl p-5 overflow-y-auto transform transition-transform duration-300 ease-in-out"
            style={{ animation: 'slide-in 0.3s ease-out forwards' }}
            onClick={e => e.stopPropagation()}
          >
            <style>{`
              @keyframes slide-in {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
            `}</style>
             <div className="flex justify-end mb-4">
                 <button onClick={onToggleNote} className="p-2 -mr-2 text-gray-600 hover:text-gray-900">
                    <XIcon className="w-6 h-6" />
                 </button>
             </div>
            <MysteryNote character={character} clues={clues} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GameScreen;
