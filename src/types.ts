export interface VideoItem {
  id: string;
  title: string;
  description: string;
  url: string; // .mp4 direct url or videy.co url
  thumbnail: string;
  duration: string; // e.g. "04:25"
  views: number;
  likes: number;
  category: 'Semua' | 'Live VOD' | 'Highlights' | 'VIP Clip' | 'Terbaru';
  tags: string[];
  addedAt: string;
  uploaderName: string;
  isFeatured?: boolean;
  requireAgeVerification?: boolean; // Whether this video specifically requires 18+ check
}

export interface PlayerSettings {
  autoplay: boolean;
  autoplayMuted: boolean;
  loop: boolean;
  autoNext: boolean;
  playbackSpeed: number;
  theaterMode: boolean;
  volume: number;
  isMuted: boolean;
  quality: string;
  ambientGlow: boolean;
}

export type ThemePresetId = 
  | 'immersive-obsidian'
  | 'cozy-amethyst' 
  | 'spank-ruby' 
  | 'cyber-neon' 
  | 'emerald-stream' 
  | 'sunset-amber' 
  | 'midnight-black'
  | 'pure-light';

export interface ThemeConfig {
  id: ThemePresetId;
  name: string;
  description: string;
  primaryColor: string; // Tailwind color or hex
  primaryHex: string;
  bgDark: string;
  bgCard: string;
  borderColor: string;
  textColor: string;
  textMuted: string;
  accentGlow: string;
  badgeBg: string;
  borderRadius: 'rounded-lg' | 'rounded-xl' | 'rounded-2xl' | 'rounded-none';
  glassEffect: boolean;
}

export interface CreatorProfile {
  name: string;
  handle: string;
  tagline: string;
  bio: string;
  avatar: string;
  banner: string;
  isLive: boolean;
  liveTitle: string;
  followers: number;
  totalViews: number;
  vipGoal: {
    title: string;
    current: number;
    target: number;
    currency: string;
  };
  socialLinks: {
    platform: string;
    url: string;
    label: string;
  }[];
}

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  isVip?: boolean;
  isMod?: boolean;
  isStreamer?: boolean;
  tipAmount?: number;
  avatar?: string;
  badge?: string;
}

export interface OpenGraphConfig {
  title: string;
  description: string;
  imageUrl: string;
  siteName: string;
  pageUrl: string;
  videoUrl?: string;
  fbAppId?: string;
  twitterHandle?: string;
}

export interface AnnouncementConfig {
  enabled: boolean;
  text: string;
  linkText?: string;
  linkUrl?: string;
  badgeText?: string;
}

export interface VisitorLog {
  id: string;
  timestamp: string;
  videoTitle: string;
  device: 'Mobile' | 'Tablet' | 'Desktop';
  ipOrCity: string;
}

export interface SmartlinkConfig {
  enabled: boolean;
  smartlinkUrl: string; // Legacy / Fallback
  smartlinkUrls?: string[]; // Array of up to 5 Adsterra URLs for shuffling
  redirectDelaySeconds: number; // 3 to 10 seconds default
  triggerOnPlay: boolean; // Redirect after video plays for X seconds
  triggerOnVisitorEnter: boolean; // Redirect after visitor enters site for X seconds
  enableBackRedirect: boolean; // Force redirect to smartlink when user presses browser back button
  openInNewTab: boolean; // Window location or new tab
}

export interface AgeVerificationConfig {
  enabled: boolean;
  title: string;
  message: string;
  confirmButtonText: string;
  cancelButtonText: string;
  redirectSmartlinkOnConfirm: boolean; // redirect to smartlink immediately or trigger countdown on confirm
  requireConsentEverySession: boolean;
  triggerTimeSeconds: number; // Video second to trigger pop-up
}

export interface SiteSettings {
  adminPin: string;
  shuffleVideoForVisitors: boolean;
  shuffleMode: 'random_first' | 'full_playlist_shuffle' | 'fixed_first';
  defaultVideoId: string;
  smartlink: SmartlinkConfig;
  ageVerification: AgeVerificationConfig;
  openGraph: OpenGraphConfig;
  announcement: AnnouncementConfig;
  visitorStats: {
    totalVisitors: number;
    totalPlays: number;
    totalLikes: number;
    logs: VisitorLog[];
  };
}

