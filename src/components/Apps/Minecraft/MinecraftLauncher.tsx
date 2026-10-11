import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  Download, 
  Terminal, 
  Settings, 
  FileText, 
  User, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  AlertTriangle,
  Layers,
  ChevronDown,
  Box,
  Pickaxe,
  Compass,
  Sun,
  Moon,
  Flame,
  ZoomIn,
  Eye,
  Rocket,
  FolderOpen,
  Check,
  Trash2,
  ExternalLink,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { sounds } from '../../../utils/soundEffects';
import { 
  AVAILABLE_MODS, 
  MinecraftMod, 
  getInstalledModIds, 
  getEnabledModIds, 
  toggleModEnabled, 
  uninstallMod 
} from '../../../utils/minecraftMods';

type LauncherTab = 'play' | 'installations' | 'mods' | 'skins' | 'patch_notes' | 'console';

export type BlockType = 
  | 'air' 
  | 'grass' 
  | 'dirt' 
  | 'stone' 
  | 'wood' 
  | 'leaves' 
  | 'coal' 
  | 'iron' 
  | 'gold' 
  | 'diamond' 
  | 'bedrock'
  | 'flower'
  | 'lucky_block';

interface GameBlock {
  type: BlockType;
}

interface Mob {
  id: number;
  x: number;
  y: number;
  type: 'pig' | 'sheep' | 'creeper';
  name: string;
}

interface MinecraftLauncherProps {
  onOpenCurseforge?: () => void;
}

const SPLASH_TEXTS = [
  "Clippy was here!",
  "Touch grass!",
  "Also try Terraria!",
  "Don't look at your grades!",
  "404 Diamonds Not Found!",
  "Unread emails: 4,200",
  "CurseForge Mods Loaded!",
  "OptiFine 120 FPS!",
  "Sleep is a social construct!",
  "Running on 16MB of RAM!",
  "Open World Mode Engaged!"
];

// Open World Constants
const WORLD_WIDTH = 120; // 120 blocks vast horizontal open world!
const WORLD_HEIGHT = 32; // 32 blocks deep from sky to bedrock
const DEFAULT_VIEW_COLS = 18; // Viewport visible columns
const DEFAULT_VIEW_ROWS = 12; // Viewport visible rows

// Generate vast procedural open world
const generateOpenWorld = (hasLuckyBlocks: boolean): { grid: GameBlock[][]; spawnX: number; spawnY: number } => {
  const grid: GameBlock[][] = [];
  const heightMap: number[] = [];

  // 1. Generate smooth rolling natural terrain heightmap
  for (let x = 0; x < WORLD_WIDTH; x++) {
    const h = Math.round(13 + Math.sin(x * 0.12) * 2.6 + Math.cos(x * 0.05) * 1.8);
    heightMap.push(Math.max(9, Math.min(18, h)));
  }

  // 2. Populate 2D Open World Matrix
  for (let r = 0; r < WORLD_HEIGHT; r++) {
    const row: GameBlock[] = [];
    for (let c = 0; c < WORLD_WIDTH; c++) {
      const surfaceY = heightMap[c];

      if (r === 31) {
        // Indestructible bedrock
        row.push({ type: 'bedrock' });
      } else if (r > 31) {
        row.push({ type: 'bedrock' });
      } else if (r === surfaceY) {
        // Surface Grass
        row.push({ type: 'grass' });
      } else if (r > surfaceY && r <= surfaceY + 3) {
        // Subsurface Dirt
        row.push({ type: 'dirt' });
      } else if (r > surfaceY + 3) {
        // Underground Stone & Mineral Veins
        const rand = (c * 37 + r * 19) % 100;
        if (r >= 26 && rand < 4) {
          row.push({ type: 'diamond' }); // Deep Diamonds!
        } else if (r >= 20 && rand >= 4 && rand < 8) {
          row.push({ type: 'gold' }); // Gold veins
        } else if (r >= 16 && rand >= 8 && rand < 15) {
          row.push({ type: 'iron' }); // Iron veins
        } else if (rand >= 15 && rand < 22) {
          row.push({ type: 'coal' }); // Coal veins
        } else if (rand === 99 && r >= 20) {
          row.push({ type: 'air' }); // Underground cave air pockets
        } else {
          row.push({ type: 'stone' });
        }
      } else {
        // Sky / Air above surface
        row.push({ type: 'air' });
      }
    }
    grid.push(row);
  }

  // 3. Plant Open World Trees and Flowers on the surface
  for (let c = 2; c < WORLD_WIDTH - 2; c++) {
    const surfaceY = heightMap[c];
    if (c % 7 === 3 && surfaceY >= 10) {
      if (surfaceY - 1 >= 0) grid[surfaceY - 1][c] = { type: 'wood' };
      if (surfaceY - 2 >= 0) grid[surfaceY - 2][c] = { type: 'wood' };
      if (surfaceY - 3 >= 0) grid[surfaceY - 3][c] = { type: 'wood' };

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -4; dy <= -3; dy++) {
          const ly = surfaceY + dy;
          const lx = c + dx;
          if (ly >= 0 && lx >= 0 && lx < WORLD_WIDTH) {
            if (grid[ly][lx].type === 'air') {
              grid[ly][lx] = { type: 'leaves' };
            }
          }
        }
      }
    } else if (c % 5 === 1) {
      if (surfaceY - 1 >= 0 && grid[surfaceY - 1][c].type === 'air') {
        grid[surfaceY - 1][c] = { type: 'flower' };
      }
    }
  }

  // 4. Lucky Block Mod: Spawn yellow [?] lucky blocks across surface
  if (hasLuckyBlocks) {
    for (let c = 5; c < WORLD_WIDTH - 5; c += 11) {
      const surfaceY = heightMap[c];
      if (surfaceY - 1 >= 0 && grid[surfaceY - 1][c].type === 'air') {
        grid[surfaceY - 1][c] = { type: 'lucky_block' };
      }
    }
  }

  // 5. Determine Spawn Point: Steve starts directly ON THE GROUND!
  const spawnX = 20;
  const spawnY = heightMap[spawnX] - 1;

  return { grid, spawnX, spawnY };
};

export const MinecraftLauncher: React.FC<MinecraftLauncherProps> = ({ onOpenCurseforge }) => {
  const [activeTab, setActiveTab] = useState<LauncherTab>('play');
  const [selectedVersion, setSelectedVersion] = useState<string>('Beta 1.7.3 (Forge Mod Loader)');
  const [username, setUsername] = useState<string>('SteveTheSlacker');
  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const [launchProgress, setLaunchProgress] = useState<number>(0);
  const [launchStatus, setLaunchStatus] = useState<string>('Ready to play');
  const [isPlayingGame, setIsPlayingGame] = useState<boolean>(false);
  const [screen, setScreen] = useState<'title' | 'world'>('title');
  const [splashText, setSplashText] = useState<string>(SPLASH_TEXTS[0]);

  // Mods Synchronization
  const [installedModIds, setInstalledModIds] = useState<string[]>(() => getInstalledModIds());
  const [enabledModIds, setEnabledModIds] = useState<string[]>(() => getEnabledModIds());

  useEffect(() => {
    const handleModsUpdate = () => {
      setInstalledModIds(getInstalledModIds());
      setEnabledModIds(getEnabledModIds());
    };
    window.addEventListener('minecraft-mods-updated', handleModsUpdate);
    return () => window.removeEventListener('minecraft-mods-updated', handleModsUpdate);
  }, []);

  // In-Game Active Mod States
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [isXrayActive, setIsXrayActive] = useState<boolean>(false);
  const [luckyToast, setLuckyToast] = useState<string>('');

  const hasOptifine = enabledModIds.includes('optifine');
  const hasLuckyBlock = enabledModIds.includes('lucky_block');
  const hasTreecapitator = enabledModIds.includes('treecapitator');
  const hasSuperPickaxe = enabledModIds.includes('super_pickaxe');
  const hasXray = enabledModIds.includes('xray');
  const hasJetpack = enabledModIds.includes('jetpack');

  // Open World State
  const [worldData, setWorldData] = useState(() => generateOpenWorld(hasLuckyBlock));
  const [worldGrid, setWorldGrid] = useState<GameBlock[][]>(() => worldData.grid);
  const [steveX, setSteveX] = useState<number>(() => worldData.spawnX);
  const [steveY, setSteveY] = useState<number>(() => worldData.spawnY);
  const [isFacingLeft, setIsFacingLeft] = useState<boolean>(false);

  // Mobs roaming the open world
  const [mobs, setMobs] = useState<Mob[]>([
    { id: 1, x: 26, y: 12, type: 'pig', name: 'Pig' },
    { id: 2, x: 38, y: 13, type: 'sheep', name: 'Sheep' },
    { id: 3, x: 55, y: 14, type: 'pig', name: 'Pig' },
    { id: 4, x: 12, y: 13, type: 'creeper', name: 'Creeper' },
    { id: 5, x: 74, y: 12, type: 'creeper', name: 'Creeper' },
  ]);

  // Inventory & Stats
  const [inventory, setInventory] = useState<Record<string, number>>({
    dirt: 8,
    wood: 4,
    stone: 0,
    coal: 0,
    iron: 0,
    diamond: 0,
  });
  const [selectedSlot, setSelectedSlot] = useState<string>('dirt');
  const [health, setHealth] = useState<number>(5);
  const [isDead, setIsDead] = useState<boolean>(false);
  const [deathMessage, setDeathMessage] = useState<string>('');
  const [dayTimeSeconds, setDayTimeSeconds] = useState<number>(60);

  // Day / Night Cycle Timer
  useEffect(() => {
    if (!isPlayingGame || screen !== 'world') return;
    const interval = setInterval(() => {
      setDayTimeSeconds((t) => (t + 1) % 180);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlayingGame, screen]);

  // Natural Gravity for Steve (Jetpack allows defying gravity)
  useEffect(() => {
    if (!isPlayingGame || screen !== 'world' || isDead) return;

    const gravityCheck = setInterval(() => {
      if (steveY + 1 < WORLD_HEIGHT) {
        const blockBelow = worldGrid[steveY + 1]?.[steveX];
        if (blockBelow && (blockBelow.type === 'air' || blockBelow.type === 'flower')) {
          setSteveY((y) => Math.min(WORLD_HEIGHT - 2, y + 1));
        }
      }
    }, 150);

    return () => clearInterval(gravityCheck);
  }, [isPlayingGame, screen, isDead, steveX, steveY, worldGrid]);

  // Keyboard controls for Open World Exploration & Mod Keybinds
  useEffect(() => {
    if (!isPlayingGame || screen !== 'world' || isDead) return;

    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        setIsFacingLeft(true);
        moveSteve(-1);
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        setIsFacingLeft(false);
        moveSteve(1);
      } else if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        handleJump();
      } else if (e.code === 'KeyC' && hasOptifine) {
        // OptiFine Zoom shortcut [C]
        e.preventDefault();
        sounds.playClick();
        setIsZoomed((z) => !z);
      } else if (e.code === 'KeyX' && hasXray) {
        // X-Ray shortcut [X]
        e.preventDefault();
        sounds.playClick();
        setIsXrayActive((x) => !x);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlayingGame, screen, isDead, steveX, steveY, worldGrid, hasOptifine, hasXray, hasJetpack]);

  // Open World Navigation with Auto-Step Up & Collision Detection
  const moveSteve = (dx: number) => {
    const targetX = Math.max(0, Math.min(WORLD_WIDTH - 1, steveX + dx));
    if (targetX === steveX) return;

    const currentLevelBlock = worldGrid[steveY]?.[targetX];

    if (!currentLevelBlock || currentLevelBlock.type === 'air' || currentLevelBlock.type === 'flower') {
      setSteveX(targetX);
    } else {
      // Auto-step up 1-block slopes
      const blockAboveObstacle = worldGrid[steveY - 1]?.[targetX];
      const headRoom = worldGrid[steveY - 1]?.[steveX];

      if (
        (!blockAboveObstacle || blockAboveObstacle.type === 'air' || blockAboveObstacle.type === 'flower') &&
        (!headRoom || headRoom.type === 'air' || headRoom.type === 'flower')
      ) {
        setSteveX(targetX);
        setSteveY(steveY - 1);
        sounds.playJump();
      }
    }
  };

  const handleJump = () => {
    // Jetpack Mod: continuous flight thrust upwards
    if (hasJetpack) {
      sounds.playJump();
      setSteveY((y) => Math.max(1, y - 2));
      return;
    }

    // Normal Jump: Only jump if resting on a solid block
    if (steveY + 1 < WORLD_HEIGHT) {
      const blockBelow = worldGrid[steveY + 1]?.[steveX];
      if (blockBelow && blockBelow.type !== 'air' && blockBelow.type !== 'flower') {
        sounds.playJump();
        const headroom1 = worldGrid[steveY - 1]?.[steveX]?.type === 'air';
        const headroom2 = worldGrid[steveY - 2]?.[steveX]?.type === 'air';

        if (headroom1 && headroom2) {
          setSteveY((y) => Math.max(0, y - 2));
        } else if (headroom1) {
          setSteveY((y) => Math.max(0, y - 1));
        }
      }
    }
  };

  // Trigger Lucky Block Event
  const triggerLuckyBlock = () => {
    sounds.playDing();
    sounds.playPop();

    const roll = Math.random();
    if (roll < 0.35) {
      // Diamond shower!
      setInventory((inv) => ({ ...inv, diamond: (inv.diamond || 0) + 8 }));
      setLuckyToast('✨ LUCKY! +8 Diamonds dropped into inventory!');
      sounds.speak('Jackpot! 8 sparkling diamonds.', 'clippy');
    } else if (roll < 0.65) {
      // Golden buffet!
      setHealth(5);
      setInventory((inv) => ({ ...inv, wood: (inv.wood || 0) + 12, dirt: (inv.dirt || 0) + 12 }));
      setLuckyToast('🥪 LUCKY! Golden Apple full heal & resources!');
    } else if (roll < 0.85) {
      // Animal party
      setMobs((m) => [
        ...m,
        { id: Date.now() + 1, x: steveX - 1, y: steveY, type: 'pig', name: 'Lucky Pig' },
        { id: Date.now() + 2, x: steveX + 1, y: steveY, type: 'sheep', name: 'Lucky Sheep' },
      ]);
      setLuckyToast('🐷 LUCKY! Animal companion stampede!');
    } else {
      // Troll explosion
      sounds.playExplosion();
      sounds.playOof();
      setHealth((h) => Math.max(1, h - 2));
      setLuckyToast('💥 UNLUCKY! Lucky block explosive prank!');
    }

    setTimeout(() => setLuckyToast(''), 3500);
  };

  // Mine Block in Open World with Mod Powers
  const handleMineBlock = (r: number, c: number) => {
    if (isDead) return;
    const block = worldGrid[r]?.[c];
    if (!block || block.type === 'air') return;
    if (block.type === 'bedrock') {
      sounds.playError();
      return;
    }

    sounds.playDig();
    const nextGrid = worldGrid.map((row) => row.map((cell) => ({ ...cell })));

    // Lucky Block Mod Handler
    if (block.type === 'lucky_block') {
      nextGrid[r][c].type = 'air';
      setWorldGrid(nextGrid);
      triggerLuckyBlock();
      return;
    }

    // Tinkers' 3x3 Hammer Mod: Mines a 3x3 area of blocks
    if (hasSuperPickaxe) {
      const minedItems: Record<string, number> = {};
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const targetR = r + dr;
          const targetC = c + dc;
          if (targetR >= 0 && targetR < WORLD_HEIGHT && targetC >= 0 && targetC < WORLD_WIDTH) {
            const b = nextGrid[targetR][targetC];
            if (b.type !== 'air' && b.type !== 'bedrock') {
              let key = b.type === 'grass' || b.type === 'flower' ? 'dirt' : b.type;
              minedItems[key] = (minedItems[key] || 0) + 1;
              nextGrid[targetR][targetC].type = 'air';
            }
          }
        }
      }
      setWorldGrid(nextGrid);
      setInventory((inv) => {
        const nextInv = { ...inv };
        Object.entries(minedItems).forEach(([k, count]) => {
          nextInv[k] = (nextInv[k] || 0) + count;
        });
        return nextInv;
      });
      sounds.playPop();
      return;
    }

    // TreeCapitator / Timber Mod: Collapses entire tree when wood is mined
    if (hasTreecapitator && block.type === 'wood') {
      let woodCount = 0;
      for (let dy = -6; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const tr = r + dy;
          const tc = c + dx;
          if (tr >= 0 && tr < WORLD_HEIGHT && tc >= 0 && tc < WORLD_WIDTH) {
            if (nextGrid[tr][tc].type === 'wood' || nextGrid[tr][tc].type === 'leaves') {
              if (nextGrid[tr][tc].type === 'wood') woodCount++;
              nextGrid[tr][tc].type = 'air';
            }
          }
        }
      }
      setWorldGrid(nextGrid);
      setInventory((inv) => ({ ...inv, wood: (inv.wood || 0) + Math.max(1, woodCount) }));
      sounds.playPop();
      return;
    }

    // Standard single block mining
    const minedType = block.type;
    nextGrid[r][c].type = 'air';
    setWorldGrid(nextGrid);

    let key = minedType;
    if (minedType === 'grass' || minedType === 'flower') key = 'dirt';

    setInventory((inv) => ({
      ...inv,
      [key]: (inv[key] || 0) + 1,
    }));

    if (minedType === 'diamond') {
      sounds.playDing();
      sounds.speak("Diamond found in the deep caverns! Still won't fix your procrastination though.", 'clippy');
    }
  };

  // Place Block in Open World
  const handlePlaceBlock = (r: number, c: number) => {
    if (isDead) return;
    const block = worldGrid[r]?.[c];
    if (!block || block.type !== 'air') return;
    if ((inventory[selectedSlot] || 0) <= 0) return;

    sounds.playDig();
    const nextGrid = worldGrid.map((row) => row.map((cell) => ({ ...cell })));
    nextGrid[r][c].type = selectedSlot as any;
    setWorldGrid(nextGrid);

    setInventory((inv) => ({
      ...inv,
      [selectedSlot]: Math.max(0, (inv[selectedSlot] || 0) - 1),
    }));
  };

  // Mob Interaction
  const handleMobClick = (mob: Mob) => {
    if (mob.type === 'creeper') {
      sounds.playOof();
      sounds.playExplosion();
      setHealth(0);
      setIsDead(true);
      const msg = "Steve was blown up by an unacknowledged deadline!";
      setDeathMessage(msg);
      sounds.speak(msg, 'clippy');
    } else {
      sounds.playPop();
      sounds.playDing();
      sounds.speak(`You pet the ${mob.name}! It appreciates your dedication to avoiding real work.`, 'clippy');
    }
  };

  // Reset World / Respawn Steve ON THE GROUND
  const respawnSteve = () => {
    sounds.playClick();
    setHealth(5);
    setIsDead(false);
    let groundY = 12;
    for (let r = 0; r < WORLD_HEIGHT; r++) {
      if (worldGrid[r][worldData.spawnX].type !== 'air') {
        groundY = r - 1;
        break;
      }
    }
    setSteveX(worldData.spawnX);
    setSteveY(groundY);
  };

  // Regenerate completely fresh open world
  const handleRegenerateWorld = () => {
    sounds.playClick();
    const fresh = generateOpenWorld(hasLuckyBlock);
    setWorldData(fresh);
    setWorldGrid(fresh.grid);
    setSteveX(fresh.spawnX);
    setSteveY(fresh.spawnY);
    setHealth(5);
    setIsDead(false);
  };

  // Launch Sequence
  const handleLaunch = () => {
    sounds.playClick();
    setIsLaunching(true);
    setLaunchProgress(10);
    setLaunchStatus('Initializing Minecraft Forge ModLoader...');

    setTimeout(() => {
      setLaunchProgress(35);
      setLaunchStatus(`Injecting ${enabledModIds.length} mods into Java classpath...`);
    }, 400);

    setTimeout(() => {
      setLaunchProgress(70);
      setLaunchStatus('Generating Open World with Forge entities...');
    }, 900);

    setTimeout(() => {
      setLaunchProgress(100);
      setLaunchStatus('Forge Minecraft Ready!');
    }, 1300);

    setTimeout(() => {
      setIsLaunching(false);
      setIsPlayingGame(true);
      setScreen('title');
      setSplashText(SPLASH_TEXTS[Math.floor(Math.random() * SPLASH_TEXTS.length)]);
      sounds.playDing();
    }, 1600);
  };

  // Camera Viewport bounds
  const VIEW_COLS = isZoomed ? 12 : DEFAULT_VIEW_COLS;
  const VIEW_ROWS = isZoomed ? 8 : DEFAULT_VIEW_ROWS;

  const viewStartX = Math.max(0, Math.min(WORLD_WIDTH - VIEW_COLS, steveX - Math.floor(VIEW_COLS / 2)));
  const viewStartY = Math.max(0, Math.min(WORLD_HEIGHT - VIEW_ROWS, steveY - Math.floor(VIEW_ROWS / 2)));

  // Dynamic Sky Color based on Day/Night Cycle
  const isNight = dayTimeSeconds > 90 && dayTimeSeconds < 160;
  const isSunset = (dayTimeSeconds >= 75 && dayTimeSeconds <= 90) || (dayTimeSeconds >= 160 && dayTimeSeconds <= 175);
  const skyBg = isNight 
    ? 'bg-gradient-to-b from-[#0b0e14] via-[#121926] to-[#1a2332]' 
    : isSunset 
    ? 'bg-gradient-to-b from-[#e65c00] via-[#f9d423] to-[#70a0ff]' 
    : 'bg-gradient-to-b from-[#4a90e2] to-[#70a0ff]';

  const currentBiome = steveY >= 20 
    ? 'Deep Caverns (Diamond Layer)' 
    : steveX < 35 
    ? 'Rolling Plains' 
    : steveX < 75 
    ? 'Oak & Birch Forest' 
    : 'Extreme Hills';

  const installedModsList = AVAILABLE_MODS.filter((m) => installedModIds.includes(m.id));

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white font-sans text-xs select-none overflow-hidden">
      {/* If Game is Running */}
      {isPlayingGame ? (
        <div className="flex-1 flex flex-col bg-[#2e1d13] relative overflow-hidden">
          {/* Top In-Game Header Bar */}
          <div className="bg-[#151515] px-3 py-1.5 flex items-center justify-between border-b-2 border-black text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 font-bold">Minecraft Beta 1.7.3 [Forge {enabledModIds.length} Mods]</span>
              {hasOptifine && <span className="text-[10px] text-green-400 bg-green-950/70 px-1.5 py-0.2 rounded border border-green-800">OptiFine 120 FPS</span>}
              <span className="text-[10px] text-gray-400 hidden sm:inline">Biome: {currentBiome}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRegenerateWorld}
                className="px-2 py-0.5 bg-[#333333] hover:bg-[#444444] text-gray-300 border border-gray-600 text-[10px] rounded-xs flex items-center gap-1"
                title="Generate new 120-block world"
              >
                <RotateCcw size={11} />
                <span>New Seed</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setIsPlayingGame(false);
                }}
                className="px-2 py-0.5 bg-[#404040] hover:bg-[#505050] text-gray-200 border border-gray-600 text-[11px] rounded-xs"
              >
                Exit to Launcher
              </button>
            </div>
          </div>

          {/* Minecraft Title Screen */}
          {screen === 'title' && (
            <div className="flex-1 flex flex-col items-center justify-center p-4 relative bg-[radial-gradient(#3a271d_1px,transparent_1px)] [background-size:16px_16px]">
              {/* Cracked 3D Minecraft Title Logo */}
              <div className="relative mb-6 text-center animate-bounce duration-1000">
                <div className="font-pixel text-4xl sm:text-5xl text-gray-300 font-extrabold tracking-widest drop-shadow-[4px_4px_0px_#000000]">
                  MINECRAFT
                </div>
                {/* Yellow Wobbling Splash Text */}
                <span className="absolute -bottom-3 -right-6 text-yellow-300 font-pixel text-xs sm:text-sm font-bold rotate-[-12deg] drop-shadow-[2px_2px_0px_#000000] tracking-wider animate-pulse">
                  {splashText}
                </span>
              </div>

              {/* Active Mods Pill on Title Screen */}
              {enabledModIds.length > 0 && (
                <div className="mb-4 bg-orange-950/80 border border-orange-600 px-3 py-1 rounded text-orange-300 font-mono text-[11px] flex items-center gap-1.5 shadow">
                  <Flame size={13} className="text-orange-400" />
                  <span>Minecraft Forge: {enabledModIds.length} Mods Loaded & Active</span>
                </div>
              )}

              {/* Classic Menu Buttons */}
              <div className="flex flex-col gap-2 w-64 max-w-full">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setScreen('world');
                  }}
                  className="w-full py-2 bg-[#555555] hover:bg-[#6a6a6a] active:bg-[#444444] border-2 border-t-gray-400 border-l-gray-400 border-b-black border-r-black text-white font-pixel text-sm tracking-wider shadow-lg flex items-center justify-center gap-2"
                >
                  <Pickaxe size={16} className="text-yellow-400" />
                  <span>Singleplayer (Open World)</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playError();
                    sounds.speak("0 Friends Online. They are all working on their careers.", 'clippy');
                  }}
                  className="w-full py-2 bg-[#444444] opacity-80 hover:opacity-100 border-2 border-t-gray-500 border-l-gray-500 border-b-black border-r-black text-gray-300 font-pixel text-sm tracking-wider"
                >
                  Multiplayer (0 Online)
                </button>

                {onOpenCurseforge && (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onOpenCurseforge();
                    }}
                    className="w-full py-1.5 bg-[#823a10] hover:bg-[#9a4515] border-2 border-t-orange-400 border-l-orange-400 border-b-black border-r-black text-orange-200 font-pixel text-xs tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <Flame size={13} />
                    <span>CurseForge Mod Portal</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsPlayingGame(false);
                  }}
                  className="w-full py-1.5 bg-[#3a3a3a] hover:bg-[#4a4a4a] border-2 border-t-gray-600 border-l-gray-600 border-b-black border-r-black text-gray-400 font-pixel text-xs"
                >
                  Quit Game
                </button>
              </div>

              <div className="absolute bottom-2 text-gray-400 font-pixel text-[10px]">
                Minecraft Beta 1.7.3 Forge Edition · {enabledModIds.length} Mods Active
              </div>
            </div>
          )}

          {/* Minecraft 2D Open World Screen */}
          {screen === 'world' && (
            <div className={`flex-1 flex flex-col ${skyBg} relative overflow-hidden transition-colors duration-1000`}>
              {/* Lucky Toast Popup */}
              {luckyToast && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 z-40 bg-amber-500 text-black border-2 border-white px-3 py-1.5 font-bold font-mono text-xs rounded shadow-2xl animate-bounce">
                  {luckyToast}
                </div>
              )}

              {/* Top HUD: Hearts, Hunger, F3 Coordinates, Active Mod Toggles */}
              <div className="p-2 flex items-center justify-between z-10 bg-black/40 backdrop-blur-xs font-mono text-xs border-b border-black/20">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-red-500">HP:</span>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-sm">
                        {i < health ? '❤️' : '🖤'}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="font-bold text-amber-400">Food:</span>
                    <span>🍗🍗🍗🍗🍗</span>
                  </div>
                </div>

                {/* In-Game Active Mod Controls Toolbar */}
                <div className="flex items-center gap-1.5">
                  {hasOptifine && (
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setIsZoomed(!isZoomed);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors flex items-center gap-1 ${
                        isZoomed 
                          ? 'bg-blue-600 text-white border-blue-300 animate-pulse' 
                          : 'bg-black/50 text-blue-300 border-blue-800 hover:bg-black/70'
                      }`}
                      title="Toggle OptiFine 2x Zoom ([C] key)"
                    >
                      <ZoomIn size={11} />
                      <span>{isZoomed ? 'Zoom 2x (ON)' : 'Zoom [C]'}</span>
                    </button>
                  )}

                  {hasXray && (
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setIsXrayActive(!isXrayActive);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors flex items-center gap-1 ${
                        isXrayActive 
                          ? 'bg-cyan-600 text-white border-cyan-300 animate-pulse' 
                          : 'bg-black/50 text-cyan-300 border-cyan-800 hover:bg-black/70'
                      }`}
                      title="Toggle X-Ray Ore Vision ([X] key)"
                    >
                      <Eye size={11} />
                      <span>{isXrayActive ? 'X-Ray (ON)' : 'X-Ray [X]'}</span>
                    </button>
                  )}

                  {hasSuperPickaxe && (
                    <span className="bg-orange-950/80 border border-orange-600 px-1.5 py-0.5 rounded text-[10px] text-orange-300 hidden md:inline">
                      🔨 3x3 Hammer Active
                    </span>
                  )}

                  {hasJetpack && (
                    <span className="bg-purple-950/80 border border-purple-600 px-1.5 py-0.5 rounded text-[10px] text-purple-300 hidden md:inline">
                      🚀 Jetpack Armed (Jump to Fly)
                    </span>
                  )}

                  {hasTreecapitator && (
                    <span className="bg-green-950/80 border border-green-600 px-1.5 py-0.5 rounded text-[10px] text-green-300 hidden lg:inline">
                      🪓 Timber Active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-black/40 px-2 py-0.5 rounded font-mono text-green-300 text-[10px] hidden sm:inline">
                    XYZ: {steveX}.0 / {32 - steveY}.0
                  </span>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      setScreen('title');
                    }}
                    className="px-2 py-0.5 bg-black/60 hover:bg-black text-white text-[10px] rounded"
                  >
                    Menu
                  </button>
                </div>
              </div>

              {/* Sun / Moon Moving in Sky */}
              {!isNight ? (
                <div 
                  className="absolute top-6 w-10 h-10 bg-yellow-200 border-2 border-white shadow-lg pointer-events-none transition-all duration-1000"
                  style={{ left: `${((dayTimeSeconds % 90) / 90) * 80 + 10}%` }}
                />
              ) : (
                <div 
                  className="absolute top-6 w-8 h-8 bg-gray-200 rounded-full border-2 border-white shadow-lg pointer-events-none transition-all duration-1000"
                  style={{ left: `${(((dayTimeSeconds - 90) % 90) / 90) * 80 + 10}%` }}
                />
              )}

              {/* Scrolling Clouds */}
              <div className="absolute top-10 left-12 w-28 h-6 bg-white/40 rounded-xs pointer-events-none" />
              <div className="absolute top-14 right-20 w-36 h-7 bg-white/30 rounded-xs pointer-events-none" />

              {/* OptiFine Telescope Zoom Overlay */}
              {isZoomed && (
                <div className="absolute inset-0 pointer-events-none z-30 border-[16px] border-black/70 rounded-full opacity-60 shadow-inner" />
              )}

              {/* 2D Voxel Open-World Viewport (Scrolling Camera tracks Steve!) */}
              <div className="flex-1 flex flex-col justify-center items-center p-2 relative overflow-hidden">
                <div 
                  className="grid gap-0 border-2 border-black/40 shadow-2xl bg-black/10 transition-transform duration-200"
                  style={{
                    gridTemplateColumns: `repeat(${VIEW_COLS}, minmax(0, 1fr))`,
                    width: '100%',
                    maxWidth: isZoomed ? '540px' : '680px',
                    aspectRatio: `${VIEW_COLS} / ${VIEW_ROWS}`,
                  }}
                >
                  {Array.from({ length: VIEW_ROWS }).map((_, viewR) =>
                    Array.from({ length: VIEW_COLS }).map((__, viewC) => {
                      const worldR = viewStartY + viewR;
                      const worldC = viewStartX + viewC;

                      if (worldR >= WORLD_HEIGHT || worldC >= WORLD_WIDTH) {
                        return <div key={`${viewR}-${viewC}`} className="bg-black aspect-square" />;
                      }

                      const block = worldGrid[worldR][worldC];
                      const isSteveHere = steveX === worldC && steveY === worldR;
                      const mobHere = mobs.find((m) => m.x === worldC && m.y === worldR);

                      let blockBg = 'transparent';
                      let borderColor = 'transparent';
                      let blockLabel = '';

                      // X-Ray Mod Logic: Make stone semi-transparent, highlight ores
                      const isOre = ['diamond', 'gold', 'iron', 'coal'].includes(block.type);

                      if (isXrayActive && block.type === 'stone') {
                        blockBg = 'bg-gray-900/15 border border-dashed border-gray-600/30';
                      } else if (block.type === 'grass') {
                        blockBg = 'bg-[#4c9141] border-t-4 border-t-[#5dbb50] border-b-[#785438]';
                        borderColor = 'border-black/20';
                      } else if (block.type === 'dirt') {
                        blockBg = isXrayActive ? 'bg-[#866043]/40' : 'bg-[#866043]';
                        borderColor = 'border-black/30';
                      } else if (block.type === 'stone') {
                        blockBg = 'bg-[#737373]';
                        borderColor = 'border-black/40';
                      } else if (block.type === 'wood') {
                        blockBg = 'bg-[#6d5032] border-x-2 border-x-[#4b3520]';
                      } else if (block.type === 'leaves') {
                        blockBg = 'bg-[#2e6d2e] opacity-95';
                        borderColor = 'border-[#1b431b]';
                      } else if (block.type === 'lucky_block') {
                        // Lucky Block Mod Visual
                        blockBg = 'bg-[#f59e0b] border-2 border-[#fbbf24] animate-pulse';
                        blockLabel = '❓';
                      } else if (block.type === 'diamond') {
                        blockBg = isXrayActive ? 'bg-cyan-500 border-2 border-cyan-200 animate-pulse shadow-lg' : 'bg-[#737373] border-cyan-400';
                        blockLabel = '💎';
                      } else if (block.type === 'gold') {
                        blockBg = isXrayActive ? 'bg-yellow-500 border-2 border-yellow-200 animate-pulse' : 'bg-[#737373] border-yellow-400';
                        blockLabel = '🟡';
                      } else if (block.type === 'iron') {
                        blockBg = isXrayActive ? 'bg-gray-300 border-2 border-white' : 'bg-[#737373] border-gray-400';
                        blockLabel = '⚙️';
                      } else if (block.type === 'coal') {
                        blockBg = isXrayActive ? 'bg-gray-950 border border-white' : 'bg-[#505050]';
                        blockLabel = '⚫';
                      } else if (block.type === 'flower') {
                        blockBg = 'transparent';
                        blockLabel = '🌼';
                      } else if (block.type === 'bedrock') {
                        blockBg = 'bg-[#222222] border-gray-700';
                        borderColor = 'border-black';
                      }

                      return (
                        <div
                          key={`${worldR}-${worldC}`}
                          onClick={() => {
                            if (block.type === 'air' || block.type === 'flower') {
                              handlePlaceBlock(worldR, worldC);
                            } else {
                              handleMineBlock(worldR, worldC);
                            }
                          }}
                          className={`relative aspect-square flex items-center justify-center border ${borderColor} ${blockBg} transition-transform active:scale-95 cursor-pointer`}
                        >
                          {blockLabel && <span className="text-[10px] select-none font-bold">{blockLabel}</span>}

                          {mobHere && !isSteveHere && (
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMobClick(mobHere);
                              }}
                              className="absolute inset-0 flex items-center justify-center text-sm cursor-pointer z-10 hover:scale-125 transition-transform"
                            >
                              {mobHere.type === 'creeper' ? '🧟' : mobHere.type === 'sheep' ? '🐑' : '🐷'}
                            </div>
                          )}

                          {isSteveHere && !isDead && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none animate-pulse">
                              <div className={`w-5 h-7 bg-[#00aaaa] border border-black flex flex-col items-center justify-center rounded-xs shadow ${isFacingLeft ? 'scale-x-[-1]' : ''}`}>
                                <div className="w-3.5 h-3 bg-[#b58763] border border-black text-[6px] text-center leading-none">
                                  👀
                                </div>
                                <div className="w-3.5 h-3 bg-[#0000aa] border-t border-black" />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Bottom Inventory Hotbar & Controls */}
              <div className="p-2 bg-[#1c1c1c] border-t-2 border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <span className="text-[10px] text-gray-400 font-mono font-bold mr-1">Hotbar:</span>
                  {(['dirt', 'wood', 'stone', 'coal', 'iron', 'diamond'] as const).map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedSlot(item);
                      }}
                      className={`px-2 py-1 flex items-center gap-1 border-2 font-mono text-[11px] rounded-xs ${
                        selectedSlot === item
                          ? 'border-white bg-[#3e3e3e] font-bold text-white'
                          : 'border-gray-600 bg-[#282828] text-gray-300'
                      }`}
                    >
                      <span className="capitalize">{item}</span>
                      <span className="bg-black/60 px-1 rounded text-[10px] text-yellow-300">
                        {inventory[item] || 0}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="text-[10px] text-gray-400 font-mono hidden sm:block">
                  Move: [A]/[D] · Jump: [W] {hasJetpack && '(Fly)'} · Click: Mine {hasSuperPickaxe && '(3x3)'}
                </div>
              </div>

              {/* Death Screen Modal */}
              {isDead && (
                <div className="absolute inset-0 bg-red-900/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-30">
                  <div className="font-pixel text-4xl text-red-500 font-bold drop-shadow-[3px_3px_0_#000] mb-2">
                    YOU DIED!
                  </div>
                  <p className="text-gray-200 font-pixel text-sm mb-4 max-w-sm">
                    {deathMessage}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={respawnSteve}
                      className="px-4 py-2 bg-[#555555] hover:bg-[#666666] border-2 border-t-gray-400 border-l-gray-400 border-b-black border-r-black text-white font-pixel text-xs"
                    >
                      Respawn on Ground
                    </button>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setScreen('title');
                      }}
                      className="px-4 py-2 bg-[#444444] hover:bg-[#555555] border-2 border-t-gray-400 border-l-gray-400 border-b-black border-r-black text-white font-pixel text-xs"
                    >
                      Title Screen
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Classic Minecraft Launcher Client View */
        <div className="flex-1 flex flex-col bg-[#2e2e2e]">
          {/* Top Launcher Header Bar */}
          <div className="bg-[#242424] border-b border-[#3a3a3a] px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#55aa33] border border-black shadow flex flex-col">
                <div className="h-2 bg-[#66bb44]" />
                <div className="flex-1 bg-[#866043]" />
              </div>
              <span className="font-bold text-sm tracking-wide text-gray-100 font-mono">
                MINECRAFT LAUNCHER 98
              </span>
            </div>

            {/* Navigation Tabs (Including dedicated MODS tab) */}
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setActiveTab('play')}
                className={`px-3 py-1 font-semibold rounded-xs transition-colors ${
                  activeTab === 'play'
                    ? 'bg-[#3c3c3c] text-white border-b-2 border-green-500'
                    : 'text-gray-400 hover:text-white hover:bg-[#333333]'
                }`}
              >
                Play
              </button>

              <button
                onClick={() => setActiveTab('mods')}
                className={`px-3 py-1 font-semibold rounded-xs transition-colors flex items-center gap-1 ${
                  activeTab === 'mods'
                    ? 'bg-[#3c3c3c] text-white border-b-2 border-orange-500'
                    : 'text-gray-400 hover:text-white hover:bg-[#333333]'
                }`}
              >
                <Flame size={12} className="text-orange-400" />
                <span>Mods ({enabledModIds.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('installations')}
                className={`px-3 py-1 font-semibold rounded-xs transition-colors ${
                  activeTab === 'installations'
                    ? 'bg-[#3c3c3c] text-white border-b-2 border-green-500'
                    : 'text-gray-400 hover:text-white hover:bg-[#333333]'
                }`}
              >
                Installations
              </button>

              <button
                onClick={() => setActiveTab('skins')}
                className={`px-3 py-1 font-semibold rounded-xs transition-colors ${
                  activeTab === 'skins'
                    ? 'bg-[#3c3c3c] text-white border-b-2 border-green-500'
                    : 'text-gray-400 hover:text-white hover:bg-[#333333]'
                }`}
              >
                Skins
              </button>

              <button
                onClick={() => setActiveTab('patch_notes')}
                className={`px-3 py-1 font-semibold rounded-xs transition-colors ${
                  activeTab === 'patch_notes'
                    ? 'bg-[#3c3c3c] text-white border-b-2 border-green-500'
                    : 'text-gray-400 hover:text-white hover:bg-[#333333]'
                }`}
              >
                Patch Notes
              </button>

              <button
                onClick={() => setActiveTab('console')}
                className={`px-3 py-1 font-semibold rounded-xs transition-colors ${
                  activeTab === 'console'
                    ? 'bg-[#3c3c3c] text-white border-b-2 border-green-500'
                    : 'text-gray-400 hover:text-white hover:bg-[#333333]'
                }`}
              >
                Java Logs
              </button>
            </div>
          </div>

          {/* Launcher Body Content */}
          <div className="flex-1 overflow-y-auto p-3">
            {activeTab === 'play' && (
              <div className="flex flex-col gap-3">
                {/* Hero Banner */}
                <div className="relative h-44 bg-gradient-to-b from-[#1b3d66] to-[#4c7841] rounded-xs border border-gray-700 overflow-hidden flex flex-col justify-end p-4 shadow-inner">
                  <div className="absolute top-3 left-4 flex items-center gap-2">
                    <span className="text-yellow-300 font-pixel text-lg font-bold drop-shadow">
                      FORGE MODDED MINECRAFT 98
                    </span>
                    <span className="bg-orange-600 text-white font-mono text-[10px] px-2 py-0.5 rounded shadow">
                      {enabledModIds.length} Mods Active
                    </span>
                  </div>
                  <p className="text-gray-200 text-xs max-w-md drop-shadow mb-2">
                    Enhanced with community mods downloaded via CurseForge. Experience OptiFine zoom, lucky block drops, X-Ray vision, and 3x3 quarry mining!
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-gray-300 font-mono">
                    <span className="px-2 py-0.5 bg-black/50 rounded">Version: Beta 1.7.3 (Forge)</span>
                    <span className="px-2 py-0.5 bg-black/50 rounded">World: 120x32 Blocks</span>
                  </div>
                </div>

                {/* News Cards */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#242424] p-2.5 rounded border border-gray-700">
                    <div className="font-bold text-orange-400 mb-1 flex items-center gap-1">
                      <Flame size={13} />
                      <span>CurseForge Mod Integration Active</span>
                    </div>
                    <p className="text-[11px] text-gray-300 leading-snug">
                      Download mods directly from Internet Explorer to <code className="text-yellow-300">C:\.minecraft\mods\</code> and toggle them in the Mods tab.
                    </p>
                  </div>

                  <div className="bg-[#242424] p-2.5 rounded border border-gray-700">
                    <div className="font-bold text-green-400 mb-1 flex items-center gap-1">
                      <FileText size={13} />
                      <span>Active Mods in Classpath</span>
                    </div>
                    <p className="text-[11px] text-gray-300 leading-snug">
                      {enabledModIds.length > 0
                        ? `Loaded: ${enabledModIds.join(', ')}.`
                        : 'No mods currently enabled. Visit CurseForge in Internet Explorer!'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: FORGE MODS MANAGER */}
            {activeTab === 'mods' && (
              <div className="flex flex-col gap-3">
                {/* Header bar with CurseForge Link */}
                <div className="bg-[#242424] p-3 rounded border border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-sm text-gray-100 flex items-center gap-2">
                      <FolderOpen size={16} className="text-orange-400" />
                      <span>Mods Directory: <code className="text-yellow-300 font-mono text-xs">C:\.minecraft\mods\</code></span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      {installedModIds.length} mods installed · {enabledModIds.length} loaded into Java runtime
                    </div>
                  </div>

                  {onOpenCurseforge && (
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onOpenCurseforge();
                      }}
                      className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow border border-orange-400 active:scale-95 transition-transform"
                    >
                      <Flame size={13} />
                      <span>Browse CurseForge in Browser</span>
                    </button>
                  )}
                </div>

                {/* Mod List */}
                {installedModsList.length === 0 ? (
                  <div className="bg-[#242424] p-6 rounded border border-gray-700 text-center text-gray-400 space-y-2">
                    <Flame size={32} className="mx-auto text-orange-400 opacity-60" />
                    <div className="font-bold text-gray-200">No Mods in Mods Directory</div>
                    <p className="text-xs max-w-sm mx-auto">
                      Open Internet Explorer and visit <strong>CurseForge</strong> to download OptiFine, Lucky Blocks, 3x3 Hammer, and X-Ray!
                    </p>
                    {onOpenCurseforge && (
                      <button
                        onClick={onOpenCurseforge}
                        className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded font-bold text-xs inline-flex items-center gap-1 shadow"
                      >
                        <ExternalLink size={13} />
                        <span>Open CurseForge</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {installedModsList.map((mod) => {
                      const isEnabled = enabledModIds.includes(mod.id);

                      return (
                        <div
                          key={mod.id}
                          className={`p-3 rounded border flex items-center justify-between transition-colors ${
                            isEnabled
                              ? 'bg-[#293328] border-green-600'
                              : 'bg-[#242424] border-gray-700 opacity-70'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{mod.icon}</div>
                            <div>
                              <div className="font-bold text-gray-100 flex items-center gap-2">
                                <span>{mod.name}</span>
                                <span className="text-[10px] text-gray-400 font-mono">({mod.version})</span>
                                <span className="text-[10px] bg-black/40 text-orange-400 px-1.5 py-0.2 rounded font-mono border border-orange-950">
                                  {mod.category}
                                </span>
                              </div>
                              <div className="text-[11px] text-gray-300">{mod.description}</div>
                              <div className="text-[10px] text-amber-300 font-mono mt-0.5">
                                ⚡ {mod.inGameEffect}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                sounds.playClick();
                                toggleModEnabled(mod.id);
                              }}
                              className={`px-3 py-1 rounded text-xs font-bold border transition-colors ${
                                isEnabled
                                  ? 'bg-green-700 hover:bg-green-600 text-white border-green-500'
                                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600'
                              }`}
                            >
                              {isEnabled ? '✓ Enabled' : 'Disabled'}
                            </button>

                            <button
                              onClick={() => {
                                sounds.playTrash();
                                uninstallMod(mod.id);
                              }}
                              className="p-1.5 hover:bg-red-950 text-gray-400 hover:text-red-400 rounded transition-colors"
                              title="Delete .jar from mods folder"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'installations' && (
              <div className="flex flex-col gap-2">
                <div className="font-bold text-gray-200 mb-1">Installed Profiles:</div>
                {[
                  { name: `Beta 1.7.3 (Forge Mod Loader - ${enabledModIds.length} Mods)`, desc: 'Open world rolling hills with active CurseForge mods.', date: 'Current' },
                  { name: 'Beta 1.7.3 Vanilla (Golden Nostalgia)', desc: 'The golden age before hunger bars and adult responsibilities.', date: 'July 2011' },
                  { name: 'Release 1.0 (End of Social Life)', desc: 'The Ender Dragon update where friendships disappeared.', date: 'Nov 2011' },
                  { name: 'Alpha 1.2.6 (Herobrine & Dread)', desc: 'Neon green grass, spooky cave noises, zero torches left.', date: 'Dec 2010' }
                ].map((inst) => (
                  <div
                    key={inst.name}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedVersion(inst.name);
                    }}
                    className={`p-2.5 rounded border flex items-center justify-between cursor-pointer transition-colors ${
                      selectedVersion === inst.name
                        ? 'bg-[#334433] border-green-500'
                        : 'bg-[#242424] border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-gray-100">{inst.name}</div>
                      <div className="text-[11px] text-gray-400">{inst.desc}</div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">{inst.date}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'skins' && (
              <div className="flex flex-col gap-3">
                <div className="font-bold text-gray-200">Active Skin Closet:</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: 'Classic Steve', desc: 'Teal shirt, blue pants, grounded explorer', icon: '🧑' },
                    { name: 'Clippy Steve', desc: 'Made of galvanized steel paperclip wire', icon: '📎' },
                    { name: 'Herobrine 98', desc: 'White eyes caused by blue screen glare', icon: '👻' }
                  ].map((s) => (
                    <div key={s.name} className="p-3 bg-[#242424] border border-gray-700 rounded text-center">
                      <div className="text-3xl mb-1">{s.icon}</div>
                      <div className="font-bold text-gray-200">{s.name}</div>
                      <div className="text-[10px] text-gray-400">{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'patch_notes' && (
              <div className="bg-[#242424] p-3 rounded border border-gray-700 font-mono text-[11px] space-y-2">
                <div className="text-green-400 font-bold border-b border-gray-700 pb-1">
                  Minecraft 98 Forge Edition - Patch Notes
                </div>
                <div>+ Integrated CurseForge mod repository in Internet Explorer</div>
                <div>+ Added automatic .jar file downloader to C:\.minecraft\mods\</div>
                <div>+ Added OptiFine 2x Zoom camera control ([C] key)</div>
                <div>+ Added Lucky Block unpredictable drops (diamonds, stampedes, TNT)</div>
                <div>+ Added TreeCapitator / Timber instant tree felling</div>
                <div>+ Added Tinkers' 3x3 quarry hammer mining</div>
                <div>+ Added X-Ray ore vision ([X] key)</div>
                <div>+ Added Industrial Jetpack vertical flight</div>
              </div>
            )}

            {activeTab === 'console' && (
              <div className="bg-black p-2.5 rounded border border-gray-700 font-mono text-[10px] text-green-400 space-y-1 h-52 overflow-y-auto">
                <div>[07:20:01] [Client thread/INFO]: Setting user: {username}</div>
                <div>[07:20:02] [Client thread/INFO]: Loading Forge Mod Loader for Beta 1.7.3</div>
                <div>[07:20:03] [Forge/INFO]: Found {installedModIds.length} mods in C:\.minecraft\mods\</div>
                {enabledModIds.map((m) => (
                  <div key={m}>[Forge/INFO]: Activating mod: {m} (State: AVAILABLE)</div>
                ))}
                <div>[07:20:05] [Forge/INFO]: Injecting custom hooks into Block.class & Player.class</div>
                <div>[07:20:06] [Client thread/INFO]: SoundSystem initialized. Playing C418 - Subwoofer Lullaby.</div>
                <div>[07:20:07] [Client thread/WARN]: Procrastination level exceeding safe thresholds.</div>
              </div>
            )}
          </div>

          {/* Bottom Launch Control Dock */}
          <div className="bg-[#1c1c1c] border-t border-[#3a3a3a] p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold">User Profile</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-[#2a2a2a] border border-gray-600 px-2 py-0.5 text-xs text-white rounded w-36 font-mono"
                />
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold">Forge Profile</span>
                <span className="text-xs text-gray-200 font-bold truncate max-w-[200px]">
                  Beta 1.7.3 ({enabledModIds.length} Mods Active)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isLaunching ? (
                <div className="flex flex-col items-end w-48">
                  <span className="text-[10px] text-yellow-300 font-mono truncate">{launchStatus}</span>
                  <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-green-500 h-full transition-all duration-300"
                      style={{ width: `${launchProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleLaunch}
                  className="px-8 py-2.5 bg-[#40aa25] hover:bg-[#4bc72c] active:bg-[#348c1e] text-white font-pixel text-base font-extrabold tracking-wider border-2 border-t-[#66e045] border-l-[#66e045] border-b-[#206012] border-r-[#206012] rounded shadow-lg flex items-center gap-2 active:scale-95"
                >
                  <Play size={16} fill="currentColor" />
                  <span>PLAY (MODDED)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
