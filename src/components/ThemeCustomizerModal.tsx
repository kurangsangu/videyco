import React from 'react';
import { 
  X, 
  Palette, 
  Sparkles, 
  Check, 
  Layers, 
  Maximize2, 
  Sliders,
  Sun,
  Moon
} from 'lucide-react';
import { ThemeConfig, ThemePresetId } from '../types';
import { THEME_PRESETS } from '../data/defaultData';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeConfig;
  onSelectThemePreset: (preset: ThemeConfig) => void;
  onUpdateCustomTheme: (updates: Partial<ThemeConfig>) => void;
}

const CUSTOM_COLORS = [
  { name: 'Ungu Cozy', hex: '#a855f7' },
  { name: 'Merah Ruby', hex: '#f43f5e' },
  { name: 'Pink Fuchsia', hex: '#ec4899' },
  { name: 'Cyan Neon', hex: '#06b6d4' },
  { name: 'Hijau Emerald', hex: '#10b981' },
  { name: 'Kuning Amber', hex: '#f59e0b' },
  { name: 'Biru Royal', hex: '#3b82f6' },
  { name: 'Violet Gelap', hex: '#8b5cf6' },
];

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectThemePreset,
  onUpdateCustomTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col ${
          currentTheme.glassEffect ? 'bg-neutral-950/90 border-white/15' : 'bg-neutral-900 border-neutral-800'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2.5">
            <div 
              className="p-2 rounded-xl text-white shadow-md"
              style={{ backgroundColor: currentTheme.primaryHex }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Studio Kustomisasi Tema & Tampilan
              </h2>
              <p className="text-xs text-gray-400">
                Pilih palet warna dan sesuaikan gaya visual landing page video player
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

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          
          {/* Preset Themes */}
          <div className="space-y-2.5">
            <label className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Pilihan Tema Siap Pakai (Presets):</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {THEME_PRESETS.map((preset) => {
                const isSelected = currentTheme.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    id={`theme-preset-${preset.id}`}
                    onClick={() => onSelectThemePreset(preset)}
                    className={`p-3 rounded-xl border text-left flex items-start justify-between gap-2 transition-all ${
                      isSelected
                        ? 'border-2 shadow-lg scale-[1.01] bg-white/10'
                        : 'border-white/10 hover:border-white/20 bg-white/5'
                    }`}
                    style={{
                      borderColor: isSelected ? preset.primaryHex : undefined,
                    }}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: preset.primaryHex }}
                        />
                        <span className="font-bold text-white text-xs">
                          {preset.name}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>
                    {isSelected && (
                      <span 
                        className="p-1 rounded-full text-white"
                        style={{ backgroundColor: preset.primaryHex }}
                      >
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Accent Color Palette */}
          <div className="space-y-2.5 pt-4 border-t border-white/10">
            <label className="font-bold text-white uppercase tracking-wider text-[11px] block">
              🎨 Warna Aksen Kustom (Primary Color):
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {CUSTOM_COLORS.map((c) => {
                const isCurrent = currentTheme.primaryHex === c.hex;
                return (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => onUpdateCustomTheme({ primaryHex: c.hex, accentGlow: `${c.hex}40` })}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                      isCurrent ? 'border-white bg-white/15 scale-105' : 'border-white/10 hover:border-white/25 bg-white/5'
                    }`}
                  >
                    <span 
                      className="w-6 h-6 rounded-full shadow-md flex items-center justify-center"
                      style={{ backgroundColor: c.hex }}
                    >
                      {isCurrent && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </span>
                    <span className="text-[9px] text-gray-300 font-medium truncate w-full text-center">
                      {c.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Border Radius & Visual Effects */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <label className="font-bold text-white uppercase tracking-wider text-[11px] block">
              📐 Gaya Sudut & Efek Visual:
            </label>

            {/* Corner Radius */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Tajam (0px)', val: 'rounded-none' as const },
                { label: 'Standar (8px)', val: 'rounded-lg' as const },
                { label: 'Halus (12px)', val: 'rounded-xl' as const },
                { label: 'Membulat (16px)', val: 'rounded-2xl' as const },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => onUpdateCustomTheme({ borderRadius: item.val })}
                  className={`p-2.5 rounded-xl border text-center font-bold text-[11px] transition-all ${
                    currentTheme.borderRadius === item.val
                      ? 'border-white bg-white/15 text-white'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Glassmorphism Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <div>
                <span className="font-bold text-white text-xs block">
                  Efek Glassmorphism & Blur
                </span>
                <span className="text-[11px] text-gray-400">
                  Memberikan efek kaca transparan tembus pandang pada navbar dan panel
                </span>
              </div>
              <button
                type="button"
                onClick={() => onUpdateCustomTheme({ glassEffect: !currentTheme.glassEffect })}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  currentTheme.glassEffect ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
              >
                <div 
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    currentTheme.glassEffect ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Live Preview Sample */}
          <div className="p-4 rounded-xl border border-white/15 bg-white/5 space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Pratinjau Langsung Elemen UI:
            </span>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg"
                style={{ backgroundColor: currentTheme.primaryHex }}
              >
                Tombol Utama
              </button>
              <span 
                className="px-3 py-1 rounded-full text-xs font-bold border"
                style={{
                  backgroundColor: `${currentTheme.primaryHex}20`,
                  borderColor: `${currentTheme.primaryHex}50`,
                  color: currentTheme.primaryHex,
                }}
              >
                Badge Kategori
              </span>
              <span className="text-xs text-gray-300">
                Tema aktif: <strong className="text-white">{currentTheme.name}</strong>
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-end bg-white/5">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-white shadow-lg hover:brightness-110 active:scale-95"
            style={{ backgroundColor: currentTheme.primaryHex }}
          >
            Terapkan & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
