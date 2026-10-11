import React, { useEffect } from 'react';
import { sounds } from '../../utils/soundEffects';

interface BSODModalProps {
  isOpen: boolean;
  onClose: () => void;
  customError?: string;
}

export const BSODModal: React.FC<BSODModalProps> = ({ isOpen, onClose, customError }) => {
  useEffect(() => {
    if (isOpen) {
      sounds.playError();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') {
          sounds.playStartup();
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      onClick={() => {
        sounds.playStartup();
        onClose();
      }}
      className="fixed inset-0 z-[999999] bg-[#0000aa] text-white font-mono p-8 select-none flex flex-col justify-between cursor-pointer overflow-auto text-xs md:text-sm leading-relaxed"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="text-center font-bold">
          <span className="bg-[#aaaaaa] text-[#0000aa] px-4 py-1 text-sm md:text-base font-bold tracking-wider">
            Windows 98 Self-Help Subsystem
          </span>
        </div>

        <p className="mt-4">
          A fatal exception 0E has occurred at 0028:C0011E36 in VXD COPING(01) + 00000E36.
          The current emotional state will be terminated.
        </p>

        <div className="bg-[#000088] p-4 border border-blue-400/30 space-y-2">
          <p className="font-bold text-yellow-300">
            * Faulting Component: {customError || 'KERNEL_PANIC: LACK_OF_GRIT_EXCEPTION (0xDEADBEEF)'}
          </p>
          <p>
            * Address: 0x000000bad in file C:\HUMANITY\ACCOUNTABILITY.SYS
          </p>
          <p>
            * Diagnostic: Physical memory dump of all your rationalizations completed.
          </p>
        </div>

        <div className="space-y-3 text-gray-200">
          <p>
            If this is the first time you've received this error screen, take a deep breath and accept that you're an adult who must deal with your own problems.
          </p>
          <p>
            If this screen appears again after every minor inconvenience:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-xs">
            <li>Check for newly installed excuses or toxic relationships.</li>
            <li>Disable all self-pity caching in BIOS settings.</li>
            <li>Consult your therapist or turn your attitude off and on again.</li>
          </ul>
        </div>

        <div className="mt-8 pt-4 border-t border-blue-400/40 text-center animate-pulse text-yellow-200 font-bold">
          Press ENTER to restart your life or CLICK ANYWHERE to reboot into Windows...
        </div>
      </div>

      <div className="text-center text-[10px] text-blue-300">
        Technical Information: *** STOP: 0x0000007B (0x8042B340, 0x00000000, 0x00000000, 0x00000000)
      </div>
    </div>
  );
};
