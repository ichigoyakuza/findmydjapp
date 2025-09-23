import React, { useState } from 'react';
import { Star, MessageCircle, Send, Calendar } from 'lucide-react';
import { useSocial } from '../contexts/SocialContext';
import { useAuth } from '../contexts/AuthContext';

interface ReviewsSectionProps {
  djId: string;
  onAuthRequired?: () => void;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ djId, onAuthRequired }) => {
  const { addReview, getDJReviews, getDJStats } = useSocial();
  const { isAuthenticated } = useAuth();
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  const reviews = getDJReviews(djId);
  const stats = getDJStats(djId);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }

    if (newReview.comment.trim()) {
      addReview(djId, newReview.rating, newReview.comment.trim());
      setNewReview({ rating: 5, comment: '' });
      setShowAddReview(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => onRatingChange?.(star) : undefined}
            className={`
              ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
              transition-all duration-200
            `}
            disabled={!interactive}
          >
            <Star
              className={`w-4 h-4 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-400'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Avis ({stats.reviewsCount})
          </h3>
          {stats.averageRating > 0 && (
            <div className="flex items-center space-x-2">
              {renderStars(Math.round(stats.averageRating))}
              <span className="text-yellow-400 font-medium">
                {stats.averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        
        <button
          onClick={() => {
            if (!isAuthenticated) {
              onAuthRequired?.();
              return;
            }
            setShowAddReview(!showAddReview);
          }}
          className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-cyan-700 transition-all"
        >
          Laisser un avis
        </button>
      </div>

      {/* Formulaire d'ajout d'avis */}
      {showAddReview && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Note
              </label>
              {renderStars(newReview.rating, true, (rating) => 
                setNewReview(prev => ({ ...prev, rating }))
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Commentaire
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Partagez votre expérience avec ce DJ..."
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
                required
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Publier
              </button>
              <button
                type="button"
                onClick={() => setShowAddReview(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des avis */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucun avis pour le moment</p>
            <p className="text-sm">Soyez le premier à laisser un avis !</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start space-x-3">
                <img
                  src={review.userAvatar}
                  alt={review.userName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-white">{review.userName}</h4>
                      <div className="flex items-center space-x-2">
                        {renderStars(review.rating)}
                        <span className="text-xs text-gray-400 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;