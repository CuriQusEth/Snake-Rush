import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Point, Particle } from './types';
import { DIRECTIONS, INITIAL_SPEED, MIN_SPEED, RUSH_MULTIPLIER, THEME } from './constants';

const createFood = (gridW: number, gridH: number, snake: Point[]): Point => {
  let newFood: Point;
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * gridW),
      y: Math.floor(Math.random() * gridH),
    };
    isOccupied = snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
  }
  return newFood!;
};

export const useGameEngine = (gridW: number, gridH: number) => {
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: Math.floor(gridW / 2), y: Math.floor(gridH / 2) }],
    direction: DIRECTIONS.UP,
    nextDirection: DIRECTIONS.UP,
    food: { x: -1, y: -1 }, // Validated shortly
    score: 0,
    combo: 0,
    gameOver: false,
    isPaused: false,
    speed: INITIAL_SPEED,
    particles: [],
    gridWidth: gridW,
    gridHeight: gridH,
  });

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const initGame = useCallback((w = gridW, h = gridH) => {
    setGameState({
      snake: [
        { x: Math.floor(w / 2), y: Math.floor(h / 2) },
        { x: Math.floor(w / 2), y: Math.floor(h / 2) + 1 },
        { x: Math.floor(w / 2), y: Math.floor(h / 2) + 2 },
      ],
      direction: DIRECTIONS.UP,
      nextDirection: DIRECTIONS.UP,
      food: createFood(w, h, [{ x: Math.floor(w / 2), y: Math.floor(h / 2) }]),
      score: 0,
      combo: 0,
      gameOver: false,
      isPaused: false,
      speed: INITIAL_SPEED,
      particles: [],
      gridWidth: w,
      gridHeight: h,
    });
  }, [gridW, gridH]);

  useEffect(() => {
    if (gameState.food.x === -1) {
      initGame(gridW, gridH);
    }
  }, [initGame, gridW, gridH, gameState.food.x]);

  const changeDirection = useCallback((newDir: Point) => {
    const { direction, nextDirection } = gameStateRef.current;
    // Prevent 180 degree turns
    if (newDir.x !== -nextDirection.x || newDir.y !== -nextDirection.y) {
      setGameState((prev) => ({ ...prev, nextDirection: newDir }));
    }
  }, []);

  const triggerExplosion = (x: number, y: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 15; i++) {
        newParticles.push({
            x, y,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            life: 1,
            maxLife: Math.random() * 20 + 10,
            color: THEME.particles[Math.floor(Math.random() * THEME.particles.length)],
            size: Math.random() * 3 + 1
        });
    }
    setGameState(prev => ({ ...prev, particles: [...prev.particles, ...newParticles] }));
  }

  const updateDimensions = useCallback((w: number, h: number) => {
    setGameState(prev => ({...prev, gridWidth: w, gridHeight: h}));
  }, [])

  useEffect(() => {
    if (gameState.gameOver || gameState.isPaused) return;

    let lastTime = 0;
    let accumulatedTime = 0;
    let animationFrameId: number;

    const gameLoop = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      accumulatedTime += deltaTime;

      const currentGameState = gameStateRef.current;

      // Update particles
      if (currentGameState.particles.length > 0) {
        const updatedParticles = currentGameState.particles
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life + 1
          }))
          .filter(p => p.life < p.maxLife);
        
        setGameState(prev => ({ ...prev, particles: updatedParticles }));
      }

      if (accumulatedTime >= currentGameState.speed) {
        accumulatedTime = 0;
        
        let newSnake = [...currentGameState.snake];
        const head = { ...newSnake[0] };
        const dir = currentGameState.nextDirection;

        head.x += dir.x;
        head.y += dir.y;

        // Wrap around (Arena hazards)
        if (head.x < 0) head.x = currentGameState.gridWidth - 1;
        if (head.x >= currentGameState.gridWidth) head.x = 0;
        if (head.y < 0) head.y = currentGameState.gridHeight - 1;
        if (head.y >= currentGameState.gridHeight) head.y = 0;

        // Check collision with self
        if (newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
          setGameState((prev) => ({ ...prev, gameOver: true }));
          return;
        }

        newSnake.unshift(head);

        // Check food collision
        let newScore = currentGameState.score;
        let newFood = currentGameState.food;
        let newCombo = currentGameState.combo;
        let newSpeed = currentGameState.speed;

        if (head.x === currentGameState.food.x && head.y === currentGameState.food.y) {
          triggerExplosion(head.x, head.y);
          newScore += 10 + (newCombo * 2);
          newCombo += 1;
          newFood = createFood(currentGameState.gridWidth, currentGameState.gridHeight, newSnake);
          newSpeed = Math.max(MIN_SPEED, newSpeed * RUSH_MULTIPLIER);
          
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }
        } else {
          newSnake.pop();
        }

        setGameState((prev) => ({
          ...prev,
          snake: newSnake,
          direction: dir,
          food: newFood,
          score: newScore,
          combo: newCombo,
          speed: newSpeed,
        }));
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState.gameOver, gameState.isPaused]);

  return { gameState, changeDirection, initGame, updateDimensions };
};
