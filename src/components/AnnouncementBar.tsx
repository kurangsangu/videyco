import React from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { AnnouncementConfig, ThemeConfig } from '../types';

interface AnnouncementBarProps {
  announcement: AnnouncementConfig;
  theme: ThemeConfig;
  onClose?: () => void;
  onLinkClick?: (e: React.MouseEvent) => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  announcement,
  theme,
  onClose,
  onLinkClick,
}) => {
  if (!announcement.enabled || !announcement.text) return null;

  return (
    <div 
      className="relative z-30 px-4 py-2 text-xs text-white flex items-center justify-between overflow-hidden shadow-sm transition-all"
      style={{
        background: `linear-gradient(90deg, ${theme.primaryHex}dd 0%, #000000 60%, ${theme.primaryHex}aa 100%)`,
        borderBottom: `1px solid ${theme.primaryHex}44`,
      }}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2 overflow-hidden">
          {announcement.badgeText && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white text-black shrink-0 animate-pulse">
              {announcement.badgeText}
            </span>
          )}
          <span className="font-medium text-xs sm:text-sm truncate">
            {announcement.text}
          </span>
        </div>
        {announcement.linkText && (
          <a
            href={announcement.linkUrl || '#'}
            onClick={onLinkClick}
            className="flex items-center gap-1 text-xs font-bold text-white hover:underline shrink-0 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full border border-white/20 transition-all"
          >
            <span>{announcement.linkText}</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        )}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="p-1 text-white/70 hover:text-white transition-colors ml-2 shrink-0"
          title="Tutup Pengumuman"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
