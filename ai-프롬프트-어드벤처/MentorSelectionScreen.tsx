import React from 'react';
import { Mentor } from '../types';
import MentorCard from './MentorCard';

interface MentorSelectionScreenProps {
  mentors: Mentor[];
  onSelectMentor: (mentor: Mentor) => void;
  mentorImageLoadingStates: { [key: string]: boolean };
  mentorGeneratedImages: { [key: string]: string | undefined };
}

const MentorSelectionScreen: React.FC<MentorSelectionScreenProps> = ({ 
  mentors, 
  onSelectMentor,
  mentorImageLoadingStates,
  mentorGeneratedImages
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 text-center">멘토를 선택해주세요!</h2>
      <p className="text-lg sm:text-xl text-gray-200 mb-8 sm:mb-10 text-center">AI 프롬프트 여정을 함께할 든든한 친구를 골라보세요.</p>
      <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
        {mentors.map((mentor) => (
          <MentorCard 
            key={mentor.id} 
            mentor={{...mentor, generatedImage: mentorGeneratedImages[mentor.id]}}
            onSelect={() => onSelectMentor(mentor)} 
            isLoadingImage={!!mentorImageLoadingStates[mentor.id]}
          />
        ))}
      </div>
    </div>
  );
};

export default MentorSelectionScreen;