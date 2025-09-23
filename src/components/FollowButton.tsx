import React, { useState } from 'react';
import { UserPlus, UserCheck } from 'lucide-react';
import { useSocial } from '../contexts/SocialContext';
import { useAuth } from '../contexts/AuthContext';

interface FollowButtonProps {
  djId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'icon';
  onAuthRequired?: () => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  djId,
  className = '',
  size = 'md',
  variant = 'button',
  onAuthRequired
}) => {
  const { followDJ, unfollowDJ, getDJStats } = useSocial();
  const { isAuthenticated } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);

  const stats = getDJStats(djId);

  const handleFollow = () => {
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (stats.isFollowedByUser) {
      unfollowDJ(djId);
    } else {
      followDJ(djId);
    }
  };

  const sizeClasses = {
    sm: variant === 'icon' ? 'w-4 h-4' : 'px-3 py-1 text-xs',
    md: variant === 'icon' ? 'w-5 h-5' : 'px-4 py-2 text-sm',
    lg: variant === 'icon' ? 'w-6 h-6' : 'px-6 py-3 text-base'
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleFollow}
        className={`
          p-2 rounded-full transition-all duration-200 
          ${stats.isFollowedByUser 
            ? 'text-purple-500 bg-purple-500/10 hover:bg-purple-500/20' 
            : 'text-gray-400 hover:text-purple-500 hover:bg-purple-500/10'
          }
          ${isAnimating ? 'scale-110' : 'scale-100'}
          focus:outline-none focus:ring-2 focus:ring-purple-500/20
          ${className}
        `}
        title={stats.isFollowedByUser ? 'Ne plus suivre' : 'Suivre ce DJ'}
      >
        {stats.isFollowedByUser ? (
          <UserCheck className={iconSizeClasses[size]} />
        ) : (
          <UserPlus className={iconSizeClasses[size]} />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleFollow}
      className={`
        ${sizeClasses[size]}
        rounded-lg font-medium transition-all duration-200 
        ${stats.isFollowedByUser 
          ? 'bg-purple-600 text-white hover:bg-purple-700' 
          : 'bg-transparent border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white'
        }
        ${isAnimating ? 'scale-105' : 'scale-100'}
        focus:outline-none focus:ring-2 focus:ring-purple-500/20
        flex items-center justify-center space-x-2
        ${className}
      `}
    >
      {stats.isFollowedByUser ? (
        <>
          <UserCheck className={iconSizeClasses[size]} />
          <span>Suivi</span>
        </>
      ) : (
        <>
          <UserPlus className={iconSizeClasses[size]} />
          <span>Suivre</span>
        </>
      )}
    </button>
  );
};

export default FollowButton;