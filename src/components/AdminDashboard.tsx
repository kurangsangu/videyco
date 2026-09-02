import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Film, 
  Share2, 
  Shuffle, 
  Sliders, 
  Palette, 
  BarChart3, 
  KeyRound, 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Check, 
  ExternalLink, 
  Tv, 
  Radio, 
  Gift, 
  Sparkles, 
  Smartphone, 
  Monitor, 
  Tablet, 
  AlertCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Star,
  Link as LinkIcon,
  ShieldAlert,
  Clock,
  ExternalLink as RedirectIcon
} from 'lucide-react';
import { VideoItem, CreatorProfile, PlayerSettings, ThemeConfig, SiteSettings, OpenGraphConfig, SmartlinkConfig, AgeVerificationConfig } from '../types';
import { THEME_PRESETS } from '../data/defaultData';
import { FEMALE_STREAMER_PRESETS } from '../data/femaleStreamers';
import { normalizeVideoUrl } from '../utils/videoHelpers';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onLogoutAdmin: () => void;
  videos: VideoItem[];
  currentVideo: VideoItem;
  creator: CreatorProfile;
  playerSettings: PlayerSettings;
  theme: ThemeConfig;
  siteSettings: SiteSettings;
  onUpdateVideos: (newVideos: VideoItem[]) => void;
  onSelectVideo: (video: VideoItem) => void;
  onUpdateCreator: (newCreator: CreatorProfile) => void;
  onUpdatePlayerSettings: (newSettings: Partial<PlayerSettings>) => void;
  onUpdateTheme: (newTheme: ThemeConfig) => void;
  onUpdateSiteSettings: (newSettings: Partial<SiteSettings>) => void;
  onOpenAddVideoModal: () => void;
}

type AdminTab = 'videos' | 'smartlink' | 'age_verification' | 'opengraph' | 'shuffle' | 'landing_page' | 'theme' | 'analytics' | 'security';


export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onLogoutAdmin,
  videos,
  currentVideo,
  creator,
  playerSettings,
  theme,
  siteSettings,
  onUpdateVideos,
  onSelectVideo,
  onUpdateCreator,
  onUpdatePlayerSettings,
  onUpdateTheme,
  onUpdateSiteSettings,
  onOpenAddVideoModal,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('videos');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

  // Editing single video state
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // OpenGraph Form state
  const [ogForm, setOgForm] = useState<OpenGraphConfig>({ ...siteSettings.openGraph });

  // Smartlink Adsterra Form state
  const [smartlinkForm, setSmartlinkForm] = useState<SmartlinkConfig>({
    enabled: siteSettings.smartlink?.enabled ?? false,
    smartlinkUrl: siteSettings.smartlink?.smartlinkUrl ?? '',
    smartlinkUrls: siteSettings.smartlink?.smartlinkUrls ?? [],
    redirectDelaySeconds: siteSettings.smartlink?.redirectDelaySeconds ?? 6,
    triggerOnPlay: siteSettings.smartlink?.triggerOnPlay ?? true,
    triggerOnVisitorEnter: siteSettings.smartlink?.triggerOnVisitorEnter ?? true,
    enableBackRedirect: siteSettings.smartlink?.enableBackRedirect ?? true,
    openInNewTab: siteSettings.smartlink?.openInNewTab ?? false,
  });

  // Age Verification 18+ Form state
  const [ageForm, setAgeForm] = useState<AgeVerificationConfig>({
    enabled: siteSettings.ageVerification?.enabled ?? true,
    title: siteSettings.ageVerification?.title ?? '⚠️ Peringatan Konten 18+ (Dewasa)',
    message: siteSettings.ageVerification?.message ?? 'Halaman dan siaran video ini khusus untuk pengunjung berusia 18 tahun ke atas. Harap konfirmasi bahwa Anda telah memenuhi batasan usia sebelum melanjutkan.',
    confirmButtonText: siteSettings.ageVerification?.confirmButtonText ?? 'SAYA BERUSIA 18+ & SETUJU LANJUTKAN',
    cancelButtonText: siteSettings.ageVerification?.cancelButtonText ?? 'Keluar / Batal',
    redirectSmartlinkOnConfirm: siteSettings.ageVerification?.redirectSmartlinkOnConfirm ?? true,
    requireConsentEverySession: siteSettings.ageVerification?.requireConsentEverySession ?? false,
    triggerTimeSeconds: siteSettings.ageVerification?.triggerTimeSeconds ?? 0,
  });

  // Creator Form state
  const [creatorForm, setCreatorForm] = useState<CreatorProfile>({ ...creator });
  const [streamerSearchQuery, setStreamerSearchQuery] = useState<string>('');

  // Announcement Form state
  const [announcementForm, setAnnouncementForm] = useState({ ...siteSettings.announcement });

  // Security Password Form state
  const [newPin, setNewPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Video Management actions
  const handleDeleteVideo = (id: string) => {
    if (videos.length <= 1) {
      showNotification('Minimal harus ada 1 video dalam playlist!');
      return;
    }
    setDeleteConfirmId(id);
  };

  const confirmDeleteVideo = () => {
    if (!deleteConfirmId) return;
    const updated = videos.filter((v) => v.id !== deleteConfirmId);
    onUpdateVideos(updated);
    if (currentVideo.id === deleteConfirmId) {
      onSelectVideo(updated[0]);
    }
    showNotification('Video berhasil dihapus!');
    setDeleteConfirmId(null);
  };

  const handleToggleFeatured = (id: string) => {
    const updated = videos.map((v) => ({
      ...v,
      isFeatured: v.id === id ? !v.isFeatured : false,
    }));
    onUpdateVideos(updated);
    showNotification('Video utama / featured diperbarui!');
  };

  const handleSaveEditVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;

    let processedUrl = editingVideo.url.trim();
    if (processedUrl.includes('videy.co/v?id=')) {
      const idMatch = processedUrl.match(/id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        processedUrl = `https://cdn.videy.co/${idMatch[1]}.mp4`;
      }
    }

    const updated = videos.map((v) => (v.id === editingVideo.id ? { ...editingVideo, url: processedUrl } : v));
    onUpdateVideos(updated);
    if (currentVideo.id === editingVideo.id) {
      onSelectVideo({ ...editingVideo, url: processedUrl });
    }
    setEditingVideo(null);
    showNotification('Perubahan video berhasil disimpan!');
  };

  // Smartlink Adsterra save action
  const handleSaveSmartlink = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteSettings({ smartlink: smartlinkForm });
    showNotification('Pengaturan URL Smartlink Adsterra & Jeda Redirect berhasil disimpan!');
  };

  // Age Verification 18+ save action
  const handleSaveAgeVerification = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteSettings({ ageVerification: ageForm });
    showNotification('Pengaturan Peringatan Pop-up 18+ berhasil disimpan!');
  };

  // OpenGraph save action
  const handleSaveOpenGraph = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteSettings({ openGraph: ogForm });

    // Update document title and OG meta in DOM
    document.title = ogForm.title;
    const ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) ogTitleMeta.setAttribute('content', ogForm.title);
    const ogDescMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescMeta) ogDescMeta.setAttribute('content', ogForm.description);

    showNotification('Pengaturan OpenGraph Facebook berhasil diperbarui!');
  };

  // Creator & Landing Page save action
  const handleSaveCreator = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCreator(creatorForm);
    onUpdateSiteSettings({ announcement: announcementForm });
    showNotification('Isi landing page & profil kreator berhasil disimpan!');
  };

  // Shuffle settings save action
  const handleToggleShuffle = (enabled: boolean) => {
    onUpdateSiteSettings({ shuffleVideoForVisitors: enabled });
    showNotification(enabled ? 'Shuffle video pengunjung diaktifkan!' : 'Shuffle video pengunjung dimatikan.');
  };

  const handleChangeShuffleMode = (mode: 'random_first' | 'full_playlist_shuffle' | 'fixed_first') => {
    onUpdateSiteSettings({ shuffleMode: mode });
    showNotification('Mode pengacakan video berhasil diubah.');
  };

  // Security Password save action
  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      setPinError('Password minimal harus 4 karakter.');
      return;
    }
    if (newPin !== confirmPin) {
      setPinError('Konfirmasi Password tidak cocok!');
      return;
    }
    onUpdateSiteSettings({ adminPin: newPin });
    setNewPin('');
    setConfirmPin('');
    setPinError('');
    showNotification('Password Admin berhasil diperbarui!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-lg animate-fade-in">
      <div 
        className={`w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all ${
          theme.glassEffect ? 'bg-zinc-950/95 border-white/20' : `${theme.bgCard} ${theme.borderColor}`
        }`}
        style={{
          boxShadow: `0 0 60px ${theme.primaryHex}33`
        }}
      >
        {/* Admin Header Bar */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between gap-4 bg-white/5">
          <div className="flex items-center gap-3">
            <div 
              className="p-2.5 rounded-2xl text-white shadow-lg flex items-center justify-center"
              style={{ backgroundColor: theme.primaryHex }}
            >
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Dashboard Kontrol Admin
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  Superuser Mode
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Kelola playlist video, OpenGraph Facebook, shuffle pengunjung & tampilan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onLogoutAdmin();
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all"
              title="Keluar dari akun admin"
            >
              Keluar Admin
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {saveSuccessMsg && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/40 px-6 py-2.5 text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div className="px-4 py-3 border-b border-white/10 bg-black/40 flex flex-wrap items-center gap-2">
          {[
            { id: 'videos', label: 'Manajemen Video', icon: Film, count: videos.length },
            { id: 'smartlink', label: 'Smartlink Adsterra', icon: LinkIcon },
            { id: 'age_verification', label: 'Pop-up 18+ Alert', icon: ShieldAlert },
            { id: 'opengraph', label: 'OpenGraph & Facebook', icon: Share2 },
            { id: 'shuffle', label: 'Shuffle & Pengunjung', icon: Shuffle },
            { id: 'landing_page', label: 'Edit Landing Page', icon: Sliders },
            { id: 'theme', label: 'Tema & Tampilan', icon: Palette },
            { id: 'analytics', label: 'Statistik & Log', icon: BarChart3 },
            { id: 'security', label: 'Password & Keamanan', icon: KeyRound },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive 
                    ? 'text-white shadow-md' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
                style={{
                  backgroundColor: isActive ? theme.primaryHex : undefined,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-zinc-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">

          {/* TAB 1: MANAJEMEN VIDEO */}
          {activeTab === 'videos' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Film className="w-4 h-4" style={{ color: theme.primaryHex }} />
                    Daftar Koleksi Video MP4 & VideyCo
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Tambah, edit judul, atur thumbnail, jadikan video utama, atau hapus video.
                  </p>
                </div>
                <button
                  onClick={onOpenAddVideoModal}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
                  style={{ backgroundColor: theme.primaryHex }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Video Baru</span>
                </button>
              </div>

              {/* Video List Table / Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((vid) => (
                  <div
                    key={vid.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row gap-3 ${
                      currentVideo.id === vid.id 
                        ? 'border-2 bg-white/10' 
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                    style={{
                      borderColor: currentVideo.id === vid.id ? theme.primaryHex : undefined
                    }}
                  >
                    {/* Thumbnail preview */}
                    <div className="relative w-full sm:w-36 aspect-video rounded-xl overflow-hidden bg-black/50 shrink-0">
                      <img 
                        src={vid.thumbnail} 
                        alt={vid.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                      <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded text-[9px] font-mono bg-black/80 text-white font-bold">
                        {vid.duration}
                      </span>
                      {vid.isFeatured && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-amber-500 text-black">
                          ★ UTAMA
                        </span>
                      )}
                    </div>

                    {/* Info & Admin Controls */}
                    <div className="flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/10 text-zinc-300">
                            {vid.category}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {vid.views.toLocaleString()} views
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug">
                          {vid.title}
                        </h4>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 pt-2 border-t border-white/5 flex-wrap">
                        <button
                          onClick={() => onSelectVideo(vid)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          Putar
                        </button>
                        <button
                          onClick={() => setEditingVideo(vid)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 transition-colors flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(vid.id)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1 ${
                            vid.isFeatured 
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                              : 'bg-white/5 text-zinc-400 hover:text-white'
                          }`}
                          title="Jadikan video utama"
                        >
                          <Star className="w-3 h-3" />
                          {vid.isFeatured ? 'Utama' : 'Set Utama'}
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(vid.id)}
                          className="p-1 rounded-lg hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors ml-auto"
                          title="Hapus Video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delete Video Sub-Modal */}
              {deleteConfirmId && (
                <div className="p-5 rounded-2xl bg-zinc-900/90 border border-rose-500/30 space-y-4 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-rose-500/20 text-rose-400">
                      <Trash2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Hapus Video Ini?</h4>
                      <p className="text-xs text-zinc-400">Tindakan ini tidak dapat dibatalkan.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white"
                    >
                      Batal
                    </button>
                    <button
                      onClick={confirmDeleteVideo}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-md transition-colors"
                    >
                      Ya, Hapus Video
                    </button>
                  </div>
                </div>
              )}

              {/* Edit Video Sub-Modal */}
              {editingVideo && (
                <div className="p-5 rounded-2xl bg-zinc-900/90 border border-white/20 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-blue-400" />
                      Edit Informasi Video: {editingVideo.title}
                    </h4>
                    <button
                      onClick={() => setEditingVideo(null)}
                      className="text-xs text-zinc-400 hover:text-white"
                    >
                      Batal
                    </button>
                  </div>

                  <form onSubmit={handleSaveEditVideo} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-300 mb-1">Judul Video</label>
                        <input
                          type="text"
                          value={editingVideo.title}
                          onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:ring-1"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-300 mb-1">Kategori</label>
                        <select
                          value={editingVideo.category}
                          onChange={(e) => setEditingVideo({ ...editingVideo, category: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:ring-1"
                        >
                          <option value="Live VOD">Live VOD</option>
                          <option value="Highlights">Highlights</option>
                          <option value="VIP Clip">VIP Clip</option>
                          <option value="Terbaru">Terbaru</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-300 mb-1">URL Video MP4 atau Videy.co</label>
                      <input
                        type="url"
                        value={editingVideo.url}
                        onChange={(e) => setEditingVideo({ ...editingVideo, url: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white focus:outline-none focus:ring-1"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-300 mb-1">URL Thumbnail Gambar</label>
                        <input
                          type="url"
                          value={editingVideo.thumbnail}
                          onChange={(e) => setEditingVideo({ ...editingVideo, thumbnail: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:ring-1"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-300 mb-1">Durasi (misal: 05:20)</label>
                        <input
                          type="text"
                          value={editingVideo.duration}
                          onChange={(e) => setEditingVideo({ ...editingVideo, duration: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:ring-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-300 mb-1">Deskripsi Video</label>
                      <textarea
                        rows={2}
                        value={editingVideo.description}
                        onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:ring-1"
                      />
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        id="edit-ageRestricted"
                        checked={editingVideo.requireAgeVerification || false}
                        onChange={(e) => setEditingVideo({ ...editingVideo, requireAgeVerification: e.target.checked })}
                        className="w-4 h-4 rounded border-white/20 bg-black text-rose-500 focus:ring-0"
                      />
                      <label htmlFor="edit-ageRestricted" className="text-[11px] text-zinc-300">
                        Aktifkan Pop-up Verifikasi 18+ khusus untuk video ini
                      </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingVideo(null)}
                        className="px-4 py-2 rounded-xl bg-white/10 text-xs text-zinc-300 hover:text-white"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md hover:brightness-110"
                        style={{ backgroundColor: theme.primaryHex }}
                      >
                        Simpan Video
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB: SMARTLINK ADSTERRA & REDIRECT CONTROL */}
          {activeTab === 'smartlink' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-emerald-400" />
                    Pengaturan URL Smartlink Adsterra & Jeda Redirect
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Atur URL Smartlink Adsterra, hitungan jeda detik (3-10 detik), redirect otomatis saat video berputar, serta proteksi tombol Back browser.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                    smartlinkForm.enabled 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}>
                    {smartlinkForm.enabled ? '● Smartlink AKTIF' : '○ Smartlink NONAKTIF'}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSaveSmartlink} className="space-y-5">
                {/* Enable / Disable Switch */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <span>Status Smartlink Redirect</span>
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Aktifkan fitur pengalihan otomatis pengunjung ke URL Smartlink Adsterra Anda.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={smartlinkForm.enabled}
                      onChange={(e) => setSmartlinkForm({ ...smartlinkForm, enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {/* Smartlink URL Inputs (Up to 5) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-zinc-200">
                      URL Smartlink Adsterra (Maksimal 5) <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-[10px] bg-zinc-800 px-2 py-1 rounded text-zinc-400">
                      Diacak saat redirect
                    </span>
                  </div>
                  
                  {Array.from({ length: 5 }).map((_, idx) => {
                    // Fallback to legacy single URL if smartlinkUrls is empty and it's the first input
                    const currentUrl = smartlinkForm.smartlinkUrls && smartlinkForm.smartlinkUrls.length > 0 
                      ? (smartlinkForm.smartlinkUrls[idx] || '') 
                      : (idx === 0 ? smartlinkForm.smartlinkUrl : '');
                      
                    return (
                      <div className="relative" key={`smartlink-input-${idx}`}>
                        <input
                          type="url"
                          required={idx === 0}
                          placeholder={idx === 0 ? "https://www.profitablecpmrate.com/xxxxx..." : "Link tambahan opsional..."}
                          value={currentUrl}
                          onChange={(e) => {
                            const newUrls = [...(smartlinkForm.smartlinkUrls || [])];
                            // If upgrading from legacy
                            if (newUrls.length === 0 && smartlinkForm.smartlinkUrl) {
                              newUrls[0] = smartlinkForm.smartlinkUrl;
                            }
                            newUrls[idx] = e.target.value;
                            setSmartlinkForm({ 
                              ...smartlinkForm, 
                              smartlinkUrls: newUrls,
                              // Keep the first one in legacy field for safety
                              smartlinkUrl: idx === 0 ? e.target.value : smartlinkForm.smartlinkUrl
                            });
                          }}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    );
                  })}
                  <p className="text-[11px] text-zinc-400">
                    💡 Isi lebih dari 1 link untuk mengaktifkan fitur Shuffle/Acak (setiap redirect akan memilih salah satu link secara acak untuk menghindari kejenuhan/banned).
                  </p>
                </div>

                {/* Redirect Delay Range (3 to 10 Seconds) */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-zinc-900 border border-emerald-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-emerald-400" />
                        Jeda Waktu Redirect (3 - 10 Detik):
                      </h4>
                      <p className="text-xs text-zinc-400">
                        Waktu penundaan sebelum pengunjung/video otomatis dialihkan ke smartlink.
                      </p>
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                      {smartlinkForm.redirectDelaySeconds} Detik
                    </span>
                  </div>

                  <div className="space-y-1 pt-2">
                    <input
                      type="range"
                      min={3}
                      max={10}
                      step={1}
                      value={smartlinkForm.redirectDelaySeconds}
                      onChange={(e) => setSmartlinkForm({ ...smartlinkForm, redirectDelaySeconds: parseInt(e.target.value) || 5 })}
                      className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                      <span>3 Detik (Cepat)</span>
                      <span>5 Detik (Ideal)</span>
                      <span>7 Detik</span>
                      <span>10 Detik (Maksimal)</span>
                    </div>
                  </div>
                </div>

                {/* Trigger & Behavior Settings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Trigger on Play */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                    <div>
                      <h5 className="text-xs font-bold text-white">Redirect Saat Video Berjalan</h5>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Hitung jeda detik saat video mulai diputar lalu redirect ke smartlink.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={smartlinkForm.triggerOnPlay}
                      onChange={(e) => setSmartlinkForm({ ...smartlinkForm, triggerOnPlay: e.target.checked })}
                      className="w-5 h-5 rounded border-white/20 text-emerald-500 focus:ring-0"
                    />
                  </div>

                  {/* Back Button Intercept */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                    <div>
                      <h5 className="text-xs font-bold text-white">Force Redirect Tombol Back</h5>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Ketika pengunjung klik tombol Back browser, tetap arahkan ke smartlink.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={smartlinkForm.enableBackRedirect}
                      onChange={(e) => setSmartlinkForm({ ...smartlinkForm, enableBackRedirect: e.target.checked })}
                      className="w-5 h-5 rounded border-white/20 text-emerald-500 focus:ring-0"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-950/40 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Simpan Pengaturan Smartlink Adsterra</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: POP-UP PERINGATAN 18+ (AGE VERIFICATION) */}
          {activeTab === 'age_verification' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    Pengaturan Pop-up Peringatan 18+ & Batasan Usia
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Atur modal dialog peringatan 18+ saat pengunjung pertama kali membuka web dan aksi tombol persetujuan lanjut ke smartlink.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                    ageForm.enabled 
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' 
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}>
                    {ageForm.enabled ? '● Pop-up 18+ AKTIF' : '○ Pop-up 18+ NONAKTIF'}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSaveAgeVerification} className="space-y-5">
                {/* Enable / Disable Switch */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <span>Munculkan Pop-up Peringatan 18+</span>
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Tampilkan dialog modal 18+ segera setelah pengunjung membuka website.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ageForm.enabled}
                      onChange={(e) => setAgeForm({ ...ageForm, enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>

                {/* Title and Message */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-200 mb-1">
                      Judul Pop-up Peringatan
                    </label>
                    <input
                      type="text"
                      value={ageForm.title}
                      onChange={(e) => setAgeForm({ ...ageForm, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white"
                      placeholder="⚠️ Peringatan Konten 18+ (Dewasa)"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-200 mb-1">
                      Pesan / Deskripsi Peringatan
                    </label>
                    <textarea
                      rows={3}
                      value={ageForm.message}
                      onChange={(e) => setAgeForm({ ...ageForm, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white"
                      placeholder="Tulis pesan peringatan untuk pengunjung..."
                    />
                  </div>
                </div>

                {/* Button Text Customization */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-200 mb-1">
                      Teks Tombol Lanjut / Setuju (18+)
                    </label>
                    <input
                      type="text"
                      value={ageForm.confirmButtonText}
                      onChange={(e) => setAgeForm({ ...ageForm, confirmButtonText: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-200 mb-1">
                      Teks Tombol Batal / Keluar
                    </label>
                    <input
                      type="text"
                      value={ageForm.cancelButtonText}
                      onChange={(e) => setAgeForm({ ...ageForm, cancelButtonText: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-zinc-200 mb-1 flex items-center justify-between">
                      <span>Delay Kemunculan Pop-up (Range 0 - 10 Detik)</span>
                      <span className="text-emerald-400 font-black">{ageForm.triggerTimeSeconds} Detik</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={ageForm.triggerTimeSeconds}
                      onChange={(e) => setAgeForm({ ...ageForm, triggerTimeSeconds: parseInt(e.target.value) || 0 })}
                      className="w-full accent-emerald-500 bg-white/10 rounded-full h-2 outline-none appearance-none cursor-pointer"
                    />
                    <p className="text-[10px] text-zinc-400 mt-2">
                      Pop-up peringatan 18+ akan muncul saat video mencapai detik ini. Jika 0, maka muncul tepat saat pengunjung mulai memutar video.
                    </p>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-lg shadow-rose-950/40 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Simpan Pengaturan Pop-up 18+</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: OPENGRAPH & FACEBOOK PREVIEW */}
          {activeTab === 'opengraph' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-white/10">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-blue-400" />
                  Pengaturan OpenGraph & Thumbnail Facebook Share
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Atur bagaimana landing page Anda tampil saat link dibagikan di Facebook, WhatsApp, Telegram, dan media sosial.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* OG Form */}
                <form onSubmit={handleSaveOpenGraph} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Meta og:title (Judul Share Facebook)
                    </label>
                    <input
                      type="text"
                      value={ogForm.title}
                      onChange={(e) => setOgForm({ ...ogForm, title: e.target.value })}
                      placeholder="Judul share video..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:ring-2"
                      style={{ '--tw-ring-color': theme.primaryHex } as any}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Meta og:description (Deskripsi Cuplikan)
                    </label>
                    <textarea
                      rows={3}
                      value={ogForm.description}
                      onChange={(e) => setOgForm({ ...ogForm, description: e.target.value })}
                      placeholder="Deskripsi menarik untuk menarik klik penonton..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 leading-relaxed"
                      style={{ '--tw-ring-color': theme.primaryHex } as any}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Meta og:image (Thumbnail Utama Facebook - Rekomendasi 1200x630px)
                    </label>
                    <input
                      type="url"
                      value={ogForm.imageUrl}
                      onChange={(e) => setOgForm({ ...ogForm, imageUrl: e.target.value })}
                      placeholder="https://.../gambar-thumbnail.jpg"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:ring-2 font-mono"
                      style={{ '--tw-ring-color': theme.primaryHex } as any}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">
                        og:site_name
                      </label>
                      <input
                        type="text"
                        value={ogForm.siteName}
                        onChange={(e) => setOgForm({ ...ogForm, siteName: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:ring-1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">
                        fb:app_id (Opsional)
                      </label>
                      <input
                        type="text"
                        value={ogForm.fbAppId || ''}
                        onChange={(e) => setOgForm({ ...ogForm, fbAppId: e.target.value })}
                        placeholder="ID Facebook App..."
                        className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:ring-1"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                      style={{ backgroundColor: theme.primaryHex }}
                    >
                      <Check className="w-4 h-4" />
                      <span>Simpan & Terapkan Meta OpenGraph</span>
                    </button>
                  </div>
                </form>

                {/* Live Social Previews */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2 flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" />
                      Pratinjau Live Post Facebook Feed
                    </h4>
                    
                    {/* Simulated Facebook Share Card */}
                    <div className="rounded-2xl border border-zinc-700 bg-[#242526] text-zinc-100 overflow-hidden shadow-2xl">
                      {/* FB Post Header */}
                      <div className="p-3 flex items-center gap-2.5 border-b border-zinc-700/50">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-sm text-white">
                          F
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Facebook Feed User</p>
                          <p className="text-[10px] text-zinc-400">1 mnt lalu • 🌐 Publik</p>
                        </div>
                      </div>
                      
                      {/* Card Content Link */}
                      <div className="relative aspect-[1.91/1] w-full bg-black overflow-hidden">
                        <img 
                          src={ogForm.imageUrl} 
                          alt="OG Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&h=630&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 backdrop-blur-md text-[10px] font-bold text-white uppercase flex items-center gap-1">
                          <Play className="w-2.5 h-2.5 fill-white" />
                          VIDEO
                        </div>
                      </div>

                      <div className="p-3 bg-[#3a3b3c]/50">
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                          {ogForm.siteName.toLowerCase().replace(/\s+/g, '')}.com
                        </p>
                        <h5 className="text-sm font-bold text-white mt-0.5 line-clamp-1 leading-snug">
                          {ogForm.title}
                        </h5>
                        <p className="text-xs text-zinc-300 mt-1 line-clamp-2 leading-relaxed">
                          {ogForm.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Simulated WhatsApp Preview */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" />
                      Pratinjau WhatsApp Chat Bubble
                    </h4>
                    <div className="p-3 rounded-2xl bg-[#075e54]/30 border border-emerald-500/30 flex gap-3">
                      <img 
                        src={ogForm.imageUrl} 
                        alt="WA Thumbnail" 
                        className="w-20 h-20 rounded-xl object-cover shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <h6 className="text-xs font-bold text-white truncate">{ogForm.title}</h6>
                        <p className="text-[11px] text-zinc-300 line-clamp-2 mt-0.5 leading-tight">{ogForm.description}</p>
                        <span className="text-[10px] text-emerald-400 font-mono mt-1 block truncate">{ogForm.pageUrl}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SHUFFLE & PENGATURAN PENGUNJUNG */}
          {activeTab === 'shuffle' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-white/10">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Shuffle className="w-4 h-4 text-purple-400" />
                  Sistem Shuffle & Pengalaman Audiens / Pengunjung
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Atur logika pemutaran otomatis dan pengacakan video saat pengunjung baru mengakses landing page ini.
                </p>
              </div>

              {/* Master Shuffle Toggle */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    Acak Video Otomatis untuk Setiap Pengunjung (Shuffle on Visit)
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                    Saat aktif, setiap audiens yang membuka landing page akan langsung disajikan video yang bervariasi/acak sehingga tidak monoton.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleShuffle(!siteSettings.shuffleVideoForVisitors)}
                  className={`w-14 h-8 rounded-full transition-colors relative p-1 shrink-0 ${
                    siteSettings.shuffleVideoForVisitors ? 'bg-emerald-500' : 'bg-white/20'
                  }`}
                >
                  <div 
                    className={`w-6 h-6 rounded-full bg-white transition-transform ${
                      siteSettings.shuffleVideoForVisitors ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Shuffle Mode Selection */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Pilih Mode Pengacakan Video
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'random_first',
                      title: 'Pilih 1 Video Acak Pertama',
                      desc: 'Memilih 1 video random saat pengunjung masuk, urutan playlist tetap normal.',
                    },
                    {
                      id: 'full_playlist_shuffle',
                      title: 'Acak Seluruh Playlist',
                      desc: 'Seluruh urutan playlist dan video pertama diacak total untuk setiap audiens.',
                    },
                    {
                      id: 'fixed_first',
                      title: 'Tetapkan Video Utama',
                      desc: 'Selalu mulai dari video featured / video default tanpa pengacakan.',
                    },
                  ].map((mode) => (
                    <div
                      key={mode.id}
                      onClick={() => handleChangeShuffleMode(mode.id as any)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        siteSettings.shuffleMode === mode.id
                          ? 'border-2 bg-purple-900/30'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                      style={{
                        borderColor: siteSettings.shuffleMode === mode.id ? theme.primaryHex : undefined
                      }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <h5 className="text-xs font-bold text-white">{mode.title}</h5>
                        {siteSettings.shuffleMode === mode.id && (
                          <Check className="w-4 h-4" style={{ color: theme.primaryHex }} />
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        {mode.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visitor Autoplay Defaults */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <h4 className="text-sm font-bold text-white">
                  Pengaturan Pemutar Default untuk Pengunjung
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                    <div>
                      <span className="text-xs font-bold text-white block">Autoplay Saat Dimuat</span>
                      <span className="text-[10px] text-zinc-400">Putar video otomatis saat halaman terbuka</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={playerSettings.autoplay}
                      onChange={(e) => onUpdatePlayerSettings({ autoplay: e.target.checked })}
                      className="w-5 h-5 accent-orange-500 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                    <div>
                      <span className="text-xs font-bold text-white block">Auto-Next Video</span>
                      <span className="text-[10px] text-zinc-400">Lanjut ke video berikutnya saat durasi selesai</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={playerSettings.autoNext}
                      onChange={(e) => onUpdatePlayerSettings({ autoNext: e.target.checked })}
                      className="w-5 h-5 accent-orange-500 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EDIT LANDING PAGE & CREATOR */}
          {activeTab === 'landing_page' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-white/10">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  Edit Konten Landing Page & Profil Streamer
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Ubah banner kreator, status live, pengumuman atas, dan link donasi/saweria.
                </p>
              </div>

              <form onSubmit={handleSaveCreator} className="space-y-5">
                {/* Announcement Bar Settings */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Banner Pengumuman Atas (Announcement Bar)
                    </h4>
                    <label className="flex items-center gap-2 text-xs text-zinc-300 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={announcementForm.enabled}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, enabled: e.target.checked })}
                        className="w-4 h-4 accent-orange-500 rounded"
                      />
                      <span>Tampilkan</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-zinc-300 mb-1">Teks Pengumuman</label>
                      <input
                        type="text"
                        value={announcementForm.text}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, text: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-300 mb-1">Badge Teks</label>
                      <input
                        type="text"
                        value={announcementForm.badgeText || 'LIVE'}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, badgeText: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Female Streamer Preset Picker */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-pink-950/30 via-purple-950/30 to-zinc-900 border border-pink-500/30 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-pink-300 flex items-center gap-1.5">
                        <span>👩🇮🇩</span> Koleksi Preset Streamer Wanita Indonesia ({FEMALE_STREAMER_PRESETS.length} Profil):
                      </span>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Klik salah satu profil untuk menerapkan nama, foto wanita Indonesia, kota, dan bio secara otomatis.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const rand = FEMALE_STREAMER_PRESETS[Math.floor(Math.random() * FEMALE_STREAMER_PRESETS.length)];
                          setCreatorForm(rand);
                          showNotification(`Profil diterapkan: ${rand.name}`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-pink-600/30 hover:bg-pink-600/50 border border-pink-500/40 text-xs font-bold text-pink-200 transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                        <span>🔀 Acak Streamer</span>
                      </button>
                    </div>
                  </div>

                  {/* Search / Filter Streamers */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari nama streamer / kota (misal: Siska, Jakarta, Bandung, Bali, Tiara)..."
                      value={streamerSearchQuery}
                      onChange={(e) => setStreamerSearchQuery(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>

                  {/* Horizontal / Grid Streamers Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                    {FEMALE_STREAMER_PRESETS.filter(
                      (p) =>
                        p.name.toLowerCase().includes(streamerSearchQuery.toLowerCase()) ||
                        p.tagline.toLowerCase().includes(streamerSearchQuery.toLowerCase()) ||
                        p.handle.toLowerCase().includes(streamerSearchQuery.toLowerCase())
                    ).map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setCreatorForm(preset);
                          showNotification(`Profil dipilih: ${preset.name}`);
                        }}
                        className={`p-2.5 rounded-xl text-left border transition-all flex items-center gap-2.5 group ${
                          creatorForm.name === preset.name
                            ? 'bg-pink-600/30 text-white border-pink-400 ring-2 ring-pink-500/40 shadow-lg'
                            : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10 hover:border-pink-500/30'
                        }`}
                      >
                        <img
                          src={preset.avatar}
                          alt={preset.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-pink-400/40 shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white truncate group-hover:text-pink-300">
                            {preset.name}
                          </p>
                          <p className="text-[10px] text-pink-300/80 truncate">
                            {preset.handle}
                          </p>
                          <p className="text-[9px] text-zinc-400 truncate">
                            {preset.tagline.split('•')[1] || preset.tagline}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Creator Profile Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">Nama Streamer / Kreator</label>
                    <input
                      type="text"
                      value={creatorForm.name}
                      onChange={(e) => setCreatorForm({ ...creatorForm, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">Username / Handle</label>
                    <input
                      type="text"
                      value={creatorForm.handle}
                      onChange={(e) => setCreatorForm({ ...creatorForm, handle: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">Judul Siaran Langsung (Live Title)</label>
                    <input
                      type="text"
                      value={creatorForm.liveTitle}
                      onChange={(e) => setCreatorForm({ ...creatorForm, liveTitle: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <div>
                      <span className="text-xs font-bold text-white block">Status Siaran Langsung</span>
                      <span className="text-[10px] text-zinc-400">Tampilkan badge LIVE berkedip</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCreatorForm({ ...creatorForm, isLive: !creatorForm.isLive })}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        creatorForm.isLive ? 'bg-rose-600 text-white' : 'bg-white/10 text-zinc-400'
                      }`}
                    >
                      {creatorForm.isLive ? '🔴 LIVE ON' : '⚪ OFFLINE'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">URL Avatar Foto Profil</label>
                    <input
                      type="url"
                      value={creatorForm.avatar}
                      onChange={(e) => setCreatorForm({ ...creatorForm, avatar: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">URL Banner Header</label>
                    <input
                      type="url"
                      value={creatorForm.banner}
                      onChange={(e) => setCreatorForm({ ...creatorForm, banner: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Bio / Deskripsi Kreator</label>
                  <textarea
                    rows={2}
                    value={creatorForm.bio}
                    onChange={(e) => setCreatorForm({ ...creatorForm, bio: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>

                {/* VIP Goal */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5" />
                    Target Saweria / VIP Goal
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-300 mb-1">Nama Target</label>
                      <input
                        type="text"
                        value={creatorForm.vipGoal.title}
                        onChange={(e) => setCreatorForm({
                          ...creatorForm,
                          vipGoal: { ...creatorForm.vipGoal, title: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-300 mb-1">Terkumpul (Rp)</label>
                      <input
                        type="number"
                        value={creatorForm.vipGoal.current}
                        onChange={(e) => setCreatorForm({
                          ...creatorForm,
                          vipGoal: { ...creatorForm.vipGoal, current: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-300 mb-1">Target Total (Rp)</label>
                      <input
                        type="number"
                        value={creatorForm.vipGoal.target}
                        onChange={(e) => setCreatorForm({
                          ...creatorForm,
                          vipGoal: { ...creatorForm.vipGoal, target: parseInt(e.target.value) || 100000 }
                        })}
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
                    style={{ backgroundColor: theme.primaryHex }}
                  >
                    Simpan Perubahan Landing Page
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 5: TEMA & TAMPILAN */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-white/10">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Palette className="w-4 h-4" style={{ color: theme.primaryHex }} />
                  Kustomisasi Tema & Tampilan Landing Page
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Pilih preset tema visual atau sesuaikan warna aksen utama dan estetika kaca.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {THEME_PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => {
                      onUpdateTheme(preset);
                      showNotification(`Tema beralih ke ${preset.name}!`);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      theme.id === preset.id
                        ? 'border-2 shadow-xl scale-[1.02]'
                        : 'border-white/10 hover:border-white/20 hover:scale-[1.01]'
                    } ${preset.bgDark}`}
                    style={{
                      borderColor: theme.id === preset.id ? preset.primaryHex : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                          style={{ backgroundColor: preset.primaryHex }}
                        />
                        <h4 className="font-bold text-xs text-white truncate">{preset.name}</h4>
                      </div>
                      {theme.id === preset.id && (
                        <Check className="w-4 h-4" style={{ color: preset.primaryHex }} />
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: STATISTIK & TELEMETRI PENGUNJUNG */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-white/10">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  Statistik & Riwayat Pengunjung Real-Time
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Pantau jumlah audiens, pemutaran video, dan perangkat yang digunakan.
                </p>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs text-zinc-400 font-bold block mb-1">Total Kunjungan Audiens</span>
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    {siteSettings.visitorStats.totalVisitors.toLocaleString()}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs text-zinc-400 font-bold block mb-1">Total Pemutaran Video</span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                    {siteSettings.visitorStats.totalPlays.toLocaleString()}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
                  <span className="text-xs text-zinc-400 font-bold block mb-1">Responsivitas Server</span>
                  <span className="text-2xl sm:text-3xl font-black text-orange-400">98 ms</span>
                </div>
              </div>

              {/* Device breakdown */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Penyebaran Perangkat Audiens
                </h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <Smartphone className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                    <span className="text-xs font-bold text-white block">Mobile</span>
                    <span className="text-[11px] text-zinc-400">68% Pengunjung</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <Monitor className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <span className="text-xs font-bold text-white block">Desktop</span>
                    <span className="text-[11px] text-zinc-400">25% Pengunjung</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <Tablet className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                    <span className="text-xs font-bold text-white block">Tablet</span>
                    <span className="text-[11px] text-zinc-400">7% Pengunjung</span>
                  </div>
                </div>
              </div>

              {/* Visitor logs */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Log Aktivitas Pengunjung Terbaru
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {siteSettings.visitorStats.logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs text-zinc-300"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-bold text-white">{log.videoTitle}</span>
                        <span className="text-zinc-500 font-mono">• {log.device}</span>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-400 text-[11px]">
                        <span>{log.ipOrCity}</span>
                        <span className="font-mono text-zinc-500">{log.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: KEAMANAN & PIN ADMIN */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-md">
              <div className="pb-4 border-b border-white/10">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-orange-400" />
                  Ubah PIN / Password Dashboard Admin
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Amankan akses dashboard Anda agar hanya pemilik landing page yang bisa mengedit konten.
                </p>
              </div>

              <form onSubmit={handleSavePin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Password Admin Baru
                  </label>
                  <input
                    type="password"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="Masukkan password baru..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white font-mono focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': theme.primaryHex } as any}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="Ulangi password baru..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white font-mono focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': theme.primaryHex } as any}
                    required
                  />
                </div>

                {pinError && (
                  <p className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {pinError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
                  style={{ backgroundColor: theme.primaryHex }}
                >
                  Perbarui Password Admin
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
