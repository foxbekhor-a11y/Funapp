import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Volume2, Sparkles, RefreshCw, MessageSquare, ChevronUp, ChevronDown } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface ClippyCompanionProps {
  onTalkToClippy: () => void;
  onRoastDelivered: () => void;
}

type ClippyMood = 'smug' | 'judgmental' | 'laughing' | 'disappointed';

export const ClippyCompanion: React.FC<ClippyCompanionProps> = ({ onTalkToClippy, onRoastDelivered }) => {
  const [bubbleText, setBubbleText] = useState<string>(
    "It looks like you're trying to achieve something today! Would you like me to lower your expectations by 90% or should I just close all your open tabs to spare your RAM?"
  );
  const [thoughtText, setThoughtText] = useState<string>("Even my paperclip wire has more spine than your work ethic.");
  const [mood, setMood] = useState<ClippyMood>('smug');
  const [showBubble, setShowBubble] = useState<boolean>(true);
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  const [isTapGlass, setIsTapGlass] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Position state for dragging Clippy
  const [position, setPosition] = useState({ x: 0, y: 0 }); // offset from bottom-right
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = dragRef.current.startX - e.clientX;
      const dy = dragRef.current.startY - e.clientY;
      setPosition({
        x: Math.max(-window.innerWidth + 350, Math.min(window.innerWidth - 100, dragRef.current.initialX + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 200, dragRef.current.initialY + dy)),
      });
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
  }, [isDragging]);

  // Periodic blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4500);
    return () => clearInterval(blinkInterval);
  }, []);

  // Ask Gemini Clippy
  const askClippyGemini = async (customPrompt?: string) => {
    const textToAsk = customPrompt !== undefined ? customPrompt : userInput.trim();
    setIsLoading(true);
    setIsTapGlass(true);
    setTimeout(() => setIsTapGlass(false), 500);
    sounds.playClick();

    try {
      const response = await fetch('/api/clippy-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToAsk }),
      });

      const data = await response.json();
      setBubbleText(data.speech);
      if (data.thought) setThoughtText(data.thought);
      if (data.mood) setMood(data.mood);
      setShowBubble(true);
      sounds.playDing();
      sounds.speak(data.speech, 'clippy');
      onRoastDelivered();
      if (!customPrompt) setUserInput('');
    } catch (err) {
      setBubbleText("It looks like your internet connection is as unreliable as your 5-year career plan.");
      setThoughtText("Offline mode: User failure still detectable.");
      setMood('judgmental');
      sounds.playError();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClippyClick = () => {
    if (!showBubble) {
      setShowBubble(true);
      sounds.playDing();
    } else {
      askClippyGemini(''); // Trigger instant Gemini roast
    }
  };

  return (
    <div 
      className="fixed z-[8000] flex flex-col items-end pointer-events-auto select-none font-win98"
      style={{
        bottom: `${48 + position.y}px`,
        right: `${24 + position.x}px`,
      }}
    >
      {/* Interactive Speech & Roast Bubble */}
      {showBubble && (
        <div className="relative mb-2 w-80 md:w-88 bg-[#ffffcc] text-black win98-raised border-2 border-black p-2.5 rounded-[4px] shadow-2xl animate-fade-in text-xs leading-relaxed">
          {/* Header Controls */}
          <div className="flex items-center justify-between border-b border-amber-300 pb-1 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#000080] text-[11px] flex items-center gap-1">
                <span>📎 Clippy 98</span>
                <span className="bg-[#000080] text-yellow-300 px-1 py-0.2 text-[9px] rounded-none font-mono">
                  GEMINI AI
                </span>
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse prompts" : "Expand prompts"}
                className="w-4 h-4 bg-[#c0c0c0] win98-raised flex items-center justify-center hover:bg-gray-200"
              >
                {isExpanded ? <ChevronDown size={11} /> : <ChevronUp size={11} />}
              </button>
              <button
                onClick={() => setShowBubble(false)}
                className="w-4 h-4 bg-[#c0c0c0] win98-raised flex items-center justify-center hover:bg-red-200"
              >
                <X size={10} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* Speech Text */}
          {isLoading ? (
            <div className="py-3 flex items-center justify-center gap-2 text-blue-900 font-bold text-xs animate-pulse">
              <span>⏳</span>
              <span>Gemini Clippy is formulating your roast...</span>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-900 leading-snug font-medium select-text">
                {bubbleText}
              </p>

              {thoughtText && (
                <div className="mt-1.5 text-[10px] italic text-gray-600 bg-amber-100/60 p-1 border-l-2 border-amber-400 select-text">
                  💭 <em>"{thoughtText}"</em>
                </div>
              )}
            </>
          )}

          {/* Quick Dilemma prompts when expanded */}
          {isExpanded && !isLoading && (
            <div className="mt-2 pt-1.5 border-t border-amber-300/80 space-y-1">
              <div className="text-[10px] text-gray-700 font-bold">Ask Gemini Clippy:</div>
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                <button
                  onClick={() => askClippyGemini("Why am I always procrastinating on my real goals?")}
                  className="p-1 text-left bg-white/80 hover:bg-white win98-raised-sm truncate"
                >
                  🛋️ Why am I so lazy?
                </button>
                <button
                  onClick={() => askClippyGemini("My ex hasn't texted me back in 5 days. Should I double text?")}
                  className="p-1 text-left bg-white/80 hover:bg-white win98-raised-sm truncate"
                >
                  💔 Romance dilemma
                </button>
                <button
                  onClick={() => askClippyGemini("I have $14 in my bank account and just bought sushi.")}
                  className="p-1 text-left bg-white/80 hover:bg-white win98-raised-sm truncate"
                >
                  💸 Financial stupidity
                </button>
                <button
                  onClick={() => askClippyGemini("Roast my entire generation and our life choices.")}
                  className="p-1 text-left bg-white/80 hover:bg-white win98-raised-sm truncate"
                >
                  🔥 Maximum Generation Roast
                </button>
              </div>
            </div>
          )}

          {/* User Input to talk to Clippy */}
          <div className="mt-2 pt-1.5 border-t border-amber-300 flex items-center gap-1">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') askClippyGemini();
              }}
              disabled={isLoading}
              placeholder="Tell Clippy your problem / Ask for insult..."
              className="flex-1 px-1.5 py-1 bg-white win98-sunken text-xs outline-none text-black placeholder:text-gray-500 disabled:bg-gray-100"
            />
            <button
              onClick={() => askClippyGemini()}
              disabled={isLoading || !userInput.trim()}
              title="Send to Clippy Gemini"
              className="p-1 bg-[#c0c0c0] win98-raised win98-btn flex items-center justify-center text-blue-900 disabled:opacity-40"
            >
              <Send size={12} />
            </button>
          </div>

          {/* Action Row */}
          <div className="mt-2 pt-1 border-t border-amber-300 flex items-center justify-between text-[10px]">
            <button
              onClick={() => askClippyGemini('')}
              disabled={isLoading}
              className="font-bold text-red-900 hover:underline flex items-center gap-1"
            >
              <Sparkles size={11} className="text-amber-800" />
              <span>⚡ Insult Me With Gemini!</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => sounds.speak(bubbleText, 'clippy')}
                title="Read aloud"
                className="text-gray-700 hover:text-black p-0.5"
              >
                <Volume2 size={12} />
              </button>
              <button
                onClick={onTalkToClippy}
                className="text-blue-800 hover:underline font-semibold"
              >
                Full Clinic →
              </button>
            </div>
          </div>

          {/* Speech bubble beak */}
          <div className="absolute -bottom-2 right-8 w-3 h-3 bg-[#ffffcc] border-b-2 border-r-2 border-black rotate-45 transform origin-top-left" />
        </div>
      )}

      {/* Draggable & Animated Clippy Mascot */}
      <div
        onMouseDown={handleMouseDown}
        onClick={handleClippyClick}
        title="Clippy (Powered by Gemini) - Drag to move or click to get roasted!"
        className={`cursor-grab active:cursor-grabbing transition-transform duration-150 hover:scale-110 active:scale-95 flex flex-col items-center select-none ${
          isTapGlass ? 'animate-bounce' : ''
        }`}
      >
        <div className="relative w-16 h-20 bg-transparent flex items-center justify-center filter drop-shadow-[0_6px_8px_rgba(0,0,0,0.5)]">
          {/* Dynamic SVG Paperclip reflecting Gemini moods */}
          <svg viewBox="0 0 100 120" className="w-full h-full">
            {/* Paperclip wire loops */}
            <path
              d="M 30,105 L 30,35 C 30,15 70,15 70,35 L 70,95 C 70,110 40,110 40,95 L 40,45 C 40,35 60,35 60,45 L 60,85"
              fill="none"
              stroke="#b0b8c0"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Metallic highlight */}
            <path
              d="M 32,105 L 32,35 C 32,18 68,18 68,35 L 68,95 C 68,107 42,107 42,95 L 42,45 C 42,37 58,37 58,45 L 58,85"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Sarcastic Eyebrows based on mood */}
            {mood === 'smug' && (
              <>
                <path d="M 38,42 Q 48,32 54,42" fill="none" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M 62,38 Q 72,46 78,39" fill="none" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
              </>
            )}
            {mood === 'judgmental' && (
              <>
                <path d="M 38,36 Q 48,42 54,40" fill="none" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M 62,40 Q 72,42 78,36" fill="none" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
              </>
            )}
            {mood === 'laughing' && (
              <>
                <path d="M 38,34 Q 48,30 54,36" fill="none" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M 62,36 Q 72,30 78,34" fill="none" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
              </>
            )}
            {mood === 'disappointed' && (
              <>
                <path d="M 38,44 Q 48,38 54,46" fill="none" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M 62,46 Q 72,38 78,44" fill="none" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
              </>
            )}

            {/* Left Eye */}
            <circle cx="46" cy="48" r="8" fill="#ffffff" stroke="#000000" strokeWidth="2.5" />
            {!isBlinking ? (
              <circle cx="48" cy="48" r="3.5" fill="#000000" />
            ) : (
              <line x1="40" y1="48" x2="52" y2="48" stroke="#000000" strokeWidth="2.5" />
            )}

            {/* Right Eye */}
            <circle cx="70" cy="46" r="7" fill="#ffffff" stroke="#000000" strokeWidth="2.5" />
            {!isBlinking ? (
              <circle cx="69" cy="47" r="3.2" fill="#000000" />
            ) : (
              <line x1="64" y1="46" x2="76" y2="46" stroke="#000000" strokeWidth="2.5" />
            )}

            {/* Mouth Expressions */}
            {mood === 'smug' && (
              <path d="M 52,62 Q 62,68 72,60" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            )}
            {mood === 'judgmental' && (
              <line x1="50" y1="64" x2="70" y2="64" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            )}
            {mood === 'laughing' && (
              <path d="M 48,60 Q 60,74 72,60 Z" fill="#990000" stroke="#000000" strokeWidth="2.5" />
            )}
            {mood === 'disappointed' && (
              <path d="M 52,66 Q 62,60 72,66" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            )}
          </svg>

          {/* Yellow Post-it Badge */}
          <div className="absolute -bottom-1 -left-2 bg-yellow-200 border border-yellow-500 text-[8px] font-bold px-1 rounded-sm shadow-sm rotate-6 text-black tracking-tight flex items-center gap-0.5">
            <span>GEMINI 98</span>
          </div>
        </div>
      </div>
    </div>
  );
};
