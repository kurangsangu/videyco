import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Link, 
  Film, 
  Image as ImageIcon, 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { VideoItem, ThemeConfig } from '../types';
import { normalizeVideoUrl } from '../utils/videoHelpers';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVideo: (video: VideoItem | VideoItem[]) => void;
  theme: ThemeConfig;
}

const SAMPLE_VIDEOS = [
  {
    name: 'Sample Videy CDN2 (nuPVH2td1.mp4)',
    url: 'https://cdn2.videy.co/nuPVH2td1.mp4',
    title: 'Live VOD Streaming Spesial Malam (VideyCo HD)',
    category: 'VIP Clip' as const,
    thumb: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Sample MP4 VideyCo #1 (Big Buck Bunny Clip)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    title: 'Streaming HD Mabar: Gameplay Seru Bersama Penonton',
    category: 'Live VOD' as const,
    thumb: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Sample MP4 VideyCo #2 (For Bigger Blazes)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    title: 'Vlog Eksklusif: Aktivitas & QnA Santai di Studio',
    category: 'VIP Clip' as const,
    thumb: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
  },
];

export const AddVideoModal: React.FC<AddVideoModalProps> = ({
  isOpen,
  onClose,
  onAddVideo,
  theme,
}) => {
  const [rawUrl, setRawUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [category, setCategory] = useState<VideoItem['category']>('Terbaru');
  const [tagsInput, setTagsInput] = useState('VideyCo, MP4, IndoStream');
  const [requireAgeVerification, setRequireAgeVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const normalized = normalizeVideoUrl(rawUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const urls = rawUrl.split('\n').map(u => u.trim()).filter(Boolean);

    if (urls.length === 0) {
      setError('Harap masukkan minimal satu link URL video .mp4 atau link videy.co.');
      return;
    }

    if (urls.length > 30) {
      setError('Maksimal 30 link video dapat ditambahkan sekaligus.');
      return;
    }

    if (!title.trim()) {
      setError('Harap masukkan judul video.');
      return;
    }

    const newVideos: VideoItem[] = [];
    
    for (let i = 0; i < urls.length; i++) {
      const u = urls[i];
      const norm = normalizeVideoUrl(u);
      const finalUrl = norm.url;

      // Check basic mp4 or videy validity
      if (!finalUrl.toLowerCase().endsWith('.mp4') && !finalUrl.includes('videy.co')) {
        setError(`Link tidak valid pada baris ${i + 1}: Pastikan link video berakhiran format .mp4 atau berasal dari link videy.co.`);
        return;
      }

      // Append index if multiple videos
      const videoTitle = urls.length > 1 ? `${title.trim()} Part ${i + 1}` : title.trim();

      newVideos.push({
        id: 'vid-custom-' + Date.now() + '-' + i,
        title: videoTitle,
        description: description.trim() || 'Video ditambahkan dari link MP4 / VideyCo.',
        url: finalUrl,
        thumbnail: thumbnail.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        duration: '03:45',
        views: Math.floor(Math.random() * 5000) + 120,
        likes: Math.floor(Math.random() * 400) + 15,
        category,
        tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
        addedAt: 'Baru saja',
        uploaderName: 'CozyMiaa Official',
        requireAgeVerification,
      });
    }

    onAddVideo(newVideos.length === 1 ? newVideos[0] : newVideos);
    onClose();

    // Reset fields
    setRawUrl('');
    setTitle('');
    setDescription('');
    setThumbnail('');
  };

  const handleUsePreset = (preset: typeof SAMPLE_VIDEOS[0]) => {
    setRawUrl(preset.url);
    setTitle(preset.title);
    setCategory(preset.category);
    setThumbnail(preset.thumb);
    setDescription('Video berkualitas tinggi dengan format streaming langsung .mp4');
    setError(null);
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
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Tambah Video Baru (VIDEYCO / MP4)
              </h2>
              <p className="text-xs text-gray-400">
                Mendukung link langsung <strong className="text-gray-200">.mp4</strong> dan link dari <strong className="text-gray-200">videyco.com</strong>
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Preset Samples */}
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">
              ⚡ Contoh Siap Pakai (Klik untuk Isi Otomatis):
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_VIDEOS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleUsePreset(item)}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white transition-colors text-[11px] text-left"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* URL Input */}
          <div className="space-y-1.5">
            <label className="font-bold text-white flex items-center justify-between">
              <span>Link URL Video (.mp4 / videy.co) *</span>
              <span className="text-[10px] text-purple-400 font-normal">Otomatis Dikonversi ke Direct CDN</span>
            </label>
            <div className="relative">
              <textarea
                id="video-url-input"
                value={rawUrl}
                onChange={(e) => setRawUrl(e.target.value)}
                placeholder="Contoh: https://cdn.videy.co/abcde.mp4&#10;Atau paste hingga 30 link (satu link per baris)"
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 resize-none h-32 font-mono"
                style={{
                  '--tw-ring-color': theme.primaryHex,
                } as React.CSSProperties}
                required
              />
            </div>

            {/* Normalized URL Feedback */}
            {rawUrl && !rawUrl.includes('\n') && (
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-[11px] text-gray-300 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">
                  Target Stream MP4: <strong className="text-white">{normalized.url}</strong>
                </span>
              </div>
            )}
            {rawUrl && rawUrl.includes('\n') && (
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-[11px] text-gray-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">
                  <strong className="text-white">{rawUrl.split('\n').filter(Boolean).length} link terdeteksi</strong> (Maksimal 30)
                </span>
              </div>
            )}
          </div>

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="font-bold text-white">Judul Video *</label>
            <input
              id="video-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Live Stream Spesial CozyMiaa #5"
              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2"
              style={{
                '--tw-ring-color': theme.primaryHex,
              } as React.CSSProperties}
              required
            />
          </div>

          {/* Category & Tags Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-white">Kategori</label>
              <select
                id="video-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as VideoItem['category'])}
                className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2"
              >
                <option value="Live VOD">Live VOD</option>
                <option value="Highlights">Highlights</option>
                <option value="VIP Clip">VIP Clip</option>
                <option value="Terbaru">Terbaru</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-white">Tags (Pisahkan Koma)</label>
              <input
                id="video-tags-input"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Live, MP4, VideyCo"
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2"
              />
            </div>
          </div>

          {/* Thumbnail URL */}
          <div className="space-y-1.5">
            <label className="font-bold text-white flex items-center justify-between">
              <span>Thumbnail Poster URL (Opsional)</span>
              <span className="text-[10px] text-gray-400 font-normal">Biarkan kosong untuk gambar default</span>
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="video-thumbnail-input"
                type="text"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-white/5 border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-bold text-white">Deskripsi Video (Opsional)</label>
            <textarea
              id="video-description-input"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi singkat mengenai video atau siaran..."
              className="w-full bg-white/5 border border-white/15 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 resize-none"
            />
          </div>

          {/* Age Verification */}
          <div className="flex items-center gap-2 mt-2 pb-2">
            <input
              type="checkbox"
              id="require-age-verification"
              checked={requireAgeVerification}
              onChange={(e) => setRequireAgeVerification(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-black text-rose-500 focus:ring-0"
            />
            <label htmlFor="require-age-verification" className="text-[11px] text-zinc-300">
              Aktifkan Pop-up Verifikasi 18+ khusus untuk video ini
            </label>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              id="add-video-submit-btn"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
              style={{ backgroundColor: theme.primaryHex }}
            >
              <Plus className="w-4 h-4" />
              <span>Simpan & Putar Video</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
