import React, { useState } from 'react';
import { 
  X, 
  Gift, 
  Heart, 
  Crown, 
  Sparkles, 
  Check, 
  Flame,
  PartyPopper
} from 'lucide-react';
import { ThemeConfig } from '../types';

interface CreatorTipModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorName: string;
  theme: ThemeConfig;
  onSendTip: (amount: number, user: string, message: string) => void;
}

const PRESET_AMOUNTS = [10000, 25000, 50000, 100000, 250000];

export const CreatorTipModal: React.FC<CreatorTipModalProps> = ({
  isOpen,
  onClose,
  creatorName,
  theme,
  onSendTip,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(25000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseInt(customAmount, 10) : selectedAmount;
    if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) return;

    onSendTip(
      finalAmount,
      userName.trim() || 'Supporter Setia',
      message.trim() || 'Semangat terus live streaming-nya! Keren banget videonya 🔥'
    );

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setMessage('');
      setCustomAmount('');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden ${
          theme.glassEffect ? 'bg-neutral-950/90 border-white/15' : 'bg-neutral-900 border-neutral-800'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-500/20 to-rose-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-md">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Dukungan Saweria / Tip
              </h2>
              <p className="text-xs text-amber-300 font-medium">
                Dukung {creatorName} secara langsung
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

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <PartyPopper className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Terima Kasih Banyak! 🎉
            </h3>
            <p className="text-xs text-gray-300">
              Dukungan dan pesanmu telah ditampilkan di Live Chat stream!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            
            {/* Amount Presets */}
            <div className="space-y-1.5">
              <label className="font-bold text-white block">Pilih Nominal Tip (IDR):</label>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_AMOUNTS.map((amt) => {
                  const isSelected = !customAmount && selectedAmount === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`py-2 rounded-xl font-bold border transition-all text-xs ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white border-transparent shadow-lg scale-105'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      Rp {amt.toLocaleString('id-ID')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="space-y-1">
              <label className="text-[11px] text-gray-400">Atau Nominal Kustom (Rp):</label>
              <input
                type="number"
                placeholder="Contoh: 150000"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1"
              />
            </div>

            {/* Donor Name */}
            <div className="space-y-1">
              <label className="font-bold text-white">Nama Pengirim</label>
              <input
                type="text"
                placeholder="Nama atau Nickname Anda"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1"
              />
            </div>

            {/* Message */}
            <div className="space-y-1">
              <label className="font-bold text-white">Pesan Semangat untuk Kreator</label>
              <textarea
                rows={2}
                placeholder="Tulis pesan penyemangat yang akan muncul di live chat..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-extrabold text-white shadow-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Crown className="w-4 h-4" />
              <span>Kirim Dukungan Sekarang</span>
            </button>

          </form>
        )}
      </div>
    </div>
  );
};
