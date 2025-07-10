import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { EvaluationResult, EvaluationStatus } from '../types';
import { BLOOM_LEVELS_KOREAN, GEMINI_MODEL_NAME, PROMPT_TEMPLATE } from '../constants';

const parseEvaluationResponse = (responseText: string): EvaluationResult => {
  const levelMatch = responseText.match(/블룸 수준:\s*(.+)/);
  const explanationMatch = responseText.match(/간단한 설명:\s*([\s\S]+)/);

  const extractedLevel = levelMatch ? levelMatch[1].trim() : "알 수 없음";
  const extractedExplanation = explanationMatch ? explanationMatch[1].trim().replace(/\n$/, '') : "자세한 설명을 가져오지 못했습니다.";

  let finalLevel: EvaluationStatus = "알 수 없음";
  if (BLOOM_LEVELS_KOREAN.includes(extractedLevel as any)) {
    finalLevel = extractedLevel as EvaluationStatus;
  } else if (extractedLevel !== "알 수 없음") {
    finalLevel = "평가 오류";
     return {
        bloomLevel: finalLevel,
        explanation: `AI가 반환한 수준("${extractedLevel}")이 표준 블룸 수준과 다릅니다. AI 응답: ${responseText}`,
        rawResponse: responseText,
    };
  }
  
  return {
    bloomLevel: finalLevel,
    explanation: extractedExplanation,
    rawResponse: responseText,
  };
};

/**
 * Evaluates a given question using the Gemini API.
 * 
 * Note on "Proxying failed" errors:
 * If you encounter errors like "Proxying failed" (often with details like "Failed to fetch"),
 * this typically indicates an issue with an intermediate proxy server that sits between
 * this client-side application and the actual Gemini API. The `proxiedUrl` field in such
 * error messages usually points to this intermediate proxy.
 * 
 * This frontend code uses the @google/genai SDK as intended. The SDK makes requests
 * that are then routed through this proxy. The failure ("Proxying failed") originates
 * from the proxy server itself, suggesting it might be:
 * 1. Unable to connect to the actual Google Gemini API.
 * 2. Misconfigured (e.g., API key issues on the proxy's side).
 * 3. Experiencing resource limitations or other internal errors.
 * 
 * Troubleshooting such errors should focus on inspecting the logs and configuration
 * of the proxy server (e.g., the Google Cloud Run service if `run.app` is in the proxiedUrl).
 * The client-side code is generally just reporting the error passed back by this proxy.
 */
export const evaluateQuestionWithGemini = async (question: string): Promise<EvaluationResult> => {
  // The API_KEY is expected to be provided by the environment.
  // In many deployment scenarios for client-side apps using a proxy,
  // this key might be a placeholder or a key for the proxy service itself,
  // with the actual Gemini API key being managed securely by the proxy.
  if (!process.env.API_KEY) {
    return {
        bloomLevel: "평가 오류",
        explanation: "API 키가 설정되지 않았습니다. 사이트 관리자에게 문의해 주세요.",
        rawResponse: "API_KEY is not configured in the client environment.",
        isProxyOrNetworkError: true, 
    };
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = PROMPT_TEMPLATE(question);

  try {
    // The ai.models.generateContent call will attempt to reach Google's servers.
    // If a proxy is in place (as indicated by "Proxying failed" errors),
    // that proxy intercepts this call.
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_MODEL_NAME,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    
    const evaluationText = response.text;
    // Check if evaluationText is truly empty or if the response itself is problematic
    if (typeof evaluationText !== 'string' || evaluationText.trim() === "") { 
        // Providing more context if the text is empty but response object exists
        const rawResponseSummary = response ? JSON.stringify(response) : "Response object is undefined.";
        console.error('AI response text is empty or invalid. Full response:', response);
        throw new Error(`AI로부터 유효한 평가 결과를 받지 못했습니다. 응답 텍스트가 비어있습니다. 응답 객체: ${rawResponseSummary}`);
    }
    
    return parseEvaluationResponse(evaluationText);

  } catch (error) {
    console.error('Gemini API Call Error Details:', error); 
    let userFriendlyExplanation: string;
    // Attempt to capture the raw error message, whether it's an Error object or something else.
    const rawErrorString = error instanceof Error ? error.message : String(error);
    let isProxyOrNetworkError = false;

    let specificProxyErrorMessage: string | null = null;
    // Try to parse error.message if it's a JSON string from the proxy
    if (error instanceof Error && error.message) {
        try {
            // Some proxies might return a JSON string as the error message
            const parsedMessage = JSON.parse(error.message);
            if (parsedMessage && parsedMessage.error === "Proxying failed") {
                specificProxyErrorMessage = "데이터를 처리하는 중간 서버(프록시)에서 오류가 발생했습니다. ";
                if(parsedMessage.details) {
                    if (parsedMessage.details.toLowerCase().includes("failed to fetch")) {
                         specificProxyErrorMessage += "내부적으로 다른 서비스 연결에 실패했을 수 있습니다 (예: 프록시가 Gemini API에 연결 실패). ";
                    } else {
                        // Include the detail from proxy if it's not "failed to fetch"
                        specificProxyErrorMessage += `문제 상황: ${parsedMessage.details}. `;
                    }
                }
                if (parsedMessage.proxiedUrl) {
                     // This could be logged for developers but not shown to users directly.
                     console.error(`Proxy error for URL: ${parsedMessage.proxiedUrl}`);
                }
                specificProxyErrorMessage += "잠시 후 다시 시도해 주시거나, 문제가 지속되면 사이트 관리자에게 문의해 주세요.";
                isProxyOrNetworkError = true;
            }
        } catch (e) {
            // error.message was not a JSON string or not the expected format.
            // Proceed to more generic error handling.
        }
    }

    if (specificProxyErrorMessage) {
        userFriendlyExplanation = specificProxyErrorMessage;
    } else if (error instanceof TypeError && (error.message.toLowerCase().includes('failed to fetch') || error.message.toLowerCase().includes('networkerror'))) {
      // This handles cases where the client cannot reach the proxy server itself,
      // or if the proxy is down and not returning a structured JSON error.
      userFriendlyExplanation = "서버 또는 네트워크에 연결할 수 없습니다. 다음 사항을 확인해 주세요:\n" +
                                "- 인터넷 연결이 안정적인지 확인해주세요.\n" +
                                "- 브라우저 확장 프로그램, VPN 또는 방화벽이 외부 서비스 연결을 차단하고 있지 않은지 확인해주세요.\n" +
                                "- 현재 사용 중인 네트워크(예: 회사, 학교, 공용 Wi-Fi)에서 사이트 접속에 제한이 없는지 확인해주세요.\n\n" +
                                "잠시 후 다시 시도해 주시고, 문제가 계속되면 사이트 관리자에게 문의해 주십시오.";
      isProxyOrNetworkError = true;
    } else if (error instanceof Error && error.message.toLowerCase().includes("api key")) {
        // This could be an issue with the key provided to the client-side SDK,
        // or an API key related issue reported by the proxy/Gemini.
        userFriendlyExplanation = "API 키 설정 또는 인증에 문제가 있는 것 같습니다. 사이트 관리자에게 문의하세요.";
        isProxyOrNetworkError = true; 
    } else if (error instanceof Error && error.message.toLowerCase().includes("quota")) {
        userFriendlyExplanation = "API 사용량이 할당된 한도를 초과했을 수 있습니다. 사이트 관리자에게 문의하여 확인이 필요합니다.";
        isProxyOrNetworkError = true; 
    }
    else {
      userFriendlyExplanation = "AI 모델과 통신 중 예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
      if (error instanceof Error && error.message && !isProxyOrNetworkError) {
        // For non-proxy/network errors, if the message is very generic from above, 
        // we might append a sanitized version of the error if it's short and not too technical.
        // However, rawErrorString is already captured for debugging.
      }
    }

    return {
        bloomLevel: "평가 오류",
        explanation: userFriendlyExplanation,
        rawResponse: rawErrorString, // Contains the original error message for debugging.
        isProxyOrNetworkError
    };
  }
};