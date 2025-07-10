
export interface ReportData {
  mindWeather: {
    score: number;
    summary: string;
  };
  keywords: string[];
  fiveElements: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  recommendations: {
    morning: { activity: string; description: string };
    afternoon: { activity: string; description: string };
    evening: { activity: string; description: string };
  };
  detailedAdvice: {
    advice: string;
    caution: string;
  };
  closingMessage: string;
}

export interface BiorhythmData {
    physical: number;
    emotional: number;
    intellectual: number;
}
