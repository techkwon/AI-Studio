
export enum Screen {
  SPLASH,
  QUESTION,
  LOADING,
  RESULT,
  ALL_PERSONAS, // Added new screen type
}

export interface Question {
  id: number;
  text: string;
  options: { text: string; value: number }[];
  imageUrl?: string; // Added imageUrl
}

export type AnimalTypeKey =
  | 'desertFox'
  | 'meerkat'
  | 'polarBear'
  | 'hamster'
  | 'wiseOwl'
  | 'busyBeaver'
  | 'slyChameleon'
  | 'loyalDog'
  | 'loneWolf'
  | 'socialParrot';

export interface AnimalPersona {
  key: AnimalTypeKey;
  name: string;
  oneLiner: string;
  description: string;
  strengths: string[];
  weaknesses: string[]; // Tips are included here
  imageUrl: string;
  fantasticDuo: { key: AnimalTypeKey; reason: string };
  nightmarePartner: { key: AnimalTypeKey; reason: string };
}

export interface Answer {
  questionId: number;
  value: number;
}