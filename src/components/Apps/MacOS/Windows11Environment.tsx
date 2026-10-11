import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Settings as SettingsIcon, 
  Folder, 
  Globe, 
  FileText, 
  Sparkles, 
  Power, 
  Maximize2, 
  Minimize2,
  Minus, 
  X, 
  Square,
  Wifi, 
  Volume2, 
  Battery, 
  RotateCcw, 
  Send, 
  Monitor, 
  HardDrive, 
  Cpu, 
  ShieldCheck, 
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { sounds } from '../../../utils/soundEffects';
import { ChromeOSEnvironment } from './ChromeOSEnvironment';

type Win11App = 'copilot' | 'settings' | 'notepad' | 'explorer' | 'chromeos';

interface CopilotMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  time: string;
}

export const Windows11Environment: React.FC = () => {
  const [isBooting, setIsBooting] = useState<boolean>(true);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState<boolean>(false);
  const [activeApp, setActiveApp] = useState<Win11App | null>('copilot');
  const [fullscreenApp, setFullscreenApp] = useState<Win11App | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('11:47 AM');

  const toggleFullscreenApp = (app: Win11App) => {
    sounds.playClick();
    setFullscreenApp((prev) => (prev === app ? null : app));
  };

  // Copilot State
  const [copilotInput, setCopilotInput] = useState<string>('');
  const [isCopilotThinking, setIsCopilotThinking] = useState<boolean>(false);
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([
    {
      id: '1',
      sender: 'copilot',
      text: "Hello! I'm Microsoft Copilot in Windows 11, running inside Apple Mac OS, running inside Windows 98. How can I assist your triple-nested existential dilemma today?",
      time: '11:47 AM'
    }
  ]);
  const copilotEndRef = useRef<HTMLDivElement | null>(null);

  // Notepad State
  const [notepadText, setNotepadText] = useState<string>(
    "INCEPTION LOG - OCTOBER 2026\n\nHost Environment: Windows 98 Second Edition\nVirtual Layer 1: Apple Macintosh System 7.5\nVirtual Layer 2: Windows 11 Pro (Inception Edition)\n\nScientific Conclusion: You are spending more CPU cycles procrastinating than NASA used to land on the Moon.\n\nRecommendation: Drink water, close the computer, and walk outside."
  );

  // Startup sequence
  const startBoot = () => {
    setIsBooting(true);
    sounds.playWin11Chime();
    setTimeout(() => {
      setIsBooting(false);
    }, 1400);
  };

  useEffect(() => {
    startBoot();
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    copilotEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [copilotMessages, isCopilotThinking]);

  const handleAskCopilot = (text?: string) => {
    const q = (text || copilotInput).trim();
    if (!q) return;

    sounds.playClick();
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: CopilotMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
      time: nowStr
    };

    setCopilotMessages((prev) => [...prev, userMsg]);
    setCopilotInput('');
    setIsCopilotThinking(true);

    setTimeout(() => {
      let reply = "";
      const lower = q.toLowerCase();

      if (lower.includes('simulation') || lower.includes('matrix') || lower.includes('real')) {
        reply = "Mathematically, you are at layer 3 of operating system nesting. If you launch an MS-DOS emulator inside here, the fabric of spacetime may collapse into a blue screen.";
      } else if (lower.includes('compare') || lower.includes('98') || lower.includes('mac')) {
        reply = "Windows 98 gave you simplicity and Clippy. Mac OS gave you Chicago fonts and artistic angst. Windows 11 gives you rounded corners, 32GB of RAM consumption, and Copilot telling you to stop procrastinating.";
      } else if (lower.includes('roast') || lower.includes('procrastinat')) {
        reply = "You spent 45 minutes running Windows 11 inside a virtual Macintosh inside Windows 98 just to avoid writing an email. Your dedication to avoiding productivity is honestly awe-inspiring.";
      } else if (lower.includes('meaning') || lower.includes('life')) {
        reply = "The meaning of life is 42. But in this virtual machine, the meaning of life is finding the 'Shut Down' button before your laptop battery dies.";
      } else if (lower.includes('joke')) {
        reply = "Why did the computer keep freezing? Because it was left with too many open windows... literally three entire operating systems at once.";
      } else {
        reply = `Analyzing query "${q}": Copilot neural inference suggests taking a 5-minute break and completing at least one task on your to-do list.`;
      }

      const copilotMsg: CopilotMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'copilot',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setCopilotMessages((prev) => [...prev, copilotMsg]);
      setIsCopilotThinking(false);
      sounds.speak(reply, 'siri');
    }, 600);
  };

  return (
    <div 
      className="flex flex-col h-full bg-[#0a192f] text-white font-sans text-xs select-none overflow-hidden relative"
      onClick={() => setIsStartMenuOpen(false)}
    >
      {/* BOOT SCREEN WITH WINDOWS 11 LOGO & SPINNING DOTS */}
      {isBooting ? (
        <div className="flex-1 bg-black flex flex-col items-center justify-center p-6 text-center">
          {/* Windows 11 4-Square Logo */}
          <div className="grid grid-cols-2 gap-1 w-12 h-12 mb-8 animate-pulse">
            <div className="bg-[#00a4ef] rounded-xs shadow-md" />
            <div className="bg-[#00a4ef] rounded-xs shadow-md" />
            <div className="bg-[#00a4ef] rounded-xs shadow-md" />
            <div className="bg-[#00a4ef] rounded-xs shadow-md" />
          </div>

          {/* Windows 11 Spinning Dots Ring */}
          <div className="w-8 h-8 rounded-full border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin mb-4" />
          <span className="text-[11px] text-gray-400 font-mono">Starting Windows 11 Subsystem...</span>
        </div>
      ) : (
        /* MAIN WINDOWS 11 DESKTOP SURFACE */
        <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-br from-[#0c1829] via-[#102a45] to-[#0a1424]">
          {/* Windows 11 Blue Bloom Wallpaper Aesthetic */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-80">
            <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-blue-600/30 blur-3xl" />
            <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-indigo-500/25 blur-3xl" />
            <div className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
          </div>

          {/* DESKTOP APPS / WINDOWS AREA */}
          <div className="flex-1 p-3 relative overflow-hidden">
            {/* Desktop Shortcuts */}
            <div className="absolute top-3 left-3 flex flex-col gap-3 z-10">
              <div 
                onClick={() => {
                  sounds.playClick();
                  setActiveApp('copilot');
                }}
                className="flex flex-col items-center gap-1 cursor-pointer group w-16 text-center"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform border border-white/20">
                  <Sparkles size={18} className="text-white drop-shadow" />
                </div>
                <span className="text-[10px] text-gray-200 drop-shadow line-clamp-1">Copilot</span>
              </div>

              <div 
                onClick={() => {
                  sounds.playClick();
                  setActiveApp('explorer');
                }}
                className="flex flex-col items-center gap-1 cursor-pointer group w-16 text-center"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform backdrop-blur-md">
                  <Folder size={20} className="text-amber-400 fill-amber-400/30" />
                </div>
                <span className="text-[10px] text-gray-200 drop-shadow line-clamp-1">Explorer</span>
              </div>

              <div 
                onClick={() => {
                  sounds.playClick();
                  setActiveApp('notepad');
                }}
                className="flex flex-col items-center gap-1 cursor-pointer group w-16 text-center"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform backdrop-blur-md">
                  <FileText size={18} className="text-blue-300" />
                </div>
                <span className="text-[10px] text-gray-200 drop-shadow line-clamp-1">Notepad</span>
              </div>

              <div 
                onClick={() => {
                  sounds.playClick();
                  setActiveApp('settings');
                }}
                className="flex flex-col items-center gap-1 cursor-pointer group w-16 text-center"
              >
                <div className="w-9 h-9 rounded-xl bg-gray-600/30 border border-gray-400/30 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform backdrop-blur-md">
                  <SettingsIcon size={18} className="text-gray-300" />
                </div>
                <span className="text-[10px] text-gray-200 drop-shadow line-clamp-1">Settings</span>
              </div>

              <div 
                onClick={() => {
                  sounds.playClick();
                  setActiveApp('chromeos');
                }}
                className="flex flex-col items-center gap-1 cursor-pointer group w-16 text-center"
              >
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform backdrop-blur-md">
                  <div className="w-5 h-5 rounded-full border-2 border-[#ea4335] bg-[#4285f4] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-[#4285f4]" />
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-cyan-300 font-medium drop-shadow line-clamp-1">ChromeOS</span>
              </div>
            </div>

            {/* 1. COPILOT SIDEBAR / WINDOW */}
            {activeApp === 'copilot' && (
              <div className={`${
                fullscreenApp === 'copilot'
                  ? 'absolute inset-0 bg-[#1f1f23] border-0 rounded-none'
                  : 'absolute top-2 right-2 bottom-2 w-72 bg-[#1f1f23]/90 backdrop-blur-xl border border-white/15 rounded-xl'
              } shadow-2xl flex flex-col z-20 overflow-hidden animate-fade-in`}>
                {/* Copilot Header */}
                <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between bg-black/20">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center">
                      <Sparkles size={11} className="text-white" />
                    </div>
                    <span className="font-bold text-xs text-white">Microsoft Copilot</span>
                    {fullscreenApp === 'copilot' && (
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded border border-blue-400/40">Full Screen</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => toggleFullscreenApp('copilot')}
                      className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white"
                      title={fullscreenApp === 'copilot' ? "Restore Window" : "Full Screen Window"}
                    >
                      {fullscreenApp === 'copilot' ? <Minimize2 size={12} /> : <Square size={11} />}
                    </button>
                    <button 
                      onClick={() => {
                        setActiveApp(null);
                        setFullscreenApp(null);
                      }}
                      className="p-1 hover:bg-red-600 hover:text-white rounded text-gray-400"
                      title="Close"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>

                {/* Copilot Messages */}
                <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
                  {copilotMessages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div 
                        className={`max-w-[90%] rounded-xl px-3 py-2 leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-br-xs'
                            : 'bg-white/10 border border-white/10 text-gray-200 rounded-bl-xs'
                        }`}
                      >
                        {msg.sender === 'copilot' && (
                          <div className="text-[9px] font-bold text-cyan-400 mb-0.5">Copilot (Windows 11)</div>
                        )}
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))}

                  {isCopilotThinking && (
                    <div className="flex items-center gap-2 p-2 bg-white/5 rounded-xl max-w-xs text-[11px] text-cyan-300 animate-pulse">
                      <div className="w-3 h-3 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                      <span>Generating response...</span>
                    </div>
                  )}

                  <div ref={copilotEndRef} />
                </div>

                {/* Quick Prompts */}
                <div className="px-2 py-1 bg-black/30 border-t border-white/10 flex items-center gap-1 overflow-x-auto text-[10px] whitespace-nowrap">
                  {['Simulation check?', 'Roast my setup', 'Why 3 OSes?'].map((p) => (
                    <button
                      key={p}
                      onClick={() => handleAskCopilot(p)}
                      className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded-full text-cyan-300 border border-cyan-500/30"
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* Copilot Input */}
                <div className="p-2 border-t border-white/10 bg-black/20 flex items-center gap-1.5">
                  <input
                    type="text"
                    value={copilotInput}
                    onChange={(e) => setCopilotInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAskCopilot();
                    }}
                    placeholder="Ask Copilot anything..."
                    className="flex-1 bg-white/10 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-400 outline-hidden focus:border-blue-400"
                  />
                  <button
                    onClick={() => handleAskCopilot()}
                    className="p-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white shadow"
                  >
                    <Send size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* 2. NOTEPAD WINDOW */}
            {activeApp === 'notepad' && (
              <div className={`${
                fullscreenApp === 'notepad'
                  ? 'absolute inset-0 bg-[#202020] border-0 rounded-none'
                  : 'absolute top-6 left-20 w-80 h-64 bg-[#202020]/95 backdrop-blur-xl border border-white/15 rounded-xl'
              } shadow-2xl flex flex-col z-20 overflow-hidden animate-fade-in`}>
                <div className="px-3 py-1.5 border-b border-white/10 flex items-center justify-between bg-black/30">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-blue-400" />
                    <span className="font-bold text-xs text-gray-200">Notepad - InceptionLog.txt</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => toggleFullscreenApp('notepad')}
                      className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white"
                      title={fullscreenApp === 'notepad' ? "Restore Window" : "Full Screen Window"}
                    >
                      {fullscreenApp === 'notepad' ? <Minimize2 size={12} /> : <Square size={11} />}
                    </button>
                    <button 
                      onClick={() => {
                        setActiveApp(null);
                        setFullscreenApp(null);
                      }}
                      className="p-1 hover:bg-red-600 hover:text-white rounded text-gray-400"
                      title="Close"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-2 flex flex-col">
                  <textarea
                    value={notepadText}
                    onChange={(e) => setNotepadText(e.target.value)}
                    className="flex-1 bg-transparent p-2 text-gray-200 font-mono text-[11px] outline-hidden resize-none leading-relaxed"
                  />
                  <div className="text-[10px] text-gray-500 font-mono pt-1 border-t border-white/10 flex justify-between">
                    <span>Windows (CRLF) · UTF-8</span>
                    <span>Tab 1 of 1</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. SETTINGS WINDOW */}
            {activeApp === 'settings' && (
              <div className={`${
                fullscreenApp === 'settings'
                  ? 'absolute inset-0 bg-[#202024] border-0 rounded-none'
                  : 'absolute top-6 left-24 w-88 h-72 bg-[#202024]/95 backdrop-blur-xl border border-white/15 rounded-xl'
              } shadow-2xl flex flex-col z-20 overflow-hidden animate-fade-in`}>
                <div className="px-3 py-1.5 border-b border-white/10 flex items-center justify-between bg-black/30">
                  <div className="flex items-center gap-2">
                    <SettingsIcon size={14} className="text-gray-300" />
                    <span className="font-bold text-xs text-gray-200">Settings - System &gt; About</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => toggleFullscreenApp('settings')}
                      className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white"
                      title={fullscreenApp === 'settings' ? "Restore Window" : "Full Screen Window"}
                    >
                      {fullscreenApp === 'settings' ? <Minimize2 size={12} /> : <Square size={11} />}
                    </button>
                    <button 
                      onClick={() => {
                        setActiveApp(null);
                        setFullscreenApp(null);
                      }}
                      className="p-1 hover:bg-red-600 hover:text-white rounded text-gray-400"
                      title="Close"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
                  <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-lg border border-white/10">
                    <Monitor size={28} className="text-blue-400" />
                    <div>
                      <div className="font-bold text-sm text-white">NESTED-INCEPTION-PC</div>
                      <div className="text-[11px] text-gray-400">Windows 11 Pro 24H2 (Virtual Machine)</div>
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-white/5 p-2.5 rounded-lg border border-white/10 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Host Environment:</span>
                      <span className="text-green-400 font-bold">Mac OS 7.5 on Windows 98</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Processor:</span>
                      <span>Virtual Inception Core i9</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Virtual RAM:</span>
                      <span>64 MB (Infinite Copium)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">TPM 2.0 Status:</span>
                      <span className="text-cyan-400 font-bold">Bypassed via Pure Audacity</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. EXPLORER WINDOW */}
            {activeApp === 'explorer' && (
              <div className={`${
                fullscreenApp === 'explorer'
                  ? 'absolute inset-0 bg-[#202020] border-0 rounded-none'
                  : 'absolute top-8 left-20 w-80 h-64 bg-[#202020]/95 backdrop-blur-xl border border-white/15 rounded-xl'
              } shadow-2xl flex flex-col z-20 overflow-hidden animate-fade-in`}>
                <div className="px-3 py-1.5 border-b border-white/10 flex items-center justify-between bg-black/30">
                  <div className="flex items-center gap-2">
                    <Folder size={14} className="text-amber-400" />
                    <span className="font-bold text-xs text-gray-200">File Explorer - This PC</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => toggleFullscreenApp('explorer')}
                      className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white"
                      title={fullscreenApp === 'explorer' ? "Restore Window" : "Full Screen Window"}
                    >
                      {fullscreenApp === 'explorer' ? <Minimize2 size={12} /> : <Square size={11} />}
                    </button>
                    <button 
                      onClick={() => {
                        setActiveApp(null);
                        setFullscreenApp(null);
                      }}
                      className="p-1 hover:bg-red-600 hover:text-white rounded text-gray-400"
                      title="Close"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-3 grid grid-cols-3 gap-2 content-start">
                  {[
                    { name: 'Documents', icon: '📄', items: '2 files' },
                    { name: 'Pictures', icon: '🖼️', items: '0 files' },
                    { name: 'Downloads', icon: '📥', items: '1 file' },
                    { name: 'Regrets', icon: '🗑️', items: '9,999 files' },
                    { name: 'Local Disk (C:)', icon: '💾', items: '16 MB free' },
                  ].map((folder) => (
                    <div
                      key={folder.name}
                      onClick={() => sounds.playClick()}
                      className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex flex-col items-center text-center cursor-pointer transition-colors"
                    >
                      <span className="text-2xl mb-1">{folder.icon}</span>
                      <span className="font-bold text-[11px] truncate w-full">{folder.name}</span>
                      <span className="text-[9px] text-gray-400">{folder.items}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. CHROMEOS WINDOW (NESTED 4TH LEVEL) */}
            {activeApp === 'chromeos' && (
              <div className={`${
                fullscreenApp === 'chromeos'
                  ? 'absolute inset-0 bg-[#1b1c1e] border-0 rounded-none'
                  : 'absolute inset-1 bg-[#1b1c1e] border-2 border-white/20 rounded-xl'
              } shadow-2xl flex flex-col z-30 overflow-hidden animate-fade-in`}>
                {/* Windows 11 Modern Acrylic Title Bar */}
                <div className="px-3 py-1.5 border-b border-white/10 flex items-center justify-between bg-black/60 select-none">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-[#ea4335] bg-[#4285f4] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                    <span className="font-bold text-xs text-gray-200">
                      Windows Subsystem for ChromeOS (Layer 4 Inception)
                    </span>
                    <span className="bg-yellow-500/20 text-yellow-300 text-[9px] px-1.5 py-0.2 rounded border border-yellow-500/40 font-mono">
                      Level 4
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <button 
                      onClick={() => toggleFullscreenApp('chromeos')} 
                      className="p-1 hover:bg-white/10 rounded hover:text-white"
                      title={fullscreenApp === 'chromeos' ? "Restore Window" : "Full Screen Window"}
                    >
                      {fullscreenApp === 'chromeos' ? <Minimize2 size={12} /> : <Square size={10} />}
                    </button>
                    <button 
                      onClick={() => {
                        setActiveApp(null);
                        setFullscreenApp(null);
                      }} 
                      className="p-1 hover:bg-red-600 hover:text-white rounded"
                      title="Close"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>

                {/* ChromeOS Inner Environment */}
                <div className="flex-1 overflow-hidden relative">
                  <ChromeOSEnvironment />
                </div>
              </div>
            )}
          </div>

          {/* FLOATING WINDOWS 11 START MENU */}
          {isStartMenuOpen && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 w-80 bg-[#1c1c20]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 z-50 animate-fade-in"
            >
              {/* Search Bar */}
              <div className="bg-white/10 border border-white/15 rounded-xl px-3 py-1.5 flex items-center gap-2">
                <Search size={14} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Type here to search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-white text-xs outline-hidden w-full placeholder-gray-400"
                />
              </div>

              {/* Pinned Apps Grid */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-gray-400 mb-2 font-semibold">
                  <span>Pinned</span>
                  <button className="text-blue-400 hover:underline">All apps &gt;</button>
                </div>

                <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                  {[
                    { id: 'copilot', name: 'Copilot', icon: <Sparkles size={18} className="text-cyan-300" /> },
                    { id: 'chromeos', name: 'ChromeOS', icon: <div className="w-5 h-5 rounded-full border border-[#ea4335] bg-[#4285f4] flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-white flex items-center justify-center"><div className="w-1 h-1 rounded-full bg-[#4285f4]" /></div></div> },
                    { id: 'explorer', name: 'Explorer', icon: <Folder size={18} className="text-amber-400" /> },
                    { id: 'notepad', name: 'Notepad', icon: <FileText size={18} className="text-blue-300" /> },
                    { id: 'settings', name: 'Settings', icon: <SettingsIcon size={18} className="text-gray-300" /> },
                  ].map((app) => (
                    <button
                      key={app.id}
                      onClick={() => {
                        sounds.playClick();
                        setActiveApp(app.id as Win11App);
                        setIsStartMenuOpen(false);
                      }}
                      className="p-1.5 hover:bg-white/10 rounded-xl flex flex-col items-center gap-1 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        {app.icon}
                      </div>
                      <span className="text-[10px] text-gray-200 truncate w-full">{app.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommended Items */}
              <div className="border-t border-white/10 pt-2 text-[11px]">
                <span className="text-gray-400 font-semibold block mb-1">Recommended</span>
                <div 
                  onClick={() => {
                    setActiveApp('notepad');
                    setIsStartMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-1.5 hover:bg-white/10 rounded-lg cursor-pointer"
                >
                  <FileText size={14} className="text-blue-400" />
                  <div className="flex-1 truncate">
                    <div className="text-gray-200 font-medium">Inception_Recursion.txt</div>
                    <div className="text-[9px] text-gray-400">Created in Mac OS</div>
                  </div>
                </div>
              </div>

              {/* Bottom User Profile & Power Button */}
              <div className="border-t border-white/10 pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">
                    P
                  </div>
                  <span className="text-xs font-semibold text-gray-200">Procrastinator</span>
                </div>

                <button
                  onClick={() => {
                    sounds.playClick();
                    startBoot();
                    setIsStartMenuOpen(false);
                  }}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white"
                  title="Restart Windows 11 Virtual Machine"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          )}

          {/* CENTERED WINDOWS 11 TASKBAR */}
          <div className="h-10 bg-[#16161a]/80 backdrop-blur-2xl border-t border-white/10 px-3 flex items-center justify-between z-40">
            {/* Left Spacer */}
            <div className="w-16 hidden sm:block" />

            {/* Centered Icons Dock */}
            <div className="flex items-center gap-1.5 mx-auto">
              {/* Windows 11 Start Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playClick();
                  setIsStartMenuOpen(!isStartMenuOpen);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  isStartMenuOpen ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
                title="Start"
              >
                <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                  <div className="bg-[#00a4ef] rounded-[1px]" />
                  <div className="bg-[#00a4ef] rounded-[1px]" />
                  <div className="bg-[#00a4ef] rounded-[1px]" />
                  <div className="bg-[#00a4ef] rounded-[1px]" />
                </div>
              </button>

              {/* Search Icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playClick();
                  setIsStartMenuOpen(true);
                }}
                className="p-1.5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white"
                title="Search"
              >
                <Search size={16} />
              </button>

              {/* Copilot Icon */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveApp('copilot');
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  activeApp === 'copilot' ? 'bg-white/20 border-b-2 border-cyan-400' : 'hover:bg-white/10'
                }`}
                title="Microsoft Copilot"
              >
                <Sparkles size={16} className="text-cyan-400" />
              </button>

              {/* ChromeOS Icon */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveApp('chromeos');
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  activeApp === 'chromeos' ? 'bg-white/20 border-b-2 border-[#ea4335]' : 'hover:bg-white/10'
                }`}
                title="ChromeOS Environment"
              >
                <div className="w-4 h-4 rounded-full border-2 border-[#ea4335] bg-[#4285f4] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white flex items-center justify-center">
                    <div className="w-0.5 h-0.5 rounded-full bg-[#4285f4]" />
                  </div>
                </div>
              </button>

              {/* File Explorer Icon */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveApp('explorer');
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  activeApp === 'explorer' ? 'bg-white/20 border-b-2 border-amber-400' : 'hover:bg-white/10'
                }`}
                title="File Explorer"
              >
                <Folder size={16} className="text-amber-400" />
              </button>

              {/* Notepad Icon */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveApp('notepad');
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  activeApp === 'notepad' ? 'bg-white/20 border-b-2 border-blue-400' : 'hover:bg-white/10'
                }`}
                title="Notepad"
              >
                <FileText size={16} className="text-blue-300" />
              </button>

              {/* Settings Icon */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveApp('settings');
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  activeApp === 'settings' ? 'bg-white/20 border-b-2 border-gray-400' : 'hover:bg-white/10'
                }`}
                title="Settings"
              >
                <SettingsIcon size={16} className="text-gray-300" />
              </button>
            </div>

            {/* Right System Tray */}
            <div className="flex items-center gap-2 text-[11px] text-gray-300 font-mono">
              <div className="flex items-center gap-1.5 px-1 py-0.5 hover:bg-white/10 rounded">
                <Wifi size={13} />
                <Volume2 size={13} />
                <Battery size={13} />
              </div>
              <span className="text-[10px] hidden sm:inline">{currentTime}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
