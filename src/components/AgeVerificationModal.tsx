import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, ArrowRight, Lock } from 'lucide-react';
import { AgeVerificationConfig, ThemeConfig } from '../types';

interface AgeVerificationModalProps {
  isOpen: boolean;
  config: AgeVerificationConfig;
  theme: ThemeConfig;
  smartlinkUrl?: string;
  onConfirm: () => void;
  onDecline: () => void;
}

export const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({
  isOpen,
  config,
  theme,
  smartlinkUrl,
  onConfirm,
  onDecline,
}) => {
  const [countdown, setCountdown] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleAgree = () => {
    onConfirm();
  };

  const handleDisagree = () => {
    if (smartlinkUrl) {
      window.location.href = smartlinkUrl;
    } else {
      onDecline();
    }
  };

  return (
    <div 
      id="age-verification-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in"
    >
      <div 
        id="age-verification-dialog"
        className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-rose-500/40 p-6 sm:p-8 shadow-2xl shadow-rose-950/50 text-center relative overflow-hidden space-y-6"
      >
        {/* Glow decoration */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-rose-600/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-amber-600/20 blur-3xl pointer-events-none" />

        {/* 18+ Warning Badge */}
        <div className="flex justify-center relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-amber-500 flex items-center justify-center p-1 shadow-xl ring-8 ring-rose-500/20 animate-pulse">
            <div className="w-full h-full rounded-full bg-black flex flex-col items-center justify-center border-2 border-rose-400/60">
              <span className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tighter">18+</span>
              <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold -mt-1">HANYA</span>
            </div>
          </div>
        </div>

        {/* Title and Message */}
        <div className="space-y-2.5 relative z-10">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
            <span>{config.title || 'Peringatan Konten 18+ (Dewasa)'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-md mx-auto">
            {config.message || 'Halaman dan streaming video ini hanya diperuntukkan bagi pengguna yang telah berusia 18 tahun ke atas. Klik tombol di bawah untuk mengonfirmasi bahwa Anda telah cukup umur.'}
          </p>
        </div>

        {/* Requirements Checklist Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-left text-xs text-zinc-300 space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Saya menyatakan bahwa saya berusia <strong>18 tahun ke atas</strong>.</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Saya menyetujui pemutaran siaran dan pengalihan link partner.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2 relative z-10">
          <button
            id="age-confirm-button"
            type="button"
            onClick={handleAgree}
            className="w-full py-3.5 sm:py-4 px-6 rounded-2xl font-extrabold text-sm sm:text-base text-white bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-rose-400/40"
          >
            <span>{config.confirmButtonText || 'SAYA BERUSIA 18+ & SETUJU LANJUTKAN'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            id="age-decline-button"
            type="button"
            onClick={handleDisagree}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-all"
          >
            {config.cancelButtonText || 'Saya Berusia di Bawah 18 Tahun (Keluar)'}
          </button>
        </div>

        {/* Security badge footer */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-400 font-mono pt-1 border-t border-white/5">
          <Lock className="w-3 h-3 text-zinc-400" />
          <span>Verifikasi Usia Terenkripsi & Sesuai Kebijakan Komunitas</span>
        </div>
      </div>
    </div>
  );
};
