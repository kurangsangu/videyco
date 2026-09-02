import React from 'react';
import { 
  Tv, 
  Plus, 
  Palette, 
  Settings, 
  Radio, 
  Sparkles,
  PlayCircle,
  ShieldCheck,
  KeyRound,
  LogOut,
  UserCheck
} from 'lucide-react';
import { ThemeConfig, PlayerSettings } from '../types';

interface NavbarProps {
  currentTheme: ThemeConfig;
  playerSettings: PlayerSettings;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
  onOpenAdminDashboard: () => void;
  onLogoutAdmin: () => void;
  onOpenAddModal: () => void;
  onOpenThemeModal: () => void;
  onOpenSettingsModal: () => void;
  onToggleAutoplay: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isLive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTheme,
  playerSettings,
  isAdmin,
  onOpenAdminLogin,
  onOpenAdminDashboard,
  onLogoutAdmin,
  onOpenAddModal,
  onOpenThemeModal,
  onOpenSettingsModal,
  onToggleAutoplay,
  searchQuery,
  onSearchChange,
  isLive,
}) => {
  return (
    <header 
      id="main-navbar"
      className={`sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors duration-300 ${
        currentTheme.glassEffect 
          ? 'bg-black/60 border-white/10' 
          : `${currentTheme.bgCard} ${currentTheme.borderColor}`
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          
          {/* Logo & Brand & Nav Links */}
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-2.5">
              <div 
                className="flex items-center justify-center w-9 h-9 rounded-xl shadow-lg transition-transform hover:scale-105 shrink-0"
                style={{ 
                  backgroundColor: currentTheme.primaryHex,
                  boxShadow: `0 0 20px ${currentTheme.primaryHex}40`
                }}
              >
                <Tv className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl sm:text-2xl tracking-tighter text-white">
                  <span style={{ color: currentTheme.primaryHex }}>V-PLAY</span>LIVE
                </span>
              </div>
            </div>

            {/* Immersive Nav Links */}
            <div className="hidden lg:flex items-center gap-5 text-xs font-semibold tracking-wide uppercase text-zinc-400">
              <a href="#video-player-container" className="text-white hover:text-orange-400 transition-colors">
                Beranda
              </a>
              <a href="#creator-profile-banner" className="hover:text-white transition-colors flex items-center gap-1.5">
                Live Sekarang
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              </a>
              <a href="#video-playlist-section" className="hover:text-white transition-colors">
                Koleksi VOD
              </a>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xs md:max-w-sm hidden md:block">
            <div className="relative">
              <input
                id="search-videos-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari video, VOD, atau klip..."
                className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all"
                style={{
                  '--tw-ring-color': currentTheme.primaryHex,
                } as React.CSSProperties}
              />
            </div>
          </div>

          {/* Action Buttons & Status */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Online Stream Status Badge */}
            <div className="bg-zinc-900/80 border border-white/10 rounded-full px-3 py-1 flex items-center gap-1.5 shrink-0 hidden xs:flex">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                {isLive ? 'Live HD' : 'VOD'}
              </span>
            </div>

            {/* Quick Autoplay Switch */}
            <button
              id="quick-autoplay-toggle-btn"
              onClick={onToggleAutoplay}
              title={playerSettings.autoplay ? 'Autoplay Aktif (Klik untuk Matikan)' : 'Autoplay Mati (Klik untuk Aktifkan)'}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                playerSettings.autoplay 
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-sm' 
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <PlayCircle className={`w-3.5 h-3.5 ${playerSettings.autoplay ? 'text-emerald-400' : 'text-zinc-400'}`} />
              <span>Autoplay: <strong className={playerSettings.autoplay ? 'text-emerald-300' : 'text-zinc-400'}>{playerSettings.autoplay ? 'ON' : 'OFF'}</strong></span>
            </button>

            {/* ADMIN MODE CONTROLS */}
            {isAdmin ? (
              <>
                {/* Dashboard Admin Button */}
                <button
                  id="open-admin-dashboard-btn"
                  onClick={onOpenAdminDashboard}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-extrabold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all border border-white/20 animate-pulse"
                  style={{ 
                    backgroundColor: currentTheme.primaryHex,
                    boxShadow: `0 0 25px ${currentTheme.primaryHex}66`
                  }}
                  title="Buka Dashboard Admin Superuser"
                >
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Dashboard Admin</span>
                </button>

                {/* Add Video Button (Admin Only) */}
                <button
                  id="open-add-video-modal-btn"
                  onClick={onOpenAddModal}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all"
                  title="Tambah Video Baru"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Video</span>
                </button>

                {/* Logout Admin */}
                <button
                  id="admin-logout-btn"
                  onClick={onLogoutAdmin}
                  className="flex items-center justify-center p-2 rounded-full bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 transition-all"
                  title="Keluar dari Akun Admin"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                {/* VISITOR / AUDIENS MODE CONTROLS */}
                <button
                  id="open-admin-login-btn"
                  onClick={onOpenAdminLogin}
                  className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-zinc-200 border border-white/15 hover:border-white/30 transition-all"
                  title="Masuk sebagai Admin / Pemilik Landing Page"
                >
                  <KeyRound className="w-3.5 h-3.5 text-orange-400" />
                  <span className="hidden sm:inline">Masuk Admin</span>
                  <span className="sm:hidden">Admin</span>
                </button>
              </>
            )}

            {/* General Settings Trigger */}
            <button
              id="open-settings-modal-btn"
              onClick={onOpenSettingsModal}
              className="flex items-center justify-center p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all"
              title="Pengaturan Autoplay & Video Player"
            >
              <Settings className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
