export enum GameState {
  SETUP,
  PLAYING,
  FINISHED,
}

export interface Player {
  id: number;
  name: string;
  avatar: string;
  color: string;
  textColor: string;
  position: number;
}

export enum SquareType {
  START,
  MISSION,
  LADDER,
  CHUTE,
  END,
}

export enum SpecialType {
  COMPLIMENT,
  HEART,
}

export interface BoardSquare {
  type: SquareType;
  mission: string;
  position: { row: number; col: number };
  targetPosition?: number; // For ladders and chutes
}
