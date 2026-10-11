import React from 'react';
import { Monitor, Volume2, Mic, Tv, Image, RotateCcw } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface SettingsWindowProps {
  currentWallpaper: string;
  onSelectWallpaper: (wp: string) => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
}

export const WALLPAPERS = [
  { id: 'clouds', name: 'Windows 98 Clouds (Nostalgia)', type: 'image', value: '/src/assets/images/windows_clouds_wallpaper_1791036957619.jpg' },
  { id: 'teal', name: 'Classic Windows 95 Teal', type: 'color', value: '#008080' },
  { id: 'navy', name: 'Deep Navy Blue (NT Server)', type: 'color', value: '#000080' },
  { id: 'matrix', name: 'Terminal Green (1999)', type: 'color', value: '#031408' },
];

export const SettingsWindow: React.FC<SettingsWindowProps> = ({
  currentWallpaper,
  onSelectWallpaper,
  crtEnabled,
  onToggleCrt,
}) => {
  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-win98 text-xs p-2 select-none overflow-y-auto text-black">
      {/* Top Banner */}
      <div className="bg-[#c0c0c0] win98-raised p-2 mb-2 flex items-center gap-2">
        <Monitor size={24} className="text-[#000080]" />
        <div>
          <div className="font-bold text-sm text-[#000080]">Display & Audio Properties</div>
          <div className="text-[11px] text-gray-700">Customize your retro Windows 98 suffering environment.</div>
        </div>
      </div>

      {/* Monitor Preview Box */}
      <div className="flex justify-center mb-3">
        <div className="w-56 h-36 bg-[#404040] rounded-t-lg p-2 border-4 border-[#808080] shadow-md flex flex-col items-center justify-center relative">
          <div 
            className="w-full h-full rounded border-2 border-black flex items-center justify-center overflow-hidden bg-cover bg-center"
            style={{
              backgroundColor: currentWallpaper.startsWith('#') ? currentWallpaper : '#008080',
              backgroundImage: currentWallpaper.startsWith('/') ? `url(${currentWallpaper})` : 'none',
            }}
          >
            <div className="bg-white/80 win98-raised px-2 py-0.5 text-[9px] font-bold text-black shadow">
              Win98 Desktop
            </div>
          </div>
          {/* Monitor stand */}
          <div className="absolute -bottom-3 w-16 h-3 bg-[#606060] rounded-b border-t border-black"></div>
        </div>
      </div>

      {/* Wallpaper Selection Box */}
      <div className="win98-raised p-2.5 mb-3 bg-[#c0c0c0]">
        <div className="font-bold text-xs mb-1.5 flex items-center gap-1.5">
          <Image size={14} className="text-blue-800" />
          <span>Desktop Wallpaper:</span>
        </div>
        <div className="space-y-1 win98-sunken p-1.5 bg-white max-h-28 overflow-y-auto">
          {WALLPAPERS.map((wp) => (
            <div
              key={wp.id}
              onClick={() => {
                sounds.playClick();
                onSelectWallpaper(wp.value);
              }}
              className={`p-1.5 flex items-center justify-between cursor-pointer rounded-[1px] ${
                currentWallpaper === wp.value
                  ? 'bg-[#000080] text-white font-bold'
                  : 'hover:bg-blue-50 text-black'
              }`}
            >
              <span>{wp.name}</span>
              <span className="text-[10px] opacity-75">
                {wp.type === 'image' ? '16:9 Image' : 'Solid Color'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Retro CRT Scanlines & Visual Effects */}
      <div className="win98-raised p-2.5 mb-2 bg-[#c0c0c0] space-y-2">
        <div className="font-bold text-xs flex items-center gap-1.5">
          <Tv size={14} className="text-amber-800" />
          <span>Visual & CRT Settings:</span>
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-xs">
          <input
            type="checkbox"
            checked={crtEnabled}
            onChange={() => {
              sounds.playClick();
              onToggleCrt();
            }}
            className="w-4 h-4 cursor-pointer accent-[#000080]"
          />
          <span className="font-medium">Enable CRT Monitor Scanlines & RGB Phosphor Simulation</span>
        </label>
      </div>

      {/* Info note */}
      <div className="text-[11px] text-gray-600 italic px-1">
        * Note: Changing wallpapers will not disguise the fact that you haven't opened a textbook or completed your taxes.
      </div>
    </div>
  );
};
