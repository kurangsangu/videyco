import React, { useState, useEffect } from 'react';
import { 
  VideoItem, 
  PlayerSettings, 
  ThemeConfig, 
  CreatorProfile, 
  ChatMessage,
  SiteSettings
} from './types';
import { 
  DEFAULT_VIDEOS, 
  DEFAULT_CREATOR, 
  DEFAULT_CHAT_MESSAGES, 
  THEME_PRESETS,
  DEFAULT_SITE_SETTINGS
} from './data/defaultData';
import { generateRandomChatMessage } from './data/chatStreamData';
import { getRandomFemaleStreamer } from './data/femaleStreamers';
import { safeJsonStringify, safeJsonParse } from './utils/jsonHelpers';
import { Navbar } from './components/Navbar';
import { AnnouncementBar } from './components/AnnouncementBar';
import { VideoPlayer } from './components/VideoPlayer';
import { LiveChatBox } from './components/LiveChatBox';
import { VideoPlaylist } from './components/VideoPlaylist';
import { AddVideoModal } from './components/AddVideoModal';
import { EditVideoModal } from './components/EditVideoModal';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal';
import { SettingsModal } from './components/SettingsModal';
import { CreatorTipModal } from './components/CreatorTipModal';
import { AgeVerificationModal } from './components/AgeVerificationModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Tv, Sparkles, Activity, Cpu, HardDrive, ShieldCheck, KeyRound } from 'lucide-react';

const LOCAL_STORAGE_KEYS = {
  VIDEOS: 'videyplayer_videos_v1',
  SETTINGS: 'videyplayer_settings_v1',
  THEME: 'videyplayer_theme_v1',
  CREATOR: 'videyplayer_creator_v1',
  CHAT: 'videyplayer_chat_v1',
  SITE_SETTINGS: 'videyplayer_site_settings_v1',
  ADMIN_AUTH: 'videyplayer_admin_auth_v1',
};

export default function App() {
  // 0. Admin Authentication State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);

  // 1. Site & OpenGraph Settings State
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SITE_SETTINGS);
      const parsed = safeJsonParse<SiteSettings>(saved, DEFAULT_SITE_SETTINGS);
      // Bersihkan URL placeholder example.com jika ada data cache lama di browser
      if (parsed?.smartlink?.smartlinkUrl && parsed.smartlink.smartlinkUrl.includes('example.com')) {
        parsed.smartlink.smartlinkUrl = '';
        parsed.smartlink.enabled = false;
      }
      return parsed;
    } catch (e) {
      console.warn('Failed to parse site settings', e);
      return DEFAULT_SITE_SETTINGS;
    }
  });

  // 2. Videos State
  const [videos, setVideos] = useState<VideoItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.VIDEOS);
      return safeJsonParse<VideoItem[]>(saved, DEFAULT_VIDEOS);
    } catch (e) {
      console.warn('Failed to parse saved videos', e);
      return DEFAULT_VIDEOS;
    }
  });

  // 3. Current Video State with Visitor Shuffle Logic
  const [currentVideo, setCurrentVideo] = useState<VideoItem>(() => {
    let initialVideos = DEFAULT_VIDEOS;
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.VIDEOS);
      if (saved) {
        initialVideos = safeJsonParse(saved, DEFAULT_VIDEOS);
      }
    } catch (e) {}

    // If visitor and shuffle enabled, try random video on new session
    try {
      const isShuffledSession = sessionStorage.getItem('videyplayer_visitor_shuffled');
      if (!isShuffledSession && DEFAULT_SITE_SETTINGS.shuffleVideoForVisitors && initialVideos.length > 0) {
        sessionStorage.setItem('videyplayer_visitor_shuffled', 'true');
        const randomIndex = Math.floor(Math.random() * initialVideos.length);
        return initialVideos[randomIndex];
      }
    } catch (e) {
      console.warn('Shuffle session error', e);
    }
    return initialVideos[0] || DEFAULT_VIDEOS[0];
  });

  // 4. Player Settings State
  const [playerSettings, setPlayerSettings] = useState<PlayerSettings>(() => {
    const defaultSettings: PlayerSettings = {
      autoplay: true,
      autoplayMuted: true,
      loop: false,
      autoNext: true,
      playbackSpeed: 1,
      theaterMode: false,
      volume: 0.8,
      isMuted: true,
      quality: 'Auto',
      ambientGlow: true,
    };
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
      return safeJsonParse<PlayerSettings>(saved, defaultSettings);
    } catch (e) {
      console.warn('Failed to parse settings', e);
      return defaultSettings;
    }
  });

  // 5. Theme State
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
      return safeJsonParse<ThemeConfig>(saved, THEME_PRESETS[0]);
    } catch (e) {
      console.warn('Failed to parse theme', e);
      return THEME_PRESETS[0];
    }
  });

  // 6. Creator Profile State (Random Female Streamer by default)
  const [creator, setCreator] = useState<CreatorProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CREATOR);
      return safeJsonParse<CreatorProfile>(saved, getRandomFemaleStreamer());
    } catch (e) {
      console.warn('Failed to parse creator', e);
      return getRandomFemaleStreamer();
    }
  });

  // 7. Chat Messages State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CHAT);
      return safeJsonParse<ChatMessage[]>(saved, DEFAULT_CHAT_MESSAGES);
    } catch (e) {
      console.warn('Failed to parse chat', e);
      return DEFAULT_CHAT_MESSAGES;
    }
  });

  // 8. Auto-generating live stream comments (90% male / 10% female ratio with real photos)
  const [isAutoChatActive, setIsAutoChatActive] = useState<boolean>(true);

  useEffect(() => {
    if (!isAutoChatActive) return;

    const interval = setInterval(() => {
      const randomMsg = generateRandomChatMessage();
      setChatMessages((prev) => {
        const nextList = [...prev, randomMsg];
        // Retain max 100 messages for smooth scrolling and performance
        if (nextList.length > 100) {
          return nextList.slice(nextList.length - 100);
        }
        return nextList;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isAutoChatActive]);

  // Other Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  const handleTipAction = () => {
    if (isAdmin) {
      setIsTipModalOpen(true);
    } else {
      triggerSmartlinkRedirect('Click Tip / Saweria Button');
    }
  };
  const [isAgeModalOpen, setIsAgeModalOpen] = useState<boolean>(false);

  // 10. Smartlink Adsterra Auto-Redirect Engine
  const [hasRedirected, setHasRedirected] = useState<boolean>(false);

  // Helper to validate that a smartlink is a genuine URL and not empty or placeholder example.com
  const isValidSmartlink = (url?: string): boolean => {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    if (!trimmed || trimmed.includes('example.com') || trimmed.length < 8) return false;
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const getActiveSmartlinkUrl = (smartlink: typeof siteSettings.smartlink): string | null => {
    const validUrls = (smartlink.smartlinkUrls || [])
      .filter(u => isValidSmartlink(u));
    if (validUrls.length > 0) {
      // Pick one randomly
      return validUrls[Math.floor(Math.random() * validUrls.length)];
    }
    // Fallback
    if (isValidSmartlink(smartlink.smartlinkUrl)) {
      return smartlink.smartlinkUrl;
    }
    return null;
  };

  // Trigger redirection function
  const triggerSmartlinkRedirect = (reason: string) => {
    if (isAdmin) {
      console.log(`[Smartlink Redirect Skipped in Admin Mode] Reason: ${reason}`);
      return;
    }
    const smartlink = siteSettings.smartlink;
    const activeUrl = getActiveSmartlinkUrl(smartlink);
    if (!smartlink?.enabled || !activeUrl) return;
    if (hasRedirected) return;

    setHasRedirected(true);
    console.log(`[Smartlink Redirect Executed] Reason: ${reason} to ${activeUrl}`);
    if (smartlink.openInNewTab) {
      window.open(activeUrl, '_blank');
    } else {
      window.location.href = activeUrl;
    }
  };

  // Back button protection: When user presses Back in browser, redirect to smartlink
  useEffect(() => {
    if (isAdmin) return;
    const smartlink = siteSettings.smartlink;
    const activeUrl = getActiveSmartlinkUrl(smartlink);
    if (!smartlink?.enabled || !smartlink?.enableBackRedirect || !activeUrl) return;

    // Push state into history so back button event can be intercepted
    window.history.pushState({ page: 'videy_main' }, '', window.location.href);

    const handlePopState = () => {
      console.log('[Back Button Intercepted] Redirecting to Smartlink...');
      const urlToUse = getActiveSmartlinkUrl(smartlink);
      if (urlToUse) {
        window.location.href = urlToUse;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [siteSettings.smartlink, isAdmin]);

  // Prevent right-click, inspect element, and copy shortcuts
  useEffect(() => {
    // Only block if not admin, or always block. Let's block for everyone to be safe against random visitors.
    // If you want to let admin use dev tools, uncomment the line below:
    // if (isAdmin) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S, Ctrl+C
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C', 'i', 'j', 'c'].includes(e.key)) ||
        (e.ctrlKey && ['U', 'S', 'C', 'u', 's', 'c'].includes(e.key)) ||
        (e.metaKey && e.altKey && ['I', 'J', 'U', 'i', 'j', 'u'].includes(e.key)) // For Mac
      ) {
        e.preventDefault();
      }
    };

    // Prevent text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, [isAdmin]);

  // Jeda 3-10 detik ketika pengunjung masuk (triggerOnVisitorEnter)
  useEffect(() => {
    if (isAdmin) return;
    const smartlink = siteSettings.smartlink;
    const activeUrl = getActiveSmartlinkUrl(smartlink);
    if (!smartlink?.enabled || !smartlink.triggerOnVisitorEnter || !activeUrl) return;
    // Don't auto-redirect if 18+ modal is active, wait for user confirmation
    if (isAgeModalOpen) return;

    const delayMs = (smartlink.redirectDelaySeconds || 6) * 1000;
    const timer = setTimeout(() => {
      triggerSmartlinkRedirect('Visitor Enter Site Delay');
    }, delayMs);

    return () => clearTimeout(timer);
  }, [siteSettings.smartlink, isAgeModalOpen, isAdmin]);

  const checkAndShowAgeModal = (video?: VideoItem) => {
    // If not globally enabled and not specifically required by video, don't show
    if (!siteSettings.ageVerification?.enabled && !video?.requireAgeVerification) return false;
    
    const isVerified = sessionStorage.getItem('videyplayer_age_verified_18');
    if (isVerified !== 'true') {
      setIsAgeModalOpen(true);
      return true;
    }
    return false;
  };

  // Video play trigger for smartlink redirect
  const handleVideoPlayStarted = () => {
    const ageConfig = siteSettings.ageVerification;
    const triggerTime = ageConfig?.triggerTimeSeconds || 0;
    
    if (triggerTime === 0 && checkAndShowAgeModal(currentVideo)) {
      // Pause video if it started playing before verification
      const videoEl = document.getElementById('main-html5-video') as HTMLVideoElement | null;
      if (videoEl) videoEl.pause();
      return;
    }

    if (isAdmin) return;
    const smartlink = siteSettings.smartlink;
    const activeUrl = getActiveSmartlinkUrl(smartlink);
    if (!smartlink?.enabled || !smartlink.triggerOnPlay || !activeUrl) return;

    const delayMs = (smartlink.redirectDelaySeconds || 6) * 1000;
    setTimeout(() => {
      triggerSmartlinkRedirect('Video Play Active Delay');
    }, delayMs);
  };

  const handleVideoTimeUpdate = (currentTime: number) => {
    const ageConfig = siteSettings.ageVerification;
    const triggerTime = ageConfig?.triggerTimeSeconds || 0;
    
    if (triggerTime > 0 && currentTime >= triggerTime) {
      if (checkAndShowAgeModal(currentVideo)) {
        const videoEl = document.getElementById('main-html5-video') as HTMLVideoElement | null;
        if (videoEl) videoEl.pause();
      }
    }
  };

  // Age 18+ confirmation handlers
  const handleAgeConfirm = () => {
    try {
      sessionStorage.setItem('videyplayer_age_verified_18', 'true');
    } catch (e) {
      console.warn(e);
    }
    setIsAgeModalOpen(false);
    
    // Play the video if it was paused by the modal
    const videoEl = document.getElementById('main-html5-video') as HTMLVideoElement | null;
    if (videoEl) {
      videoEl.play().catch(() => {});
    }

    // If smartlink configured, start delay countdown after consent
    const smartlink = siteSettings.smartlink;
    if (smartlink?.enabled && isValidSmartlink(smartlink?.smartlinkUrl)) {
      const delayMs = (smartlink.redirectDelaySeconds || 6) * 1000;
      setTimeout(() => {
        triggerSmartlinkRedirect('Age Verification Accepted');
      }, delayMs);
    }
  };

  const handleAgeDecline = () => {
    const smartlink = siteSettings.smartlink;
    if (smartlink?.enabled && isValidSmartlink(smartlink?.smartlinkUrl)) {
      window.location.href = smartlink.smartlinkUrl;
    } else {
      window.location.href = 'https://www.google.com';
    }
  };

  // Persist states to LocalStorage safely
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH, isAdmin ? 'true' : 'false');
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [isAdmin]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SITE_SETTINGS, safeJsonStringify(siteSettings));
    } catch (e) {
      console.warn('Storage sync error for siteSettings:', e);
    }
  }, [siteSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.VIDEOS, safeJsonStringify(videos));
    } catch (e) {
      console.warn('Storage sync error for videos:', e);
    }
  }, [videos]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, safeJsonStringify(playerSettings));
    } catch (e) {
      console.warn('Storage sync error for playerSettings:', e);
    }
  }, [playerSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, safeJsonStringify(theme));
    } catch (e) {
      console.warn('Storage sync error for theme:', e);
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CREATOR, safeJsonStringify(creator));
    } catch (e) {
      console.warn('Storage sync error for creator:', e);
    }
  }, [creator]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CHAT, safeJsonStringify(chatMessages));
    } catch (e) {
      console.warn('Storage sync error for chatMessages:', e);
    }
  }, [chatMessages]);

  // Synchronize dynamic OpenGraph & document metadata
  useEffect(() => {
    const title = siteSettings.openGraph.title || `${currentVideo.title} — ${creator.name}`;
    document.title = title;

    const setMeta = (attr: string, key: string, content: string) => {
      let elem = document.querySelector(`meta[${attr}="${key}"]`);
      if (!elem) {
        elem = document.createElement('meta');
        elem.setAttribute(attr, key);
        document.head.appendChild(elem);
      }
      elem.setAttribute('content', content);
    };

    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', siteSettings.openGraph.description || currentVideo.description);
    setMeta('property', 'og:image', siteSettings.openGraph.imageUrl || currentVideo.thumbnail);
    setMeta('property', 'og:type', 'video.other');
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', siteSettings.openGraph.description || currentVideo.description);
    setMeta('name', 'twitter:image', siteSettings.openGraph.imageUrl || currentVideo.thumbnail);
  }, [siteSettings.openGraph, currentVideo, creator.name]);

  // Find next video in playlist
  const currentIndex = videos.findIndex((v) => v.id === currentVideo.id);
  const nextVideo = currentIndex >= 0 && currentIndex < videos.length - 1 
    ? videos[currentIndex + 1] 
    : videos[0];

  const handleSelectNextVideo = () => {
    if (nextVideo) {
      setCurrentVideo(nextVideo);
    }
  };

  // Video Management
  const handleAddVideo = (newVideo: VideoItem | VideoItem[]) => {
    if (Array.isArray(newVideo)) {
      setVideos((prev) => [...newVideo, ...prev]);
      setCurrentVideo(newVideo[0]);
    } else {
      setVideos((prev) => [newVideo, ...prev]);
      setCurrentVideo(newVideo);
    }
  };

  const handleSaveEditedVideo = (updatedVideo: VideoItem) => {
    setVideos((prev) => prev.map((v) => (v.id === updatedVideo.id ? updatedVideo : v)));
    if (currentVideo.id === updatedVideo.id) {
      setCurrentVideo(updatedVideo);
    }
  };

  const handleDeleteVideo = (id: string) => {
    setVideos((prev) => {
      const updated = prev.filter((v) => v.id !== id);
      if (currentVideo.id === id && updated.length > 0) {
        setCurrentVideo(updated[0]);
      }
      return updated;
    });
  };

  // Settings & Theme Handlers
  const handleUpdateSettings = (updates: Partial<PlayerSettings>) => {
    setPlayerSettings((prev) => ({ ...prev, ...updates }));
  };

  const handleToggleAutoplay = () => {
    setPlayerSettings((prev) => ({ ...prev, autoplay: !prev.autoplay }));
  };

  const handleSelectThemePreset = (preset: ThemeConfig) => {
    setTheme(preset);
  };

  const handleUpdateCustomTheme = (updates: Partial<ThemeConfig>) => {
    setTheme((prev) => ({ ...prev, ...updates }));
  };

  const handleUpdateCreator = (updates: Partial<CreatorProfile>) => {
    setCreator((prev) => ({ ...prev, ...updates }));
  };

  const handleUpdateSiteSettings = (updates: Partial<SiteSettings>) => {
    setSiteSettings((prev) => ({ ...prev, ...updates }));
  };

  const handleResetDefaults = () => {
    setVideos(DEFAULT_VIDEOS);
    setCurrentVideo(DEFAULT_VIDEOS[0]);
    setPlayerSettings({
      autoplay: true,
      autoplayMuted: true,
      loop: false,
      autoNext: true,
      playbackSpeed: 1,
      theaterMode: false,
      volume: 0.8,
      isMuted: true,
      quality: 'Auto',
      ambientGlow: true,
    });
    setTheme(THEME_PRESETS[0]);
    setCreator(DEFAULT_CREATOR);
    setChatMessages(DEFAULT_CHAT_MESSAGES);
    setSiteSettings(DEFAULT_SITE_SETTINGS);
  };

  // Admin Handlers
  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    setIsAdminDashboardOpen(true);
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setIsAdminDashboardOpen(false);
  };

  // Live Chat Handlers
  const handleSendMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      user: isAdmin ? 'Admin (CozyMiaa)' : 'Penonton_' + Math.floor(Math.random() * 900 + 100),
      text,
      timestamp: 'Baru saja',
      isVip: isAdmin,
      isMod: isAdmin,
      isStreamer: isAdmin,
      badge: isAdmin ? '⭐ Admin' : '👑 Member',
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  const handleSendTip = (amount: number, user: string, msgText: string) => {
    const tipMsg: ChatMessage = {
      id: 'tip-' + Date.now(),
      user,
      text: msgText,
      timestamp: 'Baru saja',
      isVip: true,
      tipAmount: amount,
      badge: '💎 VIP Donatur',
    };
    setChatMessages((prev) => [...prev, tipMsg]);

    setCreator((prev) => ({
      ...prev,
      vipGoal: {
        ...prev.vipGoal,
        current: prev.vipGoal.current + amount,
      },
    }));
  };

  return (
    <div 
      className={`min-h-screen select-none text-zinc-100 transition-colors duration-300 font-sans relative overflow-x-hidden ${theme.bgDark}`}
      style={{
        '--theme-primary': theme.primaryHex,
      } as React.CSSProperties}
    >
      {/* Dynamic Announcement Bar */}
      <AnnouncementBar
        announcement={siteSettings.announcement}
        theme={theme}
        onLinkClick={(e) => {
          if (!isAdmin && siteSettings.smartlink?.enabled && getActiveSmartlinkUrl(siteSettings.smartlink)) {
            e.preventDefault();
            triggerSmartlinkRedirect('Click Announcement Tip');
          }
        }}
      />

      {/* Atmospheric Ambient Glow Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] blur-[130px] rounded-full transition-all duration-700"
          style={{ backgroundColor: `${theme.primaryHex}33` }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] blur-[130px] rounded-full transition-all duration-700 bg-purple-900/25"
        />
      </div>

      {/* Top Navigation Bar with Role Separation */}
      <Navbar
        currentTheme={theme}
        playerSettings={playerSettings}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
        onLogoutAdmin={handleAdminLogout}
        onOpenAddModal={() => {
          if (!checkAndShowAgeModal()) setIsAddModalOpen(true);
        }}
        onOpenThemeModal={() => {
          if (!checkAndShowAgeModal()) setIsThemeModalOpen(true);
        }}
        onOpenSettingsModal={() => {
          if (!checkAndShowAgeModal()) setIsSettingsModalOpen(true);
        }}
        onToggleAutoplay={handleToggleAutoplay}
        searchQuery={globalSearchQuery}
        onSearchChange={setGlobalSearchQuery}
        isLive={creator.isLive}
      />

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-5 space-y-6">
        
        {/* 1. TOP SECTION: Video Player + Live Stream Chat (Positioned Prominently at Top) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          
          {/* Main Video Player (Left 8 cols on desktop) */}
          <div id="main-video-section" className="lg:col-span-8 space-y-4">
            <VideoPlayer
              currentVideo={currentVideo}
              nextVideo={nextVideo}
              settings={playerSettings}
              theme={theme}
              onSelectNextVideo={handleSelectNextVideo}
              onUpdateSettings={handleUpdateSettings}
              onVideoPlay={handleVideoPlayStarted}
              onTimeUpdate={handleVideoTimeUpdate}
              onDownloadAction={isAdmin ? undefined : () => triggerSmartlinkRedirect('Click Sumber .MP4')}
            />

            {/* Immersive UI System Status & Theme HUD Bar */}
            <div 
              id="immersive-system-hud"
              className={`p-3.5 sm:px-6 sm:py-3.5 rounded-2xl border backdrop-blur-md flex flex-wrap items-center justify-between gap-3 sm:gap-4 transition-all duration-300 ${
                theme.glassEffect ? 'bg-black/40 border-white/10' : `${theme.bgCard} ${theme.borderColor}`
              }`}
            >
              <div className="flex items-center gap-3">
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" style={{ color: theme.primaryHex }} />
                    Aksen Tema Aktif
                  </h4>
                  <div className="flex items-center gap-2">
                    {THEME_PRESETS.slice(0, 5).map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handleSelectThemePreset(preset)}
                        title={preset.name}
                        className={`w-5 h-5 rounded-full transition-transform hover:scale-125 border ${
                          theme.id === preset.id 
                            ? 'border-white ring-4 scale-110 shadow-md' 
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: preset.primaryHex,
                          boxShadow: theme.id === preset.id ? `0 0 12px ${preset.primaryHex}` : undefined
                        }}
                      />
                    ))}
                    {isAdmin && (
                      <button
                        onClick={() => setIsThemeModalOpen(true)}
                        className="text-[11px] text-zinc-400 hover:text-white underline ml-1 font-medium"
                      >
                        Kustomisasi →
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="hidden sm:block h-7 w-[1px] bg-white/10" />

              <div className="flex flex-col sm:items-end">
                <span className="text-[11px] text-zinc-400 italic mb-1 flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                  Responsivitas Pemutar: <span className="text-zinc-200 font-mono font-bold">100% Responsif</span>
                </span>
                <div className="flex items-center gap-3 text-[10px] font-mono" style={{ color: theme.primaryHex }}>
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-zinc-400" />
                    CPU: Hemat
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-zinc-400" />
                    Buffer: Cepat
                  </span>
                  <span>•</span>
                  <span>FPS: 60</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Chat Stream Box (Right 4 cols on desktop) */}
          <div className="lg:col-span-4">
            <LiveChatBox
              messages={chatMessages}
              theme={theme}
              streamerName={creator.name}
              isAutoChatActive={isAutoChatActive}
              onToggleAutoChat={() => setIsAutoChatActive((prev) => !prev)}
              onSendMessage={handleSendMessage}
              onOpenTipModal={handleTipAction}
              isLive={creator.isLive}
            />
          </div>

        </div>

        {/* 3. Video Playlist & MP4 Video Collections Section */}
        <VideoPlaylist
          videos={videos}
          currentVideo={currentVideo}
          theme={theme}
          isAdmin={isAdmin}
          onSelectVideo={(v) => {
            setCurrentVideo(v);
          }}
          onOpenAddModal={() => {
            if (!checkAndShowAgeModal()) setIsAddModalOpen(true);
          }}
          onDeleteVideo={videos.length > 1 ? handleDeleteVideo : undefined}
          onEditVideo={isAdmin ? (v) => setEditingVideo(v) : undefined}
          onReorderVideos={isAdmin ? setVideos : undefined}
        />

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/10 py-8 px-4 bg-black/40 text-center text-xs text-gray-400 space-y-3">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Tv className="w-4 h-4" style={{ color: theme.primaryHex }} />
          <span className="font-bold text-white">VideyPlayer Studio & Streaming</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-300">Format MP4 & VideyCo Autoplay</span>
          <span className="text-gray-500">•</span>
          {isAdmin ? (
            <button
              onClick={() => setIsAdminDashboardOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Buka Dashboard Admin
            </button>
          ) : (
            <button
              onClick={() => setIsAdminLoginOpen(true)}
              className="text-orange-400 hover:text-orange-300 font-bold underline flex items-center gap-1"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Masuk Admin
            </button>
          )}
        </div>
        <p className="max-w-md mx-auto text-[11px] text-gray-500">
          Landing page video player interaktif dengan fitur lengkap admin, kontrol autoplay responsif, shuffle pengunjung, dan optimasi OpenGraph Facebook.
        </p>
      </footer>

      {/* ADMIN MODALS */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
        currentPin={siteSettings.adminPin}
        theme={theme}
      />

      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        onLogoutAdmin={handleAdminLogout}
        videos={videos}
        currentVideo={currentVideo}
        creator={creator}
        playerSettings={playerSettings}
        theme={theme}
        siteSettings={siteSettings}
        onUpdateVideos={setVideos}
        onSelectVideo={setCurrentVideo}
        onUpdateCreator={setCreator}
        onUpdatePlayerSettings={handleUpdateSettings}
        onUpdateTheme={setTheme}
        onUpdateSiteSettings={handleUpdateSiteSettings}
        onOpenAddVideoModal={() => {
          if (!checkAndShowAgeModal()) setIsAddModalOpen(true);
        }}
      />

      {/* STANDARD MODALS */}
      <AddVideoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddVideo={handleAddVideo}
        theme={theme}
      />

      <ThemeCustomizerModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={theme}
        onSelectThemePreset={handleSelectThemePreset}
        onUpdateCustomTheme={handleUpdateCustomTheme}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={playerSettings}
        onUpdateSettings={handleUpdateSettings}
        creator={creator}
        onUpdateCreator={handleUpdateCreator}
        theme={theme}
        onResetDefaults={handleResetDefaults}
      />

      <CreatorTipModal
        isOpen={isTipModalOpen}
        onClose={() => setIsTipModalOpen(false)}
        creatorName={creator.name}
        theme={theme}
        onSendTip={handleSendTip}
      />

      {/* 18+ AGE VERIFICATION MODAL */}
      <AgeVerificationModal
        isOpen={isAgeModalOpen}
        config={siteSettings.ageVerification || {
          enabled: true,
          title: '⚠️ Peringatan Konten 18+ (Dewasa)',
          message: 'Halaman dan siaran video ini khusus untuk pengunjung berusia 18 tahun ke atas. Harap konfirmasi bahwa Anda telah memenuhi batasan usia sebelum melanjutkan.',
          confirmButtonText: 'SAYA BERUSIA 18+ & SETUJU LANJUTKAN',
          cancelButtonText: 'Keluar / Batal',
          redirectSmartlinkOnConfirm: true,
          requireConsentEverySession: false,
        }}
        theme={theme}
        smartlinkUrl={siteSettings.smartlink?.smartlinkUrl}
        onConfirm={handleAgeConfirm}
        onDecline={handleAgeDecline}
      />

      <EditVideoModal
        isOpen={!!editingVideo}
        onClose={() => setEditingVideo(null)}
        onSave={handleSaveEditedVideo}
        video={editingVideo}
        theme={theme}
      />

    </div>
  );
}
