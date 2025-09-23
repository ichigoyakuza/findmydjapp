import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Star, Users, Calendar, Play, Pause, Download, 
  ExternalLink, Instagram, Youtube, QrCode, Share2, Heart,
  Camera, Image, Edit, Check, Video, Upload, X, Plus, FileText, Save,
  Globe, Clock, DollarSign, Shield, Award, Music2, Briefcase
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

import MusicPlayer from '../components/MusicPlayer';
import RoleGuard from '../components/RoleGuard';
import BookingCalendar from '../components/BookingCalendar';
import FollowButton from '../components/FollowButton';
import ReviewSystem from '../components/ReviewSystem';
import TrackLikeButton from '../components/TrackLikeButton';
import AuthModal from '../components/AuthModal';
import PremiumGate from '../components/PremiumGate';

const DJProfile = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const { user } = useAuth();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // États pour la gestion des photos
  const [profileImage, setProfileImage] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingBanner, setEditingBanner] = useState(false);
  
  // Références pour les input file
  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // États pour Press Kit
  const [documents, setDocuments] = useState([
    {
      id: '1',
      name: 'Artist Bio.pdf',
      type: 'pdf',
      size: '2.3 MB',
      uploadDate: '2024-01-15',
    },
    {
      id: '2',
      name: 'Press Photo.jpg',
      type: 'image',
      size: '1.8 MB',
      uploadDate: '2024-01-10',
    }
  ]);
  
  const [dragActive, setDragActive] = useState(false);
  const [editingDoc, setEditingDoc] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // Mock DJ data
  const dj = {
    id: '1',
    name: 'DJ Nexus',
    city: 'Miami, FL',
    genres: ['House', 'Techno', 'Progressive'],
    rating: 4.9,
    bookings: 127,
    followers: 8432,
    bio: 'Professional DJ with over 10 years of experience. Specializing in house and techno with a unique progressive twist. Available for clubs, festivals, and private events.',
    profileImage: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600',
    bannerImage: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1200',
    
    // Reviews data
     reviews: [
       {
         id: '1',
         userId: 'user1',
         userName: 'Sophie Martin',
         userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
         djId: '1',
         eventDate: '2024-01-15',
         eventType: 'wedding',
         ratings: {
           overall: 5,
           musicQuality: 5,
           professionalism: 5,
           equipment: 4,
           communication: 5,
           punctuality: 5
         },
         comment: 'DJ Nexus was absolutely incredible at our wedding! The music selection was perfect and kept everyone dancing all night. Highly professional and responsive.',
         photos: ['https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300'],
         likes: 12,
         isLiked: false,
         isReported: false,
         createdAt: '2024-01-16T10:30:00Z',
         isEditable: false
       },
       {
         id: '2',
         userId: 'user2',
         userName: 'Marc Dubois',
         userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
         djId: '1',
         eventDate: '2024-01-08',
         eventType: 'corporate',
         ratings: {
           overall: 5,
           musicQuality: 5,
           professionalism: 5,
           equipment: 5,
           communication: 4,
           punctuality: 5
         },
         comment: 'Amazing performance at our corporate event. Great energy and perfect sound quality. Will definitely book again!',
         photos: [],
         likes: 8,
         isLiked: true,
         isReported: false,
         createdAt: '2024-01-09T14:20:00Z',
         isEditable: false
       },
       {
         id: '3',
         userId: 'user3',
         userName: 'Emma Rodriguez',
         userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
         djId: '1',
         eventDate: '2023-12-22',
         eventType: 'private',
         ratings: {
           overall: 4,
           musicQuality: 5,
           professionalism: 4,
           equipment: 4,
           communication: 4,
           punctuality: 3
         },
         comment: 'Great DJ with excellent music taste. The only minor issue was the setup took a bit longer than expected, but the performance was worth it.',
         photos: ['https://images.pexels.com/photos/2034851/pexels-photo-2034851.jpeg?auto=compress&cs=tinysrgb&w=300'],
         likes: 5,
         isLiked: false,
         isReported: false,
         createdAt: '2023-12-23T09:15:00Z',
         isEditable: false
       },
       {
         id: '4',
         userId: 'user4',
         userName: 'Thomas Wilson',
         userAvatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150',
         djId: '1',
         eventDate: '2023-12-18',
         eventType: 'club',
         ratings: {
           overall: 5,
           musicQuality: 5,
           professionalism: 5,
           equipment: 5,
           communication: 5,
           punctuality: 5
         },
         comment: 'Phenomenal set at the club! The crowd was going wild. DJ Nexus really knows how to read the room and deliver exactly what people want to hear.',
         photos: ['https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300', 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300'],
         likes: 15,
         isLiked: false,
         isReported: false,
         createdAt: '2023-12-19T11:45:00Z',
         isEditable: false
       },
       {
         id: '5',
         userId: 'user5',
         userName: 'Lisa Chen',
         userAvatar: 'https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=150',
         djId: '1',
         eventDate: '2023-11-30',
         eventType: 'festival',
         ratings: {
           overall: 5,
           musicQuality: 5,
           professionalism: 5,
           equipment: 5,
           communication: 5,
           punctuality: 4
         },
         comment: 'Booked DJ Nexus for our festival and it was the highlight of the event. Incredible energy, seamless transitions, and the crowd loved every minute!',
         photos: ['https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300'],
         likes: 23,
         isLiked: true,
         isReported: false,
         createdAt: '2023-12-01T16:30:00Z',
         isEditable: false
       }
     ],
    
    // Nouvelles informations ajoutées
    languages: ['Français', 'English', 'Español'],
    yearsOfExperience: 12,
    notableEvents: [
      { name: 'Ultra Music Festival Miami', year: 2023, type: 'Festival' },
      { name: 'Tomorrowland Belgium', year: 2022, type: 'Festival' },
      { name: 'Club Space Miami', year: 2024, type: 'Club' },
      { name: 'Private Wedding - Château de Versailles', year: 2023, type: 'Wedding' }
    ],
    preferredEventTypes: [
      { type: 'Clubs', available: true, description: 'Nightclubs et discothèques' },
      { type: 'Festivals', available: true, description: 'Festivals de musique électronique' },
      { type: 'Mariages', available: true, description: 'Cérémonies et réceptions' },
      { type: 'Soirées privées', available: true, description: 'Événements privés et corporatifs' },
      { type: 'Événements d\'entreprise', available: false, description: 'Séminaires et conférences' }
    ],
    availability: {
      travelRadius: 150, // km
      weekends: true,
      weekdays: true,
      international: true,
      advanceBooking: 30 // jours minimum
    },
    pricing: {
      hourlyRate: {
        min: 200,
        max: 500,
        currency: 'EUR'
      },
      eventRate: {
        club: { min: 800, max: 2000 },
        festival: { min: 2000, max: 8000 },
        wedding: { min: 1200, max: 3000 },
        private: { min: 600, max: 1500 },
        corporate: { min: 1000, max: 2500 }
      },
      deposit: 30, // pourcentage
      cancellationPolicy: {
        moreThan30Days: 'Remboursement complet moins 10% de frais administratifs',
        between15And30Days: 'Remboursement de 50% de l\'acompte',
        lessThan15Days: 'Aucun remboursement'
      }
    },
    
    socialLinks: {
      instagram: '@djnexus',
      soundcloud: 'djnexus',
      youtube: 'djnexusofficial',
      tiktok: '@djnexus'
    },
    tracks: [
      { id: 1, title: 'Midnight Groove', duration: '4:32', price: 'Free', plays: 12543 },
      { id: 2, title: 'Electric Dreams', duration: '5:18', price: '$2.99', plays: 8921 },
      { id: 3, title: 'Neon Nights', duration: '6:45', price: '$2.99', plays: 15677 },
    ],
    videos: [
      { id: 1, title: 'Live at Ultra Miami 2024', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=600' },
      { id: 2, title: 'Studio Session - New Track', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    photos: [
      { id: 1, url: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=600', title: 'Club Performance', type: 'performance' },
      { id: 2, url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600', title: 'Studio Session', type: 'studio' },
      { id: 3, url: 'https://images.pexels.com/photos/2034851/pexels-photo-2034851.jpeg?auto=compress&cs=tinysrgb&w=600', title: 'Festival Set', type: 'festival' },
    ],
    paymentMethods: {
      revolut: 'https://revolut.me/djnexus',
      paypal: '@djnexus',
      venmo: '@djnexus'
    }
  };

  // Fonctions pour Press Kit
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const newDoc = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type.includes('image') ? 'image' : file.type.includes('pdf') ? 'pdf' : 'document',
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
      };
      setDocuments(prev => [...prev, newDoc]);
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-400" />;
      case 'image':
        return <Image className="w-5 h-5 text-blue-400" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const downloadDocument = (doc: any) => {
    console.log('Downloading:', doc.name);
  };

  const deleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  const startEdit = (doc: any) => {
    setEditingDoc(doc.id);
    setEditName(doc.name);
  };

  const saveEdit = () => {
    setDocuments(prev => prev.map(doc => 
      doc.id === editingDoc ? { ...doc, name: editName } : doc
    ));
    setEditingDoc(null);
    setEditName('');
  };

  const cancelEdit = () => {
    setEditingDoc(null);
    setEditName('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <div className="relative h-64 bg-gradient-to-r from-purple-600 to-blue-600 overflow-hidden">
        <img 
          src={bannerImage || dj.bannerImage} 
          alt="DJ Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Profile Image */}
        <div className="absolute bottom-0 left-8 transform translate-y-1/2">
          <div className="relative">
            <img 
              src={profileImage || dj.profileImage} 
              alt={dj.name}
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
            />
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-20 px-8 pb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{dj.name}</h1>
            <div className="flex items-center text-gray-600 mt-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{dj.city}</span>
            </div>
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="font-semibold">{dj.rating}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 text-gray-400 mr-1" />
                <span>{dj.bookings} bookings</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-5 h-5 text-red-400 mr-1" />
                <span>{dj.followers} followers</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <FollowButton djId={dj.id} />
            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Book Now
            </button>
          </div>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-2 mt-6">
          {dj.genres.map((genre, index) => (
            <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              {genre}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-8">
          {['about', 'music', 'photos', 'videos', 'presskit'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'presskit' ? 'Press Kit' : tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="px-8 py-8">
        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Bio Section */}
              <section className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">À propos</h2>
                <p className="text-gray-600 leading-relaxed">{dj.bio}</p>
              </section>

              {/* Experience & Languages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-purple-600" />
                    Expérience
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">{dj.yearsOfExperience} années d'expérience</span>
                    </div>
                    <div className="flex items-center">
                      <Music2 className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">{dj.bookings}+ événements réalisés</span>
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-purple-600" />
                    Langues parlées
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {dj.languages.map((language, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {language}
                      </span>
                    ))}
                  </div>
                </section>
              </div>

              {/* Notable Events */}
              <section className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-purple-600" />
                  Événements notables
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dj.notableEvents.map((event, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{event.name}</h4>
                          <p className="text-sm text-gray-500">{event.type}</p>
                        </div>
                        <span className="text-sm font-medium text-purple-600">{event.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Event Types */}
              <section className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-purple-600" />
                  Types d'événements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dj.preferredEventTypes.map((eventType, index) => (
                    <div key={index} className={`border rounded-lg p-4 ${eventType.available ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${eventType.available ? 'text-green-900' : 'text-gray-500'}`}>
                          {eventType.type}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${eventType.available ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                          {eventType.available ? 'Disponible' : 'Non disponible'}
                        </span>
                      </div>
                      <p className={`text-sm mt-1 ${eventType.available ? 'text-green-700' : 'text-gray-500'}`}>
                        {eventType.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
              
              <ReviewSystem djId={dj.id} reviews={dj.reviews} />
            </div>
            
            <div className="space-y-6">
              <BookingCalendar djId={dj.id} />
              
              {/* Availability */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                  Disponibilité
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rayon de déplacement</span>
                    <span className="font-medium">{dj.availability.travelRadius} km</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Week-ends</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${dj.availability.weekends ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {dj.availability.weekends ? 'Disponible' : 'Non disponible'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Semaine</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${dj.availability.weekdays ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {dj.availability.weekdays ? 'Disponible' : 'Non disponible'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">International</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${dj.availability.international ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {dj.availability.international ? 'Disponible' : 'Non disponible'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Réservation minimum</span>
                    <span className="font-medium">{dj.availability.advanceBooking} jours</span>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-purple-600" />
                  Tarifs
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tarif horaire</h4>
                    <p className="text-lg font-semibold text-purple-600">
                      {dj.pricing.hourlyRate.min} - {dj.pricing.hourlyRate.max} {dj.pricing.hourlyRate.currency}/h
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tarifs par événement</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Clubs</span>
                        <span>{dj.pricing.eventRate.club.min} - {dj.pricing.eventRate.club.max} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Festivals</span>
                        <span>{dj.pricing.eventRate.festival.min} - {dj.pricing.eventRate.festival.max} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mariages</span>
                        <span>{dj.pricing.eventRate.wedding.min} - {dj.pricing.eventRate.wedding.max} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Soirées privées</span>
                        <span>{dj.pricing.eventRate.private.min} - {dj.pricing.eventRate.private.max} €</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Acompte requis</span>
                      <span className="font-medium">{dj.pricing.deposit}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-purple-600" />
                  Conditions d'annulation
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="font-medium text-green-900">Plus de 30 jours</div>
                    <div className="text-green-700">{dj.pricing.cancellationPolicy.moreThan30Days}</div>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="font-medium text-yellow-900">15-30 jours</div>
                    <div className="text-yellow-700">{dj.pricing.cancellationPolicy.between15And30Days}</div>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="font-medium text-red-900">Moins de 15 jours</div>
                    <div className="text-red-700">{dj.pricing.cancellationPolicy.lessThan15Days}</div>
                  </div>
                </div>
              </div>
              
              {/* Payment Methods */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Méthodes de paiement</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">Revolut</span>
                    <a href={dj.paymentMethods.revolut} className="text-purple-600 hover:text-purple-700">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">PayPal</span>
                    <span className="text-gray-600">{dj.paymentMethods.paypal}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">Venmo</span>
                    <span className="text-gray-600">{dj.paymentMethods.venmo}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Music Tab */}
        {activeTab === 'music' && (
          <PremiumGate feature="L'accès à la musique">
            <section className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Music</h2>
              <div className="space-y-4">
                {dj.tracks.map((track, index) => (
                  <div key={track.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => {
                          setCurrentTrack(index);
                          setIsPlaying(!isPlaying);
                        }}
                        className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700"
                      >
                        {isPlaying && currentTrack === index ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <div>
                        <h3 className="font-medium">{track.title}</h3>
                        <p className="text-sm text-gray-500">{track.duration} • {track.plays.toLocaleString()} plays</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                       <TrackLikeButton trackId={track.id.toString()} djId={dj.id} />
                       <span className="font-semibold text-purple-600">{track.price}</span>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </PremiumGate>
        )}

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Photos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dj.photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img 
                    src={photo.url} 
                    alt={photo.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {photo.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <PremiumGate feature="L'accès aux vidéos">
            <section className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Videos</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {dj.videos.map((video) => (
                  <div key={video.id} className="space-y-3">
                    <div className="aspect-video">
                      <iframe
                        src={video.url}
                        title={video.title}
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                      />
                    </div>
                    <h3 className="font-medium">{video.title}</h3>
                  </div>
                ))}
              </div>
            </section>
          </PremiumGate>
        )}

        {/* Press Kit Tab */}
        {activeTab === 'presskit' && (
          <PremiumGate feature="L'accès au Press Kit">
            <section className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Press Kit</h2>
              
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors ${
                  dragActive ? 'border-purple-400 bg-purple-50' : 'border-gray-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop files here, or click to select</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Choose Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />
              </div>

              {/* Documents List */}
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(doc.type)}
                      <div>
                        {editingDoc === doc.id ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="font-medium border rounded px-2 py-1"
                            onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                          />
                        ) : (
                          <h3 className="font-medium">{doc.name}</h3>
                        )}
                        <p className="text-sm text-gray-500">{doc.size} • {doc.uploadDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {editingDoc === doc.id ? (
                        <>
                          <button onClick={saveEdit} className="p-1 text-green-600 hover:text-green-700">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={cancelEdit} className="p-1 text-gray-400 hover:text-gray-600">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(doc)} className="p-1 text-gray-400 hover:text-gray-600">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => downloadDocument(doc)} className="p-1 text-gray-400 hover:text-gray-600">
                            <Download className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteDocument(doc.id)} className="p-1 text-red-400 hover:text-red-600">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                
                {documents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No documents uploaded yet</p>
                  </div>
                )}
              </div>
            </section>
          </PremiumGate>
        )}
      </div>

      {/* Social Links */}
      <div className="px-8 pb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Social Links</h3>
          <div className="flex space-x-4">
            <a href={`https://instagram.com/${dj.socialLinks.instagram}`} className="flex items-center space-x-2 text-pink-600 hover:text-pink-700">
              <Instagram className="w-5 h-5" />
              <span>{dj.socialLinks.instagram}</span>
            </a>
            <a href={`https://soundcloud.com/${dj.socialLinks.soundcloud}`} className="flex items-center space-x-2 text-orange-600 hover:text-orange-700">
              <ExternalLink className="w-5 h-5" />
              <span>{dj.socialLinks.soundcloud}</span>
            </a>
            <a href={`https://youtube.com/${dj.socialLinks.youtube}`} className="flex items-center space-x-2 text-red-600 hover:text-red-700">
              <Youtube className="w-5 h-5" />
              <span>{dj.socialLinks.youtube}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      )}
    </div>
  );
};

export default DJProfile;