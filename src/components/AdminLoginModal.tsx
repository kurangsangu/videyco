import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, X, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { ThemeConfig } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  currentPin: string;
  theme: ThemeConfig;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentPin,
  theme,
}) => {
  const [pinInput, setPinInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === currentPin.trim()) {
      setIsSuccess(true);
      setErrorMsg('');
      setTimeout(() => {
        setIsSuccess(false);
        setPinInput('');
        onLoginSuccess();
        onClose();
      }, 500);
    } else {
      setErrorMsg('Password Admin salah! Silakan coba lagi.');
      setPinInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-all ${
          theme.glassEffect ? 'bg-black/90 border-white/20' : `${theme.bgCard} ${theme.borderColor}`
        }`}
        style={{
          boxShadow: `0 0 50px ${theme.primaryHex}33`
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div 
              className="p-2.5 rounded-xl text-white shadow-lg"
              style={{ backgroundColor: theme.primaryHex }}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Autentikasi Dashboard Admin
              </h3>
              <p className="text-xs text-zinc-400">
                Akses penuh kelola video, pengaturan & keamanan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
              Masukkan Password Admin
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Ketik Password Admin..."
                autoFocus
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-center text-lg font-mono text-white placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all"
                style={{
                  '--tw-ring-color': theme.primaryHex,
                } as React.CSSProperties}
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 font-semibold flex items-center gap-1 mt-1 animate-fade-in">
                <AlertCircle className="w-3.5 h-3.5" />
                {errorMsg}
              </p>
            )}

            {isSuccess && (
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-1 animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Login Admin Berhasil! Mengalihkan...
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!pinInput.trim()}
            className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: theme.primaryHex,
              boxShadow: `0 0 20px ${theme.primaryHex}40`
            }}
          >
            <span>Buka Dashboard Admin</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
