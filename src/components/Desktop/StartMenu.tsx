import React, { useState } from 'react';
import { 
  Bot, 
  HardDrive, 
  Activity, 
  Award, 
  Trash2, 
  Sliders, 
  HelpCircle, 
  Power, 
  ChevronRight,
  Flame,
  FileText,
  Gamepad2,
  Pickaxe,
  Globe
} from 'lucide-react';
import { AppId } from '../../types/windows';
import { sounds } from '../../utils/soundEffects';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (id: AppId) => void;
  onTriggerQuickRoast: () => void;
  onTriggerShutdown: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  isOpen,
  onClose,
  onOpenApp,
  onTriggerQuickRoast,
  onTriggerShutdown
}) => {
  const [showPrograms, setShowPrograms] = useState(false);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed bottom-9 left-0 w-64 bg-[#c0c0c0] win98-raised shadow-2xl z-[10000] flex font-win98 text-xs select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Windows 98 Vertical Strip */}
      <div className="w-8 bg-gradient-to-b from-[#000080] via-[#1084d0] to-[#000080] flex flex-col justify-end items-center pb-3 text-white">
        <span className="font-black text-sm tracking-widest -rotate-90 origin-center whitespace-nowrap mb-6 font-pixel text-lg">
          Windows<span className="text-amber-300 font-bold ml-1">98</span>
        </span>
      </div>

      {/* Menu Items */}
      <div className="flex-1 py-1.5 flex flex-col">
        {/* Programs Submenu */}
        <div 
          className="relative"
          onMouseEnter={() => setShowPrograms(true)}
          onMouseLeave={() => setShowPrograms(false)}
        >
          <div 
            className="flex items-center justify-between px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <Bot size={16} className="text-[#000080] group-hover:text-white" />
              <span className="font-semibold">Trauma Programs</span>
            </div>
            <ChevronRight size={14} />
          </div>

          {/* Programs flyout */}
          {showPrograms && (
            <div className="absolute left-full -top-1 w-64 bg-[#c0c0c0] win98-raised shadow-2xl py-1 z-50">
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenApp('browser');
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#000080] hover:text-white text-left text-black"
              >
                <Globe size={15} className="text-blue-600" />
                <div>
                  <div className="font-bold">The Internet (Explorer 5.0)</div>
                  <div className="text-[10px] text-gray-600 hover:text-white">World Wide Web & Yahooligans!</div>
                </div>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenApp('self_help');
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#000080] hover:text-white text-left text-black"
              >
                <Bot size={15} className="text-blue-800" />
                <div>
                  <div className="font-bold">Emotional Troubleshooter</div>
                  <div className="text-[10px] text-gray-600 hover:text-white">AI roasts your dilemmas</div>
                </div>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenApp('minecraft');
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#000080] hover:text-white text-left text-black"
              >
                <div className="w-4 h-4 bg-[#55aa33] rounded-[1px] border border-black/40 flex items-center justify-center">
                  <Pickaxe size={11} className="text-yellow-300" />
                </div>
                <div>
                  <div className="font-bold">Minecraft Launcher</div>
                  <div className="text-[10px] text-gray-600">Beta 1.7.3 Procrastination Edition</div>
                </div>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenApp('games');
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#000080] hover:text-white text-left text-black"
              >
                <Gamepad2 size={15} className="text-purple-800" />
                <div>
                  <div className="font-bold">Games (Entertainment)</div>
                  <div className="text-[10px] text-gray-600">Minesweeper, Snake, Whack-Clippy</div>
                </div>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenApp('defrag');
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#000080] hover:text-white text-left text-black"
              >
                <HardDrive size={15} className="text-teal-800" />
                <div>
                  <div className="font-bold">Ego Defragmenter</div>
                  <div className="text-[10px] text-gray-600">Reorganize poor choices</div>
                </div>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenApp('task_mgr');
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#000080] hover:text-white text-left text-black"
              >
                <Activity size={15} className="text-red-800" />
                <div>
                  <div className="font-bold">Life Task Manager</div>
                  <div className="text-[10px] text-gray-600">End unproductive processes</div>
                </div>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenApp('certificate');
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#000080] hover:text-white text-left text-black"
              >
                <Award size={15} className="text-amber-800" />
                <div>
                  <div className="font-bold">Failure Certificate</div>
                  <div className="text-[10px] text-gray-600">Print formal inadequacy proof</div>
                </div>
              </button>

              <div className="h-[1px] bg-[#808080] border-b border-white my-1" />

              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenApp('recycle_bin');
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#000080] hover:text-white text-left text-black"
              >
                <Trash2 size={15} className="text-gray-800" />
                <span>Recycle Bin of Regrets</span>
              </button>
            </div>
          )}
        </div>

        {/* Instant Reality Check */}
        <button
          onClick={() => {
            sounds.playError();
            onTriggerQuickRoast();
            onClose();
          }}
          className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-pointer text-left text-black"
        >
          <Flame size={16} className="text-red-600" />
          <span>Emergency Reality Check</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => {
            sounds.playClick();
            onOpenApp('settings');
            onClose();
          }}
          className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-pointer text-left text-black"
        >
          <Sliders size={16} className="text-gray-700" />
          <span>Control Panel & Themes...</span>
        </button>

        {/* Readme Help */}
        <button
          onClick={() => {
            sounds.playClick();
            onOpenApp('readme');
            onClose();
          }}
          className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-pointer text-left text-black"
        >
          <HelpCircle size={16} className="text-blue-700" />
          <span>Help Topics: Why Am I Like This?</span>
        </button>

        <div className="h-[1px] bg-[#808080] border-b border-white my-1.5 mx-1" />

        {/* Shut Down */}
        <button
          onClick={() => {
            sounds.playError();
            onTriggerShutdown();
            onClose();
          }}
          className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-pointer text-left text-black font-semibold"
        >
          <Power size={16} className="text-red-700" />
          <span>Shut Down (Give Up)...</span>
        </button>
      </div>
    </div>
  );
};
