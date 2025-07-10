export interface Mentor {
  id: string;
  name: string;
  basePrompt: string; // Base prompt for generating the mentor's image
  generatedImage?: string; // URL or base64 string of the generated image
  description: string;
}

export interface Question {
  id: string;
  text: string;
  topic: string; // e.g., "창의적 글쓰기", "정보 검색", "디지털 시민의식"
}

export interface ScoreFeedback {
  score: number;
  feedback: string;
  emotionKeyword: string; // Keyword for mentor's expression (e.g., "happy", "proud")
}

export interface Character {
  name: string;
  animal: string;
  minScore: number;
  maxScore: number;
  message: string;
  // basePrompt: string; // Removed as character images are now static URLs
  // generatedImage?: string; // Removed
  imageUrl: string; // Added direct URL for character image
}

export enum GameScreen {
  Start,
  MentorSelection,
  Problem,
  Result,
}

export interface Answer {
  questionId: string;
  userPrompt: string;
  score: number;
  feedback: string;
}