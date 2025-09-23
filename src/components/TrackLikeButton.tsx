import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useSocial } from '../contexts/SocialContext';
import { useAuth } from '../contexts/AuthContext';

interface TrackLikeButtonProps {
  trackId: string;
  djId: string;
  className?: string;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onAuthRequired?: () => void;
}

const TrackLikeButton: React.FC<TrackLikeButtonProps> = ({
  trackId,
  djId,
  className = '',
  showCount = true,
  size = 'md',
  onAuthRequired
}) => {
  const { likeTrack, unlikeTrack, getTrackStats } = useSocial();
  const { isAuthenticated } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);

  const stats = getTrackStats(trackId);

  const handleLike = () => {
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (stats.isLikedByUser) {
      unlikeTrack(trackId);
    } else {
      likeTrack(trackId, djId);
    }
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const buttonSizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <button
        onClick={handleLike}
        className={`
          ${buttonSizeClasses[size]}
          rounded-full transition-all duration-200 
          ${stats.isLikedByUser 
            ? 'text-red-500 hover:text-red-400' 
            : 'text-gray-400 hover:text-red-500'
          }
          ${isAnimating ? 'scale-125' : 'scale-100'}
          hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500/20
        `}
        title={stats.isLikedByUser ? 'Retirer le like' : 'Liker ce morceau'}
      >
        <Heart 
          className={`${sizeClasses[size]} transition-all duration-200 ${
            stats.isLikedByUser ? 'fill-current' : ''
          }`}
        />
      </button>
      
      {showCount && (
        <span className={`
          ${textSizeClasses[size]} 
          ${stats.likesCount > 0 ? 'text-gray-300' : 'text-gray-500'}
          font-medium
        `}>
          {stats.likesCount}
        </span>
      )}
    </div>
  );
};

export default TrackLikeButton;