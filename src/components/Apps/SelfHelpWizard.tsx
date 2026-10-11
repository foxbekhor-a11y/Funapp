import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Award, 
  AlertTriangle, 
  Cpu, 
  ShieldAlert,
  Terminal,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { PersonaId, PersonaInfo, ChatMessage, ConsultationResponse } from '../../types/windows';
import { sounds } from '../../utils/soundEffects';

interface SelfHelpWizardProps {
  onOpenCertificate: (problemText: string) => void;
  onRoastDelivered: () => void;
  activePersona: PersonaId;
  setActivePersona: (id: PersonaId) => void;
}

const PERSONAS: PersonaInfo[] = [
  {
    id: 'clippy',
    name: 'Clippy 98',
    title: 'Unlicensed Office Assistant',
    description: 'Passive-aggressive, patronizing, compares you to blank Word templates.',
    avatarIcon: '📎',
    themeColor: '#000080',
  },
  {
    id: 'dr_bsod',
    name: 'Dr. BSOD',
    title: 'Kernel Panic Psychiatrist',
    description: 'Diagnoses your life as fatal memory leaks and IRQ hardware conflicts.',
    avatarIcon: '💻',
    themeColor: '#0000aa',
  },
  {
    id: 'karen_sysadmin',
    name: 'SysAdmin Karen',
    title: 'Level 3 Helpdesk Cynic',
    description: 'Exasperated, tired of user errors, closes your emotional tickets as PEBCAK.',
    avatarIcon: '🎟️',
    themeColor: '#800000',
  },
  {
    id: 'defrag_guru',
    name: 'Defrag Guru',
    title: 'Mind Fragmentation Doctor',
    description: 'Calculates the thousands of wasted sectors scattered across your life.',
    avatarIcon: '💾',
    themeColor: '#008080',
  },
];

const QUICK_DILEMMAS = [
  "I've been procrastinating for 3 weeks and deadlines are tomorrow.",
  "I'm 28 and have no idea what I'm doing with my life.",
  "They left me on read 4 days ago. Should I text again?",
  "I pay $80/month for a gym membership I haven't visited since 2024.",
  "I bought a self-help book and used it as a coaster.",
  "I'm terrified that everyone will realize I'm faking competence."
];

export const SelfHelpWizard: React.FC<SelfHelpWizardProps> = ({
  onOpenCertificate,
  onRoastDelivered,
  activePersona,
  setActivePersona,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Welcome to the Windows 98 Emotional Troubleshooter! I am your AI diagnostic counselor. Tell me what is wrong with your life, career, or relationships, and I will explain in agonizing technical detail why it's entirely your own fault.",
      timestamp: 'SYSTEM STARTUP',
      diagnosis: 'SYSTEM_BOOT_NORMAL: DELUSIONS_ACTIVE (0x00000000)',
      unhelpfulAdvice: [
        "Do not expect gentle validation; this is Windows 98, not a spa.",
        "Have your credit card ready to pay for repairs that will never work."
      ],
      severity: 'MILD_DISAPPOINTMENT',
      thought: 'Another user attempting to upgrade their personality on insufficient RAM.',
      persona: 'clippy'
    }
  ]);

  const [input, setInput] = useState('');
  const [tone, setTone] = useState<'mild' | 'brutal' | 'savage'>('brutal');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input.trim();
    if (!textToSend || isLoading) return;

    sounds.playClick();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          persona: activePersona,
          tone,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data: ConsultationResponse = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.roast,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        diagnosis: data.systemDiagnosis,
        unhelpfulAdvice: data.unhelpfulAdvice,
        severity: data.emotionalSeverity,
        thought: data.clippyThought,
        persona: activePersona,
      };

      setMessages((prev) => [...prev, aiMsg]);
      sounds.playError();
      sounds.speak(data.roast, activePersona);
      onRoastDelivered();
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: "Error 404: Dignity Not Found. Your dilemma is so deeply ordinary that even our 56kbps dial-up server refuse to buffer your excuses.",
        timestamp: 'DIAGNOSTIC FAILED',
        diagnosis: 'CRITICAL_FAIL: USER_DELUSION_OVERFLOW',
        unhelpfulAdvice: ["Restart your life in Safe Mode", "Clear all browser history of poor choices"],
        persona: activePersona
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      sounds.playError();
    } finally {
      setIsLoading(false);
    }
  };

  const currentPersona = PERSONAS.find(p => p.id === activePersona) || PERSONAS[0];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    sounds.playDing();
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-win98 text-xs select-text">
      {/* Top Banner & Specialist Selector */}
      <div className="bg-[#c0c0c0] p-1.5 win98-raised mb-1.5">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#808080] mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentPersona.avatarIcon}</span>
            <div>
              <div className="font-bold text-sm tracking-tight text-[#000080]">
                {currentPersona.name} - {currentPersona.title}
              </div>
              <div className="text-[11px] text-gray-700">
                {currentPersona.description}
              </div>
            </div>
          </div>

          {/* Tone Selector */}
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <span className="text-[10px] text-gray-600 font-semibold">Toxicity:</span>
            <div className="flex bg-[#d4d4d4] win98-sunken p-0.5">
              {(['mild', 'brutal', 'savage'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    sounds.playClick();
                    setTone(t);
                  }}
                  className={`px-1.5 py-0.5 text-[10px] capitalize font-medium ${
                    tone === t ? 'win98-raised bg-[#c0c0c0] font-bold text-black' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Persona Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {PERSONAS.map((p) => {
            const isSelected = p.id === activePersona;
            return (
              <button
                key={p.id}
                onClick={() => {
                  sounds.playClick();
                  setActivePersona(p.id);
                }}
                className={`px-2.5 py-1 flex items-center gap-1.5 transition-none text-xs ${
                  isSelected
                    ? 'win98-sunken bg-white font-bold border-b-0 -mb-[2px] z-10'
                    : 'win98-raised bg-[#d4d4d4] hover:bg-[#e0e0e0]'
                }`}
              >
                <span>{p.avatarIcon}</span>
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Viewport (Sunken Listbox) */}
      <div className="flex-1 bg-white win98-sunken p-2.5 overflow-y-auto min-h-[220px] space-y-3 font-win98">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              {/* Header meta */}
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-0.5 px-1">
                <span>{isUser ? '👤 You (Victim)' : `🤖 ${PERSONAS.find(p => p.id === msg.persona)?.name || 'Troubleshooter'}`}</span>
                <span>·</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Body */}
              <div
                className={`max-w-[88%] p-2.5 rounded-[2px] shadow-sm text-xs leading-relaxed ${
                  isUser
                    ? 'bg-[#e8f0fe] border border-[#a0c0e8] text-black win98-raised'
                    : 'bg-[#ffffdf] border border-[#d0c890] text-black win98-raised'
                }`}
              >
                {/* AI Diagnostic Header Badge */}
                {!isUser && msg.diagnosis && (
                  <div className="mb-2 p-1.5 bg-[#000080] text-white font-retro-mono text-[11px] flex items-center justify-between">
                    <div className="flex items-center gap-1 truncate">
                      <Terminal size={12} className="text-yellow-300 shrink-0" />
                      <span className="truncate">{msg.diagnosis}</span>
                    </div>
                    {msg.severity && (
                      <span className="text-[9px] uppercase px-1 bg-red-700 text-yellow-200 font-bold shrink-0 ml-1">
                        {msg.severity.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                )}

                {/* Primary Content / Roast */}
                <p className="text-xs font-normal leading-normal whitespace-pre-wrap">
                  {msg.content}
                </p>

                {/* Unhelpful Advice List */}
                {!isUser && msg.unhelpfulAdvice && msg.unhelpfulAdvice.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-amber-300/80 text-[11px]">
                    <div className="font-bold text-[#800000] flex items-center gap-1 mb-1">
                      <AlertTriangle size={12} />
                      <span>Standard Unhelpful Resolutions:</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5 text-gray-800">
                      {msg.unhelpfulAdvice.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Clippy Thought / Sarcastic whisper */}
                {!isUser && msg.thought && (
                  <div className="mt-2 text-[10px] italic text-gray-600 bg-amber-50 p-1 border-l-2 border-amber-400">
                    💭 <em>"{msg.thought}"</em>
                  </div>
                )}

                {/* Actions (Hear, Copy, Certificate) */}
                {!isUser && (
                  <div className="mt-2 pt-1 border-t border-gray-300 flex items-center justify-end gap-2 text-[10px]">
                    <button
                      onClick={() => sounds.speak(msg.content, msg.persona || activePersona)}
                      className="flex items-center gap-1 text-gray-700 hover:text-black hover:underline"
                      title="Read aloud in retro voice"
                    >
                      <Volume2 size={12} />
                      <span>Hear Roast</span>
                    </button>
                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="flex items-center gap-1 text-gray-700 hover:text-black hover:underline"
                    >
                      {copiedId === msg.id ? <Check size={12} className="text-green-700" /> : <Copy size={12} />}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onOpenCertificate(msg.content);
                      }}
                      className="flex items-center gap-1 text-amber-900 font-bold hover:underline"
                      title="Generate official printable certificate of failure for this issue"
                    >
                      <Award size={12} />
                      <span>Print Failure Proof</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading dialup indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-blue-900 p-2 bg-blue-50 border border-blue-200 win98-sunken">
            <div className="animate-spin text-lg">⏳</div>
            <div>
              <span className="font-bold">Analyzing your excuses over 56kbps dial-up...</span>
              <span className="text-[10px] block text-gray-600">Checking C:\SelfPity\Registry.dat for severe deficiencies...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Dilemma Starters */}
      <div className="bg-[#c0c0c0] p-1.5 border-t border-[#808080]">
        <div className="text-[10px] text-gray-700 font-semibold mb-1 flex items-center gap-1">
          <HelpCircle size={11} />
          <span>Quick Life Dilemma Starters (Click to Submit):</span>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {QUICK_DILEMMAS.map((dilemma, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => handleSend(dilemma)}
              className="win98-raised win98-btn px-2 py-0.5 bg-[#e0e0e0] hover:bg-[#ffffff] text-[10px] text-gray-900 whitespace-nowrap shrink-0 disabled:opacity-50"
            >
              "{dilemma.slice(0, 36)}..."
            </button>
          ))}
        </div>
      </div>

      {/* Input Box & Buttons */}
      <div className="bg-[#c0c0c0] p-2 win98-raised border-t-2 border-white flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={isLoading}
          placeholder="Confess your life failure, procrastination, or existential dread here..."
          className="flex-1 px-2 py-1.5 bg-white win98-sunken text-xs font-win98 outline-none text-black placeholder:text-gray-500 disabled:bg-gray-100"
        />

        <button
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          className="h-8 px-3 bg-[#c0c0c0] win98-raised win98-btn font-bold flex items-center gap-1.5 text-xs hover:bg-[#d4d4d4] active:bg-[#a0a0a0] disabled:opacity-50 text-black shrink-0"
        >
          <Send size={13} />
          <span>Diagnose Me</span>
        </button>

        <button
          onClick={() => {
            sounds.playTrash();
            setMessages([messages[0]]);
          }}
          title="Clear session history"
          className="h-8 px-2 bg-[#c0c0c0] win98-raised win98-btn flex items-center justify-center text-red-800 hover:bg-[#d4d4d4] shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};
