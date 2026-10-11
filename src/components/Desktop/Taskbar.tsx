import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Tv, Mic, MicOff, MessageSquareWarning } from 'lucide-react';
import { WindowState } from '../../types/windows';
import { sounds } from '../../utils/soundEffects';

interface TaskbarProps {
  windows: WindowState[];
  activeWindowId: string | null;
  onWindowClick: (id: WindowState['id']) => void;
  onStartClick: () => void;
  isStartOpen: boolean;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  insultCount: number;
  wallpaperName: string;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  activeWindowId,
  onWindowClick,
  onStartClick,
  isStartOpen,
  crtEnabled,
  onToggleCrt,
  insultCount,
}) => {
  const [time, setTime] = useState<string>('');
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [voiceOn, setVoiceOn] = useState<boolean>(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    sounds.soundEnabled = next;
    if (next) sounds.playDing();
  };

  const toggleVoice = () => {
    const next = !voiceOn;
    setVoiceOn(next);
    sounds.speechEnabled = next;
    if (!next) sounds.stopSpeaking();
    if (next) sounds.speak("Voice synthesis enabled. Prepare for judgment.");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-9 bg-[#c0c0c0] win98-raised border-t-2 border-white flex items-center justify-between px-1 z-[9999] select-none font-win98 text-xs text-black">
      {/* Left side: Start Button & Task Tabs */}
      <div className="flex items-center gap-1.5 h-full py-0.5 overflow-x-auto overflow-y-hidden">
        {/* Start Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onStartClick();
          }}
          className={`h-7 px-2 flex items-center gap-1.5 font-bold win98-btn ${
            isStartOpen
              ? 'win98-sunken bg-[#d4d4d4]'
              : 'win98-raised bg-[#c0c0c0] active:bg-[#a0a0a0]'
          }`}
        >
          {/* Windows 98 4-color flag */}
          <div className="grid grid-cols-2 gap-0.5 w-4 h-4 shrink-0 shadow-sm">
            <span className="bg-[#ff0000] w-1.5 h-1.5 rounded-[1px]"></span>
            <span className="bg-[#00aa00] w-1.5 h-1.5 rounded-[1px]"></span>
            <span className="bg-[#0000ff] w-1.5 h-1.5 rounded-[1px]"></span>
            <span className="bg-[#ffaa00] w-1.5 h-1.5 rounded-[1px]"></span>
          </div>
          <span className="tracking-wider text-sm font-black">Start</span>
        </button>

        {/* Separator */}
        <div className="h-6 w-[2px] border-l border-[#808080] border-r border-white mx-0.5" />

        {/* Running Window Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-[calc(100vw-360px)]">
          {windows.filter(w => w.isOpen).map((win) => {
            const isActive = win.id === activeWindowId && !win.isMinimized;
            return (
              <button
                key={win.id}
                onClick={() => {
                  sounds.playClick();
                  onWindowClick(win.id);
                }}
                className={`h-7 px-2.5 min-w-[130px] max-w-[190px] flex items-center gap-1.5 truncate text-left transition-none ${
                  isActive
                    ? 'win98-sunken bg-[#e0e0e0] font-bold shadow-[inset_1px_1px_2px_#000]'
                    : 'win98-raised bg-[#c0c0c0] hover:bg-[#d0d0d0]'
                }`}
              >
                <span className="text-sm shrink-0">{win.icon}</span>
                <span className="truncate text-xs">{win.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right side: System Tray */}
      <div className="flex items-center gap-2 h-7 px-2 win98-sunken bg-[#c0c0c0] shrink-0 text-black">
        {/* Insult Counter */}
        <div 
          title={`Total emotional roasts delivered: ${insultCount}`}
          className="flex items-center gap-1 text-[11px] font-mono text-[#000080] bg-[#e6e6e6] px-1.5 py-0.5 border border-[#808080]"
        >
          <MessageSquareWarning size={13} className="text-[#800000]" />
          <span>Roasts: <strong className="text-red-700">{insultCount}</strong></span>
        </div>

        {/* CRT Scanline Toggle */}
        <button
          onClick={() => {
            sounds.playClick();
            onToggleCrt();
          }}
          title={crtEnabled ? "Turn off CRT Scanlines" : "Turn on CRT Scanlines"}
          className={`p-1 win98-raised win98-btn ${crtEnabled ? 'bg-amber-100 win98-sunken' : 'bg-[#c0c0c0]'}`}
        >
          <Tv size={13} className={crtEnabled ? 'text-amber-800' : 'text-gray-700'} />
        </button>

        {/* Voice Synth Toggle */}
        <button
          onClick={toggleVoice}
          title={voiceOn ? "Clippy Voice: ON (Click to Mute Voice)" : "Clippy Voice: OFF (Click to Enable)"}
          className={`p-1 win98-raised win98-btn ${voiceOn ? 'bg-blue-100 win98-sunken' : 'bg-[#c0c0c0]'}`}
        >
          {voiceOn ? <Mic size={13} className="text-blue-800" /> : <MicOff size={13} className="text-gray-500" />}
        </button>

        {/* Sound FX Toggle */}
        <button
          onClick={toggleSound}
          title={soundOn ? "Sound Effects: ON (Click to Mute)" : "Sound Effects: OFF (Click to Enable)"}
          className={`p-1 win98-raised win98-btn ${soundOn ? 'bg-[#c0c0c0]' : 'bg-red-100 win98-sunken'}`}
        >
          {soundOn ? <Volume2 size={13} className="text-gray-800" /> : <VolumeX size={13} className="text-red-600" />}
        </button>

        {/* Live Clock */}
        <div className="font-win98 text-xs font-semibold px-1 text-black min-w-[55px] text-center">
          {time}
        </div>
      </div>
    </div>
  );
};
