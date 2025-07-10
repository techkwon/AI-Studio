import React from 'react';
import { Player } from '../types';
import { AvatarIcon } from './icons/AvatarIcon';

interface PlayerPieceProps {
  player: Player;
  size: 'small' | 'large';
}

const PlayerPiece: React.FC<PlayerPieceProps> = ({ player, size }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    large: 'w-10 h-10 md:w-12 md:h-12',
  };
  const iconSizeClasses = {
    small: 'w-5 h-5',
    large: 'w-7 h-7 md:w-8 md:h-8',
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center ${player.color} border-2 border-white/80 shadow-md`}>
      <AvatarIcon icon={player.avatar} className={`${iconSizeClasses[size]} text-white`} />
    </div>
  );
};

export default PlayerPiece;
