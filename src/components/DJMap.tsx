import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Search, Filter, MapPin, Calendar, Music, User, Star, Navigation, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Icône personnalisée pour la position de l'utilisateur
const userLocationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
      <circle cx="12" cy="12" r="10" fill="#3B82F6" stroke="white" stroke-width="3"/>
      <circle cx="12" cy="12" r="3" fill="white"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

// Fonction pour calculer la distance entre deux points (en km)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Types pour les DJs
interface DJ {
  id: string;
  name: string;
  city: string;
  coordinates: [number, number];
  styles: string[];
  profileImage: string;
  rating: number;
  isAvailable: boolean;
  availableDates: string[];
  price: string;
  description: string;
}

// Données fictives de test
const mockDJs: DJ[] = [
  {
    id: '1',
    name: 'DJ Kizomba King',
    city: 'Paris',
    coordinates: [48.8566, 2.3522],
    styles: ['Kizomba', 'Afro'],
    profileImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=face',
    rating: 4.8,
    isAvailable: true,
    availableDates: ['2024-01-20', '2024-01-21'],
    price: '150€/h',
    description: 'Spécialiste Kizomba et musiques africaines'
  },
  {
    id: '2',
    name: 'DJ Electro Pulse',
    city: 'Paris',
    coordinates: [48.8606, 2.3376],
    styles: ['Electro', 'Techno'],
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 4.6,
    isAvailable: false,
    availableDates: ['2024-01-25'],
    price: '200€/h',
    description: 'Expert en musique électronique'
  },
  {
    id: '3',
    name: 'DJ Afro Vibes',
    city: 'Marseille',
    coordinates: [43.2965, 5.3698],
    styles: ['Afro', 'Dancehall'],
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 4.9,
    isAvailable: true,
    availableDates: ['2024-01-19', '2024-01-20', '2024-01-21'],
    price: '120€/h',
    description: 'Ambiance afro et dancehall garantie'
  },
  {
    id: '4',
    name: 'DJ House Master',
    city: 'Lyon',
    coordinates: [45.7640, 4.8357],
    styles: ['House', 'Deep House'],
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    rating: 4.7,
    isAvailable: true,
    availableDates: ['2024-01-22', '2024-01-23'],
    price: '180€/h',
    description: 'Maître de la house music'
  },
  {
    id: '5',
    name: 'DJ Latin Fire',
    city: 'Paris',
    coordinates: [48.8738, 2.2950],
    styles: ['Salsa', 'Reggaeton'],
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    rating: 4.5,
    isAvailable: true,
    availableDates: ['2024-01-20', '2024-01-21', '2024-01-22'],
    price: '140€/h',
    description: 'Spécialiste musiques latines'
  },
  {
    id: '6',
    name: 'DJ Bachata Soul',
    city: 'Nice',
    coordinates: [43.7102, 7.2620],
    styles: ['Bachata', 'Salsa'],
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 4.7,
    isAvailable: true,
    availableDates: ['2024-01-19', '2024-01-20', '2024-01-23'],
    price: '130€/h',
    description: 'Expert en bachata sensuelle et salsa'
  }
];

// Icônes personnalisées par style musical
// Composant pour centrer la carte sur la position de l'utilisateur
const MapController: React.FC<{ userLocation: [number, number] | null }> = ({ userLocation }) => {
  const map = useMap();
  
  useEffect(() => {
    if (userLocation) {
      map.setView(userLocation, 12); // Zoom plus proche quand on a la position
    }
  }, [userLocation, map]);
  
  return null;
};

const getMarkerIcon = (styles: string[], isAvailable: boolean) => {
  const primaryStyle = styles[0]?.toLowerCase();
  let color = '#3B82F6'; // Bleu par défaut
  
  switch (primaryStyle) {
    case 'kizomba':
    case 'afro':
      color = '#EF4444'; // Rouge
      break;
    case 'electro':
    case 'techno':
      color = '#8B5CF6'; // Violet
      break;
    case 'house':
      color = '#10B981'; // Vert
      break;
    case 'salsa':
    case 'reggaeton':
      color = '#F59E0B'; // Orange
      break;
  }
  
  const opacity = isAvailable ? 1 : 0.6;
  
  return L.divIcon({
    html: `<div style="background-color: ${color}; opacity: ${opacity}; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
             <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%; ${isAvailable ? 'animation: pulse 2s infinite;' : ''}"></div>
           </div>
           <style>
             @keyframes pulse {
               0% { transform: scale(1); opacity: 1; }
               50% { transform: scale(1.2); opacity: 0.7; }
               100% { transform: scale(1); opacity: 1; }
             }
           </style>`,
    className: 'custom-marker',
    iconSize: [25, 25],
    iconAnchor: [12, 12]
  });
};

const DJMap: React.FC = () => {
  const { t } = useLanguage();
  const [filteredDJs, setFilteredDJs] = useState<DJ[]>(mockDJs);
  const [searchCity, setSearchCity] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [showMobileList, setShowMobileList] = useState(false);
  
  // États pour la géolocalisation
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [nearbyDJs, setNearbyDJs] = useState<DJ[]>([]);
  const [maxDistance, setMaxDistance] = useState<number>(50); // Distance max en km

  // Styles musicaux uniques pour le filtre
  const allStyles = Array.from(new Set(mockDJs.flatMap(dj => dj.styles)));

  // Fonction pour obtenir la géolocalisation
  const getUserLocation = () => {
    setIsLoadingLocation(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('La géolocalisation n\'est pas supportée par ce navigateur.');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setIsLoadingLocation(false);
      },
      (error) => {
        let errorMessage = '';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permission de géolocalisation refusée. Vous pouvez l\'activer dans les paramètres de votre navigateur.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Position non disponible.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Délai d\'attente dépassé pour obtenir la position.';
            break;
          default:
            errorMessage = 'Erreur inconnue lors de la géolocalisation.';
            break;
        }
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Effet pour obtenir la position au chargement
  useEffect(() => {
    getUserLocation();
  }, []);

  // Effet pour calculer les DJs proches quand la position change
  useEffect(() => {
    if (userLocation) {
      const nearby = mockDJs.map(dj => ({
        ...dj,
        distance: calculateDistance(
          userLocation[0], 
          userLocation[1], 
          dj.coordinates[0], 
          dj.coordinates[1]
        )
      }))
      .filter(dj => dj.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);
      
      setNearbyDJs(nearby);
    }
  }, [userLocation, maxDistance]);

  // Filtrage des DJs
  useEffect(() => {
    let filtered = mockDJs;

    if (searchCity) {
      filtered = filtered.filter(dj => 
        dj.city.toLowerCase().includes(searchCity.toLowerCase())
      );
    }

    if (selectedStyle) {
      filtered = filtered.filter(dj => 
        dj.styles.includes(selectedStyle)
      );
    }

    if (availabilityFilter === 'available') {
      filtered = filtered.filter(dj => dj.isAvailable);
    } else if (availabilityFilter === 'weekend') {
      const today = new Date();
      const weekend = new Date(today);
      weekend.setDate(today.getDate() + (6 - today.getDay())); // Prochain samedi
      
      filtered = filtered.filter(dj => 
        dj.availableDates.some(date => {
          const djDate = new Date(date);
          return djDate >= weekend && djDate <= new Date(weekend.getTime() + 2 * 24 * 60 * 60 * 1000);
        })
      );
    }

    setFilteredDJs(filtered);
  }, [searchCity, selectedStyle, availabilityFilter]);

  return (
    <div className="h-screen flex flex-col">
      {/* Barre de recherche et filtres */}
      <div className="bg-white shadow-lg p-4 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <MapPin className="mr-2 text-blue-600" />
              {t('map.title') || 'Carte des DJs'}
            </h1>
            
            {/* Statut de géolocalisation */}
            <div className="flex items-center space-x-2">
              {isLoadingLocation && (
                <div className="flex items-center text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm">Localisation...</span>
                </div>
              )}
              
              {userLocation && !isLoadingLocation && (
                <div className="flex items-center text-green-600">
                  <Navigation className="w-4 h-4 mr-1" />
                  <span className="text-sm">Position trouvée</span>
                </div>
              )}
              
              {locationError && (
                <div className="flex items-center text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">Erreur de localisation</span>
                </div>
              )}
              
              <button
                onClick={getUserLocation}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                disabled={isLoadingLocation}
              >
                📍 Ma position
              </button>
            </div>
          </div>
          
          {/* Message d'erreur de géolocalisation */}
          {locationError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{locationError}</p>
            </div>
          )}
          
          {/* Informations sur les DJs proches */}
          {userLocation && nearbyDJs.length > 0 && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">
                📍 {nearbyDJs.length} DJ{nearbyDJs.length > 1 ? 's' : ''} trouvé{nearbyDJs.length > 1 ? 's' : ''} dans un rayon de {maxDistance}km
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Recherche par ville */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('map.searchCity') || 'Rechercher une ville...'}
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtre par style */}
            <div className="relative">
              <Music className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">{t('map.allStyles') || 'Tous les styles'}</option>
                {allStyles.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>

            {/* Filtre par disponibilité */}
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">{t('map.allAvailability') || 'Toute disponibilité'}</option>
                <option value="available">{t('map.availableNow') || 'Disponible maintenant'}</option>
                <option value="weekend">{t('map.thisWeekend') || 'Ce week-end'}</option>
              </select>
            </div>
            
            {/* Filtre distance (visible seulement si géolocalisation active) */}
            {userLocation && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distance max: {maxDistance}km
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}

            {/* Bouton liste mobile */}
            <button
              onClick={() => setShowMobileList(!showMobileList)}
              className="md:hidden flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Filter className="mr-2 h-4 w-4" />
              {showMobileList ? 'Voir la carte' : 'Voir la liste'}
            </button>
          </div>

          {/* Compteur de résultats */}
          <div className="mt-3 text-sm text-gray-600">
            {filteredDJs.length} DJ{filteredDJs.length > 1 ? 's' : ''} trouvé{filteredDJs.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Conteneur carte + liste mobile */}
      <div className="flex-1 relative">
        {/* Carte */}
        <div className={`h-full ${showMobileList ? 'hidden md:block' : ''}`}>
          <MapContainer
            center={userLocation || [46.603354, 1.888334]} // Centre sur l'utilisateur ou la France
            zoom={userLocation ? 12 : 6}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Contrôleur pour centrer la carte sur l'utilisateur */}
            <MapController userLocation={userLocation} />
            
            {/* Marqueur de position de l'utilisateur */}
            {userLocation && (
              <Marker position={userLocation} icon={userLocationIcon}>
                <Popup>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Navigation className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="font-semibold">Votre position</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {nearbyDJs.length} DJ{nearbyDJs.length > 1 ? 's' : ''} dans un rayon de {maxDistance}km
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
            
            {filteredDJs.map((dj) => (
              <Marker
                key={dj.id}
                position={dj.coordinates}
                icon={getMarkerIcon(dj.styles, dj.isAvailable)}
              >
                <Popup className="custom-popup">
                  <div className="p-2 w-full max-w-[280px] sm:min-w-[250px]">
                    <div className="flex items-start space-x-3">
                      <img
                        src={dj.profileImage}
                        alt={dj.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900">{dj.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {dj.city}
                          {userLocation && (
                            <span className="ml-2 text-blue-600 font-medium">
                              • {calculateDistance(
                                userLocation[0], 
                                userLocation[1], 
                                dj.coordinates[0], 
                                dj.coordinates[1]
                              ).toFixed(1)}km
                            </span>
                          )}
                        </p>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{dj.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {dj.styles.map(style => (
                          <span
                            key={style}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {style}
                          </span>
                        ))}
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">{dj.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-green-600">{dj.price}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          dj.isAvailable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {dj.isAvailable ? 'Disponible' : 'Occupé'}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2 mt-3">
                        <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                          Voir le profil
                        </button>
                        <button className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                          Booker
                        </button>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Liste mobile */}
        <div className={`h-full overflow-y-auto bg-gray-50 ${showMobileList ? 'block md:hidden' : 'hidden'}`}>
          <div className="p-4 space-y-4">
            {filteredDJs.map((dj) => (
              <div key={dj.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={dj.profileImage}
                    alt={dj.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{dj.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {dj.city}
                    </p>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{dj.rating}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-green-600">{dj.price}</span>
                    <span className={`block px-2 py-1 text-xs rounded-full mt-1 ${
                      dj.isAvailable 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {dj.isAvailable ? 'Disponible' : 'Occupé'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {dj.styles.map(style => (
                      <span
                        key={style}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {style}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{dj.description}</p>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                      Voir le profil
                    </button>
                    <button className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                      Booker
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DJMap;