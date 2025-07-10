import React, { useState, useEffect, useMemo } from 'react';

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  opacity: number;
}

interface FloatingEmojisOverlayProps {
  count?: number;
  emojiList: string[];
}

const FloatingEmojisOverlay: React.FC<FloatingEmojisOverlayProps> = ({ count = 20, emojiList }) => {
  const [emojis, setEmojis] = useState<FloatingEmoji[]>([]);
  const screenWidthRef = React.useRef(window.innerWidth);
  const screenHeightRef = React.useRef(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      screenWidthRef.current = window.innerWidth;
      screenHeightRef.current = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const createEmoji = (id: number): FloatingEmoji => {
    const screenWidth = screenWidthRef.current;
    const screenHeight = screenHeightRef.current;
    const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left

    let x, y;
    if (side === 0) { // Top
      x = Math.random() * screenWidth;
      y = -50;
    } else if (side === 1) { // Right
      x = screenWidth + 50;
      y = Math.random() * screenHeight;
    } else if (side === 2) { // Bottom
      x = Math.random() * screenWidth;
      y = screenHeight + 50;
    } else { // Left
      x = -50;
      y = Math.random() * screenHeight;
    }

    return {
      id,
      emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
      x,
      y,
      vx: (Math.random() - 0.5) * 1.5, // Slower speed
      vy: (Math.random() - 0.5) * 1.5, // Slower speed
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 0.3, // Slower rotation
      size: Math.random() * 24 + 20, // 20px to 44px
      opacity: Math.random() * 0.5 + 0.3, // 0.3 to 0.8
    };
  };

  useEffect(() => {
    if (emojiList.length > 0) {
      setEmojis(Array.from({ length: count }, (_, i) => createEmoji(i)));
    }
  }, [count, emojiList]);

  useEffect(() => {
    if (emojis.length === 0) return;

    let animationFrameId: number;
    const update = () => {
      setEmojis(prevEmojis =>
        prevEmojis.map(e => {
          let newX = e.x + e.vx;
          let newY = e.y + e.vy;
          let newRotation = e.rotation + e.rotationSpeed;

          const screenWidth = screenWidthRef.current;
          const screenHeight = screenHeightRef.current;

          // Reset if out of bounds (expanded boundary for reset)
          if (newX < -100 || newX > screenWidth + 100 || newY < -100 || newY > screenHeight + 100) {
            return createEmoji(e.id);
          }
          return { ...e, x: newX, y: newY, rotation: newRotation };
        })
      );
      animationFrameId = requestAnimationFrame(update);
    };
    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [emojis]); // Re-run if emojis array identity changes (e.g. initial creation)

  if (emojiList.length === 0) return null;

  return (
    <div
        className="fixed inset-0 pointer-events-none overflow-hidden z-0"
        aria-hidden="true"
        style={{ zIndex: 20 }} // Changed zIndex from 5 to 20 to be above modal content (which is z-10)
    >
      {emojis.map(e => (
        <span
          key={e.id}
          className="absolute no-select"
          style={{
            left: `${e.x}px`,
            top: `${e.y}px`,
            fontSize: `${e.size}px`,
            opacity: e.opacity,
            transform: `translate(-50%, -50%) rotate(${e.rotation}deg)`,
            willChange: 'transform, opacity, top, left', // Performance hint
          }}
        >
          {e.emoji}
        </span>
      ))}
    </div>
  );
};

export default FloatingEmojisOverlay;