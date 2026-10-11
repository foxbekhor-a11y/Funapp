import React, { useState, useRef, useEffect } from 'react';
import { Minus, Square, X, Copy, Maximize2, Minimize2 } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface WindowFrameProps {
  id: string;
  title: string;
  icon?: string | React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isFullscreen?: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isActive: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onToggleFullscreen?: () => void;
  onMove: (x: number, y: number) => void;
  children: React.ReactNode;
  menuBar?: Array<{ label: string; items?: string[] }>;
  statusBarText?: string;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  title,
  icon,
  isOpen,
  isMinimized,
  isMaximized,
  isFullscreen = false,
  x,
  y,
  width,
  height,
  zIndex,
  isActive,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onToggleFullscreen,
  onMove,
  children,
  menuBar,
  statusBarText = 'Ready to diagnose inadequacies'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || isMaximized || isFullscreen) return;
      const newX = Math.max(0, Math.min(window.innerWidth - 120, e.clientX - dragOffset.current.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 80, e.clientY - dragOffset.current.y));
      onMove(newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isMaximized, isFullscreen, onMove]);

  if (!isOpen || isMinimized) return null;

  const handleTitleMouseDown = (e: React.MouseEvent) => {
    onFocus();
    if (isMaximized || isFullscreen) return;
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - x,
      y: e.clientY - y
    };
  };

  const style: React.CSSProperties = isFullscreen
    ? {
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 100000,
        borderRadius: 0,
      }
    : isMaximized
    ? {
        left: 0,
        top: 0,
        width: '100vw',
        height: 'calc(100vh - 36px)',
        zIndex
      }
    : {
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex
      };

  return (
    <div
      onClick={onFocus}
      style={style}
      className={`fixed flex flex-col bg-[#c0c0c0] win98-raised shadow-xl select-none font-win98 text-xs text-black transition-none overflow-hidden ${
        isActive ? 'ring-1 ring-blue-900/30' : 'opacity-95'
      } ${isFullscreen ? 'border-none win98-raised-none' : ''}`}
    >
      {/* Floating Hover Exit Banner when in Fullscreen */}
      {isFullscreen && onToggleFullscreen && (
        <div 
          onClick={onToggleFullscreen}
          className="absolute top-0 left-1/2 -translate-x-1/2 z-[100002] cursor-pointer bg-black/85 hover:bg-black text-white text-[11px] font-sans px-3.5 py-1 rounded-b-md shadow-2xl flex items-center gap-2 border border-t-0 border-white/40 opacity-30 hover:opacity-100 transition-opacity"
          title="Click to Exit Full Screen (or press ESC)"
        >
          <Minimize2 size={12} className="text-yellow-400" />
          <span>Full Screen Mode · Click or press <kbd className="px-1 bg-white/20 rounded text-[9px] font-mono">ESC</kbd> to restore</span>
        </div>
      )}

      {/* Title Bar */}
      <div
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={() => {
          if (onToggleFullscreen) {
            onToggleFullscreen();
          } else {
            onMaximize();
          }
        }}
        className={`flex items-center justify-between px-1.5 py-1 cursor-grab active:cursor-grabbing font-bold text-white select-none ${
          isActive ? 'win98-titlebar' : 'win98-titlebar-inactive'
        }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          {icon && <span className="shrink-0">{icon}</span>}
          <span className="truncate tracking-wide text-xs">{title}</span>
          {isFullscreen && (
            <span className="text-[10px] font-normal bg-blue-800/80 px-1.5 py-0.2 rounded border border-blue-400/60 ml-1">
              [Full Screen]
            </span>
          )}
        </div>

        {/* Window Controls */}
        <div className="flex items-center gap-1 shrink-0 ml-2" onMouseDown={e => e.stopPropagation()}>
          <button
            onClick={() => {
              sounds.playClick();
              onMinimize();
            }}
            title="Minimize"
            className="w-4 h-4 bg-[#c0c0c0] win98-raised win98-btn flex items-center justify-center text-black hover:bg-[#d4d4d4]"
          >
            <Minus size={10} strokeWidth={3} className="mt-1" />
          </button>

          {/* Maximize / Restore Desktop Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onMaximize();
            }}
            title={isMaximized ? "Restore Window" : "Maximize (Desktop)"}
            className="w-4 h-4 bg-[#c0c0c0] win98-raised win98-btn flex items-center justify-center text-black hover:bg-[#d4d4d4]"
          >
            {isMaximized ? <Copy size={9} strokeWidth={2.5} /> : <Square size={9} strokeWidth={2.5} />}
          </button>

          {/* Full Screen Toggle Button */}
          {onToggleFullscreen && (
            <button
              onClick={() => {
                sounds.playClick();
                onToggleFullscreen();
              }}
              title={isFullscreen ? "Exit Fullscreen (Esc / F11)" : "Full Screen (F11)"}
              className={`w-4 h-4 bg-[#c0c0c0] win98-raised win98-btn flex items-center justify-center text-black hover:bg-[#d4d4d4] ${
                isFullscreen ? 'bg-cyan-200' : ''
              }`}
            >
              {isFullscreen ? (
                <Minimize2 size={9} strokeWidth={2.5} className="text-blue-900" />
              ) : (
                <Maximize2 size={9} strokeWidth={2.5} />
              )}
            </button>
          )}

          {/* Close Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            title="Close"
            className="w-4 h-4 bg-[#c0c0c0] win98-raised win98-btn flex items-center justify-center text-black hover:bg-[#d4d4d4] font-bold text-[10px]"
          >
            <X size={11} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Menu Bar (File, Edit, etc) */}
      {menuBar && (
        <div className="flex items-center gap-2 px-1 py-0.5 bg-[#c0c0c0] border-b border-[#808080] text-[11px]">
          {menuBar.map((menu, i) => (
            <div key={i} className="relative">
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveMenu(activeMenu === menu.label ? null : menu.label);
                }}
                className={`px-1.5 py-0.5 hover:bg-[#000080] hover:text-white rounded-none ${
                  activeMenu === menu.label ? 'bg-[#000080] text-white' : ''
                }`}
              >
                <span className="underline">{menu.label[0]}</span>
                {menu.label.slice(1)}
              </button>
              {activeMenu === menu.label && menu.items && (
                <div className="absolute top-full left-0 z-50 bg-[#c0c0c0] win98-raised shadow-lg py-1 min-w-[130px]">
                  {menu.items.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        sounds.playClick();
                        setActiveMenu(null);
                        if (item.toLowerCase().includes('full screen') && onToggleFullscreen) {
                          onToggleFullscreen();
                        }
                      }}
                      className="px-3 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Window Body */}
      <div className="flex-1 overflow-auto bg-[#c0c0c0] p-1 flex flex-col">
        {children}
      </div>

      {/* Status Bar */}
      <div className="bg-[#c0c0c0] px-2 py-0.5 border-t border-[#808080] text-[10px] text-[#444] flex items-center justify-between shrink-0">
        <div className="truncate win98-sunken-sm px-1.5 py-0.5 flex-1 mr-2 bg-[#d4d4d4]">
          {statusBarText}
        </div>
        <div className="win98-sunken-sm px-2 py-0.5 bg-[#d4d4d4] shrink-0 text-[#222]">
          WIN98 SE
        </div>
      </div>
    </div>
  );
};
