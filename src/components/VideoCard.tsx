import React from 'react';
import { Play, Clock, Eye, Trash2, Star, CheckCircle, Edit3 } from 'lucide-react';
import { VideoItem, ThemeConfig } from '../types';
import { formatViews } from '../utils/videoHelpers';

interface VideoCardProps {
  video: VideoItem;
  isActive: boolean;
  theme: ThemeConfig;
  viewMode: 'grid' | 'list';
  isAdmin?: boolean;
  onSelect: (video: VideoItem) => void;
  onDelete?: (id: string) => void;
  onToggleFeatured?: (id: string) => void;
  onEdit?: (video: VideoItem) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  isActive,
  theme,
  viewMode,
  isAdmin = false,
  onSelect,
  onDelete,
  onToggleFeatured,
  onEdit,
}) => {
  return (
    <div
      id={`video-card-${video.id}`}
      onClick={() => onSelect(video)}
      className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 ${
        isActive
          ? 'border-2 shadow-xl scale-[1.01]'
          : 'border-white/10 hover:border-white/20 hover:scale-[1.01]'
      } ${
        theme.glassEffect ? 'bg-black/40 backdrop-blur-md' : theme.bgCard
      } ${
        viewMode === 'list' ? 'flex flex-col sm:flex-row gap-4 p-3' : 'flex flex-col'
      }`}
      style={{
        borderColor: isActive ? theme.primaryHex : undefined,
      }}
    >
      {/* Thumbnail & Badges */}
      <div 
        className={`relative overflow-hidden bg-neutral-900 ${
          viewMode === 'list' 
            ? 'w-full sm:w-52 sm:min-w-[208px] aspect-video rounded-xl shrink-0' 
            : 'w-full aspect-video rounded-t-xl'
        }`}
      >
        <img
          src={video.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
          }}
        />

        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div 
            className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg transform transition-transform ${
              isActive ? 'scale-110 opacity-100' : 'scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100'
            }`}
            style={{ backgroundColor: `${theme.primaryHex}ee` }}
          >
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* Duration Badge */}
        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/80 text-white backdrop-blur-sm">
          {video.duration || 'MP4'}
        </span>

        {/* Category Pill */}
        <span 
          className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-md backdrop-blur-sm"
          style={{ backgroundColor: `${theme.primaryHex}cc` }}
        >
          {video.category}
        </span>

        {/* Active Playing Indicator */}
        {isActive && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            Sedang Diputar
          </div>
        )}
      </div>

      {/* Info Body */}
      <div className={`p-4 flex-1 flex flex-col justify-between ${viewMode === 'list' ? 'p-0 sm:py-1' : ''}`}>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-400 font-medium truncate">
              {video.uploaderName}
            </span>
            {video.isFeatured && (
              <span className="text-[10px] font-bold text-amber-400 flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400" />
                Utama
              </span>
            )}
          </div>

          <h3 className={`font-bold text-white leading-snug group-hover:text-purple-300 transition-colors line-clamp-2 ${
            viewMode === 'list' ? 'text-sm sm:text-base' : 'text-sm'
          }`}>
            {video.title}
          </h3>

          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {video.description}
          </p>
        </div>

        {/* Card Footer: Views, Date, Actions */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-3 mt-2 border-t border-white/5">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-gray-500" />
              {formatViews(video.views)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-gray-500" />
              {video.addedAt}
            </span>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            {isAdmin && onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(video);
                }}
                className="p-1 rounded-md hover:bg-blue-500/20 text-gray-500 hover:text-blue-400 transition-colors"
                title="Edit Video"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
            {isAdmin && onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(video.id);
                }}
                className="p-1 rounded-md hover:bg-rose-500/20 text-gray-500 hover:text-rose-400 transition-colors"
                title="Hapus Video"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
