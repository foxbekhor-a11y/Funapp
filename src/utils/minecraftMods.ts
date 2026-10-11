export interface MinecraftMod {
  id: string;
  name: string;
  filename: string;
  description: string;
  author: string;
  category: 'Optimization' | 'Gameplay' | 'Tools' | 'World Gen' | 'Utility';
  version: string;
  fileSize: string;
  downloads: string;
  icon: string;
  color: string;
  badge: string;
  inGameEffect: string;
}

export const AVAILABLE_MODS: MinecraftMod[] = [
  {
    id: 'optifine',
    name: 'OptiFine HD 98',
    filename: 'OptiFine_1.7.3_HD_U.jar',
    description: 'Doubles FPS, adds dynamic torch lighting & allows zooming in with the [C] key.',
    author: 'sp614x',
    category: 'Optimization',
    version: 'Beta 1.7.3_HD_U',
    fileSize: '428 KB',
    downloads: '42.5M',
    icon: '🔍',
    color: 'from-blue-600 to-indigo-700',
    badge: 'Essential',
    inGameEffect: 'Press [C] or click Zoom to toggle 2x camera zoom!'
  },
  {
    id: 'lucky_block',
    name: 'Lucky Block Mod',
    filename: 'LuckyBlock_v5.1_Forge.jar',
    description: 'Spawns mysterious [?] Lucky Blocks in the world. Mining them triggers crazy loot showers or explosions!',
    author: 'PlayerInDistress',
    category: 'Gameplay',
    version: 'v5.1.0',
    fileSize: '312 KB',
    downloads: '28.1M',
    icon: '❓',
    color: 'from-amber-500 to-yellow-600',
    badge: 'Popular',
    inGameEffect: 'Spawns golden [?] blocks! Break them for diamond showers, mobs, or surprise explosions.'
  },
  {
    id: 'treecapitator',
    name: 'TreeCapitator / Timber',
    filename: 'TreeCapitator.1.7.3.jar',
    description: 'Fell whole trees with a single chop! Mining any tree log collapses the entire trunk and leaves instantly.',
    author: 'bspkrs',
    category: 'Tools',
    version: 'v1.2.9',
    fileSize: '154 KB',
    downloads: '35.2M',
    icon: '🪓',
    color: 'from-emerald-600 to-green-700',
    badge: 'Quality of Life',
    inGameEffect: 'Mine one log and the whole tree collapses into wood and sapling drops!'
  },
  {
    id: 'super_pickaxe',
    name: 'Tinkers 3x3 Hammer',
    filename: 'TConstruct_Hammer_1.7.3.jar',
    description: 'Replaces your standard pickaxe with a colossal mining hammer that excavates 3x3 areas of stone and ore at once.',
    author: 'mDiyo',
    category: 'Tools',
    version: 'v1.7.3',
    fileSize: '680 KB',
    downloads: '31.4M',
    icon: '🔨',
    color: 'from-red-600 to-orange-700',
    badge: 'Excavation',
    inGameEffect: 'Mine blocks in a 3x3 area! Clear caves and quarry stone effortlessly.'
  },
  {
    id: 'xray',
    name: 'X-Ray Vision Mod',
    filename: 'XRay_Mod_v2.4.jar',
    description: 'Highlights underground diamond, gold, and iron veins through opaque stone.',
    author: 'MinecraftCheater98',
    category: 'Utility',
    version: 'v2.4',
    fileSize: '110 KB',
    downloads: '19.8M',
    icon: '💎',
    color: 'from-cyan-600 to-teal-700',
    badge: 'Ores',
    inGameEffect: 'Press [X] or click X-Ray to make stone transparent and see hidden diamond veins!'
  },
  {
    id: 'jetpack',
    name: 'Industrial Jetpack',
    filename: 'IC2_Jetpack_v1.10.jar',
    description: 'Equip Steve with a fuel-powered jetpack! Hold [W] or [Space] to fly into the clouds and survey your world.',
    author: 'Alblaka',
    category: 'Gameplay',
    version: 'v1.10',
    fileSize: '512 KB',
    downloads: '22.3M',
    icon: '🚀',
    color: 'from-purple-600 to-pink-700',
    badge: 'Flight',
    inGameEffect: 'Hold [Space] or [W] to fly upwards continuously through the skies!'
  }
];

const STORAGE_KEY = 'win98_minecraft_installed_mods';
const ENABLED_STORAGE_KEY = 'win98_minecraft_enabled_mods';

export const getInstalledModIds = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : ['optifine']; // Default with optifine for instant goodness
  } catch (e) {
    return ['optifine'];
  }
};

export const getEnabledModIds = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ENABLED_STORAGE_KEY);
    return raw ? JSON.parse(raw) : ['optifine'];
  } catch (e) {
    return ['optifine'];
  }
};

export const installMod = (modId: string): void => {
  if (typeof window === 'undefined') return;
  try {
    const installed = getInstalledModIds();
    if (!installed.includes(modId)) {
      installed.push(modId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(installed));
    }
    const enabled = getEnabledModIds();
    if (!enabled.includes(modId)) {
      enabled.push(modId);
      localStorage.setItem(ENABLED_STORAGE_KEY, JSON.stringify(enabled));
    }
    window.dispatchEvent(new CustomEvent('minecraft-mods-updated'));
  } catch (e) {}
};

export const uninstallMod = (modId: string): void => {
  if (typeof window === 'undefined') return;
  try {
    const installed = getInstalledModIds().filter((id) => id !== modId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(installed));
    const enabled = getEnabledModIds().filter((id) => id !== modId);
    localStorage.setItem(ENABLED_STORAGE_KEY, JSON.stringify(enabled));
    window.dispatchEvent(new CustomEvent('minecraft-mods-updated'));
  } catch (e) {}
};

export const toggleModEnabled = (modId: string): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const enabled = getEnabledModIds();
    let isNowEnabled = false;
    let next: string[];
    if (enabled.includes(modId)) {
      next = enabled.filter((id) => id !== modId);
      isNowEnabled = false;
    } else {
      next = [...enabled, modId];
      isNowEnabled = true;
    }
    localStorage.setItem(ENABLED_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('minecraft-mods-updated'));
    return isNowEnabled;
  } catch (e) {
    return false;
  }
};

export const isModInstalled = (modId: string): boolean => {
  return getInstalledModIds().includes(modId);
};

export const isModEnabled = (modId: string): boolean => {
  return getEnabledModIds().includes(modId);
};
