import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Tag, Type, MessageSquare } from 'lucide-react';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: ''
  });

  const categories = [
    { value: 'general', label: 'Général', color: 'bg-blue-500' },
    { value: 'technique', label: 'Technique', color: 'bg-green-500' },
    { value: 'materiel', label: 'Matériel', color: 'bg-purple-500' },
    { value: 'evenements', label: 'Événements', color: 'bg-orange-500' },
    { value: 'debutant', label: 'Débutant', color: 'bg-pink-500' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici on ajouterait la logique pour sauvegarder le post
    console.log('Nouveau post:', formData);
    navigate('/forum');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

        {/* Main Form */}
        <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <MessageSquare className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Créer un nouveau post</h1>
              <p className="text-gray-400">Partagez vos questions, conseils ou expériences avec la communauté</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titre */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Type className="w-4 h-4" />
                Titre du post
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Donnez un titre accrocheur à votre post..."
                className="w-full px-4 py-3 bg-dark-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                required
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Tag className="w-4 h-4" />
                Catégorie
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-dark-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value} className="bg-dark-700">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Tags (optionnel)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Séparez les tags par des virgules (ex: mixing, débutant, conseil)"
                className="w-full px-4 py-3 bg-dark-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              />
            </div>

            {/* Contenu */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Contenu
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Décrivez votre question, partagez vos conseils ou votre expérience..."
                rows={8}
                className="w-full px-4 py-3 bg-dark-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none"
                required
              />
            </div>

            {/* Aperçu de la catégorie sélectionnée */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Catégorie sélectionnée:</span>
              {categories.find(cat => cat.value === formData.category) && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${categories.find(cat => cat.value === formData.category)?.color}`}>
                  {categories.find(cat => cat.value === formData.category)?.label}
                </span>
              )}
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/forum')}
                className="px-6 py-3 bg-gray-600/50 text-gray-300 rounded-xl hover:bg-gray-600/70 transition-all"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
              >
                <Send className="w-4 h-4" />
                Publier le post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;