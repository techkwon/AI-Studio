

import React, { useState, useEffect, useCallback } from 'react';
import { GameScreen, Mentor, Question, ScoreFeedback, Character, Answer } from './types';
import { MENTORS, SAFETY_PRINCIPLES, QUESTIONS, CHARACTERS, IMAGE_GENERATION_ERROR_PLACEHOLDER } from './constants';
import { evaluatePrompt, generateImage } from './services/geminiService';

import StartScreen from './components/StartScreen';
import MentorSelectionScreen from './components/MentorSelectionScreen';
import ProblemScreen from './components/ProblemScreen';
import ResultScreen from './components/ResultScreen';
import Modal from './components/Modal';
import LoadingSpinner from './components/LoadingSpinner';

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>(GameScreen.Start);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  
  const [questions, setQuestions] = useState<Question[]>([]); // Will hold the 3 selected questions for the game
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  
  const [currentScoreFeedback, setCurrentScoreFeedback] = useState<ScoreFeedback | null>(null);
  const [totalScore, setTotalScore] = useState(0); // This will be the average score of 3 questions, scaled to 0-100
  const [finalCharacter, setFinalCharacter] = useState<Character | null>(null);
  
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null); 

  const [startScreenImage, setStartScreenImage] = useState<string | null>(null);
  const [isStartScreenImageLoading, setIsStartScreenImageLoading] = useState(true);

  const [mentorImageLoadingStates, setMentorImageLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [mentorGeneratedImages, setMentorGeneratedImages] = useState<{ [key: string]: string | undefined }>({});
  
  const [currentMentorExpressionImage, setCurrentMentorExpressionImage] = useState<string | null>(null);
  const [isExpressionImageLoading, setIsExpressionImageLoading] = useState(false);


  const fetchStartScreenImage = async () => {
    setIsStartScreenImageLoading(true);
    try {
      const prompt = "Cover art for 'AI Prompt Adventure' game. A vibrant and exciting scene where cute, diverse animal characters (an owl, a cat, a dolphin) joyfully embark on a quest. They are heading towards a glowing, friendly AI brain icon or a magical, open book of knowledge. Style: Webtoon, playful, inviting, bright colors, detailed background suggesting a fun digital world. Full illustration.";
      const imageUrl = await generateImage(prompt);
      setStartScreenImage(imageUrl);
    } catch (e) {
      console.error("시작 화면 이미지 생성 실패:", e);
      setStartScreenImage(IMAGE_GENERATION_ERROR_PLACEHOLDER);
    } finally {
      setIsStartScreenImageLoading(false);
    }
  };

 useEffect(() => {
    fetchStartScreenImage();
    MENTORS.forEach(mentor => {
      if (!mentorGeneratedImages[mentor.id]) {
        fetchMentorImage(mentor);
      }
    });
  }, []); 


  const fetchMentorImage = async (mentor: Mentor) => {
    setMentorImageLoadingStates(prev => ({ ...prev, [mentor.id]: true }));
    try {
      const prompt = `${mentor.basePrompt}. Full body shot, standing in a friendly and welcoming pose. Simple, clear background suitable for a character card. Webtoon style, cute.`;
      const imageUrl = await generateImage(prompt);
      setMentorGeneratedImages(prev => ({ ...prev, [mentor.id]: imageUrl }));
    } catch (e) {
      console.error("멘토 이미지 생성 실패:", e);
      setMentorGeneratedImages(prev => ({...prev, [mentor.id]: IMAGE_GENERATION_ERROR_PLACEHOLDER}));
    } finally {
      setMentorImageLoadingStates(prev => ({ ...prev, [mentor.id]: false }));
    }
  };
  
  const emotionToPromptDetail = (emotion: string): string => {
    switch (emotion.toLowerCase()) {
      case 'happy':
      case 'proud':
      case 'proud_impressed':
        return "smiling happily and proudly, looking very pleased";
      case 'encouraging':
      case 'thoughtful':
        return "with a thoughtful and encouraging smile, looking supportive";
      case 'concerned_hopeful':
        return "looking slightly concerned but with a hopeful and gentle expression";
      case 'neutral':
      case 'calm':
        return "with a calm and neutral expression, attentive";
      default:
        return `with a friendly expression, possibly reflecting ${emotion}`;
    }
  };

  const initializeGame = useCallback(() => {
    const allQuestions = QUESTIONS; // Use the full list from constants
    const shuffledQuestions = shuffleArray(allQuestions);
    const selectedGameQuestions = shuffledQuestions.slice(0, 3); // Select 3 questions for the game

    setQuestions(selectedGameQuestions);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setTotalScore(0);
    setFinalCharacter(null);
    setSelectedMentor(null);
    setCurrentScoreFeedback(null);
    setError(null);
    setIsLoading(false);
    setCurrentMentorExpressionImage(null);
    setIsExpressionImageLoading(false);
  }, []);

  useEffect(() => {
    // This effect is kept for potential future use if game state needs to be reset
    // when currentScreen changes in a specific way, but initializeGame() is the primary
    // mechanism for resetting and starting a new game.
    if(currentScreen !== GameScreen.Start) { 
        // For now, simple game init.
    }
  }, [initializeGame, currentScreen]);


  const handleStart = () => {
    initializeGame(); 
    setCurrentScreen(GameScreen.MentorSelection);
  };

  const handleMentorSelect = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    if (!mentorGeneratedImages[mentor.id] && !mentorImageLoadingStates[mentor.id]) {
      fetchMentorImage(mentor); 
    }
    setIsSafetyModalOpen(true);
  };

  const handleSafetyModalClose = () => { 
    setIsSafetyModalOpen(false);
    setCurrentScreen(GameScreen.Problem);
  };

  const handleSafetyModalDismiss = () => { 
    setIsSafetyModalOpen(false);
    setSelectedMentor(null); 
  };

  const handleSubmitPrompt = async (userPrompt: string) => {
    setIsLoading(true); 
    setIsExpressionImageLoading(true); 
    setError(null);
    setCurrentScoreFeedback(null);
    setCurrentMentorExpressionImage(null);

    try {
      const result = await evaluatePrompt(userPrompt);
      setCurrentScoreFeedback(result);
      setAnswers(prev => [...prev, { 
        questionId: questions[currentQuestionIndex].id, 
        userPrompt, 
        score: result.score, 
        feedback: result.feedback 
      }]);

      if (selectedMentor) {
        const expressionDetail = emotionToPromptDetail(result.emotionKeyword);
        const expressionPrompt = `${selectedMentor.basePrompt}. ${expressionDetail}. Upper body shot, clearly expressing the described emotion. Simple, clear background. Webtoon style, cute.`;
        const expressionImgUrl = await generateImage(expressionPrompt);
        setCurrentMentorExpressionImage(expressionImgUrl);
      } else {
         setCurrentMentorExpressionImage(IMAGE_GENERATION_ERROR_PLACEHOLDER);
      }

    } catch (e: any) {
      setError(e.message || "프롬프트 채점 중 오류가 발생했습니다.");
      console.error("Error during prompt submission:", e); 
      setCurrentScoreFeedback({ score: 0, feedback: e.message || "오류가 발생하여 채점할 수 없었습니다.", emotionKeyword: 'concerned_hopeful'});
      setCurrentMentorExpressionImage(IMAGE_GENERATION_ERROR_PLACEHOLDER);
    } finally {
      setIsLoading(false);
      setIsExpressionImageLoading(false);
    }
  };

  const handleNextProblem = async () => {
    setCurrentScoreFeedback(null);
    setCurrentMentorExpressionImage(null);
    setIsExpressionImageLoading(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate average score from 3 questions, then scale to 0-100 for character assignment
      const sumOfScores = answers.reduce((sum, ans) => sum + ans.score, 0);
      // Each question is scored 0-100. Average of 3 questions.
      const averageScore = answers.length > 0 ? Math.round(sumOfScores / answers.length) : 0;
      setTotalScore(averageScore); // Store the average score (0-100)
      
      // CHARACTERS min/maxScore are already 0-100 based.
      const characterData = CHARACTERS.find(c => averageScore >= c.minScore && averageScore <= c.maxScore) || CHARACTERS[0];
      
      setFinalCharacter(characterData); 
      setCurrentScreen(GameScreen.Result);
    }
  };

  const handleTryAgain = () => {
    initializeGame();
    if (!startScreenImage || startScreenImage === IMAGE_GENERATION_ERROR_PLACEHOLDER) {
        fetchStartScreenImage();
    }
    MENTORS.forEach(mentor => {
      if (!mentorGeneratedImages[mentor.id] || mentorGeneratedImages[mentor.id] === IMAGE_GENERATION_ERROR_PLACEHOLDER) {
        fetchMentorImage(mentor);
      }
    });
    setCurrentScreen(GameScreen.Start);
  };
  
  // Removed the useEffect that unconditionally set questions from QUESTIONS
  // as initializeGame now handles setting the 3 random questions for the game.

  if (isStartScreenImageLoading && currentScreen === GameScreen.Start) {
     return <div className="flex items-center justify-center min-h-screen"><LoadingSpinner/></div>;
  }


  const renderScreen = () => {
    switch (currentScreen) {
      case GameScreen.Start:
        return <StartScreen 
                  onStart={handleStart} 
                  imageUrl={startScreenImage} 
                  isLoadingImage={isStartScreenImageLoading} 
               />;
      case GameScreen.MentorSelection:
        return (
            <MentorSelectionScreen 
                mentors={MENTORS} 
                onSelectMentor={handleMentorSelect}
                mentorImageLoadingStates={mentorImageLoadingStates}
                mentorGeneratedImages={mentorGeneratedImages}
            />
        );
      case GameScreen.Problem:
        if (!questions || questions.length === 0 || currentQuestionIndex >= questions.length) {
            if (isLoading && questions.length === 0) return <div className="flex items-center justify-center min-h-screen"><LoadingSpinner/></div>; // Show loader if questions are truly not ready
            return <div className="text-center p-8 text-lg text-white">문제 로딩 중 오류가 발생했거나, 게임이 아직 시작되지 않았습니다. <button onClick={handleTryAgain} className="text-pink-300 underline">다시 시작</button></div>;
        }
        return (
          <ProblemScreen
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length} // This will be 3
            onSubmitPrompt={handleSubmitPrompt}
            onNext={handleNextProblem}
            isLoading={isLoading} 
            currentScoreFeedback={currentScoreFeedback}
            selectedMentorName={selectedMentor?.name}
            mentorExpressionImage={currentMentorExpressionImage}
            isExpressionImageLoading={isExpressionImageLoading}
          />
        );
      case GameScreen.Result:
        return (
            <ResultScreen 
                totalScore={totalScore} // This is the average score (0-100)
                character={finalCharacter} 
                onTryAgain={handleTryAgain} 
                selectedMentorName={selectedMentor?.name}
            />
        );
      default:
        return <StartScreen 
                  onStart={handleStart}
                  imageUrl={startScreenImage}
                  isLoadingImage={isStartScreenImageLoading} 
                />;
    }
  };

  return (
    <div className="min-h-screen bg-transparent"> 
      {renderScreen()}
      {selectedMentor && (
        <Modal
          isOpen={isSafetyModalOpen}
          onClose={handleSafetyModalClose} 
          onDismiss={handleSafetyModalDismiss} 
          title={`${selectedMentor.name}의 안전 프롬프트 가이드 📜`}
        >
          <ul className="space-y-2 list-disc list-inside">
            {SAFETY_PRINCIPLES.map((principle, index) => (
              <li key={index}>{principle}</li> 
            ))}
          </ul>
          <p className="mt-4 font-semibold text-gray-100">AI와 즐겁고 안전하게 대화하려면 이 원칙들을 꼭 기억해주세요!</p>
        </Modal>
      )}
    </div>
  );
};

export default App;