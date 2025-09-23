import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  Repeat, Shuffle, Heart, Share2, Download, MoreHorizontal,
  Maximize2, Minimize2, List, Radio, Headphones, Settings,
  Clock, Music, User, Album, Mic2, Star, Plus, Check
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
}

interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: Track[];
  coverArt?: string;
  isPublic?: boolean;
  createdBy?: string;
  createdAt?: string;
  totalDuration?: number;
}

interface AudioPlayerProps {
  currentTrack?: Track;
  playlist?: Playlist;
  isPlaying?: boolean;
  volume?: number;
  isShuffled?: boolean;
  repeatMode?: 'none' | 'one' | 'all';
  isExpanded?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onSeek?: (time: number) => void;
  onVolumeChange?: (volume: number) => void;
  onShuffle?: () => void;
  onRepeat?: () => void;
  onToggleExpanded?: () => void;
  onToggleLike?: (trackId: string) => void;
  onAddToPlaylist?: (trackId: string) => void;
  onShare?: (track: Track) => void;
  onDownload?: (track: Track) => void;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentTrack,
  playlist,
  isPlaying = false,
  volume = 1,
  isShuffled = false,
  repeatMode = 'none',
  isExpanded = false,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onShuffle,
  onRepeat,
  onToggleExpanded,
  onToggleLike,
  onAddToPlaylist,
  onShare,
  onDownload,
  className = ''
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showEqualizer, setShowEqualizer] = useState(false);
  const [audioQuality, setAudioQuality] = useState<'auto' | 'high' | 'medium' | 'low'>('auto');
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  // Gestion de la lecture audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const updateTime = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        onNext?.();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, isDragging, repeatMode, onNext]);

  // Contrôle de la lecture
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Contrôle du volume
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent) => {
    if (!progressRef.current || !currentTrack) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * currentTrack.duration;
    
    setCurrentTime(newTime);
    onSeek?.(newTime);
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeClick = (e: React.MouseEvent) => {
    if (!volumeRef.current) return;
    
    const rect = volumeRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newVolume = Math.max(0, Math.min(1, clickX / rect.width));
    
    onVolumeChange?.(newVolume);
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one':
        return <Repeat className="w-4 h-4" />;
      case 'all':
        return <Repeat className="w-4 h-4" />;
      default:
        return <Repeat className="w-4 h-4 opacity-50" />;
    }
  };

  if (!currentTrack) {
    return (
      <div className={`bg-dark-900 border-t border-dark-700 p-4 ${className}`}>
        <div className="flex items-center justify-center text-gray-500">
          <Music className="w-8 h-8 mr-3" />
          <span>Aucune piste sélectionnée</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-dark-900 border-t border-dark-700 ${isExpanded ? 'h-screen' : 'h-auto'} ${className}`}>
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.url}
        preload="metadata"
      />

      {/* Mode compact */}
      {!isExpanded && (
        <div className="p-4">
          {/* Progress Bar */}
          <div 
            ref={progressRef}
            className="w-full h-1 bg-dark-700 rounded-full cursor-pointer mb-4"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-primary-500 rounded-full transition-all duration-150"
              style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            {/* Track Info */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-dark-800 flex-shrink-0">
                {currentTrack.coverArt ? (
                  <img 
                    src={currentTrack.coverArt} 
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="w-6 h-6 text-gray-500" />
                  </div>
                )}
              </div>
              
              <div className="min-w-0 flex-1">
                <h4 className="text-white font-medium truncate">{currentTrack.title}</h4>
                <p className="text-gray-400 text-sm truncate">{currentTrack.artist}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={onPrevious}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              
              <button
                onClick={isPlaying ? onPause : onPlay}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-primary-500 flex items-center justify-center text-white hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              
              <button
                onClick={onNext}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Volume & Expand */}
            <div className="flex items-center space-x-2 ml-4">
              <div className="relative">
                <button
                  onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                
                {showVolumeSlider && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-dark-800 rounded-lg p-2 shadow-xl">
                    <div 
                      ref={volumeRef}
                      className="w-20 h-1 bg-dark-600 rounded-full cursor-pointer"
                      onClick={handleVolumeClick}
                    >
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-primary-500 rounded-full"
                        style={{ width: `${volume * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={onToggleExpanded}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode étendu */}
      {isExpanded && (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-dark-700">
            <h2 className="text-xl font-bold text-white">Lecteur Audio</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className={`p-2 rounded-lg transition-colors ${showPlaylist ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowEqualizer(!showEqualizer)}
                className={`p-2 rounded-lg transition-colors ${showEqualizer ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={onToggleExpanded}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex">
            {/* Main Player */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              {/* Cover Art */}
              <div className="w-64 h-64 rounded-2xl overflow-hidden bg-dark-800 mb-8 shadow-2xl">
                {currentTrack.coverArt ? (
                  <img 
                    src={currentTrack.coverArt} 
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="w-24 h-24 text-gray-500" />
                  </div>
                )}
              </div>

              {/* Track Info */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">{currentTrack.title}</h1>
                <p className="text-xl text-gray-400 mb-4">{currentTrack.artist}</p>
                {currentTrack.album && (
                  <p className="text-gray-500">{currentTrack.album}</p>
                )}
                
                {/* Track Details */}
                <div className="flex items-center justify-center space-x-6 mt-4 text-sm text-gray-500">
                  {currentTrack.genre && (
                    <span className="flex items-center space-x-1">
                      <Music className="w-4 h-4" />
                      <span>{currentTrack.genre}</span>
                    </span>
                  )}
                  {currentTrack.bpm && (
                    <span className="flex items-center space-x-1">
                      <Radio className="w-4 h-4" />
                      <span>{currentTrack.bpm} BPM</span>
                    </span>
                  )}
                  {currentTrack.key && (
                    <span className="flex items-center space-x-1">
                      <Mic2 className="w-4 h-4" />
                      <span>{currentTrack.key}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Progress */}
              <div className="w-full max-w-md mb-8">
                <div 
                  ref={progressRef}
                  className="w-full h-2 bg-dark-700 rounded-full cursor-pointer mb-2"
                  onClick={handleProgressClick}
                >
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-primary-500 rounded-full transition-all duration-150"
                    style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(currentTrack.duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-6 mb-8">
                <button
                  onClick={onShuffle}
                  className={`p-3 rounded-full transition-colors ${isShuffled ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Shuffle className="w-5 h-5" />
                </button>
                
                <button
                  onClick={onPrevious}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <SkipBack className="w-8 h-8" />
                </button>
                
                <button
                  onClick={isPlaying ? onPause : onPlay}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-primary-500 flex items-center justify-center text-white hover:scale-105 transition-transform shadow-lg"
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </button>
                
                <button
                  onClick={onNext}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <SkipForward className="w-8 h-8" />
                </button>
                
                <button
                  onClick={onRepeat}
                  className={`p-3 rounded-full transition-colors ${repeatMode !== 'none' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  {getRepeatIcon()}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onToggleLike?.(currentTrack.id)}
                  className={`p-2 rounded-full transition-colors ${currentTrack.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                >
                  <Heart className={`w-5 h-5 ${currentTrack.isLiked ? 'fill-current' : ''}`} />
                </button>
                
                <button
                  onClick={() => onAddToPlaylist?.(currentTrack.id)}
                  className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => onShare?.(currentTrack)}
                  className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => onDownload?.(currentTrack)}
                  className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center space-x-4 mt-8">
                <VolumeX className="w-5 h-5 text-gray-400" />
                <div 
                  ref={volumeRef}
                  className="w-32 h-2 bg-dark-700 rounded-full cursor-pointer"
                  onClick={handleVolumeClick}
                >
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-primary-500 rounded-full"
                    style={{ width: `${volume * 100}%` }}
                  />
                </div>
                <Volume2 className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Sidebar - Playlist */}
            {showPlaylist && playlist && (
              <div className="w-80 border-l border-dark-700 bg-dark-800">
                <div className="p-4 border-b border-dark-700">
                  <h3 className="text-lg font-semibold text-white">{playlist.name}</h3>
                  <p className="text-sm text-gray-400">{playlist.tracks.length} pistes</p>
                </div>
                <div className="overflow-y-auto h-full">
                  {playlist.tracks.map((track, index) => (
                    <div
                      key={track.id}
                      className={`p-3 border-b border-dark-700 hover:bg-dark-700 cursor-pointer ${
                        track.id === currentTrack.id ? 'bg-purple-500/20' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-500 text-sm w-6">{index + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm truncate">{track.title}</p>
                          <p className="text-gray-400 text-xs truncate">{track.artist}</p>
                        </div>
                        <span className="text-gray-500 text-xs">{formatTime(track.duration)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sidebar - Equalizer */}
            {showEqualizer && (
              <div className="w-80 border-l border-dark-700 bg-dark-800">
                <div className="p-4 border-b border-dark-700">
                  <h3 className="text-lg font-semibold text-white">Égaliseur</h3>
                </div>
                <div className="p-4">
                  {/* Quality Selector */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Qualité Audio
                    </label>
                    <select
                      value={audioQuality}
                      onChange={(e) => setAudioQuality(e.target.value as typeof audioQuality)}
                      className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="auto">Automatique</option>
                      <option value="high">Haute (320 kbps)</option>
                      <option value="medium">Moyenne (192 kbps)</option>
                      <option value="low">Faible (128 kbps)</option>
                    </select>
                  </div>

                  {/* EQ Bands */}
                  <div className="space-y-4">
                    {['60Hz', '170Hz', '310Hz', '600Hz', '1kHz', '3kHz', '6kHz', '12kHz', '14kHz', '16kHz'].map((freq) => (
                      <div key={freq} className="flex items-center space-x-3">
                        <span className="text-xs text-gray-400 w-12">{freq}</span>
                        <input
                          type="range"
                          min="-12"
                          max="12"
                          defaultValue="0"
                          className="flex-1 h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Presets */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Préréglages
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Normal', 'Rock', 'Pop', 'Jazz', 'Classique', 'Électronique'].map((preset) => (
                        <button
                          key={preset}
                          className="px-3 py-2 text-xs bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg transition-colors"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;