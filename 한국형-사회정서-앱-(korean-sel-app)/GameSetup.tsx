import React, { useState, useCallback } from 'react';
import { Player } from '../types';
import { PLAYER_AVATARS } from '../constants';
import { AvatarIcon } from './icons/AvatarIcon';

interface GameSetupProps {
  onGameStart: (players: Player[]) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onGameStart }) => {
  const [numPlayers, setNumPlayers] = useState<number>(2);
  const [players, setPlayers] = useState<Partial<Player>[]>([{}, {}]);

  const handleNumPlayersChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value, 10);
    setNumPlayers(count);
    setPlayers(Array(count).fill({}));
  };

  const handlePlayerInfoChange = (index: number, field: keyof Player, value: any) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], id: index, [field]: value };
    setPlayers(newPlayers);
  };

  const handleAvatarSelect = (playerIndex: number, avatarIndex: number) => {
    const newPlayers = [...players];
    const selectedAvatar = PLAYER_AVATARS[avatarIndex];
    newPlayers[playerIndex] = { 
      ...newPlayers[playerIndex], 
      id: playerIndex, 
      avatar: selectedAvatar.icon, 
      color: selectedAvatar.color,
      textColor: selectedAvatar.textColor,
    };
    setPlayers(newPlayers);
  };
  
  const canStartGame = players.every(p => p.name && p.avatar);

  const handleStartGame = () => {
    if (canStartGame) {
      const finalPlayers = players.map((p, index) => ({
        id: index,
        name: p.name!,
        avatar: p.avatar!,
        color: p.color!,
        textColor: p.textColor!,
        position: 0,
      }));
      onGameStart(finalPlayers as Player[]);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 text-center animate-fade-in">
      <h2 className="text-2xl font-bold text-amber-700 mb-4">게임 설정</h2>
      <div className="mb-6">
        <label htmlFor="numPlayers" className="block text-lg text-amber-800 mb-2">참여 인원</label>
        <select
          id="numPlayers"
          value={numPlayers}
          onChange={handleNumPlayersChange}
          className="bg-white border-2 border-amber-300 rounded-lg px-4 py-2 text-center text-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
        >
          <option value={2}>2명</option>
          <option value={3}>3명</option>
          <option value={4}>4명</option>
          <option value={5}>5명</option>
          <option value={6}>6명</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {players.map((player, index) => (
          <div key={index} className="bg-amber-100/50 p-4 rounded-xl border-2 border-amber-200">
            <h3 className="font-bold text-xl text-amber-800 mb-3">플레이어 {index + 1}</h3>
            <input
              type="text"
              placeholder="이름을 입력하세요"
              value={player.name || ''}
              onChange={(e) => handlePlayerInfoChange(index, 'name', e.target.value)}
              maxLength={10}
              className="w-full bg-white border-2 border-amber-300 rounded-lg px-3 py-2 mb-4 text-center focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <div className="flex justify-center gap-3">
              {PLAYER_AVATARS.map((avatar, avatarIndex) => (
                <button
                  key={avatarIndex}
                  onClick={() => handleAvatarSelect(index, avatarIndex)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110 ${avatar.color} ${player.avatar === avatar.icon ? `ring-4 ring-offset-2 ring-amber-500` : 'ring-1 ring-inset ring-black/10'}`}
                >
                  <AvatarIcon icon={avatar.icon} className="w-8 h-8 text-white" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleStartGame}
        disabled={!canStartGame}
        className="w-full bg-amber-500 text-white font-bold py-3 px-6 rounded-xl text-xl shadow-md hover:bg-amber-600 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
      >
        게임 시작하기
      </button>
    </div>
  );
};

export default GameSetup;