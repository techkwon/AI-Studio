
import React, { useState, useCallback } from 'react';
import { GameState, Player } from './types';
import GameSetup from './components/GameSetup';
import GameBoard from './components/GameBoard';

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.SETUP);
  const [players, setPlayers] = useState<Player[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);

  const handleGameStart = useCallback((newPlayers: Player[]) => {
    setPlayers(newPlayers);
    setWinner(null);
    setGameState(GameState.PLAYING);
  }, []);

  const handleGameFinish = useCallback((winningPlayer: Player) => {
    setWinner(winningPlayer);
    setGameState(GameState.FINISHED);
  }, []);
  
  const handleRestart = useCallback(() => {
    setGameState(GameState.SETUP);
    setPlayers([]);
    setWinner(null);
  }, []);

  const renderGameState = () => {
    switch (gameState) {
      case GameState.SETUP:
        return <GameSetup onGameStart={handleGameStart} />;
      case GameState.PLAYING:
      case GameState.FINISHED:
        return (
          <GameBoard
            players={players}
            setPlayers={setPlayers}
            onGameFinish={handleGameFinish}
            winner={winner}
            onRestart={handleRestart}
          />
        );
      default:
        return <GameSetup onGameStart={handleGameStart} />;
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 text-gray-800 flex flex-col items-center justify-center p-4">
      <header className="text-center mb-4">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-800">한국형 사회정서 앱</h1>
        <p className="text-amber-600">놀면서 배우는 우리들의 마음 성장</p>
      </header>
      <main className="w-full max-w-4xl">
        {renderGameState()}
      </main>
    </div>
  );
}

export default App;