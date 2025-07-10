
import { BloomLevelCategory } from './types';

export const BLOOM_LEVELS_KOREAN: ReadonlyArray<BloomLevelCategory> = ["기억", "이해", "적용", "분석", "평가", "창의"];
export const GEMINI_MODEL_NAME = "gemini-2.5-flash-preview-04-17";

export const PROMPT_TEMPLATE = (question: string): string => `
사용자가 제시한 다음 질문을 블룸의 교육목표 분류법의 6가지 수준 (${BLOOM_LEVELS_KOREAN.join(', ')}) 중 어떤 수준에 해당하는지 평가해 주십시오.
반드시 다음 형식에 맞춰 한국어로만 답변해 주십시오. 다른 설명은 추가하지 마십시오.

질문: "${question}"

---
블룸 수준: [여기에 수준을 명시. 예: 분석]
간단한 설명: [여기에 해당 수준으로 판단한 이유를 2-3문장으로 간략히 설명]
---
`;
