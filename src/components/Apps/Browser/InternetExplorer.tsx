import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  X, 
  Home, 
  Search, 
  Star, 
  Printer, 
  Globe, 
  Lock, 
  ShieldCheck, 
  ChevronDown, 
  PhoneCall, 
  Sparkles,
  ExternalLink,
  BookOpen,
  ShoppingBag,
  Smile,
  Flame,
  Download,
  Check,
  FolderOpen,
  Play,
  Layers,
  SlidersHorizontal,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { sounds } from '../../../utils/soundEffects';
import { 
  AVAILABLE_MODS, 
  MinecraftMod, 
  getInstalledModIds, 
  getEnabledModIds, 
  installMod, 
  uninstallMod, 
  toggleModEnabled 
} from '../../../utils/minecraftMods';

interface InternetExplorerProps {
  onOpenMinecraft?: () => void;
}

export const InternetExplorer: React.FC<InternetExplorerProps> = ({ onOpenMinecraft }) => {
  const [currentUrl, setCurrentUrl] = useState<string>('http://www.yahooligans98.com');
  const [inputUrl, setInputUrl] = useState<string>('http://www.yahooligans98.com');
  const [history, setHistory] = useState<string[]>(['http://www.yahooligans98.com']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>('Done');
  const [spinningFrame, setSpinningFrame] = useState<number>(0);

  // CurseForge Mod Portal State
  const [installedModIds, setInstalledModIds] = useState<string[]>(() => getInstalledModIds());
  const [enabledModIds, setEnabledModIds] = useState<string[]>(() => getEnabledModIds());
  const [curseCategory, setCurseCategory] = useState<string>('All');
  const [curseSearch, setCurseSearch] = useState<string>('');
  const [downloadingMod, setDownloadingMod] = useState<MinecraftMod | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadSpeed, setDownloadSpeed] = useState<string>('14.4 KB/sec');

  // Sync with mods store
  useEffect(() => {
    const handleModsUpdate = () => {
      setInstalledModIds(getInstalledModIds());
      setEnabledModIds(getEnabledModIds());
    };
    window.addEventListener('minecraft-mods-updated', handleModsUpdate);
    return () => window.removeEventListener('minecraft-mods-updated', handleModsUpdate);
  }, []);

  // Ask Clippy Search Engine state
  const [askQuery, setAskQuery] = useState<string>('');
  const [askResult, setAskResult] = useState<string | null>(null);

  // GeoCities Guestbook state
  const [guestName, setGuestName] = useState<string>('');
  const [guestMessage, setGuestMessage] = useState<string>('');
  const [guestbookEntries, setGuestbookEntries] = useState<Array<{ name: string; msg: string; date: string }>>([
    { name: 'CyberCool99', msg: 'Awesome homepage!! Please sign my guestbook too!! *~*~*', date: '10/02/1998' },
    { name: 'Xx_Neo_xX', msg: 'Nice background music. Where did you get that MIDI file?', date: '09/28/1998' },
    { name: 'Sarah_K', msg: 'Under construction sign is so cute! Netscape rules IE drools!!', date: '09/14/1998' },
  ]);

  // Amazon cart state
  const [cartCount, setCartCount] = useState<number>(0);
  const [cartToast, setCartToast] = useState<string>('');

  // Hamster dance audio state
  const [hamsterDancing, setHamsterDancing] = useState<boolean>(true);

  // Dial-up connection simulation modal
  const [showDialupModal, setShowDialupModal] = useState<boolean>(false);
  const [dialupStep, setDialupStep] = useState<string>('Dialing 1-800-AOL-FREE...');
  const [isConnected, setIsConnected] = useState<boolean>(true);

  // Animate the spinning "e" logo when loading
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setSpinningFrame((f) => (f + 1) % 8);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Navigate to URL
  const navigateTo = (url: string) => {
    sounds.playPageClick();
    setIsLoading(true);
    setStatusText(`Connecting to ${url}...`);

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'http://' + formattedUrl;
    }

    setTimeout(() => {
      setStatusText(`Opening page ${formattedUrl}...`);
    }, 200);

    setTimeout(() => {
      setCurrentUrl(formattedUrl);
      setInputUrl(formattedUrl);
      setIsLoading(false);
      setStatusText('Done');

      // Update history stack
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(formattedUrl);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }, 450);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      sounds.playPageClick();
      const prevUrl = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setCurrentUrl(prevUrl);
      setInputUrl(prevUrl);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      sounds.playPageClick();
      const nextUrl = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setCurrentUrl(nextUrl);
      setInputUrl(nextUrl);
    }
  };

  const handleRefresh = () => {
    sounds.playPageClick();
    setIsLoading(true);
    setStatusText(`Reloading ${currentUrl}...`);
    setTimeout(() => {
      setIsLoading(false);
      setStatusText('Done');
    }, 300);
  };

  // Trigger Dial-Up Connection
  const triggerDialup = () => {
    sounds.playClick();
    setShowDialupModal(true);
    setDialupStep('Dialing 555-0199 (Baud Rate: 56,000)...');
    sounds.playDialup();

    setTimeout(() => {
      setDialupStep('Handshaking with ISP server...');
    }, 1200);

    setTimeout(() => {
      setDialupStep('Authenticating credentials: Guest / Password123...');
    }, 2200);

    setTimeout(() => {
      setDialupStep('Connected at 56,000 bps! Welcome to Cyberspace.');
      setIsConnected(true);
      setTimeout(() => setShowDialupModal(false), 800);
    }, 3200);
  };

  // Trigger Windows 98 File Download for Minecraft Mod
  const handleStartDownloadMod = (mod: MinecraftMod) => {
    sounds.playClick();
    setDownloadingMod(mod);
    setDownloadProgress(5);
    setDownloadSpeed('14.4 KB/sec');

    // Simulate authentic 90s dial-up file download progress
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          installMod(mod.id);
          sounds.playDing();
          sounds.playPop();
          return 100;
        }
        return prev + 15;
      });
    }, 350);
  };

  // Ask Clippy Search Answer
  const handleAskClippy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuery.trim()) return;

    sounds.playClick();
    const query = askQuery.toLowerCase();
    let answer = "";

    if (query.includes('life') || query.includes('future') || query.includes('purpose')) {
      answer = "According to Windows 98 Kernel Knowledgebase: Your life is currently running without sufficient swap space. Have you tried lowering your standards?";
    } else if (query.includes('work') || query.includes('job') || query.includes('boss')) {
      answer = "Statistical analysis confirms: 89% of computer work is minimizing Solitaire when footsteps approach. We recommend nodding attentively while thinking about lunch.";
    } else if (query.includes('money') || query.includes('rich') || query.includes('broke')) {
      answer = "Search result: Financial freedom is located in C:\\Delusions\\Lottery.exe. File not found. Would you like me to open a blank Excel spreadsheet of despair?";
    } else if (query.includes('love') || query.includes('relationship') || query.includes('dating')) {
      answer = "Dial-up connection to 'Soulmate' timed out after 30 seconds. Remote server reported: 'Seen 2 hours ago'.";
    } else {
      answer = `It looks like you searched for "${askQuery.slice(0, 30)}"! Top recommendation: Close this browser and complete at least one responsibility today.`;
    }

    setAskResult(answer);
    sounds.speak(answer, 'clippy');
  };

  // GeoCities guestbook submission
  const handleAddGuestbook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestMessage.trim()) return;
    sounds.playClick();
    setGuestbookEntries([
      { name: guestName.trim(), msg: guestMessage.trim(), date: 'Today' },
      ...guestbookEntries,
    ]);
    setGuestName('');
    setGuestMessage('');
    sounds.playDing();
  };

  const handleBuyBook = (title: string) => {
    sounds.playDing();
    setCartCount((c) => c + 1);
    setCartToast(`Added "${title}" to your 1998 Shopping Cart!`);
    setTimeout(() => setCartToast(''), 3000);
  };

  // Filter CurseForge mods
  const filteredMods = AVAILABLE_MODS.filter((mod) => {
    const matchesCategory = curseCategory === 'All' || mod.category === curseCategory;
    const matchesSearch = 
      mod.name.toLowerCase().includes(curseSearch.toLowerCase()) || 
      mod.description.toLowerCase().includes(curseSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-win98 text-xs select-none overflow-hidden">
      {/* 1. Menu Bar */}
      <div className="bg-[#c0c0c0] px-2 py-0.5 border-b border-[#808080] flex items-center gap-3 text-black">
        <span className="cursor-pointer hover:bg-[#000080] hover:text-white px-1">File</span>
        <span className="cursor-pointer hover:bg-[#000080] hover:text-white px-1">Edit</span>
        <span className="cursor-pointer hover:bg-[#000080] hover:text-white px-1">View</span>
        <span 
          onClick={() => navigateTo('http://www.yahooligans98.com')} 
          className="cursor-pointer hover:bg-[#000080] hover:text-white px-1"
        >
          Favorites
        </span>
        <span className="cursor-pointer hover:bg-[#000080] hover:text-white px-1">Help</span>
      </div>

      {/* 2. Standard Buttons Toolbar */}
      <div className="bg-[#c0c0c0] p-1 border-b border-[#808080] flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-1">
          {/* Back Button */}
          <button
            onClick={handleBack}
            disabled={historyIndex <= 0}
            className="win98-btn flex flex-col items-center justify-center px-2 py-1 min-w-[42px] disabled:opacity-40"
            title="Back"
          >
            <ArrowLeft size={16} className="text-[#000080]" />
            <span className="text-[10px]">Back</span>
          </button>

          {/* Forward Button */}
          <button
            onClick={handleForward}
            disabled={historyIndex >= history.length - 1}
            className="win98-btn flex flex-col items-center justify-center px-2 py-1 min-w-[42px] disabled:opacity-40"
            title="Forward"
          >
            <ArrowRight size={16} className="text-[#000080]" />
            <span className="text-[10px]">Forward</span>
          </button>

          {/* Stop Button */}
          <button
            onClick={() => {
              setIsLoading(false);
              setStatusText('Stopped');
            }}
            className="win98-btn flex flex-col items-center justify-center px-2 py-1 min-w-[40px]"
            title="Stop"
          >
            <X size={16} className="text-red-700" />
            <span className="text-[10px]">Stop</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="win98-btn flex flex-col items-center justify-center px-2 py-1 min-w-[42px]"
            title="Refresh"
          >
            <RotateCw size={15} className={`text-green-800 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="text-[10px]">Refresh</span>
          </button>

          {/* Home Button */}
          <button
            onClick={() => navigateTo('http://www.yahooligans98.com')}
            className="win98-btn flex flex-col items-center justify-center px-2 py-1 min-w-[42px]"
            title="Home"
          >
            <Home size={15} className="text-amber-800" />
            <span className="text-[10px]">Home</span>
          </button>

          <div className="h-6 w-[1px] bg-gray-400 mx-1" />

          {/* Search Button */}
          <button
            onClick={() => navigateTo('http://www.askclippy.com')}
            className="win98-btn flex flex-col items-center justify-center px-2 py-1 min-w-[42px]"
            title="Search"
          >
            <Search size={15} className="text-blue-800" />
            <span className="text-[10px]">Search</span>
          </button>

          {/* Dial-Up Connect Button */}
          <button
            onClick={triggerDialup}
            className="win98-btn flex flex-col items-center justify-center px-2 py-1 min-w-[46px]"
            title="Reconnect Dial-up"
          >
            <PhoneCall size={15} className="text-purple-800" />
            <span className="text-[10px]">Dial-Up</span>
          </button>
        </div>

        {/* 3D Spinning Internet Explorer Logo */}
        <div className="w-8 h-8 win98-sunken bg-white flex items-center justify-center overflow-hidden border border-gray-600">
          <div className={`text-lg font-bold text-blue-600 transition-transform duration-100 ${isLoading ? 'rotate-[45deg] scale-110' : ''}`}>
            🌐
          </div>
        </div>
      </div>

      {/* 3. Address Bar */}
      <div className="bg-[#c0c0c0] px-2 py-1 border-b border-[#808080] flex items-center gap-2">
        <span className="text-gray-700 font-bold text-[11px]">Address:</span>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigateTo(inputUrl);
          }}
          className="flex-1 flex items-center gap-1"
        >
          <div className="flex-1 bg-white win98-sunken flex items-center px-1.5 py-0.5">
            <span className="text-gray-400 mr-1">📄</span>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full bg-transparent outline-hidden font-mono text-[11px] text-black"
            />
          </div>
          <button
            type="submit"
            className="win98-btn px-2.5 py-0.5 font-bold text-black"
          >
            Go
          </button>
        </form>
      </div>

      {/* 4. Quick Links Bookmark Bar */}
      <div className="bg-[#d4d4d4] px-2 py-1 border-b border-[#808080] flex items-center gap-2 text-[10px] overflow-x-auto whitespace-nowrap">
        <span className="font-bold text-gray-600">Links:</span>
        {[
          { label: '🔥 CurseForge Mods', url: 'http://www.curseforge.com' },
          { label: 'Yahooligans!', url: 'http://www.yahooligans98.com' },
          { label: "GeoCities: Dave's Den", url: 'http://www.geocities.com/area51/daves_den' },
          { label: 'Ask Clippy', url: 'http://www.askclippy.com' },
          { label: 'Amazon.com (1998)', url: 'http://www.amazon98.com' },
          { label: 'Hamster Dance', url: 'http://www.hamsterdance98.com' },
          { label: 'The 98 Onion', url: 'http://www.theonion98.com' },
        ].map((link) => (
          <button
            key={link.url}
            onClick={() => navigateTo(link.url)}
            className={`hover:underline font-medium ${
              link.url.includes('curseforge')
                ? 'text-orange-700 font-bold bg-orange-100 px-1 rounded-xs border border-orange-300'
                : 'text-blue-900'
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* 5. Browser Web Content Viewport */}
      <div className="flex-1 bg-white overflow-y-auto relative text-black">
        {/* Toast Alert */}
        {cartToast && (
          <div className="sticky top-2 z-50 mx-auto max-w-sm bg-yellow-100 border-2 border-yellow-500 p-2 text-center text-xs font-bold shadow-lg animate-bounce">
            🛍️ {cartToast}
          </div>
        )}

        {/* PAGE: CURSEFORGE MINECRAFT MODS REPOSITORY */}
        {currentUrl.includes('curseforge') && (
          <div className="min-h-full bg-[#18181b] text-gray-200 font-sans p-4">
            {/* CurseForge Header Banner */}
            <div className="border-b border-gray-700 pb-3 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg border border-orange-400">
                  <Flame size={20} className="text-white fill-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-lg tracking-wide text-white font-mono">
                      CurseForge<span className="text-orange-500">.98</span>
                    </span>
                    <span className="bg-orange-950 text-orange-400 text-[10px] px-2 py-0.5 rounded font-mono border border-orange-800">
                      Minecraft Beta 1.7.3 Mods
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400">
                    The Official Repository for Java Classpath Mods · Direct Download to C:\.minecraft\mods\
                  </div>
                </div>
              </div>

              {/* Launcher Quick Launch Button */}
              {onOpenMinecraft && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenMinecraft();
                  }}
                  className="px-3 py-1.5 bg-green-700 hover:bg-green-600 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow border border-green-500 active:scale-95 transition-transform"
                >
                  <Play size={13} fill="currentColor" />
                  <span>Launch Minecraft ({installedModIds.length} Mods)</span>
                </button>
              )}
            </div>

            {/* Sub-bar: Search & Filter Categories */}
            <div className="bg-[#27272a] p-2.5 rounded-md border border-gray-700 mb-4 flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between text-xs">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {['All', 'Optimization', 'Gameplay', 'Tools', 'Utility'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      sounds.playClick();
                      setCurseCategory(cat);
                    }}
                    className={`px-2.5 py-1 rounded text-xs transition-colors font-medium whitespace-nowrap ${
                      curseCategory === cat
                        ? 'bg-orange-600 text-white font-bold shadow'
                        : 'bg-[#3f3f46] text-gray-300 hover:bg-[#52525b]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="flex items-center gap-1.5">
                <div className="bg-[#18181b] border border-gray-600 rounded px-2 py-1 flex items-center gap-1.5 w-full md:w-56">
                  <Search size={13} className="text-gray-400" />
                  <input
                    type="text"
                    value={curseSearch}
                    onChange={(e) => setCurseSearch(e.target.value)}
                    placeholder="Search Minecraft mods..."
                    className="bg-transparent text-white outline-hidden text-xs w-full placeholder-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Mods Folder Status Alert */}
            <div className="bg-[#242730] border border-blue-900/60 rounded p-2.5 mb-4 flex items-center justify-between text-xs text-blue-300">
              <div className="flex items-center gap-2">
                <FolderOpen size={16} className="text-blue-400" />
                <span>
                  <strong>Installation Directory:</strong> <code className="bg-black/50 px-1 py-0.5 rounded text-yellow-300 font-mono">C:\.minecraft\mods\</code>
                </span>
              </div>
              <span className="text-[11px] text-gray-400">
                {installedModIds.length} of {AVAILABLE_MODS.length} Mods Installed ({enabledModIds.length} Active in Forge)
              </span>
            </div>

            {/* Mod Cards Catalog */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {filteredMods.map((mod) => {
                const isInstalled = installedModIds.includes(mod.id);
                const isEnabled = enabledModIds.includes(mod.id);

                return (
                  <div
                    key={mod.id}
                    className={`bg-[#27272a] rounded-md border p-3 flex flex-col justify-between transition-all hover:border-gray-500 ${
                      isInstalled ? 'border-green-600/70 bg-[#222724]' : 'border-gray-700'
                    }`}
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-10 h-10 rounded-md bg-gradient-to-br ${mod.color} flex items-center justify-center text-xl shadow`}>
                            {mod.icon}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-white flex items-center gap-2">
                              <span>{mod.name}</span>
                              <span className="text-[10px] bg-black/40 text-orange-400 px-1.5 py-0.2 rounded font-mono border border-orange-900">
                                {mod.badge}
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-400">
                              By <span className="text-gray-300 font-mono">{mod.author}</span> · {mod.downloads} downloads
                            </div>
                          </div>
                        </div>

                        <span className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded font-mono">
                          {mod.fileSize}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-[11px] text-gray-300 leading-snug mb-2">
                        {mod.description}
                      </p>

                      {/* In-Game Effect Tag */}
                      <div className="bg-black/40 rounded p-1.5 border border-gray-700 text-[10px] text-amber-300 font-mono mb-3">
                        ⚡ <strong>In-Game:</strong> {mod.inGameEffect}
                      </div>
                    </div>

                    {/* Bottom Action Controls */}
                    <div className="pt-2 border-t border-gray-700/80 flex items-center justify-between">
                      <div className="text-[10px] text-gray-400 font-mono">
                        File: {mod.filename}
                      </div>

                      <div className="flex items-center gap-2">
                        {isInstalled ? (
                          <>
                            <button
                              onClick={() => {
                                sounds.playClick();
                                toggleModEnabled(mod.id);
                              }}
                              className={`px-2 py-1 rounded text-[11px] font-bold border transition-colors ${
                                isEnabled
                                  ? 'bg-green-800/80 hover:bg-green-700 text-green-200 border-green-600'
                                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-500'
                              }`}
                              title={isEnabled ? 'Click to Disable' : 'Click to Enable'}
                            >
                              {isEnabled ? '✓ Enabled' : 'Disabled'}
                            </button>

                            <button
                              onClick={() => {
                                sounds.playTrash();
                                uninstallMod(mod.id);
                              }}
                              className="p-1 hover:bg-red-950 text-gray-400 hover:text-red-400 rounded transition-colors"
                              title="Uninstall mod"
                            >
                              <Trash2 size={13} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleStartDownloadMod(mod)}
                            className="px-3 py-1 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow border border-orange-400 active:scale-95 transition-transform"
                          >
                            <Download size={13} />
                            <span>Download .jar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center text-[11px] text-gray-500 border-t border-gray-800 pt-3">
              CurseForge 98 · Automated .jar Injection System · Compatible with Minecraft Beta 1.7.3 Forge
            </div>
          </div>
        )}

        {/* PAGE 1: YAHOO! 98 */}
        {currentUrl.includes('yahooligans98.com') && (
          <div className="p-4 max-w-3xl mx-auto font-serif">
            {/* Yahoo Banner Header */}
            <div className="text-center border-b-2 border-purple-800 pb-3 mb-4">
              <div className="text-4xl font-extrabold text-purple-900 tracking-wider font-sans mb-1">
                YAHOO! 98
              </div>
              <div className="text-xs text-gray-600 italic">
                "The Web Directory for Avoiders of Real-World Responsibilities"
              </div>
            </div>

            {/* Search Box */}
            <div className="bg-yellow-50 border border-yellow-400 p-2.5 mb-4 text-center max-w-lg mx-auto">
              <div className="flex gap-1 justify-center mb-1">
                <input
                  type="text"
                  placeholder="Search the 1998 World Wide Web..."
                  className="bg-white border border-gray-600 px-2 py-1 text-xs w-64"
                />
                <button
                  onClick={() => navigateTo('http://www.askclippy.com')}
                  className="px-3 py-1 bg-[#c0c0c0] win98-btn font-bold text-xs"
                >
                  Search
                </button>
              </div>
              <span className="text-[10px] text-gray-500">
                Yellow Pages · People Search · Horoscopes · Free Email (4MB Storage!)
              </span>
            </div>

            {/* Featured Link to CurseForge */}
            <div 
              onClick={() => navigateTo('http://www.curseforge.com')}
              className="bg-orange-50 border-2 border-orange-500 p-2.5 mb-4 rounded cursor-pointer hover:bg-orange-100 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Flame size={20} className="text-orange-600" />
                <div>
                  <div className="font-bold text-xs text-orange-900 font-sans">
                    🔥 Featured Partner: CurseForge 98 Minecraft Mod Portal!
                  </div>
                  <div className="text-[11px] text-orange-800 font-sans">
                    Download OptiFine, Lucky Blocks, X-Ray, and 3x3 Hammers directly to your Minecraft Launcher.
                  </div>
                </div>
              </div>
              <span className="bg-orange-600 text-white font-bold px-2 py-1 text-[11px] rounded font-sans">
                Visit CurseForge »
              </span>
            </div>

            {/* Categories Directory Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs font-sans">
              <div className="border border-gray-300 p-2.5 bg-gray-50">
                <div className="font-bold text-blue-900 border-b border-gray-300 pb-1 mb-1.5 flex items-center gap-1">
                  <span>🎨 Arts & Delusions</span>
                </div>
                <ul className="space-y-1 text-[11px] text-blue-800 underline">
                  <li><a href="#doodle" onClick={() => sounds.playPageClick()}>Procrastination Doodling in MS Paint</a></li>
                  <li><a href="#stare" onClick={() => sounds.playPageClick()}>Staring Blankly at the Ceiling (High Res)</a></li>
                  <li><a href="#fonts" onClick={() => sounds.playPageClick()}>Why Comic Sans is Ahead of Its Time</a></li>
                </ul>
              </div>

              <div className="border border-gray-300 p-2.5 bg-gray-50">
                <div className="font-bold text-blue-900 border-b border-gray-300 pb-1 mb-1.5 flex items-center gap-1">
                  <span>💼 Business & Economy</span>
                </div>
                <ul className="space-y-1 text-[11px] text-blue-800 underline">
                  <li><a href="#pyramid" onClick={() => sounds.playPageClick()}>Legitimate Multi-Level Marketing Schemes</a></li>
                  <li><a href="#crypto" onClick={() => sounds.playPageClick()}>Beanie Babies as a Retirement Hedge</a></li>
                  <li><a href="#invoice" onClick={() => sounds.playPageClick()}>How to Feign Productivity for 8 Hours</a></li>
                </ul>
              </div>

              <div className="border border-gray-300 p-2.5 bg-gray-50">
                <div className="font-bold text-blue-900 border-b border-gray-300 pb-1 mb-1.5 flex items-center gap-1">
                  <span>💻 Computers & Internet</span>
                </div>
                <ul className="space-y-1 text-[11px] text-blue-800 underline">
                  <li><a href="#mods" onClick={() => navigateTo('http://www.curseforge.com')}>CurseForge: Minecraft Modding Directory</a></li>
                  <li><a href="#y2k" onClick={() => sounds.playPageClick()}>Surviving Y2K: Preparing Your Spreadsheet</a></li>
                  <li><a href="#winzip" onClick={() => sounds.playPageClick()}>WinZip Evaluation Period: Day 4,291</a></li>
                </ul>
              </div>

              <div className="border border-gray-300 p-2.5 bg-gray-50">
                <div className="font-bold text-blue-900 border-b border-gray-300 pb-1 mb-1.5 flex items-center gap-1">
                  <span>🏥 Health & Psychosomatics</span>
                </div>
                <ul className="space-y-1 text-[11px] text-blue-800 underline">
                  <li><a href="#fatigue" onClick={() => sounds.playPageClick()}>Is it Chronic Fatigue or 4 Hours on Dial-up?</a></li>
                  <li><a href="#defrag" onClick={() => navigateTo('http://www.askclippy.com')}>Defragmenting Your Emotional Subsystems</a></li>
                  <li><a href="#sunlight" onClick={() => sounds.playPageClick()}>Sunlight Allergy: A Gamer's Manifesto</a></li>
                </ul>
              </div>
            </div>

            <div className="mt-6 text-center text-[10px] text-gray-500 border-t pt-2">
              Copyright © 1994-1998 Yahoo! Inc. All rights reserved. Best viewed in 800x600 resolution.
            </div>
          </div>
        )}

        {/* PAGE 2: GEOCITIES PERSONAL HOMEPAGE (DAVE'S CYBER DEN) */}
        {currentUrl.includes('geocities.com') && (
          <div className="bg-[#000033] text-yellow-300 p-4 font-mono min-h-full">
            {/* Blinking Header */}
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-red-500 animate-pulse tracking-widest mb-1">
                ⚠️ UNDER CONSTRUCTION ⚠️
              </div>
              <h1 className="text-3xl font-extrabold text-cyan-300 drop-shadow">
                ⭐ Welcome to Dave's Cyber Lair ⭐
              </h1>
              <div className="text-xs text-lime-400 mt-1">
                Optimized for Netscape Navigator 3.0 & 28.8k Modems!
              </div>
            </div>

            {/* Flaming Divider line */}
            <div className="h-1 bg-gradient-to-r from-red-600 via-yellow-400 to-red-600 mb-4 rounded" />

            {/* Main Cyber Intro */}
            <div className="max-w-xl mx-auto space-y-3 text-xs leading-relaxed text-gray-200">
              <p>
                Hello fellow Web Surfer! You have arrived at my personal corner of the Information Superhighway. 
                I built this website using pure HTML in Notepad while ignoring my college midterms.
              </p>

              <div className="bg-black/60 border-2 border-purple-500 p-3 rounded text-yellow-200">
                <div className="font-bold text-cyan-400 mb-1">🔥 Top 3 Things About Me:</div>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>I have 14 tabs open in my mind and all of them are playing MIDI files</li>
                  <li>My favorite band is Smash Mouth</li>
                  <li>I am definitely going to clean my room tomorrow (guaranteed)</li>
                </ul>
              </div>

              {/* Hit Counter */}
              <div className="text-center py-2">
                <span className="text-[11px] text-gray-400">Visitors to this page: </span>
                <span className="bg-black text-green-400 px-2 py-0.5 border border-gray-600 font-bold tracking-widest">
                  0 1 4 8 9 2
                </span>
              </div>

              {/* Interactive Guestbook */}
              <div className="border-2 border-cyan-500 p-3 bg-black/80 rounded">
                <div className="font-bold text-cyan-300 text-sm mb-2 text-center">
                  📖 Sign My Cyber Guestbook! 📖
                </div>

                <form onSubmit={handleAddGuestbook} className="space-y-2 mb-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Handle / Screen Name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 px-2 py-1 text-xs text-white"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Leave a message in cyberspace..."
                      value={guestMessage}
                      onChange={(e) => setGuestMessage(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 px-2 py-1 text-xs text-white"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-1 bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs border border-white"
                  >
                    Submit Guestbook Entry!
                  </button>
                </form>

                {/* Guestbook Entries Feed */}
                <div className="space-y-2 max-h-40 overflow-y-auto text-[11px]">
                  {guestbookEntries.map((entry, idx) => (
                    <div key={idx} className="border-b border-gray-700 pb-1 text-gray-300">
                      <div className="text-yellow-300 font-bold flex justify-between">
                        <span>{entry.name}</span>
                        <span className="text-[9px] text-gray-500">{entry.date}</span>
                      </div>
                      <p className="text-gray-200">{entry.msg}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center text-[10px] text-gray-500 mt-6">
              Hosted by GeoCities / Area51 Community · Last updated: October 14, 1998
            </div>
          </div>
        )}

        {/* PAGE 3: ASK CLIPPY SEARCH ENGINE */}
        {currentUrl.includes('askclippy.com') && (
          <div className="p-6 max-w-xl mx-auto font-sans">
            <div className="text-center mb-6">
              <div className="text-4xl mb-1">📎</div>
              <h1 className="text-3xl font-extrabold text-blue-900">Ask Clippy</h1>
              <p className="text-xs text-gray-600">The 1998 Search Engine That Judges Your Life Choices</p>
            </div>

            <form onSubmit={handleAskClippy} className="mb-4">
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={askQuery}
                  onChange={(e) => setAskQuery(e.target.value)}
                  placeholder="Ask a question (e.g. 'Why am I broke?', 'How to fix life?')"
                  className="flex-1 border-2 border-blue-900 px-3 py-1.5 text-xs text-black"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs"
                >
                  Ask!
                </button>
              </div>
            </form>

            {/* Search Suggestions */}
            <div className="flex flex-wrap gap-1.5 text-[10px] mb-6">
              <span className="text-gray-500">Popular queries:</span>
              {['Why am I procrastinating?', 'How to get rich quick', 'Will my crush text back?', 'Is dial-up bad for my brain?'].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setAskQuery(q);
                  }}
                  className="bg-gray-100 hover:bg-gray-200 px-2 py-0.5 border text-blue-800 rounded"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Answer Card */}
            {askResult && (
              <div className="bg-yellow-50 border-2 border-yellow-400 p-4 rounded shadow-md animate-fade-in">
                <div className="flex items-start gap-2.5">
                  <span className="text-2xl">📎</span>
                  <div>
                    <div className="font-bold text-xs text-blue-900 mb-1">Clippy Answers:</div>
                    <p className="text-xs text-gray-800 leading-relaxed font-serif">{askResult}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PAGE 4: AMAZON 1998 BOOKSTORE */}
        {currentUrl.includes('amazon98.com') && (
          <div className="p-4 max-w-3xl mx-auto font-serif">
            {/* Amazon 1998 Header */}
            <div className="border-b-2 border-black pb-2 mb-4 flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold font-sans tracking-tight text-blue-900 flex items-center gap-1">
                  <span>amazon.com</span>
                  <span className="text-xs text-amber-600 font-normal">Earth's Biggest Bookstore</span>
                </div>
              </div>
              <div className="text-xs font-sans flex items-center gap-1 bg-yellow-100 px-2.5 py-1 border border-yellow-400 rounded">
                <ShoppingBag size={14} className="text-amber-800" />
                <span className="font-bold">Cart: {cartCount} items</span>
              </div>
            </div>

            <div className="text-xs text-gray-600 mb-4 italic">
              "Over 2.5 million titles in stock for readers actively running from their problems."
            </div>

            {/* Book Catalog */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans text-xs">
              {[
                {
                  title: "101 Excuses for Unfinished Tasks",
                  author: "Dr. Pro Crastinator",
                  price: "$14.95",
                  desc: "Includes classics such as 'My floppy disk corrupted' and 'Mercury is in retrograde'."
                },
                {
                  title: "Defrag Your Psyche (Vol. 1)",
                  author: "Windows NT Kernel",
                  price: "$18.50",
                  desc: "Learn how to organize your traumatic memories into neat, unread system sectors."
                },
                {
                  title: "Surviving Y2K on Pop-Tarts",
                  author: "Survivalist Steve",
                  price: "$9.99",
                  desc: "The definitive guide to hoarding batteries and 1.44MB floppies before the clock strikes midnight."
                }
              ].map((book) => (
                <div key={book.title} className="border border-gray-300 p-3 bg-gray-50 flex flex-col justify-between rounded-xs">
                  <div>
                    <div className="font-bold text-blue-900 text-sm mb-1">{book.title}</div>
                    <div className="text-[10px] text-gray-500 mb-2">By {book.author}</div>
                    <p className="text-[11px] text-gray-700 leading-snug mb-3">{book.desc}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                    <span className="font-bold text-red-700">{book.price}</span>
                    <button
                      onClick={() => handleBuyBook(book.title)}
                      className="px-2 py-1 bg-yellow-400 hover:bg-yellow-500 border border-yellow-700 font-bold text-[10px] rounded-xs shadow"
                    >
                      1-Click Buy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAGE 5: HAMSTER DANCE 1998 */}
        {currentUrl.includes('hamsterdance98.com') && (
          <div className="bg-[#ffcc00] p-6 text-center font-sans min-h-full flex flex-col items-center justify-center">
            <h1 className="text-3xl font-extrabold text-purple-900 mb-2 tracking-wider">
              🐹 THE OFFICIAL HAMSTER DANCE 🐹
            </h1>
            <p className="text-xs text-purple-800 font-bold mb-4">
              "The Peak Achievement of Human Telecommunications"
            </p>

            {/* Animated Hamster Rows */}
            <div className="grid grid-cols-6 gap-3 max-w-md mx-auto mb-6">
              {Array.from({ length: 18 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`text-3xl transition-transform ${hamsterDancing ? 'animate-bounce' : ''}`}
                  style={{ animationDelay: `${(i % 6) * 120}ms` }}
                >
                  🐹
                </div>
              ))}
            </div>

            <div className="bg-white/80 p-3 border-2 border-purple-900 rounded max-w-sm mx-auto text-xs">
              <div className="font-bold text-purple-900 mb-1">Lyrics:</div>
              <div className="font-mono text-[11px] text-purple-800">
                De-da-de-da-de-da-do-do! <br />
                Do-de-da-de-do-do-do! <br />
                (Repeat for 45 uninterrupted minutes)
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playDing();
                setHamsterDancing(!hamsterDancing);
              }}
              className="mt-4 px-4 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded shadow"
            >
              {hamsterDancing ? 'Pause Hamster Madness' : 'Resume Dancing!'}
            </button>
          </div>
        )}

        {/* PAGE 6: THE 98 ONION NEWS */}
        {currentUrl.includes('theonion98.com') && (
          <div className="p-4 max-w-3xl mx-auto font-serif">
            <div className="border-b-4 border-black pb-2 mb-4 text-center">
              <div className="text-4xl font-extrabold tracking-tight font-serif text-black">
                THE 98 DAILY CHRONICLE
              </div>
              <div className="text-xs text-gray-500 font-sans italic">
                America's Finest 56k News Source · Circulation: 3 People Online
              </div>
            </div>

            <div className="border-b-2 border-gray-300 pb-4 mb-4">
              <span className="bg-red-700 text-white font-sans font-bold text-[10px] px-1.5 py-0.5 uppercase mr-2">
                Special Report
              </span>
              <h2 className="text-xl font-bold font-serif text-blue-900 hover:underline cursor-pointer inline">
                Study: 98% of Office Computer Work Consists of Minimizing Solitaire When Steps Approach
              </h2>
              <p className="text-xs text-gray-700 mt-1 font-serif leading-relaxed">
                WASHINGTON — A groundbreaking study released today confirmed that corporate productivity has not increased 
                since the release of Windows 98, with workers averaging 4.2 hours daily managing cascading playing cards.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 font-sans text-xs">
              <div className="border p-2 bg-gray-50">
                <div className="font-bold text-black mb-1">Local Man Convinced Life Will Sort Itself Out by Monday</div>
                <p className="text-[11px] text-gray-600">
                  "I just need one good night of sleep and maybe a new mousepad," reported local procrastinator Arthur Pendelton.
                </p>
              </div>

              <div className="border p-2 bg-gray-50">
                <div className="font-bold text-black mb-1">Microsoft Promises Windows 2000 Will Fix User's Poor Life Choices</div>
                <p className="text-[11px] text-gray-600">
                  "The new NT kernel will automatically prioritize adult responsibilities," claimed spokesperson.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 404 UNKNOWN / FUTURE WEBSITE */}
        {!currentUrl.includes('curseforge') &&
         !currentUrl.includes('yahooligans98.com') && 
         !currentUrl.includes('geocities.com') && 
         !currentUrl.includes('askclippy.com') && 
         !currentUrl.includes('amazon98.com') && 
         !currentUrl.includes('hamsterdance98.com') && 
         !currentUrl.includes('theonion98.com') && (
          <div className="p-8 text-center max-w-md mx-auto font-sans">
            <div className="text-5xl mb-3">📡</div>
            <h2 className="text-xl font-bold text-red-700 mb-2">
              HTTP 404 - Site Not Found In 1998
            </h2>
            <p className="text-xs text-gray-700 mb-4 leading-relaxed">
              The URL <span className="font-mono font-bold text-black">{currentUrl}</span> does not exist in the 1998 World Wide Web directory.
              Try visiting <button onClick={() => navigateTo('http://www.curseforge.com')} className="text-blue-800 underline font-bold">CurseForge.com</button> or Yahoo! 98.
            </p>
            <button
              onClick={() => navigateTo('http://www.yahooligans98.com')}
              className="px-4 py-1.5 bg-[#c0c0c0] win98-btn font-bold text-xs"
            >
              Return to Yahoo! 98
            </button>
          </div>
        )}
      </div>

      {/* 6. Windows 98 File Download Dialog for CurseForge Mods */}
      {downloadingMod && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-3">
          <div className="bg-[#c0c0c0] win98-raised border-2 border-white p-3 max-w-md w-full font-win98 text-xs shadow-2xl">
            {/* Title Bar */}
            <div className="bg-[#000080] text-white px-2 py-0.5 font-bold flex items-center justify-between mb-3">
              <span>
                {downloadProgress >= 100 ? 'Download Complete' : `Saving: ${downloadingMod.filename}`}
              </span>
              <button 
                onClick={() => setDownloadingMod(null)}
                className="text-white hover:bg-red-600 px-1 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Animation & File Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white win98-sunken flex items-center justify-center text-2xl">
                {downloadProgress >= 100 ? '✅' : '📥'}
              </div>
              <div className="flex-1">
                <div className="font-bold text-black text-xs">
                  {downloadingMod.name} ({downloadingMod.version})
                </div>
                <div className="text-[11px] text-gray-700 font-mono truncate">
                  From: www.curseforge.com
                </div>
                <div className="text-[11px] text-gray-700 font-mono">
                  To: <span className="font-bold text-blue-900">C:\.minecraft\mods\{downloadingMod.filename}</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-[10px] text-gray-600 mb-0.5 font-mono">
                <span>Progress: {downloadProgress}%</span>
                <span>{downloadProgress >= 100 ? 'Completed' : downloadSpeed}</span>
              </div>
              <div className="win98-sunken bg-white h-4 overflow-hidden relative border border-gray-600">
                <div 
                  className="bg-[#000080] h-full transition-all duration-300 flex items-center justify-end pr-1 text-[9px] text-white font-bold"
                  style={{ width: `${downloadProgress}%` }}
                >
                  {downloadProgress > 15 && `${downloadProgress}%`}
                </div>
              </div>
            </div>

            {/* Result Message */}
            {downloadProgress >= 100 ? (
              <div className="bg-green-100 border border-green-600 p-2 text-green-950 text-[11px] rounded-xs mb-3 font-sans">
                ✓ <strong>Mod successfully installed!</strong> This mod is now registered in Minecraft Forge and ready to play in the Minecraft Launcher.
              </div>
            ) : (
              <div className="text-[10px] text-gray-600 mb-3 font-mono">
                Transferring Java archive to .minecraft directory...
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              {downloadProgress >= 100 && onOpenMinecraft && (
                <button
                  onClick={() => {
                    setDownloadingMod(null);
                    onOpenMinecraft();
                  }}
                  className="px-3 py-1 bg-green-700 hover:bg-green-600 text-white font-bold text-xs border border-green-500 flex items-center gap-1 shadow"
                >
                  <Play size={12} fill="currentColor" />
                  <span>Launch Minecraft Now</span>
                </button>
              )}
              <button
                onClick={() => setDownloadingMod(null)}
                className="px-4 py-1 win98-btn font-bold text-xs text-black"
              >
                {downloadProgress >= 100 ? 'Close' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Dial-up Connection Simulation Modal */}
      {showDialupModal && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-3">
          <div className="bg-[#c0c0c0] win98-raised border-2 border-white p-3 max-w-sm w-full font-win98 text-xs">
            <div className="bg-[#000080] text-white px-2 py-0.5 font-bold flex items-center justify-between mb-3">
              <span>Dialing - Connect to Internet</span>
              <button 
                onClick={() => setShowDialupModal(false)}
                className="text-white hover:bg-red-600 px-1 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl animate-pulse">📠</span>
              <div>
                <div className="font-bold text-black text-xs mb-0.5">Connecting to ISP Gateway...</div>
                <div className="text-[11px] text-gray-700 font-mono">{dialupStep}</div>
              </div>
            </div>

            <div className="win98-sunken bg-gray-200 h-3 overflow-hidden mb-3">
              <div className="bg-[#000080] h-full w-full animate-pulse" />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowDialupModal(false)}
                className="px-3 py-1 win98-btn font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Bottom Status Bar */}
      <div className="bg-[#c0c0c0] px-2 py-0.5 border-t border-[#808080] flex items-center justify-between text-[11px] text-gray-700 font-mono">
        <div className="flex items-center gap-2">
          <span>{statusText}</span>
          {isLoading && (
            <div className="w-16 h-2 bg-gray-300 win98-sunken overflow-hidden">
              <div className="h-full bg-blue-800 animate-pulse w-2/3" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Globe size={11} className="text-blue-800" />
            <span>Internet zone</span>
          </div>
          <div className="flex items-center gap-1">
            <Lock size={11} className="text-green-700" />
            <span>56k Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};
