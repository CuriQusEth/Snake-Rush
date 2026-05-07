import { useEffect, useCallback } from 'react';
import { DIRECTIONS } from './constants';
import { Point } from './types';

export const useControls = (
  changeDirection: (dir: Point) => void,
  isPaused: boolean,
  gameOver: boolean
) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isPaused || gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          changeDirection(DIRECTIONS.UP);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          changeDirection(DIRECTIONS.DOWN);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          changeDirection(DIRECTIONS.LEFT);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          changeDirection(DIRECTIONS.RIGHT);
          break;
      }
    },
    [changeDirection, isPaused, gameOver]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};
