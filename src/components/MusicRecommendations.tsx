import React, { useState, useEffect } from 'react';
import { 
  Heart, Play, Plus, TrendingUp, Clock, Users, Star,
  RefreshCw, Filter, ChevronRight, Music, Headphones,
  ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal,
  Sparkles, Target, Zap, Award, Calendar, Volume2
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
  popularity?: number;
  energy?: number;
  danceability?: number;
  valence?: number;
  acousticness?: number;
  instrumentalness?: number;
  liveness?: number;
  speechiness?: number;
  isLiked?: boolean;
  playCount?: number;
  rating?: number;
}

interface RecommendationCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  tracks: Track[];
  algorithm: 'collaborative' | 'content' | 'hybrid' | 'trending' | 'similar_users';
  confidence: number;
}

interface UserPreferences {
  favoriteGenres: string[];
  preferredBpm: { min: number; max: number };
  energyLevel: number; // 0-1
  danceability: number; // 0-1
  valence: number; // 0-1 (mood)
  acousticness: number; // 0-1
  listeningTime: 'morning' | 'afternoon' | 'evening' | 'night';
  activityContext: 'workout' | 'study' | 'party' | 'relax' | 'work';
}

interface MusicRecommendationsProps {
  userPreferences?: UserPreferences;
  likedTracks?: Track[];
  recentlyPlayed?: Track[];
  currentTrack?: Track;
  onPlayTrack?: (track: Track) => void;
  onLikeTrack?: (track: Track) => void;
  onAddToPlaylist?: (track: Track) => void;
  onShareTrack?: (track: Track) => void;
  onUpdatePreferences?: (preferences: UserPreferences) => void;
  className?: string;
}

const MusicRecommendations: React.FC<MusicRecommendationsProps> = ({
  userPreferences,
  likedTracks = [],
  recentlyPlayed = [],
  currentTrack,
  onPlayTrack,
  onLikeTrack,
  onAddToPlaylist,
  onShareTrack,
  onUpdatePreferences,
  className = ''
}) => {
  const [recommendations, setRecommendations] = useState<RecommendationCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('for_you');
  const [showPreferences, setShowPreferences] = useState(false);

  // Données de démonstration pour les recommandations
  const mockTracks: Track[] = [
    {
      id: 'rec1',
      title: 'Cosmic Journey',
      artist: 'Space Odyssey',
      album: 'Interstellar Sounds',
      duration: 285,
      url: '/audio/cosmic-journey.mp3',
      coverArt: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=300',
      genre: 'Progressive House',
      year: 2024,
      bpm: 128,
      key: 'Am',
      popularity: 85,
      energy: 0.8,
      danceability: 0.9,
      valence: 0.7,
      acousticness: 0.1,
      instrumentalness: 0.8,
      liveness: 0.2,
      speechiness: 0.05,
      isLiked: false,
      playCount: 1250,
      rating: 4.6
    },
    {
      id: 'rec2',
      title: 'Neon Nights',
      artist: 'Retro Wave',
      album: 'Synthwave Dreams',
      duration: 240,
      url: '/audio/neon-nights.mp3',
      coverArt: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300',
      genre: 'Synthwave',
      year: 2023,
      bpm: 110,
      key: 'Dm',
      popularity: 78,
      energy: 0.6,
      danceability: 0.7,
      valence: 0.8,
      acousticness: 0.2,
      instrumentalness: 0.9,
      liveness: 0.1,
      speechiness: 0.03,
      isLiked: false,
      playCount: 890,
      rating: 4.4
    },
    {
      id: 'rec3',
      title: 'Bass Drop Revolution',
      artist: 'Heavy Beats',
      album: 'Electronic Mayhem',
      duration: 320,
      url: '/audio/bass-drop.mp3',
      coverArt: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300',
      genre: 'Dubstep',
      year: 2024,
      bpm: 140,
      key: 'Em',
      popularity: 92,
      energy: 0.95,
      danceability: 0.85,
      valence: 0.6,
      acousticness: 0.05,
      instrumentalness: 0.7,
      liveness: 0.3,
      speechiness: 0.1,
      isLiked: false,
      playCount: 2100,
      rating: 4.8
    },
    {
      id: 'rec4',
      title: 'Chill Sunset',
      artist: 'Ambient Collective',
      album: 'Peaceful Moments',
      duration: 360,
      url: '/audio/chill-sunset.mp3',
      coverArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300',
      genre: 'Ambient',
      year: 2023,
      bpm: 85,
      key: 'C',
      popularity: 65,
      energy: 0.3,
      danceability: 0.4,
      valence: 0.9,
      acousticness: 0.8,
      instrumentalness: 0.95,
      liveness: 0.1,
      speechiness: 0.02,
      isLiked: false,
      playCount: 450,
      rating: 4.2
    },
    {
      id: 'rec5',
      title: 'Festival Anthem 2024',
      artist: 'Main Stage Heroes',
      album: 'Summer Festival Hits',
      duration: 300,
      url: '/audio/festival-anthem.mp3',
      coverArt: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300',
      genre: 'Big Room House',
      year: 2024,
      bpm: 132,
      key: 'G',
      popularity: 88,
      energy: 0.9,
      danceability: 0.95,
      valence: 0.85,
      acousticness: 0.1,
      instrumentalness: 0.6,
      liveness: 0.4,
      speechiness: 0.08,
      isLiked: false,
      playCount: 1800,
      rating: 4.7
    },
    {
      id: 'rec6',
      title: 'Deep House Groove',
      artist: 'Underground Collective',
      album: 'After Hours',
      duration: 420,
      url: '/audio/deep-house.mp3',
      coverArt: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300',
      genre: 'Deep House',
      year: 2024,
      bpm: 122,
      key: 'Fm',
      popularity: 72,
      energy: 0.7,
      danceability: 0.8,
      valence: 0.6,
      acousticness: 0.15,
      instrumentalness: 0.85,
      liveness: 0.2,
      speechiness: 0.04,
      isLiked: false,
      playCount: 680,
      rating: 4.5
    }
  ];

  // Générer les catégories de recommandations
  useEffect(() => {
    const generateRecommendations = () => {
      setIsLoading(true);
      
      setTimeout(() => {
        const categories: RecommendationCategory[] = [
          {
            id: 'for_you',
            name: 'Pour vous',
            description: 'Basé sur vos goûts musicaux',
            icon: <Sparkles className="w-5 h-5" />,
            color: 'from-purple-500 to-pink-500',
            tracks: mockTracks.slice(0, 4),
            algorithm: 'hybrid',
            confidence: 0.92
          },
          {
            id: 'trending',
            name: 'Tendances',
            description: 'Les morceaux populaires du moment',
            icon: <TrendingUp className="w-5 h-5" />,
            color: 'from-orange-500 to-red-500',
            tracks: mockTracks.filter(t => (t.popularity || 0) > 80),
            algorithm: 'trending',
            confidence: 0.88
          },
          {
            id: 'similar_taste',
            name: 'Goûts similaires',
            description: 'Écouté par des utilisateurs aux goûts similaires',
            icon: <Users className="w-5 h-5" />,
            color: 'from-blue-500 to-cyan-500',
            tracks: mockTracks.slice(1, 5),
            algorithm: 'collaborative',
            confidence: 0.85
          },
          {
            id: 'energy_match',
            name: 'Niveau d\'énergie',
            description: 'Correspond à votre humeur actuelle',
            icon: <Zap className="w-5 h-5" />,
            color: 'from-green-500 to-emerald-500',
            tracks: mockTracks.filter(t => (t.energy || 0) > 0.7),
            algorithm: 'content',
            confidence: 0.79
          },
          {
            id: 'discover',
            name: 'Découvertes',
            description: 'Nouveaux artistes et genres à explorer',
            icon: <Target className="w-5 h-5" />,
            color: 'from-indigo-500 to-purple-500',
            tracks: mockTracks.slice(2, 6),
            algorithm: 'content',
            confidence: 0.73
          }
        ];

        setRecommendations(categories);
        setIsLoading(false);
      }, 1000);
    };

    generateRecommendations();
  }, [userPreferences, likedTracks, recentlyPlayed]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-400';
    if (confidence >= 0.8) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const TrackCard = ({ track, showDetails = false }: { track: Track; showDetails?: boolean }) => {
    const isCurrentTrack = currentTrack?.id === track.id;

    return (
      <div className={`bg-dark-800 rounded-lg p-4 hover:bg-dark-700 transition-all group ${
        isCurrentTrack ? 'ring-2 ring-purple-500' : ''
      }`}>
        <div className="flex items-center space-x-3">
          {/* Cover Art */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-dark-700">
              {track.coverArt ? (
                <img
                  src={track.coverArt}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music className="w-6 h-6 text-gray-500" />
                </div>
              )}
            </div>
            
            <button
              onClick={() => onPlayTrack?.(track)}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
            >
              <Play className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white truncate">{track.title}</h4>
            <p className="text-sm text-gray-400 truncate">{track.artist}</p>
            {showDetails && (
              <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                <span>{track.genre}</span>
                <span>{track.bpm} BPM</span>
                <span>{formatDuration(track.duration)}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onLikeTrack?.(track)}
              className={`p-2 rounded-full transition-colors ${
                track.isLiked 
                  ? 'text-red-500 hover:text-red-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${track.isLiked ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={() => onAddToPlaylist?.(track)}
              className="p-2 text-gray-400 hover:text-white rounded-full transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => onShareTrack?.(track)}
              className="p-2 text-gray-400 hover:text-white rounded-full transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Audio Features (si showDetails) */}
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-dark-600">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Énergie:</span>
                <span className="text-white">{Math.round((track.energy || 0) * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dansabilité:</span>
                <span className="text-white">{Math.round((track.danceability || 0) * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Humeur:</span>
                <span className="text-white">{Math.round((track.valence || 0) * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Popularité:</span>
                <span className="text-white">{track.popularity || 0}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const CategorySection = ({ category }: { category: RecommendationCategory }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}>
            {category.icon}
          </div>
          <div>
            <h3 className="font-semibold text-white">{category.name}</h3>
            <p className="text-sm text-gray-400">{category.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`text-xs font-medium ${getConfidenceColor(category.confidence)}`}>
            {Math.round(category.confidence * 100)}% de confiance
          </span>
          <button className="text-gray-400 hover:text-white">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {category.tracks.map(track => (
          <TrackCard key={track.id} track={track} showDetails={selectedCategory === category.id} />
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className={`bg-dark-900 ${className}`}>
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Génération de recommandations personnalisées...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-dark-900 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-dark-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Recommandations</h1>
            <p className="text-gray-400">Découvrez de nouveaux morceaux adaptés à vos goûts</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className="flex items-center space-x-2 px-4 py-2 bg-dark-800 border border-dark-600 text-gray-300 rounded-lg hover:bg-dark-700"
            >
              <Filter className="w-4 h-4" />
              <span>Préférences</span>
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-primary-500 text-white rounded-lg hover:opacity-90"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Actualiser</span>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-2 overflow-x-auto">
          {recommendations.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-purple-500 text-white'
                  : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700'
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {selectedCategory === 'for_you' ? (
          // Vue d'ensemble avec toutes les catégories
          <div className="space-y-8">
            {recommendations.map(category => (
              <CategorySection key={category.id} category={category} />
            ))}
          </div>
        ) : (
          // Vue détaillée d'une catégorie spécifique
          <div>
            {recommendations
              .filter(cat => cat.id === selectedCategory)
              .map(category => (
                <CategorySection key={category.id} category={category} />
              ))}
          </div>
        )}
      </div>

      {/* Preferences Panel */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-dark-800 rounded-xl p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Préférences musicales</h2>
              <button
                onClick={() => setShowPreferences(false)}
                className="text-gray-400 hover:text-white"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Genres préférés
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['House', 'Techno', 'Dubstep', 'Ambient', 'Jazz', 'Rock'].map(genre => (
                    <label key={genre} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-purple-500 bg-dark-700 border-dark-600 rounded"
                      />
                      <span className="text-sm text-gray-300">{genre}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Niveau d'énergie préféré
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="70"
                  className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Calme</span>
                  <span>Énergique</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Contexte d'écoute
                </label>
                <select className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white">
                  <option value="relax">Détente</option>
                  <option value="workout">Sport</option>
                  <option value="study">Étude</option>
                  <option value="party">Fête</option>
                  <option value="work">Travail</option>
                </select>
              </div>

              <button
                onClick={() => setShowPreferences(false)}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-primary-500 text-white rounded-lg hover:opacity-90"
              >
                Sauvegarder les préférences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicRecommendations;