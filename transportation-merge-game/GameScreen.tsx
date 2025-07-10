import React, { useState, useEffect, useRef, useCallback } from 'react';
import Matter from 'matter-js'; 
import useMatterJs from '../hooks/useMatterJs';
import { TransportationType, TransportationInfo } from '../types';
import { TRANSPORTATION_DATA, GAME_WIDTH, GAME_HEIGHT, INITIAL_AVAILABLE_TYPES, WARNING_LINE_Y, DROP_COOLDOWN, MAX_TRANSPORT_LEVEL, LOCAL_STORAGE_HIGH_SCORE_KEY } from '../constants';
import ScoreDisplay from './ScoreDisplay';
import NextItemPreview from './NextItemPreview';
import GameOverModal from './GameOverModal';
import Button from './Button';
import SoundService, { SoundType } from '../services/SoundService';
import EncyclopediaModal, { DiscoveryModalItem } from './EncyclopediaModal';
import ProgressionSidebar from './ProgressionSidebar';


interface GameItemDisplayInfo {
  id: string;
  type: TransportationType;
  x: number;
  y: number;
  radius: number;
  angle: number;
  emoji: string;
  color: string;
  textColor: string;
  level: number;
  showMergeAnimation: boolean;
}

interface GameScreenProps {
  onShowEncyclopedia: () => void;
  unlockedItems: Set<TransportationType>;
  setUnlockedItems: React.Dispatch<React.SetStateAction<Set<TransportationType>>>;
  isPaused: boolean; 
}

const GameScreen: React.FC<GameScreenProps> = ({ onShowEncyclopedia, unlockedItems, setUnlockedItems, isPaused }) => {
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_HIGH_SCORE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [nextItemType, setNextItemType] = useState<TransportationInfo | null>(null);
  const [currentPreviewX, setCurrentPreviewX] = useState(GAME_WIDTH / 2);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameActiveInternal, setIsGameActiveInternal] = useState(false); 
  const [canDrop, setCanDrop] = useState(true);
  const [lastAddedScore, setLastAddedScore] = useState<number | null>(null);

  const [displayedItems, setDisplayedItems] = useState<GameItemDisplayInfo[]>([]);
  const [showDiscoveryDetailModal, setShowDiscoveryDetailModal] = useState<DiscoveryModalItem | null>(null);
  const [showSidebarItemDetailModal, setShowSidebarItemDetailModal] = useState<TransportationInfo | null>(null);
  const [itemsToAnimateMerge, setItemsToAnimateMerge] = useState<Set<string>>(new Set());
  const [isFirstDropOfGame, setIsFirstDropOfGame] = useState(true);

  // Sound state
  const [sfxOn, setSfxOn] = useState(SoundService.isSfxEnabled());
  const [bgmOn, setBgmOn] = useState(SoundService.isBgmEnabled());

  const handleToggleSfx = () => {
    SoundService.toggleSfxEnabled();
    setSfxOn(SoundService.isSfxEnabled());
    // Play a click sound using the new state to confirm
    SoundService.playSound(SoundType.BUTTON_CLICK); 
  };

  const handleToggleBgm = () => {
    SoundService.toggleBgmEnabled();
    const newBgmOn = SoundService.isBgmEnabled();
    setBgmOn(newBgmOn);
    // GameScreen's useEffect for game activity will handle starting/stopping BGM
  };


  useEffect(() => {
    const gameShouldBePhysicallyActive = !isPaused && !showDiscoveryDetailModal && !showSidebarItemDetailModal && !isGameOver;
    setIsGameActiveInternal(gameShouldBePhysicallyActive); 

    if (gameShouldBePhysicallyActive && bgmOn) { // Check local bgmOn state which reflects SoundService.isBgmEnabled()
      SoundService.startBackgroundMusic();
    } else {
      SoundService.pauseBackgroundMusic();
    }
  }, [isPaused, showDiscoveryDetailModal, showSidebarItemDetailModal, isGameOver, bgmOn]); // Added bgmOn


  const generateNextItem = useCallback(() => {
    if (isFirstDropOfGame) return;

    let candidateDropTypes: TransportationType[] = Array.from(unlockedItems);
    candidateDropTypes = candidateDropTypes.filter(typeId => {
        const itemInfo = TRANSPORTATION_DATA[typeId];
        return itemInfo && itemInfo.level <= 4; 
    });
    
    if (candidateDropTypes.length === 0) {
        candidateDropTypes.push(TransportationType.Bicycle); 
        candidateDropTypes = [...new Set(candidateDropTypes)]; 
    }
    
    const randomIndex = Math.floor(Math.random() * candidateDropTypes.length);
    setNextItemType(TRANSPORTATION_DATA[candidateDropTypes[randomIndex]]);
  }, [unlockedItems, isFirstDropOfGame]);


  const handleMerge = useCallback((newType: TransportationType, position: Matter.Vector, points: number): Matter.Body | null => {
    const newMatterBody = currentAddBodyRef.current?.(position.x, position.y, newType, true); 
    
    setScore(prev => prev + points);
    setLastAddedScore(points);
    SoundService.playSound(SoundType.MERGE);

    if (newMatterBody && newMatterBody.customId) {
      setItemsToAnimateMerge(prev => new Set(prev).add(newMatterBody.customId!));
      setTimeout(() => {
        setItemsToAnimateMerge(prev => {
          const newSet = new Set(prev);
          newSet.delete(newMatterBody.customId!);
          return newSet;
        });
      }, 300); 
    }

    if (!unlockedItems.has(newType)) {
      const newlyDiscoveredItemInfo = TRANSPORTATION_DATA[newType];
      setUnlockedItems(prev => {
        const newSet = new Set(prev);
        newSet.add(newType);
        return newSet;
      });
      SoundService.playSound(SoundType.NEW_DISCOVERY);
      
      const isDroppableNowByNewRules = newlyDiscoveredItemInfo.level <= 4; 
      const wasOriginallyDroppable = INITIAL_AVAILABLE_TYPES.some(t => t === newType);

      const discoveryModalData: DiscoveryModalItem = {
        ...newlyDiscoveredItemInfo,
         _isNewlyDiscoveredAndDroppable: isDroppableNowByNewRules && !wasOriginallyDroppable
      };
      setShowDiscoveryDetailModal(discoveryModalData);
      setNextItemType(null); 
    } else {
      generateNextItem();
    }
    return newMatterBody;
  }, [unlockedItems, setUnlockedItems, generateNextItem]); 


  const handleGameOver = useCallback(() => {
      if (!isGameOver) { 
          setIsGameOver(true);
          SoundService.playSound(SoundType.GAME_OVER);
          SoundService.stopBackgroundMusic(); 
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem(LOCAL_STORAGE_HIGH_SCORE_KEY, score.toString());
          }
      }
  }, [isGameOver, score, highScore]);


  const { addBody, getBodyData, clearAllItems, resetPhysicsWorld } = useMatterJs({ 
    gameAreaRef, 
    onMerge: handleMerge,
    onGameOver: handleGameOver,
    isGameActive: isGameActiveInternal
  });
  
  const currentAddBodyRef = useRef(addBody);
  useEffect(() => {
    currentAddBodyRef.current = addBody;
  }, [addBody]);


  const currentResetPhysicsWorldRef = useRef(resetPhysicsWorld);
  useEffect(() => {
    currentResetPhysicsWorldRef.current = resetPhysicsWorld;
  }, [resetPhysicsWorld]);

  useEffect(() => {
    if (!isPaused) { 
        if (isFirstDropOfGame) {
            setNextItemType(TRANSPORTATION_DATA[TransportationType.Bicycle]);
        } else if (!nextItemType && !showDiscoveryDetailModal && !isGameOver) { 
            generateNextItem();
        }
    }
  }, [isPaused, generateNextItem, nextItemType, isFirstDropOfGame, showDiscoveryDetailModal, isGameOver]);


  const handleDropItem = useCallback(() => {
    if (!nextItemType || !canDrop || !isGameActiveInternal || isGameOver || !currentAddBodyRef.current) return;

    SoundService.playSound(SoundType.DROP);
    currentAddBodyRef.current(currentPreviewX, nextItemType.radius + 2, nextItemType.id, false); 
    
    if (isFirstDropOfGame) {
        setIsFirstDropOfGame(false); 
    }
    generateNextItem(); 
    setCanDrop(false);
    setTimeout(() => setCanDrop(true), DROP_COOLDOWN);
  }, [nextItemType, canDrop, isGameActiveInternal, isGameOver, currentPreviewX, generateNextItem, isFirstDropOfGame]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current || !isGameActiveInternal || isGameOver || !nextItemType) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    setCurrentPreviewX(Math.max(nextItemType.radius, Math.min(x, GAME_WIDTH - nextItemType.radius)));
  };
  
  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current || !isGameActiveInternal || isGameOver || !nextItemType) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = event.touches[0].clientX - rect.left;
     setCurrentPreviewX(Math.max(nextItemType.radius, Math.min(x, GAME_WIDTH - nextItemType.radius)));
  };

  const handleRestartGame = () => {
    if (currentResetPhysicsWorldRef.current) {
      currentResetPhysicsWorldRef.current();
    }
    setScore(0);
    setLastAddedScore(null);
    setIsGameOver(false);
    setShowDiscoveryDetailModal(null);
    setShowSidebarItemDetailModal(null);
    setItemsToAnimateMerge(new Set());
    setDisplayedItems([]); 
    setIsFirstDropOfGame(true); 
    setNextItemType(TRANSPORTATION_DATA[TransportationType.Bicycle]); 
    setCanDrop(true);
    
    setUnlockedItems(prev => {
        const newSet = new Set<TransportationType>(); 
        INITIAL_AVAILABLE_TYPES.forEach(type => newSet.add(type));
        newSet.add(TransportationType.Bicycle); 
        return newSet;
    });
    // The main useEffect for isGameActiveInternal and bgmOn will handle BGM restart.
  };
  
  useEffect(() => {
    if (!isGameActiveInternal || !getBodyData ) {
      setDisplayedItems([]); 
      return;
    }

    let animationFrameId: number;
    const renderLoop = () => {
      if (isGameActiveInternal) { 
        const bodies = getBodyData();
        setDisplayedItems(bodies.map(body => ({
          ...body,
          showMergeAnimation: itemsToAnimateMerge.has(body.id)
        })));
        animationFrameId = requestAnimationFrame(renderLoop);
      }
    };
    
    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isGameActiveInternal, getBodyData, itemsToAnimateMerge]); 

  const highestUnlockedLevel = React.useMemo(() => {
    let maxLevel = -1;
    unlockedItems.forEach(typeId => {
      if (TRANSPORTATION_DATA[typeId] && TRANSPORTATION_DATA[typeId].level > maxLevel) {
        maxLevel = TRANSPORTATION_DATA[typeId].level;
      }
    });
    return maxLevel;
  }, [unlockedItems]);


  const handleShowEncyclopediaFromGame = () => {
    setShowDiscoveryDetailModal(null); 
    setShowSidebarItemDetailModal(null); 
    onShowEncyclopedia(); 
  };
  
  const handleCloseDiscoveryModal = () => {
    setShowDiscoveryDetailModal(null);
    if (!nextItemType && !isFirstDropOfGame && !isGameOver && !isPaused) { 
        generateNextItem();
    }
  };

  const handleProgressionItemClick = useCallback((item: TransportationInfo) => {
    if (unlockedItems.has(item.id)) {
      setShowSidebarItemDetailModal(item);
      SoundService.playSound(SoundType.ENCYCLOPEDIA_SELECT);
    }
  }, [unlockedItems]);


  return (
    <React.Fragment>
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center w-full max-w-4xl p-2 sm:p-0"> 
          <div className="flex-grow w-full max-w-md p-4 sm:p-6 glass-pane rounded-5xl shadow-xl font-korean"> 
            <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-sky-700 font-korean whitespace-nowrap overflow-hidden text-ellipsis">🌈 달려라! 교통수단 🚂</h1>
                <div className="flex items-center space-x-1 sm:space-x-2">
                    <Button 
                        onClick={handleToggleSfx} 
                        size="sm" 
                        variant="secondary" 
                        aria-label={sfxOn ? "소리 효과 끄기" : "소리 효과 켜기"}
                        className="!p-1.5 sm:!p-2 !text-lg sm:!text-xl"
                        title={sfxOn ? "SFX 끄기" : "SFX 켜기"}
                        noSound // This button shouldn't make its own click sound via the Button component default
                    >
                        {sfxOn ? '🔊' : '🔇'}
                    </Button>
                    <Button 
                        onClick={handleToggleBgm} 
                        size="sm" 
                        variant="secondary" 
                        aria-label={bgmOn ? "배경 음악 끄기" : "배경 음악 켜기"}
                        className="!p-1.5 sm:!p-2 !text-lg sm:!text-xl"
                        title={bgmOn ? "BGM 끄기" : "BGM 켜기"}
                        noSound
                    >
                        {bgmOn ? '🎵' : <span className="bgm-off-icon">🎵</span>}
                    </Button>
                    <Button 
                        onClick={handleShowEncyclopediaFromGame}
                        size="sm" 
                        variant="secondary" 
                        aria-label="교통수단 도감 보기"
                        className="!p-1.5 sm:!p-2 !text-lg sm:!text-xl"
                        title="도감 보기"
                        noSound 
                    >
                        📖
                    </Button>
                </div>
            </div>

            <ScoreDisplay score={score} highScore={highScore} lastAddedScore={lastAddedScore} />

            <div
              ref={gameAreaRef}
              role="application"
              aria-label="게임 영역"
              className="relative mt-4 sm:mt-6 game-container cursor-pointer overflow-hidden rounded-3xl border-2 border-white/50 bg-sky-100/70 shadow-inner no-select mx-auto"
              style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
              onMouseMove={handleMouseMove}
              onClick={handleDropItem}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleDropItem}
            >
              <div 
                className="absolute w-full border-b-2 border-dashed border-pink-400 opacity-70 pointer-events-none"
                style={{ top: WARNING_LINE_Y -1, height: '1px' }}
                aria-hidden="true"
              ></div>
              <span className="absolute text-base text-pink-500 pointer-events-none bg-white/70 px-2.5 py-1 rounded-full font-semibold" style={{top: WARNING_LINE_Y - 26, left: 10}} aria-hidden="true">
                ⚠️ 조심!
              </span>

              {displayedItems.map(item => (
                <div
                  key={item.id}
                  role="img"
                  aria-label={TRANSPORTATION_DATA[item.type]?.koreanName || '아이템'}
                  className={`absolute rounded-full flex items-center justify-center font-bold text-center no-select 
                              ${item.color} ${item.textColor} ${item.showMergeAnimation ? 'merge-animation' : ''}
                              shadow-lg shadow-inner`}
                  style={{
                    left: item.x - item.radius,
                    top: item.y - item.radius,
                    width: item.radius * 2,
                    height: item.radius * 2,
                    transform: `rotate(${item.angle}rad)`,
                    fontSize: `${Math.max(12, item.radius * 0.8)}px`, 
                    lineHeight: `${item.radius * 2}px`, 
                    zIndex: item.level,
                  }}
                >
                  {item.emoji}
                </div>
              ))}
              <NextItemPreview itemType={nextItemType} positionX={currentPreviewX} gameWidth={GAME_WIDTH} />
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0 sm:ml-6 md:ml-8 w-full sm:w-auto max-w-xs sm:max-w-[200px] md:max-w-[220px] flex-shrink-0 sticky top-6 self-start"> 
             <ProgressionSidebar 
              unlockedItems={unlockedItems} 
              highestUnlockedLevel={highestUnlockedLevel}
              onItemClick={handleProgressionItemClick}
            />
          </div>
        </div>

        {isGameOver && (
          <GameOverModal
            score={score}
            highScore={highScore}
            onRestart={handleRestartGame}
            onShowEncyclopedia={handleShowEncyclopediaFromGame}
          />
        )}
        {showDiscoveryDetailModal && (
          <EncyclopediaModal
            item={showDiscoveryDetailModal}
            onClose={handleCloseDiscoveryModal} 
          />
        )}
        {showSidebarItemDetailModal && (
          <EncyclopediaModal
            item={{ ...showSidebarItemDetailModal, _isNewlyDiscoveredAndDroppable: false }} 
            onClose={() => setShowSidebarItemDetailModal(null)}
          />
        )}
    </React.Fragment>
  );
};

export default GameScreen;