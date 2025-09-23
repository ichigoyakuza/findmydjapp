import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'fr' | 'en' | 'es' | 'it' | 'de' | 'pt';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Traductions par défaut (seront étendues)
const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    'nav.discovery': 'Découverte',
    'nav.artists': 'Artistes',
    'nav.events': 'Événements',
    'nav.dashboard': 'Tableau de bord',
    
    // Général
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.book': 'Réserver',
    'common.contact': 'Contacter',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.download': 'Télécharger',
    'common.upload': 'Téléverser',
    'common.bookings': 'réservations',
    
    // DJ Map
    'map.title': 'Carte des DJs',
    'map.searchCity': 'Rechercher une ville...',
    'map.allStyles': 'Tous les styles',
    'map.allAvailability': 'Toute disponibilité',
    'map.availableNow': 'Disponible maintenant',
    'map.thisWeekend': 'Ce week-end',
    
    // DJ Profile
    'profile.about': 'À propos',
    'profile.music': 'Musique',
    'profile.events': 'Événements',
    'profile.booking': 'Réservation',
    'profile.presskit': 'Press Kit',
    'profile.bio': 'Biographie',
    'profile.genres': 'Genres musicaux',
    'profile.location': 'Localisation',
    'profile.experience': 'Expérience',
    
    // Press Kit
    'presskit.title': 'Press Kit',
    'presskit.upload': 'Glisser-déposer vos fichiers ici ou cliquer pour sélectionner',
    'presskit.supported': 'Formats supportés: PDF, JPG, PNG, MP3, MP4',
    'presskit.documents': 'Documents',
    'presskit.no_documents': 'Aucun document disponible',
    
    // Booking
    'booking.title': 'Réserver cet artiste',
    'booking.date': 'Date de l\'événement',
    'booking.time': 'Heure',
    'booking.duration': 'Durée',
    'booking.venue': 'Lieu',
    'booking.budget': 'Budget',
    'booking.message': 'Message',
    'booking.submit': 'Envoyer la demande',
    
    // Language selector
    'language.select': 'Choisir la langue',
    'language.french': 'Français',
    'language.english': 'Anglais',
    'language.spanish': 'Espagnol',
    'language.italian': 'Italien',
    'language.german': 'Allemand',
    'language.portuguese': 'Portugais',

    // Social features
    'social.like': 'J\'aime',
    'social.likes': 'J\'aime',
    'social.follow': 'Suivre',
    'social.following': 'Suivi',
    'social.followers': 'Abonnés',
    'social.reviews': 'Avis',
    'social.addReview': 'Laisser un avis',
    'social.rating': 'Note',
    'social.comment': 'Commentaire',
    'social.publish': 'Publier',
    'social.noReviews': 'Aucun avis pour le moment',
    'social.firstReview': 'Soyez le premier à laisser un avis !',

    // Community
    'community.title': 'Communauté',
    'community.playlist': 'Mixtape du Mois',
    'community.propose': 'Proposer un morceau',
    'community.vote': 'Voter',
    'community.listen': 'Écouter',
    'community.download': 'Télécharger',
    'community.official': 'Playlist Officielle',
    'community.pending': 'Propositions en cours',
    'community.selected': 'morceaux sélectionnés',
    'community.propositions': 'propositions',
    'community.trackTitle': 'Titre du morceau',
    'community.artist': 'Artiste',
    'community.genre': 'Genre',
    'community.proposedBy': 'Proposé par',
    'community.onePerMonth': 'Chaque utilisateur peut proposer un morceau par mois',

    // Genres musicaux
    'genres.house': 'House',
    'genres.techno': 'Techno',
    'genres.kizomba': 'Kizomba',
    'genres.salsa': 'Salsa',
    'genres.bachata': 'Bachata',
    'genres.afro': 'Afro',
    'genres.electro': 'Electro',
    'genres.deephouse': 'Deep House',
    'genres.progressive': 'Progressive',
    'genres.hiphop': 'Hip-Hop',
    'genres.rnb': 'R&B',
    'genres.edm': 'EDM',
    'genres.trance': 'Trance',
    'genres.ambient': 'Ambient',
    'genres.drumandbass': 'Drum & Bass',
    'genres.dubstep': 'Dubstep',
    'genres.funk': 'Funk',
    'genres.disco': 'Disco',
    'genres.latin': 'Latin',
    'genres.reggaeton': 'Reggaeton',
    'genres.dancehall': 'Dancehall',
    'genres.trap': 'Trap',
    'genres.rock': 'Rock',
    'genres.electronic': 'Electronic',
    'genres.reggae': 'Reggae',

    // Textes divers
    'misc.artists': 'Artistes',
    'misc.found': 'trouvé',
    'misc.foundPlural': 'trouvés',
    'misc.artist': 'artiste',
    'misc.artistPlural': 'artistes',
    'misc.noArtistsFound': 'Aucun artiste trouvé',
    'misc.modifySearch': 'Essayez de modifier vos critères de recherche',
    'misc.clearFilters': 'Effacer les filtres',
    'misc.musicStore': 'Boutique Musique',
    'misc.community': 'Communauté',
    'misc.events': 'Événements',
    'misc.geolocation': 'Géolocalisation',
    'misc.locationError': 'Erreur de localisation',
    'misc.locating': 'Localisation...',
    'misc.positionFound': 'Position trouvée',
    'misc.distance': 'Distance max',
    'misc.km': 'km',
    'misc.available': 'Disponible',
    'misc.busy': 'Occupé',
    'misc.viewProfile': 'Voir le profil',
    'misc.book': 'Booker',
    'misc.cancel': 'Annuler',
    'misc.save': 'Enregistrer',
    'misc.edit': 'Modifier',
    'misc.delete': 'Supprimer',
    'misc.upload': 'Téléverser',
    'misc.download': 'Télécharger',
    'misc.listen': 'Écouter',
    'misc.vote': 'Voter',
    'misc.publish': 'Publier',
    'misc.proposedBy': 'Proposé par',
    'misc.trackTitle': 'Titre du morceau',
    'misc.artistName': 'Nom de l\'artiste',
    'misc.genreOptional': 'Genre (optionnel)',
    'misc.comment': 'Commentaire',
    'misc.rating': 'Note',
    'misc.shareExperience': 'Partagez votre expérience avec ce DJ...',
    'misc.firstReview': 'Soyez le premier à laisser un avis !',
    'misc.noReviews': 'Aucun avis pour le moment',
    'misc.leaveReview': 'Laisser un avis',
    'misc.reviews': 'Avis',
    'misc.follow': 'Suivre',
    'misc.following': 'Suivi',
    'misc.unfollow': 'Ne plus suivre',
    'misc.followers': 'Abonnés',
    'misc.bookings': 'réservations',
    'misc.upcomingEvents': 'Prochains événements',
    'misc.musicPricing': 'Prix par Musique',
    'misc.configuredMusic': 'Musiques Configurées',
    'misc.premiumCommunity': 'Bienvenue dans la communauté premium DJHUB !',
    'misc.loginRequired': 'Veuillez vous connecter pour acheter de la musique',
    'misc.artistReceives': 'Artiste reçoit:',
    'misc.supportArtists': 'Chaque achat soutient directement les artistes avec seulement 2% de commission.',
    'misc.searchTrackArtist': 'Rechercher une track ou un artiste...',
    'misc.modifyFilters': 'Essayez de modifier vos filtres de recherche.',
    'misc.forArtists': 'Pour les artistes:',
    'misc.joinCommunity': 'Rejoignez la communauté DJHUB',
    'misc.connectTalentedDJs': 'Connectez-vous avec des DJs talentueux, écoutez leur musique et réservez-les pour votre prochain événement',
    'misc.popularEvents': 'Événements populaires',
    'misc.createAccount': 'Créez votre compte pour réserver des DJs, gérer vos événements et découvrir de nouveaux talents',
    'misc.searchDJs': 'Rechercher des DJs...',
    'misc.manageProfile': 'Gérez votre profil, musique et réservations',
    'misc.uploadMusic': 'Uploader de la musique',
    'misc.bookingCalendar': 'Calendrier des réservations',
    'misc.djSection': 'Cette section est réservée aux DJs pour gérer leurs prix de musique.',
    'misc.describeStyle': 'Décrivez votre style et expérience...',
    'misc.minBookingHours': 'Réservation minimum (heures)',
    'misc.accessToMusic': 'L\'accès à la musique',
    'misc.accessToPressKit': 'L\'accès au Press Kit',
    'misc.cancelSubscription': 'Annuler l\'abonnement',
    'misc.mobileOptimized': 'Cette application est optimisée pour mobile uniquement. Veuillez utiliser votre téléphone pour une meilleure expérience.'
  },
  en: {
    // Navigation
    'nav.discovery': 'Discovery',
    'nav.artists': 'Artists',
    'nav.events': 'Events',
    'nav.dashboard': 'Dashboard',
    
    // General
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.book': 'Book',
    'common.contact': 'Contact',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.download': 'Download',
    'common.upload': 'Upload',
    'common.bookings': 'bookings',
    
    // DJ Map
    'map.title': 'DJ Map',
    'map.searchCity': 'Search for a city...',
    'map.allStyles': 'All styles',
    'map.allAvailability': 'All availability',
    'map.availableNow': 'Available now',
    'map.thisWeekend': 'This weekend',
    
    // DJ Profile
    'profile.about': 'About',
    'profile.music': 'Music',
    'profile.events': 'Events',
    'profile.booking': 'Booking',
    'profile.presskit': 'Press Kit',
    'profile.bio': 'Biography',
    'profile.genres': 'Musical Genres',
    'profile.location': 'Location',
    'profile.experience': 'Experience',
    
    // Press Kit
    'presskit.title': 'Press Kit',
    'presskit.upload': 'Drag and drop your files here or click to select',
    'presskit.supported': 'Supported formats: PDF, JPG, PNG, MP3, MP4',
    'presskit.documents': 'Documents',
    'presskit.no_documents': 'No documents available',
    
    // Booking
    'booking.title': 'Book this artist',
    'booking.date': 'Event date',
    'booking.time': 'Time',
    'booking.duration': 'Duration',
    'booking.venue': 'Venue',
    'booking.budget': 'Budget',
    'booking.message': 'Message',
    'booking.submit': 'Send request',
    
    // Language selector
    'language.select': 'Select language',
    'language.french': 'French',
    'language.english': 'English',
    'language.spanish': 'Spanish',
    'language.italian': 'Italian',
    'language.german': 'German',
    'language.portuguese': 'Portuguese',

    // Social features
    'social.like': 'Like',
    'social.likes': 'Likes',
    'social.follow': 'Follow',
    'social.following': 'Following',
    'social.followers': 'Followers',
    'social.reviews': 'Reviews',
    'social.addReview': 'Leave a review',
    'social.rating': 'Rating',
    'social.comment': 'Comment',
    'social.publish': 'Publish',
    'social.noReviews': 'No reviews yet',
    'social.firstReview': 'Be the first to leave a review!',

    // Community
    'community.title': 'Community',
    'community.playlist': 'Monthly Mixtape',
    'community.propose': 'Propose a track',
    'community.vote': 'Vote',
    'community.listen': 'Listen',
    'community.download': 'Download',
    'community.official': 'Official Playlist',
    'community.pending': 'Pending proposals',
    'community.selected': 'selected tracks',
    'community.propositions': 'proposals',
    'community.trackTitle': 'Track title',
    'community.artist': 'Artist',
    'community.genre': 'Genre',
    'community.proposedBy': 'Proposed by',
    'community.onePerMonth': 'Each user can propose one track per month',

    // Musical genres
    'genres.house': 'House',
    'genres.techno': 'Techno',
    'genres.kizomba': 'Kizomba',
    'genres.salsa': 'Salsa',
    'genres.bachata': 'Bachata',
    'genres.afro': 'Afro',
    'genres.electro': 'Electro',
    'genres.deephouse': 'Deep House',
    'genres.progressive': 'Progressive',
    'genres.hiphop': 'Hip-Hop',
    'genres.rnb': 'R&B',
    'genres.edm': 'EDM',
    'genres.trance': 'Trance',
    'genres.ambient': 'Ambient',
    'genres.drumandbass': 'Drum & Bass',
    'genres.dubstep': 'Dubstep',
    'genres.funk': 'Funk',
    'genres.disco': 'Disco',
    'genres.latin': 'Latin',
    'genres.reggaeton': 'Reggaeton',
    'genres.dancehall': 'Dancehall',
    'genres.trap': 'Trap',
    'genres.rock': 'Rock',
    'genres.electronic': 'Electronic',
    'genres.reggae': 'Reggae',

    // Miscellaneous texts
    'misc.artists': 'Artists',
    'misc.found': 'found',
    'misc.foundPlural': 'found',
    'misc.artist': 'artist',
    'misc.artistPlural': 'artists',
    'misc.noArtistsFound': 'No artists found',
    'misc.modifySearch': 'Try modifying your search criteria',
    'misc.clearFilters': 'Clear filters',
    'misc.musicStore': 'Music Store',
    'misc.community': 'Community',
    'misc.events': 'Events',
    'misc.geolocation': 'Geolocation',
    'misc.locationError': 'Location error',
    'misc.locating': 'Locating...',
    'misc.positionFound': 'Position found',
    'misc.distance': 'Max distance',
    'misc.km': 'km',
    'misc.available': 'Available',
    'misc.busy': 'Busy',
    'misc.viewProfile': 'View profile',
    'misc.book': 'Book',
    'misc.cancel': 'Cancel',
    'misc.save': 'Save',
    'misc.edit': 'Edit',
    'misc.delete': 'Delete',
    'misc.upload': 'Upload',
    'misc.download': 'Download',
    'misc.listen': 'Listen',
    'misc.vote': 'Vote',
    'misc.publish': 'Publish',
    'misc.proposedBy': 'Proposed by',
    'misc.trackTitle': 'Track title',
    'misc.artistName': 'Artist name',
    'misc.genreOptional': 'Genre (optional)',
    'misc.comment': 'Comment',
    'misc.rating': 'Rating',
    'misc.shareExperience': 'Share your experience with this DJ...',
    'misc.firstReview': 'Be the first to leave a review!',
    'misc.noReviews': 'No reviews yet',
    'misc.leaveReview': 'Leave a review',
    'misc.reviews': 'Reviews',
    'misc.follow': 'Follow',
    'misc.following': 'Following',
    'misc.unfollow': 'Unfollow',
    'misc.followers': 'Followers',
    'misc.bookings': 'bookings',
    'misc.upcomingEvents': 'Upcoming events',
    'misc.musicPricing': 'Music Pricing',
    'misc.configuredMusic': 'Configured Music',
    'misc.premiumCommunity': 'Welcome to the DJHUB premium community!',
    'misc.loginRequired': 'Please log in to purchase music',
    'misc.artistReceives': 'Artist receives:',
    'misc.supportArtists': 'Each purchase directly supports artists with only 2% commission.',
    'misc.searchTrackArtist': 'Search for a track or artist...',
    'misc.modifyFilters': 'Try modifying your search filters.',
    'misc.forArtists': 'For artists:',
    'misc.joinCommunity': 'Join the DJHUB community',
    'misc.connectTalentedDJs': 'Connect with talented DJs, listen to their music and book them for your next event',
    'misc.popularEvents': 'Popular events',
    'misc.createAccount': 'Create your account to book DJs, manage your events and discover new talents',
    'misc.searchDJs': 'Search for DJs...',
    'misc.manageProfile': 'Manage your profile, music and bookings',
    'misc.uploadMusic': 'Upload music',
    'misc.bookingCalendar': 'Booking calendar',
    'misc.djSection': 'This section is reserved for DJs to manage their music pricing.',
    'misc.describeStyle': 'Describe your style and experience...',
    'misc.minBookingHours': 'Minimum booking (hours)',
    'misc.accessToMusic': 'Access to music',
    'misc.accessToPressKit': 'Access to Press Kit',
    'misc.cancelSubscription': 'Cancel subscription',
    'misc.mobileOptimized': 'This application is optimized for mobile only. Please use your phone for a better experience.'
  },
  es: {
    // Navigation
    'nav.discovery': 'Descubrimiento',
    'nav.artists': 'Artistas',
    'nav.events': 'Eventos',
    'nav.dashboard': 'Panel',
    
    // General
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.book': 'Reservar',
    'common.contact': 'Contactar',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.download': 'Descargar',
    'common.upload': 'Subir',
    'common.bookings': 'reservas',
    
    // DJ Map
    'map.title': 'Mapa de DJs',
    'map.searchCity': 'Buscar una ciudad...',
    'map.allStyles': 'Todos los estilos',
    'map.allAvailability': 'Toda disponibilidad',
    'map.availableNow': 'Disponible ahora',
    'map.thisWeekend': 'Este fin de semana',
    
    // DJ Profile
    'profile.about': 'Acerca de',
    'profile.music': 'Música',
    'profile.events': 'Eventos',
    'profile.booking': 'Reserva',
    'profile.presskit': 'Kit de Prensa',
    'profile.bio': 'Biografía',
    'profile.genres': 'Géneros Musicales',
    'profile.location': 'Ubicación',
    'profile.experience': 'Experiencia',
    
    // Press Kit
    'presskit.title': 'Kit de Prensa',
    'presskit.upload': 'Arrastra y suelta tus archivos aquí o haz clic para seleccionar',
    'presskit.supported': 'Formatos soportados: PDF, JPG, PNG, MP3, MP4',
    'presskit.documents': 'Documentos',
    'presskit.no_documents': 'No hay documentos disponibles',
    
    // Booking
    'booking.title': 'Reservar este artista',
    'booking.date': 'Fecha del evento',
    'booking.time': 'Hora',
    'booking.duration': 'Duración',
    'booking.venue': 'Lugar',
    'booking.budget': 'Presupuesto',
    'booking.message': 'Mensaje',
    'booking.submit': 'Enviar solicitud',
    
    // Language selector
    'language.select': 'Seleccionar idioma',
    'language.french': 'Francés',
    'language.english': 'Inglés',
    'language.spanish': 'Español',
    'language.italian': 'Italiano',
    'language.german': 'Alemán',
    'language.portuguese': 'Portugués',

    // Social features
    'social.like': 'Me gusta',
    'social.likes': 'Me gusta',
    'social.follow': 'Seguir',
    'social.following': 'Siguiendo',
    'social.followers': 'Seguidores',
    'social.reviews': 'Reseñas',
    'social.addReview': 'Dejar una reseña',
    'social.rating': 'Calificación',
    'social.comment': 'Comentario',
    'social.publish': 'Publicar',
    'social.noReviews': 'Aún no hay reseñas',
    'social.firstReview': '¡Sé el primero en dejar una reseña!',

    // Community
    'community.title': 'Comunidad',
    'community.playlist': 'Mixtape Mensual',
    'community.propose': 'Proponer una pista',
    'community.vote': 'Votar',
    'community.listen': 'Escuchar',
    'community.download': 'Descargar',
    'community.official': 'Lista de Reproducción Oficial',
    'community.pending': 'Propuestas pendientes',
    'community.selected': 'pistas seleccionadas',
    'community.propositions': 'propuestas',
    'community.trackTitle': 'Título de la pista',
    'community.artist': 'Artista',
    'community.genre': 'Género',
    'community.proposedBy': 'Propuesto por',
    'community.onePerMonth': 'Cada usuario puede proponer una pista por mes',

    // Musical genres
    'genres.house': 'House',
    'genres.techno': 'Techno',
    'genres.kizomba': 'Kizomba',
    'genres.salsa': 'Salsa',
    'genres.bachata': 'Bachata',
    'genres.afro': 'Afro',
    'genres.electro': 'Electro',
    'genres.deephouse': 'Deep House',
    'genres.progressive': 'Progresivo',
    'genres.hiphop': 'Hip-Hop',
    'genres.rnb': 'R&B',
    'genres.edm': 'EDM',
    'genres.trance': 'Trance',
    'genres.ambient': 'Ambient',
    'genres.drumandbass': 'Drum & Bass',
    'genres.dubstep': 'Dubstep',
    'genres.funk': 'Funk',
    'genres.disco': 'Disco',
    'genres.latin': 'Latino',
    'genres.reggaeton': 'Reggaeton',
    'genres.dancehall': 'Dancehall',
    'genres.trap': 'Trap',
    'genres.rock': 'Rock',
    'genres.electronic': 'Electrónico',
    'genres.reggae': 'Reggae',

    // Miscellaneous texts
    'misc.artists': 'Artistas',
    'misc.found': 'encontrado',
    'misc.foundPlural': 'encontrados',
    'misc.artist': 'artista',
    'misc.artistPlural': 'artistas',
    'misc.noArtistsFound': 'No se encontraron artistas',
    'misc.modifySearch': 'Intenta modificar tus criterios de búsqueda',
    'misc.clearFilters': 'Limpiar filtros',
    'misc.musicStore': 'Tienda de Música',
    'misc.community': 'Comunidad',
    'misc.events': 'Eventos',
    'misc.geolocation': 'Geolocalización',
    'misc.locationError': 'Error de ubicación',
    'misc.locating': 'Localizando...',
    'misc.positionFound': 'Posición encontrada',
    'misc.distance': 'Distancia máxima',
    'misc.km': 'km',
    'misc.available': 'Disponible',
    'misc.busy': 'Ocupado',
    'misc.viewProfile': 'Ver perfil',
    'misc.book': 'Reservar',
    'misc.cancel': 'Cancelar',
    'misc.save': 'Guardar',
    'misc.edit': 'Editar',
    'misc.delete': 'Eliminar',
    'misc.upload': 'Subir',
    'misc.download': 'Descargar',
    'misc.listen': 'Escuchar',
    'misc.vote': 'Votar',
    'misc.publish': 'Publicar',
    'misc.proposedBy': 'Propuesto por',
    'misc.trackTitle': 'Título de la pista',
    'misc.artistName': 'Nombre del artista',
    'misc.genreOptional': 'Género (opcional)',
    'misc.comment': 'Comentario',
    'misc.rating': 'Calificación',
    'misc.shareExperience': 'Comparte tu experiencia con este DJ...',
    'misc.firstReview': '¡Sé el primero en dejar una reseña!',
    'misc.noReviews': 'Aún no hay reseñas',
    'misc.leaveReview': 'Dejar una reseña',
    'misc.reviews': 'Reseñas',
    'misc.follow': 'Seguir',
    'misc.following': 'Siguiendo',
    'misc.unfollow': 'Dejar de seguir',
    'misc.followers': 'Seguidores',
    'misc.bookings': 'reservas',
    'misc.upcomingEvents': 'Próximos eventos',
    'misc.musicPricing': 'Precios de Música',
    'misc.configuredMusic': 'Música Configurada',
    'misc.premiumCommunity': '¡Bienvenido a la comunidad premium de DJHUB!',
    'misc.loginRequired': 'Por favor inicia sesión para comprar música',
    'misc.artistReceives': 'El artista recibe:',
    'misc.supportArtists': 'Cada compra apoya directamente a los artistas con solo 2% de comisión.',
    'misc.searchTrackArtist': 'Buscar una pista o artista...',
    'misc.modifyFilters': 'Intenta modificar tus filtros de búsqueda.',
    'misc.forArtists': 'Para artistas:',
    'misc.joinCommunity': 'Únete a la comunidad DJHUB',
    'misc.connectTalentedDJs': 'Conecta con DJs talentosos, escucha su música y contrátalos para tu próximo evento',
    'misc.popularEvents': 'Eventos populares',
    'misc.createAccount': 'Crea tu cuenta para reservar DJs, gestionar tus eventos y descubrir nuevos talentos',
    'misc.searchDJs': 'Buscar DJs...',
    'misc.manageProfile': 'Gestiona tu perfil, música y reservas',
    'misc.uploadMusic': 'Subir música',
    'misc.bookingCalendar': 'Calendario de reservas',
    'misc.djSection': 'Esta sección está reservada para que los DJs gestionen sus precios de música.',
    'misc.describeStyle': 'Describe tu estilo y experiencia...',
    'misc.minBookingHours': 'Reserva mínima (horas)',
    'misc.accessToMusic': 'Acceso a música',
    'misc.accessToPressKit': 'Acceso al Press Kit',
    'misc.cancelSubscription': 'Cancelar suscripción',
    'misc.mobileOptimized': 'Esta aplicación está optimizada solo para móviles. Por favor usa tu teléfono para una mejor experiencia.'
  },
  it: {
    // Navigation
    'nav.discovery': 'Scoperta',
    'nav.artists': 'Artisti',
    'nav.events': 'Eventi',
    'nav.dashboard': 'Dashboard',
    
    // General
    'common.search': 'Cerca',
    'common.filter': 'Filtra',
    'common.book': 'Prenota',
    'common.contact': 'Contatta',
    'common.save': 'Salva',
    'common.cancel': 'Annulla',
    'common.edit': 'Modifica',
    'common.delete': 'Elimina',
    'common.download': 'Scarica',
    'common.upload': 'Carica',
    'common.bookings': 'prenotazioni',
    
    // DJ Map
    'map.title': 'Mappa DJ',
    'map.searchCity': 'Cerca una città...',
    'map.allStyles': 'Tutti gli stili',
    'map.allAvailability': 'Tutta la disponibilità',
    'map.availableNow': 'Disponibile ora',
    'map.thisWeekend': 'Questo weekend',
    
    // DJ Profile
    'profile.about': 'Chi sono',
    'profile.music': 'Musica',
    'profile.events': 'Eventi',
    'profile.booking': 'Prenotazione',
    'profile.presskit': 'Kit Stampa',
    'profile.bio': 'Biografia',
    'profile.genres': 'Generi Musicali',
    'profile.location': 'Posizione',
    'profile.experience': 'Esperienza',
    
    // Press Kit
    'presskit.title': 'Kit Stampa',
    'presskit.upload': 'Trascina e rilascia i tuoi file qui o clicca per selezionare',
    'presskit.supported': 'Formati supportati: PDF, JPG, PNG, MP3, MP4',
    'presskit.documents': 'Documenti',
    'presskit.no_documents': 'Nessun documento disponibile',
    
    // Booking
    'booking.title': 'Prenota questo artista',
    'booking.date': 'Data evento',
    'booking.time': 'Ora',
    'booking.duration': 'Durata',
    'booking.venue': 'Luogo',
    'booking.budget': 'Budget',
    'booking.message': 'Messaggio',
    'booking.submit': 'Invia richiesta',
    
    // Language selector
    'language.select': 'Seleziona lingua',
    'language.french': 'Francese',
    'language.english': 'Inglese',
    'language.spanish': 'Spagnolo',
    'language.italian': 'Italiano',
    'language.german': 'Tedesco',
    'language.portuguese': 'Portoghese'
  },
  de: {
    // Navigation
    'nav.discovery': 'Entdeckung',
    'nav.artists': 'Künstler',
    'nav.events': 'Veranstaltungen',
    'nav.dashboard': 'Dashboard',
    
    // General
    'common.search': 'Suchen',
    'common.filter': 'Filtern',
    'common.book': 'Buchen',
    'common.contact': 'Kontakt',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.edit': 'Bearbeiten',
    'common.delete': 'Löschen',
    'common.download': 'Herunterladen',
    'common.upload': 'Hochladen',
    'common.bookings': 'Buchungen',
    
    // DJ Map
    'map.title': 'DJ-Karte',
    'map.searchCity': 'Nach einer Stadt suchen...',
    'map.allStyles': 'Alle Stile',
    'map.allAvailability': 'Alle Verfügbarkeiten',
    'map.availableNow': 'Jetzt verfügbar',
    'map.thisWeekend': 'Dieses Wochenende',
    
    // DJ Profile
    'profile.about': 'Über mich',
    'profile.music': 'Musik',
    'profile.events': 'Veranstaltungen',
    'profile.booking': 'Buchung',
    'profile.presskit': 'Pressekit',
    'profile.bio': 'Biografie',
    'profile.genres': 'Musikrichtungen',
    'profile.location': 'Standort',
    'profile.experience': 'Erfahrung',
    
    // Press Kit
    'presskit.title': 'Pressekit',
    'presskit.upload': 'Dateien hier hineinziehen oder klicken zum Auswählen',
    'presskit.supported': 'Unterstützte Formate: PDF, JPG, PNG, MP3, MP4',
    'presskit.documents': 'Dokumente',
    'presskit.no_documents': 'Keine Dokumente verfügbar',
    
    // Booking
    'booking.title': 'Diesen Künstler buchen',
    'booking.date': 'Veranstaltungsdatum',
    'booking.time': 'Uhrzeit',
    'booking.duration': 'Dauer',
    'booking.venue': 'Veranstaltungsort',
    'booking.budget': 'Budget',
    'booking.message': 'Nachricht',
    'booking.submit': 'Anfrage senden',
    
    // Language selector
    'language.select': 'Sprache wählen',
    'language.french': 'Französisch',
    'language.english': 'Englisch',
    'language.spanish': 'Spanisch',
    'language.italian': 'Italienisch',
    'language.german': 'Deutsch',
    'language.portuguese': 'Portugiesisch'
  },
  pt: {
    // Navigation
    'nav.discovery': 'Descoberta',
    'nav.artists': 'Artistas',
    'nav.events': 'Eventos',
    'nav.dashboard': 'Painel',
    
    // General
    'common.search': 'Pesquisar',
    'common.filter': 'Filtrar',
    'common.book': 'Reservar',
    'common.contact': 'Contactar',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.download': 'Descarregar',
    'common.upload': 'Carregar',
    'common.bookings': 'reservas',
    
    // DJ Map
    'map.title': 'Mapa de DJs',
    'map.searchCity': 'Pesquisar uma cidade...',
    'map.allStyles': 'Todos os estilos',
    'map.allAvailability': 'Toda disponibilidade',
    'map.availableNow': 'Disponível agora',
    'map.thisWeekend': 'Este fim de semana',
    
    // DJ Profile
    'profile.about': 'Sobre',
    'profile.music': 'Música',
    'profile.events': 'Eventos',
    'profile.booking': 'Reserva',
    'profile.presskit': 'Kit de Imprensa',
    'profile.bio': 'Biografia',
    'profile.genres': 'Géneros Musicais',
    'profile.location': 'Localização',
    'profile.experience': 'Experiência',
    
    // Press Kit
    'presskit.title': 'Kit de Imprensa',
    'presskit.upload': 'Arraste e solte os seus ficheiros aqui ou clique para selecionar',
    'presskit.supported': 'Formatos suportados: PDF, JPG, PNG, MP3, MP4',
    'presskit.documents': 'Documentos',
    'presskit.no_documents': 'Nenhum documento disponível',
    
    // Booking
    'booking.title': 'Reservar este artista',
    'booking.date': 'Data do evento',
    'booking.time': 'Hora',
    'booking.duration': 'Duração',
    'booking.venue': 'Local',
    'booking.budget': 'Orçamento',
    'booking.message': 'Mensagem',
    'booking.submit': 'Enviar pedido',
    
    // Language selector
    'language.select': 'Selecionar idioma',
    'language.french': 'Francês',
    'language.english': 'Inglês',
    'language.spanish': 'Espanhol',
    'language.italian': 'Italiano',
    'language.german': 'Alemão',
    'language.portuguese': 'Português'
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Récupérer la langue sauvegardée ou utiliser le français par défaut
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || 'fr';
  });

  useEffect(() => {
    // Sauvegarder la langue sélectionnée
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};