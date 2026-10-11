import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Sparkles, Award, Zap, Shield } from 'lucide-react';
import { sounds } from '../../../utils/soundEffects';

interface Obstacle {
  x: number;
  y: number;
  type: 'spike' | 'ceiling_spike' | 'block' | 'pad' | 'orb';
  width: number;
  height: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
}

interface LevelData {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Demon' | 'Endless';
  color: string;
  length: number; // in pixels
  obstacles: Obstacle[];
}

// Generate Obstacle layouts for levels
const createLevel = (levelId: string): LevelData => {
  if (levelId === 'level1') {
    return {
      id: 'level1',
      name: 'Stereo Neurosis',
      difficulty: 'Easy',
      color: '#0080ff',
      length: 2800,
      obstacles: [
        { x: 450, y: 280, type: 'spike', width: 30, height: 30 },
        { x: 750, y: 280, type: 'spike', width: 30, height: 30 },
        { x: 950, y: 280, type: 'pad', width: 32, height: 12 },
        { x: 1080, y: 230, type: 'block', width: 60, height: 80 },
        { x: 1300, y: 280, type: 'spike', width: 30, height: 30 },
        { x: 1332, y: 280, type: 'spike', width: 30, height: 30 },
        { x: 1600, y: 210, type: 'orb', width: 28, height: 28 },
        { x: 1620, y: 280, type: 'spike', width: 30, height: 30 },
        { x: 1850, y: 250, type: 'block', width: 90, height: 60 },
        { x: 2100, y: 280, type: 'spike', width: 30, height: 30 },
        { x: 2300, y: 280, type: 'pad', width: 32, height: 12 },
        { x: 2450, y: 200, type: 'block', width: 80, height: 110 },
      ],
    };
  }

  if (levelId === 'level2') {
    return {
      id: 'level2',
      name: 'Deadline Panic',
      difficulty: 'Medium',
      color: '#ff8800',
      length: 3600,
      obstacles: [
        { x: 400, y: 280, type: 'spike', width: 30, height: 30 },
        { x: 650, y: 280, type: 'spike', width: 30, height: 30 },
        { x: 682, y: 280, type: 'spike', width: 30, height: 30 },
        { x: 900, y: 240, type: 'block', width: 60, height: 70 },
        { x: 960, y: 200, type: 'block', width: 60, height: 110 },
        { x: 1150, y: 280, type: 'spike', width: 30, height: 30 },
        { x: 1350, y: 190, type: 'orb', width: 28, height: 28 },
        { x: 1360, y: 280, type: 'spike', width: 30, height: 30 },
        { x: 1392, y: 280, type: 'spike', width: 30, height: 30 },
        { x: 1650, y: 280, type: 'pad', width: 32, height: 12 },
        { x: 1800, y: 170, type: 'block', width: 70, height: 30 },
        { x: 2050, y: 280, type: 'spike', width: 30, height: 30 },
        { x: 2082, y: 280, type: 'spike', width: 30, height: 30 },
        { x: 2350, y: 190, type: 'orb', width: 28, height: 28 },
        { x: 2550, y: 280, type: 'spike', width: 30, height: 30 },
        { x: 2800, y: 240, type: 'block', width: 90, height: 70 },
        { x: 3100, y: 280, type: 'spike', width: 30, height: 30 },
        { x: 3132, y: 280, type: 'spike', width: 30, height: 30 },
      ],
    };
  }

  // Level 3: Imposter Syndrome (Demon)
  return {
    id: 'level3',
    name: 'Imposter Syndrome',
    difficulty: 'Demon',
    color: '#dd0044',
    length: 4400,
    obstacles: [
      { x: 380, y: 280, type: 'spike', width: 30, height: 30 },
      { x: 412, y: 280, type: 'spike', width: 30, height: 30 },
      { x: 680, y: 280, type: 'spike', width: 30, height: 30 },
      { x: 712, y: 280, type: 'spike', width: 30, height: 30 },
      { x: 744, y: 280, type: 'spike', width: 30, height: 30 },
      { x: 1000, y: 240, type: 'block', width: 50, height: 70 },
      { x: 1180, y: 180, type: 'orb', width: 28, height: 28 },
      { x: 1350, y: 150, type: 'orb', width: 28, height: 28 },
      { x: 1350, y: 280, type: 'spike', width: 30, height: 30 },
      { x: 1382, y: 280, type: 'spike', width: 30, height: 30 },
      { x: 1650, y: 280, type: 'pad', width: 32, height: 12 },
      { x: 1800, y: 180, type: 'block', width: 90, height: 25 },
      { x: 2100, y: 280, type: 'spike', width: 30, height: 30 },
      { x: 2132, y: 280, type: 'spike', width: 30, height: 30 },
      { x: 2400, y: 280, type: 'spike', width: 30, height: 30 },
      { x: 2432, y: 280, type: 'spike', width: 30, height: 30 },
      { x: 2464, y: 280, type: 'spike', width: 30, height: 30 },
      { x: 2750, y: 210, type: 'orb', width: 28, height: 28 },
      { x: 3000, y: 240, type: 'block', width: 70, height: 70 },
      { x: 3300, y: 280, type: 'pad', width: 32, height: 12 },
      { x: 3550, y: 170, type: 'block', width: 90, height: 25 },
      { x: 3850, y: 280, type: 'spike', width: 30, height: 30 },
      { x: 3882, y: 280, type: 'spike', width: 30, height: 30 },
    ],
  };
};

export const GeometryDash: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedLevelId, setSelectedLevelId] = useState<string>('level1');
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'CRASHED' | 'WON'>('IDLE');
  const [attempts, setAttempts] = useState<number>(1);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [bestPercent, setBestPercent] = useState<number>(0);
  const [crashRoast, setCrashRoast] = useState<string>('');
  const [bgmEnabled, setBgmEnabled] = useState<boolean>(true);
  const [skin, setSkin] = useState<'cube' | 'clippy' | 'floppy'>('cube');

  // Game internal state references for the 60fps loop
  const stateRef = useRef({
    cameraX: 0,
    playerX: 80,
    playerY: 280,
    velocityY: 0,
    isGrounded: true,
    rotation: 0,
    particles: [] as Particle[],
    level: createLevel('level1'),
    speed: 5.2,
    gravity: 0.82,
    jumpForce: -13.2,
    activeLoopId: 0,
    isHoldingJump: false,
    bgmInterval: null as any,
    currentStep: 0,
  });

  // Background Synth Chiptune Generator
  const playChiptuneBeat = () => {
    if (!bgmEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;
      const step = stateRef.current.currentStep % 16;
      stateRef.current.currentStep++;

      // Kick on 0, 4, 8, 12
      if (step % 4 === 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      }

      // Snare / clap on 4, 12
      if (step === 4 || step === 12) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(280, now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      }

      // Bassline note
      const bassNotes = [110, 110, 130, 146, 110, 98, 110, 164];
      const note = bassNotes[Math.floor(step / 2) % bassNotes.length];
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(note, now);
      bassGain.gain.setValueAtTime(0.06, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      bassOsc.connect(bassGain);
      bassGain.connect(ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + 0.13);
    } catch (e) {}
  };

  // Start / Stop BGM loop
  useEffect(() => {
    if (gameState === 'PLAYING' && bgmEnabled) {
      const intId = setInterval(playChiptuneBeat, 130);
      stateRef.current.bgmInterval = intId;
      return () => clearInterval(intId);
    } else {
      if (stateRef.current.bgmInterval) {
        clearInterval(stateRef.current.bgmInterval);
      }
    }
  }, [gameState, bgmEnabled]);

  // Handle jump request
  const doJump = () => {
    const s = stateRef.current;
    if (gameState !== 'PLAYING') return;

    // Check if near any jump orb (within 45px radius)
    let hitOrb = false;
    for (const obs of s.level.obstacles) {
      if (obs.type === 'orb') {
        const dist = Math.hypot(
          s.cameraX + s.playerX + 15 - (obs.x + obs.width / 2),
          s.playerY + 15 - (obs.y + obs.height / 2)
        );
        if (dist < 46) {
          hitOrb = true;
          s.velocityY = s.jumpForce * 1.05;
          sounds.playOrb();
          // Create orb burst particles
          for (let p = 0; p < 12; p++) {
            s.particles.push({
              x: obs.x + 14,
              y: obs.y + 14,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6,
              color: '#ffff00',
              size: 4,
              alpha: 1,
              life: 25,
            });
          }
          break;
        }
      }
    }

    if (!hitOrb && s.isGrounded) {
      s.velocityY = s.jumpForce;
      s.isGrounded = false;
      sounds.playJump();
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        if (gameState === 'IDLE' || gameState === 'CRASHED' || gameState === 'WON') {
          startGame();
        } else {
          doJump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Start / Restart game
  const startGame = () => {
    sounds.playClick();
    const currentLvl = createLevel(selectedLevelId);
    stateRef.current.level = currentLvl;
    stateRef.current.cameraX = 0;
    stateRef.current.playerY = 280;
    stateRef.current.velocityY = 0;
    stateRef.current.isGrounded = true;
    stateRef.current.rotation = 0;
    stateRef.current.particles = [];
    stateRef.current.currentStep = 0;
    setProgressPercent(0);
    setCrashRoast('');
    setGameState('PLAYING');
  };

  const handleCrash = (pct: number) => {
    sounds.playExplosion();
    setGameState('CRASHED');
    setAttempts((a) => a + 1);

    if (pct > bestPercent) {
      setBestPercent(pct);
    }

    // Explosion particles
    const s = stateRef.current;
    for (let i = 0; i < 28; i++) {
      s.particles.push({
        x: s.cameraX + s.playerX + 15,
        y: s.playerY + 15,
        vx: (Math.random() - 0.5) * 9,
        vy: (Math.random() - 0.5) * 9,
        color: ['#ffff00', '#ff0055', '#00ffee', '#ffffff'][Math.floor(Math.random() * 4)],
        size: Math.random() * 6 + 3,
        alpha: 1,
        life: 40,
      });
    }

    // Sarcastic roast tailored to progress percentage
    let roast = '';
    if (pct < 20) {
      roast = `CRASH at ${pct}%! You didn't even make it past the tutorial spikes. Absolute peak procrastination energy.`;
    } else if (pct < 50) {
      roast = `CRASH at ${pct}%! Tripped over an obstacle that was literally telegraphed for 3 full seconds.`;
    } else if (pct < 85) {
      roast = `CRASH at ${pct}%! You tasted hope, got overly confident, and detonated into digital confetti.`;
    } else {
      roast = `CRASH at ${pct}%! Heartbreaking! You choked right before the finish line. Just like your New Year's resolutions.`;
    }
    setCrashRoast(roast);
    sounds.speak(roast, 'clippy');
  };

  const handleWin = () => {
    sounds.playDing();
    setGameState('WON');
    setProgressPercent(100);
    setBestPercent(100);
    const winRoast = "100% COMPLETE! Against all statistical probability, you cleared the course. Now go solve your real life problems.";
    setCrashRoast(winRoast);
    sounds.speak(winRoast, 'clippy');
  };

  // Main 60fps Loop
  useEffect(() => {
    let animId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      const s = stateRef.current;

      // UPDATE PHYSICS
      if (gameState === 'PLAYING') {
        s.cameraX += s.speed;

        // Apply Gravity
        s.velocityY += s.gravity;
        s.playerY += s.velocityY;

        // Ground Floor check (Floor is at Y = 280)
        let floorY = 280;

        // Check platforms collision
        const playerBox = {
          left: s.cameraX + s.playerX + 4,
          right: s.cameraX + s.playerX + 26,
          top: s.playerY + 2,
          bottom: s.playerY + 30,
        };

        for (const obs of s.level.obstacles) {
          if (obs.type === 'block') {
            const blockBox = {
              left: obs.x,
              right: obs.x + obs.width,
              top: obs.y,
              bottom: obs.y + obs.height,
            };

            // Horizontal overlap
            if (playerBox.right > blockBox.left && playerBox.left < blockBox.right) {
              // Landing on top of block
              if (playerBox.bottom >= blockBox.top && playerBox.top < blockBox.top && s.velocityY >= 0) {
                floorY = blockBox.top - 30;
              } else if (playerBox.bottom > blockBox.top + 8 && playerBox.top < blockBox.bottom) {
                // Crashed into side of block!
                const pct = Math.floor((s.cameraX / (s.level.length - 400)) * 100);
                handleCrash(Math.min(99, Math.max(1, pct)));
                break;
              }
            }
          } else if (obs.type === 'spike') {
            // Triangular spike hitbox check
            const spikeBox = {
              left: obs.x + 6,
              right: obs.x + obs.width - 6,
              top: obs.y + 6,
              bottom: obs.y + obs.height,
            };
            if (
              playerBox.right > spikeBox.left &&
              playerBox.left < spikeBox.right &&
              playerBox.bottom > spikeBox.top
            ) {
              const pct = Math.floor((s.cameraX / (s.level.length - 400)) * 100);
              handleCrash(Math.min(99, Math.max(1, pct)));
              break;
            }
          } else if (obs.type === 'pad') {
            // Jump pad trigger
            if (
              playerBox.right > obs.x &&
              playerBox.left < obs.x + obs.width &&
              playerBox.bottom >= obs.y
            ) {
              s.velocityY = s.jumpForce * 1.35; // Super spring bounce!
              s.isGrounded = false;
              sounds.playOrb();
              for (let p = 0; p < 8; p++) {
                s.particles.push({
                  x: obs.x + 16,
                  y: obs.y,
                  vx: (Math.random() - 0.5) * 5,
                  vy: -Math.random() * 5,
                  color: '#ffff00',
                  size: 3,
                  alpha: 1,
                  life: 20,
                });
              }
            }
          }
        }

        // Check if grounded
        if (s.playerY >= floorY) {
          s.playerY = floorY;
          s.velocityY = 0;
          s.isGrounded = true;
          // Snap rotation to nearest 90 degrees
          s.rotation = Math.round(s.rotation / 90) * 90;
        } else {
          s.isGrounded = false;
          // Rotate while airborne
          s.rotation += 8.5;
        }

        // Add trail particles
        if (Math.random() < 0.4) {
          s.particles.push({
            x: s.cameraX + s.playerX,
            y: s.playerY + 28,
            vx: -Math.random() * 2,
            vy: (Math.random() - 0.5) * 1.5,
            color: '#00ffff',
            size: 2.5,
            alpha: 0.8,
            life: 18,
          });
        }

        // Calculate progress percentage
        const progress = Math.min(100, Math.floor((s.cameraX / (s.level.length - 350)) * 100));
        setProgressPercent(progress);

        if (s.cameraX >= s.level.length - 350) {
          handleWin();
        }
      }

      // Update particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 1 / p.life;
        if (p.alpha <= 0) {
          s.particles.splice(i, 1);
        }
      }

      // RENDER CANVAS (Width: 640, Height: 360)
      ctx.clearRect(0, 0, 640, 360);

      // 1. Cyber Dark Background with pulsating gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 360);
      bgGrad.addColorStop(0, '#0a0a20');
      bgGrad.addColorStop(1, '#050510');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 640, 360);

      // Distant Parallax Grid Lines
      ctx.strokeStyle = '#181844';
      ctx.lineWidth = 1;
      const offsetX = (s.cameraX * 0.3) % 40;
      for (let x = -offsetX; x < 640; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 310);
        ctx.stroke();
      }

      // 2. Render Obstacles
      ctx.save();
      ctx.translate(-s.cameraX, 0);

      for (const obs of s.level.obstacles) {
        if (obs.x + obs.width < s.cameraX - 50 || obs.x > s.cameraX + 700) continue;

        if (obs.type === 'spike') {
          // Sharp Neon Triangle Spike
          ctx.fillStyle = '#ff0055';
          ctx.strokeStyle = '#ff99bb';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y + obs.height);
          ctx.lineTo(obs.x + obs.width / 2, obs.y);
          ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Inner mini triangle detail
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(obs.x + 8, obs.y + obs.height - 2);
          ctx.lineTo(obs.x + obs.width / 2, obs.y + 8);
          ctx.lineTo(obs.x + obs.width - 8, obs.y + obs.height - 2);
          ctx.closePath();
          ctx.fill();
        } else if (obs.type === 'block') {
          // Cyber 3D beveled block
          ctx.fillStyle = '#102040';
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          ctx.strokeStyle = '#00aaff';
          ctx.lineWidth = 2;
          ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);

          // Inner cross pattern
          ctx.strokeStyle = '#004488';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y);
          ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
          ctx.moveTo(obs.x + obs.width, obs.y);
          ctx.lineTo(obs.x, obs.y + obs.height);
          ctx.stroke();
        } else if (obs.type === 'pad') {
          // Yellow launch pad on floor
          ctx.fillStyle = '#ffcc00';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(obs.x + obs.width / 2, obs.y + obs.height / 2, obs.width / 2, 6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else if (obs.type === 'orb') {
          // Glowing Floating Jump Orb
          ctx.strokeStyle = '#ffee00';
          ctx.lineWidth = 3;
          ctx.fillStyle = '#ffaa0044';
          ctx.beginPath();
          ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, obs.width / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Inner core
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Finish line gate
      const finishX = s.level.length - 350;
      ctx.fillStyle = '#00ff88';
      ctx.fillRect(finishX, 0, 10, 310);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('FINISH', finishX - 18, 50);

      // Render Particles in world space
      for (const p of s.particles) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1;

      ctx.restore();

      // 3. Render Floor
      const floorGrad = ctx.createLinearGradient(0, 310, 0, 360);
      floorGrad.addColorStop(0, '#0055ff');
      floorGrad.addColorStop(1, '#001144');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, 310, 640, 50);

      // Glowing Neon Floor top line
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 310);
      ctx.lineTo(640, 310);
      ctx.stroke();

      // Moving floor grid ticks
      ctx.strokeStyle = '#00aaff';
      ctx.lineWidth = 1;
      const floorOffset = s.cameraX % 30;
      for (let fx = -floorOffset; fx < 640; fx += 30) {
        ctx.beginPath();
        ctx.moveTo(fx, 310);
        ctx.lineTo(fx - 15, 360);
        ctx.stroke();
      }

      // 4. Render Player Cube (if not crashed)
      if (gameState !== 'CRASHED') {
        ctx.save();
        ctx.translate(s.playerX + 15, s.playerY + 15);
        ctx.rotate((s.rotation * Math.PI) / 180);

        if (skin === 'cube') {
          // Iconic Geometry Dash Yellow Cube
          ctx.fillStyle = '#ffe600';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2.5;
          ctx.fillRect(-15, -15, 30, 30);
          ctx.strokeRect(-15, -15, 30, 30);

          // Inner cyber face
          ctx.fillStyle = '#00ffff';
          ctx.fillRect(-8, -8, 16, 16);

          // Eyes
          ctx.fillStyle = '#000000';
          ctx.fillRect(-5, -6, 3, 5);
          ctx.fillRect(2, -6, 3, 5);
          // Smile
          ctx.fillRect(-4, 3, 8, 2);
        } else if (skin === 'clippy') {
          // Clippy Mascot Cube
          ctx.fillStyle = '#e6e6e6';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          ctx.fillRect(-15, -15, 30, 30);
          ctx.strokeRect(-15, -15, 30, 30);
          ctx.font = '20px sans-serif';
          ctx.fillText('📎', -12, 8);
        } else {
          // Floppy Disk Cube
          ctx.fillStyle = '#000080';
          ctx.fillRect(-15, -15, 30, 30);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-10, -14, 20, 10);
          ctx.fillStyle = '#808080';
          ctx.fillRect(-6, 6, 12, 8);
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, selectedLevelId, skin]);

  return (
    <div className="flex flex-col items-center select-none font-win98 text-xs p-1">
      <div className="bg-[#c0c0c0] win98-raised p-2 border-2 border-white max-w-lg w-full">
        {/* Top Control Header HUD */}
        <div className="win98-sunken p-1.5 mb-2 bg-[#d4d4d4] flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-gray-700">Level:</span>
            <select
              value={selectedLevelId}
              onChange={(e) => {
                sounds.playClick();
                setSelectedLevelId(e.target.value);
                setGameState('IDLE');
              }}
              disabled={gameState === 'PLAYING'}
              className="bg-white border border-gray-600 px-1 py-0.5 text-xs font-bold text-blue-900"
            >
              <option value="level1">Stereo Neurosis (Easy)</option>
              <option value="level2">Deadline Panic (Medium)</option>
              <option value="level3">Imposter Syndrome (Demon)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-bold">Attempt:</span>
            <span className="font-bold text-red-700">{attempts}</span>
          </div>

          <button
            onClick={() => setBgmEnabled(!bgmEnabled)}
            className="win98-raised px-1.5 py-0.5 flex items-center gap-1 bg-[#c0c0c0] text-[10px]"
            title="Toggle BGM Synth"
          >
            {bgmEnabled ? <Volume2 size={12} className="text-green-800" /> : <VolumeX size={12} className="text-red-700" />}
            <span>BGM</span>
          </button>
        </div>

        {/* Level Progress Bar */}
        <div className="mb-2 win98-sunken bg-gray-900 p-0.5 h-4 flex items-center relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-yellow-400 to-green-500 transition-all duration-75"
            style={{ width: `${progressPercent}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-white drop-shadow">
            {progressPercent}%
          </span>
        </div>

        {/* Geometry Dash Interactive Canvas Viewport */}
        <div
          onClick={gameState === 'PLAYING' ? doJump : startGame}
          className="relative win98-sunken bg-black overflow-hidden cursor-pointer active:brightness-105"
          style={{ width: '100%', height: '240px' }}
        >
          <canvas
            ref={canvasRef}
            width={640}
            height={360}
            className="w-full h-full object-cover block"
          />

          {/* Idle Start Overlay */}
          {gameState === 'IDLE' && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-3 text-center">
              <div className="text-yellow-400 font-pixel text-2xl font-bold tracking-widest drop-shadow mb-1 animate-pulse">
                GEOMETRY CRASH 98
              </div>
              <p className="text-[11px] text-gray-200 mb-3 font-win98">
                Press [Space], [W], or Click to Jump over reality.
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startGame();
                }}
                className="px-4 py-1.5 bg-[#c0c0c0] win98-raised win98-btn font-bold text-black flex items-center gap-1 hover:bg-white text-xs"
              >
                <Play size={13} fill="currentColor" />
                <span>Start Run</span>
              </button>
            </div>
          )}

          {/* Crashed Overlay */}
          {gameState === 'CRASHED' && (
            <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center p-3 text-center animate-fade-in">
              <div className="text-red-500 font-pixel text-2xl font-bold tracking-widest mb-1">
                FATAL COLLISION!
              </div>
              <div className="text-sm font-bold text-yellow-300 font-mono mb-2">
                Progress: {progressPercent}% (Best: {bestPercent}%)
              </div>
              <p className="text-[11px] text-gray-200 mb-3 max-w-xs font-win98">
                {crashRoast}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startGame();
                }}
                className="px-4 py-1.5 bg-[#c0c0c0] win98-raised win98-btn font-bold text-black flex items-center gap-1 hover:bg-white text-xs"
              >
                <RotateCcw size={12} />
                <span>Try Again (Attempt {attempts + 1})</span>
              </button>
            </div>
          )}

          {/* Victory Overlay */}
          {gameState === 'WON' && (
            <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center p-3 text-center animate-fade-in">
              <div className="text-green-400 font-pixel text-2xl font-bold tracking-widest mb-1 animate-bounce">
                LEVEL COMPLETE! 100%
              </div>
              <p className="text-[11px] text-gray-200 mb-3 max-w-xs font-win98">
                {crashRoast}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startGame();
                }}
                className="px-4 py-1.5 bg-[#c0c0c0] win98-raised win98-btn font-bold text-black flex items-center gap-1 hover:bg-white text-xs"
              >
                <RotateCcw size={12} />
                <span>Replay Level</span>
              </button>
            </div>
          )}
        </div>

        {/* Customization & Controls Toolbar */}
        <div className="mt-2 win98-sunken p-1.5 bg-[#e0e0e0] flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1">
            <span className="text-gray-600 font-bold">Skin:</span>
            <button
              onClick={() => setSkin('cube')}
              className={`px-1.5 py-0.5 rounded-[1px] ${skin === 'cube' ? 'win98-sunken bg-yellow-200 font-bold' : 'win98-raised bg-[#d0d0d0]'}`}
            >
              🟨 Cube
            </button>
            <button
              onClick={() => setSkin('clippy')}
              className={`px-1.5 py-0.5 rounded-[1px] ${skin === 'clippy' ? 'win98-sunken bg-blue-200 font-bold' : 'win98-raised bg-[#d0d0d0]'}`}
            >
              📎 Clippy
            </button>
            <button
              onClick={() => setSkin('floppy')}
              className={`px-1.5 py-0.5 rounded-[1px] ${skin === 'floppy' ? 'win98-sunken bg-teal-200 font-bold' : 'win98-raised bg-[#d0d0d0]'}`}
            >
              💾 Floppy
            </button>
          </div>

          {/* Quick Jump Action Button (great for touch/mobile or mouse clicking) */}
          <button
            onMouseDown={doJump}
            onTouchStart={(e) => {
              e.preventDefault();
              doJump();
            }}
            disabled={gameState !== 'PLAYING'}
            className="px-3 py-1 bg-yellow-400 border border-black font-bold text-black active:scale-95 disabled:opacity-50 text-xs shadow"
          >
            ⬆️ JUMP!
          </button>
        </div>

        {/* Footer tip */}
        <div className="mt-1 text-[10px] text-gray-600 flex items-center justify-between px-1">
          <span>Controls: [Space], [W], or Click screen to Jump</span>
          <span>Tip: Hit yellow pads for mega bounces!</span>
        </div>
      </div>
    </div>
  );
};
