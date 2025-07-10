
import React from 'react';
import { Question as QuestionType } from '../types';
import StyledButton from './StyledButton';

interface QuestionCardProps {
  question: QuestionType;
  onAnswer: (questionId: number, value: number) => void;
  animationDelay: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, animationDelay }) => {
  return (
    <div 
        className="glass-card p-5 sm:p-7 md:p-8 rounded-2xl shadow-2xl w-full max-w-xl md:max-w-2xl animate-slide-up-fade-in opacity-0"
        style={{ animationDelay }}
        role="region"
        aria-labelledby={`question-title-${question.id}`}
    >
      {question.imageUrl && (
        <div className="mb-4 md:mb-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <img
            src={question.imageUrl}
            alt={`질문 ${question.id} 관련 이미지`}
            className="w-full h-40 sm:h-48 md:h-56 object-contain rounded-xl shadow-lg mx-auto"
          />
        </div>
      )}
      <h2 
        id={`question-title-${question.id}`}
        className="text-lg sm:text-xl md:text-2xl font-medium mb-6 md:mb-7 text-center text-slate-100 animate-text-char-by-char"
        style={{ animationDelay: question.imageUrl ? '0.2s' : '0s' }} // Adjust delay if image exists
      >
        {question.text}
      </h2>
      <div className="space-y-3.5 md:space-y-4">
        {question.options.map((option, index) => (
          <StyledButton
            key={option.value}
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              const buttonElement = event.currentTarget as HTMLElement;
              buttonElement.style.transform = 'scale(1.06)';
              buttonElement.classList.add('!bg-pink-500/60', '!border-pink-400', 'ring-4', 'ring-pink-300/60');
              setTimeout(() => {
                onAnswer(question.id, option.value);
              }, 280); 
            }}
            variant="option" 
            fullWidth
            className={`opacity-0 animate-slide-up-fade-in`}
            style={{animationDelay: `${(question.imageUrl ? 0.25 : 0.15) + index * 0.08}s`}} // Adjust delay based on image
            aria-label={option.text}
          >
            {option.text}
          </StyledButton>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;