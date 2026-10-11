import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Sparkles, Award, AlertCircle } from 'lucide-react';
import { sounds } from '../../../utils/soundEffects';

interface ShapeTemplate {
  name: string;
  color: string;
  matrix: number[][]; // 1 for filled, 0 for empty
}

// Classic Block Blast piece library with retro vibrant colors
const SHAPES: ShapeTemplate[] = [
  // 1x1 Dot
  { name: 'Dot', color: 'bg-yellow-400 border-yellow-200', matrix: [[1]] },
  // 2x2 Square
  { name: 'Square 2x2', color: 'bg-blue-500 border-blue-300', matrix: [[1, 1], [1, 1]] },
  // 3x3 Square
  { name: 'Square 3x3', color: 'bg-red-500 border-red-300', matrix: [[1, 1, 1], [1, 1, 1], [1, 1, 1]] },
  // Horizontal Lines
  { name: 'Line 2H', color: 'bg-emerald-500 border-emerald-300', matrix: [[1, 1]] },
  { name: 'Line 3H', color: 'bg-emerald-500 border-emerald-300', matrix: [[1, 1, 1]] },
  { name: 'Line 4H', color: 'bg-cyan-500 border-cyan-300', matrix: [[1, 1, 1, 1]] },
  { name: 'Line 5H', color: 'bg-purple-500 border-purple-300', matrix: [[1, 1, 1, 1, 1]] },
  // Vertical Lines
  { name: 'Line 2V', color: 'bg-emerald-500 border-emerald-300', matrix: [[1], [1]] },
  { name: 'Line 3V', color: 'bg-emerald-500 border-emerald-300', matrix: [[1], [1], [1]] },
  { name: 'Line 4V', color: 'bg-cyan-500 border-cyan-300', matrix: [[1], [1], [1], [1]] },
  { name: 'Line 5V', color: 'bg-purple-500 border-purple-300', matrix: [[1], [1], [1], [1], [1]] },
  // L Shapes
  { name: 'L-1', color: 'bg-amber-500 border-amber-300', matrix: [[1, 0], [1, 0], [1, 1]] },
  { name: 'L-2', color: 'bg-amber-500 border-amber-300', matrix: [[0, 1], [0, 1], [1, 1]] },
  { name: 'L-3', color: 'bg-amber-500 border-amber-300', matrix: [[1, 1, 1], [1, 0, 0]] },
  { name: 'L-4', color: 'bg-amber-500 border-amber-300', matrix: [[1, 1, 1], [0, 0, 1]] },
  // Small Corners
  { name: 'Corner 1', color: 'bg-indigo-500 border-indigo-300', matrix: [[1, 1], [1, 0]] },
  { name: 'Corner 2', color: 'bg-indigo-500 border-indigo-300', matrix: [[1, 1], [0, 1]] },
  { name: 'Corner 3', color: 'bg-indigo-500 border-indigo-300', matrix: [[1, 0], [1, 1]] },
  { name: 'Corner 4', color: 'bg-indigo-500 border-indigo-300', matrix: [[0, 1], [1, 1]] },
  // T Shapes
  { name: 'T-1', color: 'bg-pink-500 border-pink-300', matrix: [[1, 1, 1], [0, 1, 0]] },
  { name: 'T-2', color: 'bg-pink-500 border-pink-300', matrix: [[0, 1, 0], [1, 1, 1]] },
];

interface Cell {
  filled: boolean;
  color?: string;
  isClearing?: boolean;
}

export const BlockBlast: React.FC = () => {
  const GRID_SIZE = 8;
  const [board, setBoard] = useState<Cell[][]>(() =>
    Array.from({ length: 8 }, () =>
      Array.from({ length: 8 }, () => ({ filled: false }))
    )
  );

  const [currentHand, setCurrentHand] = useState<(ShapeTemplate | null)[]>([]);
  const [selectedPieceIndex, setSelectedPieceIndex] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ r: number; c: number } | null>(null);
  const [score, setScore] = useState<number>(0);
  const [comboCount, setComboCount] = useState<number>(0);
  const [comboBanner, setComboBanner] = useState<string | null>(null);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('block_blast_highscore') || '0', 10);
  });
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameOverRoast, setGameOverRoast] = useState<string>('');

  // Generate 3 random pieces
  const generateHand = (): (ShapeTemplate | null)[] => {
    return [
      SHAPES[Math.floor(Math.random() * SHAPES.length)],
      SHAPES[Math.floor(Math.random() * SHAPES.length)],
      SHAPES[Math.floor(Math.random() * SHAPES.length)],
    ];
  };

  // Start / Reset
  const resetGame = () => {
    sounds.playClick();
    const emptyBoard = Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => ({ filled: false }))
    );
    setBoard(emptyBoard);
    const hand = generateHand();
    setCurrentHand(hand);
    setSelectedPieceIndex(null);
    setHoverPosition(null);
    setScore(0);
    setComboCount(0);
    setComboBanner(null);
    setIsGameOver(false);
    setGameOverRoast('');
  };

  useEffect(() => {
    resetGame();
  }, []);

  // Validation: Check if a shape fits at (startR, startC)
  const canPlace = (
    currentBoard: Cell[][],
    shape: ShapeTemplate,
    startR: number,
    startC: number
  ): boolean => {
    const sRows = shape.matrix.length;
    const sCols = shape.matrix[0].length;

    if (startR + sRows > GRID_SIZE || startC + sCols > GRID_SIZE) {
      return false;
    }

    for (let r = 0; r < sRows; r++) {
      for (let c = 0; c < sCols; c++) {
        if (shape.matrix[r][c] === 1) {
          if (currentBoard[startR + r][startC + c].filled) {
            return false;
          }
        }
      }
    }
    return true;
  };

  // Check if any move is possible for the remaining hand
  const checkGameOver = (currentBoard: Cell[][], hand: (ShapeTemplate | null)[]) => {
    const activePieces = hand.filter((p): p is ShapeTemplate => p !== null);
    if (activePieces.length === 0) return false;

    for (const piece of activePieces) {
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (canPlace(currentBoard, piece, r, c)) {
            return false; // Still has at least one valid placement!
          }
        }
      }
    }
    return true; // No moves possible!
  };

  // Place piece handler
  const handlePlacePiece = (targetR: number, targetC: number) => {
    if (selectedPieceIndex === null || isGameOver) return;
    const piece = currentHand[selectedPieceIndex];
    if (!piece) return;

    if (!canPlace(board, piece, targetR, targetC)) {
      sounds.playError();
      return;
    }

    // Place blocks on board
    sounds.playEat();
    const nextBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    let blocksPlaced = 0;

    for (let r = 0; r < piece.matrix.length; r++) {
      for (let c = 0; c < piece.matrix[0].length; c++) {
        if (piece.matrix[r][c] === 1) {
          nextBoard[targetR + r][targetC + c] = {
            filled: true,
            color: piece.color,
          };
          blocksPlaced++;
        }
      }
    }

    // Check rows & columns to blast
    const fullRows: number[] = [];
    const fullCols: number[] = [];

    for (let r = 0; r < GRID_SIZE; r++) {
      if (nextBoard[r].every((cell) => cell.filled)) {
        fullRows.push(r);
      }
    }

    for (let c = 0; c < GRID_SIZE; c++) {
      let colFull = true;
      for (let r = 0; r < GRID_SIZE; r++) {
        if (!nextBoard[r][c].filled) {
          colFull = false;
          break;
        }
      }
      if (colFull) {
        fullCols.push(c);
      }
    }

    const linesCleared = fullRows.length + fullCols.length;
    let earnedPoints = blocksPlaced * 10;

    if (linesCleared > 0) {
      sounds.playDing();
      sounds.playWhack();
      const newCombo = comboCount + 1;
      setComboCount(newCombo);

      // Point calculation with combo multiplier
      const lineBonus = linesCleared * 100 * newCombo;
      earnedPoints += lineBonus;

      const comboTitles = [
        "NICE BLAST!",
        "DOUBLE COMBO!",
        "TRIPLE CLEAR!",
        "UNSTOPPABLE!",
        "BRAIN DEFRAGGED!"
      ];
      const title = comboTitles[Math.min(linesCleared - 1, comboTitles.length - 1)];
      setComboBanner(`${title} +${lineBonus} pts`);
      setTimeout(() => setComboBanner(null), 1400);

      // Clear the cells
      fullRows.forEach((r) => {
        for (let c = 0; c < GRID_SIZE; c++) {
          nextBoard[r][c] = { filled: false };
        }
      });

      fullCols.forEach((c) => {
        for (let r = 0; r < GRID_SIZE; r++) {
          nextBoard[r][c] = { filled: false };
        }
      });
    } else {
      setComboCount(0);
    }

    const nextScore = score + earnedPoints;
    setScore(nextScore);
    if (nextScore > highScore) {
      setHighScore(nextScore);
      localStorage.setItem('block_blast_highscore', nextScore.toString());
    }

    // Remove used piece from hand
    const nextHand = [...currentHand];
    nextHand[selectedPieceIndex] = null;

    // If hand is now empty, deal new 3 pieces
    const remainingInHand = nextHand.filter((p) => p !== null);
    let finalHand = nextHand;
    if (remainingInHand.length === 0) {
      finalHand = generateHand();
      sounds.playDing();
    }

    setBoard(nextBoard);
    setCurrentHand(finalHand);
    setSelectedPieceIndex(null);
    setHoverPosition(null);

    // Check game over
    if (checkGameOver(nextBoard, finalHand)) {
      sounds.playError();
      setIsGameOver(true);
      const roasts = [
        `GAME OVER! Your brain has zero contiguous free sectors remaining. Final Score: ${nextScore}.`,
        `OUT OF MOVES! Just like your life plans, everything got overcrowded and stalled. Score: ${nextScore}.`,
        `GRIDLOCK! You filled your mental space with unmanageable baggage. Score: ${nextScore}.`,
        `NO MORE SPACE! Even a 1x1 tile cannot fit in your chaotic headspace. Final Score: ${nextScore}.`
      ];
      const picked = roasts[Math.floor(Math.random() * roasts.length)];
      setGameOverRoast(picked);
      sounds.speak(picked, 'clippy');
    }
  };

  // Preview cells for hover placement
  const getPreviewState = (r: number, c: number): { isPreview: boolean; isValid: boolean } => {
    if (selectedPieceIndex === null || hoverPosition === null) {
      return { isPreview: false, isValid: false };
    }
    const piece = currentHand[selectedPieceIndex];
    if (!piece) return { isPreview: false, isValid: false };

    const { r: startR, c: startC } = hoverPosition;
    const sRows = piece.matrix.length;
    const sCols = piece.matrix[0].length;

    if (r >= startR && r < startR + sRows && c >= startC && c < startC + sCols) {
      if (piece.matrix[r - startR][c - startC] === 1) {
        const valid = canPlace(board, piece, startR, startC);
        return { isPreview: true, isValid: valid };
      }
    }
    return { isPreview: false, isValid: false };
  };

  return (
    <div className="flex flex-col items-center select-none font-win98 text-xs p-1">
      <div className="bg-[#c0c0c0] win98-raised p-2 border-2 border-white max-w-sm w-full">
        {/* Top Score Bar */}
        <div className="win98-sunken p-1.5 mb-2 bg-[#d4d4d4] flex items-center justify-between font-mono text-xs">
          <div>
            <span className="text-gray-600 font-bold">Score: </span>
            <span className="font-bold text-blue-900 text-sm">{score}</span>
          </div>

          {comboBanner && (
            <div className="font-bold text-red-600 animate-bounce text-xs">
              {comboBanner}
            </div>
          )}

          <div>
            <span className="text-gray-600 font-bold">Best: </span>
            <span className="font-bold text-amber-900 text-sm">{highScore}</span>
          </div>
        </div>

        {/* 8x8 Block Blast Grid */}
        <div className="relative win98-sunken bg-[#181818] p-1.5 border-2 border-black mx-auto overflow-hidden">
          <div className="grid grid-cols-8 gap-[2px] bg-[#242424]">
            {board.map((row, r) =>
              row.map((cell, c) => {
                const { isPreview, isValid } = getPreviewState(r, c);

                return (
                  <button
                    key={`${r}-${c}`}
                    onMouseEnter={() => setHoverPosition({ r, c })}
                    onClick={() => handlePlacePiece(r, c)}
                    disabled={isGameOver}
                    className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center transition-none rounded-[2px] ${
                      cell.filled
                        ? `${cell.color} border-t border-l border-white/60 border-b border-r border-black/40 shadow-sm`
                        : isPreview
                        ? isValid
                          ? 'bg-blue-400/70 border border-blue-200 animate-pulse'
                          : 'bg-red-500/60 border border-red-300'
                        : 'bg-[#2a2a2a] hover:bg-[#343434] border border-black/30'
                    }`}
                  />
                );
              })
            )}
          </div>

          {/* Game Over Modal Screen */}
          {isGameOver && (
            <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-3 text-center">
              <div className="text-red-500 font-pixel text-2xl font-bold mb-1 tracking-widest">
                OUT OF SPACE!
              </div>
              <p className="text-[11px] text-gray-200 mb-3 font-win98 max-w-xs">
                {gameOverRoast}
              </p>
              <button
                onClick={resetGame}
                className="px-4 py-1.5 bg-[#c0c0c0] win98-raised win98-btn font-bold text-black flex items-center gap-1 hover:bg-white text-xs"
              >
                <RotateCcw size={12} />
                <span>Play Again (Clear Brain)</span>
              </button>
            </div>
          )}
        </div>

        {/* Available 3 Pieces in Hand */}
        <div className="mt-2 win98-sunken p-2 bg-[#e0e0e0]">
          <div className="text-[10px] text-gray-600 font-bold mb-1 flex items-center justify-between">
            <span>Select a block to place:</span>
            {selectedPieceIndex !== null && (
              <span className="text-blue-800">Click a board cell to drop!</span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 min-h-[64px] items-center justify-items-center">
            {currentHand.map((piece, idx) => {
              if (!piece) {
                return (
                  <div
                    key={idx}
                    className="w-16 h-16 border border-dashed border-gray-400 flex items-center justify-center text-[10px] text-gray-400"
                  >
                    CLEARED
                  </div>
                );
              }

              const isSelected = selectedPieceIndex === idx;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedPieceIndex(isSelected ? null : idx);
                  }}
                  className={`p-1.5 rounded-[2px] transition-all flex items-center justify-center min-w-[56px] min-h-[56px] ${
                    isSelected
                      ? 'win98-sunken bg-white ring-2 ring-blue-600 scale-105'
                      : 'win98-raised bg-[#d0d0d0] hover:bg-white'
                  }`}
                >
                  <div
                    className="grid gap-[1px]"
                    style={{
                      gridTemplateColumns: `repeat(${piece.matrix[0].length}, minmax(0, 1fr))`,
                    }}
                  >
                    {piece.matrix.map((row, r) =>
                      row.map((val, c) => (
                        <div
                          key={`${r}-${c}`}
                          className={`w-3.5 h-3.5 rounded-[1px] ${
                            val === 1
                              ? `${piece.color} border border-black/20`
                              : 'bg-transparent'
                          }`}
                        />
                      ))
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer controls */}
        <div className="mt-2 pt-1 border-t border-[#808080] flex items-center justify-between">
          <div className="text-[10px] text-gray-600">
            Tip: Clear rows & columns together for massive combos!
          </div>

          <button
            onClick={resetGame}
            className="px-2.5 py-1 bg-[#c0c0c0] win98-raised win98-btn text-[11px] text-black"
          >
            Reset Board
          </button>
        </div>
      </div>
    </div>
  );
};
