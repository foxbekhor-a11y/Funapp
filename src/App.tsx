import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  HardDrive, 
  Activity, 
  Award, 
  Trash2, 
  FileText, 
  Sliders, 
  RotateCcw,
  Power
} from 'lucide-react';
import { AppId, WindowState, PersonaId } from './types/windows';
import { WindowFrame } from './components/Desktop/WindowFrame';
import { Taskbar } from './components/Desktop/Taskbar';
import { StartMenu } from './components/Desktop/StartMenu';
import { DesktopIcons } from './components/Desktop/DesktopIcons';
import { ClippyCompanion } from './components/Desktop/ClippyCompanion';
import { SelfHelpWizard } from './components/Apps/SelfHelpWizard';
import { EgoDefragmenter } from './components/Apps/EgoDefragmenter';
import { LifeTaskManager } from './components/Apps/LifeTaskManager';
import { FailureCertificateWindow } from './components/Apps/FailureCertificateWindow';
import { RecycleBinWindow } from './components/Apps/RecycleBinWindow';
import { ReadmeWindow } from './components/Apps/ReadmeWindow';
import { SettingsWindow } from './components/Apps/SettingsWindow';
import { GamesHub } from './components/Apps/Games/GamesHub';
import { MinecraftLauncher } from './components/Apps/Minecraft/MinecraftLauncher';
import { InternetExplorer } from './components/Apps/Browser/InternetExplorer';
import { MacOSEnvironment } from './components/Apps/MacOS/MacOSEnvironment';
import { BSODModal } from './components/Apps/BSODModal';
import { ShutdownDialog } from './components/Desktop/ShutdownDialog';
import { sounds } from './utils/soundEffects';

const INITIAL_WINDOWS: WindowState[] = [
  {
    id: 'macos',
    title: 'Macintosh System 7.5 - Apple Mac OS Environment',
    icon: '🍎',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 170,
    y: 35,
    width: 660,
    height: 520,
    zIndex: 14,
  },
  {
    id: 'browser',
    title: 'Internet Explorer 5.0 - Yahooligans! 98',
    icon: '🌐',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 140,
    y: 25,
    width: 700,
    height: 550,
    zIndex: 13,
  },
  {
    id: 'self_help',
    title: 'Windows 98 Emotional Troubleshooter',
    icon: '📎',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    x: 160,
    y: 35,
    width: 680,
    height: 540,
    zIndex: 10,
  },
  {
    id: 'minecraft',
    title: 'Minecraft Launcher (Beta 1.7.3) - Windows 98',
    icon: '⛏️',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 180,
    y: 40,
    width: 620,
    height: 520,
    zIndex: 12,
  },
  {
    id: 'games',
    title: 'Games - Windows 98 Entertainment Pack',
    icon: '🎮',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 230,
    y: 45,
    width: 530,
    height: 590,
    zIndex: 11,
  },
  {
    id: 'defrag',
    title: 'Defragmenting Drive C: (PSYCHE)',
    icon: '💾',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 220,
    y: 60,
    width: 600,
    height: 480,
    zIndex: 5,
  },
  {
    id: 'task_mgr',
    title: 'Life Task Manager [Ctrl+Alt+Del]',
    icon: '⚡',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 260,
    y: 90,
    width: 580,
    height: 450,
    zIndex: 6,
  },
  {
    id: 'certificate',
    title: 'Official Certificate of Inadequacy',
    icon: '📜',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 280,
    y: 40,
    width: 640,
    height: 520,
    zIndex: 7,
  },
  {
    id: 'recycle_bin',
    title: 'Recycle Bin of Regrets',
    icon: '🗑️',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 300,
    y: 110,
    width: 520,
    height: 380,
    zIndex: 4,
  },
  {
    id: 'readme',
    title: 'README_CRYING.txt - Notepad',
    icon: '📝',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 320,
    y: 70,
    width: 540,
    height: 420,
    zIndex: 8,
  },
  {
    id: 'settings',
    title: 'Display & Audio Properties',
    icon: '🖥️',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 340,
    y: 80,
    width: 480,
    height: 440,
    zIndex: 9,
  },
];

export default function App() {
  const [windows, setWindows] = useState<WindowState[]>(INITIAL_WINDOWS);
  const [activeWindowId, setActiveWindowId] = useState<AppId | null>('self_help');
  const [highestZ, setHighestZ] = useState<number>(20);
  const [isStartOpen, setIsStartOpen] = useState<boolean>(false);
  const [crtEnabled, setCrtEnabled] = useState<boolean>(false);
  const [insultCount, setInsultCount] = useState<number>(1);
  const [currentWallpaper, setCurrentWallpaper] = useState<string>(
    '/src/assets/images/windows_clouds_wallpaper_1791036957619.jpg'
  );
  const [isBsodOpen, setIsBsodOpen] = useState<boolean>(false);
  const [bsodError, setBsodError] = useState<string>('');
  const [isShutdownModalOpen, setIsShutdownModalOpen] = useState<boolean>(false);
  const [isPoweredOff, setIsPoweredOff] = useState<boolean>(false);
  const [certificateProblemText, setCertificateProblemText] = useState<string>('');
  const [activePersona, setActivePersona] = useState<PersonaId>('clippy');

  // Trigger startup chime on first user click
  useEffect(() => {
    const handleFirstClick = () => {
      sounds.playStartup();
      window.removeEventListener('click', handleFirstClick);
    };
    window.addEventListener('click', handleFirstClick);
    return () => window.removeEventListener('click', handleFirstClick);
  }, []);

  const focusWindow = (id: AppId) => {
    setActiveWindowId(id);
    const newZ = highestZ + 1;
    setHighestZ(newZ);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: newZ, isMinimized: false } : w))
    );
  };

  const openApp = (id: AppId) => {
    const newZ = highestZ + 1;
    setHighestZ(newZ);
    setActiveWindowId(id);
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: newZ } : w
      )
    );
  };

  const closeWindow = (id: AppId) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isOpen: false } : w))
    );
    if (activeWindowId === id) {
      const openWins = windows.filter((w) => w.id !== id && w.isOpen && !w.isMinimized);
      if (openWins.length > 0) {
        const topWin = openWins.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), openWins[0]);
        setActiveWindowId(topWin.id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const minimizeWindow = (id: AppId) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    if (activeWindowId === id) {
      const remaining = windows.filter((w) => w.id !== id && w.isOpen && !w.isMinimized);
      if (remaining.length > 0) {
        const topWin = remaining.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), remaining[0]);
        setActiveWindowId(topWin.id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const maximizeWindow = (id: AppId) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  };

  const toggleFullscreen = (id: AppId) => {
    sounds.playClick();
    const newZ = highestZ + 5;
    setHighestZ(newZ);
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const nextFullscreen = !w.isFullscreen;
          if (nextFullscreen) {
            try {
              if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(() => {});
              }
            } catch (_) {}
          } else {
            try {
              if (document.fullscreenElement && document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
              }
            } catch (_) {}
          }
          return {
            ...w,
            isFullscreen: nextFullscreen,
            isMinimized: false,
            zIndex: newZ,
          };
        }
        return w;
      })
    );
    setActiveWindowId(id);
  };

  // Keyboard shortcut listener: F11 to toggle fullscreen, Escape to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        if (activeWindowId) {
          toggleFullscreen(activeWindowId);
        }
      } else if (e.key === 'Escape') {
        const fullWin = windows.find((w) => w.isFullscreen);
        if (fullWin) {
          toggleFullscreen(fullWin.id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeWindowId, windows, highestZ]);

  const moveWindow = (id: AppId, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x, y } : w))
    );
  };

  const handleTaskbarWindowClick = (id: AppId) => {
    const target = windows.find((w) => w.id === id);
    if (!target) return;

    if (activeWindowId === id && !target.isMinimized) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  };

  const triggerQuickRoast = () => {
    const quickRoasts = [
      "STOP 0x00000042: EXCUSE_OVERFLOW_EXCEPTION in module ADULTING.DLL",
      "FATAL_ERROR: User motivation died of natural causes while waiting for Mercury retrograde to end",
      "IRQL_NOT_LESS_OR_EQUAL: Your ambition requires more hardware than your work ethic provides",
      "SYSTEM_ABORT: Attempted to achieve personal growth without doing any actual work",
    ];
    const picked = quickRoasts[Math.floor(Math.random() * quickRoasts.length)];
    setBsodError(picked);
    setIsBsodOpen(true);
    setInsultCount((c) => c + 1);
  };

  const handleOpenCertificateWithProblem = (problemText: string) => {
    setCertificateProblemText(problemText);
    openApp('certificate');
  };

  // If user shut down computer
  if (isPoweredOff) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-6 text-center select-none font-pixel">
        <div className="text-amber-500 text-2xl md:text-4xl tracking-widest font-bold mb-4 drop-shadow-[0_0_12px_#ff9900]">
          It is now safe to turn off your computer...
        </div>
        <div className="text-amber-400/80 text-lg md:text-xl font-mono mb-8 max-w-lg">
          ...and reconsider every life choice that brought you to this moment.
        </div>
        <button
          onClick={() => {
            sounds.playStartup();
            setIsPoweredOff(false);
          }}
          className="px-6 py-2 bg-[#c0c0c0] win98-raised win98-btn text-black font-win98 font-bold text-sm hover:bg-white flex items-center gap-2"
        >
          <RotateCcw size={16} />
          <span>Reboot Windows 98 (Face Reality Again)</span>
        </button>
      </div>
    );
  }

  const getWindow = (id: AppId) => windows.find((w) => w.id === id)!;

  return (
    <div
      onClick={() => {
        if (isStartOpen) setIsStartOpen(false);
      }}
      className="relative w-screen h-screen overflow-hidden select-none bg-cover bg-center font-win98"
      style={{
        backgroundColor: currentWallpaper.startsWith('#') ? currentWallpaper : '#008080',
        backgroundImage: currentWallpaper.startsWith('/') ? `url(${currentWallpaper})` : 'none',
      }}
    >
      {/* CRT Scanline Overlay */}
      {crtEnabled && (
        <div className="crt-scanlines fixed inset-0 z-[99999] pointer-events-none" />
      )}

      {/* Desktop Shortcuts */}
      <DesktopIcons
        onOpenApp={openApp}
        onOpenBSOD={() => {
          setBsodError('USER_REQUESTED_CATASTROPHE: Emergency reality check executed.');
          setIsBsodOpen(true);
        }}
      />

      {/* Floating Mascot (Clippy) */}
      <ClippyCompanion
        onTalkToClippy={() => openApp('self_help')}
        onRoastDelivered={() => setInsultCount((c) => c + 1)}
      />

      {/* Internet Explorer Window */}
      {getWindow('browser').isOpen && (
        <WindowFrame
          id="browser"
          title={getWindow('browser').title}
          icon={getWindow('browser').icon}
          isOpen={getWindow('browser').isOpen}
          isMinimized={getWindow('browser').isMinimized}
          isMaximized={getWindow('browser').isMaximized}
          isFullscreen={getWindow('browser').isFullscreen}
          x={getWindow('browser').x}
          y={getWindow('browser').y}
          width={getWindow('browser').width}
          height={getWindow('browser').height}
          zIndex={getWindow('browser').zIndex}
          isActive={activeWindowId === 'browser'}
          onFocus={() => focusWindow('browser')}
          onClose={() => closeWindow('browser')}
          onMinimize={() => minimizeWindow('browser')}
          onMaximize={() => maximizeWindow('browser')}
          onToggleFullscreen={() => toggleFullscreen('browser')}
          onMove={(x, y) => moveWindow('browser', x, y)}
          menuBar={[
            { label: 'File', items: ['New Window', 'Save As...', 'Print'] },
            { label: 'View', items: ['Full Screen (F11)', 'Refresh', 'Stop Loading'] },
            { label: 'Help', items: ['About The Internet', 'Dial-Up Help'] },
          ]}
          statusBarText="Internet Explorer 5.0 · Connected at 56,000 bps"
        >
          <InternetExplorer 
            onOpenMinecraft={() => {
              openApp('minecraft');
            }}
          />
        </WindowFrame>
      )}

      {/* Macintosh System 7.5 Window */}
      {getWindow('macos').isOpen && (
        <WindowFrame
          id="macos"
          title={getWindow('macos').title}
          icon={getWindow('macos').icon}
          isOpen={getWindow('macos').isOpen}
          isMinimized={getWindow('macos').isMinimized}
          isMaximized={getWindow('macos').isMaximized}
          isFullscreen={getWindow('macos').isFullscreen}
          x={getWindow('macos').x}
          y={getWindow('macos').y}
          width={getWindow('macos').width}
          height={getWindow('macos').height}
          zIndex={getWindow('macos').zIndex}
          isActive={activeWindowId === 'macos'}
          onFocus={() => focusWindow('macos')}
          onClose={() => closeWindow('macos')}
          onMinimize={() => minimizeWindow('macos')}
          onMaximize={() => maximizeWindow('macos')}
          onToggleFullscreen={() => toggleFullscreen('macos')}
          onMove={(x, y) => moveWindow('macos', x, y)}
          menuBar={[
            { label: 'Apple', items: ['About Macintosh', 'Restart System', 'Eject Floppy'] },
            { label: 'View', items: ['Full Screen (F11)', 'System 7 Classic', 'Mac OS 9 Platinum', 'Aqua Dock'] },
            { label: 'Help', items: ['Thinking Different', 'Why Not Windows?'] },
          ]}
          statusBarText="Motorola 68040 Emulation · 16MB RAM Allocated · Mac OS 7.5.3"
        >
          <MacOSEnvironment />
        </WindowFrame>
      )}

      {/* 1. Self-Help Troubleshooter Window */}
      {getWindow('self_help').isOpen && (
        <WindowFrame
          id="self_help"
          title={getWindow('self_help').title}
          icon={getWindow('self_help').icon}
          isOpen={getWindow('self_help').isOpen}
          isMinimized={getWindow('self_help').isMinimized}
          isMaximized={getWindow('self_help').isMaximized}
          isFullscreen={getWindow('self_help').isFullscreen}
          x={getWindow('self_help').x}
          y={getWindow('self_help').y}
          width={getWindow('self_help').width}
          height={getWindow('self_help').height}
          zIndex={getWindow('self_help').zIndex}
          isActive={activeWindowId === 'self_help'}
          onFocus={() => focusWindow('self_help')}
          onClose={() => closeWindow('self_help')}
          onMinimize={() => minimizeWindow('self_help')}
          onMaximize={() => maximizeWindow('self_help')}
          onToggleFullscreen={() => toggleFullscreen('self_help')}
          onMove={(x, y) => moveWindow('self_help', x, y)}
          menuBar={[
            { label: 'File', items: ['New Life Ticket', 'Print Dignity (Failed)', 'Exit Without Growth'] },
            { label: 'View', items: ['Full Screen (F11)', 'Zoom In', 'Zoom Out'] },
            { label: 'Edit', items: ['Undo Mistakes (Not Supported)', 'Cut Toxic Habits', 'Paste Excuses'] },
            { label: 'Specialists', items: ['Clippy 98', 'Dr. BSOD', 'SysAdmin Karen', 'Defrag Guru'] },
            { label: 'Help', items: ['Why Am I Like This?', 'About Clippy'] },
          ]}
          statusBarText={`Specialist: ${activePersona.toUpperCase()} · Roasts: ${insultCount}`}
        >
          <SelfHelpWizard
            onOpenCertificate={handleOpenCertificateWithProblem}
            onRoastDelivered={() => setInsultCount((c) => c + 1)}
            activePersona={activePersona}
            setActivePersona={setActivePersona}
          />
        </WindowFrame>
      )}

      {/* Games App Window */}
      {getWindow('games').isOpen && (
        <WindowFrame
          id="games"
          title={getWindow('games').title}
          icon={getWindow('games').icon}
          isOpen={getWindow('games').isOpen}
          isMinimized={getWindow('games').isMinimized}
          isMaximized={getWindow('games').isMaximized}
          isFullscreen={getWindow('games').isFullscreen}
          x={getWindow('games').x}
          y={getWindow('games').y}
          width={getWindow('games').width}
          height={getWindow('games').height}
          zIndex={getWindow('games').zIndex}
          isActive={activeWindowId === 'games'}
          onFocus={() => focusWindow('games')}
          onClose={() => closeWindow('games')}
          onMinimize={() => minimizeWindow('games')}
          onMaximize={() => maximizeWindow('games')}
          onToggleFullscreen={() => toggleFullscreen('games')}
          onMove={(x, y) => moveWindow('games', x, y)}
          menuBar={[
            { label: 'Game', items: ['Geometry Dash', 'Block Blast', 'Trauma Sweeper', 'Dopamine Snake', 'Whack-A-Clippy', 'Exit'] },
            { label: 'View', items: ['Full Screen (F11)'] },
            { label: 'Skill', items: ['Novice (Easy Denial)', 'Expert (Total Panic)'] },
            { label: 'Help', items: ['How to Waste More Time', 'About 98 Games'] },
          ]}
          statusBarText="Games Subsystem · 100% Procrastination Verified"
        >
          <GamesHub />
        </WindowFrame>
      )}

      {/* Minecraft Launcher Window */}
      {getWindow('minecraft').isOpen && (
        <WindowFrame
          id="minecraft"
          title={getWindow('minecraft').title}
          icon={getWindow('minecraft').icon}
          isOpen={getWindow('minecraft').isOpen}
          isMinimized={getWindow('minecraft').isMinimized}
          isMaximized={getWindow('minecraft').isMaximized}
          isFullscreen={getWindow('minecraft').isFullscreen}
          x={getWindow('minecraft').x}
          y={getWindow('minecraft').y}
          width={getWindow('minecraft').width}
          height={getWindow('minecraft').height}
          zIndex={getWindow('minecraft').zIndex}
          isActive={activeWindowId === 'minecraft'}
          onFocus={() => focusWindow('minecraft')}
          onClose={() => closeWindow('minecraft')}
          onMinimize={() => minimizeWindow('minecraft')}
          onMaximize={() => maximizeWindow('minecraft')}
          onToggleFullscreen={() => toggleFullscreen('minecraft')}
          onMove={(x, y) => moveWindow('minecraft', x, y)}
          menuBar={[
            { label: 'Launcher', items: ['Launch Game', 'Check for Updates', 'Memory Allocation (16MB)', 'Exit'] },
            { label: 'View', items: ['Full Screen (F11)', 'Hide Controls'] },
            { label: 'Profile', items: ['Switch User', 'Skin Manager', 'Crash Reports'] },
            { label: 'Help', items: ['How to Touch Grass', 'About Mojang 98'] },
          ]}
          statusBarText="Java Virtual Machine: Allocated 16MB · Ready to Mine"
        >
          <MinecraftLauncher 
            onOpenCurseforge={() => {
              openApp('browser');
            }}
          />
        </WindowFrame>
      )}

      {/* 2. Ego Defragmenter Window */}
      {getWindow('defrag').isOpen && (
        <WindowFrame
          id="defrag"
          title={getWindow('defrag').title}
          icon={getWindow('defrag').icon}
          isOpen={getWindow('defrag').isOpen}
          isMinimized={getWindow('defrag').isMinimized}
          isMaximized={getWindow('defrag').isMaximized}
          isFullscreen={getWindow('defrag').isFullscreen}
          x={getWindow('defrag').x}
          y={getWindow('defrag').y}
          width={getWindow('defrag').width}
          height={getWindow('defrag').height}
          zIndex={getWindow('defrag').zIndex}
          isActive={activeWindowId === 'defrag'}
          onFocus={() => focusWindow('defrag')}
          onClose={() => closeWindow('defrag')}
          onMinimize={() => minimizeWindow('defrag')}
          onMaximize={() => maximizeWindow('defrag')}
          onToggleFullscreen={() => toggleFullscreen('defrag')}
          onMove={(x, y) => moveWindow('defrag', x, y)}
          menuBar={[
            { label: 'Drive', items: ['Select Drive C:', 'Check Errors', 'Stop Defrag'] },
            { label: 'View', items: ['Full Screen (F11)', 'Legend'] },
          ]}
          statusBarText="Drive C: 89% Fragmented · Compacting Delusions"
        >
          <EgoDefragmenter />
        </WindowFrame>
      )}

      {/* 3. Life Task Manager Window */}
      {getWindow('task_mgr').isOpen && (
        <WindowFrame
          id="task_mgr"
          title={getWindow('task_mgr').title}
          icon={getWindow('task_mgr').icon}
          isOpen={getWindow('task_mgr').isOpen}
          isMinimized={getWindow('task_mgr').isMinimized}
          isMaximized={getWindow('task_mgr').isMaximized}
          isFullscreen={getWindow('task_mgr').isFullscreen}
          x={getWindow('task_mgr').x}
          y={getWindow('task_mgr').y}
          width={getWindow('task_mgr').width}
          height={getWindow('task_mgr').height}
          zIndex={getWindow('task_mgr').zIndex}
          isActive={activeWindowId === 'task_mgr'}
          onFocus={() => focusWindow('task_mgr')}
          onClose={() => closeWindow('task_mgr')}
          onMinimize={() => minimizeWindow('task_mgr')}
          onMaximize={() => maximizeWindow('task_mgr')}
          onToggleFullscreen={() => toggleFullscreen('task_mgr')}
          onMove={(x, y) => moveWindow('task_mgr', x, y)}
          menuBar={[
            { label: 'File', items: ['New Task...', 'Exit'] },
            { label: 'View', items: ['Full Screen (F11)', 'Refresh Now'] },
          ]}
          statusBarText="CPU Usage: 99% · 84 Overthinking Threads"
        >
          <LifeTaskManager />
        </WindowFrame>
      )}

      {/* 4. Failure Certificate Window */}
      {getWindow('certificate').isOpen && (
        <WindowFrame
          id="certificate"
          title={getWindow('certificate').title}
          icon={getWindow('certificate').icon}
          isOpen={getWindow('certificate').isOpen}
          isMinimized={getWindow('certificate').isMinimized}
          isMaximized={getWindow('certificate').isMaximized}
          isFullscreen={getWindow('certificate').isFullscreen}
          x={getWindow('certificate').x}
          y={getWindow('certificate').y}
          width={getWindow('certificate').width}
          height={getWindow('certificate').height}
          zIndex={getWindow('certificate').zIndex}
          isActive={activeWindowId === 'certificate'}
          onFocus={() => focusWindow('certificate')}
          onClose={() => closeWindow('certificate')}
          onMinimize={() => minimizeWindow('certificate')}
          onMaximize={() => maximizeWindow('certificate')}
          onToggleFullscreen={() => toggleFullscreen('certificate')}
          onMove={(x, y) => moveWindow('certificate', x, y)}
          menuBar={[
            { label: 'Certificate', items: ['Print Certificate', 'Frame In Mediocrity'] },
            { label: 'View', items: ['Full Screen (F11)'] },
          ]}
          statusBarText="Certified Sub-Par Performance · Ready to Print"
        >
          <FailureCertificateWindow initialProblem={certificateProblemText} />
        </WindowFrame>
      )}

      {/* 5. Recycle Bin of Regrets */}
      {getWindow('recycle_bin').isOpen && (
        <WindowFrame
          id="recycle_bin"
          title={getWindow('recycle_bin').title}
          icon={getWindow('recycle_bin').icon}
          isOpen={getWindow('recycle_bin').isOpen}
          isMinimized={getWindow('recycle_bin').isMinimized}
          isMaximized={getWindow('recycle_bin').isMaximized}
          isFullscreen={getWindow('recycle_bin').isFullscreen}
          x={getWindow('recycle_bin').x}
          y={getWindow('recycle_bin').y}
          width={getWindow('recycle_bin').width}
          height={getWindow('recycle_bin').height}
          zIndex={getWindow('recycle_bin').zIndex}
          isActive={activeWindowId === 'recycle_bin'}
          onFocus={() => focusWindow('recycle_bin')}
          onClose={() => closeWindow('recycle_bin')}
          onMinimize={() => minimizeWindow('recycle_bin')}
          onMaximize={() => maximizeWindow('recycle_bin')}
          onToggleFullscreen={() => toggleFullscreen('recycle_bin')}
          onMove={(x, y) => moveWindow('recycle_bin', x, y)}
          menuBar={[
            { label: 'File', items: ['Empty Recycle Bin', 'Close'] },
            { label: 'View', items: ['Full Screen (F11)', 'Large Icons', 'Details'] },
          ]}
          statusBarText="7 Regrets in Bin · 5.2 GB Wasted Potential"
        >
          <RecycleBinWindow />
        </WindowFrame>
      )}

      {/* 6. Readme Notepad Window */}
      {getWindow('readme').isOpen && (
        <WindowFrame
          id="readme"
          title={getWindow('readme').title}
          icon={getWindow('readme').icon}
          isOpen={getWindow('readme').isOpen}
          isMinimized={getWindow('readme').isMinimized}
          isMaximized={getWindow('readme').isMaximized}
          isFullscreen={getWindow('readme').isFullscreen}
          x={getWindow('readme').x}
          y={getWindow('readme').y}
          width={getWindow('readme').width}
          height={getWindow('readme').height}
          zIndex={getWindow('readme').zIndex}
          isActive={activeWindowId === 'readme'}
          onFocus={() => focusWindow('readme')}
          onClose={() => closeWindow('readme')}
          onMinimize={() => minimizeWindow('readme')}
          onMaximize={() => maximizeWindow('readme')}
          onToggleFullscreen={() => toggleFullscreen('readme')}
          onMove={(x, y) => moveWindow('readme', x, y)}
          menuBar={[
            { label: 'File', items: ['New Cry', 'Open Trauma...', 'Save Excuses', 'Exit'] },
            { label: 'Edit', items: ['Undo Past Decisions', 'Select All Regrets'] },
            { label: 'View', items: ['Full Screen (F11)', 'Word Wrap'] },
            { label: 'Search', items: ['Find Purpose...'] },
          ]}
          statusBarText="Line 42, Col 1 · Ready"
        >
          <ReadmeWindow />
        </WindowFrame>
      )}

      {/* 7. Settings & Display Properties */}
      {getWindow('settings').isOpen && (
        <WindowFrame
          id="settings"
          title={getWindow('settings').title}
          icon={getWindow('settings').icon}
          isOpen={getWindow('settings').isOpen}
          isMinimized={getWindow('settings').isMinimized}
          isMaximized={getWindow('settings').isMaximized}
          isFullscreen={getWindow('settings').isFullscreen}
          x={getWindow('settings').x}
          y={getWindow('settings').y}
          width={getWindow('settings').width}
          height={getWindow('settings').height}
          zIndex={getWindow('settings').zIndex}
          isActive={activeWindowId === 'settings'}
          onFocus={() => focusWindow('settings')}
          onClose={() => closeWindow('settings')}
          onMinimize={() => minimizeWindow('settings')}
          onMaximize={() => maximizeWindow('settings')}
          onToggleFullscreen={() => toggleFullscreen('settings')}
          onMove={(x, y) => moveWindow('settings', x, y)}
          menuBar={[
            { label: 'Properties', items: ['Apply Settings', 'Reset to Defaults'] },
            { label: 'View', items: ['Full Screen (F11)'] },
          ]}
          statusBarText="Display Properties · Retro Windows 98"
        >
          <SettingsWindow
            currentWallpaper={currentWallpaper}
            onSelectWallpaper={setCurrentWallpaper}
            crtEnabled={crtEnabled}
            onToggleCrt={() => setCrtEnabled(!crtEnabled)}
          />
        </WindowFrame>
      )}

      {/* Start Menu */}
      <StartMenu
        isOpen={isStartOpen}
        onClose={() => setIsStartOpen(false)}
        onOpenApp={openApp}
        onTriggerQuickRoast={triggerQuickRoast}
        onTriggerShutdown={() => setIsShutdownModalOpen(true)}
      />

      {/* Blue Screen of Death Modal */}
      <BSODModal
        isOpen={isBsodOpen}
        onClose={() => setIsBsodOpen(false)}
        customError={bsodError}
      />

      {/* Sarcastic Shutdown Confirmation Dialog */}
      <ShutdownDialog
        isOpen={isShutdownModalOpen}
        onClose={() => setIsShutdownModalOpen(false)}
        onExecuteShutdown={() => {
          setIsShutdownModalOpen(false);
          setIsPoweredOff(true);
        }}
      />

      {/* Bottom Taskbar */}
      <Taskbar
        windows={windows}
        activeWindowId={activeWindowId}
        onWindowClick={handleTaskbarWindowClick}
        onStartClick={() => setIsStartOpen(!isStartOpen)}
        isStartOpen={isStartOpen}
        crtEnabled={crtEnabled}
        onToggleCrt={() => setCrtEnabled(!crtEnabled)}
        insultCount={insultCount}
        wallpaperName={currentWallpaper}
      />
    </div>
  );
}
