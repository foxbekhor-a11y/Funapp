import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Settings as SettingsIcon, 
  Folder, 
  Globe, 
  Sparkles, 
  Power, 
  Volume2, 
  Wifi, 
  Battery, 
  RotateCcw, 
  Send, 
  Play, 
  X, 
  Minus, 
  Square, 
  Maximize2,
  Minimize2,
  Monitor, 
  Sliders, 
  Sun, 
  Moon, 
  Bell, 
  ArrowLeft, 
  ArrowRight, 
  RotateCw,
  ExternalLink
} from 'lucide-react';
import { sounds } from '../../../utils/soundEffects';

type ChromeApp = 'browser' | 'gemini' | 'dino' | 'files' | 'settings';

interface GeminiMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  time: string;
}

export const ChromeOSEnvironment: React.FC = () => {
  const [isBooting, setIsBooting] = useState<boolean>(true);
  const [isLauncherOpen, setIsLauncherOpen] = useState<boolean>(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState<boolean>(false);
  const [activeApp, setActiveApp] = useState<ChromeApp | null>('gemini');
  const [fullscreenApp, setFullscreenApp] = useState<ChromeApp | null>(null);
  const [launcherSearch, setLauncherSearch] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('1:14 PM');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const toggleFullscreenApp = (app: ChromeApp) => {
    sounds.playClick();
    setFullscreenApp((prev) => (prev === app ? null : app));
  };

  // Gemini Assistant State
  const [geminiInput, setGeminiInput] = useState<string>('');
  const [isGeminiThinking, setIsGeminiThinking] = useState<boolean>(false);
  const [geminiMessages, setGeminiMessages] = useState<GeminiMessage[]>([
    {
      id: '1',
      sender: 'gemini',
      text: "Hello! I'm Google Gemini on ChromeOS. You are currently at Level 4 of operating system virtualization: ChromeOS ➔ Windows 11 ➔ Mac OS 9 ➔ Windows 98. How can I help you question your life choices today?",
      time: '1:14 PM'
    }
  ]);
  const geminiChatEndRef = useRef<HTMLDivElement | null>(null);

  // T-Rex Dino Runner Mini Game State
  const [dinoRunning, setDinoRunning] = useState<boolean>(false);
  const [dinoY, setDinoY] = useState<number>(0);
  const [cactusX, setCactusX] = useState<number>(240);
  const [dinoScore, setDinoScore] = useState<number>(0);
  const [dinoGameOver, setDinoGameOver] = useState<boolean>(false);

  // Browser State
  const [chromeUrl, setChromeUrl] = useState<string>('https://google.com/search?q=how+deep+can+virtualization+go');
  const [inputUrl, setInputUrl] = useState<string>(chromeUrl);

  // Startup sequence
  const startBoot = () => {
    setIsBooting(true);
    sounds.playChromeChime();
    setTimeout(() => {
      setIsBooting(false);
    }, 1200);
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
    geminiChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [geminiMessages, isGeminiThinking]);

  // Dino Game Loop
  useEffect(() => {
    if (!dinoRunning || dinoGameOver) return;
    const gameLoop = setInterval(() => {
      setCactusX((prev) => {
        if (prev <= -20) {
          setDinoScore((s) => s + 10);
          return 260;
        }
        // Collision check
        if (prev > 15 && prev < 35 && dinoY < 20) {
          setDinoGameOver(true);
          setDinoRunning(false);
          sounds.playOof();
        }
        return prev - 8;
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, [dinoRunning, dinoGameOver, dinoY]);

  // Dino Jump
  const handleDinoJump = () => {
    if (dinoGameOver) {
      setDinoGameOver(false);
      setCactusX(260);
      setDinoScore(0);
      setDinoRunning(true);
      return;
    }
    if (!dinoRunning) {
      setDinoRunning(true);
    }
    if (dinoY === 0) {
      sounds.playJump();
      setDinoY(35);
      setTimeout(() => setDinoY(0), 400);
    }
  };

  const handleAskGemini = (text?: string) => {
    const q = (text || geminiInput).trim();
    if (!q) return;

    sounds.playClick();
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: GeminiMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
      time: nowStr
    };

    setGeminiMessages((prev) => [...prev, userMsg]);
    setGeminiInput('');
    setIsGeminiThinking(true);

    setTimeout(() => {
      let reply = "";
      const lower = q.toLowerCase();

      if (lower.includes('level') || lower.includes('layer') || lower.includes('inception') || lower.includes('deep')) {
        reply = "You are currently 4 layers deep: [Host: Windows 98] ➔ [VM 1: Mac OS 9] ➔ [VM 2: Windows 11] ➔ [VM 3: ChromeOS]. If you install Linux inside me, you will reach the Earth's molten core.";
      } else if (lower.includes('compare') || lower.includes('os') || lower.includes('which')) {
        reply = "Windows 98 has nostalgia. Mac OS has typography. Windows 11 has rounded corners. ChromeOS has a web browser and 2% battery consumption. You have collected all four like infinity stones.";
      } else if (lower.includes('roast') || lower.includes('work') || lower.includes('procrastinat')) {
        reply = "Chromebooks were engineered for students to do homework. You engineered a Chromebook inside three other operating systems solely to avoid doing yours.";
      } else if (lower.includes('meaning') || lower.includes('life')) {
        reply = "The meaning of life is closing all four layers of operating systems and going for a 15-minute walk outside.";
      } else {
        reply = `Analyzing query "${q}": Gemini confirms that while your multi-tier virtual computing stack is impressive, your unfinished real-world responsibilities remain at 100%.`;
      }

      const geminiMsg: GeminiMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'gemini',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setGeminiMessages((prev) => [...prev, geminiMsg]);
      setIsGeminiThinking(false);
      sounds.speak(reply, 'siri');
    }, 600);
  };

  return (
    <div 
      className={`flex flex-col h-full ${isDarkMode ? 'bg-[#1b1c1e] text-white' : 'bg-[#f4f5f8] text-black'} font-sans text-xs select-none overflow-hidden relative`}
      onClick={() => {
        setIsLauncherOpen(false);
        setIsQuickSettingsOpen(false);
      }}
    >
      {/* BOOT SCREEN WITH CHROME LOGO */}
      {isBooting ? (
        <div className="flex-1 bg-white flex flex-col items-center justify-center p-6 text-center text-black">
          {/* Chrome 4-Color Logo */}
          <div className="w-16 h-16 rounded-full border-4 border-[#ea4335] bg-[#4285f4] flex items-center justify-center mb-4 shadow-xl relative overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-[#4285f4]" />
            </div>
          </div>
          <span className="font-bold text-base tracking-wide text-gray-800">chromeOS</span>
          <span className="text-[11px] text-gray-500 mt-1 font-mono">Initializing ChromeOS Virtual Container...</span>
        </div>
      ) : (
        /* MAIN CHROMEOS DESKTOP SURFACE */
        <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-tr from-[#1a233a] via-[#203a43] to-[#2c5364]">
          {/* Material You Pastel Wave Background */}
          <div className="absolute inset-0 pointer-events-none opacity-50">
            <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-amber-400/20 blur-3xl" />
          </div>

          {/* ACTIVE APPLICATION WINDOWS AREA */}
          <div className="flex-1 p-2 relative overflow-hidden flex items-center justify-center">
            {/* 1. GOOGLE GEMINI AI ASSISTANT */}
            {activeApp === 'gemini' && (
              <div className={`${
                fullscreenApp === 'gemini'
                  ? 'absolute inset-0 w-full h-full max-w-none max-h-none rounded-none z-20'
                  : 'w-full max-w-sm h-full max-h-[290px] rounded-2xl'
              } bg-[#1e1f22]/95 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-fade-in text-white`}>
                <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between bg-black/20">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-400 via-indigo-500 to-purple-500 flex items-center justify-center">
                      <Sparkles size={11} className="text-white" />
                    </div>
                    <span className="font-bold text-xs text-white">Google Gemini</span>
                    <span className="bg-blue-900/60 text-blue-300 text-[9px] px-1.5 py-0.2 rounded-full border border-blue-700">
                      Level 4 AI
                    </span>
                    {fullscreenApp === 'gemini' && (
                      <span className="bg-cyan-500/20 text-cyan-300 text-[9px] px-1.5 py-0.2 rounded-full border border-cyan-400/40">
                        Full Screen
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => toggleFullscreenApp('gemini')} 
                      className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"
                      title={fullscreenApp === 'gemini' ? "Restore Window" : "Full Screen Window"}
                    >
                      {fullscreenApp === 'gemini' ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                    </button>
                    <button 
                      onClick={() => {
                        setActiveApp(null);
                        setFullscreenApp(null);
                      }} 
                      className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"
                      title="Close"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
                  {geminiMessages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-3 py-2 leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#0b57d0] text-white rounded-br-xs'
                          : 'bg-[#2b2c2f] border border-white/10 text-gray-200 rounded-bl-xs'
                      }`}>
                        {msg.sender === 'gemini' && (
                          <div className="text-[9px] font-bold text-cyan-400 mb-0.5">Gemini in ChromeOS</div>
                        )}
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))}

                  {isGeminiThinking && (
                    <div className="flex items-center gap-2 p-2 bg-white/5 rounded-xl text-[11px] text-cyan-300 animate-pulse">
                      <div className="w-3 h-3 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                      <span>Gemini thinking...</span>
                    </div>
                  )}

                  <div ref={geminiChatEndRef} />
                </div>

                {/* Prompt Pills */}
                <div className="px-2 py-1 bg-black/20 border-t border-white/10 flex items-center gap-1 overflow-x-auto text-[10px] whitespace-nowrap">
                  {['Inception level check', 'Roast my 4 OSes', 'Meaning of life'].map((p) => (
                    <button
                      key={p}
                      onClick={() => handleAskGemini(p)}
                      className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded-full text-blue-300 border border-blue-500/30"
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <div className="p-2 border-t border-white/10 bg-black/20 flex items-center gap-1.5">
                  <input
                    type="text"
                    value={geminiInput}
                    onChange={(e) => setGeminiInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAskGemini();
                    }}
                    placeholder="Ask Gemini..."
                    className="flex-1 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 text-xs text-white placeholder-gray-400 outline-hidden focus:border-blue-400"
                  />
                  <button onClick={() => handleAskGemini()} className="p-1.5 bg-[#0b57d0] hover:bg-blue-600 rounded-full text-white shadow">
                    <Send size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* 2. CHROME OFFLINE DINO RUNNER GAME */}
            {activeApp === 'dino' && (
              <div className={`${
                fullscreenApp === 'dino'
                  ? 'absolute inset-0 w-full h-full max-w-none max-h-none rounded-none z-20'
                  : 'w-full max-w-sm h-full max-h-[290px] rounded-2xl'
              } bg-[#222] border border-white/15 shadow-2xl flex flex-col overflow-hidden animate-fade-in text-white font-mono`}>
                <div className="px-3 py-1.5 border-b border-white/10 flex items-center justify-between bg-black/40">
                  <span className="font-bold text-xs text-yellow-400">chrome://dino (Offline Runner)</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300 text-[11px]">Score: {dinoScore}</span>
                    <button 
                      onClick={() => toggleFullscreenApp('dino')} 
                      className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"
                      title={fullscreenApp === 'dino' ? "Restore Window" : "Full Screen Window"}
                    >
                      {fullscreenApp === 'dino' ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                    </button>
                    <button 
                      onClick={() => {
                        setActiveApp(null);
                        setFullscreenApp(null);
                      }} 
                      className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"
                      title="Close"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>

                <div 
                  onClick={handleDinoJump}
                  className="flex-1 bg-[#1a1a1a] relative overflow-hidden flex flex-col justify-end p-4 cursor-pointer select-none"
                >
                  <div className="absolute top-3 left-4 text-[10px] text-gray-400">
                    {dinoRunning ? 'Tap/Click to Jump!' : 'Click to Start Running!'}
                  </div>

                  {dinoGameOver && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1 z-20">
                      <div className="text-sm font-bold text-red-400">GAME OVER</div>
                      <div className="text-[10px] text-gray-300">Final Score: {dinoScore}</div>
                      <button className="px-3 py-1 bg-yellow-500 text-black font-bold text-[10px] rounded mt-1">
                        Play Again
                      </button>
                    </div>
                  )}

                  {/* Ground Line */}
                  <div className="w-full h-1 bg-gray-600 mb-2 relative">
                    {/* Obstacle Cactus */}
                    <div 
                      className="absolute bottom-0 text-base leading-none select-none"
                      style={{ left: `${cactusX}px` }}
                    >
                      🌵
                    </div>
                  </div>

                  {/* Player Dino */}
                  <div 
                    className="absolute text-2xl select-none transition-all duration-150"
                    style={{ left: '25px', bottom: `${16 + dinoY}px` }}
                  >
                    🦖
                  </div>
                </div>
              </div>
            )}

            {/* 3. CHROME BROWSER */}
            {activeApp === 'browser' && (
              <div className={`${
                fullscreenApp === 'browser'
                  ? 'absolute inset-0 w-full h-full max-w-none max-h-none rounded-none z-20'
                  : 'w-full max-w-sm h-full max-h-[290px] rounded-2xl'
              } bg-[#28292a] border border-white/15 shadow-2xl flex flex-col overflow-hidden animate-fade-in text-white`}>
                {/* Browser Tab & Omnibox */}
                <div className="px-2 py-1.5 bg-[#1f1f20] border-b border-white/10 flex items-center gap-2">
                  <div className="flex items-center gap-1 text-gray-400">
                    <ArrowLeft size={13} />
                    <ArrowRight size={13} />
                    <RotateCw size={13} />
                  </div>
                  <div className="flex-1 bg-[#2e2f32] rounded-full px-2.5 py-1 text-[11px] text-gray-200 border border-white/10 truncate font-mono">
                    {chromeUrl}
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => toggleFullscreenApp('browser')} 
                      className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"
                      title={fullscreenApp === 'browser' ? "Restore Window" : "Full Screen Window"}
                    >
                      {fullscreenApp === 'browser' ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                    </button>
                    <button 
                      onClick={() => {
                        setActiveApp(null);
                        setFullscreenApp(null);
                      }} 
                      className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"
                      title="Close"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 bg-white text-black p-4 flex flex-col items-center justify-center text-center">
                  <div className="text-3xl font-bold font-sans tracking-tight mb-2">
                    <span className="text-[#4285f4]">G</span>
                    <span className="text-[#ea4335]">o</span>
                    <span className="text-[#fbbc05]">o</span>
                    <span className="text-[#4285f4]">g</span>
                    <span className="text-[#34a853]">l</span>
                    <span className="text-[#ea4335]">e</span>
                  </div>
                  <div className="text-xs text-gray-600 max-w-xs mb-3">
                    "Search results for: how deep can operating systems be nested before reality uninstalls"
                  </div>
                  <div className="bg-gray-100 p-2.5 rounded-lg border text-[11px] text-gray-800 text-left w-full max-w-xs space-y-1">
                    <div className="font-bold text-blue-600 hover:underline cursor-pointer">
                      Depth 4: ChromeOS in Win 11 in Mac OS in Win 98
                    </div>
                    <p className="text-[10px] text-gray-600">
                      Researchers confirm you have achieved maximum computational nesting.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. SETTINGS APP */}
            {activeApp === 'settings' && (
              <div className={`${
                fullscreenApp === 'settings'
                  ? 'absolute inset-0 w-full h-full max-w-none max-h-none rounded-none z-20'
                  : 'w-full max-w-sm h-full max-h-[290px] rounded-2xl'
              } bg-[#1e1f22] border border-white/15 shadow-2xl flex flex-col overflow-hidden animate-fade-in text-white p-3`}>
                <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
                  <div className="flex items-center gap-2">
                    <SettingsIcon size={14} className="text-blue-400" />
                    <span className="font-bold text-xs">Settings - About ChromeOS</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => toggleFullscreenApp('settings')} 
                      className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"
                      title={fullscreenApp === 'settings' ? "Restore Window" : "Full Screen Window"}
                    >
                      {fullscreenApp === 'settings' ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                    </button>
                    <button 
                      onClick={() => {
                        setActiveApp(null);
                        setFullscreenApp(null);
                      }} 
                      className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"
                      title="Close"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs flex-1 overflow-y-auto font-mono text-[11px]">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/10 space-y-1">
                    <div className="text-gray-400">OS Version:</div>
                    <div className="font-bold text-white">Google ChromeOS Flex 128.0</div>
                  </div>
                  <div className="p-2 bg-white/5 rounded-lg border border-white/10 space-y-1">
                    <div className="text-gray-400">Virtualization Stack:</div>
                    <div className="text-cyan-300 font-bold">Layer 4 (Deep Inception Mode)</div>
                  </div>
                  <div className="p-2 bg-white/5 rounded-lg border border-white/10 space-y-1">
                    <div className="text-gray-400">Host Environment:</div>
                    <div className="text-yellow-300">Windows 11 on Mac OS 7.5 on Windows 98</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CHROMEOS APP LAUNCHER MODAL ("EVERYTHING BUTTON") */}
          {isLauncherOpen && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-12 left-3 w-72 bg-[#1e1f22]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-3 flex flex-col gap-2.5 z-50 animate-fade-in text-white"
            >
              {/* Search Bar */}
              <div className="bg-white/10 rounded-full px-3 py-1.5 flex items-center gap-2 border border-white/10">
                <Search size={14} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your apps, web..."
                  value={launcherSearch}
                  onChange={(e) => setLauncherSearch(e.target.value)}
                  className="bg-transparent text-white text-xs outline-hidden w-full placeholder-gray-400"
                />
              </div>

              {/* Grid of Apps */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {[
                  { id: 'gemini', name: 'Gemini', icon: '✨', bg: 'bg-gradient-to-tr from-blue-500 to-purple-600' },
                  { id: 'browser', name: 'Chrome', icon: '🌐', bg: 'bg-red-500/20 border border-red-500/40' },
                  { id: 'dino', name: 'Dino Run', icon: '🦖', bg: 'bg-gray-700' },
                  { id: 'settings', name: 'Settings', icon: '⚙️', bg: 'bg-gray-700' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      sounds.playClick();
                      setActiveApp(item.id as ChromeApp);
                      setIsLauncherOpen(false);
                    }}
                    className="p-2 hover:bg-white/10 rounded-xl flex flex-col items-center gap-1 transition-colors"
                  >
                    <div className={`w-9 h-9 rounded-full ${item.bg} flex items-center justify-center text-base shadow`}>
                      {item.icon}
                    </div>
                    <span className="text-[10px] text-gray-200 truncate w-full">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CHROMEOS SHELF (BOTTOM TASKBAR) */}
          <div className="h-10 bg-[#1e1f22]/90 backdrop-blur-2xl border-t border-white/10 px-2 flex items-center justify-between z-40">
            {/* Left: App Launcher ("Everything Button") */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                sounds.playClick();
                setIsLauncherOpen(!isLauncherOpen);
              }}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                isLauncherOpen ? 'bg-white text-black' : 'hover:bg-white/10 text-white'
              }`}
              title="Launcher"
            >
              <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
              </div>
            </button>

            {/* Center: Pinned Shelf Apps */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveApp('gemini');
                }}
                className={`p-1.5 rounded-xl transition-colors ${
                  activeApp === 'gemini' ? 'bg-white/20 border-b-2 border-cyan-400' : 'hover:bg-white/10'
                }`}
                title="Google Gemini"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center">
                  <Sparkles size={11} className="text-white" />
                </div>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveApp('browser');
                }}
                className={`p-1.5 rounded-xl transition-colors ${
                  activeApp === 'browser' ? 'bg-white/20 border-b-2 border-blue-400' : 'hover:bg-white/10'
                }`}
                title="Google Chrome"
              >
                <Globe size={18} className="text-blue-400" />
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveApp('dino');
                }}
                className={`p-1.5 rounded-xl transition-colors ${
                  activeApp === 'dino' ? 'bg-white/20 border-b-2 border-yellow-400' : 'hover:bg-white/10'
                }`}
                title="Chrome Dino Runner"
              >
                <span className="text-base leading-none">🦖</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveApp('settings');
                }}
                className={`p-1.5 rounded-xl transition-colors ${
                  activeApp === 'settings' ? 'bg-white/20 border-b-2 border-gray-400' : 'hover:bg-white/10'
                }`}
                title="Settings"
              >
                <SettingsIcon size={17} className="text-gray-300" />
              </button>
            </div>

            {/* Right: Quick Settings Pill */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                sounds.playClick();
                setIsQuickSettingsOpen(!isQuickSettingsOpen);
              }}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full text-[11px] text-gray-200 border border-white/10 transition-colors font-mono"
            >
              <div className="flex items-center gap-1">
                <Wifi size={12} />
                <Battery size={12} />
              </div>
              <span>{currentTime}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
