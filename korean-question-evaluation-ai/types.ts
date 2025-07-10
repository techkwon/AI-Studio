
export type BloomLevelCategory = "기억" | "이해" | "적용" | "분석" | "평가" | "창의";
export type EvaluationStatus = BloomLevelCategory | "알 수 없음" | "평가 오류";

export interface EvaluationResult {
  bloomLevel: EvaluationStatus;
  explanation: string;
  rawResponse?: string; // For debugging or detailed error messages
  isProxyOrNetworkError?: boolean; // Flag for specific error handling in UI
}

export interface Message {
  id: string;
  text: string;
  type: 'success' | 'error';
}
