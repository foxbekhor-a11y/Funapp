import React, { useState } from 'react';
import { Power, AlertCircle, RefreshCw } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface ShutdownDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteShutdown: () => void;
}

export const ShutdownDialog: React.FC<ShutdownDialogProps> = ({
  isOpen,
  onClose,
  onExecuteShutdown,
}) => {
  const [selectedOption, setSelectedOption] = useState<'shutdown' | 'restart' | 'standby'>('shutdown');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[99999] flex items-center justify-center p-4 select-none font-win98">
      <div className="w-[380px] bg-[#c0c0c0] win98-raised shadow-2xl p-1 flex flex-col gap-2 text-black">
        {/* Title Bar */}
        <div className="win98-titlebar px-2 py-1 text-white font-bold text-xs flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Power size={13} className="text-red-400" />
            <span>Shut Down Windows 98</span>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-4 h-4 bg-[#c0c0c0] win98-raised win98-btn flex items-center justify-center text-black font-bold text-[10px]"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-3 flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 win98-raised flex items-center justify-center shrink-0">
            <Power size={24} className="text-red-700" />
          </div>

          <div className="space-y-3 flex-1 text-xs">
            <p className="font-semibold text-gray-900">
              What do you want the computer to do with your unresolved dilemmas?
            </p>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="shutdown_mode"
                  checked={selectedOption === 'shutdown'}
                  onChange={() => setSelectedOption('shutdown')}
                  className="accent-[#000080]"
                />
                <span>Shut down (Give up on your ambitions for today)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="shutdown_mode"
                  checked={selectedOption === 'restart'}
                  onChange={() => setSelectedOption('restart')}
                  className="accent-[#000080]"
                />
                <span>Restart (Reboot bad habits with zero modifications)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="shutdown_mode"
                  checked={selectedOption === 'standby'}
                  onChange={() => setSelectedOption('standby')}
                  className="accent-[#000080]"
                />
                <span>Stand by (Lie in bed scrolling until 3:00 AM)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="p-2 border-t border-[#808080] flex justify-end gap-2">
          <button
            onClick={() => {
              sounds.playError();
              onExecuteShutdown();
            }}
            className="px-4 py-1.5 bg-[#c0c0c0] win98-raised win98-btn font-bold hover:bg-[#d4d4d4] text-xs text-black"
          >
            OK (Surrender)
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-1.5 bg-[#c0c0c0] win98-raised win98-btn hover:bg-[#d4d4d4] text-xs text-black"
          >
            Cancel (Try Again)
          </button>
        </div>
      </div>
    </div>
  );
};
