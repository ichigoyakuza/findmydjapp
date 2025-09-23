import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { mockReviews, mockSocialData, mockTracks, mockUsers, MockUser } from '../data/mockData';

export interface Like {
  id: string;
  userId: string;
  trackId: string;
  djId: string;
  createdAt: string;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface Review {
  id: string;
  djId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  isModerated: boolean;
}

export interface TrackStats {
  trackId: string;
  likesCount: number;
  isLikedByUser: boolean;
}

export interface DJStats {
  djId: string;
  followersCount: number;
  isFollowedByUser: boolean;
  averageRating: number;
  reviewsCount: number;
}

export interface SocialContextType {
  // Likes
  likeTrack: (trackId: string, djId: string) => void;
  unlikeTrack: (trackId: string) => void;
  getTrackStats: (trackId: string) => TrackStats;
  getTopLikedTracks: () => Array<{ trackId: string; djId: string; likesCount: number }>;
  
  // Follows
  followDJ: (djId: string) => void;
  unfollowDJ: (djId: string) => void;
  getDJStats: (djId: string) => DJStats;
  getUserFollowing: (userId: string) => string[];
  
  // Reviews
  addReview: (djId: string, rating: number, comment: string) => void;
  getDJReviews: (djId: string) => Review[];
  
  // Data
  likes: Like[];
  follows: Follow[];
  reviews: Review[];
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (context === undefined) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};

interface SocialProviderProps {
  children: ReactNode;
}

// Conversion des données mockData vers le format du contexte
const initialLikes: Like[] = mockSocialData.likes.map((like, index) => ({
  id: (index + 1).toString(),
  userId: like.userId,
  trackId: like.trackId,
  djId: mockTracks.find(track => track.id === like.trackId)?.djId || '1',
  createdAt: '2024-01-15'
}));

const initialFollows: Follow[] = mockSocialData.follows.map((follow, index) => ({
  id: (index + 1).toString(),
  followerId: follow.followerId,
  followingId: follow.followingId,
  createdAt: '2024-01-10'
}));

const initialReviews: Review[] = mockReviews.map(review => {
  const user = mockUsers.find((u: MockUser) => u.id === review.userId);
  return {
    id: review.id,
    userId: review.userId,
    djId: review.djId,
    userName: user?.name || 'Utilisateur inconnu',
    userAvatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    rating: review.rating,
    comment: review.comment,
    createdAt: review.date,
    isModerated: true
  };
});

export const SocialProvider: React.FC<SocialProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState<Like[]>(initialLikes);
  const [follows, setFollows] = useState<Follow[]>(initialFollows);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  // Likes functions
  const likeTrack = (trackId: string, djId: string) => {
    if (!user) return;
    
    const existingLike = likes.find(like => 
      like.userId === user.id && like.trackId === trackId
    );
    
    if (!existingLike) {
      const newLike: Like = {
        id: Date.now().toString(),
        userId: user.id,
        trackId,
        djId,
        createdAt: new Date().toISOString()
      };
      setLikes(prev => [...prev, newLike]);
    }
  };

  const unlikeTrack = (trackId: string) => {
    if (!user) return;
    
    setLikes(prev => prev.filter(like => 
      !(like.userId === user.id && like.trackId === trackId)
    ));
  };

  const getTrackStats = (trackId: string): TrackStats => {
    const trackLikes = likes.filter(like => like.trackId === trackId);
    const isLikedByUser = user ? trackLikes.some(like => like.userId === user.id) : false;
    
    return {
      trackId,
      likesCount: trackLikes.length,
      isLikedByUser
    };
  };

  const getTopLikedTracks = () => {
    const trackCounts = likes.reduce((acc, like) => {
      const key = `${like.trackId}-${like.djId}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(trackCounts)
      .map(([key, count]) => {
        const [trackId, djId] = key.split('-');
        return { trackId, djId, likesCount: count };
      })
      .sort((a, b) => b.likesCount - a.likesCount)
      .slice(0, 10);
  };

  // Follows functions
  const followDJ = (djId: string) => {
    if (!user) return;
    
    const existingFollow = follows.find(follow => 
      follow.followerId === user.id && follow.followingId === djId
    );
    
    if (!existingFollow) {
      const newFollow: Follow = {
        id: Date.now().toString(),
        followerId: user.id,
        followingId: djId,
        createdAt: new Date().toISOString()
      };
      setFollows(prev => [...prev, newFollow]);
    }
  };

  const unfollowDJ = (djId: string) => {
    if (!user) return;
    
    setFollows(prev => prev.filter(follow => 
      !(follow.followerId === user.id && follow.followingId === djId)
    ));
  };

  const getDJStats = (djId: string): DJStats => {
    const djFollows = follows.filter(follow => follow.followingId === djId);
    const isFollowedByUser = user ? djFollows.some(follow => follow.followerId === user.id) : false;
    
    const djReviews = reviews.filter(review => review.djId === djId && review.isModerated);
    const averageRating = djReviews.length > 0 
      ? djReviews.reduce((sum, review) => sum + review.rating, 0) / djReviews.length 
      : 0;
    
    return {
      djId,
      followersCount: djFollows.length,
      isFollowedByUser,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewsCount: djReviews.length
    };
  };

  const getUserFollowing = (userId: string): string[] => {
    return follows
      .filter(follow => follow.followerId === userId)
      .map(follow => follow.followingId);
  };

  // Reviews functions
  const addReview = (djId: string, rating: number, comment: string) => {
    if (!user) return;
    
    const newReview: Review = {
      id: Date.now().toString(),
      djId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating,
      comment,
      createdAt: new Date().toISOString(),
      isModerated: true // Auto-approuvé pour la démo
    };
    
    setReviews(prev => [...prev, newReview]);
  };

  const getDJReviews = (djId: string): Review[] => {
    return reviews
      .filter(review => review.djId === djId && review.isModerated)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const value: SocialContextType = {
    likeTrack,
    unlikeTrack,
    getTrackStats,
    getTopLikedTracks,
    followDJ,
    unfollowDJ,
    getDJStats,
    getUserFollowing,
    addReview,
    getDJReviews,
    likes,
    follows,
    reviews
  };

  return (
    <SocialContext.Provider value={value}>
      {children}
    </SocialContext.Provider>
  );
};