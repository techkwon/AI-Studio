import React, { useState } from 'react';
import { SurveyAnswers, Question } from '../types';
import { SURVEY_QUESTIONS } from '../constants';
import { AlertTriangle, ArrowLeft, ArrowRight, Send } from 'lucide-react';

interface SurveyPageProps {
  onSubmit: (answers: SurveyAnswers) => void;
  initialAnswers: SurveyAnswers | null;
  error: string | null;
}

const SurveyPage: React.FC<SurveyPageProps> = ({ onSubmit, initialAnswers, error }) => {
  const [answers, setAnswers] = useState<SurveyAnswers>(
    initialAnswers || { q1: '', q2: '', q3: '', q4: '', q5: '' }
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const totalQuestions = SURVEY_QUESTIONS.length;
  const currentQuestion = SURVEY_QUESTIONS[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id];

  const handleInputChange = (id: keyof SurveyAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const isCurrentQuestionAnswered = () => {
    if (!currentAnswer) return false;
    return currentAnswer.trim() !== '';
  };

  const handleNext = () => {
    if (isCurrentQuestionAnswered() && currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const isFormValid = () => {
    return Object.values(answers).every(answer => answer.trim() !== '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit(answers);
    }
  };

  const renderQuestion = (q: Question) => {
    switch (q.type) {
      case 'multiple-choice':
        return (
          <div key={q.id} className="space-y-3">
            {q.options?.map(opt => (
              <label key={opt.value} className={`block p-4 rounded-lg border cursor-pointer transition-all duration-200 ${answers[q.id] === opt.value ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500' : 'bg-white hover:bg-gray-50 border-gray-300'}`}>
                <input
                  type="radio"
                  name={q.id}
                  value={opt.value}
                  checked={answers[q.id] === opt.value}
                  onChange={() => handleInputChange(q.id, opt.value)}
                  className="sr-only"
                />
                <span className="text-gray-700 font-medium">{opt.label}</span>
              </label>
            ))}
          </div>
        );
      case 'text':
        return (
          <div key={q.id}>
            <textarea
              rows={4}
              placeholder={q.placeholder}
              value={answers[q.id]}
              onChange={(e) => handleInputChange(q.id, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-10 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">브랜딩 분석 설문</h2>
      <p className="text-center text-gray-500 mb-6">솔직한 답변은 더 깊이있는 분석으로 이어집니다.</p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${((currentQuestionIndex) / totalQuestions) * 100}%` }}
        ></div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative mb-6 flex items-start" role="alert">
          <AlertTriangle className="h-5 w-5 mr-3 mt-1" />
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 min-h-[300px]">
        <div key={currentQuestion.id} className="animate-fade-in">
          <label className="block text-lg font-semibold text-gray-700 mb-4">{currentQuestion.text}</label>
          {renderQuestion(currentQuestion)}
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
                type="button"
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ArrowLeft size={20} />
                이전
            </button>

            {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isCurrentQuestionAnswered()}
                    className="flex items-center gap-2 bg-indigo-600 text-white font-bold py-3 px-6 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    다음
                    <ArrowRight size={20} />
                </button>
            ) : (
                <button
                    type="submit"
                    disabled={!isFormValid()}
                    className="flex items-center gap-2 bg-green-500 text-white font-bold py-3 px-6 rounded-full hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    결과 분석 요청하기
                    <Send size={20} />
                </button>
            )}
        </div>
      </form>
    </div>
  );
};

export default SurveyPage;
