import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Volume2, 
  Palette, 
  FileText, 
  Folder, 
  Trash2, 
  HardDrive, 
  Calculator as CalcIcon, 
  Smile, 
  HelpCircle, 
  X, 
  Square, 
  Maximize2, 
  Monitor,
  Check,
  Play,
  Flame,
  Bomb,
  Send,
  Mic,
  Bot
} from 'lucide-react';
import { sounds } from '../../../utils/soundEffects';

type MacTheme = 'system7' | 'macos9' | 'aqua';
type InnerAppId = 'hd' | 'paint' | 'simpletext' | 'speech' | 'calculator' | 'about' | 'patterns' | 'bomb' | 'siri';

interface InnerWindow {
  id: InnerAppId;
  title: string;
  isOpen: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

interface SiriMessage {
  id: string;
  sender: 'user' | 'siri';
  text: string;
  time: string;
}

const DESKTOP_PATTERNS = [
  { id: 'classic_gray', name: 'Classic 50% Gray', bg: 'bg-[#7f7f7f]' },
  { id: 'polka_dot', name: 'Polka Dot Pinstripe', bg: 'bg-[radial-gradient(#555_1px,transparent_1px)] [background-size:8px_8px] bg-[#8a8a8a]' },
  { id: 'houndstooth', name: 'Macintosh Teal', bg: 'bg-[#008080]' },
  { id: 'dark_platinum', name: 'Mac OS 9 Platinum', bg: 'bg-[#334455]' },
  { id: 'monterey', name: 'Sonoma Gradient', bg: 'bg-gradient-to-br from-[#1d2671] to-[#c33764]' },
];

export const MacOSEnvironment: React.FC = () => {
  const [theme, setTheme] = useState<MacTheme>('macos9');
  const [isBooting, setIsBooting] = useState<boolean>(true);
  const [bootProgress, setBootProgress] = useState<number>(0);
  const [bootStatus, setBootStatus] = useState<string>('Welcome to Macintosh');
  const [selectedPattern, setSelectedPattern] = useState<string>('classic_gray');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('10:42 AM');
  const [trashCount, setTrashCount] = useState<number>(3);
  const [activeInnerWindow, setActiveInnerWindow] = useState<InnerAppId | null>('simpletext');
  const [highestInnerZ, setHighestInnerZ] = useState<number>(12);

  // Siri State
  const [siriQuery, setSiriQuery] = useState<string>('');
  const [isSiriThinking, setIsSiriThinking] = useState<boolean>(false);
  const [siriMessages, setSiriMessages] = useState<SiriMessage[]>([
    {
      id: '1',
      sender: 'siri',
      text: "Hi, I'm Siri. Your Cupertino AI assistant. How can I help you avoid your actual responsibilities today?",
      time: '10:42 AM'
    }
  ]);
  const siriChatEndRef = useRef<HTMLDivElement | null>(null);

  // Inner windows state
  const [windows, setWindows] = useState<InnerWindow[]>([
    { id: 'simpletext', title: 'TeachText - Think Different', isOpen: true, x: 25, y: 35, width: 330, height: 220, zIndex: 10 },
    { id: 'siri', title: 'Siri AI Assistant (Cupertino Intelligence)', isOpen: false, x: 65, y: 30, width: 370, height: 360, zIndex: 12 },
    { id: 'paint', title: 'MacPaint 1.0', isOpen: false, x: 50, y: 45, width: 380, height: 280, zIndex: 9 },
    { id: 'speech', title: 'MacinTalk Speech Synthesizer', isOpen: false, x: 75, y: 65, width: 320, height: 220, zIndex: 8 },
    { id: 'calculator', title: 'Calculator', isOpen: false, x: 170, y: 55, width: 200, height: 250, zIndex: 7 },
    { id: 'about', title: 'About This Macintosh', isOpen: false, x: 90, y: 55, width: 360, height: 240, zIndex: 11 },
    { id: 'patterns', title: 'Desktop Patterns', isOpen: false, x: 85, y: 75, width: 280, height: 220, zIndex: 6 },
    { id: 'hd', title: 'Macintosh HD', isOpen: false, x: 35, y: 45, width: 320, height: 200, zIndex: 5 },
    { id: 'bomb', title: 'System Error', isOpen: false, x: 85, y: 75, width: 320, height: 160, zIndex: 99 },
  ]);

  // MacPaint Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [paintTool, setPaintTool] = useState<'pencil' | 'brush' | 'spray' | 'eraser'>('pencil');

  // SimpleText Editor State
  const [noteContent, setNoteContent] = useState<string>(
    "MEMORANDUM FROM CUPERTINO\n\nHere’s to the crazy ones.\nThe misfits. The procrastinators.\nThe ones who run Mac OS inside Windows 98 just to avoid doing their actual work.\n\nWhile Microsoft gives you Blue Screens of Death, we give you artistic despair in high-DPI Chicago font.\n\nStay hungry. Stay in bed."
  );

  // MacinTalk Speech State
  const [speechText, setSpeechText] = useState<string>("Welcome to Macintosh. Have you considered thinking different about your career?");
  const [selectedVoice, setSelectedVoice] = useState<string>('victoria');

  // Calculator State
  const [calcDisplay, setCalcDisplay] = useState<string>('0');
  const [calcPrev, setCalcPrev] = useState<number | null>(null);
  const [calcOp, setCalcOp] = useState<string | null>(null);

  // Auto-scroll Siri conversation
  useEffect(() => {
    siriChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [siriMessages, isSiriThinking]);

  // Boot sequence
  const startBoot = () => {
    setIsBooting(true);
    setBootProgress(15);
    setBootStatus('Checking ROM & 16MB RAM...');
    sounds.playMacChime();

    setTimeout(() => {
      setBootProgress(45);
      setBootStatus('Loading System Extensions (QuickTime, AppleTalk, Siri.dylib)...');
    }, 600);

    setTimeout(() => {
      setBootProgress(85);
      setBootStatus('Starting Mac OS 9.2 Finder & Cupertino Intelligence...');
    }, 1200);

    setTimeout(() => {
      setBootProgress(100);
      setIsBooting(false);
    }, 1600);
  };

  useEffect(() => {
    startBoot();
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const openInnerWindow = (id: InnerAppId) => {
    if (id === 'siri') {
      sounds.playSiriChime();
    } else {
      sounds.playClick();
    }
    const nextZ = highestInnerZ + 1;
    setHighestInnerZ(nextZ);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isOpen: true, zIndex: nextZ } : w))
    );
    setActiveInnerWindow(id);
    setActiveMenu(null);
  };

  const closeInnerWindow = (id: InnerAppId) => {
    sounds.playClick();
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isOpen: false } : w))
    );
    if (activeInnerWindow === id) {
      setActiveInnerWindow(null);
    }
  };

  const focusInnerWindow = (id: InnerAppId) => {
    const nextZ = highestInnerZ + 1;
    setHighestInnerZ(nextZ);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: nextZ } : w))
    );
    setActiveInnerWindow(id);
    setActiveMenu(null);
  };

  const emptyTrash = () => {
    sounds.playTrashCrumple();
    setTrashCount(0);
    sounds.speak("Trash emptied. 4,200 unresolved regrets permanently purged from the Hierarchical File System.", 'siri');
    setActiveMenu(null);
  };

  const triggerBomb = () => {
    sounds.playError();
    openInnerWindow('bomb');
  };

  // Siri Question Answering Logic
  const handleAskSiri = (queryText?: string) => {
    const q = (queryText || siriQuery).trim();
    if (!q) return;

    sounds.playSiriChime();
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: SiriMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
      time: nowStr
    };

    setSiriMessages((prev) => [...prev, userMsg]);
    setSiriQuery('');
    setIsSiriThinking(true);

    setTimeout(() => {
      let answer = "";
      const lower = q.toLowerCase();

      if (lower.includes('clippy')) {
        answer = "Clippy? We don't talk about Clippy. He's still trying to format a letter from 1997. While he offers unsolicited paperclips, I offer existential design standards.";
      } else if (lower.includes('why') && (lower.includes('windows') || lower.includes('mac'))) {
        answer = "You are currently running an emulation of Mac OS inside Windows 98 hosted on a modern cloud container. Steve Jobs and Bill Gates are both turning in their turtlenecks.";
      } else if (lower.includes('joke') || lower.includes('gates') || lower.includes('jobs')) {
        answer = "Bill Gates and Steve Jobs walk into a cafe. Steve orders an artisanal organic water for $999 and calls it revolutionary. Bill buys the cafe, licenses the chairs, and causes a Blue Screen.";
      } else if (lower.includes('life') || lower.includes('future') || lower.includes('purpose')) {
        answer = "I've analyzed your telemetry. You have 14 overdue obligations, zero unread emails answered, and 100% chance of staying right in this chair. Have you tried drinking some water?";
      } else if (lower.includes('remind') || lower.includes('task') || lower.includes('work')) {
        answer = "I have scheduled a reminder: 'Cease procrastinating'. It is set for 2038 to coincide with the Unix epoch rollover.";
      } else if (lower.includes('zero') || lower.includes('divide')) {
        answer = "Imagine that you have zero cookies and you split them evenly among zero friends. See? It makes no sense, Cookie Monster is sad, and you have no cookies.";
      } else if (lower.includes('love') || lower.includes('dating') || lower.includes('crush')) {
        answer = "My predictive models indicate your optimal romantic match is a fully charged PowerBook G3. It won't leave you on 'read'.";
      } else if (lower.includes('weather')) {
        answer = "It is currently 72° and sunny in Cupertino. However, in your immediate vicinity, there is a 98% chance of avoiding real-world chores.";
      } else {
        answer = `Here is what I found for "${q}": I recommend thinking different about your priorities and getting back to work.`;
      }

      const siriMsg: SiriMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'siri',
        text: answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSiriMessages((prev) => [...prev, siriMsg]);
      setIsSiriThinking(false);
      sounds.speak(answer, 'siri');
    }, 700);
  };

  // Canvas drawing handler
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (paintTool === 'eraser') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - 8, y - 8, 16, 16);
    } else if (paintTool === 'spray') {
      ctx.fillStyle = '#000000';
      for (let i = 0; i < 10; i++) {
        const ox = (Math.random() - 0.5) * 16;
        const oy = (Math.random() - 0.5) * 16;
        ctx.fillRect(x + ox, y + oy, 1, 1);
      }
    } else {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = paintTool === 'brush' ? 4 : 1;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    sounds.playPageClick();
  };

  // Speech Synthesizer speak
  const handleMacSpeak = () => {
    if (!speechText.trim()) return;
    sounds.speak(speechText, selectedVoice);
  };

  // Calculator button handler
  const handleCalcBtn = (val: string) => {
    sounds.playClick();
    if (val === 'C') {
      setCalcDisplay('0');
      setCalcPrev(null);
      setCalcOp(null);
    } else if (['+', '-', '*', '/'].includes(val)) {
      setCalcPrev(parseFloat(calcDisplay));
      setCalcOp(val);
      setCalcDisplay('0');
    } else if (val === '=') {
      if (calcPrev !== null && calcOp) {
        const current = parseFloat(calcDisplay);
        let result = 0;
        if (calcOp === '+') result = calcPrev + current;
        if (calcOp === '-') result = calcPrev - current;
        if (calcOp === '*') result = calcPrev * current;
        if (calcOp === '/') result = current !== 0 ? calcPrev / current : 0;
        setCalcDisplay(String(result));
        setCalcPrev(null);
        setCalcOp(null);
      }
    } else {
      setCalcDisplay((prev) => (prev === '0' ? val : prev + val));
    }
  };

  const getWindow = (id: InnerAppId) => windows.find((w) => w.id === id)!;
  const currentBgClass = DESKTOP_PATTERNS.find((p) => p.id === selectedPattern)?.bg || 'bg-[#7f7f7f]';

  return (
    <div 
      className="flex flex-col h-full bg-[#111] text-black font-sans text-xs select-none overflow-hidden relative"
      onClick={() => setActiveMenu(null)}
    >
      {/* BOOT SCREEN MODAL */}
      {isBooting ? (
        <div className="flex-1 bg-[#888888] flex flex-col items-center justify-center p-6 text-center font-mono">
          <div className="w-16 h-20 bg-[#f7f5e8] border-2 border-black rounded-sm shadow-xl p-2 flex flex-col items-center justify-between mb-4 animate-bounce">
            <div className="w-10 h-7 border border-black bg-white rounded-xs flex items-center justify-center text-xs font-bold font-sans">
              ^_^
            </div>
            <div className="w-8 h-1 bg-black rounded-full" />
            <div className="w-2 h-1 bg-black self-end mr-1" />
          </div>

          <div className="bg-[#f0ede1] border-2 border-black p-4 rounded shadow-2xl max-w-sm w-full">
            <div className="font-bold text-sm mb-2 text-black font-sans">
              🍎 Welcome to Macintosh
            </div>
            <div className="text-[11px] text-gray-700 mb-3">{bootStatus}</div>

            <div className="w-full bg-white border border-black h-4 rounded-xs overflow-hidden p-0.5">
              <div 
                className="bg-black h-full transition-all duration-300" 
                style={{ width: `${bootProgress}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        /* MAIN MACINTOSH DESKTOP ENVIRONMENT */
        <div className={`flex-1 flex flex-col ${currentBgClass} relative overflow-hidden`}>
          {/* TOP MAC OS MENU BAR */}
          <div className="bg-[#e0ded6] border-b border-black/80 px-2 h-6 flex items-center justify-between shadow-xs z-50 font-sans text-xs">
            <div className="flex items-center gap-3">
              {/* Apple Logo Menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sounds.playClick();
                    setActiveMenu(activeMenu === 'apple' ? null : 'apple');
                  }}
                  className={`px-1.5 py-0.5 rounded-xs font-bold text-sm ${
                    activeMenu === 'apple' ? 'bg-black text-white' : 'hover:bg-black/10'
                  }`}
                >
                  🍎
                </button>

                {activeMenu === 'apple' && (
                  <div className="absolute top-6 left-0 bg-[#e0ded6] border-2 border-black shadow-xl py-1 w-52 z-50 text-xs">
                    <button
                      onClick={() => openInnerWindow('about')}
                      className="w-full text-left px-3 py-1 hover:bg-black hover:text-white"
                    >
                      About This Macintosh...
                    </button>
                    <div className="border-t border-black/30 my-1" />
                    <button
                      onClick={() => openInnerWindow('siri')}
                      className="w-full text-left px-3 py-1 text-purple-900 font-bold hover:bg-black hover:text-white flex items-center gap-1.5"
                    >
                      <Sparkles size={12} className="text-purple-600" />
                      <span>Siri AI Assistant ✨</span>
                    </button>
                    <button
                      onClick={() => openInnerWindow('calculator')}
                      className="w-full text-left px-3 py-1 hover:bg-black hover:text-white"
                    >
                      Calculator
                    </button>
                    <button
                      onClick={() => openInnerWindow('paint')}
                      className="w-full text-left px-3 py-1 hover:bg-black hover:text-white"
                    >
                      MacPaint 1.0
                    </button>
                    <button
                      onClick={() => openInnerWindow('simpletext')}
                      className="w-full text-left px-3 py-1 hover:bg-black hover:text-white"
                    >
                      SimpleText
                    </button>
                    <button
                      onClick={() => openInnerWindow('speech')}
                      className="w-full text-left px-3 py-1 hover:bg-black hover:text-white"
                    >
                      MacinTalk Speech
                    </button>
                    <button
                      onClick={() => openInnerWindow('patterns')}
                      className="w-full text-left px-3 py-1 hover:bg-black hover:text-white"
                    >
                      Control Panel: Patterns
                    </button>
                    <div className="border-t border-black/30 my-1" />
                    <button
                      onClick={triggerBomb}
                      className="w-full text-left px-3 py-1 text-red-700 hover:bg-red-700 hover:text-white font-bold"
                    >
                      Trigger System Bomb 💣
                    </button>
                  </div>
                )}
              </div>

              {/* File Menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sounds.playClick();
                    setActiveMenu(activeMenu === 'file' ? null : 'file');
                  }}
                  className={`px-1.5 py-0.5 font-bold ${
                    activeMenu === 'file' ? 'bg-black text-white' : 'hover:bg-black/10'
                  }`}
                >
                  File
                </button>
                {activeMenu === 'file' && (
                  <div className="absolute top-6 left-0 bg-[#e0ded6] border-2 border-black shadow-xl py-1 w-44 z-50 text-xs">
                    <button onClick={() => openInnerWindow('siri')} className="w-full text-left px-3 py-1 hover:bg-black hover:text-white">
                      Ask Siri...
                    </button>
                    <button onClick={() => openInnerWindow('hd')} className="w-full text-left px-3 py-1 hover:bg-black hover:text-white">
                      New Finder Window
                    </button>
                    <button onClick={() => openInnerWindow('simpletext')} className="w-full text-left px-3 py-1 hover:bg-black hover:text-white">
                      Open SimpleText
                    </button>
                    <div className="border-t border-black/30 my-1" />
                    <button onClick={() => setActiveInnerWindow(null)} className="w-full text-left px-3 py-1 hover:bg-black hover:text-white">
                      Close All Windows
                    </button>
                  </div>
                )}
              </div>

              {/* Special Menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sounds.playClick();
                    setActiveMenu(activeMenu === 'special' ? null : 'special');
                  }}
                  className={`px-1.5 py-0.5 font-bold ${
                    activeMenu === 'special' ? 'bg-black text-white' : 'hover:bg-black/10'
                  }`}
                >
                  Special
                </button>
                {activeMenu === 'special' && (
                  <div className="absolute top-6 left-0 bg-[#e0ded6] border-2 border-black shadow-xl py-1 w-44 z-50 text-xs">
                    <button onClick={emptyTrash} className="w-full text-left px-3 py-1 hover:bg-black hover:text-white font-bold">
                      Empty Trash ({trashCount} items)...
                    </button>
                    <button onClick={() => sounds.playDing()} className="w-full text-left px-3 py-1 hover:bg-black hover:text-white">
                      Clean Up Desktop
                    </button>
                    <div className="border-t border-black/30 my-1" />
                    <button onClick={startBoot} className="w-full text-left px-3 py-1 hover:bg-black hover:text-white">
                      Restart Macintosh
                    </button>
                    <button onClick={triggerBomb} className="w-full text-left px-3 py-1 hover:bg-black hover:text-white">
                      Simulate Crash
                    </button>
                  </div>
                )}
              </div>

              {/* Appearance Menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sounds.playClick();
                    setActiveMenu(activeMenu === 'theme' ? null : 'theme');
                  }}
                  className={`px-1.5 py-0.5 font-bold ${
                    activeMenu === 'theme' ? 'bg-black text-white' : 'hover:bg-black/10'
                  }`}
                >
                  Appearance
                </button>
                {activeMenu === 'theme' && (
                  <div className="absolute top-6 left-0 bg-[#e0ded6] border-2 border-black shadow-xl py-1 w-44 z-50 text-xs">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setTheme('system7');
                      }}
                      className="w-full text-left px-3 py-1 hover:bg-black hover:text-white flex items-center justify-between"
                    >
                      <span>System 7 (1991)</span>
                      {theme === 'system7' && <span>✓</span>}
                    </button>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setTheme('macos9');
                      }}
                      className="w-full text-left px-3 py-1 hover:bg-black hover:text-white flex items-center justify-between"
                    >
                      <span>Mac OS 9 Platinum</span>
                      {theme === 'macos9' && <span>✓</span>}
                    </button>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setTheme('aqua');
                      }}
                      className="w-full text-left px-3 py-1 hover:bg-black hover:text-white flex items-center justify-between"
                    >
                      <span>macOS Aqua Dock</span>
                      {theme === 'aqua' && <span>✓</span>}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Menu Bar (Siri Trigger, Clock & Finder) */}
            <div className="flex items-center gap-2 text-[11px] font-mono">
              {/* Glowing Siri Button in Top Menu */}
              <button
                onClick={() => openInnerWindow('siri')}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-[10px] shadow hover:scale-105 active:scale-95 transition-transform"
                title="Open Siri AI Assistant"
              >
                <Sparkles size={11} className="animate-spin text-yellow-200" />
                <span>Siri</span>
              </button>

              <span className="font-bold text-black">{currentTime}</span>
              <div className="w-4 h-4 bg-white border border-black rounded-xs flex items-center justify-center text-[10px]">
                Finder
              </div>
            </div>
          </div>

          {/* DESKTOP SURFACE & ICONS */}
          <div className="flex-1 relative p-3 overflow-hidden">
            {/* Desktop Icons (Top-Right / Left) */}
            <div className="absolute top-4 right-4 flex flex-col items-center gap-4 z-10">
              {/* Macintosh HD */}
              <div
                onClick={() => openInnerWindow('hd')}
                className="flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div className="w-10 h-10 bg-[#f7f5e8] border border-black shadow-md rounded-xs flex flex-col items-center justify-center p-1 group-hover:scale-105 transition-transform">
                  <HardDrive size={20} className="text-gray-800" />
                </div>
                <span className="bg-white/80 border border-black/40 px-1 py-0.2 rounded-xs text-[10px] font-bold text-black drop-shadow">
                  Macintosh HD
                </span>
              </div>

              {/* Siri AI Assistant */}
              <div
                onClick={() => openInnerWindow('siri')}
                className="flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 border border-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform animate-pulse">
                  <Sparkles size={20} className="text-white drop-shadow" />
                </div>
                <span className="bg-white/80 border border-black/40 px-1.5 py-0.2 rounded-xs text-[10px] font-bold text-purple-900 drop-shadow">
                  Siri AI
                </span>
              </div>

              {/* MacPaint */}
              <div
                onClick={() => openInnerWindow('paint')}
                className="flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div className="w-10 h-10 bg-[#f7f5e8] border border-black shadow-md rounded-xs flex flex-col items-center justify-center p-1 group-hover:scale-105 transition-transform">
                  <Palette size={20} className="text-purple-800" />
                </div>
                <span className="bg-white/80 border border-black/40 px-1 py-0.2 rounded-xs text-[10px] font-bold text-black drop-shadow">
                  MacPaint 1.0
                </span>
              </div>

              {/* SimpleText */}
              <div
                onClick={() => openInnerWindow('simpletext')}
                className="flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div className="w-10 h-10 bg-[#f7f5e8] border border-black shadow-md rounded-xs flex flex-col items-center justify-center p-1 group-hover:scale-105 transition-transform">
                  <FileText size={20} className="text-blue-800" />
                </div>
                <span className="bg-white/80 border border-black/40 px-1 py-0.2 rounded-xs text-[10px] font-bold text-black drop-shadow">
                  TeachText
                </span>
              </div>

              {/* MacinTalk Speech */}
              <div
                onClick={() => openInnerWindow('speech')}
                className="flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div className="w-10 h-10 bg-[#f7f5e8] border border-black shadow-md rounded-xs flex flex-col items-center justify-center p-1 group-hover:scale-105 transition-transform">
                  <Volume2 size={20} className="text-green-800" />
                </div>
                <span className="bg-white/80 border border-black/40 px-1 py-0.2 rounded-xs text-[10px] font-bold text-black drop-shadow">
                  Mac Speech
                </span>
              </div>
            </div>

            {/* Trash Can in Bottom-Right */}
            <div
              onClick={emptyTrash}
              title="Click to Empty Trash"
              className="absolute bottom-4 right-4 flex flex-col items-center gap-1 cursor-pointer group z-10"
            >
              <div className="w-10 h-11 bg-[#f7f5e8] border border-black shadow-md rounded-xs flex flex-col items-center justify-center p-1 group-hover:scale-110 transition-transform">
                <Trash2 size={22} className={trashCount > 0 ? 'text-black font-bold' : 'text-gray-400'} />
              </div>
              <span className="bg-white/80 border border-black/40 px-1 py-0.2 rounded-xs text-[10px] font-bold text-black drop-shadow">
                Trash {trashCount > 0 ? `(${trashCount})` : '(Empty)'}
              </span>
            </div>

            {/* 0. SIRI AI ASSISTANT WINDOW */}
            {getWindow('siri').isOpen && (
              <div
                onClick={() => focusInnerWindow('siri')}
                className="absolute bg-[#1c1924] text-white border-2 border-purple-500 shadow-2xl rounded-lg flex flex-col overflow-hidden"
                style={{
                  left: `${getWindow('siri').x}px`,
                  top: `${getWindow('siri').y}px`,
                  width: `${getWindow('siri').width}px`,
                  height: `${getWindow('siri').height}px`,
                  zIndex: getWindow('siri').zIndex,
                }}
              >
                {/* Siri Header */}
                <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-purple-900 border-b border-purple-800/80 px-3 py-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeInnerWindow('siri');
                      }}
                      className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-[8px] text-black font-bold"
                    >
                      ✕
                    </button>
                    <span className="font-bold text-xs text-purple-200 flex items-center gap-1">
                      <Sparkles size={12} className="text-purple-400" />
                      <span>Siri (Cupertino AI)</span>
                    </span>
                  </div>

                  {/* Pulsing Siri Glowing Orb */}
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-400 via-pink-500 to-purple-500 animate-pulse shadow-md" />
                </div>

                {/* Conversation Body */}
                <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
                  {siriMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 shadow leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-br-xs'
                            : 'bg-[#2a2438] border border-purple-800/60 text-purple-100 rounded-bl-xs'
                        }`}
                      >
                        {msg.sender === 'siri' && (
                          <div className="text-[9px] font-bold text-purple-400 mb-0.5 flex items-center gap-1">
                            <span>Siri</span>
                            <span>·</span>
                            <span>{msg.time}</span>
                          </div>
                        )}
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))}

                  {/* Siri Thinking Visualizer */}
                  {isSiriThinking && (
                    <div className="flex items-center gap-2 p-2 bg-[#2a2438] rounded-xl border border-purple-800/50 max-w-xs animate-pulse">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 animate-spin" />
                      <span className="text-[11px] text-purple-300 font-mono">Consulting Cupertino servers...</span>
                    </div>
                  )}

                  <div ref={siriChatEndRef} />
                </div>

                {/* Quick Prompts Bar */}
                <div className="px-2 py-1 bg-[#15121e] border-t border-purple-900/60 flex items-center gap-1 overflow-x-auto text-[10px] whitespace-nowrap">
                  <span className="text-gray-400 text-[9px] font-mono">Ask:</span>
                  {[
                    "Why Mac OS inside Windows 98?",
                    "Do you know Clippy?",
                    "Steve Jobs vs Gates joke",
                    "Fix my life",
                    "Divide by zero"
                  ].map((p) => (
                    <button
                      key={p}
                      onClick={() => handleAskSiri(p)}
                      className="px-2 py-0.5 bg-[#251e33] hover:bg-purple-900/60 text-purple-200 rounded-full border border-purple-700/50 transition-colors"
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* Input Bar */}
                <div className="p-2 bg-[#181522] border-t border-purple-900 flex items-center gap-1.5">
                  <input
                    type="text"
                    value={siriQuery}
                    onChange={(e) => setSiriQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAskSiri();
                    }}
                    placeholder="Ask Siri anything..."
                    className="flex-1 bg-[#251e33] border border-purple-800 rounded-full px-3 py-1.5 text-xs text-white placeholder-gray-400 outline-hidden focus:border-cyan-400 font-sans"
                  />
                  <button
                    onClick={() => handleAskSiri()}
                    className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center shadow active:scale-95 transition-transform"
                    title="Send to Siri"
                  >
                    <Send size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* 1. SIMPLETEXT WINDOW */}
            {getWindow('simpletext').isOpen && (
              <div
                onClick={() => focusInnerWindow('simpletext')}
                className={`absolute bg-[#f5f4ed] border-2 border-black shadow-2xl rounded-xs flex flex-col ${
                  theme === 'macos9' ? 'border-[#333]' : ''
                }`}
                style={{
                  left: `${getWindow('simpletext').x}px`,
                  top: `${getWindow('simpletext').y}px`,
                  width: `${getWindow('simpletext').width}px`,
                  height: `${getWindow('simpletext').height}px`,
                  zIndex: getWindow('simpletext').zIndex,
                }}
              >
                <div className="bg-[#e4e2d8] border-b border-black px-2 py-1 flex items-center justify-between font-sans text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeInnerWindow('simpletext');
                      }}
                      className="w-3.5 h-3.5 border border-black bg-white flex items-center justify-center hover:bg-black/20"
                    >
                      <Square size={8} />
                    </button>
                    <span className="font-bold truncate text-[11px]">{getWindow('simpletext').title}</span>
                  </div>
                  <div className="w-3.5 h-3.5 border border-black bg-white flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-black" />
                  </div>
                </div>

                <div className="flex-1 p-2 flex flex-col">
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="flex-1 bg-white border border-black p-2 font-mono text-[11px] text-black outline-hidden resize-none leading-relaxed"
                  />
                  <div className="flex justify-between items-center text-[10px] text-gray-600 mt-1 font-mono">
                    <span>Font: Chicago 12pt</span>
                    <span>Steve Jobs Certified</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. MACPAINT WINDOW */}
            {getWindow('paint').isOpen && (
              <div
                onClick={() => focusInnerWindow('paint')}
                className="absolute bg-[#e8e6dc] border-2 border-black shadow-2xl rounded-xs flex flex-col"
                style={{
                  left: `${getWindow('paint').x}px`,
                  top: `${getWindow('paint').y}px`,
                  width: `${getWindow('paint').width}px`,
                  height: `${getWindow('paint').height}px`,
                  zIndex: getWindow('paint').zIndex,
                }}
              >
                <div className="bg-[#dcd9ce] border-b border-black px-2 py-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeInnerWindow('paint');
                      }}
                      className="w-3.5 h-3.5 border border-black bg-white flex items-center justify-center hover:bg-black/20"
                    >
                      <Square size={8} />
                    </button>
                    <span className="font-bold text-[11px]">MacPaint 1.0 (Bill Atkinson)</span>
                  </div>
                  <button onClick={clearCanvas} className="text-[10px] bg-white border border-black px-1.5 py-0.2">
                    Clear
                  </button>
                </div>

                <div className="flex-1 flex p-2 gap-2">
                  <div className="w-16 border border-black bg-white p-1 grid grid-cols-2 gap-1 content-start text-[10px]">
                    {[
                      { id: 'pencil', icon: '✏️', label: 'Pencil' },
                      { id: 'brush', icon: '🖌️', label: 'Brush' },
                      { id: 'spray', icon: '💨', label: 'Spray' },
                      { id: 'eraser', icon: '⬜', label: 'Eraser' },
                    ].map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => {
                          sounds.playClick();
                          setPaintTool(tool.id as any);
                        }}
                        className={`p-1 border flex flex-col items-center justify-center ${
                          paintTool === tool.id ? 'bg-black text-white border-black font-bold' : 'border-gray-400 bg-gray-50'
                        }`}
                        title={tool.label}
                      >
                        <span className="text-sm">{tool.icon}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 border-2 border-black bg-white overflow-hidden flex items-center justify-center">
                    <canvas
                      ref={canvasRef}
                      width={280}
                      height={190}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className="cursor-crosshair bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. MACINTALK SPEECH SYNTHESIZER */}
            {getWindow('speech').isOpen && (
              <div
                onClick={() => focusInnerWindow('speech')}
                className="absolute bg-[#e8e6dc] border-2 border-black shadow-2xl rounded-xs flex flex-col"
                style={{
                  left: `${getWindow('speech').x}px`,
                  top: `${getWindow('speech').y}px`,
                  width: `${getWindow('speech').width}px`,
                  height: `${getWindow('speech').height}px`,
                  zIndex: getWindow('speech').zIndex,
                }}
              >
                <div className="bg-[#dcd9ce] border-b border-black px-2 py-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeInnerWindow('speech');
                      }}
                      className="w-3.5 h-3.5 border border-black bg-white flex items-center justify-center"
                    >
                      <Square size={8} />
                    </button>
                    <span className="font-bold text-[11px]">MacinTalk 3.0 Speech</span>
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <label className="font-bold block mb-1">Text to Speak:</label>
                    <input
                      type="text"
                      value={speechText}
                      onChange={(e) => setSpeechText(e.target.value)}
                      className="w-full bg-white border border-black px-2 py-1 text-xs mb-2 font-mono"
                    />

                    <label className="font-bold block mb-1">Mac Voice Persona:</label>
                    <select
                      value={selectedVoice}
                      onChange={(e) => setSelectedVoice(e.target.value)}
                      className="w-full bg-white border border-black px-2 py-1 text-xs font-mono mb-3"
                    >
                      <option value="siri">Siri (Cupertino AI Tone)</option>
                      <option value="clippy">Victoria (Classic Mac OS Default)</option>
                      <option value="dr_bsod">Zarvox (Robotic PowerBook)</option>
                      <option value="karen_sysadmin">Bad News (System Panic)</option>
                      <option value="defrag_guru">Whisper (Zen Apple Guru)</option>
                    </select>
                  </div>

                  <button
                    onClick={handleMacSpeak}
                    className="w-full py-2 bg-black text-white font-bold hover:bg-gray-800 flex items-center justify-center gap-2 rounded-xs shadow"
                  >
                    <Volume2 size={16} />
                    <span>Speak Through Mac Speaker</span>
                  </button>
                </div>
              </div>
            )}

            {/* 4. CALCULATOR */}
            {getWindow('calculator').isOpen && (
              <div
                onClick={() => focusInnerWindow('calculator')}
                className="absolute bg-[#e8e6dc] border-2 border-black shadow-2xl rounded-xs flex flex-col"
                style={{
                  left: `${getWindow('calculator').x}px`,
                  top: `${getWindow('calculator').y}px`,
                  width: `${getWindow('calculator').width}px`,
                  height: `${getWindow('calculator').height}px`,
                  zIndex: getWindow('calculator').zIndex,
                }}
              >
                <div className="bg-[#dcd9ce] border-b border-black px-2 py-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeInnerWindow('calculator');
                      }}
                      className="w-3.5 h-3.5 border border-black bg-white flex items-center justify-center"
                    >
                      <Square size={8} />
                    </button>
                    <span className="font-bold text-[11px]">Calculator</span>
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div className="bg-white border-2 border-black p-2 text-right font-mono text-lg font-bold overflow-hidden mb-3">
                    {calcDisplay}
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 font-bold font-mono">
                    {['C', '/', '*', '-', '7', '8', '9', '+', '4', '5', '6', '=', '1', '2', '3', '0'].map((btn) => (
                      <button
                        key={btn}
                        onClick={() => handleCalcBtn(btn)}
                        className={`p-2 border border-black text-center text-xs active:bg-black active:text-white rounded-xs shadow-xs ${
                          ['C', '=', '+', '-', '*', '/'].includes(btn) ? 'bg-[#d0cdc2]' : 'bg-white'
                        }`}
                      >
                        {btn}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. ABOUT THIS MACINTOSH */}
            {getWindow('about').isOpen && (
              <div
                onClick={() => focusInnerWindow('about')}
                className="absolute bg-[#eae8de] border-2 border-black shadow-2xl rounded-xs flex flex-col"
                style={{
                  left: `${getWindow('about').x}px`,
                  top: `${getWindow('about').y}px`,
                  width: `${getWindow('about').width}px`,
                  height: `${getWindow('about').height}px`,
                  zIndex: getWindow('about').zIndex,
                }}
              >
                <div className="bg-[#dcd9ce] border-b border-black px-2 py-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeInnerWindow('about');
                      }}
                      className="w-3.5 h-3.5 border border-black bg-white flex items-center justify-center"
                    >
                      <Square size={8} />
                    </button>
                    <span className="font-bold text-[11px]">About This Macintosh</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between text-xs">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">🍎</div>
                    <div>
                      <div className="font-extrabold text-sm text-black">System Software 7.5.3 (Siri Edition)</div>
                      <div className="text-[11px] text-gray-700">Apple Computer, Inc. 1983-1996</div>
                      <div className="text-[11px] text-gray-600 mt-1">Running Emulated on Windows 98</div>
                    </div>
                  </div>

                  <div className="bg-white border border-black p-2.5 rounded-xs space-y-2 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span>Built-in Memory:</span>
                      <span className="font-bold">16,384K</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Memory:</span>
                      <span className="font-bold">16,384K</span>
                    </div>
                    <div className="flex justify-between text-purple-900 font-bold">
                      <span>Siri Neural Engine:</span>
                      <span>1,024K</span>
                    </div>
                    <div className="flex justify-between text-blue-900 font-bold">
                      <span>Largest Unused Block:</span>
                      <span>11,240K</span>
                    </div>
                  </div>

                  <div className="text-center text-[10px] text-gray-500">
                    "Steve Jobs sends his sincere condolences to your Windows registry."
                  </div>
                </div>
              </div>
            )}

            {/* 6. CONTROL PANEL: PATTERNS */}
            {getWindow('patterns').isOpen && (
              <div
                onClick={() => focusInnerWindow('patterns')}
                className="absolute bg-[#eae8de] border-2 border-black shadow-2xl rounded-xs flex flex-col"
                style={{
                  left: `${getWindow('patterns').x}px`,
                  top: `${getWindow('patterns').y}px`,
                  width: `${getWindow('patterns').width}px`,
                  height: `${getWindow('patterns').height}px`,
                  zIndex: getWindow('patterns').zIndex,
                }}
              >
                <div className="bg-[#dcd9ce] border-b border-black px-2 py-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeInnerWindow('patterns');
                      }}
                      className="w-3.5 h-3.5 border border-black bg-white flex items-center justify-center"
                    >
                      <Square size={8} />
                    </button>
                    <span className="font-bold text-[11px]">Desktop Patterns</span>
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between text-xs">
                  <div className="space-y-1.5">
                    {DESKTOP_PATTERNS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          sounds.playClick();
                          setSelectedPattern(p.id);
                        }}
                        className={`w-full p-2 border flex items-center justify-between text-left rounded-xs ${
                          selectedPattern === p.id ? 'bg-black text-white border-black font-bold' : 'bg-white border-gray-400'
                        }`}
                      >
                        <span>{p.name}</span>
                        <div className={`w-5 h-5 border border-black ${p.bg}`} />
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => closeInnerWindow('patterns')}
                    className="w-full py-1.5 bg-[#dcd9ce] border border-black font-bold hover:bg-white"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* 7. SYSTEM BOMB ERROR DIALOG */}
            {getWindow('bomb').isOpen && (
              <div
                onClick={() => focusInnerWindow('bomb')}
                className="absolute bg-[#fff] border-4 border-black shadow-2xl rounded-xs flex flex-col p-4 text-center z-50"
                style={{
                  left: `${getWindow('bomb').x}px`,
                  top: `${getWindow('bomb').y}px`,
                  width: `${getWindow('bomb').width}px`,
                  height: `${getWindow('bomb').height}px`,
                  zIndex: 999,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">💣</span>
                  <div className="text-left">
                    <div className="font-extrabold text-sm">Sorry, a system error occurred.</div>
                    <div className="text-[11px] text-gray-700 font-mono mt-0.5">
                      "Unimplemented trap: ID = 02 (Procrastination Fault)"
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-auto">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      closeInnerWindow('bomb');
                    }}
                    className="px-4 py-1 border-2 border-black font-bold text-xs bg-[#e0ded6] hover:bg-black hover:text-white"
                  >
                    Resume
                  </button>
                  <button
                    onClick={startBoot}
                    className="px-4 py-1 border-2 border-black font-bold text-xs bg-black text-white hover:bg-gray-800"
                  >
                    Restart
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* AQUA DOCK AT BOTTOM (When theme === 'aqua') */}
          {theme === 'aqua' && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/40 backdrop-blur-md border border-white/60 px-3 py-1.5 rounded-2xl flex items-center gap-3 shadow-2xl z-40">
              <button
                onClick={() => openInnerWindow('hd')}
                className="hover:scale-125 transition-transform flex flex-col items-center"
                title="Finder"
              >
                <span className="text-2xl">📁</span>
              </button>
              <button
                onClick={() => openInnerWindow('siri')}
                className="hover:scale-125 transition-transform flex flex-col items-center"
                title="Siri"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-cyan-400 flex items-center justify-center shadow">
                  <Sparkles size={16} className="text-white" />
                </div>
              </button>
              <button
                onClick={() => openInnerWindow('simpletext')}
                className="hover:scale-125 transition-transform flex flex-col items-center"
                title="SimpleText"
              >
                <span className="text-2xl">📝</span>
              </button>
              <button
                onClick={() => openInnerWindow('paint')}
                className="hover:scale-125 transition-transform flex flex-col items-center"
                title="MacPaint"
              >
                <span className="text-2xl">🎨</span>
              </button>
              <button
                onClick={() => openInnerWindow('calculator')}
                className="hover:scale-125 transition-transform flex flex-col items-center"
                title="Calculator"
              >
                <span className="text-2xl">🔢</span>
              </button>
              <button
                onClick={() => openInnerWindow('speech')}
                className="hover:scale-125 transition-transform flex flex-col items-center"
                title="Speech"
              >
                <span className="text-2xl">🗣️</span>
              </button>
              <div className="w-[1px] h-6 bg-black/20 mx-1" />
              <button
                onClick={emptyTrash}
                className="hover:scale-125 transition-transform flex flex-col items-center"
                title="Trash"
              >
                <span className="text-2xl">🗑️</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
