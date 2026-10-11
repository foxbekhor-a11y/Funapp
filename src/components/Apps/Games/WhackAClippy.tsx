import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Award, Flame, AlertCircle } from 'lucide-react';
import { sounds } from '../../../utils/soundEffects';

interface MonitorHole {
  id: number;
  hasClippy: boolean;
  isHit: boolean;
  taunt: string;
}

const CLIPPY_TAUNTS = [
  "Too slow!",
  "Missed again!",
  "Still single?",
  "Lagging behind!",
  "Try harder!",
  "Is that all?",
  "0 APM detected!",
  "Nice reflex!",
  "Predictable!"
];

export const WhackAClippy: React.FC = () => {
  const [holes, setHoles] = useState<MonitorHole[]>(
    Array.from({ length: 9 }, (_, i) => ({
      id: i,
      hasClippy: false,
      isHit: false,
      taunt: '',
    }))
  );
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [finalReport, setFinalReport] = useState<string>('');
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('whack_clippy_highscore') || '0', 10);
  });

  const timerRef = useRef<any>(null);
  const clippyPopRef = useRef<any>(null);

  // Start round
  const startGame = () => {
    sounds.playClick();
    setScore(0);
    setTimeLeft(30);
    setIsGameOver(false);
    setIsPlaying(true);
    setFinalReport('');
  };

  // Timer countdown
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            endGame();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, timeLeft]);

  // Clippy popup interval
  useEffect(() => {
    if (isPlaying) {
      clippyPopRef.current = setInterval(() => {
        const randomHole = Math.floor(Math.random() * 9);
        const randomTaunt = CLIPPY_TAUNTS[Math.floor(Math.random() * CLIPPY_TAUNTS.length)];

        setHoles((prev) =>
          prev.map((h, i) =>
            i === randomHole
              ? { ...h, hasClippy: true, isHit: false, taunt: randomTaunt }
              : { ...h, hasClippy: false, isHit: false }
          )
        );

        // Hide after 900ms
        setTimeout(() => {
          setHoles((prev) =>
            prev.map((h, i) => (i === randomHole ? { ...h, hasClippy: false } : h))
          );
        }, 850);
      }, 1100);
    } else {
      if (clippyPopRef.current) clearInterval(clippyPopRef.current);
    }
    return () => {
      if (clippyPopRef.current) clearInterval(clippyPopRef.current);
    };
  }, [isPlaying]);

  const endGame = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    if (clippyPopRef.current) clearInterval(clippyPopRef.current);
    sounds.playDing();

    setHoles((prev) => prev.map((h) => ({ ...h, hasClippy: false, isHit: false })));

    setScore((currScore) => {
      if (currScore > highScore) {
        setHighScore(currScore);
        localStorage.setItem('whack_clippy_highscore', currScore.toString());
      }

      let evaluation = '';
      if (currScore >= 180) {
        evaluation = `Score: ${currScore}. Unusually aggressive! You took out all your pent-up frustration on an innocent piece of office stationery.`;
      } else if (currScore >= 100) {
        evaluation = `Score: ${currScore}. Mediocre coordination. Clippy sustained minor dents, but your ego remains thoroughly bruised.`;
      } else {
        evaluation = `Score: ${currScore}. Abysmal! Clippy dodged your slow clicks with contemptuous ease.`;
      }
      setFinalReport(evaluation);
      sounds.speak(evaluation, 'clippy');
      return currScore;
    });
  };

  const handleWhack = (holeId: number) => {
    if (!isPlaying) return;

    const hole = holes[holeId];
    if (hole.hasClippy && !hole.isHit) {
      sounds.playWhack();
      setScore((s) => s + 15);
      setHoles((prev) =>
        prev.map((h) => (h.id === holeId ? { ...h, isHit: true, hasClippy: false } : h))
      );
    } else {
      sounds.playClick();
      setScore((s) => Math.max(0, s - 5));
    }
  };

  return (
    <div className="flex flex-col items-center select-none font-win98 text-xs p-1">
      <div className="bg-[#c0c0c0] win98-raised p-2 border-2 border-white max-w-sm w-full">
        {/* Header HUD */}
        <div className="win98-sunken p-1.5 mb-2 bg-[#d4d4d4] flex items-center justify-between font-mono text-xs">
          <div>
            <span className="text-gray-600 font-bold">Frustration: </span>
            <span className="font-bold text-red-700 text-sm">{score}</span>
          </div>
          <div>
            <span className="text-gray-600 font-bold">Time: </span>
            <span className="font-pixel text-lg font-bold text-blue-900">{timeLeft}s</span>
          </div>
          <div>
            <span className="text-gray-600 font-bold">High: </span>
            <span className="font-bold text-black">{highScore}</span>
          </div>
        </div>

        {/* 3x3 CRT Monitors Grid */}
        <div className="win98-sunken bg-[#202020] p-3 border-2 border-black grid grid-cols-3 gap-2.5 mx-auto">
          {holes.map((hole) => (
            <div
              key={hole.id}
              onClick={() => handleWhack(hole.id)}
              className="relative w-20 h-20 bg-[#404040] rounded-sm p-1 border-2 border-gray-600 shadow-inner flex flex-col items-center justify-center cursor-crosshair overflow-hidden group hover:border-gray-400 active:scale-95 transition-transform"
            >
              {/* CRT screen bezel */}
              <div className="w-full h-full bg-[#112211] border border-black rounded-[2px] relative flex items-center justify-center overflow-hidden">
                {/* CRT Scanline */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none" />

                {/* Clippy popping up */}
                {hole.hasClippy && (
                  <div className="animate-bounce flex flex-col items-center">
                    <span className="text-2xl drop-shadow">📎</span>
                    <span className="text-[8px] bg-yellow-200 text-black px-1 rounded-sm border border-black font-bold whitespace-nowrap -mt-1 shadow">
                      {hole.taunt}
                    </span>
                  </div>
                )}

                {/* Hit effect */}
                {hole.isHit && (
                  <div className="text-2xl animate-ping text-red-500 font-bold">
                    💥
                  </div>
                )}

                {/* Idle screen noise */}
                {!hole.hasClippy && !hole.isHit && (
                  <span className="text-[10px] text-green-700/60 font-mono">
                    STANDBY
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Control Footer */}
        <div className="mt-2 pt-1 border-t border-[#808080] flex items-center justify-between">
          <div className="text-[10px] text-gray-700">
            {isPlaying ? "Click monitors when Clippy appears!" : "Click Start to whack Clippy"}
          </div>

          <button
            onClick={startGame}
            disabled={isPlaying}
            className="px-3 py-1 bg-[#c0c0c0] win98-raised win98-btn font-bold text-xs text-black flex items-center gap-1 hover:bg-[#d4d4d4] disabled:opacity-50"
          >
            <Play size={12} fill="currentColor" />
            <span>{isGameOver ? "Play Again" : "Start Whacking"}</span>
          </button>
        </div>

        {/* Final Report */}
        {isGameOver && finalReport && (
          <div className="mt-2 p-2 bg-[#ffffcc] win98-raised border border-black text-xs text-black animate-fade-in">
            <div className="font-bold text-[#000080] flex items-center gap-1 mb-1">
              <Award size={13} className="text-amber-800" />
              <span>Clippy's Battle Assessment:</span>
            </div>
            <p className="text-[11px] leading-snug">{finalReport}</p>
          </div>
        )}
      </div>
    </div>
  );
};
