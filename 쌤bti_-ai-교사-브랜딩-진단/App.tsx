
import React, { useState, useCallback } from 'react';
import { AppState, SurveyAnswers, SsaemBtiResult } from './types';
import { generateReport } from './services/geminiService';
import StartPage from './components/StartPage';
import SurveyPage from './components/SurveyPage';
import LoadingPage from './components/LoadingPage';
import ResultPage from './components/ResultPage';

function App() {
  const [appState, setAppState] = useState<AppState>('start');
  const [answers, setAnswers] = useState<SurveyAnswers | null>(null);
  const [result, setResult] = useState<SsaemBtiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    setAppState('survey');
    setResult(null);
    setError(null);
    setAnswers(null);
  };

  const handleSubmit = useCallback(async (submittedAnswers: SurveyAnswers) => {
    setAnswers(submittedAnswers);
    setAppState('loading');
    setError(null);
    try {
      const reportResult = await generateReport(submittedAnswers);
      setResult(reportResult);
      setAppState('result');
    } catch (e) {
      const err = e as Error;
      setError(`분석 중 오류가 발생했습니다: ${err.message}. 잠시 후 다시 시도해주세요.`);
      setAppState('survey'); // Go back to survey on error
    }
  }, []);

  const renderPage = () => {
    switch (appState) {
      case 'start':
        return <StartPage onStart={handleStart} />;
      case 'survey':
        return <SurveyPage onSubmit={handleSubmit} initialAnswers={answers} error={error} />;
      case 'loading':
        return <LoadingPage />;
      case 'result':
        return result && <ResultPage result={result} onRestart={handleStart} />;
      default:
        return <StartPage onStart={handleStart} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full flex items-center justify-center p-4 transition-all duration-500">
      <div className="w-full max-w-2xl mx-auto">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
