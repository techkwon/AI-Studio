
import Matter from 'matter-js';
import { TransportationType, TransportationInfo } from './types';

export const GAME_WIDTH = 320; // Game area width in pixels (Was 400)
export const GAME_HEIGHT = 480; // Game area height in pixels (Was 600)
export const WARNING_LINE_Y_RATIO = 0.15; // Percentage from top
export const WARNING_LINE_Y = GAME_HEIGHT * WARNING_LINE_Y_RATIO;

// Radii calculation:
// R_MIN for Bicycle = 18px
// R_MAX for Spaceship = floor(GAME_WIDTH * 2/3) = floor(320 * 2/3) = 106px
// Formula: R_MIN + floor(((R_MAX - R_MIN) * level) / MAX_LEVEL)
// Max level = 9 (0-indexed)
const R_MIN = 18; 
const R_MAX = 106; // Spaceship size, GAME_WIDTH * 2/3

export const TRANSPORTATION_DATA: Readonly<Record<TransportationType, TransportationInfo>> = {
  [TransportationType.Bicycle]: {
    id: TransportationType.Bicycle,
    name: "Bicycle",
    koreanName: "자전거",
    level: 0,
    radius: R_MIN + Math.floor(((R_MAX - R_MIN) * 0) / 9), // 18
    color: "bg-blue-300",
    textColor: "text-blue-800",
    emoji: "🚲",
    score: 10,
    description: "두 바퀴로 달리는 멋진 자전거! 페달을 밟아 앞으로 나아가요.",
    next: TransportationType.Motorcycle,
  },
  [TransportationType.Motorcycle]: {
    id: TransportationType.Motorcycle,
    name: "Motorcycle",
    koreanName: "오토바이",
    level: 1,
    radius: R_MIN + Math.floor(((R_MAX - R_MIN) * 1) / 9), // 18 + 9 = 27
    color: "bg-green-300",
    textColor: "text-green-800",
    emoji: "🛵",
    score: 20,
    description: "엔진 소리가 신나는 오토바이! 바람을 가르며 달려요.",
    next: TransportationType.Car,
  },
  [TransportationType.Car]: {
    id: TransportationType.Car,
    name: "Car",
    koreanName: "자동차",
    level: 2,
    radius: R_MIN + Math.floor(((R_MAX - R_MIN) * 2) / 9), // 18 + 19 = 37
    color: "bg-yellow-300",
    textColor: "text-yellow-800",
    emoji: "🚗",
    score: 40,
    description: "우리 가족과 함께 여행을 떠날 수 있는 자동차예요!",
    next: TransportationType.Bus,
  },
  [TransportationType.Bus]: {
    id: TransportationType.Bus,
    name: "Bus",
    koreanName: "버스",
    level: 3,
    radius: R_MIN + Math.floor(((R_MAX - R_MIN) * 3) / 9), // 18 + 29 = 47
    color: "bg-orange-300",
    textColor: "text-orange-800",
    emoji: "🚌",
    score: 80,
    description: "많은 사람을 한 번에 태우고, 정해진 길을 따라 도시 곳곳을 달려요!",
    next: TransportationType.Truck,
  },
  [TransportationType.Truck]: {
    id: TransportationType.Truck,
    name: "Truck",
    koreanName: "트럭",
    level: 4,
    radius: R_MIN + Math.floor(((R_MAX - R_MIN) * 4) / 9), // 18 + 39 = 57
    color: "bg-red-300",
    textColor: "text-red-800",
    emoji: "🚚",
    score: 150,
    description: "무거운 짐도 씩씩하게 옮기는 힘센 트럭이에요!",
    next: TransportationType.Train,
  },
  [TransportationType.Train]: {
    id: TransportationType.Train,
    name: "Train",
    koreanName: "기차",
    level: 5,
    radius: R_MIN + Math.floor(((R_MAX - R_MIN) * 5) / 9), // 18 + 48 = 66
    color: "bg-purple-300",
    textColor: "text-purple-800",
    emoji: "🚆",
    score: 300,
    description: "칙칙폭폭! 길다란 몸으로 많은 사람과 물건을 실어 날라요.",
    next: TransportationType.Ship,
  },
  [TransportationType.Ship]: {
    id: TransportationType.Ship,
    name: "Ship",
    koreanName: "배",
    level: 6,
    radius: R_MIN + Math.floor(((R_MAX - R_MIN) * 6) / 9), // 18 + 58 = 76
    color: "bg-cyan-300",
    textColor: "text-cyan-800",
    emoji: "🚢",
    score: 500,
    description: "넓은 바다 위를 항해하며 사람과 물건을 실어 나르는 배예요.",
    next: TransportationType.Airplane,
  },
  [TransportationType.Airplane]: {
    id: TransportationType.Airplane,
    name: "Airplane",
    koreanName: "비행기",
    level: 7,
    radius: R_MIN + Math.floor(((R_MAX - R_MIN) * 7) / 9), // 18 + 68 = 86
    color: "bg-indigo-300",
    textColor: "text-indigo-800",
    emoji: "✈️",
    score: 800,
    description: "하늘을 훨훨 날아 세계 여러 나라로 빠르게 갈 수 있어요!",
    next: TransportationType.Rocket,
  },
  [TransportationType.Rocket]: {
    id: TransportationType.Rocket,
    name: "Rocket",
    koreanName: "로켓",
    level: 8,
    radius: R_MIN + Math.floor(((R_MAX - R_MIN) * 8) / 9), // 18 + 78 = 96
    color: "bg-pink-300",
    textColor: "text-pink-800",
    emoji: "🚀",
    score: 1200,
    description: "엄청난 속도로 하늘 높이 솟아올라 우주로 향하는 로켓이에요!",
    next: TransportationType.Spaceship,
  },
  [TransportationType.Spaceship]: {
    id: TransportationType.Spaceship,
    name: "Spaceship",
    koreanName: "우주선",
    level: 9, // Final level
    radius: R_MAX, // 106
    color: "bg-slate-400",
    textColor: "text-slate-800",
    emoji: "🌌",
    score: 2000, // Score for creating the final item
    description: "지구를 떠나 신비한 우주를 탐험할 수 있는 가장 빠른 교통수단이에요!",
    // No next type
  },
};

export const INITIAL_AVAILABLE_TYPES: TransportationType[] = [
  TransportationType.Bicycle,
  TransportationType.Motorcycle,
];

export const MAX_TRANSPORT_LEVEL = Object.keys(TRANSPORTATION_DATA).length -1;

export const LOCAL_STORAGE_HIGH_SCORE_KEY = 'transportationMergeGameHighScore';
export const LOCAL_STORAGE_UNLOCKED_ITEMS_KEY = 'transportationMergeGameUnlockedItems';

// Physics properties
export const ITEM_OPTIONS: Matter.IBodyDefinition = {
  restitution: 0.3, 
  friction: 0.1,    
  density: 0.001,   
  slop: 0.01,       
  render: { visible: false } 
};

export const WALL_THICKNESS = 50; 

export const DROP_COOLDOWN = 500;