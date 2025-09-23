import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Music, Star, Users, Filter, Sparkles, TrendingUp, UserPlus } from 'lucide-react';
import DJCard from '../components/DJCard';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';
import AdvancedSearchFilters from '../components/AdvancedSearchFilters';

const Discovery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  
  // États pour les filtres avancés
  const [filters, setFilters] = useState({
    location: { city: '', radius: 50 },
    genres: [] as string[],
    priceRange: { min: 0, max: 5000 },
    availability: { date: '', timeSlot: 'any' },
    rating: 0,
    experience: 'any',
    equipment: [] as string[],
    eventType: 'any'
  });
  
  const { user } = useAuth();

  const mockDJs = [
    {
      id: '1',
      name: 'DJ Nexus',
      city: 'Miami, FL',
      genres: ['House', 'Techno'],
      rating: 4.9,
      bookings: 127,
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
      isAvailable: true,
    },
    {
      id: '2',
      name: 'Luna Beats',
      city: 'Los Angeles, CA',
      genres: ['EDM', 'Progressive'],
      rating: 4.8,
      bookings: 89,
      image: 'https://images.pexels.com/photos/1708936/pexels-photo-1708936.jpeg?auto=compress&cs=tinysrgb&w=400',
      isAvailable: true,
    },
    {
      id: '3',
      name: 'Bass Master',
      city: 'New York, NY',
      genres: ['Hip-Hop', 'Trap'],
      rating: 4.7,
      bookings: 156,
      image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
      isAvailable: false,
    },
    {
      id: '4',
      name: 'Rhythm Queen',
      city: 'Chicago, IL',
      genres: ['Latin', 'Reggaeton'],
      rating: 4.9,
      bookings: 203,
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
      isAvailable: true,
    },
    {
      id: '5',
      name: 'Electric Storm',
      city: 'Austin, TX',
      genres: ['Rock', 'Electronic'],
      rating: 4.6,
      bookings: 78,
      image: 'https://images.pexels.com/photos/1708936/pexels-photo-1708936.jpeg?auto=compress&cs=tinysrgb&w=400',
      isAvailable: true,
    },
    {
      id: '6',
      name: 'Vinyl Virtuoso',
      city: 'San Francisco, CA',
      genres: ['House', 'Deep House'],
      rating: 4.8,
      bookings: 145,
      image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
      isAvailable: true,
    },
    {
      id: '7',
      name: 'DJ Kizomba Flow',
      city: 'Paris, FR',
      genres: ['Kizomba', 'Afro'],
      rating: 4.9,
      bookings: 98,
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
      isAvailable: true,
    },
    {
      id: '8',
      name: 'Salsa Queen',
      city: 'Barcelona, ES',
      genres: ['Salsa', 'Latin'],
      rating: 4.7,
      bookings: 134,
      image: 'https://images.pexels.com/photos/1708936/pexels-photo-1708936.jpeg?auto=compress&cs=tinysrgb&w=400',
      isAvailable: true,
    },
    {
      id: '9',
      name: 'Bachata Soul',
      city: 'Miami, FL',
      genres: ['Bachata', 'Salsa'],
      rating: 4.8,
      bookings: 112,
      image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
      isAvailable: true,
    },
  ];

  // Filter DJs based on advanced criteria
  const filteredDJs = mockDJs.filter(dj => {
    // Recherche par terme
    const matchesSearch = searchTerm === '' || 
      dj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dj.genres.some(genre => genre.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtrage par genres
    const matchesGenre = filters.genres.length === 0 || 
      filters.genres.some(selectedGenre => 
        dj.genres.some(djGenre => djGenre.toLowerCase() === selectedGenre.toLowerCase())
      );
    
    // Filtrage par localisation
    const matchesLocation = !filters.location.city || 
      dj.city.toLowerCase().includes(filters.location.city.toLowerCase());
    
    // Filtrage par note (simulé)
    const matchesRating = filters.rating === 0 || dj.rating >= filters.rating;
    
    // Filtrage par disponibilité (simulé - tous les DJs sont considérés disponibles pour la démo)
    const matchesAvailability = !filters.availability.date || dj.isAvailable;
    
    return matchesSearch && matchesGenre && matchesLocation && matchesRating && matchesAvailability;
  });

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero Section */}
      <div className="relative py-12 md:py-20 px-4 text-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-primary-500/10 to-purple-600/5"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl animate-float"></div>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-purple-400 mr-2 animate-bounce-gentle" />
            <span className="text-purple-400 font-semibold text-sm md:text-base uppercase tracking-wider">
              Découvrez les meilleurs DJs
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Trouvez votre{' '}
            <span className="text-gradient animate-pulse-glow">
              DJ parfait
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Connectez-vous avec des DJs talentueux, écoutez leur musique et réservez-les pour votre prochain événement
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/map" 
              className="btn-primary flex items-center space-x-2 w-full sm:w-auto"
            >
              <MapPin className="w-5 h-5" />
              <span>Explorer la carte</span>
            </Link>
            <Link 
              to="/events" 
              className="btn-secondary flex items-center space-x-2 w-full sm:w-auto"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Événements populaires</span>
            </Link>
          </div>
          
          {/* Section d'inscription prominente */}
          {!user && (
            <div className="mt-12 max-w-md mx-auto">
              <div className="card bg-gradient-to-br from-purple-500/10 to-primary-500/10 border border-purple-500/20 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Rejoignez FindMyDJ
                  </h3>
                  <p className="text-gray-300 mb-6 text-sm">
                    Créez votre compte pour réserver des DJs, gérer vos événements et découvrir de nouveaux talents
                  </p>
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setAuthModalOpen(true);
                    }}
                    className="btn-primary w-full flex items-center justify-center space-x-2 mb-3"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>S'inscrire gratuitement</span>
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setAuthModalOpen(true);
                    }}
                    className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
                  >
                    Déjà membre ? Se connecter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search and Advanced Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-12">
        <AdvancedSearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>

      {/* DJ Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-20">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            DJs disponibles
          </h2>
          <p className="text-gray-400">
            {filteredDJs.length} DJs trouvés dans votre région
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {filteredDJs.map((dj, index) => (
            <div 
              key={dj.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <DJCard dj={dj} />
            </div>
          ))}
        </div>
      </div>
      
      {/* AuthModal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </div>
  );
};

export default Discovery;