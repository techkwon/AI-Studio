import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ScoreFeedback } from '../types';
import { GEMINI_SYSTEM_PROMPT, IMAGE_GENERATION_ERROR_PLACEHOLDER } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API 키가 설정되지 않았습니다. process.env.API_KEY를 확인해주세요. 목업 데이터 및 기능으로 대체합니다.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "API_KEY_MISSING_DEMO_MODE" });

export const generateImage = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    console.warn("API 키 없이 이미지 생성 시도. 플레이스홀더 반환.");
    // Simulate delay for loading state in UI
    await new Promise(resolve => setTimeout(resolve, 1000));
    return IMAGE_GENERATION_ERROR_PLACEHOLDER; 
  }
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {numberOfImages: 1, outputMimeType: 'image/jpeg'},
    });

    if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image?.imageBytes) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      console.error("이미지 생성 응답이 비어있거나 잘못된 형식입니다.", response);
      return IMAGE_GENERATION_ERROR_PLACEHOLDER;
    }
  } catch (error) {
    console.error("Imagen API 요청 실패:", error);
    return IMAGE_GENERATION_ERROR_PLACEHOLDER;
  }
};


export const evaluatePrompt = async (userPrompt: string): Promise<ScoreFeedback> => {
  if (!API_KEY) {
    console.warn("API 키 없이 채점 실행 중입니다. 목업 데이터를 반환합니다.");
    const mockEmotions = ['happy', 'encouraging', 'thoughtful', 'proud'];
    return {
      score: Math.floor(Math.random() * 51) + 50,
      feedback: "API 키가 없어 실제 채점을 할 수 없었어요. 하지만 멋진 프롬프트네요! (목업 피드백)",
      emotionKeyword: mockEmotions[Math.floor(Math.random() * mockEmotions.length)],
    };
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: [{ role: "user", parts: [{text: userPrompt}] }],
      config: {
        systemInstruction: GEMINI_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        temperature: 0.7,
      }
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    try {
      const parsedData = JSON.parse(jsonStr) as ScoreFeedback;
      if (typeof parsedData.score !== 'number' || typeof parsedData.feedback !== 'string' || typeof parsedData.emotionKeyword !== 'string') {
        console.error("잘못된 JSON 구조:", parsedData, "원본:", response.text);
        // Fallback emotion if missing
        parsedData.emotionKeyword = parsedData.emotionKeyword || 'neutral'; 
        if (typeof parsedData.score !== 'number' || typeof parsedData.feedback !== 'string') {
           throw new Error("AI 응답에서 점수와 피드백, 감정 키워드를 올바르게 받지 못했어요.");
        }
      }
      return parsedData;
    } catch (e) {
      console.error("JSON 파싱 실패:", e, "원본 텍스트:", response.text);
      return {
        score: Math.floor(Math.random() * 31) + 20,
        feedback: `AI 응답을 이해하는 데 실패했어요. 다시 시도해주세요. (파싱 오류 발생 시 목업 피드백)`,
        emotionKeyword: 'concerned_hopeful'
      };
    }
  } catch (error) {
    console.error("Gemini API 요청 실패:", error);
    let errorMessage = "AI 채점 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.";
     if (error instanceof Error && error.message) {
        errorMessage = error.message;
     }
    return {
      score: Math.floor(Math.random() * 31) + 20,
      feedback: `AI 채점 중 문제가 발생했어요: ${errorMessage}. 다시 시도해주세요. (오류 발생 시 목업 피드백)`,
      emotionKeyword: 'concerned_hopeful'
    };
  }
};