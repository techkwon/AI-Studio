import React, { useState, useCallback } from 'react';
import { evaluateQuestionWithGemini } from './services/geminiService';
import { EvaluationResult, Message } from './types';
import LoadingSpinner from './components/LoadingSpinner';
import MessageBox from './components/MessageBox';
import { BLOOM_LEVELS_KOREAN } from './constants';

/**
 * Main application component for the Korean Question Evaluation AI.
 * The layout is designed to be mobile-responsive using Tailwind CSS utility classes.
 * For example, max-w-2xl ensures content is centered and readable on larger screens,
 * while w-full allows it to adapt to smaller screen widths. Font sizes and padding
 * also use responsive prefixes (e.g., md:).
 */
const App: React.FC = () => {
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (text: string, type: Message['type']) => {
    const newMessage = { id: Date.now().toString(), text, type };
    setMessages(prevMessages => {
      // Avoid duplicate messages if text is the same as the last one and type is same
      if (prevMessages.length > 0 && 
          prevMessages[prevMessages.length -1].text === text &&
          prevMessages[prevMessages.length -1].type === type
      ) {
        return prevMessages;
      }
      // Limit number of messages to avoid clutter, e.g., keep last 3-5 messages
      const updatedMessages = [...prevMessages, newMessage];
      // if (updatedMessages.length > 3) {
      //   return updatedMessages.slice(updatedMessages.length - 3);
      // }
      return updatedMessages;
    });
  };

  const dismissMessage = (id: string) => {
    setMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
  };

  const handleSubmit = useCallback(async () => {
    if (!userQuestion.trim()) {
      addMessage('질문을 입력해주세요.', 'error');
      return;
    }

    setIsLoading(true);
    setEvaluation(null);
    // Clearing messages on new submit can be an option, but current behavior (timeout) is also fine.
    // setMessages([]); 

    try {
      const result = await evaluateQuestionWithGemini(userQuestion);
      setEvaluation(result);
      if (result.bloomLevel === "평가 오류") {
        if (result.isProxyOrNetworkError) {
             addMessage('서버 또는 네트워크 오류가 발생했습니다. 자세한 내용은 아래 결과창을 확인하세요.', 'error');
        } else {
            const toastMessage = (result.explanation && result.explanation.length > 100) 
                ? "오류가 발생했습니다. 상세 내용은 결과창을 확인하세요." 
                : result.explanation || '평가 중 구체적인 오류 내용을 파악하지 못했습니다.'; // Fallback if explanation is empty
            addMessage(toastMessage, 'error');
        }
      } else {
        addMessage('질문 평가가 완료되었습니다.', 'success');
      }
    } catch (error) { 
      // This catch block in App.tsx is a final fallback. 
      // Most errors should be caught and processed within geminiService.
      console.error('Critical error during evaluation in App.tsx (should be rare):', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 치명적 오류가 발생했습니다.';
      const criticalErrorResult: EvaluationResult = {
        bloomLevel: "평가 오류",
        explanation: `애플리케이션 처리 중 예기치 않은 심각한 오류가 발생했습니다: ${errorMessage}. 사이트 관리자에게 문의가 필요할 수 있습니다.`,
        rawResponse: error instanceof Error ? error.toString() : String(error),
        isProxyOrNetworkError: true, // Treat as a significant issue for UI reporting
      };
      setEvaluation(criticalErrorResult);
      addMessage('치명적인 오류가 발생했습니다. 아래 결과창에서 상세 내용을 확인하세요.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [userQuestion]); // addMessage was removed from dependencies as its definition is stable if not using useCallback(addMessage, [setMessages])

  return (
    <>
      {messages.map(msg => (
        <MessageBox key={msg.id} message={msg} onDismiss={dismissMessage} />
      ))}
      <div className="bg-slate-800 shadow-2xl rounded-xl p-6 md:p-10 w-full max-w-2xl border border-slate-700">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-sky-400">질문 평가 AI</h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base">블룸의 교육목표 분류법에 따라 질문의 수준을 평가합니다.</p>
        </header>

        <main>
          <div className="mb-6">
            <label htmlFor="userQuestion" className="block mb-2 text-sm font-medium text-sky-300">평가할 질문을 입력하세요:</label>
            <textarea
              id="userQuestion"
              rows={4}
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-slate-500 transition-colors duration-200"
              placeholder="예: 대한민국의 수도는 어디인가요? 또는, 기후 변화가 미래 사회에 미칠 장기적인 영향은 무엇이라고 예상하며, 이를 해결하기 위한 혁신적인 방안은 무엇일까요?"
              disabled={isLoading}
              aria-required="true"
              aria-describedby={evaluation && evaluation.bloomLevel === "평가 오류" ? "evaluation-result-heading" : undefined}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !userQuestion.trim()} // Disable if textarea is empty
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '평가 중...' : '질문 평가하기'}
          </button>

          {isLoading && <LoadingSpinner />}

          {evaluation && !isLoading && (
            <div className="mt-8 p-6 bg-slate-700 rounded-lg shadow-inner border border-slate-600" role="region" aria-labelledby="evaluation-result-heading">
              <h2 id="evaluation-result-heading" className="text-xl font-semibold mb-3 text-sky-400">AI 평가 결과:</h2>
              <div className="mb-2 text-slate-200">
                <strong>블룸 수준:</strong> {evaluation.bloomLevel}
              </div>
              <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                {evaluation.explanation}
              </div>
              {/* 
                Development/Debug: Optionally display rawResponse for easier debugging of proxy/API errors.
                This should be turned off in production builds or gated by an admin flag.
              */}
              {/* { (process.env.NODE_ENV === 'development' || window.location.search.includes('debug=true')) && evaluation.rawResponse && (
                <details className="mt-4 text-xs">
                  <summary className="cursor-pointer text-slate-400 hover:text-slate-200">
                    개발자 정보 (오류 원본 메시지)
                  </summary>
                  <pre className="mt-2 p-2 bg-slate-800 rounded overflow-auto text-slate-400 text-left">
                    {evaluation.rawResponse}
                  </pre>
                </details>
              )} */}
            </div>
          )}
        </main>

        <footer className="mt-10 text-center text-xs text-slate-500">
          <p>
            이 사이트는 <a href="https://ask.smile.seedsofempowerment.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-sky-400">원본 사이트</a>를 한글화한 버전입니다.
          </p>
          <p className="mt-1">Created by TechKwon.</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} AI 질문 평가 도구. Gemini API 활용.</p>
          <p className="mt-1">블룸의 교육목표 분류법: {BLOOM_LEVELS_KOREAN.join(', ')}</p>
        </footer>
      </div>
    </>
  );
};

export default App;