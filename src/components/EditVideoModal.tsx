import React, { useState, useEffect } from 'react';
import { X, Save, Link, Image as ImageIcon } from 'lucide-react';
import { VideoItem, ThemeConfig } from '../types';
import { normalizeVideoUrl } from '../utils/videoHelpers';

interface EditVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (video: VideoItem) => void;
  video: VideoItem | null;
  theme: ThemeConfig;
}

export const EditVideoModal: React.FC<EditVideoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  video,
  theme,
}) => {
  const [rawUrl, setRawUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [category, setCategory] = useState<VideoItem['category']>('Terbaru');
  const [tagsInput, setTagsInput] = useState('');
  const [requireAgeVerification, setRequireAgeVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && video) {
      setRawUrl(video.url);
      setTitle(video.title);
      setDescription(video.description);
      setThumbnail(video.thumbnail);
      setCategory(video.category);
      setTagsInput(video.tags.join(', '));
      setRequireAgeVerification(video.requireAgeVerification || false);
      setError(null);
    }
  }, [isOpen, video]);

  if (!isOpen || !video) return null;

  const normalized = normalizeVideoUrl(rawUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!rawUrl.trim()) {
      setError('Harap masukkan link URL video .mp4 atau link videy.co.');
      return;
    }

    if (!title.trim()) {
      setError('Judul video wajib diisi.');
      return;
    }

    const finalUrl = normalized.url || rawUrl.trim();
    const processedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const updatedVideo: VideoItem = {
      ...video,
      title: title.trim(),
      description: description.trim(),
      url: finalUrl,
      thumbnail: thumbnail.trim(),
      category,
      tags: processedTags,
      requireAgeVerification,
    };

    onSave(updatedVideo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col ${
          theme.glassEffect ? 'bg-neutral-950/90 border-white/15' : 'bg-neutral-900 border-neutral-800'
        }`}
      >
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2.5">
            <div 
              className="p-2 rounded-xl text-white shadow-md"
              style={{ backgroundColor: theme.primaryHex }}
            >
              <Save className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Edit Video
              </h2>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                Perbarui informasi video atau tambahkan perlindungan pop-up 18+.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-bold text-white">Source Video URL *</label>
            <div className="relative">
              <Link className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={rawUrl}
                onChange={(e) => setRawUrl(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-white">Judul Video *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-white">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VideoItem['category'])}
                className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2"
              >
                <option value="Live VOD">Live VOD</option>
                <option value="Highlights">Highlights</option>
                <option value="VIP Clip">VIP Clip</option>
                <option value="Terbaru">Terbaru</option>
                <option value="Semua">Lainnya</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-white">Thumbnail URL (Opsional)</label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-white">Tags (Pisahkan Koma)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-white">Deskripsi Video</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 resize-none"
            />
          </div>

          <div className="flex items-center gap-2 mt-2 pb-2">
            <input
              type="checkbox"
              id="edit-require-age-verification"
              checked={requireAgeVerification}
              onChange={(e) => setRequireAgeVerification(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-black text-rose-500 focus:ring-0"
            />
            <label htmlFor="edit-require-age-verification" className="text-[11px] text-zinc-300">
              Aktifkan Pop-up Verifikasi 18+ khusus untuk video ini
            </label>
          </div>

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
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
              style={{ backgroundColor: theme.primaryHex }}
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
