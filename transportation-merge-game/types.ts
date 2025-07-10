
import Matter from 'matter-js';

export enum TransportationType {
  Bicycle = 0, // 자전거
  Motorcycle,  // 오토바이
  Car,         // 자동차
  Bus,         // 버스
  Truck,       // 트럭
  Train,       // 기차
  Ship,        // 배
  Airplane,    // 비행기
  Rocket,      // 로켓
  Spaceship    // 우주선
}

export interface TransportationInfo {
  id: TransportationType;
  name: string;
  koreanName: string;
  level: number;
  radius: number;
  color: string; // Tailwind bg color class
  textColor: string; // Tailwind text color class
  emoji: string;
  score: number; // Score awarded when this item is created by a merge
  description: string;
  next?: TransportationType; // The type it merges into
}

export interface GameItem {
  id: string; // Unique ID for Matter.js body
  type: TransportationType;
  matterBody: Matter.Body;
}

// For Matter.js Body, using 'label' to store TransportationType as string
// This is a common practice if you don't want to extend Matter.Body type itself
// The module augmentation below is standard. The error "module 'matter-js' cannot be found"
// typically indicates an issue with the TypeScript environment's ability to resolve
// the type declarations for the 'matter-js' module, not an issue with this syntax.
declare module 'matter-js' {
  interface Body {
    customType?: TransportationType;
    customId?: string;
    isMerging?: boolean; // Flag to prevent re-merging during collision event processing
  }
}