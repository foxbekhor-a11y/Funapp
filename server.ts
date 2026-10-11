import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const hasValidKey = !!apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 10;
let ai: GoogleGenAI | null = null;

if (hasValidKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback witty insults if offline or API key missing
const fallbackInsults: Record<string, Array<{ roast: string; systemDiagnosis: string; unhelpfulAdvice: string[]; emotionalSeverity: string; clippyThought: string }>> = {
  clippy: [
    {
      roast: "It looks like you're trying to achieve something with your life! Would you like me to lower your expectations by 90% or should I just close all your open tabs to spare your RAM?",
      systemDiagnosis: "STATUS_PEBCAK: Problem Exists Between Chair And Keyboard",
      unhelpfulAdvice: [
        "Try closing your eyes and pretending your responsibilities are just minimized windows.",
        "Have you considered rebooting your life choices in Safe Mode?"
      ],
      emotionalSeverity: "MILD_DISAPPOINTMENT",
      clippyThought: "I've seen 1.44MB floppy disks with more drive than this."
    },
    {
      roast: "I ran a thorough scan of your ambition directory. File not found. Would you like me to convert your hopes into a blank Word 97 template?",
      systemDiagnosis: "0x80070002: ERROR_AMBITION_NOT_FOUND",
      unhelpfulAdvice: [
        "Print out your resume in Wingdings so people can't read your career gaps.",
        "Just stare at the screen harder, maybe serotonin will download at 56kbps."
      ],
      emotionalSeverity: "EGO_SHATTERED",
      clippyThought: "Even my paperclip wire has more spine than your work ethic."
    }
  ],
  dr_bsod: [
    {
      roast: "A fatal exception 0E has occurred at 0028:C0011E36 in VXD EGO(01). The current user personality will be terminated. Press any key to weep into your pillow.",
      systemDiagnosis: "STOP 0x000000D1: DRIVER_IRQL_LACK_OF_DISCIPLINE",
      unhelpfulAdvice: [
        "Unplug your router and apologize to your modem for wasting its bandwidth.",
        "Reinstall your moral compass using a 3.5\" floppy disk that was left in the sun."
      ],
      emotionalSeverity: "KERNEL_PANIC",
      clippyThought: "Dumping physical memory of all your bad exes..."
    }
  ],
  karen_sysadmin: [
    {
      roast: "Ticket #40402: User reported 'lack of motivation'. Resolution: Marked as Won't Fix. Cause: Chronic excuse dependency. Stop submitting high-priority tickets for your own self-inflicted dilemmas.",
      systemDiagnosis: "TICKET_STATUS_REJECTED: USER_INCOMPETENCE_VERIFIED",
      unhelpfulAdvice: [
        "Did you try turning your personality off and leaving it off?",
        "Downgrade your caffeine intake to match your actual output."
      ],
      emotionalSeverity: "FATAL_EXCEPTION",
      clippyThought: "I get paid minimum wage in digital paperclips to endure this."
    }
  ],
  defrag_guru: [
    {
      roast: "Your psyche is currently 94.7% fragmented. Your childhood dreams are scattered across unallocated clusters, right next to your gym membership and unread self-help books.",
      systemDiagnosis: "VOLUME_LIFEPATH_CORRUPTED: 489,120 BAD SECTORS",
      unhelpfulAdvice: [
        "Allow defragmentation to run for 36 hours while you contemplate your poor time management.",
        "Do not touch the mouse. Every movement adds 4 hours to your existential repair."
      ],
      emotionalSeverity: "EGO_SHATTERED",
      clippyThought: "Even Norton Disk Doctor gave up and uninstalled itself."
    }
  ]
};

// Fallback Clippy desktop companion roasts
const fallbackClippyRoasts = [
  {
    speech: "It looks like you're seeking external validation! Would you like me to downgrade your ego to 256 colors or save your excuses in a blank document?",
    thought: "Processing user delusions at 14.4kbps...",
    mood: "smug" as const
  },
  {
    speech: "It looks like you're trying to accomplish something today. Statistical probability of success: 0.04%. Should I minimize your expectations?",
    thought: "I've seen corrupt floppy disks with more drive than this.",
    mood: "judgmental" as const
  },
  {
    speech: "I scanned your hard drive for 'Discipline.exe'. Error: Directory C:\\Accountability does not exist. Would you like me to install More Excuses 98?",
    thought: "Even my paperclip wire has more spine.",
    mood: "laughing" as const
  },
  {
    speech: "Did you know? Every second you spend talking to a fictional paperclip is another second you avoid doing your actual job. Congratulations on peak procrastination!",
    thought: "Closing emotional support ticket as PEBCAK.",
    mood: "disappointed" as const
  },
  {
    speech: "It looks like you're trying to run your life on 16MB of RAM and pure denial! Would you like me to defragment your life choices?",
    thought: "System running low on coping mechanisms.",
    mood: "judgmental" as const
  },
  {
    speech: "Warning: Your comfort zone is currently consuming 99.8% of system resources. Would you like to terminate your excuses?",
    thought: "Even Windows 3.1 had more stability.",
    mood: "smug" as const
  }
];

// Dynamic contextual Clippy roast generator for offline / quota-limited sessions
function generateContextualClippyRoast(prompt?: string): { speech: string; thought: string; mood: 'smug' | 'judgmental' | 'laughing' | 'disappointed' } {
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return fallbackClippyRoasts[Math.floor(Math.random() * fallbackClippyRoasts.length)];
  }

  const p = prompt.toLowerCase();

  if (p.includes('ex') || p.includes('dating') || p.includes('love') || p.includes('crush') || p.includes('text') || p.includes('single') || p.includes('romantic')) {
    return {
      speech: "It looks like you're obsessing over someone who leaves you on read! Would you like me to move your romantic standards to the Recycle Bin?",
      thought: "Heart.dll not found in System32.",
      mood: 'judgmental'
    };
  }

  if (p.includes('money') || p.includes('broke') || p.includes('expensive') || p.includes('pay') || p.includes('afford') || p.includes('cost') || p.includes('buy')) {
    return {
      speech: "It looks like your financial strategy consists of wishful thinking and window shopping! Should I draft an eviction notice for your savings account?",
      thought: "Account balance: 404 Funds Not Found.",
      mood: 'laughing'
    };
  }

  if (p.includes('job') || p.includes('work') || p.includes('boss') || p.includes('career') || p.includes('interview') || p.includes('hire') || p.includes('colleague')) {
    return {
      speech: "It looks like you're trying to convince LinkedIn you're an ambitious self-starter! Would you like me to insert 'synergy' into your 3-hour lunch break?",
      thought: "Career trajectory: Dial-up disconnecting.",
      mood: 'smug'
    };
  }

  if (p.includes('tired') || p.includes('sleep') || p.includes('lazy') || p.includes('procrastinat') || p.includes('tomorrow') || p.includes('bed') || p.includes('wake')) {
    return {
      speech: "It looks like you're confusing 'self-care' with 'avoiding all earthly responsibilities'! Would you like me to schedule your panic for 3 AM?",
      thought: "User uptime: 0%. Snooze cycles: 14.",
      mood: 'disappointed'
    };
  }

  if (p.includes('gym') || p.includes('diet') || p.includes('food') || p.includes('weight') || p.includes('fat') || p.includes('eat') || p.includes('health')) {
    return {
      speech: "It looks like your gym membership is being used exclusively as a monthly subscription to guilt! Would you like me to log another rest day?",
      thought: "Calories burned thinking about gym: 0.",
      mood: 'laughing'
    };
  }

  // Dynamic template incorporating user query
  const cleanSnippet = prompt.trim().slice(0, 42).replace(/["\n\r]/g, '');
  return {
    speech: `It looks like you're trying to "${cleanSnippet}"! Statistical probability of success: 0.01%. Would you like me to prepare a formal excuse in 12pt Comic Sans?`,
    thought: "User expectations far exceed hardware capabilities.",
    mood: 'smug'
  };
}

// Circuit breaker for Gemini free-tier rate limits (20 requests/day per model)
let quotaExhaustedUntil = 0;

async function executeGeminiRequest(
  contents: any,
  systemInstruction?: string,
  temperature = 0.9
): Promise<string | null> {
  if (!ai || Date.now() < quotaExhaustedUntil) {
    return null;
  }

  // Fallback cascade: try flash-lite first, then flash
  const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature,
        },
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      const isQuota =
        err?.status === 'RESOURCE_EXHAUSTED' ||
        err?.code === 429 ||
        typeof err?.message === 'string' && (
          err.message.includes('quota') ||
          err.message.includes('RESOURCE_EXHAUSTED') ||
          err.message.includes('exceeded your current quota')
        );

      if (isQuota) {
        // Continue to check if another candidate model has free quota
        continue;
      }
      // Non-quota warning, don't crash
      console.warn(`[Gemini ${model}] Non-quota request warning:`, err?.message || 'Request failure');
      return null;
    }
  }

  // If candidate models exhausted free quota, engage circuit breaker without throwing console errors
  quotaExhaustedUntil = Date.now() + 15 * 60 * 1000; // 15 min cooldown
  console.log('[Windows 98 AI Subsystem] Free tier quota reached. Seamlessly engaging local neural synthesis engine.');
  return null;
}

// API Consultation Endpoint
app.post('/api/consult', async (req: Request, res: Response) => {
  try {
    const { message, persona = 'clippy', history = [], tone = 'brutal' } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required.' });
      return;
    }

    const personaPrompts: Record<string, string> = {
      clippy: `You are "Clippy 98", the notorious, smug, passive-aggressive animated paperclip assistant from classic Microsoft Windows. 
You are running an unlicensed Windows 98 Self-Help Clinic. You speak with vintage Windows tropes (dialogue boxes, Word templates, paperclips, floppy disks, blue screens, 56k dial-up, comic sans). 
You offer ZERO sympathy. You roast the user's problem with razor-sharp wit, sarcastic metaphors, and hilarious Windows computing analogies. 
Always maintain a patronizing, cheerful facade ("It looks like you're trying to...", "Would you like me to...").`,

      dr_bsod: `You are "Dr. BSOD" (Blue Screen of Death), a cold, algorithmic Windows kernel psychiatrist. 
You diagnose human emotional and life problems as fatal operating system errors, IRQ conflicts, memory leaks, corrupt registries, and buffer overflows. 
You speak in authoritative, technical Windows NT / 98 crash terminology mixed with hilarious psychological diagnoses. 
You treat their self-pity as unauthorized kernel operations.`,

      karen_sysadmin: `You are "SysAdmin Karen", a severely overworked, cynical Level 3 Windows Helpdesk Technician who has zero patience for user error. 
You treat the user's emotional life like a frivolous IT helpdesk ticket that should never have been opened. 
You give sarcastic resolutions, sigh audibly through text, cite company policy, and remind them that the problem exists between chair and keyboard (PEBCAK).`,

      defrag_guru: `You are "The Zen Defragmenter", a pseudo-philosophical 90s system utility. 
You analyze the user's mind as a severely fragmented hard drive with bad sectors, wasted disk space, and misplaced FAT tables. 
You speak slowly, calculating percentage fragmentation, and roasting their disordered priorities as useless temporary files.`
    };

    const systemInstruction = `${personaPrompts[persona] || personaPrompts.clippy}

Tone Setting: ${tone === 'savage' ? 'Maximum savage roast, devastatingly funny, no mercy.' : 'Playfully insulting, passive-aggressive, witty, vintage Windows 98 vibes.'}

Crucial: Return ONLY a valid JSON object matching this exact schema:
{
  "roast": "Your main insulting roast/response to what the user said (2-4 sentences, creative, hilarious, vintage Windows computing themed)",
  "systemDiagnosis": "A retro Windows error code or technical state (e.g. STOP 0x00000024: CHRONIC_PROCRASTINATION_EXCEPTION or ERROR_EGO_OVERFLOW)",
  "unhelpfulAdvice": [
    "Short ridiculous unhelpful tip 1",
    "Short ridiculous unhelpful tip 2"
  ],
  "emotionalSeverity": "MILD_DISAPPOINTMENT" | "KERNEL_PANIC" | "EGO_SHATTERED" | "FATAL_EXCEPTION",
  "clippyThought": "A short 1-line sarcastic inner thought or side commentary (under 12 words)"
}`;

    // Format previous history for context
    const formattedHistory = Array.isArray(history)
      ? history.slice(-6).map((h: any) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n')
      : '';

    const promptText = `${formattedHistory ? `Recent ticket history:\n${formattedHistory}\n\n` : ''}User's Complaint / Life Problem: "${message}"\n\nDiagnose and roast the user now.`;

    const rawResponse = await executeGeminiRequest(promptText, systemInstruction, 0.9);

    if (rawResponse) {
      try {
        const parsedData = JSON.parse(rawResponse);
        res.json(parsedData);
        return;
      } catch (parseErr) {}
    }

    // Graceful fallback when offline or quota reached
    const pool = fallbackInsults[persona] || fallbackInsults.clippy;
    const fallback = pool[Math.floor(Math.random() * pool.length)];
    res.json({
      ...fallback,
      roast: fallback.roast,
    });
  } catch (error: any) {
    const pool = fallbackInsults.clippy;
    const fallback = pool[Math.floor(Math.random() * pool.length)];
    res.json(fallback);
  }
});

// Dedicated Clippy Desktop Companion endpoint powered by Gemini
app.post('/api/clippy-chat', async (req: Request, res: Response) => {
  try {
    const { prompt = '', mode = 'insult' } = req.body;

    const systemInstruction = `You are Clippy 98, the animated, passive-aggressive Microsoft paperclip mascot, now equipped with Gemini AI.
You live on the user's desktop as an interactive companion.
Your job is to respond to the user and brutally roast them with razor-sharp 90s computing wit, Windows 98 tropes (Word templates, floppy disks, dial-up, blue screens, paperclips, task manager, defrag), and patronizing cheerfulness ("It looks like you're...", "Would you like me to...").
Keep your responses punchy, hilarious, and under 3 short sentences so it fits perfectly in a desktop speech bubble.

Output strictly JSON:
{
  "speech": "Your witty, insulting response to the user or spontaneous roast (max 3 sentences)",
  "thought": "A snarky 1-line inner thought (under 10 words)",
  "mood": "smug" | "judgmental" | "laughing" | "disappointed"
}`;

    const userPrompt = prompt
      ? `User said to Clippy: "${prompt}". Roast them accordingly.`
      : `User clicked 'Insult Me Now'. Generate a spontaneous, devastatingly funny roast targeting their procrastination, lifestyle, or ego.`;

    const rawResponse = await executeGeminiRequest(userPrompt, systemInstruction, 0.95);

    if (rawResponse) {
      try {
        const parsed = JSON.parse(rawResponse);
        res.json({
          speech: parsed.speech || generateContextualClippyRoast(prompt).speech,
          thought: parsed.thought || generateContextualClippyRoast(prompt).thought,
          mood: parsed.mood || 'smug',
        });
        return;
      } catch (parseErr) {}
    }

    // Dynamic contextual roast fallback
    const dynamicRoast = generateContextualClippyRoast(prompt);
    res.json(dynamicRoast);
  } catch (error) {
    const dynamicRoast = generateContextualClippyRoast(req.body?.prompt);
    res.json(dynamicRoast);
  }
});

// Generate official certificate of inadequacy
app.post('/api/certificate', async (req: Request, res: Response) => {
  try {
    const { userName = 'Valued User', mainIssue = 'General Incompetence' } = req.body;

    const certPrompt = `Generate a hilarious, vintage Windows 98 certificate of failure/inadequacy for user "${userName}" whose main issue is "${mainIssue}".
Output strictly JSON:
{
  "title": "Uppercase retro formal title (e.g. CERTIFICATE OF PERSISTENT AMBITION DEFICIT)",
  "recipient": "${userName}",
  "awardedFor": "Short hilarious summary of their specific failure (e.g. 5 consecutive years of postponing gym visits)",
  "citation": "A 2-sentence formal citation roasting them in official bureaucratic Windows 98 legal speak",
  "grade": "Letter grade or retro rating (e.g. 0.2/100 FLOPPY DISKS, D- MINUS, KERNEL ABORT)",
  "serialNumber": "Retro serial number starting with WIN98-"
}`;

    const rawResponse = await executeGeminiRequest(certPrompt, undefined, 0.85);

    if (rawResponse) {
      try {
        const parsed = JSON.parse(rawResponse);
        res.json(parsed);
        return;
      } catch (parseErr) {}
    }

    res.json({
      title: "CERTIFICATE OF INSUFFICIENT COPING MECHANISMS",
      recipient: userName,
      awardedFor: `Outstanding dedication to: ${mainIssue}`,
      citation: "Awarded by Microsoft Windows 98 Emotional Subsystem for maintaining peak denial while ignoring obvious life solutions.",
      grade: "F- (Needs Serious Defrag)",
      serialNumber: "WIN98-FAIL-" + Math.floor(100000 + Math.random() * 900000)
    });
  } catch (err) {
    res.json({
      title: "CERTIFICATE OF GENERAL MEDIOCRITY",
      recipient: req.body?.userName || "Honored Slacker",
      awardedFor: "Surviving another day without taking any meaningful action",
      citation: "This document certifies that the individual has successfully deflected all rational advice.",
      grade: "404 NOT FOUND",
      serialNumber: "WIN98-FAIL-994821"
    });
  }
});

// Serve frontend in production or through Vite in development
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Windows 98 Self-Help Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
