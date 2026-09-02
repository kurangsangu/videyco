import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume1,
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  RotateCw, 
  Settings as SettingsIcon, 
  PictureInPicture, 
  Sparkles, 
  Heart, 
  Share2, 
  Download, 
  Bookmark, 
  Check, 
  Radio, 
  Layers, 
  AlertCircle,
  Clock,
  Eye,
  SkipForward,
  Keyboard
} from 'lucide-react';
import { VideoItem, PlayerSettings, ThemeConfig } from '../types';
import { formatDuration, formatViews } from '../utils/videoHelpers';

interface VideoPlayerProps {
  currentVideo: VideoItem;
  nextVideo?: VideoItem;
  settings: PlayerSettings;
  theme: ThemeConfig;
  onVideoEnd?: () => void;
  onSelectNextVideo?: () => void;
  onUpdateSettings?: (newSettings: Partial<PlayerSettings>) => void;
  onVideoPlay?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onDownloadAction?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  currentVideo,
  nextVideo,
  settings,
  theme,
  onVideoEnd,
  onSelectNextVideo,
  onUpdateSettings,
  onVideoPlay,
  onTimeUpdate,
  onDownloadAction,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [buffered, setBuffered] = useState<number>(0);
  const [volume, setVolume] = useState<number>(settings.volume);
  const [isMuted, setIsMuted] = useState<boolean>(settings.autoplayMuted || settings.isMuted);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPipActive, setIsPipActive] = useState<boolean>(false);
  const [isPipSupported, setIsPipSupported] = useState<boolean>(true);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(settings.playbackSpeed || 1);
  const [hasAutoplayBlockedSound, setHasAutoplayBlockedSound] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showNextCountdown, setShowNextCountdown] = useState<boolean>(false);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(5);

  // Shortcut HUD visual feedback
  const [shortcutFeedback, setShortcutFeedback] = useState<{ text: string; icon?: React.ReactNode; subtext?: string } | null>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);

  // Social actions state
  const [likes, setLikes] = useState<number>(() => Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Sync likes and reset errors when currentVideo changes
  useEffect(() => {
    setLikes(Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000);
    setHasLiked(false);
    setVideoError(null);
    setIsLoading(true);
    setShowNextCountdown(false);
  }, [currentVideo.id]);

  // Handle Autoplay & video source changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset error & loading state
    setVideoError(null);
    setIsLoading(true);

    // Prepare video source
    video.src = currentVideo.url;
    video.load();

    const attemptPlay = async () => {
      if (settings.autoplay) {
        // Enforce muted if autoplayMuted is true or by default to pass browser policy
        if (settings.autoplayMuted || isMuted) {
          video.muted = true;
          setIsMuted(true);
        }
        
        try {
          await video.play();
          setIsPlaying(true);
          setIsLoading(false);
          setHasAutoplayBlockedSound(false);
        } catch (err: unknown) {
          // If unmuted playback was blocked by browser policy, fallback to muted autoplay
          video.muted = true;
          setIsMuted(true);
          try {
            await video.play();
            setIsPlaying(true);
            setIsLoading(false);
            setHasAutoplayBlockedSound(true);
          } catch (err2) {
            console.warn('Autoplay waiting for user gesture or buffer:', err2);
            setIsPlaying(false);
          }
        }
      } else {
        setIsPlaying(false);
      }
    };

    attemptPlay();
  }, [currentVideo.url, currentVideo.id, settings.autoplay, settings.autoplayMuted]);

  // Video event handlers
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    if (onTimeUpdate) {
      onTimeUpdate(videoRef.current.currentTime);
    }
    
    // Calculate buffered progress
    if (videoRef.current.buffered.length > 0) {
      const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      const dur = videoRef.current.duration || 1;
      setBuffered((bufferedEnd / dur) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setIsLoading(false);
    videoRef.current.playbackRate = speed;
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (settings.loop) {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    if (settings.autoNext && nextVideo) {
      setShowNextCountdown(true);
      setCountdownSeconds(5);
    } else if (onVideoEnd) {
      onVideoEnd();
    }
  };

  // Next video countdown timer
  useEffect(() => {
    if (!showNextCountdown) return;
    if (countdownSeconds <= 0) {
      setShowNextCountdown(false);
      if (onSelectNextVideo) {
        onSelectNextVideo();
      }
      return;
    }
    const timer = setTimeout(() => {
      setCountdownSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [showNextCountdown, countdownSeconds, onSelectNextVideo]);

  // Show HUD toast notification when shortcut or action is triggered
  const showShortcutHUD = useCallback((text: string, icon?: React.ReactNode, subtext?: string) => {
    setShortcutFeedback({ text, icon, subtext });
    if (feedbackTimeoutRef.current) {
      window.clearTimeout(feedbackTimeoutRef.current);
    }
    feedbackTimeoutRef.current = window.setTimeout(() => {
      setShortcutFeedback(null);
    }, 1000);
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => {
        setIsPlaying(true);
        showShortcutHUD('Diputar', <Play className="w-8 h-8 fill-white" />);
      }).catch((e) => console.error(e));
    } else {
      video.pause();
      setIsPlaying(false);
      showShortcutHUD('Dijeda', <Pause className="w-8 h-8 fill-white" />);
    }
  }, [showShortcutHUD]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
      setIsMuted(newVol === 0);
    }
    if (onUpdateSettings) {
      onUpdateSettings({ volume: newVol, isMuted: newVol === 0 });
    }
  };

  const adjustVolume = useCallback((delta: number) => {
    if (!videoRef.current) return;
    const currentVol = isMuted ? 0 : volume;
    const nextVol = Math.max(0, Math.min(1, Math.round((currentVol + delta) * 100) / 100));
    setVolume(nextVol);
    videoRef.current.volume = nextVol;
    const nextMuted = nextVol === 0;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    setHasAutoplayBlockedSound(false);
    
    const percent = Math.round(nextVol * 100);
    const icon = nextMuted 
      ? <VolumeX className="w-8 h-8" /> 
      : nextVol > 0.5 
      ? <Volume2 className="w-8 h-8" /> 
      : <Volume1 className="w-8 h-8" />;
    
    showShortcutHUD(nextMuted ? 'Senyap (0%)' : `Volume: ${percent}%`, icon);

    if (onUpdateSettings) {
      onUpdateSettings({ volume: nextVol, isMuted: nextMuted });
    }
  }, [volume, isMuted, onUpdateSettings, showShortcutHUD]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    const targetMuted = !isMuted;
    videoRef.current.muted = targetMuted;
    setIsMuted(targetMuted);
    setHasAutoplayBlockedSound(false);
    
    if (targetMuted) {
      showShortcutHUD('Senyap (Muted)', <VolumeX className="w-8 h-8" />);
    } else {
      const volPercent = Math.round((videoRef.current.volume || 0.8) * 100);
      showShortcutHUD(`Suara Aktif (${volPercent}%)`, <Volume2 className="w-8 h-8" />);
    }

    if (onUpdateSettings) {
      onUpdateSettings({ isMuted: targetMuted });
    }
  }, [isMuted, showShortcutHUD, onUpdateSettings]);

  const handleUnmuteSound = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = false;
    setIsMuted(false);
    setHasAutoplayBlockedSound(false);
    if (volume === 0) {
      setVolume(0.8);
      videoRef.current.volume = 0.8;
    }
    showShortcutHUD('Suara Aktif (80%)', <Volume2 className="w-8 h-8" />);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
    }
  };

  const skipSeconds = useCallback((seconds: number) => {
    if (!videoRef.current) return;
    const newTime = Math.max(0, Math.min(duration || 999999, videoRef.current.currentTime + seconds));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    if (seconds > 0) {
      showShortcutHUD(`+${seconds} Detik`, <RotateCw className="w-8 h-8" />);
    } else {
      showShortcutHUD(`${seconds} Detik`, <RotateCcw className="w-8 h-8" />);
    }
  }, [duration, showShortcutHUD]);

  const changePlaybackSpeed = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
    setShowSpeedMenu(false);
    showShortcutHUD(`Kecepatan: ${newSpeed}x`);
    if (onUpdateSettings) {
      onUpdateSettings({ playbackSpeed: newSpeed });
    }
  };

  // Check Picture-in-Picture support and bind video PiP event listeners
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const supported = 'pictureInPictureEnabled' in document && (document as any).pictureInPictureEnabled !== false;
      setIsPipSupported(supported);
    }

    const video = videoRef.current;
    if (!video) return;

    const handleEnterPiP = () => {
      setIsPipActive(true);
      showShortcutHUD('Mode PiP Aktif', <PictureInPicture className="w-8 h-8" />);
    };

    const handleLeavePiP = () => {
      setIsPipActive(false);
      showShortcutHUD('Keluar Mode PiP', <PictureInPicture className="w-8 h-8" />);
    };

    video.addEventListener('enterpictureinpicture', handleEnterPiP);
    video.addEventListener('leavepictureinpicture', handleLeavePiP);

    return () => {
      video.removeEventListener('enterpictureinpicture', handleEnterPiP);
      video.removeEventListener('leavepictureinpicture', handleLeavePiP);
    };
  }, [showShortcutHUD]);

  const togglePiP = async () => {
    try {
      if (!isPipSupported) {
        showShortcutHUD('PiP Tidak Didukung', <PictureInPicture className="w-8 h-8 text-rose-400" />);
        return;
      }

      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (videoRef.current) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.warn('Picture in Picture failed:', err);
      showShortcutHUD('Gagal Mengaktifkan PiP');
    }
  };

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
        showShortcutHUD('Layar Penuh', <Maximize className="w-8 h-8" />);
      }).catch((e) => console.error(e));
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        showShortcutHUD('Layar Normal', <Minimize className="w-8 h-8" />);
      }).catch((e) => console.error(e));
    }
  }, [showShortcutHUD]);

  // Sync fullscreen state if user exits via browser Esc button
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Global keyboard shortcuts listener ('Space', 'f', 'm', ArrowLeft, ArrowRight, ArrowUp, ArrowDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing inside an input, textarea, select or contentEditable element
      const target = e.target as HTMLElement | null;
      if (
        target && (
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
          target.isContentEditable
        )
      ) {
        return;
      }

      // Space: play/pause
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        togglePlay();
      } 
      // 'f' / 'F': toggle fullscreen
      else if (e.code === 'KeyF' || e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } 
      // 'm' / 'M': toggle mute
      else if (e.code === 'KeyM' || e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      } 
      // 'p' / 'P': toggle Picture-in-Picture
      else if (e.code === 'KeyP' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        togglePiP();
      } 
      // ArrowLeft: seek backward 5 seconds
      else if (e.code === 'ArrowLeft' || e.key === 'ArrowLeft') {
        e.preventDefault();
        skipSeconds(-5);
      } 
      // ArrowRight: seek forward 5 seconds
      else if (e.code === 'ArrowRight' || e.key === 'ArrowRight') {
        e.preventDefault();
        skipSeconds(5);
      }
      // ArrowUp: volume up +5%
      else if (e.code === 'ArrowUp' || e.key === 'ArrowUp') {
        e.preventDefault();
        adjustVolume(0.05);
      }
      // ArrowDown: volume down -5%
      else if (e.code === 'ArrowDown' || e.key === 'ArrowDown') {
        e.preventDefault();
        adjustVolume(-0.05);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleMute, toggleFullscreen, skipSeconds, adjustVolume]);

  // Handle user activity to show/hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="w-full space-y-4">
      {/* Main Video Screen Container with Ambient Glow */}
      <div className="relative group">
        
        {/* Dynamic Theme Ambient Glow Background */}
        {settings.ambientGlow && (
          <div 
            className="absolute -inset-1.5 rounded-3xl opacity-60 blur-2xl pointer-events-none transition-all duration-700 -z-10"
            style={{
              backgroundColor: theme.primaryHex,
            }}
          />
        )}

        <div
          ref={containerRef}
          id="videy-player-stage"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
          className={`relative w-full aspect-[9/16] sm:aspect-[4/5] md:aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 select-none ${
            isFullscreen ? 'rounded-none border-none' : ''
          }`}
        >
          {/* HTML5 Video Element */}
          <video
            ref={videoRef}
            id="main-html5-video"
            poster={currentVideo.thumbnail}
            playsInline
            referrerPolicy="no-referrer"
            autoPlay={settings.autoplay}
            muted={isMuted}
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onCanPlay={() => {
              setIsLoading(false);
              if (settings.autoplay && videoRef.current && videoRef.current.paused) {
                videoRef.current.play().catch(() => {});
              }
            }}
            onWaiting={() => setIsLoading(true)}
            onPlay={() => {
              if (onVideoPlay) onVideoPlay();
            }}
            onPlaying={() => {
              setIsLoading(false);
              setIsPlaying(true);
              if (onVideoPlay) onVideoPlay();
            }}
            onError={(e) => {
              console.error('Video error:', e);
              setIsLoading(false);
              setVideoError('Gagal memuat format video .mp4. Pastikan tautan langsung aktif dan dapat diakses.');
            }}
            onEnded={handleEnded}
            onClick={togglePlay}
            className="w-full h-full object-cover cursor-pointer"
          />

          {/* Autoplay Sound Muted Notification Banner (Smart Browser Policy Helper) */}
          {hasAutoplayBlockedSound && (
            <div className="absolute top-4 left-4 z-30 animate-bounce">
              <button
                id="unmute-sound-banner-btn"
                onClick={handleUnmuteSound}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600/95 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold shadow-2xl backdrop-blur-md border border-white/20 transition-transform active:scale-95"
              >
                <VolumeX className="w-4 h-4 animate-pulse" />
                <span>Video Mulai Senyap (Autoplay) • Klik untuk Bunyikan Suara 🔊</span>
              </button>
            </div>
          )}

          {/* Loading / Connecting HUD State */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none z-20">
              <div 
                className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin mb-4 shadow-2xl"
                style={{ 
                  borderColor: `${theme.primaryHex} transparent transparent transparent`,
                  filter: `drop-shadow(0 0 12px ${theme.primaryHex})`
                }}
              />
              <p className="text-zinc-300 font-mono text-xs sm:text-sm tracking-widest font-bold">
                MENGHUBUNGKAN KE VIDEYCO...
              </p>
              <p className="text-[10px] text-zinc-500 mt-1.5 font-mono italic">
                source: {currentVideo.url.length > 45 ? `${currentVideo.url.substring(0, 42)}...` : currentVideo.url}
              </p>
            </div>
          )}

          {/* Error Message Overlay */}
          {videoError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/85 backdrop-blur-md z-30">
              <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">Terjadi Kendala Pemutaran</h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-md mb-4">{videoError}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.load();
                      videoRef.current.play();
                    }
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-white/20 hover:bg-white/30 text-white"
                >
                  Coba Muat Ulang
                </button>
                <a
                  href={currentVideo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white"
                  style={{ backgroundColor: theme.primaryHex }}
                >
                  Buka Link Langsung .MP4
                </a>
              </div>
            </div>
          )}

          {/* Big Center Play/Pause Button on Hover / Click */}
          {!isPlaying && !isLoading && !videoError && (
            <div 
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer transition-opacity z-10"
            >
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-md border border-white/20 transform transition-transform hover:scale-110 active:scale-95"
                style={{ backgroundColor: `${theme.primaryHex}dd` }}
              >
                <Play className="w-9 h-9 text-white fill-white ml-1" />
              </div>
            </div>
          )}

          {/* Global Keyboard Shortcut HUD Toast Notification Overlay */}
          {shortcutFeedback && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-fade-in">
              <div 
                className="px-6 py-4 rounded-2xl bg-black/85 backdrop-blur-md border border-white/20 text-white shadow-2xl flex flex-col items-center gap-2 transform transition-transform scale-105"
                style={{
                  boxShadow: `0 0 35px ${theme.primaryHex}66`
                }}
              >
                {shortcutFeedback.icon && (
                  <div className="text-white" style={{ color: theme.primaryHex }}>
                    {shortcutFeedback.icon}
                  </div>
                )}
                <span className="text-sm sm:text-base font-black tracking-wide">
                  {shortcutFeedback.text}
                </span>
                {shortcutFeedback.subtext && (
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {shortcutFeedback.subtext}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Auto Next Countdown Overlay */}
          {showNextCountdown && nextVideo && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Video Berikutnya Akan Diputar Dalam
              </span>
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white shadow-xl mb-4 border-2"
                style={{ borderColor: theme.primaryHex }}
              >
                {countdownSeconds}
              </div>
              <h4 className="text-base font-bold text-white max-w-md truncate mb-4">
                {nextVideo.title}
              </h4>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNextCountdown(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-gray-200"
                >
                  Batal Putar
                </button>
                <button
                  onClick={() => {
                    setShowNextCountdown(false);
                    if (onSelectNextVideo) onSelectNextVideo();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg"
                  style={{ backgroundColor: theme.primaryHex }}
                >
                  <SkipForward className="w-4 h-4" />
                  <span>Putar Sekarang</span>
                </button>
              </div>
            </div>
          )}

          {/* Player Controls Overlay */}
          <div
            className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 sm:p-4 pt-12 transition-opacity duration-300 z-20 ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            
            {/* Scrubber / Progress Bar */}
            <div className="relative group/scrub mb-3 flex items-center">
              {/* Buffer Bar */}
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-white/20 pointer-events-none"
                style={{ width: `${buffered}%` }}
              />
              {/* Progress Played Bar */}
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full pointer-events-none transition-all"
                style={{
                  width: `${(currentTime / (duration || 1)) * 100}%`,
                  backgroundColor: theme.primaryHex,
                }}
              />
              {/* Native Range Input with transparent thumb */}
              <input
                id="video-scrubber-slider"
                type="range"
                min="0"
                max={duration || 100}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 appearance-none bg-transparent cursor-pointer relative z-10 opacity-0 group-hover/scrub:opacity-100 transition-opacity"
              />
            </div>

            {/* Bottom Controls Row */}
            <div className="flex items-center justify-between gap-2 flex-wrap text-white">
              
              {/* Left Controls: Play, Skips, Volume, Time */}
              <div className="flex items-center gap-2 sm:gap-3">
                
                {/* Play / Pause */}
                <button
                  id="player-play-pause-btn"
                  onClick={togglePlay}
                  className="p-2 rounded-lg hover:bg-white/20 text-white transition-all active:scale-95"
                  title={isPlaying ? 'Jeda (Space)' : 'Putar (Space)'}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                </button>

                {/* Rewind 10s */}
                <button
                  id="player-rewind-btn"
                  onClick={() => skipSeconds(-10)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-all hidden sm:block"
                  title="Mundur 10 Detik"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Forward 10s */}
                <button
                  id="player-forward-btn"
                  onClick={() => skipSeconds(10)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-all hidden sm:block"
                  title="Maju 10 Detik"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                {/* Volume & Mute */}
                <div className="flex items-center gap-1.5 group/vol">
                  <button
                    id="player-mute-toggle-btn"
                    onClick={toggleMute}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white"
                    title={isMuted ? 'Nyalakan Suara (M)' : 'Bisukan Suara (M)'}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-5 h-5 text-rose-400" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  <input
                    id="player-volume-slider"
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-14 sm:w-20 h-1.5 accent-purple-500 cursor-pointer bg-white/30 rounded-lg"
                    style={{ accentColor: theme.primaryHex }}
                  />
                </div>

                {/* Time Display */}
                <span className="text-xs font-mono text-gray-300 ml-1">
                  {formatDuration(currentTime)} / {formatDuration(duration)}
                </span>
              </div>

              {/* Right Controls: Autoplay Badge, Speed, PiP, Fullscreen */}
              <div className="flex items-center gap-1 sm:gap-2 relative">
                
                {/* Autoplay Active Indicator */}
                <span 
                  className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md border hidden md:inline-flex items-center gap-1 ${
                    settings.autoplay 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                      : 'bg-gray-800 text-gray-400 border-gray-700'
                  }`}
                >
                  Autoplay {settings.autoplay ? 'ON' : 'OFF'}
                </span>

                {/* Speed Dropdown Trigger */}
                <div className="relative">
                  <button
                    id="player-speed-btn"
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-gray-200"
                    title="Kecepatan Pemutaran"
                  >
                    {speed}x
                  </button>
                  {showSpeedMenu && (
                    <div className="absolute bottom-full right-0 mb-2 bg-neutral-900/95 border border-white/15 rounded-xl p-1.5 shadow-2xl backdrop-blur-lg flex flex-col gap-1 min-w-[70px] z-50">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                        <button
                          key={s}
                          onClick={() => changePlaybackSpeed(s)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold text-left transition-colors ${
                            speed === s ? 'bg-white/20 text-white font-bold' : 'text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          {s}x {s === 1 && '(Normal)'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Picture in Picture (PiP) Toggle */}
                {isPipSupported && (
                  <button
                    id="player-pip-btn"
                    onClick={togglePiP}
                    className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs font-semibold ${
                      isPipActive
                        ? 'bg-purple-500/30 text-purple-200 ring-1 ring-purple-400 shadow-md shadow-purple-900/50'
                        : 'hover:bg-white/15 text-gray-300 hover:text-white'
                    }`}
                    title={isPipActive ? 'Keluar Picture-in-Picture (P)' : 'Picture-in-Picture / Nonton Sambil Navigasi Halaman (P)'}
                    aria-label={isPipActive ? 'Keluar Picture-in-Picture' : 'Picture-in-Picture'}
                  >
                    <PictureInPicture className={`w-4 h-4 ${isPipActive ? 'text-purple-300 fill-purple-400/20' : ''}`} />
                    {isPipActive && (
                      <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider text-purple-300">
                        PiP
                      </span>
                    )}
                  </button>
                )}

                {/* Fullscreen Button */}
                <button
                  id="player-fullscreen-btn"
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-all"
                  title={isFullscreen ? 'Keluar Fullscreen (F)' : 'Layar Penuh (F)'}
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>

              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Video Details & Interaction Bar */}
      <div 
        className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
          theme.glassEffect ? 'bg-black/60 border-white/10 backdrop-blur-md' : `${theme.bgCard} ${theme.borderColor}`
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          
          {/* Title & Metadata */}
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span 
                className="text-xs font-bold px-2.5 py-0.5 rounded-full border shadow-sm"
                style={{
                  backgroundColor: `${theme.primaryHex}20`,
                  borderColor: `${theme.primaryHex}50`,
                  color: theme.primaryHex,
                }}
              >
                {currentVideo.category}
              </span>
              {currentVideo.isFeatured && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  ★ Pilihan Utama
                </span>
              )}
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {currentVideo.addedAt}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {formatViews(currentVideo.views)} Ditonton
              </span>
            </div>

            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
              {currentVideo.title}
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {currentVideo.description}
            </p>

            {/* Tags */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {currentVideo.tags.map((tag, idx) => (
                <span key={idx} className="text-[11px] font-medium text-gray-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTAs: Like, Favorite, Share, Download Direct MP4 */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-start">
            
            {/* Like */}
            <button
              id="player-like-btn"
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 border ${
                hasLiked 
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400' 
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-300'}`} />
              <span>{formatViews(likes)}</span>
            </button>

            {/* Bookmark */}
            <button
              id="player-bookmark-btn"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95 border ${
                isBookmarked 
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-200'
              }`}
              title="Simpan ke Favorit"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
              <span>{isBookmarked ? 'Tersimpan' : 'Simpan'}</span>
            </button>

            {/* Share */}
            <button
              id="player-share-btn"
              onClick={handleCopyShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 transition-all active:scale-95"
              title="Salin Tautan Video"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-gray-300" />}
              <span>{copiedLink ? 'Tersalin' : 'Bagikan'}</span>
            </button>

            {/* Direct MP4 Download / View Link */}
            <a
              id="player-download-mp4-btn"
              href={currentVideo.url}
              onClick={(e) => {
                if (onDownloadAction) {
                  e.preventDefault();
                  onDownloadAction();
                }
              }}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 transition-all active:scale-95"
              title="Unduh / Buka Sumber File .MP4"
            >
              <Download className="w-4 h-4 text-gray-300" />
              <span>Sumber .MP4</span>
            </a>

          </div>

        </div>

        {/* Global Keyboard Shortcuts Legend Bar */}
        <div 
          id="player-keyboard-shortcuts-bar"
          className="flex items-center gap-2 sm:gap-3 flex-wrap text-[11px] text-zinc-400 pt-1 px-1"
        >
          <span className="flex items-center gap-1.5 font-bold text-zinc-300 text-xs">
            <Keyboard className="w-3.5 h-3.5" style={{ color: theme.primaryHex }} />
            Pintasan Keyboard:
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
            <kbd className="font-mono text-[10px] font-bold bg-white/10 px-1.5 py-0.2 rounded text-white shadow-sm">Space</kbd> Putar/Jeda
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
            <kbd className="font-mono text-[10px] font-bold bg-white/10 px-1.5 py-0.2 rounded text-white shadow-sm">F</kbd> Layar Penuh
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
            <kbd className="font-mono text-[10px] font-bold bg-white/10 px-1.5 py-0.2 rounded text-white shadow-sm">P</kbd> PiP
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
            <kbd className="font-mono text-[10px] font-bold bg-white/10 px-1.5 py-0.2 rounded text-white shadow-sm">M</kbd> Senyap / Unmute
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
            <kbd className="font-mono text-[10px] font-bold bg-white/10 px-1.5 py-0.2 rounded text-white shadow-sm">←</kbd>
            <kbd className="font-mono text-[10px] font-bold bg-white/10 px-1.5 py-0.2 rounded text-white shadow-sm">→</kbd> Mundur/Maju 5s
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
            <kbd className="font-mono text-[10px] font-bold bg-white/10 px-1.5 py-0.2 rounded text-white shadow-sm">↑</kbd>
            <kbd className="font-mono text-[10px] font-bold bg-white/10 px-1.5 py-0.2 rounded text-white shadow-sm">↓</kbd> Volume ±5%
          </span>
        </div>
      </div>
    </div>
  );
};
