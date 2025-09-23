import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Clock, User, Send, ThumbsUp, Tag } from 'lucide-react';
import { mockForumPosts, mockForumReplies } from '../data/mockData';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [replyContent, setReplyContent] = useState('');

  // Trouver le post par ID
  const post = mockForumPosts.find(p => p.id === id);
  
  // Trouver les réponses pour ce post
  const replies = mockForumReplies.filter(r => r.postId === id);

  const [localReplies, setLocalReplies] = useState(replies);

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-purple-900/20 pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Post non trouvé</h1>
          <button
            onClick={() => navigate('/forum')}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Retour au forum
          </button>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      general: 'bg-blue-500',
      technique: 'bg-green-500',
      materiel: 'bg-purple-500',
      evenements: 'bg-orange-500',
      debutant: 'bg-pink-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      general: 'Général',
      technique: 'Technique',
      materiel: 'Matériel',
      evenements: 'Événements',
      debutant: 'Débutant'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    const newReply = {
      id: `reply-${Date.now()}`,
      postId: id!,
      content: replyContent,
      authorId: 'current-user',
      authorName: 'Utilisateur Actuel',
      authorAvatar: '/api/placeholder/40/40',
      createdAt: new Date().toISOString(),
      likes: 0
    };

    setLocalReplies([...localReplies, newReply]);
    setReplyContent('');
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Il y a moins d\'une heure';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Il y a ${diffInDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-purple-900/20 pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/forum')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au forum
          </button>
        </div>

        {/* Post principal */}
        <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 mb-8">
          {/* En-tête du post */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <img
                src={post.authorAvatar}
                alt={post.authorName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">{post.authorName}</h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  {formatTimeAgo(post.createdAt)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(post.category)}`}>
                {getCategoryLabel(post.category)}
              </span>
            </div>
          </div>

          {/* Titre et contenu */}
          <h1 className="text-2xl font-bold text-white mb-4">{post.title}</h1>
          <div className="text-gray-300 mb-6 whitespace-pre-wrap">{post.content}</div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-6">
              <Tag className="w-4 h-4 text-gray-400" />
              <div className="flex gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-lg"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-6 pt-4 border-t border-gray-700/50">
            <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors">
              <Heart className="w-5 h-5" />
              <span>{post.likes}</span>
            </button>
            <div className="flex items-center gap-2 text-gray-400">
              <MessageCircle className="w-5 h-5" />
              <span>{post.replies} réponses</span>
            </div>
          </div>
        </div>

        {/* Section des réponses */}
        <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
          <h2 className="text-xl font-bold text-white mb-6">
            Réponses ({localReplies.length})
          </h2>

          {/* Formulaire de réponse */}
          <form onSubmit={handleSubmitReply} className="mb-8">
            <div className="flex gap-4">
              <img
                src="/api/placeholder/40/40"
                alt="Votre avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Écrivez votre réponse..."
                  rows={3}
                  className="w-full px-4 py-3 bg-dark-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none"
                />
                <div className="flex justify-end mt-3">
                  <button
                    type="submit"
                    disabled={!replyContent.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    Répondre
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Liste des réponses */}
          <div className="space-y-6">
            {localReplies.map((reply) => (
              <div key={reply.id} className="flex gap-4 p-4 bg-dark-700/30 rounded-xl">
                <img
                  src={reply.authorAvatar}
                  alt={reply.authorName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-white">{reply.authorName}</h4>
                    <span className="text-sm text-gray-400">
                      {formatTimeAgo(reply.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-3">{reply.content}</p>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{reply.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {localReplies.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Aucune réponse pour le moment</p>
              <p className="text-gray-500 text-sm">Soyez le premier à répondre !</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;