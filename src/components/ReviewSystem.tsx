import React, { useState } from 'react';
import { Star, Camera, ThumbsUp, Flag, MoreHorizontal, Edit, Trash2, Image as ImageIcon } from 'lucide-react';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  djId: string;
  eventDate: string;
  eventType: string;
  ratings: {
    overall: number;
    musicQuality: number;
    professionalism: number;
    equipment: number;
    communication: number;
    punctuality: number;
  };
  comment: string;
  photos: string[];
  likes: number;
  isLiked: boolean;
  isReported: boolean;
  createdAt: string;
  isEditable?: boolean;
}

interface ReviewSystemProps {
  djId: string;
  reviews: Review[];
  onAddReview?: (review: Omit<Review, 'id' | 'createdAt' | 'likes' | 'isLiked' | 'isReported'>) => void;
  onEditReview?: (reviewId: string, review: Partial<Review>) => void;
  onDeleteReview?: (reviewId: string) => void;
  onLikeReview?: (reviewId: string) => void;
  onReportReview?: (reviewId: string) => void;
  currentUserId?: string;
  canAddReview?: boolean;
}

const ReviewSystem: React.FC<ReviewSystemProps> = ({
  djId,
  reviews,
  onAddReview,
  onEditReview,
  onDeleteReview,
  onLikeReview,
  onReportReview,
  currentUserId,
  canAddReview = false
}) => {
  const [showAddReview, setShowAddReview] = useState(false);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'helpful'>('recent');
  const [filterRating, setFilterRating] = useState<number>(0);

  // État pour le nouveau review
  const [newReview, setNewReview] = useState({
    eventDate: '',
    eventType: 'wedding',
    ratings: {
      overall: 0,
      musicQuality: 0,
      professionalism: 0,
      equipment: 0,
      communication: 0,
      punctuality: 0
    },
    comment: '',
    photos: [] as string[]
  });

  const eventTypes = [
    { value: 'wedding', label: 'Mariage' },
    { value: 'birthday', label: 'Anniversaire' },
    { value: 'corporate', label: 'Événement d\'entreprise' },
    { value: 'club', label: 'Club/Discothèque' },
    { value: 'festival', label: 'Festival' },
    { value: 'private', label: 'Événement privé' }
  ];

  const ratingCategories = [
    { key: 'overall', label: 'Note globale', icon: '⭐' },
    { key: 'musicQuality', label: 'Qualité musicale', icon: '🎵' },
    { key: 'professionalism', label: 'Professionnalisme', icon: '👔' },
    { key: 'equipment', label: 'Équipement', icon: '🎧' },
    { key: 'communication', label: 'Communication', icon: '💬' },
    { key: 'punctuality', label: 'Ponctualité', icon: '⏰' }
  ];

  // Calculer les moyennes des notes
  const averageRatings = reviews.length > 0 ? {
    overall: reviews.reduce((sum, r) => sum + r.ratings.overall, 0) / reviews.length,
    musicQuality: reviews.reduce((sum, r) => sum + r.ratings.musicQuality, 0) / reviews.length,
    professionalism: reviews.reduce((sum, r) => sum + r.ratings.professionalism, 0) / reviews.length,
    equipment: reviews.reduce((sum, r) => sum + r.ratings.equipment, 0) / reviews.length,
    communication: reviews.reduce((sum, r) => sum + r.ratings.communication, 0) / reviews.length,
    punctuality: reviews.reduce((sum, r) => sum + r.ratings.punctuality, 0) / reviews.length
  } : null;

  // Filtrer et trier les reviews
  const filteredAndSortedReviews = reviews
    .filter(review => filterRating === 0 || review.ratings.overall >= filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.ratings.overall - a.ratings.overall;
        case 'helpful':
          return b.likes - a.likes;
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const handleRatingChange = (category: keyof typeof newReview.ratings, rating: number) => {
    setNewReview(prev => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [category]: rating
      }
    }));
  };

  const handleSubmitReview = () => {
    if (onAddReview && newReview.ratings.overall > 0 && newReview.comment.trim()) {
      onAddReview({
        userId: currentUserId || 'current-user',
        userName: 'Utilisateur actuel',
        userAvatar: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=100',
        djId,
        ...newReview
      });
      
      // Reset form
      setNewReview({
        eventDate: '',
        eventType: 'wedding',
        ratings: {
          overall: 0,
          musicQuality: 0,
          professionalism: 0,
          equipment: 0,
          communication: 0,
          punctuality: 0
        },
        comment: '',
        photos: []
      });
      setShowAddReview(false);
    }
  };

  const renderStars = (rating: number, onRate?: (rating: number) => void, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRate?.(star)}
            disabled={!onRate}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-600'
            } ${onRate ? 'hover:text-yellow-400 cursor-pointer' : ''} transition-colors`}
          >
            <Star className="fill-current" />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Résumé des notes */}
      {averageRatings && (
        <div className="card">
          <h3 className="text-xl font-bold text-white mb-4">Évaluations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ratingCategories.map(({ key, label, icon }) => (
              <div key={key} className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{icon}</span>
                  <span className="text-sm text-gray-300">{label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {renderStars(averageRatings[key as keyof typeof averageRatings], undefined, 'sm')}
                  <span className="text-sm font-medium text-white">
                    {averageRatings[key as keyof typeof averageRatings].toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contrôles de tri et filtrage */}
      <div className="card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-white">
              Avis ({reviews.length})
            </h3>
            
            {/* Filtre par note */}
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(Number(e.target.value))}
              className="input-field text-sm"
            >
              <option value={0}>Toutes les notes</option>
              <option value={5}>5 étoiles</option>
              <option value={4}>4+ étoiles</option>
              <option value={3}>3+ étoiles</option>
              <option value={2}>2+ étoiles</option>
              <option value={1}>1+ étoile</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            {/* Tri */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="input-field text-sm"
            >
              <option value="recent">Plus récents</option>
              <option value="rating">Mieux notés</option>
              <option value="helpful">Plus utiles</option>
            </select>

            {/* Bouton ajouter un avis */}
            {canAddReview && (
              <button
                onClick={() => setShowAddReview(true)}
                className="btn-primary text-sm"
              >
                Laisser un avis
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Formulaire d'ajout d'avis */}
      {showAddReview && (
        <div className="card">
          <h4 className="text-lg font-semibold text-white mb-4">Laisser un avis</h4>
          
          <div className="space-y-4">
            {/* Informations sur l'événement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date de l'événement
                </label>
                <input
                  type="date"
                  value={newReview.eventDate}
                  onChange={(e) => setNewReview(prev => ({ ...prev, eventDate: e.target.value }))}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type d'événement
                </label>
                <select
                  value={newReview.eventType}
                  onChange={(e) => setNewReview(prev => ({ ...prev, eventType: e.target.value }))}
                  className="input-field w-full"
                >
                  {eventTypes.map(type => (
                    <option key={type.value} value={type.value} className="bg-dark-800">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes par catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Évaluations détaillées
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ratingCategories.map(({ key, label, icon }) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{icon}</span>
                      <span className="text-sm text-gray-300">{label}</span>
                    </div>
                    {renderStars(
                      newReview.ratings[key as keyof typeof newReview.ratings],
                      (rating) => handleRatingChange(key as keyof typeof newReview.ratings, rating)
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Commentaire */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Votre avis
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Partagez votre expérience avec ce DJ..."
                rows={4}
                className="input-field w-full resize-none"
              />
            </div>

            {/* Photos */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Photos (optionnel)
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">
                  Glissez-déposez vos photos ici ou cliquez pour sélectionner
                </p>
                <button className="btn-secondary mt-2 text-sm">
                  Choisir des photos
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddReview(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={newReview.ratings.overall === 0 || !newReview.comment.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Publier l'avis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des avis */}
      <div className="space-y-4">
        {filteredAndSortedReviews.map((review) => (
          <div key={review.id} className="card">
            <div className="flex items-start space-x-4">
              {/* Avatar utilisateur */}
              <img
                src={review.userAvatar}
                alt={review.userName}
                className="w-12 h-12 rounded-full object-cover"
              />
              
              <div className="flex-1">
                {/* En-tête */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-white">{review.userName}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{eventTypes.find(t => t.value === review.eventType)?.label}</span>
                      {review.eventDate && (
                        <>
                          <span>•</span>
                          <span>{new Date(review.eventDate).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Menu actions */}
                  <div className="flex items-center space-x-2">
                    {review.isEditable && currentUserId === review.userId && (
                      <>
                        <button
                          onClick={() => setEditingReview(review.id)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteReview?.(review.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Note globale */}
                <div className="flex items-center space-x-2 mb-3">
                  {renderStars(review.ratings.overall)}
                  <span className="text-sm font-medium text-white">
                    {review.ratings.overall}/5
                  </span>
                </div>

                {/* Commentaire */}
                <p className="text-gray-300 mb-3">{review.comment}</p>

                {/* Photos */}
                {review.photos.length > 0 && (
                  <div className="flex space-x-2 mb-3">
                    {review.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center space-x-4 text-sm">
                  <button
                    onClick={() => onLikeReview?.(review.id)}
                    className={`flex items-center space-x-1 transition-colors ${
                      review.isLiked ? 'text-purple-400' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Utile ({review.likes})</span>
                  </button>
                  
                  <button
                    onClick={() => onReportReview?.(review.id)}
                    className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Flag className="w-4 h-4" />
                    <span>Signaler</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedReviews.length === 0 && (
        <div className="card text-center py-8">
          <Star className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Aucun avis trouvé</h3>
          <p className="text-gray-400">
            {filterRating > 0 
              ? `Aucun avis avec ${filterRating}+ étoiles`
              : 'Soyez le premier à laisser un avis pour ce DJ'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewSystem;