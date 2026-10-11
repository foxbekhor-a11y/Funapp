import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, AlertCircle, CheckCircle2 } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

type BlockType = 'delusion' | 'excuse' | 'potential' | 'free' | 'trauma' | 'doomscroll';

const BLOCK_COLORS: Record<BlockType, string> = {
  delusion: 'bg-red-600',       // Red: Delusions of Grandeur
  excuse: 'bg-blue-600',        // Blue: Unused Ambition & Excuses
  potential: 'bg-emerald-500',  // Green: Untapped Potential
  free: 'bg-white',             // White: Free Mental Bandwidth
  trauma: 'bg-amber-400',       // Yellow: Unresolved High School Drama
  doomscroll: 'bg-purple-600',  // Purple: Doomscrolling Cache
};

const STATUS_MESSAGES = [
  "Analyzing cluster 120: Compacting inflated sense of self-worth...",
  "Moving 45MB of 'I will start working out next Monday' to bad sectors...",
  "Consolidating 14 unread books into a single guilt partition...",
  "Relocating imposter syndrome... (Warning: File is currently in use by your ego)",
  "Found 84,000 fragmented thoughts about ex-partners. Reallocating to oblivion...",
  "Compressing 12GB of imaginary arguments won in the shower...",
  "Defragging career expectations: Downscaling from 'CEO by 30' to 'Employed'...",
  "Clearing temporary delusion cache from LinkedIn posts...",
  "Writing contiguous block of actual accountability... (Write error: Hardware resisting)",
  "Ego defragmentation 99% complete: Remaining space allocated to self-awareness."
];

export const EgoDefragmenter: React.FC = () => {
  const [blocks, setBlocks] = useState<BlockType[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>("Click 'Defragment' to clean up your fragmented psyche.");
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const intervalRef = useRef<any>(null);

  // Initialize blocks grid (200 blocks)
  useEffect(() => {
    resetGrid();
  }, []);

  const resetGrid = () => {
    const initial: BlockType[] = [];
    const types: BlockType[] = ['delusion', 'excuse', 'potential', 'free', 'trauma', 'doomscroll'];
    for (let i = 0; i < 200; i++) {
      const rand = Math.random();
      if (rand < 0.28) initial.push('delusion');
      else if (rand < 0.52) initial.push('excuse');
      else if (rand < 0.68) initial.push('doomscroll');
      else if (rand < 0.82) initial.push('trauma');
      else if (rand < 0.92) initial.push('potential');
      else initial.push('free');
    }
    setBlocks(initial);
    setProgress(0);
    setIsRunning(false);
    setIsPaused(false);
    setIsComplete(false);
    setStatusText("Drive C: PSYCHE is 89% fragmented. Major personality overhaul recommended.");
  };

  const startDefrag = () => {
    sounds.playClick();
    if (isComplete) resetGrid();
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseDefrag = () => {
    sounds.playClick();
    setIsPaused(!isPaused);
  };

  const stopDefrag = () => {
    sounds.playClick();
    setIsRunning(false);
    setIsPaused(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStatusText("Defragmentation cancelled. Your mind remains a chaotic dumpster fire.");
  };

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsComplete(true);
            sounds.playDing();
            setStatusText("Defragmentation Complete! Reduced ego by 86%. You are now slightly more bearable.");
            return 100;
          }

          // Sound effect every few ticks
          if (Math.random() < 0.4) {
            sounds.playFloppySeek();
          }

          // Update status message
          const msgIdx = Math.min(
            STATUS_MESSAGES.length - 1,
            Math.floor((prev / 100) * STATUS_MESSAGES.length)
          );
          setStatusText(STATUS_MESSAGES[msgIdx]);

          // Shift blocks to organize: gather green/free at front, pack excuses
          setBlocks((currentBlocks) => {
            const next = [...currentBlocks];
            const swapIdx1 = Math.floor(Math.random() * next.length);
            const swapIdx2 = Math.floor(Math.random() * next.length);
            const temp = next[swapIdx1];
            next[swapIdx1] = next[swapIdx2];
            next[swapIdx2] = temp;

            // Slowly organize into free / compacted
            if (prev > 50 && Math.random() < 0.3) {
              const target = Math.floor((prev / 100) * next.length);
              next[target] = Math.random() < 0.7 ? 'free' : 'potential';
            }
            return next;
          });

          return prev + 1;
        });
      }, 150);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isPaused]);

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-win98 text-xs p-1 select-none">
      {/* Drive Info Bar */}
      <div className="bg-[#c0c0c0] win98-raised p-2 mb-2 flex items-center justify-between">
        <div>
          <div className="font-bold text-sm text-[#000080]">
            Defragmenting Drive C: (PSYCHE)
          </div>
          <div className="text-[11px] text-gray-700">
            Capacity: 512 MB · Free Space: 14 MB (2.7%) · Fragmentation: {Math.max(0, 89 - Math.floor(progress * 0.8))}%
          </div>
        </div>
        <div className="text-right">
          <div className="font-pixel text-xl text-[#000080] font-bold">
            {progress}% Completed
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-5 w-full bg-[#ffffff] win98-sunken mb-2 p-0.5 relative">
        <div 
          className="h-full bg-gradient-to-r from-[#000080] to-[#1084d0] transition-all duration-100 flex items-center justify-end pr-1 text-white text-[10px] font-bold"
          style={{ width: `${progress}%` }}
        >
          {progress > 8 && `${progress}%`}
        </div>
      </div>

      {/* Cluster Map Viewport (Authentic Windows 98 Defrag Grid) */}
      <div className="flex-1 bg-white win98-sunken p-2 overflow-auto flex flex-col justify-between min-h-[180px]">
        <div className="grid grid-cols-20 gap-[2px] w-full">
          {blocks.map((block, idx) => (
            <div
              key={idx}
              title={`Cluster #${idx}: ${block}`}
              className={`h-3 w-full rounded-[1px] border border-black/10 transition-colors duration-75 ${BLOCK_COLORS[block]} ${
                isRunning && Math.abs((idx % 20) - (progress % 20)) < 2 ? 'ring-1 ring-black animate-pulse' : ''
              }`}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-2 p-1.5 bg-[#d4d4d4] win98-raised text-[10px] grid grid-cols-3 gap-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-red-600 border border-black" />
          <span>Delusions of Grandeur</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-blue-600 border border-black" />
          <span>Excuses & Procrastination</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-purple-600 border border-black" />
          <span>Doomscroll Cache</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-amber-400 border border-black" />
          <span>Unprocessed Trauma</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-emerald-500 border border-black" />
          <span>Untapped Potential</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-white border border-black" />
          <span>Free Mental Clarity</span>
        </div>
      </div>

      {/* Status Output Ticker */}
      <div className="mt-2 win98-sunken p-1.5 bg-[#ffffdf] text-[11px] text-gray-900 truncate font-mono">
        <span className="font-bold text-[#000080]">Status: </span>
        {statusText}
      </div>

      {/* Controls */}
      <div className="mt-2 flex items-center justify-between pt-1 border-t border-[#808080]">
        <div className="flex items-center gap-1.5">
          {!isRunning ? (
            <button
              onClick={startDefrag}
              className="px-4 py-1.5 bg-[#c0c0c0] win98-raised win98-btn font-bold flex items-center gap-1 hover:bg-[#d4d4d4] text-black"
            >
              <Play size={12} fill="currentColor" />
              <span>{isComplete ? "Defrag Again" : "Defragment Ego"}</span>
            </button>
          ) : (
            <>
              <button
                onClick={pauseDefrag}
                className="px-3 py-1.5 bg-[#c0c0c0] win98-raised win98-btn flex items-center gap-1 hover:bg-[#d4d4d4] text-black"
              >
                <Pause size={12} fill="currentColor" />
                <span>{isPaused ? "Resume" : "Pause"}</span>
              </button>
              <button
                onClick={stopDefrag}
                className="px-3 py-1.5 bg-[#c0c0c0] win98-raised win98-btn flex items-center gap-1 hover:bg-[#d4d4d4] text-black"
              >
                <Square size={12} fill="currentColor" />
                <span>Stop</span>
              </button>
            </>
          )}
        </div>

        <button
          onClick={resetGrid}
          className="px-3 py-1.5 bg-[#c0c0c0] win98-raised win98-btn hover:bg-[#d4d4d4] text-black"
        >
          Reset Mind Drive
        </button>
      </div>
    </div>
  );
};
