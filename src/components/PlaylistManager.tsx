import React, { useState, useEffect } from 'react';
import { 
  Plus, Play, Pause, Heart, Share2, Download, MoreHorizontal,
  Edit3, Trash2, Lock, Unlock, Users, Music, Clock, Star,
  Search, Filter, Grid, List, Shuffle, Copy, Eye, EyeOff,
  Upload, FolderPlus, Settings, ChevronDown, Check,
  X, Save, Image as ImageIcon, User, Calendar, Volume2
} from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url: string;
  coverArt?: string;
  genre?: string;
  year?: number;
  bpm?: number;
  key?: string;
  isLiked?: boolean;
  playCount?: number;
  rating?: number;
  addedAt?: string;
  addedBy?: string;
}

interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: Track[];
  coverArt?: string;
  isPublic?: boolean;
  isCollaborative?: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  totalDuration: number;
  followers?: number;
  tags?: string[];
  category?: 'personal' | 'shared' | 'public' | 'favorites';
}

interface PlaylistManagerProps {
  playlists: Playlist[];
  currentPlaylist?: Playlist;
  currentTrack?: Track;
  isPlaying?: boolean;
  favorites: Track[];
  onCreatePlaylist?: (playlist: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt' | 'totalDuration'>) => void;
  onUpdatePlaylist?: (playlistId: string, updates: Partial<Playlist>) => void;
  onDeletePlaylist?: (playlistId: string) => void;
  onAddToPlaylist?: (playlistId: string, track: Track) => void;
  onRemoveFromPlaylist?: (playlistId: string, trackId: string) => void;
  onPlayPlaylist?: (playlist: Playlist, trackIndex?: number) => void;
  onToggleLike?: (track: Track) => void;
  onSharePlaylist?: (playlist: Playlist) => void;
  onDuplicatePlaylist?: (playlist: Playlist) => void;
  onImportPlaylist?: (file: File) => void;
  onExportPlaylist?: (playlist: Playlist) => void;
  currentUserId?: string;
  className?: string;
}

const PlaylistManager: React.FC<PlaylistManagerProps> = ({
  playlists,
  currentPlaylist,
  currentTrack,
  isPlaying = false,
  favorites,
  onCreatePlaylist,
  onUpdatePlaylist,
  onDeletePlaylist,
  onAddToPlaylist,
  onRemoveFromPlaylist,
  onPlayPlaylist,
  onToggleLike,
  onSharePlaylist,
  onDuplicatePlaylist,
  onImportPlaylist,
  onExportPlaylist,
  currentUserId,
  className = ''
}) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'personal' | 'shared' | 'public' | 'favorites'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'updated' | 'duration' | 'tracks'>('updated');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [showTrackDetails, setShowTrackDetails] = useState(false);

  // Filtrer et trier les playlists
  const filteredPlaylists = playlists
    .filter(playlist => {
      // Filtre par catégorie
      if (filter === 'favorites') return playlist.category === 'favorites';
      if (filter === 'personal') return playlist.createdBy === currentUserId;
      if (filter === 'shared') return playlist.isCollaborative;
      if (filter === 'public') return playlist.isPublic;
      
      // Filtre par recherche
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return playlist.name.toLowerCase().includes(query) ||
               playlist.description?.toLowerCase().includes(query) ||
               playlist.tags?.some(tag => tag.toLowerCase().includes(query));
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'duration':
          return b.totalDuration - a.totalDuration;
        case 'tracks':
          return b.tracks.length - a.tracks.length;
        default:
          return 0;
      }
    });

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const CreatePlaylistModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      isPublic: false,
      isCollaborative: false,
      tags: [] as string[],
      coverArt: ''
    });
    const [newTag, setNewTag] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name.trim()) return;

      onCreatePlaylist?.({
        ...formData,
        tracks: [],
        createdBy: currentUserId || '',
        followers: 0,
        category: 'personal'
      });

      setFormData({
        name: '',
        description: '',
        isPublic: false,
        isCollaborative: false,
        tags: [],
        coverArt: ''
      });
      setShowCreateModal(false);
    };

    const addTag = () => {
      if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag.trim()]
        }));
        setNewTag('');
      }
    };

    const removeTag = (tag: string) => {
      setFormData(prev => ({
        ...prev,
        tags: prev.tags.filter(t => t !== tag)
      }));
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-dark-800 rounded-xl p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Créer une playlist</h2>
            <button
              onClick={() => setShowCreateModal(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nom de la playlist *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                placeholder="Ma nouvelle playlist"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 h-20 resize-none"
                placeholder="Description de votre playlist..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                  placeholder="Ajouter un tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs flex items-center space-x-1"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-purple-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="w-4 h-4 text-purple-500 bg-dark-700 border-dark-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-300">Playlist publique</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.isCollaborative}
                  onChange={(e) => setFormData(prev => ({ ...prev, isCollaborative: e.target.checked }))}
                  className="w-4 h-4 text-purple-500 bg-dark-700 border-dark-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-300">Playlist collaborative</span>
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-dark-600 text-gray-300 rounded-lg hover:bg-dark-700"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-primary-500 text-white rounded-lg hover:opacity-90"
              >
                Créer
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const PlaylistCard = ({ playlist }: { playlist: Playlist }) => {
    const isOwner = playlist.createdBy === currentUserId;
    const isCurrentlyPlaying = currentPlaylist?.id === playlist.id && isPlaying;

    return (
      <div className="bg-dark-800 rounded-xl p-4 hover:bg-dark-700 transition-colors group">
        {/* Cover Art */}
        <div className="relative mb-4">
          <div className="w-full aspect-square rounded-lg overflow-hidden bg-dark-700">
            {playlist.coverArt ? (
              <img
                src={playlist.coverArt}
                alt={playlist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music className="w-12 h-12 text-gray-500" />
              </div>
            )}
          </div>
          
          {/* Play Button Overlay */}
          <button
            onClick={() => onPlayPlaylist?.(playlist)}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-primary-500 flex items-center justify-center">
              {isCurrentlyPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-0.5" />
              )}
            </div>
          </button>

          {/* Status Indicators */}
          <div className="absolute top-2 right-2 flex space-x-1">
            {playlist.isPublic && (
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <Unlock className="w-3 h-3 text-white" />
              </div>
            )}
            {playlist.isCollaborative && (
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                <Users className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-white truncate">{playlist.name}</h3>
          {playlist.description && (
            <p className="text-sm text-gray-400 line-clamp-2">{playlist.description}</p>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{playlist.tracks.length} pistes</span>
            <span>{formatDuration(playlist.totalDuration)}</span>
          </div>

          {playlist.tags && playlist.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {playlist.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
              {playlist.tags.length > 3 && (
                <span className="text-gray-500 text-xs">+{playlist.tags.length - 3}</span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-gray-500">
              {formatDate(playlist.updatedAt)}
            </span>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onSharePlaylist?.(playlist)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
              
              {isOwner && (
                <button
                  onClick={() => {
                    setEditingPlaylist(playlist);
                    setShowEditModal(true);
                  }}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              
              <button className="p-1 text-gray-400 hover:text-white transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-dark-900 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-dark-700">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Mes Playlists</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-primary-500 text-white rounded-lg hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            <span>Créer</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher des playlists..."
              className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-400"
            />
          </div>

          {/* Filters and Controls */}
          <div className="flex items-center space-x-3">
            {/* Category Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="all">Toutes</option>
              <option value="personal">Personnelles</option>
              <option value="shared">Partagées</option>
              <option value="public">Publiques</option>
              <option value="favorites">Favoris</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="updated">Récemment modifiées</option>
              <option value="created">Récemment créées</option>
              <option value="name">Nom</option>
              <option value="duration">Durée</option>
              <option value="tracks">Nombre de pistes</option>
            </select>

            {/* View Toggle */}
            <div className="flex bg-dark-800 rounded-lg p-1">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded ${view === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded ${view === 'list' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {filteredPlaylists.length === 0 ? (
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery ? 'Aucune playlist trouvée' : 'Aucune playlist'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery 
                ? 'Essayez de modifier votre recherche'
                : 'Créez votre première playlist pour commencer'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-primary-500 text-white rounded-lg hover:opacity-90"
              >
                Créer ma première playlist
              </button>
            )}
          </div>
        ) : (
          <div className={view === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {filteredPlaylists.map(playlist => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && <CreatePlaylistModal />}
    </div>
  );
};

export default PlaylistManager;