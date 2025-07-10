
import React, { useEffect, useRef, useCallback } from 'react';
import Matter from 'matter-js';
import { TransportationType, TransportationInfo } from '../types'; 
import { TRANSPORTATION_DATA, GAME_WIDTH, GAME_HEIGHT, ITEM_OPTIONS, WALL_THICKNESS, WARNING_LINE_Y, MAX_TRANSPORT_LEVEL } from '../constants';

interface UseMatterJsParams {
  gameAreaRef: React.RefObject<HTMLDivElement>;
  onMerge: (newType: TransportationType, position: Matter.Vector, score: number) => Matter.Body | null;
  onGameOver: () => void;
  isGameActive: boolean;
}

const useMatterJs = ({ gameAreaRef, onMerge, onGameOver, isGameActive }: UseMatterJsParams) => {
  const engineRef = useRef<Matter.Engine | null>(null);
  const rendererRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const bodiesMapRef = useRef<Map<string, Matter.Body>>(new Map());

  const onMergeRef = useRef(onMerge);
  const onGameOverRef = useRef(onGameOver);

  useEffect(() => {
    onMergeRef.current = onMerge;
  }, [onMerge]);

  useEffect(() => {
    onGameOverRef.current = onGameOver;
  }, [onGameOver]);

  const cleanupMatter = useCallback(() => {
    if (rendererRef.current) {
      Matter.Render.stop(rendererRef.current);
      if (rendererRef.current.canvas) {
        rendererRef.current.canvas.remove();
      }
      rendererRef.current = null;
    }

    if (runnerRef.current) {
      Matter.Runner.stop(runnerRef.current); 
      runnerRef.current = null;
    }

    if (engineRef.current) {
      Matter.World.clear(engineRef.current.world, false);
      Matter.Engine.clear(engineRef.current);
      engineRef.current = null;
    }
    
    bodiesMapRef.current.clear();
  }, []);

  // Effect for setting up and tearing down the core physics engine, renderer, and world elements
  useEffect(() => {
    const currentScene = gameAreaRef.current;
    
    if (currentScene && !engineRef.current && isGameActive) {
      const engine = Matter.Engine.create({ gravity: { y: 0.8 } });
      engineRef.current = engine;
      
      const render = Matter.Render.create({
        element: currentScene,
        engine: engine,
        options: {
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          wireframes: false,
          background: 'transparent',
        },
      });
      rendererRef.current = render;

      const wallOptions: Matter.IBodyDefinition = {
          isStatic: true,
          render: { visible: false }
      };
      const ground = Matter.Bodies.rectangle(GAME_WIDTH / 2, GAME_HEIGHT + WALL_THICKNESS / 2, GAME_WIDTH, WALL_THICKNESS, wallOptions);
      const leftWall = Matter.Bodies.rectangle(-WALL_THICKNESS / 2, GAME_HEIGHT / 2, WALL_THICKNESS, GAME_HEIGHT, wallOptions);
      const rightWall = Matter.Bodies.rectangle(GAME_WIDTH + WALL_THICKNESS / 2, GAME_HEIGHT / 2, WALL_THICKNESS, GAME_HEIGHT, wallOptions);
      Matter.World.add(engine.world, [ground, leftWall, rightWall]);

      Matter.Events.on(engine, 'collisionStart', (event) => {
        if (!engineRef.current) return;
        const pairs = event.pairs;
        for (const pair of pairs) {
          const bodyA = pair.bodyA;
          const bodyB = pair.bodyB;
          if (bodyA.isStatic || bodyB.isStatic || bodyA.isMerging || bodyB.isMerging) continue;
          const typeA = bodyA.customType;
          const typeB = bodyB.customType;
          if (typeA !== undefined && typeA === typeB && typeA < MAX_TRANSPORT_LEVEL) {
            const currentItemInfo = TRANSPORTATION_DATA[typeA as TransportationType];
            const nextItemType = currentItemInfo.next;
            if (nextItemType !== undefined) {
              bodyA.isMerging = true;
              bodyB.isMerging = true;
              Matter.World.remove(engineRef.current.world, [bodyA, bodyB]);
              bodiesMapRef.current.delete(bodyA.customId!);
              bodiesMapRef.current.delete(bodyB.customId!);
              const midPoint = { x: (bodyA.position.x + bodyB.position.x) / 2, y: (bodyA.position.y + bodyB.position.y) / 2 };
              const nextItemInfo = TRANSPORTATION_DATA[nextItemType];
              onMergeRef.current(nextItemType, midPoint, nextItemInfo.score);
            }
          }
        }
      });

      Matter.Events.on(engine, 'afterUpdate', () => {
        if (!engineRef.current || !engineRef.current.world) return; // Added world check
        let shouldGameOver = false;
        for (const body of Matter.Composite.allBodies(engineRef.current.world)) {
            if (!body.isStatic && body.customType !== undefined) {
                const itemInfo = TRANSPORTATION_DATA[body.customType];
                // Check if itemInfo is valid and if body is not null before accessing radius
                if (itemInfo && body && typeof body.position !== 'undefined' && typeof itemInfo.radius !== 'undefined') {
                    if (body.position.y - itemInfo.radius < WARNING_LINE_Y) {
                        if (typeof body.speed !== 'undefined' && typeof body.angularSpeed !== 'undefined' && 
                            body.speed < 0.05 && body.angularSpeed < 0.05) { 
                            shouldGameOver = true;
                            break;
                        }
                    }
                }
            }
        }
        if (shouldGameOver) {
            onGameOverRef.current();
        }
      });
      
      const runner = Matter.Runner.create();
      runnerRef.current = runner;
      
      Matter.Render.run(render); 
      Matter.Runner.run(runner, engine); 
    }
    
    const sceneWhenEffectRan = currentScene;
    return () => {
      if (gameAreaRef.current !== sceneWhenEffectRan || !gameAreaRef.current) {
         cleanupMatter();
      }
    };
  }, [gameAreaRef, cleanupMatter, isGameActive]);

  // Effect for controlling the runner (pause/resume physics simulation)
  useEffect(() => {
    const engine = engineRef.current;
    const runner = runnerRef.current;

    if (!engine || !runner) {
      return; // Do nothing if engine or runner isn't initialized
    }

    if (isGameActive) {
      // Unconditionally try to run the runner if the game is active.
      // Matter.Runner.run is generally safe to call even if already running.
      Matter.Runner.run(runner, engine);
    } else {
      // Unconditionally try to stop the runner if the game is not active.
      // Matter.Runner.stop is generally safe to call even if already stopped.
      Matter.Runner.stop(runner); 
    }
  }, [isGameActive]); // Only depends on isGameActive.


  const addBody = useCallback((x: number, y: number, type: TransportationType, isMergingItem: boolean = false): Matter.Body | null => {
    if (!engineRef.current) return null;

    const itemInfo = TRANSPORTATION_DATA[type];
    const newBodyId = `item-${type}-${Date.now()}-${Math.random().toString(36).substring(2,7)}`;
    const body = Matter.Bodies.circle(x, y, itemInfo.radius, {
      ...ITEM_OPTIONS,
      render: { visible: false }, 
    });
    body.customType = type;
    body.customId = newBodyId;
    body.isMerging = false; 

    if (isMergingItem) { 
        Matter.Body.applyForce(body, body.position, { x: (Math.random() - 0.5) * 0.001 * body.mass , y: -0.005 * body.mass });
    }

    Matter.World.add(engineRef.current.world, body);
    bodiesMapRef.current.set(newBodyId, body);
    return body;
  }, []); 

  const getBodyData = useCallback((): {type: TransportationType, x: number, y: number, radius: number, angle: number, id: string, emoji: string, color: string, textColor: string, level: number }[] => {
    if(!engineRef.current) return [];

    return Array.from(bodiesMapRef.current.values()).map(body => {
        // Ensure body and customType are valid before proceeding
        if (!body || body.customType === undefined || typeof body.position === 'undefined' || typeof body.angle === 'undefined') return null;
        const info = TRANSPORTATION_DATA[body.customType!];
        // Ensure info and customId are also valid
        if (!info || !body.customId) return null; 
        return {
            id: body.customId!,
            type: body.customType!,
            x: body.position.x,
            y: body.position.y,
            radius: info.radius,
            angle: body.angle,
            emoji: info.emoji,
            color: info.color, 
            textColor: info.textColor,
            level: info.level
        };
    }).filter(item => item !== null) as {type: TransportationType, x: number, y: number, radius: number, angle: number, id: string, emoji: string, color: string, textColor: string, level: number }[];
  }, []);

  const clearAllItems = useCallback(() => {
    if (!engineRef.current || !engineRef.current.world) return; // Added world check
    const bodiesToRemove = Matter.Composite.allBodies(engineRef.current.world).filter(
      (body) => !body.isStatic && body.customType !== undefined
    );
    if (bodiesToRemove.length > 0) {
      Matter.World.remove(engineRef.current.world, bodiesToRemove);
    }
    bodiesMapRef.current.clear();
  }, []);

  const resetPhysicsWorld = useCallback(() => {
    cleanupMatter(); 
  }, [cleanupMatter]);


  return { addBody, getBodyData, clearAllItems, resetPhysicsWorld };
};

export default useMatterJs;