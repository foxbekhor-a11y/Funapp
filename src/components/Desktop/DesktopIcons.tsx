import React, { useState } from 'react';
import { 
  Bot, 
  HardDrive, 
  Activity, 
  Award, 
  Trash2, 
  FileText, 
  Monitor, 
  Flame,
  HelpCircle,
  Gamepad2,
  Pickaxe,
  Globe,
  Sliders
} from 'lucide-react';
import { AppId } from '../../types/windows';
import { sounds } from '../../utils/soundEffects';

interface DesktopIconsProps {
  onOpenApp: (id: AppId) => void;
  onOpenBSOD: () => void;
}

interface DesktopItem {
  id: AppId | 'bsod_trigger';
  title: string;
  icon: React.ReactNode;
  isSpecial?: boolean;
}

export const DesktopIcons: React.FC<DesktopIconsProps> = ({ onOpenApp, onOpenBSOD }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const items: DesktopItem[] = [
    {
      id: 'browser',
      title: 'The Internet',
      icon: (
        <div className="w-9 h-9 bg-sky-100 win98-raised flex items-center justify-center rounded-[2px] shadow">
          <Globe size={22} className="text-[#0055ff]" />
        </div>
      ),
    },
    {
      id: 'macos',
      title: 'Macintosh',
      icon: (
        <div className="w-9 h-9 bg-[#f4efe1] win98-raised flex flex-col items-center justify-center rounded-[2px] shadow border border-black/40">
          <span className="text-xl">🍎</span>
        </div>
      ),
    },
    {
      id: 'self_help',
      title: 'Emotional Troubleshooter',
      icon: (
        <div className="w-9 h-9 bg-blue-100 win98-raised flex items-center justify-center rounded-[2px] shadow">
          <Bot size={22} className="text-[#000080]" />
        </div>
      ),
    },
    {
      id: 'minecraft',
      title: 'Minecraft',
      icon: (
        <div className="w-9 h-9 bg-[#55aa33] win98-raised flex flex-col rounded-[2px] shadow overflow-hidden border border-black/40">
          <div className="h-3 bg-[#66bb44]" />
          <div className="flex-1 bg-[#866043] flex items-center justify-center">
            <Pickaxe size={14} className="text-yellow-300 drop-shadow" />
          </div>
        </div>
      ),
    },
    {
      id: 'games',
      title: 'Games',
      icon: (
        <div className="w-9 h-9 bg-purple-100 win98-raised flex items-center justify-center rounded-[2px] shadow">
          <Gamepad2 size={22} className="text-purple-800" />
        </div>
      ),
    },
    {
      id: 'defrag',
      title: 'Ego Defrag',
      icon: (
        <div className="w-9 h-9 bg-teal-100 win98-raised flex items-center justify-center rounded-[2px] shadow">
          <HardDrive size={22} className="text-[#008080]" />
        </div>
      ),
    },
    {
      id: 'task_mgr',
      title: 'Life Task Mgr',
      icon: (
        <div className="w-9 h-9 bg-red-100 win98-raised flex items-center justify-center rounded-[2px] shadow">
          <Activity size={22} className="text-red-700" />
        </div>
      ),
    },
    {
      id: 'settings',
      title: 'Control Panel',
      icon: (
        <div className="w-9 h-9 bg-slate-200 win98-raised flex items-center justify-center rounded-[2px] shadow">
          <Sliders size={22} className="text-slate-800" />
        </div>
      ),
    },
    {
      id: 'certificate',
      title: 'Failure Proof',
      icon: (
        <div className="w-9 h-9 bg-amber-100 win98-raised flex items-center justify-center rounded-[2px] shadow">
          <Award size={22} className="text-amber-800" />
        </div>
      ),
    },
    {
      id: 'recycle_bin',
      title: 'Recycle Bin of Regrets',
      icon: (
        <div className="w-9 h-9 bg-gray-200 win98-raised flex items-center justify-center rounded-[2px] shadow">
          <Trash2 size={22} className="text-gray-700" />
        </div>
      ),
    },
    {
      id: 'bsod_trigger',
      title: 'Emergency BSOD',
      icon: (
        <div className="w-9 h-9 bg-blue-900 win98-raised flex items-center justify-center rounded-[2px] shadow">
          <Flame size={20} className="text-yellow-400" />
        </div>
      ),
      isSpecial: true,
    },
    {
      id: 'readme',
      title: 'README_CRYING.txt',
      icon: (
        <div className="w-9 h-9 bg-white win98-raised flex items-center justify-center rounded-[2px] shadow">
          <FileText size={22} className="text-blue-900" />
        </div>
      ),
    },
  ];

  const handleItemClick = (id: string) => {
    setSelectedId(id);
    sounds.playClick();
  };

  const handleItemDoubleClick = (item: DesktopItem) => {
    sounds.playClick();
    if (item.id === 'bsod_trigger') {
      onOpenBSOD();
    } else {
      onOpenApp(item.id as AppId);
    }
  };

  return (
    <div 
      className="absolute top-4 left-4 grid grid-flow-col grid-rows-6 auto-cols-max gap-x-5 gap-y-2.5 z-10 select-none font-win98"
      onClick={() => setSelectedId(null)}
    >
      {items.map((item) => {
        const isSelected = selectedId === item.id;
        return (
          <div
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              handleItemClick(item.id);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              handleItemDoubleClick(item);
            }}
            className={`w-20 flex flex-col items-center text-center p-1.5 cursor-pointer rounded-[2px] group ${
              isSelected ? 'bg-[#000080]/60 ring-1 ring-dotted ring-yellow-200' : 'hover:bg-black/10'
            }`}
          >
            <div className="mb-1 drop-shadow-md transition-transform group-hover:scale-105">
              {item.icon}
            </div>
            <span
              className={`text-[11px] leading-tight px-1 py-0.5 rounded-[1px] break-words text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${
                isSelected ? 'bg-[#000080] text-yellow-200 outline outline-1 outline-dotted outline-yellow-300' : ''
              }`}
            >
              {item.title}
            </span>
          </div>
        );
      })}
    </div>
  );
};
