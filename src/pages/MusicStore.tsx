import React, { useState, useEffect } from 'react';
import { Play, Pause, ShoppingCart, Heart, Download, Star, Filter, Search } from 'lucide-react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { useAuth } from '../contexts/AuthContext';
import { MusicTrack } from '../config/stripe';
import { showError, showInfo } from '../utils/notifications';
import { t } from '../utils/translations';

export const MusicStore: React.FC = () => {
  const { tracks, createMusicSale, isLoading } = useMarketplace();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState('all');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [purchasedTracks, setPurchasedTracks] = useState<string[]>([]);

  // Gérer la sélection multiple de genres
  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  // Filtrer les tracks
  const filteredTracks = tracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = selectedGenres.length === 0 || 
                        selectedGenres.some(genre => 
                          track.genre?.toLowerCase().includes(genre.toLowerCase())
                        );
    
    const matchesPrice = priceRange === 'all' || 
                        (priceRange === 'low' && track.price <= 2) ||
                        (priceRange === 'medium' && track.price > 2 && track.price <= 4) ||
                        (priceRange === 'high' && track.price > 4);

    return matchesSearch && matchesGenre && matchesPrice;
  });

  // Gérer la lecture audio
  const togglePlay = (trackId: string) => {
    if (currentlyPlaying === trackId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(trackId);
    }
  };

  // Gérer les favoris
  const toggleFavorite = (trackId: string) => {
    setFavorites(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  // Acheter une track
  const handlePurchase = async (track: MusicTrack) => {
    if (!user) {
      showError(t('notifications.loginRequired'));
      return;
    }

    if (purchasedTracks.includes(track.id)) {
      showInfo(t('notifications.trackAlreadyOwned'));
      return;
    }

    try {
      await createMusicSale(track, user.id);
      setPurchasedTracks(prev => [...prev, track.id]);
    } catch (error) {
      console.error('Erreur lors de l\'achat:', error);
      showError(t('notifications.purchaseError'));
    }
  };

  // Simuler des tracks achetées
  useEffect(() => {
    // En production, ceci viendrait de votre API
    setPurchasedTracks(['1']); // L'utilisateur a déjà acheté la track 1
  }, [user]);

  const TrackCard: React.FC<{ track: MusicTrack }> = ({ track }) => {
    const isPlaying = currentlyPlaying === track.id;
    const isFavorite = favorites.includes(track.id);
    const isPurchased = purchasedTracks.includes(track.id);

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative">
          <img
            src={track.coverUrl || '/api/placeholder/300/200'}
            alt={track.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <button
              onClick={() => togglePlay(track.id)}
              className="bg-white rounded-full p-3 hover:bg-gray-100 transition-colors"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 text-gray-800" />
              ) : (
                <Play className="h-6 w-6 text-gray-800" />
              )}
            </button>
          </div>
          <button
            onClick={() => toggleFavorite(track.id)}
            className={`absolute top-3 right-3 p-2 rounded-full ${
              isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
            } hover:scale-110 transition-transform`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">{track.title}</h3>
          <p className="text-gray-600 mb-3">{track.artist}</p>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <Star className="h-4 w-4 text-gray-300" />
              <span className="text-sm text-gray-600 ml-2">(4.2)</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-lg font-bold text-purple-600">
                {track.price.toFixed(2)} €
              </span>
              <span className="text-xs text-gray-500">
                Prix fixé par {track.artist}
              </span>
            </div>
          </div>



          <div className="flex space-x-2">
            {isPurchased ? (
              <button
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                onClick={() => {
                  // Simuler le téléchargement
                  showInfo(t('notifications.downloadStarted'));
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </button>
            ) : (
              <button
                onClick={() => handlePurchase(track)}
                disabled={isLoading}
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isLoading ? 'Achat...' : 'Acheter'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎵 Music Store
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez et achetez les meilleures tracks de nos DJs. 
            Chaque achat soutient directement les artistes.
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher une track ou un artiste..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genres musicaux
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['house', 'techno', 'electronic', 'ambient', 'deep house', 'trance', 'kizomba', 'salsa', 'bachata'].map((genre) => (
                  <label key={genre} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre)}
                      onChange={() => handleGenreToggle(genre)}
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700 capitalize">{genre}</span>
                  </label>
                ))}
              </div>
              {selectedGenres.length > 0 && (
                <button
                  onClick={() => setSelectedGenres([])}
                  className="text-xs text-purple-600 hover:text-purple-800 mt-1"
                >
                  Effacer la sélection
                </button>
              )}
            </div>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">Tous les prix</option>
              <option value="low">Moins de 2€</option>
              <option value="medium">2€ - 4€</option>
              <option value="high">Plus de 4€</option>
            </select>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{tracks.length}</div>
            <div className="text-sm text-gray-600">Tracks disponibles</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{purchasedTracks.length}</div>
            <div className="text-sm text-gray-600">Tracks achetées</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{favorites.length}</div>
            <div className="text-sm text-gray-600">Favoris</div>
          </div>
        </div>

        {/* Grille des tracks */}
        {filteredTracks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune track trouvée
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos filtres de recherche.
            </p>
          </div>
        )}


      </div>
    </div>
  );
};