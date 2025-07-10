import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SurveyAnswers, SsaemBtiResult, SsaemBtiApiResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const buildPrompt = (answers: SurveyAnswers): string => {
  return `
You are a world-class branding consultant and copywriter specializing in personal branding for educators.
Your task is to analyze a teacher's survey responses and generate a hyper-personalized branding report in Korean.
The tone should be professional, insightful, and deeply encouraging.
Analyze the following survey data for a teacher:

- Teaching Style: ${answers.q1}
- Self-Metaphor: ${answers.q2}
- Desired Memory (Keywords): ${answers.q3}
- Self-Identified Strength: ${answers.q4}
- Area for Growth: ${answers.q5}

Based on this information, you MUST generate a response in the following JSON format. Do not include any other text, explanations, or markdown fences outside of the JSON structure.

{
  "character": {
    "name": "Create a unique, creative, and memorable character name in Korean for this teacher. For example, '데이터를 항해하는 선장' or '이야기를 엮는 정원사'.",
    "description": "Write a detailed, 2-3 sentence description in Korean of this character, connecting it directly to the teacher's survey answers. Explain WHY they are this character, referencing their teaching style and metaphor."
  },
  "slogan": "Create a short, catchy, and inspiring slogan in Korean for this teacher that encapsulates their core educational philosophy. It should reflect their strengths and desired memory.",
  "strengths": [
    "Analyze the teacher's answers (especially Q1, Q3, Q4) and articulate one key strength in Korean. Directly quote or reference their own words from the survey to make it feel personal. For example: '선생님의 강점은 ''다 같이 해볼까?''라고 말씀하시는 부분에서 알 수 있듯, 학생들의 협업을 이끌어내는 능력입니다.'",
    "Analyze the teacher's answers and articulate a second, distinct key strength in Korean. Again, root this analysis in the provided survey data to ensure it is concrete and personalized."
  ],
  "growth_point": {
    "title": "Based on the teacher's stated area for growth (Q5), create a positive and empowering title in Korean for this growth area. For example, '혁신 도구함 확장하기' or '학생 주도 탐구 심화하기'.",
    "description": "Write a supportive and actionable description in Korean for the growth point. Acknowledge their concern from Q5 and offer a constructive perspective or a first step they could take. Frame it as an exciting next chapter in their professional journey."
  },
  "image_prompt_english": "Based on the character name and description, create a short (15-25 words), visually descriptive prompt in English for an image generation model. The desired style is a heartwarming, modern, simple, and clean illustration with vibrant colors. The prompt should only describe the visual elements of the character and background. Do not include text in the image. Example: 'A friendly captain navigating a sea of data on a sturdy ship, with a bright lighthouse in the background, digital art, vibrant colors, clean illustration style'."
}
`;
};


export const generateReport = async (answers: SurveyAnswers): Promise<SsaemBtiResult> => {

  try {
    const prompt = buildPrompt(answers);
    
    // Step 1: Generate the text report and image prompt
    const textResponse: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
        },
    });

    let jsonStr = textResponse.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    const apiResult: SsaemBtiApiResult = JSON.parse(jsonStr);

    // Step 2: Generate the character image
    const imageResponse = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: apiResult.image_prompt_english,
        config: { numberOfImages: 1, outputMimeType: 'image/png' },
    });
    
    const base64ImageBytes: string = imageResponse.generatedImages[0].image.imageBytes;
    const characterImageUrl = `data:image/png;base64,${base64ImageBytes}`;

    // Step 3: Combine results
    const finalResult: SsaemBtiResult = {
        character: apiResult.character,
        slogan: apiResult.slogan,
        strengths: apiResult.strengths,
        growth_point: apiResult.growth_point,
        characterImageUrl: characterImageUrl,
    };

    return finalResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the report.");
  }
};
