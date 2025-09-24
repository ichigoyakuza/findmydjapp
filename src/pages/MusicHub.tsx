import React, { useState, useEffect } from 'react';
import { 
  Music, Headphones, Heart, TrendingUp, List, Grid,
  Play, Pause, Volume2, Settings, Search, Filter,
  Plus, Download, Share2, Star, Clock, Users,
  SkipBack, SkipForward
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AudioPlayer from '../components/AudioPlayer';
import PlaylistManager from '../components/PlaylistManager';
import MusicRecommendations from '../components/MusicRecommendations';
import { usePlaylist, Track, Playlist } from '../hooks/usePlaylist';
import { showSuccess } from '../utils/notifications';
import { t } from '../utils/translations';

const MusicHub: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'player' | 'playlists' | 'recommendations'>('player');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [isExpanded, setIsExpanded] = useState(false);

  // Hook pour la gestion des playlists
  const {
    playlists,
    favorites,
    isLoading,
    error,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addToPlaylist,
    removeFromPlaylist,
    toggleLike,
    sharePlaylist,
    duplicatePlaylist,
    importPlaylist,
    exportPlaylist,
    refreshPlaylists
  } = usePlaylist(user?.id);

  // Données de démonstration pour les pistes actuelles
  const demoTracks: Track[] = [
    {
      id: 'demo1',
      title: 'Summer Vibes',
      artist: 'DJ Sunshine',
      album: 'Beach Party',
      duration: 240,
      url: '/audio/summer-vibes.mp3',
      coverArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300',
      genre: 'House',
      year: 2023,
      bpm: 128,
      key: 'Am',
      isLiked: true,
      playCount: 156,
      rating: 4.8
    },
    {
      id: 'demo2',
      title: 'Midnight Drive',
      artist: 'Neon Dreams',
      album: 'Synthwave Collection',
      duration: 320,
      url: '/audio/midnight-drive.mp3',
      coverArt: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300',
      genre: 'Synthwave',
      year: 2023,
      bpm: 110,
      key: 'Dm',
      isLiked: false,
      playCount: 89,
      rating: 4.5
    }
  ];

  // Initialiser avec une piste par défaut
  useEffect(() => {
    if (!currentTrack && demoTracks.length > 0) {
      setCurrentTrack(demoTracks[0]);
    }
  }, []);

  // Gestionnaires du lecteur audio
  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (currentPlaylist && currentTrack) {
      const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
      const nextIndex = (currentIndex + 1) % currentPlaylist.tracks.length;
      setCurrentTrack(currentPlaylist.tracks[nextIndex]);
    } else if (demoTracks.length > 0) {
      const currentIndex = demoTracks.findIndex(track => track.id === currentTrack?.id);
      const nextIndex = (currentIndex + 1) % demoTracks.length;
      setCurrentTrack(demoTracks[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (currentPlaylist && currentTrack) {
      const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
      const prevIndex = currentIndex === 0 ? currentPlaylist.tracks.length - 1 : currentIndex - 1;
      setCurrentTrack(currentPlaylist.tracks[prevIndex]);
    } else if (demoTracks.length > 0) {
      const currentIndex = demoTracks.findIndex(track => track.id === currentTrack?.id);
      const prevIndex = currentIndex === 0 ? demoTracks.length - 1 : currentIndex - 1;
      setCurrentTrack(demoTracks[prevIndex]);
    }
  };

  const handleSeek = (time: number) => {
    // Logique de recherche dans la piste
    console.log('Seeking to:', time);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const handleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const handleRepeat = () => {
    const modes: ('none' | 'one' | 'all')[] = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleToggleLike = async (trackId: string) => {
    const track = [...demoTracks, ...playlists.flatMap(p => p.tracks)].find(t => t.id === trackId);
    if (track) {
      await toggleLike(track);
      // Mettre à jour la piste actuelle si c'est celle qui a été likée
      if (currentTrack?.id === trackId) {
        setCurrentTrack({ ...currentTrack, isLiked: !currentTrack.isLiked });
      }
    }
  };

  const handleAddToPlaylist = (track: Track) => {
    // Ouvrir un modal pour sélectionner la playlist
    console.log('Add to playlist:', track.title);
  };

  const handleAddToPlaylistById = (trackId: string) => {
    const track = [...demoTracks, ...playlists.flatMap(p => p.tracks)].find(t => t.id === trackId);
    if (track) {
      handleAddToPlaylist(track);
    }
  };

  const handleShare = (track: Track) => {
    if (navigator.share) {
      navigator.share({
        title: track.title,
        text: `Écoutez "${track.title}" par ${track.artist}`,
        url: window.location.href
      });
    } else {
      // Fallback: copier dans le presse-papiers
      navigator.clipboard.writeText(`${track.title} - ${track.artist}`);
      showSuccess(t('notifications.infoCopied'));
    }
  };

  const handleDownload = (track: Track) => {
    // Logique de téléchargement
    console.log('Download track:', track.title);
  };

  // Gestionnaires des playlists
  const handlePlayPlaylist = (playlist: Playlist, trackIndex: number = 0) => {
    setCurrentPlaylist(playlist);
    if (playlist.tracks.length > 0) {
      setCurrentTrack(playlist.tracks[trackIndex]);
      setIsPlaying(true);
    }
  };

  // Gestionnaires des recommandations
  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleLikeTrack = async (track: Track) => {
    await toggleLike(track);
    // Mettre à jour la piste actuelle si c'est celle qui a été likée
    if (currentTrack?.id === track.id) {
      setCurrentTrack({ ...currentTrack, isLiked: !currentTrack.isLiked });
    }
  };

  const handleShareTrack = (track: Track) => {
    handleShare(track);
  };

  const tabs = [
    {
      id: 'player' as const,
      label: 'Lecteur',
      icon: <Headphones className="w-5 h-5" />,
      description: 'Lecteur audio avancé'
    },
    {
      id: 'playlists' as const,
      label: 'Playlists',
      icon: <List className="w-5 h-5" />,
      description: 'Gérer vos playlists'
    },
    {
      id: 'recommendations' as const,
      label: 'Découvertes',
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'Recommandations personnalisées'
    }
  ];

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <div className="bg-dark-900 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Music className="w-8 h-8 text-purple-500" />
              <div>
                <h1 className="text-xl font-bold text-white">Music Hub</h1>
                <p className="text-sm text-gray-400">Votre centre musical personnel</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Indicateur de lecture */}
              {currentTrack && (
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  {isPlaying ? (
                    <Play className="w-4 h-4 text-green-500" />
                  ) : (
                    <Pause className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">
                    {currentTrack.title} - {currentTrack.artist}
                  </span>
                </div>
              )}

              {/* Contrôles rapides */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevious}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                
                <button
                  onClick={isPlaying ? handlePause : handlePlay}
                  className="p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
                
                <button
                  onClick={handleNext}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation des onglets */}
      <div className="bg-dark-900 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-500'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'player' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Lecteur Audio Avancé</h2>
              <p className="text-gray-400">
                Profitez d'une expérience d'écoute complète avec des contrôles avancés
              </p>
            </div>
            
            <AudioPlayer
              currentTrack={currentTrack || undefined}
              playlist={currentPlaylist || undefined}
              isPlaying={isPlaying}
              volume={volume}
              isShuffled={isShuffled}
              repeatMode={repeatMode}
              isExpanded={isExpanded}
              onPlay={handlePlay}
              onPause={handlePause}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSeek={handleSeek}
              onVolumeChange={handleVolumeChange}
              onShuffle={handleShuffle}
              onRepeat={handleRepeat}
              onToggleExpanded={handleToggleExpanded}
              onToggleLike={handleToggleLike}
              onAddToPlaylist={handleAddToPlaylistById}
              onShare={handleShare}
              onDownload={handleDownload}
              className="w-full"
            />
          </div>
        )}

        {activeTab === 'playlists' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Gestionnaire de Playlists</h2>
              <p className="text-gray-400">
                Créez, organisez et partagez vos playlists musicales
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Chargement des playlists...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={refreshPlaylists}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  Réessayer
                </button>
              </div>
            ) : (
              <PlaylistManager
                playlists={playlists}
                currentPlaylist={currentPlaylist || undefined}
                currentTrack={currentTrack || undefined}
                isPlaying={isPlaying}
                favorites={favorites}
                onCreatePlaylist={createPlaylist}
                onUpdatePlaylist={updatePlaylist}
                onDeletePlaylist={deletePlaylist}
                onAddToPlaylist={addToPlaylist}
                onRemoveFromPlaylist={removeFromPlaylist}
                onPlayPlaylist={handlePlayPlaylist}
                onToggleLike={handleLikeTrack}
                onSharePlaylist={sharePlaylist}
                onDuplicatePlaylist={duplicatePlaylist}
                onImportPlaylist={importPlaylist}
                onExportPlaylist={exportPlaylist}
                currentUserId={user?.id}
                className="w-full"
              />
            )}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Découvertes Musicales</h2>
              <p className="text-gray-400">
                Découvrez de nouveaux morceaux adaptés à vos goûts musicaux
              </p>
            </div>

            <MusicRecommendations
              likedTracks={favorites}
              recentlyPlayed={demoTracks}
              currentTrack={currentTrack || undefined}
              onPlayTrack={handlePlayTrack}
              onLikeTrack={handleLikeTrack}
              onAddToPlaylist={handleAddToPlaylist}
              onShareTrack={handleShareTrack}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicHub;