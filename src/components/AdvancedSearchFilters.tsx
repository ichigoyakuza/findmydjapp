import React, { useState } from 'react';
import { Search, MapPin, Music, DollarSign, Calendar, Star, Filter, X, ChevronDown } from 'lucide-react';

interface SearchFilters {
  location: {
    city: string;
    radius: number;
  };
  genres: string[];
  priceRange: {
    min: number;
    max: number;
  };
  availability: {
    date: string;
    timeSlot: string;
  };
  rating: number;
  experience: string;
  equipment: string[];
  eventType: string;
}

interface AdvancedSearchFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const genres = ['House', 'Techno', 'Hip-Hop', 'EDM', 'Reggae', 'Latin', 'Rock', 'Kizomba', 'Salsa', 'Bachata'];
  const experiences = ['any', 'beginner', 'intermediate', 'professional', 'expert'];
  const equipmentOptions = ['DJ Controller', 'Turntables', 'Mixer', 'Speakers', 'Microphone', 'Lighting'];
  const eventTypes = ['any', 'wedding', 'birthday', 'corporate', 'club', 'festival', 'private'];
  const timeSlots = ['any', 'morning', 'afternoon', 'evening', 'night'];

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    onFiltersChange(updatedFilters);
  };

  const handleGenreToggle = (genre: string) => {
    const newGenres = filters.genres.includes(genre)
      ? filters.genres.filter(g => g !== genre)
      : [...filters.genres, genre];
    updateFilters({ genres: newGenres });
  };

  const handleEquipmentToggle = (equipment: string) => {
    const newEquipment = filters.equipment.includes(equipment)
      ? filters.equipment.filter(e => e !== equipment)
      : [...filters.equipment, equipment];
    updateFilters({ equipment: newEquipment });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      location: { city: '', radius: 50 },
      genres: [],
      priceRange: { min: 0, max: 5000 },
      availability: { date: '', timeSlot: 'any' },
      rating: 0,
      experience: 'any',
      equipment: [],
      eventType: 'any'
    });
    onSearchChange('');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (filters.location.city) count++;
    if (filters.genres.length > 0) count++;
    if (filters.priceRange.min > 0 || filters.priceRange.max < 5000) count++;
    if (filters.availability.date) count++;
    if (filters.rating > 0) count++;
    if (filters.experience !== 'any') count++;
    if (filters.equipment.length > 0) count++;
    if (filters.eventType !== 'any') count++;
    return count;
  };

  return (
    <div className="card">
      {/* Barre de recherche principale */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher des DJs par nom, style musical..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field w-full pl-10"
          />
        </div>
        
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="btn-secondary flex items-center space-x-2 whitespace-nowrap"
        >
          <Filter className="w-4 h-4" />
          <span>Filtres avancés</span>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-purple-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
              {getActiveFiltersCount()}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filtres avancés */}
      {showAdvanced && (
        <div className="space-y-6 pt-4 border-t border-gray-700 animate-slide-down">
          {/* Localisation et Prix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Localisation */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Localisation
              </label>
              <input
                type="text"
                placeholder="Ville ou code postal"
                value={filters.location.city}
                onChange={(e) => updateFilters({ location: { ...filters.location, city: e.target.value } })}
                className="input-field w-full"
              />
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Rayon de recherche: {filters.location.radius} km</label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={filters.location.radius}
                  onChange={(e) => updateFilters({ location: { ...filters.location, radius: parseInt(e.target.value) } })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>

            {/* Prix */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Fourchette de prix
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400">Min</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.priceRange.min}
                    onChange={(e) => updateFilters({ priceRange: { ...filters.priceRange, min: parseInt(e.target.value) || 0 } })}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Max</label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={filters.priceRange.max}
                    onChange={(e) => updateFilters({ priceRange: { ...filters.priceRange, max: parseInt(e.target.value) || 5000 } })}
                    className="input-field w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Genres musicaux */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300 flex items-center">
              <Music className="w-4 h-4 mr-2" />
              Genres musicaux
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {genres.map((genre) => (
                <label key={genre} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.genres.includes(genre)}
                    onChange={() => handleGenreToggle(genre)}
                    className="w-4 h-4 text-purple-600 bg-dark-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-300">{genre}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Disponibilité et Note */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Disponibilité */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Disponibilité
              </label>
              <input
                type="date"
                value={filters.availability.date}
                onChange={(e) => updateFilters({ availability: { ...filters.availability, date: e.target.value } })}
                className="input-field w-full"
              />
              <select
                value={filters.availability.timeSlot}
                onChange={(e) => updateFilters({ availability: { ...filters.availability, timeSlot: e.target.value } })}
                className="input-field w-full"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot} className="bg-dark-800">
                    {slot === 'any' ? 'Toute la journée' : 
                     slot === 'morning' ? 'Matin (6h-12h)' :
                     slot === 'afternoon' ? 'Après-midi (12h-18h)' :
                     slot === 'evening' ? 'Soirée (18h-24h)' : 'Nuit (24h-6h)'}
                  </option>
                ))}
              </select>
            </div>

            {/* Note minimale */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Note minimale
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => updateFilters({ rating: rating === filters.rating ? 0 : rating })}
                    className={`p-1 rounded transition-colors ${
                      rating <= filters.rating ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'
                    }`}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
                <span className="text-sm text-gray-400 ml-2">
                  {filters.rating > 0 ? `${filters.rating}+ étoiles` : 'Toutes les notes'}
                </span>
              </div>
            </div>
          </div>

          {/* Expérience et Type d'événement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Expérience */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">
                Niveau d'expérience
              </label>
              <select
                value={filters.experience}
                onChange={(e) => updateFilters({ experience: e.target.value })}
                className="input-field w-full"
              >
                {experiences.map((exp) => (
                  <option key={exp} value={exp} className="bg-dark-800">
                    {exp === 'any' ? 'Tous niveaux' :
                     exp === 'beginner' ? 'Débutant' :
                     exp === 'intermediate' ? 'Intermédiaire' :
                     exp === 'professional' ? 'Professionnel' : 'Expert'}
                  </option>
                ))}
              </select>
            </div>

            {/* Type d'événement */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">
                Type d'événement
              </label>
              <select
                value={filters.eventType}
                onChange={(e) => updateFilters({ eventType: e.target.value })}
                className="input-field w-full"
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type} className="bg-dark-800">
                    {type === 'any' ? 'Tous types' :
                     type === 'wedding' ? 'Mariage' :
                     type === 'birthday' ? 'Anniversaire' :
                     type === 'corporate' ? 'Événement d\'entreprise' :
                     type === 'club' ? 'Club/Discothèque' :
                     type === 'festival' ? 'Festival' : 'Événement privé'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Équipement */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Équipement disponible
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {equipmentOptions.map((equipment) => (
                <label key={equipment} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.equipment.includes(equipment)}
                    onChange={() => handleEquipmentToggle(equipment)}
                    className="w-4 h-4 text-purple-600 bg-dark-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-300">{equipment}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-700">
            <button
              onClick={clearAllFilters}
              className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Effacer tous les filtres</span>
            </button>
            
            <div className="text-sm text-gray-400">
              {getActiveFiltersCount()} filtre(s) actif(s)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchFilters;