import React, { useRef, useEffect, useState } from 'react';
import { useGameEngine } from '../game/useGameEngine';
import { useControls } from '../game/useControls';
import { THEME, DIRECTIONS } from '../game/constants';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const GameCanvas = ({ 
    onGameOver 
}: { 
    onGameOver: (score: number) => void 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [gridSize, setGridSize] = useState({ w: 20, h: 30 }); // Default mobile aspect ratio
  const { gameState, changeDirection, initGame, updateDimensions } = useGameEngine(gridSize.w, gridSize.h);

  useControls(changeDirection, gameState.isPaused, gameState.gameOver);

  // Responsive Grid Calculation
  useEffect(() => {
    const updateGridParams = () => {
      if (containerRef.current && canvasRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const CELL_SIZE = 20; // Fixed visual size per cell, or dynamic
        const w = Math.floor(clientWidth / CELL_SIZE);
        const h = Math.floor(clientHeight / CELL_SIZE);
        
        canvasRef.current.width = w * CELL_SIZE;
        canvasRef.current.height = h * CELL_SIZE;
        
        setGridSize({ w, h });
        updateDimensions(w, h);
      }
    };

    updateGridParams();
    window.addEventListener('resize', updateGridParams);
    return () => window.removeEventListener('resize', updateGridParams);
  }, [updateDimensions]);

  // Touch Swipe Handling
  const touchStart = useRef<{ x: number, y: number } | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.touches[0].clientX - touchStart.current.x;
    const dy = e.touches[0].clientY - touchStart.current.y;
    
    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return; // threshold

    if (Math.abs(dx) > Math.abs(dy)) {
      changeDirection(dx > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT);
    } else {
      changeDirection(dy > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP);
    }
    touchStart.current = null;
  };

  // Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const cellW = cw / gameState.gridWidth;
    const cellH = ch / gameState.gridHeight;

    // Clear background entirely so the immersive background shows through
    ctx.clearRect(0, 0, cw, ch);

    // Grid Lines (transparent so it just glows slightly)
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= cw; x += cellW) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ch); ctx.stroke();
    }
    for (let y = 0; y <= ch; y += cellH) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cw, y); ctx.stroke();
    }

    // Draw Particles
    gameState.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 1 - (p.life / p.maxLife);
        ctx.beginPath();
        ctx.arc(p.x * cellW + cellW/2, p.y * cellH + cellH/2, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    });

    // Draw Food
    if (gameState.food.x !== -1) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = THEME.food;
        ctx.fillStyle = THEME.food;
        ctx.beginPath();
        ctx.arc(gameState.food.x * cellW + cellW/2, gameState.food.y * cellH + cellH/2, cellW/2 * 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    // Draw Snake
    gameState.snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? THEME.snakeHead : THEME.snakeBody;
      ctx.shadowBlur = index === 0 ? 15 : 5;
      ctx.shadowColor = ctx.fillStyle;
      
      const shrink = index === 0 ? 0 : 2;
      ctx.fillRect(
        segment.x * cellW + shrink/2, 
        segment.y * cellH + shrink/2, 
        cellW - shrink, 
        cellH - shrink
      );
    });
    ctx.shadowBlur = 0;

    if (gameState.gameOver) {
        onGameOver(gameState.score);
    }

  }, [gameState, onGameOver]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-transparent overflow-hidden font-sans text-white">
      {/* HUD Content Overlay */}
      <div className="absolute top-6 left-6 flex gap-4 z-10 pointer-events-none">
        <div className="px-3 md:px-4 py-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 shadow-lg">
          <p className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Score</p>
          <p className="text-xl md:text-2xl font-mono font-bold text-cyan-400">{gameState.score}</p>
        </div>
        <div className="px-3 md:px-4 py-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 shadow-lg">
          <p className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Length</p>
          <p className="text-xl md:text-2xl font-mono font-bold text-white">{gameState.snake.length}m</p>
        </div>
      </div>

      <AnimatePresence>
        {gameState.combo > 1 && (
            <motion.div 
                key={gameState.combo}
                initial={{ scale: 1.5, opacity: 0, y: -20, x: '-50%' }}
                animate={{ scale: 1, opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, scale: 0.8, x: '-50%' }}
                className="absolute top-32 lg:top-48 left-1/2 text-center pointer-events-none z-10"
            >
                <div className="text-5xl lg:text-6xl font-black italic text-fuchsia-500 drop-shadow-[0_0_20px_rgba(255,0,255,0.8)]">x{gameState.combo}</div>
                <div className="text-xs uppercase tracking-[0.4em] font-bold text-white/50 mt-1">Rush Combo</div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 left-6 right-6 justify-between items-end pointer-events-none hidden sm:flex z-10">
        <div className="flex gap-3">
          <div className="w-12 h-12 lg:w-14 lg:h-14 bg-cyan-500/20 border border-cyan-500/50 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <div className="w-6 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_#00f3ff]"></div>
          </div>
          <div className="w-12 h-12 lg:w-14 lg:h-14 bg-fuchsia-500/20 border border-fuchsia-500/50 rounded-xl flex items-center justify-center opacity-40">
             <div className="w-4 h-4 border-2 border-fuchsia-400 rounded-full"></div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
           <div className="text-[10px] uppercase font-bold text-cyan-400 animate-pulse tracking-widest">System Warmup: Level 1</div>
           <div className="w-48 lg:w-64 h-1.5 bg-white/10 rounded-full overflow-hidden">
             <div className="h-full w-2/5 bg-gradient-to-r from-cyan-500 to-fuchsia-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
           </div>
        </div>
      </div>

      <div 
        ref={containerRef} 
        className="w-full h-full border-none touch-none absolute inset-0"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>

      {gameState.gameOver && (
          <div className="absolute inset-0 bg-transparent flex items-center justify-center z-20 backdrop-blur-sm pointer-events-none">
          </div>
      )}
    </div>
  );
};
