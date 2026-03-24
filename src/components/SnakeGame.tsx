import { useEffect, useRef, useState } from 'react';

const CANVAS_SIZE = 400;
const GRID_SIZE = 20;
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  onGameOver: () => void;
}

export default function SnakeGame({ onScoreChange, onGameOver }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const gameState = useRef({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 5 },
    dir: { x: 0, y: -1 },
    nextDir: { x: 0, y: -1 },
    gameOver: false,
    isStarted: false,
    isPaused: false,
    score: 0,
    lastUpdate: 0,
    speed: 120
  });

  const resetGame = () => {
    gameState.current = {
      snake: [{ x: 10, y: 10 }],
      food: { x: 15, y: 5 },
      dir: { x: 0, y: -1 },
      nextDir: { x: 0, y: -1 },
      gameOver: false,
      isStarted: true,
      isPaused: false,
      score: 0,
      lastUpdate: performance.now(),
      speed: 120
    };
    setIsStarted(true);
    setIsGameOver(false);
    setIsPaused(false);
    onScoreChange(0);
  };

  const update = (time: number) => {
    if (!gameState.current.isStarted || gameState.current.gameOver || gameState.current.isPaused) {
      draw();
      requestRef.current = requestAnimationFrame(update);
      return;
    }

    if (time - gameState.current.lastUpdate > gameState.current.speed) {
      const { snake, food, nextDir } = gameState.current;
      const head = snake[0];
      const newHead = { x: head.x + nextDir.x, y: head.y + nextDir.y };

      gameState.current.dir = nextDir;

      // Wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        gameState.current.gameOver = true;
        setIsGameOver(true);
        onGameOver();
      }
      // Self collision
      else if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        gameState.current.gameOver = true;
        setIsGameOver(true);
        onGameOver();
      } else {
        snake.unshift(newHead);

        // Food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          gameState.current.score += 10;
          onScoreChange(gameState.current.score);
          gameState.current.speed = Math.max(40, 120 - Math.floor(gameState.current.score / 50) * 8);

          let newFood;
          while (true) {
            newFood = {
              x: Math.floor(Math.random() * GRID_SIZE),
              y: Math.floor(Math.random() * GRID_SIZE)
            };
            if (!snake.some(s => s.x === newFood.x && s.y === newFood.y)) break;
          }
          gameState.current.food = newFood;
        } else {
          snake.pop();
        }
      }
      gameState.current.lastUpdate = time;
    }

    draw();
    requestRef.current = requestAnimationFrame(update);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    if (!gameState.current.isStarted) {
      return;
    }

    const { snake, food } = gameState.current;

    // Draw Grid (Glitchy/Raw)
    ctx.strokeStyle = '#00FFFF';
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.2;
    for (let i = 0; i <= CANVAS_SIZE; i += CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // Draw Food (Magenta)
    ctx.fillStyle = '#FF00FF';
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    // Inner glitch core
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(food.x * CELL_SIZE + 4, food.y * CELL_SIZE + 4, CELL_SIZE - 8, CELL_SIZE - 8);

    // Draw Snake (Cyan)
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#FFFFFF' : '#00FFFF';
      ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      
      if (index !== 0) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(segment.x * CELL_SIZE + 2, segment.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
      }
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (gameState.current.isStarted && !gameState.current.gameOver) {
          gameState.current.isPaused = !gameState.current.isPaused;
          setIsPaused(gameState.current.isPaused);
        }
        return;
      }

      const { dir } = gameState.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (dir.y === 0) gameState.current.nextDir = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (dir.y === 0) gameState.current.nextDir = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (dir.x === 0) gameState.current.nextDir = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (dir.x === 0) gameState.current.nextDir = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    requestRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="relative border-4 border-[#00FFFF] bg-[#000000] p-1">
      <div className="absolute top-0 left-0 w-full h-full border-2 border-[#FF00FF] pointer-events-none transform translate-x-1 translate-y-1 mix-blend-screen opacity-50"></div>
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="block w-full max-w-[400px] aspect-square"
      />

      {!isStarted && !isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-black border-2 border-[#00FFFF] text-[#00FFFF] font-['Press_Start_2P'] text-xs hover:bg-[#00FFFF] hover:text-black transition-none cursor-pointer"
          >
            [ INITIALIZE ]
          </button>
        </div>
      )}

      {isGameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90">
          <h2 className="text-xl font-['Press_Start_2P'] text-[#FF00FF] mb-8 text-center animate-pulse">
            CRITICAL_FAILURE
          </h2>
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-black border-2 border-[#FF00FF] text-[#FF00FF] font-['Press_Start_2P'] text-xs hover:bg-[#FF00FF] hover:text-black transition-none cursor-pointer"
          >
            [ REBOOT ]
          </button>
        </div>
      )}

      {isPaused && !isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <h2 className="text-xl font-['Press_Start_2P'] text-[#00FFFF] text-center">
            PROCESS_SUSPENDED
          </h2>
        </div>
      )}
    </div>
  );
}
