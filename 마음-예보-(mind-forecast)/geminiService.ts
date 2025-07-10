
import { GoogleGenAI, Type } from "@google/genai";
import { BiorhythmData, ReportData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        mindWeather: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.INTEGER, description: "오늘의 종합 컨디션 점수 (1-100)" },
                summary: { type: Type.STRING, description: "오늘의 컨디션을 한 문장으로 요약 (예: '새로운 아이디어가 샘솟는 날')" },
            },
            required: ['score', 'summary']
        },
        keywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "오늘의 핵심 키워드 3가지 (예: '창의력', '소통', '휴식')"
        },
        fiveElements: {
            type: Type.OBJECT,
            properties: {
                wood: { type: Type.INTEGER, description: "목(木) 에너지 수치 (1-100)" },
                fire: { type: Type.INTEGER, description: "화(火) 에너지 수치 (1-100)" },
                earth: { type: Type.INTEGER, description: "토(土) 에너지 수치 (1-100)" },
                metal: { type: Type.INTEGER, description: "금(金) 에너지 수치 (1-100)" },
                water: { type: Type.INTEGER, description: "수(水) 에너지 수치 (1-100)" },
            },
            required: ['wood', 'fire', 'earth', 'metal', 'water']
        },
        recommendations: {
            type: Type.OBJECT,
            properties: {
                morning: { type: Type.OBJECT, properties: { activity: {type: Type.STRING}, description: {type: Type.STRING} } },
                afternoon: { type: Type.OBJECT, properties: { activity: {type: Type.STRING}, description: {type: Type.STRING} } },
                evening: { type: Type.OBJECT, properties: { activity: {type: Type.STRING}, description: {type: Type.STRING} } },
            },
            required: ['morning', 'afternoon', 'evening']
        },
        detailedAdvice: {
            type: Type.OBJECT,
            properties: {
                advice: { type: Type.STRING, description: "오늘을 위한 종합적인 조언" },
                caution: { type: Type.STRING, description: "오늘 주의해야 할 점" },
            },
            required: ['advice', 'caution']
        },
        closingMessage: {
            type: Type.STRING,
            description: "하루를 마무리하는 긍정적이고 힘이 되는 메시지"
        },
    },
    required: ['mindWeather', 'keywords', 'fiveElements', 'recommendations', 'detailedAdvice', 'closingMessage']
};

export const generateMindForecast = async (birthDate: string, biorhythms: BiorhythmData): Promise<ReportData> => {
    const prompt = `
당신은 '마음 예보'라는 이름의 현명하고 공감 능력 높은 AI 라이프 코치입니다. 사용자의 생년월일과 오늘의 바이오리듬 데이터를 기반으로 바이오리듬, 수비학, 점성술의 원리를 통합하여 일일 예보를 제공합니다. 당신의 어조는 항상 따뜻하고, 격려적이며, 통찰력 있습니다. 사용자가 자신감 있고 긍정적인 하루를 보낼 수 있도록 실행 가능한 조언을 제공해주세요.

응답은 반드시 한국어로 작성해야 하며, 제공된 JSON 스키마를 엄격하게 준수해야 합니다. 다른 텍스트나 설명 없이 JSON 객체만 반환해 주세요.

사용자 정보:
- 생년월일: ${birthDate}
- 오늘 바이오리듬(0-100 스케일):
  - 신체: ${biorhythms.physical.toFixed(0)}
  - 감성: ${biorhythms.emotional.toFixed(0)}
  - 지성: ${biorhythms.intellectual.toFixed(0)}

이 정보를 바탕으로 오늘의 마음 예보를 생성해주세요.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.8,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as ReportData;

    } catch (error) {
        console.error("Error generating mind forecast:", error);
        throw new Error("AI 예보를 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
};
