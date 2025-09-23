import React, { useState, useRef } from 'react';
import { 
  Upload, Music, Calendar, DollarSign, TrendingUp, 
  Users, Download, Play, Edit2, Settings, BarChart3,
  Camera, User, MapPin, Globe, Instagram, Youtube, 
  ExternalLink, Save, Eye, EyeOff, Video, Plus, X, Trash2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAuthorization } from '../contexts/AuthorizationContext';
import RoleGuard from '../components/RoleGuard';
import PremiumGuard from '../components/PremiumGuard';
import { RevenueManager } from '../components/RevenueManager';
import { PricingManager } from '../components/PricingManager';
import AvailabilityCalendar from '../components/AvailabilityCalendar';

const Dashboard = () => {
  const { user } = useAuth();
  const { hasPermission, getUserRole } = useAuthorization();
  const [activeTab, setActiveTab] = useState('overview');
  
  // États pour les paramètres de profil
  const [profileData, setProfileData] = useState({
    name: 'DJ Shadow',
    bio: 'Professional DJ with 10+ years of experience in electronic music. Specializing in house, techno, and progressive sounds.',
    city: 'Paris, France',
    genres: ['House', 'Techno', 'Progressive'],
    profileImage: '/api/placeholder/200/200',
    bannerImage: '/api/placeholder/800/400',
    socialLinks: {
      instagram: '@djshadow',
      youtube: '@djshadowmusic',
      soundcloud: 'djshadow',
      tiktok: '@djshadow'
    },
    contactInfo: {
      email: 'contact@djshadow.com',
      phone: '+33 6 12 34 56 78',
      website: 'www.djshadow.com'
    },
    pricing: {
      hourlyRate: 150,
      minimumBooking: 2,
      travelFee: 50
    }
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const profileImageRef = useRef<HTMLInputElement>(null);
  const bannerImageRef = useRef<HTMLInputElement>(null);
  
  // États pour la gestion des médias
  const [photos, setPhotos] = useState([
    { id: 1, url: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=600', title: 'Club Performance', type: 'performance' },
    { id: 2, url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600', title: 'Studio Session', type: 'studio' }
  ]);
  const [videos, setVideos] = useState([
    { id: 1, url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Live Set at Club Nexus', duration: '45:30' },
    { id: 2, url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Festival Highlights 2023', duration: '8:45' }
  ]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'pricing', label: 'Prix', icon: DollarSign },
    { id: 'revenue', label: 'Revenus', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: Settings },
  ];

  const stats = [
    { label: 'Total Plays', value: '45,231', change: '+12%', color: 'text-green-400' },
    { label: 'Downloads', value: '1,847', change: '+8%', color: 'text-green-400' },
    { label: 'Bookings', value: '23', change: '+15%', color: 'text-green-400' },
    { label: 'Earnings', value: '$8,420', change: '+22%', color: 'text-green-400' },
  ];

  const recentTracks = [
    { id: 1, title: 'Midnight Groove', plays: 1234, downloads: 89, revenue: '$267' },
    { id: 2, title: 'Electric Dreams', plays: 892, downloads: 156, revenue: '$468' },
    { id: 3, title: 'Neon Nights', plays: 2156, downloads: 203, revenue: '$609' },
  ];

  // Fonctions pour gérer les paramètres de profil
  const handleProfileUpdate = (field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinksUpdate = (platform: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleContactInfoUpdate = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  };

  const handlePricingUpdate = (field: string, value: number) => {
    setProfileData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [field]: value
      }
    }));
  };

  const handleImageUpload = (type: 'profile' | 'banner', file: File) => {
    const imageUrl = URL.createObjectURL(file);
    if (type === 'profile') {
      handleProfileUpdate('profileImage', imageUrl);
    } else {
      handleProfileUpdate('bannerImage', imageUrl);
    }
  };

  const handleGenreToggle = (genre: string) => {
    const currentGenres = profileData.genres;
    if (currentGenres.includes(genre)) {
      handleProfileUpdate('genres', currentGenres.filter(g => g !== genre));
    } else {
      handleProfileUpdate('genres', [...currentGenres, genre]);
    }
  };

  const saveProfile = () => {
    // Ici vous enverriez les données au serveur
    console.log('Saving profile:', profileData);
    setIsEditing(false);
    // Afficher un message de succès
  };

  // Fonctions de gestion des médias
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const imageUrl = URL.createObjectURL(file);
        const newPhoto = {
          id: Date.now() + Math.random(),
          url: imageUrl,
          title: file.name.split('.')[0],
          type: 'uploaded'
        };
        setPhotos(prev => [...prev, newPhoto]);
      });
    }
  };

  const handleVideoAdd = (url: string, title: string) => {
    const newVideo = {
      id: Date.now() + Math.random(),
      url: url,
      title: title,
      duration: '0:00'
    };
    setVideos(prev => [...prev, newVideo]);
  };

  const removePhoto = (id: number) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  const removeVideo = (id: number) => {
    setVideos(prev => prev.filter(video => video.id !== id));
  };

  const availableGenres = [
    'House', 'Techno', 'Progressive', 'Trance', 'Deep House', 
    'Tech House', 'Minimal', 'Electro', 'Dubstep', 'Drum & Bass',
    'Ambient', 'Breakbeat', 'Garage', 'Hardstyle', 'Psytrance',
    'Kizomba', 'Hip-Hop', 'Salsa', 'Bachata'
  ];

  return (
    <div className="min-h-screen bg-dark-900 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            DJ <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">Gérez votre profil, musique et réservations</p>
        </div>

        {/* Tab Navigation - Mobile Optimized */}
        <div className="card mb-6 sm:mb-8 p-1">
          {/* Mobile: Horizontal Scroll */}
          <div className="flex overflow-x-auto scrollbar-hide sm:flex-wrap gap-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-glow'
                    : 'text-gray-400 hover:text-white hover:bg-dark-700/50'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Stats Grid - Responsive */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="card p-4 sm:p-6 hover:shadow-glow transition-all duration-300">
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-xs sm:text-sm font-medium mb-1">{stat.label}</span>
                    <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">{stat.value}</span>
                    <span className={`text-xs sm:text-sm font-medium ${stat.color}`}>{stat.change}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts and Recent Activity - Mobile Stack */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Performance Chart */}
              <div className="card p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  Performance
                </h3>
                <div className="h-48 sm:h-64 bg-dark-800/50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Graphique des performances</p>
                </div>
              </div>

              {/* Recent Tracks */}
              <div className="card p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Music className="w-5 h-5 text-cyan-400" />
                  Tracks récents
                </h3>
                <div className="space-y-3">
                  {recentTracks.map((track) => (
                    <div key={track.id} className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg hover:bg-dark-700/50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Play className="w-4 h-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-white font-medium text-sm sm:text-base truncate">{track.title}</h4>
                          <p className="text-gray-400 text-xs sm:text-sm">{track.plays} lectures</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="text-white font-medium text-sm sm:text-base">{track.revenue}</p>
                        <p className="text-gray-400 text-xs sm:text-sm">{track.downloads} DL</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'music' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Upload Section */}
            <div className="card p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-400" />
                Uploader de la musique
              </h3>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 sm:p-8 text-center hover:border-purple-500/50 transition-colors">
                <Upload className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-2 text-sm sm:text-base">Glissez vos fichiers ici ou cliquez pour sélectionner</p>
                <p className="text-gray-500 text-xs sm:text-sm">MP3, WAV, FLAC jusqu'à 100MB</p>
                <button className="btn-primary mt-4 px-4 py-2 text-sm sm:text-base">
                  Sélectionner des fichiers
                </button>
              </div>
            </div>

            {/* Music Library */}
            <div className="card p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Ma bibliothèque</h3>
              <div className="space-y-3">
                {recentTracks.map((track) => (
                  <div key={track.id} className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-lg hover:bg-dark-700/50 transition-colors">
                    <button className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform">
                      <Play className="w-4 h-4 text-white" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm sm:text-base truncate">{track.title}</h4>
                      <p className="text-gray-400 text-xs sm:text-sm">{track.plays} lectures • {track.downloads} téléchargements</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button className="btn-secondary p-2">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="btn-secondary p-2 hover:bg-red-500/20 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="space-y-6 sm:space-y-8">
            <AvailabilityCalendar isDJ={true} />
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Revenus
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Ce mois</span>
                    <span className="text-2xl font-bold text-white">€2,450</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Mois dernier</span>
                    <span className="text-lg text-gray-300">€1,890</span>
                  </div>
                </div>
              </div>
              
              <div className="card p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Paiements récents</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-dark-800/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Événement privé</p>
                      <p className="text-gray-400 text-sm">15 Nov 2023</p>
                    </div>
                    <span className="text-green-400 font-medium">+€450</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-6 sm:space-y-8">
            <RoleGuard allowedRoles={['dj', 'admin']}>
              <PricingManager />
            </RoleGuard>
            <RoleGuard allowedRoles={[]} fallback={null}>
              <div className="card p-6 text-center">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  Accès DJ Requis
                </h3>
                <p className="text-gray-400">
                  Cette section est réservée aux DJs pour gérer leurs prix de musique.
                </p>
              </div>
            </RoleGuard>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="space-y-6 sm:space-y-8">
            <RoleGuard allowedRoles={['admin']}>
              <RevenueManager isAdmin={getUserRole() === 'admin'} />
            </RoleGuard>
            <RoleGuard allowedRoles={['dj']} fallback={null}>
              <div className="card p-6 text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  Accès Administrateur Requis
                </h3>
                <p className="text-gray-400">
                  Cette section est réservée aux administrateurs pour gérer les revenus de la plateforme.
                </p>
              </div>
            </RoleGuard>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Profile Header */}
            <div className="card p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-400" />
                  Profil DJ
                </h3>
                <button
                  onClick={() => isEditing ? saveProfile() : setIsEditing(true)}
                  className={`btn-primary px-4 py-2 text-sm ${isEditing ? 'bg-green-500 hover:bg-green-600' : ''}`}
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Modifier
                    </>
                  )}
                </button>
              </div>

              {/* Profile Form - Mobile Optimized */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nom du DJ</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleProfileUpdate('name', e.target.value)}
                      disabled={!isEditing}
                      className="input-field w-full"
                      placeholder="Votre nom de DJ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Ville</label>
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) => handleProfileUpdate('city', e.target.value)}
                      disabled={!isEditing}
                      className="input-field w-full"
                      placeholder="Votre ville"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      className="input-field w-full resize-none"
                      placeholder="Décrivez votre style et expérience..."
                    />
                  </div>
                </div>

                {/* Profile Images */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Photo de profil</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-dark-700 flex-shrink-0">
                        <img
                          src={profileData.profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => profileImageRef.current?.click()}
                          className="btn-secondary px-3 py-2 text-sm"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Changer
                        </button>
                      )}
                    </div>
                    <input
                      ref={profileImageRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload('profile', e.target.files[0])}
                      className="hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bannière</label>
                    <div className="w-full h-24 sm:h-32 rounded-lg overflow-hidden bg-dark-700">
                      <img
                        src={profileData.bannerImage}
                        alt="Banner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => bannerImageRef.current?.click()}
                        className="btn-secondary px-3 py-2 text-sm mt-2"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Changer la bannière
                      </button>
                    )}
                    <input
                      ref={bannerImageRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload('banner', e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Genres - Mobile Optimized */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">Genres musicaux</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2">
                  {availableGenres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => isEditing && handleGenreToggle(genre)}
                      disabled={!isEditing}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        profileData.genres.includes(genre)
                          ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                          : 'bg-dark-700/50 text-gray-400 hover:bg-dark-600/50'
                      } ${!isEditing ? 'cursor-default' : 'cursor-pointer hover:scale-105'}`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact & Social */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card p-4 sm:p-6">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  Réseaux sociaux
                </h4>
                <div className="space-y-3">
                  {Object.entries(profileData.socialLinks).map(([platform, value]) => (
                    <div key={platform}>
                      <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">{platform}</label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleSocialLinksUpdate(platform, e.target.value)}
                        disabled={!isEditing}
                        className="input-field w-full"
                        placeholder={`@votre${platform}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-4 sm:p-6">
                <h4 className="text-lg font-bold text-white mb-4">Tarification</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Tarif horaire (€)</label>
                    <input
                      type="number"
                      value={profileData.pricing.hourlyRate}
                      onChange={(e) => handlePricingUpdate('hourlyRate', parseInt(e.target.value))}
                      disabled={!isEditing}
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Réservation minimum (heures)</label>
                    <input
                      type="number"
                      value={profileData.pricing.minimumBooking}
                      onChange={(e) => handlePricingUpdate('minimumBooking', parseInt(e.target.value))}
                      disabled={!isEditing}
                      className="input-field w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
   );
};

export default Dashboard;