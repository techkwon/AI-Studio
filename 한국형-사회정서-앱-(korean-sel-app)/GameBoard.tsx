import React, { useState, useCallback } from 'react';
import { Player, BoardSquare, SquareType } from '../types';
import { BOARD_LAYOUT, LADDERS, CHUTES } from '../constants';
import PlayerPiece from './PlayerPiece';
import Dice from './Dice';
import MissionModal from './modals/MissionModal';
import WinnerModal from './modals/WinnerModal';

interface GameBoardProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  onGameFinish: (player: Player) => void;
  winner: Player | null;
  onRestart: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ players, setPlayers, onGameFinish, winner, onRestart }) => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceValues, setDiceValues] = useState<[number | null, number | null]>([null, null]);
  const [isRolling, setIsRolling] = useState(false);
  const [modal, setModal] = useState<{ mission: string } | null>(null);
  const [lastPosition, setLastPosition] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [hasDoubles, setHasDoubles] = useState(false); // Transient flag for the roll result
  const [isBonusTurn, setIsBonusTurn] = useState(false); // UI flag for the next turn
  
  const currentPlayer = players[currentPlayerIndex];

  const handleNextTurn = useCallback(() => {
    setModal(null);
    setIsMoving(false);
    setDiceValues([null, null]);

    if (hasDoubles) {
        setHasDoubles(false); 
        setIsBonusTurn(true);
    } else {
        setIsBonusTurn(false);
        setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
    }
  }, [hasDoubles, players.length]);
  
  const jumpPlayer = useCallback((targetPos: number) => {
    setTimeout(() => {
      setPlayers(prev => prev.map(p => p.id === currentPlayer.id ? {...p, position: targetPos} : p));
      setTimeout(() => {
        if (targetPos === BOARD_LAYOUT.length - 1) {
          onGameFinish({ ...currentPlayer, position: targetPos });
        } else {
          handleNextTurn();
        }
      }, 500);
    }, 500);
  }, [currentPlayer, setPlayers, handleNextTurn, onGameFinish]);
  
  const handleMove = useCallback((steps: number) => {
    setIsMoving(true);
    const newPosition = Math.min(currentPlayer.position + steps, BOARD_LAYOUT.length - 1);
    
    setPlayers(prev => prev.map(p => p.id === currentPlayer.id ? {...p, position: newPosition} : p));

    setTimeout(() => {
      const destinationSquare = BOARD_LAYOUT[newPosition];
      
      if (newPosition === BOARD_LAYOUT.length - 1) {
        onGameFinish({ ...currentPlayer, position: newPosition });
        return;
      }

      switch (destinationSquare.type) {
        case SquareType.LADDER:
        case SquareType.CHUTE:
          jumpPlayer(destinationSquare.targetPosition!);
          break;
        case SquareType.MISSION:
          setModal({ mission: destinationSquare.mission });
          break;
        default:
          handleNextTurn();
      }
    }, 600);
  }, [currentPlayer, setPlayers, onGameFinish, handleNextTurn, jumpPlayer]);

  const handleDiceRoll = useCallback(() => {
    if (isRolling || winner || modal !== null || isMoving) return;
    
    setIsRolling(true);
    setDiceValues([null, null]);
    setHasDoubles(false); // Always reset at the beginning of a roll.
    if (isBonusTurn) setIsBonusTurn(false); // Consume bonus turn flag when rolling.
    setLastPosition(currentPlayer.position);
    
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDiceValues([
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1
      ]);
      rollCount++;
      if (rollCount > 10) {
        clearInterval(rollInterval);
        const finalRoll1 = Math.floor(Math.random() * 6) + 1;
        const finalRoll2 = Math.floor(Math.random() * 6) + 1;
        setDiceValues([finalRoll1, finalRoll2]);
        setIsRolling(false);
        if (finalRoll1 === finalRoll2) {
            setHasDoubles(true);
        }
        handleMove(finalRoll1 + finalRoll2);
      }
    }, 100);

  }, [isRolling, winner, modal, isMoving, currentPlayer, handleMove, isBonusTurn]);

  const handleMissionSuccess = useCallback(() => {
    setModal(null);
    handleNextTurn();
  }, [handleNextTurn]);
  
  const handleMissionFailure = useCallback(() => {
    setModal(null);
    setIsMoving(true);
    setPlayers(prev => prev.map(p => p.id === currentPlayer.id ? {...p, position: lastPosition} : p));
    setTimeout(() => {
      handleNextTurn();
    }, 500);
  }, [currentPlayer, lastPosition, setPlayers, handleNextTurn]);

  const getSquareCenter = (index: number) => {
      const { row, col } = BOARD_LAYOUT[index].position;
      const x = (col * 10) + 5;
      const y = (row * 10) + 5;
      return { x, y };
  };

  const renderLadder = (ladder: { start: number, end: number }, index: number) => {
      const start = getSquareCenter(ladder.start - 1);
      const end = getSquareCenter(ladder.end - 1);
      return (
          <line
              key={`ladder-${index}`}
              x1={start.x} y1={start.y}
              x2={end.x} y2={end.y}
              stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" markerEnd="url(#arrow-green)"
          />
      );
  };

  const renderChute = (chute: { start: number, end: number }, index: number) => {
      const start = getSquareCenter(chute.start - 1);
      const end = getSquareCenter(chute.end - 1);
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const midX = start.x + dx * 0.5 + (dy * 0.2);
      const midY = start.y + dy * 0.5 - (dx * 0.2);
      return (
          <path
              key={`chute-${index}`}
              d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
              stroke="#dc2626" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-red)"
          />
      );
  };
  
  const renderSquare = (square: BoardSquare, index: number) => {
    const { row, col } = square.position;
    let bgColor = index % 2 === 0 ? 'bg-amber-50' : 'bg-amber-100';
    let content = <span className="text-xs font-bold">{index + 1}</span>;

    switch(square.type) {
        case SquareType.START: bgColor = 'bg-green-300'; content = <span className="text-xs font-bold">시작</span>; break;
        case SquareType.END: bgColor = 'bg-yellow-400'; content = <span className="text-xs font-bold">도착</span>; break;
        case SquareType.LADDER: bgColor = 'bg-green-200'; content = <span className="text-sm">🪜</span>; break;
        case SquareType.CHUTE: bgColor = 'bg-red-200'; content = <span className="text-sm">🐍</span>; break;
    }
    return (
      <div
        key={index}
        className={`w-full h-full border border-amber-200/50 rounded-md flex items-center justify-center p-1 text-center ${bgColor}`}
        style={{ gridRow: row + 1, gridColumn: col + 1 }}
      >
        {content}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 items-start justify-center animate-fade-in">
        <div className="w-full lg:w-2/3 xl:w-3/4 relative">
            <div className="grid grid-cols-10 grid-rows-10 gap-1 aspect-square bg-white/60 p-1 rounded-2xl shadow-inner">
                {BOARD_LAYOUT.map(renderSquare)}
            </div>
            <svg className="absolute top-0 left-0 w-full h-full p-1 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                  <marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#16a34a" />
                  </marker>
                  <marker id="arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#dc2626" />
                  </marker>
              </defs>
              {LADDERS.map(renderLadder)}
              {CHUTES.map(renderChute)}
            </svg>
            {players.map(player => {
                const { row, col } = BOARD_LAYOUT[player.position].position;
                const x_offset = (player.id % 3) * 12 - 12; // -12, 0, 12
                const y_offset = Math.floor(player.id / 3) * 14 - 7; // -7, 7
                return (
                    <div 
                        key={player.id} 
                        className="absolute transition-all duration-500 ease-in-out z-10"
                        style={{
                            top: `calc(${(row + 0.5) * 10}%)`,
                            left: `calc(${(col + 0.5) * 10}%)`,
                            transform: `translate(calc(-50% + ${x_offset}px), calc(-50% + ${y_offset}px))`
                        }}
                    >
                        <PlayerPiece player={player} size="large" />
                    </div>
                );
            })}
        </div>

        <div className="w-full lg:w-1/3 xl:w-1/4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-4 flex flex-col items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-amber-700">진행 상황</h2>
            <div className="w-full space-y-2">
                {players.map((p, index) => (
                    <div key={p.id} className={`w-full p-2 rounded-lg transition-all duration-300 ${currentPlayerIndex === index && !winner ? 'bg-amber-200 ring-2 ring-amber-500' : 'bg-amber-100/60'}`}>
                        <div className="flex items-center gap-2">
                            <PlayerPiece player={p} size="small" />
                            <span className="font-bold text-amber-800">{p.name}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="w-full flex flex-col items-center gap-4 mt-4">
              <p className="text-lg font-bold text-amber-800 h-8 text-center">
                {winner ? `${winner.name}님 승리!` : 
                 isBonusTurn ? '더블! 한번 더!' :
                 `${currentPlayer.name}님 차례`}
              </p>
              
              <Dice values={diceValues} isRolling={isRolling} />

              <button
                onClick={handleDiceRoll}
                disabled={isRolling || !!winner || modal !== null || isMoving}
                className="w-full bg-amber-500 text-white font-bold py-3 px-6 rounded-xl text-lg shadow-md hover:bg-amber-600 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isRolling ? '...' : isBonusTurn ? '한번 더!' : '주사위 굴리기'}
              </button>
            </div>
        </div>

        {modal && <MissionModal mission={modal.mission} onSuccess={handleMissionSuccess} onFailure={handleMissionFailure} />}
        {winner && <WinnerModal winner={winner} onRestart={onRestart} />}
    </div>
  );
};

export default GameBoard;