import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 120;
const SPEED_INCREMENT = 2;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
}

export default function SnakeGame({ onScoreUpdate }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const directionRef = useRef(direction);
  const lastMoveTimeRef = useRef(0);
  const requestRef = useRef<number>();

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setScore(0);
    onScoreUpdate(0);
    setSpeed(INITIAL_SPEED);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood([{ x: 10, y: 10 }]));
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPaused(p => !p);
        return;
      }

      if (isPaused || isGameOver) return;

      const keyMap: Record<string, Direction> = {
        ArrowUp: 'UP',
        KeyW: 'UP',
        ArrowDown: 'DOWN',
        KeyS: 'DOWN',
        ArrowLeft: 'LEFT',
        KeyA: 'LEFT',
        ArrowRight: 'RIGHT',
        KeyD: 'RIGHT',
      };

      const newDir = keyMap[e.code];
      if (!newDir) return;

      const currentDir = directionRef.current;
      const isOpposite = 
        (newDir === 'UP' && currentDir === 'DOWN') ||
        (newDir === 'DOWN' && currentDir === 'UP') ||
        (newDir === 'LEFT' && currentDir === 'RIGHT') ||
        (newDir === 'RIGHT' && currentDir === 'LEFT');

      if (!isOpposite) {
        directionRef.current = newDir;
        setDirection(newDir);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPaused, isGameOver]);

  const gameLoop = useCallback((time: number) => {
    if (isPaused || isGameOver) {
      requestRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    if (time - lastMoveTimeRef.current >= speed) {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (directionRef.current) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE ||
          prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreUpdate(newScore);
          setSpeed(s => Math.max(50, s - SPEED_INCREMENT));
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
      lastMoveTimeRef.current = time;
    }
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [food, isGameOver, isPaused, score, speed, generateFood, onScoreUpdate]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameLoop]);

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-black border-4 border-[#00ffff] shadow-[8px_8px_0px_#ff00ff]">
      <div className="absolute top-0 left-0 bg-[#00ffff] text-black font-pixel text-[8px] px-2 py-1">
        EXECUTION_WINDOW
      </div>
      <div className="absolute top-4 right-6 text-[#ff00ff] font-pixel text-sm tracking-widest">
        DATA: {score.toString().padStart(4, '0')}
      </div>
      
      <div 
        className="grid gap-[1px] bg-gray-900 border-2 border-[#ff00ff] overflow-hidden mt-8"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          width: 'min(80vw, 400px)',
          height: 'min(80vw, 400px)'
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some(segment => segment.x === x && segment.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              className={`
                w-full h-full
                ${isHead ? 'bg-[#00ffff] z-10' : ''}
                ${isSnake && !isHead ? 'bg-[#ff00ff]' : ''}
                ${isFood ? 'bg-[#00ffff] animate-ping' : ''}
                ${!isSnake && !isFood ? 'bg-black' : ''}
              `}
            />
          );
        })}
      </div>

      {isGameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 border-4 border-[#ff00ff]">
          <h2 className="text-3xl md:text-4xl font-pixel text-[#ff00ff] mb-4 text-center glitch-text" data-text="SYSTEM_FAILURE">SYSTEM_FAILURE</h2>
          <p className="text-[#00ffff] mb-8 font-pixel text-sm">FINAL_DATA: {score}</p>
          <button 
            onClick={resetGame}
            className="px-6 py-3 bg-black border-2 border-[#00ffff] text-[#00ffff] font-pixel text-xs tracking-widest hover:bg-[#00ffff] hover:text-black transition-colors shadow-[4px_4px_0px_#ff00ff] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            REBOOT_SEQUENCE
          </button>
        </div>
      )}

      {isPaused && !isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
          <h2 className="text-2xl font-pixel text-[#00ffff] animate-pulse">PROCESS_SUSPENDED</h2>
        </div>
      )}

      <div className="mt-6 text-[#ff00ff] font-pixel text-[10px] text-center leading-relaxed uppercase">
        INPUT: W A S D / ARROWS<br/>INTERRUPT: SPACE
      </div>
    </div>
  );
}
