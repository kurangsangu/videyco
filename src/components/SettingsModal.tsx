import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  PlayCircle, 
  VolumeX, 
  Repeat, 
  SkipForward, 
  Sparkles, 
  User, 
  Check, 
  RotateCcw,
  Radio,
  Keyboard
} from 'lucide-react';
import { PlayerSettings, CreatorProfile, ThemeConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PlayerSettings;
  onUpdateSettings: (newSettings: Partial<PlayerSettings>) => void;
  creator: CreatorProfile;
  onUpdateCreator: (newCreator: Partial<CreatorProfile>) => void;
  theme: ThemeConfig;
  onResetDefaults: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  creator,
  onUpdateCreator,
  theme,
  onResetDefaults,
}) => {
  const [activeTab, setActiveTab] = useState<'player' | 'creator'>('player');

  // Creator editing form state
  const [creatorName, setCreatorName] = useState(creator.name);
  const [creatorHandle, setCreatorHandle] = useState(creator.handle);
  const [creatorBio, setCreatorBio] = useState(creator.bio);
  const [creatorIsLive, setCreatorIsLive] = useState(creator.isLive);
  const [creatorGoalTarget, setCreatorGoalTarget] = useState(creator.vipGoal.target);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveCreator = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCreator({
      name: creatorName.trim(),
      handle: creatorHandle.trim(),
      bio: creatorBio.trim(),
      isLive: creatorIsLive,
      vipGoal: {
        ...creator.vipGoal,
        target: Number(creatorGoalTarget) || 5000000,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col ${
          theme.glassEffect ? 'bg-neutral-950/90 border-white/15' : 'bg-neutral-900 border-neutral-800'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2.5">
            <div 
              className="p-2 rounded-xl text-white shadow-md"
              style={{ backgroundColor: theme.primaryHex }}
            >
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Pengaturan Player & Landing Page
              </h2>
              <p className="text-xs text-gray-400">
                Atur perilaku pemutar video, autoplay, dan profil kreator
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-3 flex gap-2 border-b border-white/10 bg-white/5">
          <button
            onClick={() => setActiveTab('player')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'player'
                ? 'text-white border-white'
                : 'text-gray-400 border-transparent hover:text-gray-200'
            }`}
            style={{
              borderColor: activeTab === 'player' ? theme.primaryHex : undefined,
              color: activeTab === 'player' ? theme.primaryHex : undefined,
            }}
          >
            <PlayCircle className="w-4 h-4" />
            <span>Pengaturan Video & Autoplay</span>
          </button>
          <button
            onClick={() => setActiveTab('creator')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'creator'
                ? 'text-white border-white'
                : 'text-gray-400 border-transparent hover:text-gray-200'
            }`}
            style={{
              borderColor: activeTab === 'creator' ? theme.primaryHex : undefined,
              color: activeTab === 'creator' ? theme.primaryHex : undefined,
            }}
          >
            <User className="w-4 h-4" />
            <span>Profil Kreator Stream</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {activeTab === 'player' ? (
            <div className="space-y-3.5">
              
              {/* Autoplay Toggle */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="space-y-0.5 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white text-xs">
                      Autoplay Video Otomatis
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Memutar video secara langsung saat landing page dibuka atau saat memilih video baru dari playlist.
                  </p>
                </div>
                <button
                  type="button"
                  id="settings-autoplay-toggle-btn"
                  onClick={() => onUpdateSettings({ autoplay: !settings.autoplay })}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                    settings.autoplay ? 'bg-emerald-500' : 'bg-gray-700'
                  }`}
                >
                  <div 
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.autoplay ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Autoplay Muted Toggle */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="space-y-0.5 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <VolumeX className="w-4 h-4 text-rose-400" />
                    <span className="font-bold text-white text-xs">
                      Mulai Autoplay Dalam Mode Senyap (Muted)
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Sangat direkomendasikan agar autoplay tidak diblokir oleh kebijakan keamanan peramban browser modern.
                  </p>
                </div>
                <button
                  type="button"
                  id="settings-autoplay-muted-toggle-btn"
                  onClick={() => onUpdateSettings({ autoplayMuted: !settings.autoplayMuted })}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                    settings.autoplayMuted ? 'bg-emerald-500' : 'bg-gray-700'
                  }`}
                >
                  <div 
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.autoplayMuted ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Auto Next Video */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="space-y-0.5 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <SkipForward className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-white text-xs">
                      Putar Otomatis Video Selanjutnya (Auto-Next)
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Otomatis berpindah ke video berikutnya dalam playlist saat video saat ini selesai.
                  </p>
                </div>
                <button
                  type="button"
                  id="settings-autonext-toggle-btn"
                  onClick={() => onUpdateSettings({ autoNext: !settings.autoNext })}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                    settings.autoNext ? 'bg-emerald-500' : 'bg-gray-700'
                  }`}
                >
                  <div 
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.autoNext ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Loop Video */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="space-y-0.5 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Repeat className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-white text-xs">
                      Ulangi Video yang Sama (Looping)
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Memutar video secara berulang tanpa henti ketika durasi berakhir.
                  </p>
                </div>
                <button
                  type="button"
                  id="settings-loop-toggle-btn"
                  onClick={() => onUpdateSettings({ loop: !settings.loop })}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                    settings.loop ? 'bg-emerald-500' : 'bg-gray-700'
                  }`}
                >
                  <div 
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.loop ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Ambient Light Effect */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="space-y-0.5 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-white text-xs">
                      Efek Pencahayaan Bioskop (Ambient Glow)
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Memancarkan pendaran cahaya lembut di belakang bingkai pemutar video sesuai warna tema.
                  </p>
                </div>
                <button
                  type="button"
                  id="settings-ambient-toggle-btn"
                  onClick={() => onUpdateSettings({ ambientGlow: !settings.ambientGlow })}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                    settings.ambientGlow ? 'bg-emerald-500' : 'bg-gray-700'
                  }`}
                >
                  <div 
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.ambientGlow ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Keyboard Shortcuts Reference Guide */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Keyboard className="w-4 h-4" style={{ color: theme.primaryHex }} />
                  <span>Daftar Pintasan Keyboard Global</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                    <span className="text-zinc-300">Putar / Jeda</span>
                    <kbd className="font-mono text-[10px] font-bold bg-white/15 px-2 py-0.5 rounded text-white shadow-sm">Space</kbd>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                    <span className="text-zinc-300">Layar Penuh</span>
                    <kbd className="font-mono text-[10px] font-bold bg-white/15 px-2 py-0.5 rounded text-white shadow-sm">F</kbd>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                    <span className="text-zinc-300">Senyap (Mute)</span>
                    <kbd className="font-mono text-[10px] font-bold bg-white/15 px-2 py-0.5 rounded text-white shadow-sm">M</kbd>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                    <span className="text-zinc-300">Mundur / Maju 5s</span>
                    <div className="flex gap-1">
                      <kbd className="font-mono text-[10px] font-bold bg-white/15 px-1.5 py-0.5 rounded text-white shadow-sm">←</kbd>
                      <kbd className="font-mono text-[10px] font-bold bg-white/15 px-1.5 py-0.5 rounded text-white shadow-sm">→</kbd>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between col-span-2">
                    <span className="text-zinc-300">Volume (Naik / Turun ±5%)</span>
                    <div className="flex gap-1">
                      <kbd className="font-mono text-[10px] font-bold bg-white/15 px-1.5 py-0.5 rounded text-white shadow-sm">↑</kbd>
                      <kbd className="font-mono text-[10px] font-bold bg-white/15 px-1.5 py-0.5 rounded text-white shadow-sm">↓</kbd>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <form onSubmit={handleSaveCreator} className="space-y-3.5">
              {savedSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Profil berhasil diperbarui!</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-white">Nama Kreator / Streamer</label>
                <input
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-white">Username / Handle</label>
                <input
                  type="text"
                  value={creatorHandle}
                  onChange={(e) => setCreatorHandle(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-white">Bio Kreator</label>
                <textarea
                  rows={2}
                  value={creatorBio}
                  onChange={(e) => setCreatorBio(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-white">Target Donasi Saweria (IDR)</label>
                <input
                  type="number"
                  value={creatorGoalTarget}
                  onChange={(e) => setCreatorGoalTarget(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-rose-500" />
                  <div>
                    <span className="font-bold text-white text-xs block">Status Live Streaming</span>
                    <span className="text-[10px] text-gray-400">Tampilkan badge siaran aktif pada banner</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCreatorIsLive(!creatorIsLive)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                    creatorIsLive ? 'bg-rose-600' : 'bg-gray-700'
                  }`}
                >
                  <div 
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      creatorIsLive ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-white shadow-lg transition-all"
                style={{ backgroundColor: theme.primaryHex }}
              >
                Simpan Perubahan Profil
              </button>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between bg-white/5">
          <button
            type="button"
            onClick={onResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Standar</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl font-bold text-white shadow-lg hover:brightness-110 active:scale-95"
            style={{ backgroundColor: theme.primaryHex }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
