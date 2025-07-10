
import React, { useState, useCallback } from 'react';
import { GamePhase, GameState, Character, Scene } from './types';
import { startGame, advanceStory } from './services/geminiService';
import CharacterCreationScreen from './components/CharacterCreationScreen';
import GameScreen from './components/GameScreen';
import { Chat } from "@google/genai";
import { BookOpenIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    phase: GamePhase.CHARACTER_CREATION,
    character: null,
    scenario: null,
    currentScene: null,
    clues: [],
    isLoading: false,
    error: null,
    chatSession: null,
    epilogue: null,
  });
  const [isNoteVisible, setNoteVisible] = useState(false);

  const handleGameStart = useCallback(async (character: Character, scenario: string) => {
    setGameState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { scene, chatSession, newClue } = await startGame(character, scenario);
      setGameState({
        phase: GamePhase.PLAYING,
        character,
        scenario,
        currentScene: scene,
        clues: newClue ? [newClue] : [],
        isLoading: false,
        error: null,
        chatSession,
        epilogue: null,
      });
    } catch (e) {
      console.error(e);
      setGameState(prev => ({
        ...prev,
        phase: GamePhase.ERROR,
        isLoading: false,
        error: e instanceof Error ? e.message : '게임 시작 중 알 수 없는 오류가 발생했습니다.',
      }));
    }
  }, []);

  const handleChoice = useCallback(async (choice: string) => {
    if (!gameState.chatSession) return;
    setGameState(prev => ({ ...prev, isLoading: true, error: null, currentScene: prev.currentScene ? {...prev.currentScene, choices: []} : null }));
    try {
      const { scene, newClue, isEnding, epilogue } = await advanceStory(gameState.chatSession, choice);
      
      setGameState(prev => ({
        ...prev,
        phase: isEnding ? GamePhase.GAME_OVER : GamePhase.PLAYING,
        currentScene: scene,
        clues: newClue ? [...prev.clues, newClue] : prev.clues,
        isLoading: false,
        epilogue: isEnding ? epilogue : null,
      }));
    } catch (e) {
      console.error(e);
       setGameState(prev => ({
        ...prev,
        phase: GamePhase.ERROR,
        isLoading: false,
        error: e instanceof Error ? e.message : '이야기 진행 중 알 수 없는 오류가 발생했습니다.',
      }));
    }
  }, [gameState.chatSession]);
  
  const handleRestart = () => {
     setGameState({
        phase: GamePhase.CHARACTER_CREATION,
        character: null,
        scenario: null,
        currentScene: null,
        clues: [],
        isLoading: false,
        error: null,
        chatSession: null,
        epilogue: null,
     });
     setNoteVisible(false);
  }
  
  const toggleNoteVisibility = () => {
      setNoteVisible(prev => !prev);
  }

  const renderContent = () => {
    switch (gameState.phase) {
      case GamePhase.CHARACTER_CREATION:
        return <CharacterCreationScreen onStart={handleGameStart} isLoading={gameState.isLoading} />;
      case GamePhase.PLAYING:
      case GamePhase.GAME_OVER:
      case GamePhase.ERROR:
        return <GameScreen 
          gameState={gameState} 
          onChoice={handleChoice} 
          onRestart={handleRestart}
          isNoteVisible={isNoteVisible}
          onToggleNote={toggleNoteVisibility}
        />;
      default:
        return <CharacterCreationScreen onStart={handleGameStart} isLoading={gameState.isLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 text-gray-800 flex flex-col items-center p-4">
      <header className="w-full max-w-5xl text-center mb-6">
          <div className="flex items-center justify-center gap-3">
            <BookOpenIcon className="w-8 h-8 text-amber-800" />
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-amber-900">학교의 미스터리: AI 탐정 노트</h1>
          </div>
          <p className="text-gray-600 mt-1">AI 게임 마스터와 함께 사건을 해결하세요!</p>
      </header>
      <main className="w-full max-w-5xl flex-grow">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
