import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Character, Scene, GeminiResponse } from '../types';
import { SCENARIOS, SYSTEM_PROMPT } from '../constants';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function generateImage(prompt: string): Promise<string> {
    try {
        const imageResponse = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: `A warm, emotional webtoon-style illustration of: ${prompt}. Focus on a Korean school mystery theme, cinematic lighting.`,
            config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
        });

        if (imageResponse.generatedImages && imageResponse.generatedImages.length > 0) {
            const base64ImageBytes: string = imageResponse.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        throw new Error("이미지 생성에 실패했습니다.");
    } catch(e) {
        console.error("Image generation failed, using placeholder.", e);
        return `https://picsum.photos/seed/${encodeURIComponent(prompt)}/800/450`;
    }
}

async function getParsedGeminiResponse(chatSession: Chat, message: string): Promise<GeminiResponse> {
    const result: GenerateContentResponse = await chatSession.sendMessage({ message });
    
    let jsonStr = result.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
        jsonStr = match[2].trim();
    }
    
    // Attempt to clean trailing commas which can cause JSON parsing errors
    jsonStr = jsonStr.replace(/,(?=\s*?[}\]])/g, '');

    try {
        const parsedData = JSON.parse(jsonStr);
        // Basic validation
        if (parsedData.sceneDescription && Array.isArray(parsedData.choices)) {
            return parsedData as GeminiResponse;
        }
        throw new Error("AI 응답이 잘못된 형식입니다.");
    } catch (e) {
        console.error("Failed to parse JSON response from Gemini:", jsonStr, e);
        throw new Error("AI로부터 받은 응답을 처리하는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
}


export async function startGame(character: Character, scenarioId: string): Promise<{ scene: Scene; chatSession: Chat; newClue: string | null }> {
    const chatSession = ai.chats.create({
        model: 'gemini-2.5-flash-preview-04-17',
        config: {
            systemInstruction: SYSTEM_PROMPT,
            responseMimeType: "application/json",
        },
    });

    const scenarioTitle = SCENARIOS.find(s => s.id === scenarioId)?.title || 'A school mystery';
    const initialPrompt = `게임 시작. 시나리오: '${scenarioTitle}'. 캐릭터 이름: '${character.name}', 특징: '${character.trait}'.`;

    const geminiResponse = await getParsedGeminiResponse(chatSession, initialPrompt);
    const imageUrl = await generateImage(geminiResponse.sceneDescription);

    const scene: Scene = {
        description: geminiResponse.sceneDescription,
        image: imageUrl,
        choices: geminiResponse.choices,
    };

    return { scene, chatSession, newClue: geminiResponse.newClue };
}

export async function advanceStory(chatSession: Chat, choice: string): Promise<{ scene: Scene; newClue: string | null; isEnding: boolean; epilogue: string | null }> {
    const geminiResponse = await getParsedGeminiResponse(chatSession, choice);
    
    // When the game ends, the image prompt should reflect the epilogue for a more conclusive final image.
    const imagePrompt = (geminiResponse.isEnding && geminiResponse.epilogue) ? geminiResponse.epilogue : geminiResponse.sceneDescription;
    const imageUrl = await generateImage(imagePrompt);
    
    const scene: Scene = {
        description: geminiResponse.sceneDescription,
        image: imageUrl,
        choices: geminiResponse.choices,
    };

    return { scene, newClue: geminiResponse.newClue, isEnding: geminiResponse.isEnding, epilogue: geminiResponse.epilogue };
}