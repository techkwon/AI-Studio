
import React, { useState, useEffect, useCallback } from 'react';
import { Screen, Answer, AnimalTypeKey, AnimalPersona } from './types';
import { QUESTIONS, ANIMAL_PERSONAS, SCORING_MATRIX } from './constants';
import SplashScreen from './components/SplashScreen';
import QuestionScreen from './components/QuestionScreen';
import LoadingScreen from './components/LoadingScreen';
import ResultScreen from './components/ResultScreen';
import AllPersonasScreen from './components/AllPersonasScreen'; // Import new screen
import FloatingIconsBackground from './components/FloatingIconsBackground';

const ScreenTransition: React.FC<{children: React.ReactNode; screenKey: Screen}> = ({ children, screenKey }) => {
  const [visible, setVisible] = useState(false);
  const [internalChildren, setInternalChildren] = useState(children);
  const [internalScreenKey, setInternalScreenKey] = useState(screenKey);

  useEffect(() => {
    if (screenKey !== internalScreenKey) {
      setVisible(false); 
      const timer = setTimeout(() => {
        setInternalChildren(children); 
        setInternalScreenKey(screenKey); 
        setVisible(true); 
      }, 350); 
      return () => clearTimeout(timer);
    } else {
      if (children !== internalChildren) {
        setInternalChildren(children);
      }
      if (!visible) {
        setVisible(true);
      }
    }
  }, [children, screenKey, internalScreenKey, internalChildren, visible]);


  return (
    <div
      className={`transition-opacity duration-300 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'} relative z-[2]`}
    >
      {internalChildren}
    </div>
  );
};


const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.SPLASH);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [resultAnimalKey, setResultAnimalKey] = useState<AnimalTypeKey | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentScreen]);

  const handleStartTest = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResultAnimalKey(null);
    setCurrentScreen(Screen.SPLASH); // Changed to SPLASH screen
  }, []);

  const handleShowAllPersonas = useCallback(() => {
    setCurrentScreen(Screen.ALL_PERSONAS);
  }, []);

  const handleAnswer = useCallback((answer: Answer) => {
    setAnswers(prevAnswers => [...prevAnswers, answer]);
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setCurrentScreen(Screen.LOADING);
    }
  }, [currentQuestionIndex]);

  const calculateResult = useCallback(() => {
    const scores: Record<AnimalTypeKey, number> = {
      desertFox: 0,
      meerkat: 0,
      polarBear: 0,
      hamster: 0,
      wiseOwl: 0,
      busyBeaver: 0,
      slyChameleon: 0,
      loyalDog: 0,
      loneWolf: 0,
      socialParrot: 0,
    };

    answers.forEach(answer => {
      const questionScores = SCORING_MATRIX[answer.questionId]?.[answer.value];
      if (questionScores) {
        for (const animalKey in questionScores) {
          const key = animalKey as AnimalTypeKey;
          scores[key] = (scores[key] || 0) + (questionScores[key] || 0);
        }
      }
    });

    let maxScore = -1;
    let finalAnimal: AnimalTypeKey = 'desertFox';

    const preferenceOrder: AnimalTypeKey[] = [
        'desertFox', 'wiseOwl', 'loyalDog', 'hamster',
        'slyChameleon', 'polarBear', 'meerkat',
        'socialParrot', 'busyBeaver', 'loneWolf'
    ];

    let bestFitAnimals: AnimalTypeKey[] = [];

    (Object.keys(scores) as AnimalTypeKey[]).forEach(key => {
        if (scores[key] > maxScore) {
            maxScore = scores[key];
            bestFitAnimals = [key];
        } else if (scores[key] === maxScore) {
            bestFitAnimals.push(key);
        }
    });

    if (bestFitAnimals.length === 0 && maxScore <=0 ) {
       finalAnimal = preferenceOrder[Math.floor(Math.random() * preferenceOrder.length)];
    } else if (bestFitAnimals.length === 1) {
        finalAnimal = bestFitAnimals[0];
    } else if (bestFitAnimals.length > 1) {
        finalAnimal = bestFitAnimals.sort((a, b) => preferenceOrder.indexOf(a) - preferenceOrder.indexOf(b))[0];
    }

    setResultAnimalKey(finalAnimal);
  }, [answers]);

  useEffect(() => {
    if (currentScreen === Screen.LOADING) {
      calculateResult();
      const timer = setTimeout(() => {
        setCurrentScreen(Screen.RESULT);
      }, 3800); 
      return () => clearTimeout(timer);
    }
  }, [currentScreen, calculateResult]);

  const renderScreen = () => {
    let screenComponent;
    switch (currentScreen) {
      case Screen.SPLASH:
        screenComponent = <SplashScreen onStart={() => setCurrentScreen(Screen.QUESTION)} />; // Start goes to Question
        break;
      case Screen.QUESTION:
        screenComponent = (
          <QuestionScreen
            questions={QUESTIONS}
            currentQuestionIndex={currentQuestionIndex}
            onAnswer={handleAnswer}
          />
        );
        break;
      case Screen.LOADING:
        screenComponent = <LoadingScreen />;
        break;
      case Screen.RESULT:
        if (resultAnimalKey && ANIMAL_PERSONAS[resultAnimalKey]) {
          screenComponent = (
            <ResultScreen 
              animalPersona={ANIMAL_PERSONAS[resultAnimalKey]} 
              onRestart={handleStartTest} // This now goes to SPLASH
              onShowAllPersonas={handleShowAllPersonas} // Pass new handler
            />
          );
        } else {
          console.warn("Result animal key not found or invalid, returning to splash.");
          setCurrentScreen(Screen.SPLASH); 
          screenComponent = <SplashScreen onStart={() => setCurrentScreen(Screen.QUESTION)} />;
        }
        break;
      case Screen.ALL_PERSONAS: // Handle new screen
        screenComponent = (
          <AllPersonasScreen 
            personas={Object.values(ANIMAL_PERSONAS)}
            onGoHome={handleStartTest} // Go to SPLASH
          />
        );
        break;
      default:
        screenComponent = <SplashScreen onStart={() => setCurrentScreen(Screen.QUESTION)} />;
    }
    return <ScreenTransition screenKey={currentScreen}>{screenComponent}</ScreenTransition>;
  };

  return (
    <div className="min-h-screen w-full bg-transparent">
      <FloatingIconsBackground />
      {renderScreen()}
    </div>
  );
};

export default App;