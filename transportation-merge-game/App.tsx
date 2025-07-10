
import React, { useState, useEffect } from 'react';
import GameScreen from './components/GameScreen';
import EncyclopediaScreen from './components/EncyclopediaScreen';
import LandingScreen from './components/LandingScreen'; // 추가
import { TransportationType } from './types';
import { LOCAL_STORAGE_UNLOCKED_ITEMS_KEY, TRANSPORTATION_DATA, INITIAL_AVAILABLE_TYPES } from './constants';
import SoundService from './services/SoundService';

export enum AppView { // Exporting for potential use elsewhere, though not strictly needed now
  Landing,
  Game,
  Encyclopedia,
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.Landing);
  const [previousView, setPreviousView] = useState<AppView>(AppView.Landing); // To track where encyclopedia was opened from
  const [unlockedItems, setUnlockedItems] = useState<Set<TransportationType>>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_UNLOCKED_ITEMS_KEY);
    let initialItems = new Set<TransportationType>();
    // Ensure all initially available types are always part of the set, including Bicycle
    INITIAL_AVAILABLE_TYPES.forEach(type => initialItems.add(type));
    initialItems.add(TransportationType.Bicycle);


    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          (parsed as TransportationType[]).forEach(itemType => {
            if (TRANSPORTATION_DATA.hasOwnProperty(itemType)) {
              initialItems.add(itemType);
            }
          });
        }
      } catch (e) {
        console.error("Failed to parse unlocked items from localStorage", e);
      }
    }
    return initialItems;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_UNLOCKED_ITEMS_KEY, JSON.stringify(Array.from(unlockedItems)));
  }, [unlockedItems]);

  const showLanding = () => {
    setCurrentView(AppView.Landing);
  };

  const showGame = () => {
    setCurrentView(AppView.Game);
  };
  
  const showEncyclopedia = () => {
    setPreviousView(currentView); // Store the current view before switching
    setCurrentView(AppView.Encyclopedia);
  };

  const handleCloseEncyclopedia = () => {
    if (previousView === AppView.Landing) {
      showLanding();
    } else {
      showGame(); // Default to game, covers case from Game Over or other future game states
    }
  };

  useEffect(() => {
    if (currentView === AppView.Game) {
      // If the current view is Game, GameScreen's internal useEffect will manage starting the BGM
      // when it becomes active (i.e., not paused by its own modals or game over state).
      // App.tsx's responsibility here is primarily to pause BGM when navigating *away* from the game view.
    } else {
      // If the view is anything other than Game (e.g., Landing, Encyclopedia),
      // ensure the BGM is paused.
      SoundService.pauseBackgroundMusic();
    }
    // Initial audio context activation (due to browser restrictions) is best handled by the first user interaction
    // (e.g., button click on LandingScreen) or specifically by SoundService on the first sound play request.
  }, [currentView]);

  const renderView = () => {
    switch (currentView) {
      case AppView.Landing:
        return <LandingScreen onStartGame={showGame} onShowInstructions={showEncyclopedia} />;
      case AppView.Game:
        return (
          <GameScreen 
            onShowEncyclopedia={showEncyclopedia}
            unlockedItems={unlockedItems}
            setUnlockedItems={setUnlockedItems}
            isPaused={currentView !== AppView.Game} 
          />
        );
      case AppView.Encyclopedia:
        return (
          <EncyclopediaScreen 
            unlockedItems={unlockedItems} 
            onClose={handleCloseEncyclopedia} 
          />
        );
      default:
        return <LandingScreen onStartGame={showGame} onShowInstructions={showEncyclopedia} />;
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 font-sans">
      <div className="w-full h-full flex items-center justify-center">
        {renderView()}
      </div>
    </div>
  );
};

export default App;