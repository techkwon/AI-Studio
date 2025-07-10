import { Chat } from "@google/genai";

export enum GamePhase {
  CHARACTER_CREATION = 'CHARACTER_CREATION',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  ERROR = 'ERROR',
}

export interface Character {
  name: string;
  trait: string;
}

export interface Scene {
  description: string;
  image: string;
  choices: string[];
}

export interface GameState {
  phase: GamePhase;
  character: Character | null;
  scenario: string | null;
  currentScene: Scene | null;
  clues: string[];
  isLoading: boolean;
  error: string | null;
  chatSession: Chat | null;
  epilogue: string | null;
}

export interface GeminiResponse {
  sceneDescription: string;
  choices: string[];
  newClue: string | null;
  isEnding: boolean;
  epilogue: string | null;
}