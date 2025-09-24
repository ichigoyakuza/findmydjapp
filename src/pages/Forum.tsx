import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  Heart, 
  Eye, 
  MessageCircle, 
  Pin, 
  CheckCircle,
  Clock,
  Tag,
  TrendingUp
} from 'lucide-react';
import { mockForumPosts, mockForumReplies, MockForumPost } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

const Forum: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [posts, setPosts] = useState<MockForumPost[]>(mockForumPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'replies'>('recent');

  const categories = [
    { id: 'all', name: t('forum.all'), icon: MessageSquare },
    { id: 'question', name: t('forum.questions'), icon: MessageCircle },
    { id: 'tip', name: t('forum.tips'), icon: TrendingUp },
    { id: 'discussion', name: t('forum.discussions'), icon: MessageSquare },
    { id: 'equipment', name: t('forum.equipment'), icon: Filter },
    { id: 'gig', name: t('forum.gigs'), icon: Clock },
    { id: 'music', name: t('forum.music'), icon: Tag }
  ];

  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.likes - a.likes;
        case 'replies':
          return b.replies - a.replies;
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return t('forum.timeAgo.lessThanHour');
    if (diffInHours < 24) return t('forum.timeAgo.hours').replace('{hours}', diffInHours.toString());
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return t('forum.timeAgo.days').replace('{days}', diffInDays.toString());
    return date.toLocaleDateString();
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      question: 'bg-blue-100 text-blue-800',
      tip: 'bg-green-100 text-green-800',
      discussion: 'bg-purple-100 text-purple-800',
      equipment: 'bg-orange-100 text-orange-800',
      gig: 'bg-yellow-100 text-yellow-800',
      music: 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('forum.title')}</h1>
              <p className="text-gray-600">{t('forum.subtitle')}</p>
            </div>
            <button 
              onClick={() => navigate('/forum/create')}
              className="mt-4 sm:mt-0 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t('forum.createPost')}
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('forum.searchForum')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular' | 'replies')}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="recent">{t('forum.newest')}</option>
              <option value="popular">{t('forum.popular')}</option>
              <option value="replies">{t('forum.mostReplies')}</option>
            </select>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div 
              key={post.id} 
              onClick={() => navigate(`/forum/${post.id}`)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    {post.isPinned && (
                      <Pin className="w-4 h-4 text-purple-600" />
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                      {categories.find(c => c.id === post.category)?.name}
                    </span>
                    {post.isSolved && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span className="text-xs font-medium">Résolu</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-purple-600">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {post.content}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="font-medium text-gray-700">{post.authorName}</span>
                      <span>{formatTimeAgo(post.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </button>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.replies}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('forum.noPostsFound')}</h3>
            <p className="text-gray-600">{t('forum.startDiscussion')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;