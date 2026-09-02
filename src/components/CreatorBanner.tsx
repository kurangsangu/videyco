import React, { useState } from 'react';
import { 
  Heart, 
  Share2, 
  Check, 
  Gift, 
  Radio, 
  Eye, 
  ExternalLink,
  Flame,
  Volume2
} from 'lucide-react';
import { CreatorProfile, ThemeConfig } from '../types';
import { formatViews } from '../utils/videoHelpers';

interface CreatorBannerProps {
  creator: CreatorProfile;
  currentTheme: ThemeConfig;
  onOpenTipModal: () => void;
  onFollowToggle?: () => void;
  onRandomizeStreamer?: () => void;
}

export const CreatorBanner: React.FC<CreatorBannerProps> = ({
  creator,
  currentTheme,
  onOpenTipModal,
  onRandomizeStreamer,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [followerCount, setFollowerCount] = useState(creator.followers);

  const handleFollow = () => {
    if (!isFollowing) {
      setFollowerCount((prev) => prev + 1);
      setIsFollowing(true);
    } else {
      setFollowerCount((prev) => prev - 1);
      setIsFollowing(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${creator.name} - VideyPlayer Streaming`,
          text: `Tonton video dan live streaming eksklusif ${creator.name}!`,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const progressPercent = Math.min(
    100,
    Math.round((creator.vipGoal.current / creator.vipGoal.target) * 100)
  );

  return (
    <div 
      id="creator-profile-banner"
      className="relative w-full rounded-2xl overflow-hidden mb-6 border transition-all duration-300 shadow-xl"
      style={{
        borderColor: currentTheme.glassEffect ? 'rgba(255, 255, 255, 0.1)' : undefined,
      }}
    >
      {/* Banner Background Image with Gradient Overlay */}
      <div className="relative h-44 sm:h-56 md:h-64 w-full bg-neutral-900 overflow-hidden">
        <img
          src={creator.banner}
          alt={`${creator.name} Banner`}
          className="w-full h-full object-cover object-center opacity-70 filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        {/* Live Indicator on Top Right */}
        {creator.isLive && (
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-rose-500/50 shadow-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <span className="text-xs font-black text-rose-400 uppercase tracking-wider">
              SEDANG SIARAN
            </span>
            <span className="text-xs text-gray-300 flex items-center gap-1 border-l border-white/20 pl-2">
              <Eye className="w-3.5 h-3.5 text-rose-400" />
              1.4K Nonton
            </span>
          </div>
        )}
      </div>

      {/* Creator Info & Action Bar */}
      <div 
        className={`px-4 sm:px-6 pb-6 pt-0 relative backdrop-blur-md transition-colors ${
          currentTheme.glassEffect ? 'bg-black/75' : currentTheme.bgCard
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-16 sm:-mt-20">
          
          {/* Avatar & Names */}
          <div className="flex items-end gap-4">
            <div className="relative group">
              <div 
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden p-1 shadow-2xl transition-transform transform group-hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.primaryHex}, #ec4899)`,
                }}
              >
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-full h-full object-cover rounded-xl bg-neutral-800"
                />
              </div>
              {creator.isLive && (
                <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-600 text-white shadow-md uppercase tracking-wider">
                    LIVE
                  </span>
                </div>
              )}
            </div>

            <div className="mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {creator.name}
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/15">
                  Verified Creator ✓
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 font-medium">
                {creator.handle} • <span className="text-gray-300">{creator.tagline}</span>
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            
            {/* Follow / Subscribe Button */}
            <button
              id="creator-follow-btn"
              onClick={handleFollow}
              className={`flex items-center gap-1.5 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all active:scale-95 ${
                isFollowing
                  ? 'bg-white/15 text-white border border-white/20 hover:bg-white/20'
                  : 'text-white hover:brightness-110 shadow-lg'
              }`}
              style={{
                backgroundColor: !isFollowing ? currentTheme.primaryHex : undefined,
                boxShadow: !isFollowing ? `0 0 20px ${currentTheme.primaryHex}66` : undefined,
              }}
            >
              <Heart className={`w-4 h-4 ${isFollowing ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
              <span>{isFollowing ? 'Berlangganan ✓' : 'Berlangganan'}</span>
            </button>

            {/* Tip / Saweria Button */}
            <button
              id="creator-tip-btn"
              onClick={onOpenTipModal}
              className="flex items-center gap-1.5 px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              <Gift className="w-4 h-4" />
              <span>Saweria / Tip</span>
            </button>

            {/* Randomize Female Streamer Button */}
            {onRandomizeStreamer && (
              <button
                id="creator-randomize-btn"
                onClick={onRandomizeStreamer}
                className="flex items-center gap-1.5 px-3.5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-200 transition-all backdrop-blur-md"
                title="Ganti Profil Streamer Wanita Acak"
              >
                <span>🔀</span>
                <span>Acak Streamer Wanita</span>
              </button>
            )}

            {/* Share Button */}
            <button
              id="creator-share-btn"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 border border-white/10 text-zinc-200 transition-all backdrop-blur-md"
              title="Bagikan Profil & Player"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Tersalin!' : 'Bagikan'}</span>
            </button>

          </div>

        </div>

        {/* Bio & Stream Goal section */}
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Bio text */}
          <div className="lg:col-span-7 space-y-2">
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {creator.bio}
            </p>
            
            {/* Social link tags */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-xs text-gray-400 font-medium">Link Komunitas:</span>
              {creator.socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/15 text-gray-200 border border-white/10 transition-colors"
                >
                  <span>{link.label}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-gray-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Target Saweria / VIP Goal Progress Bar */}
          <div className="lg:col-span-5 bg-white/5 rounded-xl p-3 border border-white/10 flex flex-col justify-center">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                {creator.vipGoal.title}
              </span>
              <span className="font-extrabold text-amber-400">{progressPercent}%</span>
            </div>
            
            {/* Progress Track */}
            <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1.5">
              <span>Terkumpul: Rp {creator.vipGoal.current.toLocaleString('id-ID')}</span>
              <span>Target: Rp {creator.vipGoal.target.toLocaleString('id-ID')}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
