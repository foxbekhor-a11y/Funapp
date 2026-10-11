import React, { useState } from 'react';
import { Gamepad2, Bomb, Play, Hammer, LayoutGrid, Zap } from 'lucide-react';
import { GeometryDash } from './GeometryDash';
import { BlockBlast } from './BlockBlast';
import { EmotionalMinesweeper } from './EmotionalMinesweeper';
import { DopamineSnake } from './DopamineSnake';
import { WhackAClippy } from './WhackAClippy';
import { sounds } from '../../../utils/soundEffects';

type ActiveGame = 'geometrydash' | 'blockblast' | 'minesweeper' | 'snake' | 'whack';

export const GamesHub: React.FC = () => {
  const [activeGame, setActiveGame] = useState<ActiveGame>('geometrydash');

  const games = [
    {
      id: 'geometrydash' as ActiveGame,
      name: 'Geometry Dash',
      icon: '⚡',
      tagline: 'Rhythmic cyber platformer: jump over spikes of reality before you crash',
    },
    {
      id: 'blockblast' as ActiveGame,
      name: 'Block Blast 98',
      icon: '🧱',
      tagline: 'Fit shapes & blast full rows and columns before your brain runs out of space',
    },
    {
      id: 'minesweeper' as ActiveGame,
      name: 'Trauma Sweeper',
      icon: '💣',
      tagline: 'Avoid emotional triggers on a 9x9 psychological grid',
    },
    {
      id: 'snake' as ActiveGame,
      name: 'Dopamine Snake',
      icon: '🐍',
      tagline: 'Devour instant gratification while anxiety grows behind you',
    },
    {
      id: 'whack' as ActiveGame,
      name: 'Whack-A-Clippy',
      icon: '🔨',
      tagline: 'Relieve frustration by bonking Clippy before he roasts you',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-win98 text-xs p-1 select-none overflow-y-auto">
      {/* Top Game Switcher Tabs */}
      <div className="bg-[#c0c0c0] win98-raised p-1.5 mb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-[#808080] pb-1.5 mb-1.5">
          {games.map((game) => {
            const isSelected = activeGame === game.id;
            return (
              <button
                key={game.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveGame(game.id);
                }}
                className={`px-3 py-1 flex items-center gap-1.5 font-bold transition-none text-xs whitespace-nowrap ${
                  isSelected
                    ? 'win98-sunken bg-white text-[#000080]'
                    : 'win98-raised bg-[#d4d4d4] hover:bg-[#e0e0e0] text-black'
                }`}
              >
                <span>{game.icon}</span>
                <span>{game.name}</span>
              </button>
            );
          })}
        </div>

        {/* Game Tagline */}
        <div className="text-[11px] text-gray-700 italic px-1 flex items-center justify-between">
          <span>{games.find((g) => g.id === activeGame)?.tagline}</span>
          <span className="text-[10px] text-gray-500 font-mono">100% UNPRODUCTIVE</span>
        </div>
      </div>

      {/* Game Content Viewport */}
      <div className="flex-1 flex flex-col items-center justify-center p-1">
        {activeGame === 'geometrydash' && <GeometryDash />}
        {activeGame === 'blockblast' && <BlockBlast />}
        {activeGame === 'minesweeper' && <EmotionalMinesweeper />}
        {activeGame === 'snake' && <DopamineSnake />}
        {activeGame === 'whack' && <WhackAClippy />}
      </div>
    </div>
  );
};
