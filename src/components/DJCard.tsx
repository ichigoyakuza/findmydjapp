import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Users, Calendar, Play, Heart, Edit } from 'lucide-react';
import RoleGuard from './RoleGuard';

interface DJ {
  id: string;
  name: string;
  city: string;
  genres: string[];
  rating: number;
  bookings: number;
  image: string;
  isAvailable: boolean;
}

interface DJCardProps {
  dj: DJ;
}

const DJCard: React.FC<DJCardProps> = ({ dj }) => {
  return (
    <div className="group">
      <div className="card hover:border-purple-500/50 hover:shadow-glow transform hover:-translate-y-1 will-change-transform">
        {/* DJ Image */}
        <div className="relative h-40 sm:h-48 md:h-52 overflow-hidden rounded-t-2xl">
          <img
            src={dj.image}
            alt={dj.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-transparent to-transparent"></div>
          
          {/* Availability Badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
              dj.isAvailable 
                ? 'bg-green-500/30 text-green-300 border border-green-400/50' 
                : 'bg-red-500/30 text-red-300 border border-red-400/50'
            }`}>
              {dj.isAvailable ? 'Disponible' : 'Occupé'}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="p-2 bg-dark-900/80 backdrop-blur-sm rounded-full text-white hover:bg-purple-500/80 transition-colors duration-200">
              <Play className="w-4 h-4" />
            </button>
            <button className="p-2 bg-dark-900/80 backdrop-blur-sm rounded-full text-white hover:bg-red-500/80 transition-colors duration-200">
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* DJ Info */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-gradient transition-all duration-300 truncate">
                {dj.name}
              </h3>
              
              <div className="flex items-center text-gray-400 text-sm">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                <span className="truncate">{dj.city}</span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center bg-dark-800/50 px-2 py-1 rounded-lg ml-2">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-white">{dj.rating}</span>
            </div>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
            {dj.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs border border-purple-500/30 truncate"
              >
                {genre}
              </span>
            ))}
            {dj.genres.length > 2 && (
              <span className="px-2 py-1 bg-dark-700/50 text-gray-400 rounded-lg text-xs">
                +{dj.genres.length - 2}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
            <div className="flex items-center">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span>{dj.bookings} réservations</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span>Dispo</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link 
              to={`/dj/${dj.id}`}
              className="flex-1 btn-primary text-center py-2 px-3 text-sm hover:scale-105 active:scale-95"
            >
              Voir le profil
            </Link>
            
            {/* Bouton d'édition réservé au propriétaire du profil */}
            <RoleGuard 
              resource="profile" 
              action="edit" 
              resourceId={dj.id}
              fallback={
                <button className="btn-secondary px-3 py-2 text-sm hover:scale-105 active:scale-95">
                  <Heart className="w-4 h-4" />
                </button>
              }
            >
              <Link 
                to={`/dashboard`}
                className="btn-secondary px-3 py-2 text-sm hover:scale-105 active:scale-95 flex items-center"
              >
                <Edit className="w-4 h-4" />
              </Link>
            </RoleGuard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DJCard;