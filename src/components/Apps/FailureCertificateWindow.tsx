import React, { useState, useEffect } from 'react';
import { Award, Printer, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import { CertificateData } from '../../types/windows';
import { sounds } from '../../utils/soundEffects';

interface FailureCertificateWindowProps {
  initialProblem?: string;
}

export const FailureCertificateWindow: React.FC<FailureCertificateWindowProps> = ({ initialProblem }) => {
  const [userName, setUserName] = useState('Valued Underachiever');
  const [issue, setIssue] = useState(initialProblem || 'Chronic Procrastination and Excessive Excuses');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [certificate, setCertificate] = useState<CertificateData>({
    title: 'OFFICIAL CERTIFICATE OF PARTICIPATION IN EXISTENCE',
    recipient: 'Valued Underachiever',
    awardedFor: 'Outstanding dedication to postponing essential life tasks until irreversible regret occurs',
    citation: 'This document formally certifies that the named individual has demonstrated remarkable consistency in dodging accountability, overthinking minor obstacles, and attributing failures to Mercury in retrograde.',
    grade: 'F- (Sub-Par Performance)',
    serialNumber: 'WIN98-FAIL-774920-SE',
  });

  useEffect(() => {
    if (initialProblem) {
      setIssue(initialProblem);
      generateCertificate(initialProblem);
    }
  }, [initialProblem]);

  const generateCertificate = async (customIssue?: string) => {
    setIsGenerating(true);
    sounds.playClick();
    try {
      const response = await fetch('/api/certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: userName.trim() || 'Valued Slacker',
          mainIssue: customIssue || issue.trim() || 'General Incompetence',
        }),
      });
      const data: CertificateData = await response.json();
      setCertificate(data);
      sounds.playDing();
    } catch (err) {
      sounds.playError();
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCertificateText = () => {
    const text = `================================================
${certificate.title}
Awarded to: ${certificate.recipient}
For: ${certificate.awardedFor}
Citation: ${certificate.citation}
Official Rating: ${certificate.grade}
Serial Number: ${certificate.serialNumber}
Authorized by: Clippy 98 & The Windows Emotional Troubleshooter
================================================`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    sounds.playDing();
    setTimeout(() => setCopied(false), 2000);
  };

  const printCertificate = () => {
    sounds.playClick();
    window.print();
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-win98 text-xs p-2 select-none overflow-y-auto">
      {/* Form Controls */}
      <div className="bg-[#c0c0c0] win98-raised p-2 mb-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-black">
        <div>
          <label className="block font-semibold mb-1 text-[11px]">Recipient Name:</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-2 py-1 bg-white win98-sunken text-xs font-win98 outline-none text-black"
            placeholder="Your name or alias"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-[11px]">Specific Life Blunder / Dilemma:</label>
          <input
            type="text"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            className="w-full px-2 py-1 bg-white win98-sunken text-xs font-win98 outline-none text-black"
            placeholder="e.g. Spent 4 hours reorganizing desktop icons"
          />
        </div>
        <div className="md:col-span-2 flex items-center justify-end gap-2 mt-1">
          <button
            onClick={() => generateCertificate()}
            disabled={isGenerating}
            className="px-4 py-1.5 bg-[#c0c0c0] win98-raised win98-btn font-bold flex items-center gap-1.5 hover:bg-[#d4d4d4] active:bg-[#a0a0a0] text-black disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} className="text-amber-800" />}
            <span>{isGenerating ? "Forging Official Seal..." : "Generate AI Failure Proof"}</span>
          </button>
        </div>
      </div>

      {/* Certificate Display (Authentic Retro Parchment Document) */}
      <div className="flex-1 bg-[#fffdf0] border-4 border-double border-[#800000] p-6 shadow-inner relative flex flex-col items-center justify-between text-center font-serif text-black select-text my-1 min-h-[360px]">
        {/* Decorative corner flourishes */}
        <div className="absolute top-1 left-1 text-[#800000] text-xs font-bold font-mono">╔═ WIN98 ═╗</div>
        <div className="absolute top-1 right-1 text-[#800000] text-xs font-bold font-mono">╚═ AUTHENTIC ═╝</div>
        <div className="absolute bottom-1 left-1 text-[#800000] text-xs font-bold font-mono">║ OFFICIAL ║</div>
        <div className="absolute bottom-1 right-1 text-[#800000] text-xs font-bold font-mono">║ LICENSED ║</div>

        {/* Diagonal "INADEQUATE" Rubber Stamp */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-4 border-red-700/60 text-red-700/60 font-black text-3xl md:text-5xl tracking-widest px-4 py-2 pointer-events-none uppercase font-mono">
          INADEQUATE
        </div>

        {/* Header */}
        <div className="space-y-1">
          <div className="text-[10px] tracking-widest text-gray-500 uppercase font-mono">
            Microsoft Windows 98 Official Department of Coping
          </div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-[#800000] uppercase font-serif">
            {certificate.title}
          </h2>
          <div className="h-[2px] w-32 bg-[#800000] mx-auto my-1" />
        </div>

        {/* Body Recipient */}
        <div className="my-3 space-y-1">
          <div className="text-xs italic text-gray-600">This solemn certificate is reluctantly conferred upon:</div>
          <div className="text-2xl font-bold font-serif text-[#000080] underline decoration-double decoration-amber-600">
            {certificate.recipient}
          </div>
        </div>

        {/* Citation & Reason */}
        <div className="max-w-lg space-y-2 my-2">
          <div className="text-xs font-semibold text-gray-800">
            For: <span className="font-serif italic font-normal text-red-900">"{certificate.awardedFor}"</span>
          </div>
          <p className="text-xs leading-relaxed text-gray-700 font-serif italic px-4">
            "{certificate.citation}"
          </p>
        </div>

        {/* Footer Rating & Signatures */}
        <div className="w-full pt-4 border-t border-gray-300 flex items-end justify-between text-left text-xs font-mono">
          <div>
            <div className="text-[10px] text-gray-500">OFFICIAL RATING:</div>
            <div className="font-bold text-red-800 text-sm">{certificate.grade}</div>
            <div className="text-[9px] text-gray-500">SERIAL: {certificate.serialNumber}</div>
          </div>

          {/* Microsoft Windows 98 Seal */}
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-700 flex flex-col items-center justify-center text-[8px] font-bold text-amber-900 bg-amber-50 shadow-sm rotate-6">
            <span>OFFICIAL</span>
            <span className="text-xs">📎</span>
            <span>CLIPPY CERT</span>
          </div>

          <div className="text-right">
            <div className="font-serif italic text-xs underline decoration-wavy decoration-blue-600">
              Clippy the Paperclip
            </div>
            <div className="text-[9px] text-gray-500">Chief Demotivator, Windows 98</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#808080]">
        <button
          onClick={copyCertificateText}
          className="px-3 py-1.5 bg-[#c0c0c0] win98-raised win98-btn flex items-center gap-1.5 text-xs hover:bg-[#d4d4d4] text-black font-semibold"
        >
          {copied ? <Check size={13} className="text-green-800" /> : <Copy size={13} />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Citation Text'}</span>
        </button>

        <button
          onClick={printCertificate}
          className="px-3 py-1.5 bg-[#c0c0c0] win98-raised win98-btn flex items-center gap-1.5 text-xs hover:bg-[#d4d4d4] text-black font-bold"
        >
          <Printer size={13} />
          <span>Print Certificate</span>
        </button>
      </div>
    </div>
  );
};
