
import React from 'react';
import { Question as QuestionType, Answer } from '../types';
import ProgressBar from './ProgressBar';
import QuestionCard from './QuestionCard';

interface QuestionScreenProps {
  questions: QuestionType[];
  currentQuestionIndex: number;
  onAnswer: (answer: Answer) => void;
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({ questions, currentQuestionIndex, onAnswer }) => {
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (questionId: number, value: number) => {
    onAnswer({ questionId, value });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-4 transition-opacity duration-500 ease-in-out">
      <div className="w-full max-w-xl md:max-w-2xl mb-4 md:mb-6 px-2 sm:px-0">
         <ProgressBar current={currentQuestionIndex + 1} total={questions.length} />
      </div>
      {currentQuestion && (
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          onAnswer={handleAnswerSelect}
          animationDelay="0.1s" // Stagger animation slightly
        />
      )}
    </div>
  );
};

export default QuestionScreen;
