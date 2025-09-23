import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Search, Filter, Grid, List, Play, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Artists = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  // Mock data for artists
  const artists = [
    {
      id: '1',
      name: 'DJ Nexus',
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600',
      genres: ['House', 'Techno'],
      location: 'Miami, FL',
      rating: 4.9,
      bookings: 156,
      isAvailable: true
    },
    {
      id: '2',
      name: 'DJ Pulse',
      image: 'https://images.pexels.com/photos/2034851/pexels-photo-2034851.jpeg?auto=compress&cs=tinysrgb&w=600',
      genres: ['Hip-Hop', 'R&B'],
      location: 'New York, NY',
      rating: 4.7,
      bookings: 89,
      isAvailable: false
    },
    {
      id: '3',
      name: 'DJ Rhythm',
      image: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=600',
      genres: ['EDM', 'Trance'],
      location: 'Los Angeles, CA',
      rating: 4.8,
      bookings: 203,
      isAvailable: true
    },
    {
      id: '4',
      name: 'DJ Harmony',
      image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=600',
      genres: ['Deep House', 'Ambient'],
      location: 'Chicago, IL',
      rating: 4.6,
      bookings: 67,
      isAvailable: true
    },
    {
      id: '5',
      name: 'DJ Beats',
      image: 'https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg?auto=compress&cs=tinysrgb&w=600',
      genres: ['Drum & Bass', 'Dubstep'],
      location: 'Berlin, Germany',
      rating: 4.9,
      bookings: 234,
      isAvailable: false
    },
    {
      id: '6',
      name: 'DJ Groove',
      image: 'https://images.pexels.com/photos/1649692/pexels-photo-1649692.jpeg?auto=compress&cs=tinysrgb&w=600',
      genres: ['Funk', 'Disco'],
      location: 'Paris, France',
      rating: 4.5,
      bookings: 123,
      isAvailable: true
    },
    {
      id: '7',
      name: 'DJ Kizomba Flow',
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600',
      genres: ['Kizomba', 'Zouk'],
      location: 'Lisbon, Portugal',
      rating: 4.8,
      bookings: 98,
      isAvailable: true
    },
    {
      id: '8',
      name: 'Salsa Queen',
      image: 'https://images.pexels.com/photos/2034851/pexels-photo-2034851.jpeg?auto=compress&cs=tinysrgb&w=600',
      genres: ['Salsa', 'Merengue'],
      location: 'Havana, Cuba',
      rating: 4.9,
      bookings: 187,
      isAvailable: true
    },
    {
      id: '9',
      name: 'Bachata Soul',
      image: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=600',
      genres: ['Bachata', 'Latin'],
      location: 'Santo Domingo, DR',
      rating: 4.7,
      bookings: 145,
      isAvailable: true
    }
  ];

  // Utiliser une liste complète de genres pour s'assurer que tous les genres sont disponibles
  const allGenres = ['House', 'Techno', 'Hip-Hop', 'R&B', 'EDM', 'Trance', 'Deep House', 'Ambient', 'Drum & Bass', 'Dubstep', 'Funk', 'Disco', 'Kizomba', 'Salsa', 'Bachata', 'Zouk', 'Merengue', 'Latin'];

  const filteredArtists = artists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artist.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenres.length === 0 || 
      selectedGenres.some(selectedGenre => 
        artist.genres.some(artistGenre => artistGenre.toLowerCase() === selectedGenre.toLowerCase())
      );
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section - Mobile Optimized */}
      <div className="relative w-full h-48 sm:h-64 lg:h-80 overflow-hidden">
        <img 
          src="https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=1200" 
          alt="DJ Performance" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/20 via-dark-900/60 to-dark-900"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2">
              {t('misc.artists')} <span className="text-gradient">DJ</span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg max-w-2xl">
              Découvrez les meilleurs DJs pour votre prochain événement
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        {/* Search and Filters - Mobile First */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Rechercher un DJ ou une ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full pl-10 sm:pl-12"
              />
            </div>

            {/* View Toggle & Filter Button */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn-secondary px-3 py-2 sm:px-4 ${showFilters ? 'bg-purple-500/20 text-purple-300' : ''}`}
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline ml-2">Filtres</span>
              </button>
              
              <div className="hidden sm:flex bg-dark-800/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel - Mobile Collapsible */}
          {showFilters && (
            <div className="card p-4 mb-4 animate-fade-in">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300">Genres musicaux</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {allGenres.map((genre) => (
                    <label key={genre} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre)}
                        onChange={() => handleGenreToggle(genre)}
                        className="w-4 h-4 text-purple-600 bg-dark-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-300">{genre}</span>
                    </label>
                  ))}
                </div>
                {selectedGenres.length > 0 && (
                  <button
                    onClick={() => setSelectedGenres([])}
                    className="text-xs text-purple-400 hover:text-purple-300"
                  >
                    Effacer la sélection
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>{filteredArtists.length} {filteredArtists.length > 1 ? t('misc.artistPlural') : t('misc.artist')} {filteredArtists.length > 1 ? t('misc.foundPlural') : t('misc.found')}</span>
          </div>
        </div>

        {/* Artists Grid/List - Responsive */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6' 
            : 'space-y-4'
        }`}>
          {filteredArtists.map((artist) => (
            viewMode === 'grid' ? (
              // Grid View
              <div key={artist.id} className="group">
                <div className="card hover:shadow-glow transform hover:-translate-y-1 will-change-transform">
                  <div className="relative h-40 sm:h-48 overflow-hidden rounded-t-2xl">
                    <img 
                      src={artist.image} 
                      alt={artist.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-transparent to-transparent"></div>
                    
                    {/* Availability Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                        artist.isAvailable 
                          ? 'bg-green-500/30 text-green-300 border border-green-400/50' 
                          : 'bg-red-500/30 text-red-300 border border-red-400/50'
                      }`}>
                        {artist.isAvailable ? 'Disponible' : 'Occupé'}
                      </span>
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="p-2 bg-dark-900/80 backdrop-blur-sm rounded-full text-white hover:bg-purple-500/80 transition-colors">
                        <Play className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-dark-900/80 backdrop-blur-sm rounded-full text-white hover:bg-red-500/80 transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-gradient transition-all duration-300 truncate">
                          {artist.name}
                        </h2>
                        <div className="flex items-center text-gray-400 text-sm">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{artist.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center bg-dark-800/50 px-2 py-1 rounded-lg ml-2">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-white">{artist.rating}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                      {artist.genres.map((genre) => (
                        <span 
                          key={genre} 
                          className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs border border-purple-500/30"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span>{artist.bookings} réservations</span>
                    </div>

                    <Link 
                      to={`/dj/${artist.id}`}
                      className="btn-primary w-full text-center py-2 text-sm hover:scale-105 active:scale-95"
                    >
                      Voir le profil
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              // List View
              <Link 
                to={`/dj/${artist.id}`} 
                key={artist.id}
                className="card p-4 hover:shadow-glow transition-all duration-300 block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={artist.image} 
                      alt={artist.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-lg sm:text-xl font-bold text-white truncate">{artist.name}</h2>
                      <div className="flex items-center bg-dark-800/50 px-2 py-1 rounded-lg ml-2">
                        <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-white">{artist.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-400 text-sm mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{artist.location}</span>
                      <span className="mx-2">•</span>
                      <span>{artist.bookings} réservations</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {artist.genres.map((genre) => (
                        <span 
                          key={genre} 
                          className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            )
          ))}
        </div>

        {/* Empty State */}
        {filteredArtists.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-dark-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t('misc.noArtistsFound')}</h3>
                <p className="text-gray-400 mb-4">{t('misc.modifySearch')}</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedGenres([]);
              }}
              className="btn-primary px-6 py-2"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Artists;