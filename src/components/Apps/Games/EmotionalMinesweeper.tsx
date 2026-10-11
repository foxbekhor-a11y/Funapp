import React, { useState, useEffect, useRef } from 'react';
import { Flag, RotateCcw, AlertTriangle } from 'lucide-react';
import { sounds } from '../../../utils/soundEffects';

interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
  triggerName?: string;
}

const TRAUMA_NAMES = [
  "Past Relationship Drama",
  "Unpaid Student Loans",
  "Imposter Syndrome",
  "Unsent Apology Text",
  "Expired Gym Pass",
  "Cancelled Dental Appointment",
  "Unopened Email (Inbox 4,200)",
  "Unfinished Creative Project",
  "High School Embarrassment",
  "Sunday Night Dread"
];

const NUMBER_COLORS = [
  '',
  'text-blue-700',
  'text-green-700',
  'text-red-700',
  'text-blue-950',
  'text-amber-900',
  'text-teal-700',
  'text-black',
  'text-gray-600',
];

const MINE_ROASTS = [
  "BOOM! You hit 'Unresolved Childhood Inadequacy'. Just like in real life, you ignored all the clear red flags.",
  "DETONATED! You uncovered 'Unopened Credit Card Statement'. The damage is irreversible.",
  "KABOOM! You stepped on 'Staying in Bed Until 2 PM'. Your productivity has perished.",
  "TRIGGERED! You hit 'Checking Your Ex's Story'. Instant psychological casualty.",
  "EXPLOSION! You clicked 'Starting Next Monday'. Another resolution blown to bits."
];

export const EmotionalMinesweeper: React.FC = () => {
  const ROWS = 9;
  const COLS = 9;
  const MINES = 10;

  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [mineCount, setMineCount] = useState<number>(MINES);
  const [timer, setTimer] = useState<number>(0);
  const [flagMode, setFlagMode] = useState<boolean>(false);
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const [roastMessage, setRoastMessage] = useState<string | null>(null);
  const timerRef = useRef<any>(null);

  // Initialize Board
  const initBoard = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(0);
    setGameState('idle');
    setMineCount(MINES);
    setRoastMessage(null);

    // Create empty cells
    const newGrid: Cell[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < COLS; c++) {
        row.push({
          row: r,
          col: c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        });
      }
      newGrid.push(row);
    }

    // Place mines randomly
    let placed = 0;
    while (placed < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        newGrid[r][c].triggerName = TRAUMA_NAMES[placed % TRAUMA_NAMES.length];
        placed++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newGrid[nr][nc].isMine) {
                count++;
              }
            }
          }
          newGrid[r][c].neighborMines = count;
        }
      }
    }

    setGrid(newGrid);
  };

  useEffect(() => {
    initBoard();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer loop
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimer((t) => Math.min(999, t + 1));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Reveal cell
  const revealCell = (r: number, c: number) => {
    if (gameState === 'won' || gameState === 'lost') return;
    const cell = grid[r][c];
    if (cell.isRevealed || cell.isFlagged) return;

    if (gameState === 'idle') {
      setGameState('playing');
    }

    const nextGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

    // Hit a mine!
    if (nextGrid[r][c].isMine) {
      sounds.playExplosion();
      // Reveal all mines
      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          if (nextGrid[i][j].isMine) {
            nextGrid[i][j].isRevealed = true;
          }
        }
      }
      setGrid(nextGrid);
      setGameState('lost');
      const pickRoast = MINE_ROASTS[Math.floor(Math.random() * MINE_ROASTS.length)];
      const customRoast = `${pickRoast} Trigger: "${nextGrid[r][c].triggerName || 'Unprocessed Guilt'}".`;
      setRoastMessage(customRoast);
      sounds.speak(customRoast, 'clippy');
      return;
    }

    // Safe reveal with flood fill
    sounds.playClick();
    const floodFill = (currR: number, currC: number) => {
      if (currR < 0 || currR >= ROWS || currC < 0 || currC >= COLS) return;
      const target = nextGrid[currR][currC];
      if (target.isRevealed || target.isFlagged || target.isMine) return;

      target.isRevealed = true;

      if (target.neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr !== 0 || dc !== 0) {
              floodFill(currR + dr, currC + dc);
            }
          }
        }
      }
    };

    floodFill(r, c);
    setGrid(nextGrid);

    // Check Win
    let unrevealedSafe = 0;
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if (!nextGrid[i][j].isMine && !nextGrid[i][j].isRevealed) {
          unrevealedSafe++;
        }
      }
    }

    if (unrevealedSafe === 0) {
      setGameState('won');
      sounds.playDing();
      const winMessage = "Victory! You cleared the entire emotional minefield. Now if only you could clear your laundry pile.";
      setRoastMessage(winMessage);
      sounds.speak(winMessage, 'clippy');
    }
  };

  // Toggle Flag
  const toggleFlag = (e: React.MouseEvent | null, r: number, c: number) => {
    if (e) e.preventDefault();
    if (gameState === 'won' || gameState === 'lost') return;
    const cell = grid[r][c];
    if (cell.isRevealed) return;

    sounds.playClick();
    const nextGrid = grid.map((row) => row.map((c) => ({ ...c })));
    const target = nextGrid[r][c];
    target.isFlagged = !target.isFlagged;
    setGrid(nextGrid);
    setMineCount((prev) => (target.isFlagged ? prev - 1 : prev + 1));
  };

  const handleCellClick = (r: number, c: number) => {
    if (flagMode) {
      toggleFlag(null, r, c);
    } else {
      revealCell(r, c);
    }
  };

  return (
    <div className="flex flex-col items-center select-none font-win98 text-xs p-1">
      {/* Outer 3D Beveled Box */}
      <div className="bg-[#c0c0c0] win98-raised p-2 border-2 border-white max-w-sm w-full">
        {/* Top Control Bar with 7-segment LED counters & Smiley */}
        <div className="win98-sunken p-1.5 mb-2 bg-[#c0c0c0] flex items-center justify-between">
          {/* Mine count LED display */}
          <div className="bg-black text-red-600 font-pixel text-xl px-2 py-0.5 tracking-widest border border-gray-700 shadow-inner min-w-[50px] text-center">
            {mineCount.toString().padStart(3, '0')}
          </div>

          {/* Smiley Reset Button */}
          <button
            onClick={() => {
              sounds.playClick();
              initBoard();
            }}
            title="Reset Game"
            className="w-8 h-8 bg-[#c0c0c0] win98-raised win98-btn flex items-center justify-center text-lg active:scale-95"
          >
            {gameState === 'lost' && '😵'}
            {gameState === 'won' && '😎'}
            {gameState === 'playing' && (isPressing ? '😮' : '🙂')}
            {gameState === 'idle' && '🙂'}
          </button>

          {/* Timer LED display */}
          <div className="bg-black text-red-600 font-pixel text-xl px-2 py-0.5 tracking-widest border border-gray-700 shadow-inner min-w-[50px] text-center">
            {timer.toString().padStart(3, '0')}
          </div>
        </div>

        {/* 9x9 Grid Viewport */}
        <div 
          className="win98-sunken p-1 bg-[#808080] inline-block mx-auto flex justify-center"
          onMouseDown={() => setIsPressing(true)}
          onMouseUp={() => setIsPressing(false)}
        >
          <div className="grid grid-cols-9 gap-[1px] bg-[#808080]">
            {grid.map((row, r) =>
              row.map((cell, c) => (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  onContextMenu={(e) => toggleFlag(e, r, c)}
                  disabled={cell.isRevealed && cell.neighborMines === 0}
                  className={`w-7 h-7 flex items-center justify-center font-bold text-xs transition-none ${
                    cell.isRevealed
                      ? cell.isMine
                        ? 'bg-red-600 border border-gray-600 text-white'
                        : 'bg-[#c0c0c0] border border-[#808080]'
                      : 'bg-[#c0c0c0] win98-raised active:border-t-black active:border-l-black active:border-b-white active:border-r-white'
                  }`}
                >
                  {cell.isRevealed ? (
                    cell.isMine ? (
                      '💣'
                    ) : cell.neighborMines > 0 ? (
                      <span className={NUMBER_COLORS[cell.neighborMines]}>
                        {cell.neighborMines}
                      </span>
                    ) : (
                      ''
                    )
                  ) : cell.isFlagged ? (
                    '🚩'
                  ) : (
                    ''
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Mobile / Convenience Mode Controls */}
        <div className="mt-2 flex items-center justify-between text-[11px] pt-1 border-t border-[#808080]">
          <button
            onClick={() => setFlagMode(!flagMode)}
            className={`px-2 py-1 win98-btn flex items-center gap-1 text-[11px] ${
              flagMode ? 'win98-sunken bg-red-100 font-bold text-red-900' : 'win98-raised bg-[#c0c0c0] text-black'
            }`}
          >
            <Flag size={11} className={flagMode ? 'text-red-700' : 'text-gray-600'} />
            <span>{flagMode ? 'Flag Mode: ON' : 'Flag Mode: OFF'}</span>
          </button>

          <span className="text-[10px] text-gray-600">
            {flagMode ? 'Click marks trauma' : 'Right-click to flag'}
          </span>
        </div>
      </div>

      {/* Sarcastic Roast Dialogue Popup upon Win or Loss */}
      {roastMessage && (
        <div className="mt-2 w-full max-w-sm p-2 bg-[#ffffcc] win98-raised border border-black text-xs text-black animate-fade-in">
          <div className="font-bold text-[#000080] flex items-center gap-1 mb-1">
            <AlertTriangle size={13} className="text-red-700" />
            <span>Clippy's Trauma Evaluation:</span>
          </div>
          <p className="text-[11px] leading-snug">{roastMessage}</p>
        </div>
      )}
    </div>
  );
};
