import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Pause } from 'lucide-react';
import { sounds } from '../../../utils/soundEffects';

interface Point {
  x: number;
  y: number;
}

interface FoodItem {
  point: Point;
  name: string;
  icon: string;
  points: number;
}

const FOOD_ITEMS = [
  { name: 'TikTok Like', icon: '❤️', points: 10 },
  { name: 'Iced Oat Latte', icon: '☕', points: 15 },
  { name: 'Midnight Pizza', icon: '🍕', points: 20 },
  { name: 'Impulse Amazon Buy', icon: '🛒', points: 25 },
  { name: 'One More Episode', icon: '📺', points: 15 },
  { name: 'Instagram Reel Loop', icon: '📱', points: 10 },
  { name: 'Vague Post for Sympathy', icon: '🎭', points: 20 },
];

export const DopamineSnake: React.FC = () => {
  const GRID_SIZE = 18;
  const [snake, setSnake] = useState<Point[]>([
    { x: 8, y: 8 },
    { x: 7, y: 8 },
    { x: 6, y: 8 },
  ]);
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [food, setFood] = useState<FoodItem>({
    point: { x: 12, y: 8 },
    name: 'TikTok Like',
    icon: '❤️',
    points: 10,
  });
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('snake_dopamine_highscore') || '0', 10);
  });
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(140);
  const [gameOverRoast, setGameOverRoast] = useState<string>('');
  const nextDirRef = useRef<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');

  // Spawn random food
  const spawnFood = (currentSnake: Point[]) => {
    let newX = Math.floor(Math.random() * GRID_SIZE);
    let newY = Math.floor(Math.random() * GRID_SIZE);

    while (currentSnake.some((segment) => segment.x === newX && segment.y === newY)) {
      newX = Math.floor(Math.random() * GRID_SIZE);
      newY = Math.floor(Math.random() * GRID_SIZE);
    }

    const template = FOOD_ITEMS[Math.floor(Math.random() * FOOD_ITEMS.length)];
    setFood({
      point: { x: newX, y: newY },
      name: template.name,
      icon: template.icon,
      points: template.points,
    });
  };

  const resetGame = () => {
    sounds.playClick();
    const initialSnake: Point[] = [
      { x: 8, y: 8 },
      { x: 7, y: 8 },
      { x: 6, y: 8 },
    ];
    setSnake(initialSnake);
    setDirection('RIGHT');
    nextDirRef.current = 'RIGHT';
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setSpeed(140);
    setGameOverRoast('');
    spawnFood(initialSnake);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code) && direction !== 'DOWN') {
        e.preventDefault();
        nextDirRef.current = 'UP';
      } else if (['ArrowDown', 'KeyS'].includes(e.code) && direction !== 'UP') {
        e.preventDefault();
        nextDirRef.current = 'DOWN';
      } else if (['ArrowLeft', 'KeyA'].includes(e.code) && direction !== 'RIGHT') {
        e.preventDefault();
        nextDirRef.current = 'LEFT';
      } else if (['ArrowRight', 'KeyD'].includes(e.code) && direction !== 'LEFT') {
        e.preventDefault();
        nextDirRef.current = 'RIGHT';
      } else if (e.code === 'Space') {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  // Main Game Loop
  useEffect(() => {
    if (isGameOver || isPaused) return;

    const interval = setInterval(() => {
      setDirection(nextDirRef.current);
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        const currentDir = nextDirRef.current;

        if (currentDir === 'UP') head.y -= 1;
        if (currentDir === 'DOWN') head.y += 1;
        if (currentDir === 'LEFT') head.x -= 1;
        if (currentDir === 'RIGHT') head.x += 1;

        // Collision with walls
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          handleGameOver('You ran into the cold brick wall of consequences.');
          return prevSnake;
        }

        // Collision with self
        if (prevSnake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)) {
          handleGameOver('You choked on your own accumulated instant gratification.');
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Eat food
        if (head.x === food.point.x && head.y === food.point.y) {
          sounds.playEat();
          const newScore = score + food.points;
          setScore(newScore);
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('snake_dopamine_highscore', newScore.toString());
          }
          setSpeed((s) => Math.max(70, s - 3));
          spawnFood(newSnake);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isGameOver, isPaused, food, score, speed, highScore]);

  const handleGameOver = (cause: string) => {
    sounds.playError();
    setIsGameOver(true);
    const roasts = [
      `Game Over! ${cause} Total dopamine devoured: ${score}. Time to stare at your real problems.`,
      `Defeated! You couldn't even manage a digital snake, let alone your life trajectory. Final Score: ${score}.`,
      `Crash! Just like your attention span, this session was cut short. Score: ${score}.`,
    ];
    const picked = roasts[Math.floor(Math.random() * roasts.length)];
    setGameOverRoast(picked);
    sounds.speak(picked, 'clippy');
  };

  const changeDir = (newDir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    sounds.playClick();
    if (newDir === 'UP' && direction !== 'DOWN') nextDirRef.current = 'UP';
    if (newDir === 'DOWN' && direction !== 'UP') nextDirRef.current = 'DOWN';
    if (newDir === 'LEFT' && direction !== 'RIGHT') nextDirRef.current = 'LEFT';
    if (newDir === 'RIGHT' && direction !== 'LEFT') nextDirRef.current = 'RIGHT';
  };

  return (
    <div className="flex flex-col items-center select-none font-win98 text-xs p-1">
      <div className="bg-[#c0c0c0] win98-raised p-2 border-2 border-white max-w-sm w-full">
        {/* Top Score Bar */}
        <div className="win98-sunken p-1.5 mb-2 bg-[#d4d4d4] flex items-center justify-between font-mono text-xs">
          <div>
            <span className="text-gray-600 font-bold">Dopamine: </span>
            <span className="font-bold text-blue-900 text-sm">{score}</span>
          </div>
          <div>
            <span className="text-gray-600 font-bold">High: </span>
            <span className="font-bold text-red-900 text-sm">{highScore}</span>
          </div>
          <div>
            <span className="text-gray-600 font-bold">Anxiety Tail: </span>
            <span className="font-bold text-amber-800">{snake.length}</span>
          </div>
        </div>

        {/* 18x18 Retro Green Matrix Screen */}
        <div className="relative win98-sunken bg-[#0a1a0a] p-1 border-2 border-black mx-auto overflow-hidden">
          <div
            className="grid gap-[1px] bg-[#051005]"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              width: '280px',
              height: '280px',
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              const isHead = snake[0].x === x && snake[0].y === y;
              const isBody = snake.slice(1).some((s) => s.x === x && s.y === y);
              const isFoodCell = food.point.x === x && food.point.y === y;

              return (
                <div
                  key={index}
                  className={`w-full h-full flex items-center justify-center text-[10px] ${
                    isHead
                      ? 'bg-[#00ff66] shadow-[0_0_6px_#00ff66] rounded-[1px]'
                      : isBody
                      ? 'bg-[#008833]'
                      : isFoodCell
                      ? 'bg-amber-400 animate-pulse'
                      : 'bg-[#0d220d]/40'
                  }`}
                >
                  {isFoodCell && <span>{food.icon}</span>}
                </div>
              );
            })}
          </div>

          {/* Game Over Overlay */}
          {isGameOver && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-3 text-center">
              <div className="text-red-500 font-pixel text-2xl font-bold mb-1 tracking-widest">
                CRASH & BURN
              </div>
              <p className="text-[11px] text-gray-200 mb-3 font-win98">
                {gameOverRoast}
              </p>
              <button
                onClick={resetGame}
                className="px-3 py-1.5 bg-[#c0c0c0] win98-raised win98-btn font-bold text-black flex items-center gap-1 hover:bg-white text-xs"
              >
                <RotateCcw size={12} />
                <span>Retry (Relapse)</span>
              </button>
            </div>
          )}
        </div>

        {/* Current Target Snacking Item */}
        <div className="mt-2 win98-sunken p-1 bg-[#ffffdf] text-[11px] flex items-center justify-between text-gray-800">
          <span>Current Craving: <strong>{food.name}</strong> ({food.icon})</span>
          <span className="text-[10px] text-gray-500 font-mono">+{food.points} pts</span>
        </div>

        {/* Onscreen Controls for Mobile & Quick clicks */}
        <div className="mt-2 pt-1 border-t border-[#808080] flex items-center justify-between">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-2.5 py-1 bg-[#c0c0c0] win98-raised win98-btn text-[11px] text-black"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>

          {/* D-Pad Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => changeDir('LEFT')}
              className="w-7 h-7 bg-[#c0c0c0] win98-raised win98-btn flex items-center justify-center text-black"
            >
              <ArrowLeft size={13} />
            </button>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => changeDir('UP')}
                className="w-7 h-7 bg-[#c0c0c0] win98-raised win98-btn flex items-center justify-center text-black"
              >
                <ArrowUp size={13} />
              </button>
              <button
                onClick={() => changeDir('DOWN')}
                className="w-7 h-7 bg-[#c0c0c0] win98-raised win98-btn flex items-center justify-center text-black"
              >
                <ArrowDown size={13} />
              </button>
            </div>
            <button
              onClick={() => changeDir('RIGHT')}
              className="w-7 h-7 bg-[#c0c0c0] win98-raised win98-btn flex items-center justify-center text-black"
            >
              <ArrowRight size={13} />
            </button>
          </div>

          <button
            onClick={resetGame}
            className="px-2.5 py-1 bg-[#c0c0c0] win98-raised win98-btn text-[11px] text-black"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
