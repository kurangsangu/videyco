import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  Crown, 
  Flame, 
  Gift, 
  MessageSquare, 
  Radio, 
  Smile, 
  Heart,
  ThumbsUp,
  PartyPopper,
  Users,
  Play,
  Pause,
  UserCheck
} from 'lucide-react';
import { ChatMessage, ThemeConfig } from '../types';

interface LiveChatBoxProps {
  messages: ChatMessage[];
  theme: ThemeConfig;
  streamerName?: string;
  isAutoChatActive?: boolean;
  onToggleAutoChat?: () => void;
  onSendMessage: (text: string) => void;
  onOpenTipModal: () => void;
  isLive: boolean;
}

export const LiveChatBox: React.FC<LiveChatBoxProps> = ({
  messages,
  theme,
  streamerName = 'CozyMiaa',
  isAutoChatActive = true,
  onToggleAutoChat,
  onSendMessage,
  onOpenTipModal,
  isLive,
}) => {
  const [inputText, setInputText] = useState('');
  const [activeEmojis, setActiveEmojis] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const [onlineCount, setOnlineCount] = useState(() => Math.floor(Math.random() * (50000 - 1450 + 1)) + 1450);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll chat to bottom when messages update without scrolling the main window
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  // Dynamic online viewers slight jitter for realistic streaming feel
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => prev + (Math.floor(Math.random() * 7) - 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  // Floating Emoji Reaction burst effect
  const triggerEmojiBurst = (emoji: string) => {
    const id = Date.now() + Math.random();
    const x = Math.floor(Math.random() * 80) + 10;
    setActiveEmojis((prev) => [...prev, { id, emoji, x }]);

    setTimeout(() => {
      setActiveEmojis((prev) => prev.filter((item) => item.id !== id));
    }, 2000);
  };

  return (
    <div 
      id="live-chat-panel"
      className={`relative flex flex-col h-[580px] sm:h-[640px] rounded-2xl border overflow-hidden transition-all duration-300 shadow-2xl ${
        theme.glassEffect ? 'bg-black/70 border-white/10 backdrop-blur-md' : `${theme.bgCard} ${theme.borderColor}`
      }`}
    >
      {/* Floating Emoji Reactions Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
        {activeEmojis.map((item) => (
          <span
            key={item.id}
            className="absolute bottom-20 text-3xl animate-float-up opacity-90 transition-all filter drop-shadow-md"
            style={{ left: `${item.x}%` }}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      {/* Header Room */}
      <div className="px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <div className="relative">
            <MessageSquare className="w-4 h-4" style={{ color: theme.primaryHex }} />
            {isLive && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-100 flex items-center gap-1.5">
              Live Chat
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                LIVE
              </span>
            </h3>
            <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
              <Users className="w-2.5 h-2.5 text-emerald-400" />
              <span className="text-zinc-200 font-semibold">{onlineCount.toLocaleString('id-ID')}</span> menonton
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto chat status toggle button */}
          {onToggleAutoChat && (
            <button
              onClick={onToggleAutoChat}
              title={isAutoChatActive ? 'Jeda Komentar Otomatis' : 'Aktifkan Komentar Otomatis'}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                isAutoChatActive 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30' 
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'
              }`}
            >
              {isAutoChatActive ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
              <span className="hidden sm:inline">{isAutoChatActive ? 'Auto: ON' : 'Auto: OFF'}</span>
            </button>
          )}

          {/* Tip trigger button */}
          <button
            id="chat-send-tip-btn"
            onClick={onOpenTipModal}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all shadow-sm active:scale-95"
          >
            <Gift className="w-3 h-3 text-amber-400 animate-bounce" />
            <span>Saweria</span>
          </button>
        </div>
      </div>

      {/* Ratio Proportion Subheader Badge */}
      <div className="px-3 py-1 bg-black/40 border-b border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
        <span className="flex items-center gap-1">
          <UserCheck className="w-3 h-3 text-sky-400" />
          Komunitas: <strong className="text-sky-300">90% Laki-laki</strong> &bull; <strong className="text-pink-300">10% Wanita</strong>
        </span>
        <span className="text-[9px] text-zinc-500 font-mono">
          {messages.length} komentar dimuat
        </span>
      </div>

      {/* Chat Messages Feed */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 p-3 overflow-y-auto space-y-2.5 font-sans text-xs scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
      >
        {/* Welcome Stream Banner */}
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-zinc-300 text-center">
          <p className="font-semibold text-zinc-200">✨ Ruang Obrolan Live {streamerName}</p>
          <p className="text-zinc-400 text-[10px] mt-0.5">Komentar otomatis real-time aktif dengan profil & foto asli.</p>
        </div>

        {messages.map((msg, index) => {
          // Dynamic colored usernames
          const userColors = ['text-sky-400', 'text-amber-400', 'text-emerald-400', 'text-purple-400', 'text-orange-400', 'text-teal-400'];
          const userColor = userColors[index % userColors.length];
          const isFemale = msg.badge === '🌸 Sis' || msg.user.includes('Bella') || msg.user.includes('Siska') || msg.user.includes('Putri') || msg.user.includes('Clarissa') || msg.user.includes('Nabila') || msg.user.includes('Maya') || msg.user.includes('Nadia');

          return (
            <div 
              key={msg.id}
              className={`p-2 rounded-xl transition-all flex items-start gap-2.5 ${
                msg.tipAmount
                  ? 'bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 border border-amber-500/40 shadow-md'
                  : msg.isStreamer
                  ? 'bg-purple-900/40 border border-purple-500/40'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] border border-white/5'
              }`}
            >
              {/* Real Avatar Photo */}
              <div className="relative shrink-0 mt-0.5">
                {msg.avatar ? (
                  <img
                    src={msg.avatar}
                    alt={msg.user}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-white/20 shadow-sm"
                    onError={(e) => {
                      // Fallback if image load fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-[11px] text-white border border-white/10 ${
                    msg.isStreamer ? 'bg-rose-600' : isFemale ? 'bg-pink-600' : 'bg-sky-600'
                  }`}>
                    {msg.user.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* VIP / Streamer miniature dot */}
                {msg.isStreamer && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-500 border border-black" />
                )}
                {msg.isVip && !msg.isStreamer && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 border border-black" />
                )}
              </div>

              {/* Message Content Container */}
              <div className="flex-1 min-w-0">
                {/* Donation Tip Highlight Header */}
                {msg.tipAmount && (
                  <div className="flex items-center gap-1.5 text-amber-300 font-extrabold text-[11px] mb-1">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Mendonasikan Rp {msg.tipAmount.toLocaleString('id-ID')} via Saweria! 🎉</span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Badges */}
                    {msg.isStreamer && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-600 text-white uppercase shadow-sm">
                        Kreator
                      </span>
                    )}
                    {msg.isVip && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/30 text-amber-300 border border-amber-400/40">
                        VIP
                      </span>
                    )}
                    {msg.badge && !msg.isStreamer && !msg.isVip && (
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold ${
                        isFemale ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' : 'bg-white/10 text-zinc-300'
                      }`}>
                        {msg.badge}
                      </span>
                    )}

                    <span className={`font-bold truncate text-[11px] sm:text-xs ${
                      msg.isStreamer ? 'text-rose-400' : isFemale ? 'text-pink-400' : userColor
                    }`}>
                      {msg.user}
                    </span>
                  </div>

                  <span className="text-[9px] text-zinc-500 shrink-0 font-mono">
                    {msg.timestamp}
                  </span>
                </div>

                <p className="text-zinc-200 text-[11px] sm:text-xs leading-relaxed break-words font-normal">
                  {msg.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Streaming Statistics HUD Card */}
      <div className="px-3 py-2 bg-gradient-to-br from-orange-600/15 via-purple-600/10 to-transparent border-t border-b border-white/10 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-orange-500" />
            Live Bitrate
          </h4>
          <span className="text-[10px] font-mono text-zinc-300">6000 Kbps &bull; 1080p 60FPS</span>
        </div>
        <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/10">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: '85%',
              backgroundColor: theme.primaryHex,
              boxShadow: `0 0 8px ${theme.primaryHex}`
            }}
          />
        </div>
      </div>

      {/* Quick Reactions Bar */}
      <div className="px-3 py-1.5 bg-white/5 flex items-center justify-between gap-1">
        <span className="text-[10px] text-zinc-400 font-medium hidden sm:inline">Reaksi:</span>
        <div className="flex items-center gap-1.5 justify-around w-full sm:w-auto">
          {['❤️', '🔥', '👏', '🎉', '💯', '✨'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => triggerEmojiBurst(emoji)}
              className="p-1 text-sm hover:scale-125 active:scale-95 transition-transform rounded-lg hover:bg-white/10"
              title={`Kirim ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Input Message Form */}
      <form 
        id="send-chat-form"
        onSubmit={handleSubmit}
        className="p-2.5 sm:p-3 border-t border-white/10 bg-black/50 flex items-center gap-2"
      >
        <input
          id="chat-message-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ketik komentar Anda..."
          maxLength={200}
          className="flex-1 bg-white/5 border border-white/10 rounded-full px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 transition-all"
          style={{
            '--tw-ring-color': theme.primaryHex,
          } as React.CSSProperties}
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          id="chat-submit-btn"
          className="p-2 rounded-full text-white shadow-md transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ 
            backgroundColor: theme.primaryHex,
            boxShadow: `0 0 12px ${theme.primaryHex}66`
          }}
          title="Kirim Pesan"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
