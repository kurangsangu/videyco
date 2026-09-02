import React, { useState, useMemo } from 'react';
import { 
  Film, 
  LayoutGrid, 
  List, 
  Plus, 
  Search, 
  SlidersHorizontal,
  Flame,
  Radio,
  Sparkles
} from 'lucide-react';
import { VideoItem, ThemeConfig } from '../types';
import { VideoCard } from './VideoCard';

interface VideoPlaylistProps {
  videos: VideoItem[];
  currentVideo: VideoItem;
  theme: ThemeConfig;
  isAdmin?: boolean;
  onSelectVideo: (video: VideoItem) => void;
  onOpenAddModal: () => void;
  onDeleteVideo?: (id: string) => void;
  onEditVideo?: (video: VideoItem) => void;
  onReorderVideos?: (videos: VideoItem[]) => void;
}

const CATEGORIES = ['Semua', 'Live VOD', 'Highlights', 'VIP Clip', 'Terbaru'] as const;

export const VideoPlaylist: React.FC<VideoPlaylistProps> = ({
  videos,
  currentVideo,
  theme,
  isAdmin = false,
  onSelectVideo,
  onOpenAddModal,
  onDeleteVideo,
  onEditVideo,
  onReorderVideos,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Drag and Drop state
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const isDragEnabled = isAdmin && selectedCategory === 'Semua' && searchQuery.trim() === '' && onReorderVideos;

  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (!isDragEnabled) return;
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    if (!isDragEnabled) return;
    e.preventDefault();
    setDragOverId(id);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    if (!isDragEnabled) return;
    e.preventDefault();
    setDragOverId(null);
    
    if (!draggedId || draggedId === targetId || !onReorderVideos) {
      setDraggedId(null);
      return;
    }
    
    const oldIndex = videos.findIndex(v => v.id === draggedId);
    const newIndex = videos.findIndex(v => v.id === targetId);
    
    if (oldIndex !== -1 && newIndex !== -1) {
      const newVideos = [...videos];
      const [movedItem] = newVideos.splice(oldIndex, 1);
      newVideos.splice(newIndex, 0, movedItem);
      onReorderVideos(newVideos);
    }
    
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      const matchCategory = selectedCategory === 'Semua' || v.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [videos, selectedCategory, searchQuery]);

  return (
    <section id="video-playlist-section" className="space-y-5">
      {/* Section Header & Filters Bar */}
      <div 
        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          theme.glassEffect ? 'bg-black/60 border-white/10 backdrop-blur-md' : `${theme.bgCard} ${theme.borderColor}`
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Title & Count */}
          <div className="flex items-center gap-3">
            <div 
              className="p-2.5 rounded-xl text-white shadow-md"
              style={{ backgroundColor: theme.primaryHex }}
            >
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                Koleksi & Playlist Video
              </h2>
              <p className="text-xs text-gray-400">
                Menampilkan {filteredVideos.length} dari {videos.length} video MP4 & VideyCo
              </p>
            </div>
          </div>

          {/* Quick Actions: Add Video, View Mode */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                id="view-mode-grid-btn"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'
                }`}
                title="Tampilan Grid"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                id="view-mode-list-btn"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'list' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'
                }`}
                title="Tampilan List"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Add Video Button (Admin Only) */}
            {isAdmin && (
              <button
                id="playlist-add-video-btn"
                onClick={onOpenAddModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md transition-all active:scale-95"
                style={{ backgroundColor: theme.primaryHex }}
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Video Baru</span>
              </button>
            )}

          </div>

        </div>

        {/* Category Tabs & Search Bar */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'text-white shadow-md'
                    : 'bg-white/5 text-gray-400 hover:text-gray-200 border border-white/5 hover:border-white/10'
                }`}
                style={{
                  backgroundColor: selectedCategory === cat ? theme.primaryHex : undefined,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari dalam playlist..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1"
              style={{
                '--tw-ring-color': theme.primaryHex,
              } as React.CSSProperties}
            />
          </div>

        </div>
      </div>

      {/* Videos List / Grid */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-white/15 bg-white/5">
          <Film className="w-12 h-12 text-gray-500 mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-bold text-white mb-1">Tidak Ada Video Ditemukan</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
            Coba ubah kata kunci pencarian atau tambahkan video MP4 baru dari link VideyCo.
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md"
            style={{ backgroundColor: theme.primaryHex }}
          >
            + Tambah Video Sekarang
          </button>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5'
              : 'flex flex-col gap-3.5'
          }
        >
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              draggable={isDragEnabled ? true : undefined}
              onDragStart={(e) => handleDragStart(e, video.id)}
              onDragOver={(e) => handleDragOver(e, video.id)}
              onDrop={(e) => handleDrop(e, video.id)}
              onDragEnd={handleDragEnd}
              className={`transition-all duration-200 ${isDragEnabled ? 'cursor-grab active:cursor-grabbing' : ''}`}
              style={{
                opacity: draggedId === video.id ? 0.4 : 1,
                transform: dragOverId === video.id ? 'scale(1.02)' : 'scale(1)',
                border: dragOverId === video.id ? `2px solid ${theme.primaryHex}` : '2px solid transparent',
                borderRadius: '16px'
              }}
            >
              <VideoCard
                video={video}
                isActive={video.id === currentVideo.id}
                theme={theme}
                viewMode={viewMode}
                isAdmin={isAdmin}
                onSelect={onSelectVideo}
                onDelete={onDeleteVideo}
                onEdit={onEditVideo}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
