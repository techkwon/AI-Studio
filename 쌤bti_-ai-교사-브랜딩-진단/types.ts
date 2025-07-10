export type AppState = 'start' | 'survey' | 'loading' | 'result';

export interface SurveyAnswers {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
}

// Result from the first Gemini call (text analysis)
export interface SsaemBtiApiResult {
  character: {
    name: string;
    description: string;
  };
  slogan: string;
  strengths: string[];
  growth_point: {
    title: string;
    description: string;
  };
  image_prompt_english: string; // New field for image generation
}

// Final result object used by the frontend, including the generated image URL
export interface SsaemBtiResult extends Omit<SsaemBtiApiResult, 'image_prompt_english'> {
    characterImageUrl: string;
}


export interface Question {
  id: keyof SurveyAnswers;
  type: 'multiple-choice' | 'text';
  text: string;
  options?: { value: string; label: string }[];
  placeholder?: string;
}
