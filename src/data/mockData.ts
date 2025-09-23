// Données de test pour les fonctionnalités sociales de DJHUB

export interface MockUser {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar: string;
  bio: string;
  isDJ: boolean;
  followers: number;
  following: number;
  joinedDate: string;
}

export interface MockTrack {
  id: string;
  title: string;
  artist: string;
  djId: string;
  duration: string;
  genre: string;
  likes: number;
  plays: number;
  price: string;
  audioUrl?: string;
}

export interface MockReview {
  id: string;
  userId: string;
  djId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface MockPlaylistTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  proposedBy: string;
  votes: number;
  status: 'pending' | 'selected' | 'rejected';
  proposedDate: string;
}

export interface MockForumPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  category: 'question' | 'tip' | 'discussion' | 'equipment' | 'gig' | 'music';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  replies: number;
  views: number;
  isPinned: boolean;
  isSolved?: boolean;
}

export interface MockForumReply {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  likes: number;
  isAccepted?: boolean;
  parentReplyId?: string;
}

// Utilisateurs de test
export const mockUsers: MockUser[] = [
  {
    id: 'user1',
    username: 'musiclover92',
    email: 'sarah@example.com',
    name: 'Sarah Martin',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Passionnée de musique électronique et house',
    isDJ: false,
    followers: 45,
    following: 23,
    joinedDate: '2023-06-15'
  },
  {
    id: 'user2',
    username: 'djmike_official',
    email: 'mike@example.com',
    name: 'Mike Johnson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'DJ professionnel spécialisé en techno et house',
    isDJ: true,
    followers: 1250,
    following: 89,
    joinedDate: '2022-03-10'
  },
  {
    id: 'user3',
    username: 'beatseeker',
    email: 'alex@example.com',
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Découvreur de nouveaux talents et mélomane',
    isDJ: false,
    followers: 78,
    following: 156,
    joinedDate: '2023-01-20'
  },
  {
    id: 'user4',
    username: 'luna_dj',
    email: 'luna@example.com',
    name: 'Luna Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'DJ féminine spécialisée en deep house et afro',
    isDJ: true,
    followers: 890,
    following: 67,
    joinedDate: '2022-08-05'
  },
  {
    id: 'user5',
    username: 'partyking',
    email: 'thomas@example.com',
    name: 'Thomas Dubois',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    bio: 'Organisateur d\'événements et amateur de musique',
    isDJ: false,
    followers: 234,
    following: 45,
    joinedDate: '2023-04-12'
  }
];

// Tracks de test
export const mockTracks: MockTrack[] = [
  {
    id: 'track1',
    title: 'Midnight Groove',
    artist: 'DJ Nexus',
    djId: '1',
    duration: '4:32',
    genre: 'House',
    likes: 156,
    plays: 12543,
    price: 'Free'
  },
  {
    id: 'track2',
    title: 'Electric Dreams',
    artist: 'DJ Nexus',
    djId: '1',
    duration: '5:18',
    genre: 'Techno',
    likes: 89,
    plays: 8921,
    price: '$2.99'
  },
  {
    id: 'track3',
    title: 'Neon Nights',
    artist: 'DJ Nexus',
    djId: '1',
    duration: '6:45',
    genre: 'Progressive',
    likes: 203,
    plays: 15677,
    price: '$2.99'
  },
  {
    id: 'track4',
    title: 'Deep Ocean',
    artist: 'Luna Rodriguez',
    djId: 'user4',
    duration: '5:45',
    genre: 'Deep House',
    likes: 134,
    plays: 9876,
    price: '$1.99'
  },
  {
    id: 'track5',
    title: 'Techno Pulse',
    artist: 'Mike Johnson',
    djId: 'user2',
    duration: '6:12',
    genre: 'Techno',
    likes: 267,
    plays: 18432,
    price: '$3.99'
  }
];

// Avis de test
export const mockReviews: MockReview[] = [
  {
    id: 'review1',
    userId: 'user1',
    djId: '1',
    rating: 5,
    comment: 'Performance incroyable ! DJ Nexus a mis le feu à la piste de danse. Ses transitions sont parfaites et il sait vraiment lire la foule.',
    date: '2024-01-15'
  },
  {
    id: 'review2',
    userId: 'user3',
    djId: '1',
    rating: 4,
    comment: 'Très bon DJ avec un excellent sens du rythme. La sélection musicale était top, juste un petit bémol sur le volume qui était parfois trop fort.',
    date: '2024-01-10'
  },
  {
    id: 'review3',
    userId: 'user5',
    djId: '1',
    rating: 5,
    comment: 'DJ Nexus est un vrai professionnel ! Ponctuel, matériel de qualité et une playlist qui a fait danser tout le monde jusqu\'au bout de la nuit.',
    date: '2024-01-08'
  },
  {
    id: 'review4',
    userId: 'user1',
    djId: 'user2',
    rating: 4,
    comment: 'Mike Johnson maîtrise parfaitement la techno. Ambiance garantie pour les amateurs du genre !',
    date: '2024-01-12'
  },
  {
    id: 'review5',
    userId: 'user3',
    djId: 'user4',
    rating: 5,
    comment: 'Luna Rodriguez est une artiste exceptionnelle. Ses sets deep house sont magiques et créent une atmosphère unique.',
    date: '2024-01-14'
  }
];

// Playlist collaborative de test
export const mockCommunityPlaylist: MockPlaylistTrack[] = [
  // Morceaux sélectionnés (playlist officielle)
  {
    id: 'playlist1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    genre: 'Pop/Electronic',
    proposedBy: 'musiclover92',
    votes: 45,
    status: 'selected',
    proposedDate: '2024-01-01'
  },
  {
    id: 'playlist2',
    title: 'One More Time',
    artist: 'Daft Punk',
    genre: 'House',
    proposedBy: 'djmike_official',
    votes: 38,
    status: 'selected',
    proposedDate: '2024-01-02'
  },
  {
    id: 'playlist3',
    title: 'Levels',
    artist: 'Avicii',
    genre: 'Progressive House',
    proposedBy: 'beatseeker',
    votes: 42,
    status: 'selected',
    proposedDate: '2024-01-03'
  },
  {
    id: 'playlist4',
    title: 'Titanium',
    artist: 'David Guetta ft. Sia',
    genre: 'Electro House',
    proposedBy: 'luna_dj',
    votes: 35,
    status: 'selected',
    proposedDate: '2024-01-04'
  },
  {
    id: 'playlist5',
    title: 'Strobe',
    artist: 'Deadmau5',
    genre: 'Progressive House',
    proposedBy: 'partyking',
    votes: 29,
    status: 'selected',
    proposedDate: '2024-01-05'
  },
  
  // Propositions en cours
  {
    id: 'playlist6',
    title: 'Midnight City',
    artist: 'M83',
    genre: 'Synthwave',
    proposedBy: 'musiclover92',
    votes: 23,
    status: 'pending',
    proposedDate: '2024-01-18'
  },
  {
    id: 'playlist7',
    title: 'Satisfaction',
    artist: 'Benny Benassi',
    genre: 'Electro House',
    proposedBy: 'beatseeker',
    votes: 18,
    status: 'pending',
    proposedDate: '2024-01-19'
  },
  {
    id: 'playlist8',
    title: 'Pumped Up Kicks',
    artist: 'Foster The People',
    genre: 'Indie Electronic',
    proposedBy: 'djmike_official',
    votes: 15,
    status: 'pending',
    proposedDate: '2024-01-20'
  },
  {
    id: 'playlist9',
    title: 'Gecko',
    artist: 'Oliver Heldens',
    genre: 'Future House',
    proposedBy: 'luna_dj',
    votes: 12,
    status: 'pending',
    proposedDate: '2024-01-21'
  },
  {
    id: 'playlist10',
    title: 'Animals',
    artist: 'Martin Garrix',
    genre: 'Big Room House',
    proposedBy: 'partyking',
    votes: 8,
    status: 'pending',
    proposedDate: '2024-01-22'
  }
];

// Données de relations sociales (qui suit qui, qui a liké quoi)
export const mockSocialData = {
  follows: [
    { followerId: 'user1', followingId: '1' },
    { followerId: 'user1', followingId: 'user2' },
    { followerId: 'user1', followingId: 'user4' },
    { followerId: 'user3', followingId: '1' },
    { followerId: 'user3', followingId: 'user2' },
    { followerId: 'user5', followingId: '1' },
    { followerId: 'user5', followingId: 'user4' }
  ],
  likes: [
    { userId: 'user1', trackId: 'track1' },
    { userId: 'user1', trackId: 'track3' },
    { userId: 'user1', trackId: 'track5' },
    { userId: 'user3', trackId: 'track1' },
    { userId: 'user3', trackId: 'track2' },
    { userId: 'user3', trackId: 'track4' },
    { userId: 'user5', trackId: 'track1' },
    { userId: 'user5', trackId: 'track3' },
    { userId: 'user5', trackId: 'track5' }
  ]
};

// Comptes de test pour la démo
// Posts du forum
export const mockForumPosts: MockForumPost[] = [
  {
    id: 'post1',
    title: 'Comment bien débuter en tant que DJ débutant ?',
    content: 'Salut tout le monde ! Je viens de commencer le DJing et je me demande quels sont les équipements essentiels pour débuter. J\'ai un budget limité, que me conseillez-vous ?',
    authorId: 'user1',
    authorName: 'Sarah Martin',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    category: 'question',
    tags: ['débutant', 'équipement', 'conseil'],
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
    likes: 15,
    replies: 8,
    views: 156,
    isPinned: false,
    isSolved: false
  },
  {
    id: 'post2',
    title: 'Astuce : Organiser sa bibliothèque musicale efficacement',
    content: 'Après 5 ans de DJing, voici ma méthode pour organiser ma bibliothèque musicale :\n\n1. Créer des dossiers par genre principal\n2. Sous-dossiers par BPM (120-125, 125-130, etc.)\n3. Tags avec énergie (intro, buildup, drop, outro)\n4. Playlists par type d\'événement\n\nCela m\'a fait gagner énormément de temps en live !',
    authorId: 'user2',
    authorName: 'Mike Johnson',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    category: 'tip',
    tags: ['organisation', 'bibliothèque', 'workflow'],
    createdAt: '2024-01-19T14:15:00Z',
    updatedAt: '2024-01-19T14:15:00Z',
    likes: 42,
    replies: 12,
    views: 289,
    isPinned: true,
    isSolved: undefined
  },
  {
    id: 'post3',
    title: 'Problème avec mon contrôleur Pioneer DDJ-400',
    content: 'Bonjour, j\'ai un souci avec mon DDJ-400. Parfois le jog wheel de droite ne répond plus et je dois redémarrer Serato. Quelqu\'un a déjà eu ce problème ?',
    authorId: 'user3',
    authorName: 'Alex Rivera',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    category: 'equipment',
    tags: ['pioneer', 'ddj-400', 'problème technique'],
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    likes: 8,
    replies: 5,
    views: 94,
    isPinned: false,
    isSolved: true
  },
  {
    id: 'post4',
    title: 'Recherche DJ pour mariage à Lyon - 15 juin',
    content: 'Bonjour ! Je cherche un DJ pour mon mariage le 15 juin à Lyon. Ambiance variée (années 80-90, hits actuels, un peu d\'électro). Budget : 800-1200€. Qui serait disponible ?',
    authorId: 'user5',
    authorName: 'Thomas Dubois',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    category: 'gig',
    tags: ['mariage', 'lyon', 'juin', 'recherche'],
    createdAt: '2024-01-17T09:20:00Z',
    updatedAt: '2024-01-17T09:20:00Z',
    likes: 3,
    replies: 7,
    views: 67,
    isPinned: false,
    isSolved: undefined
  },
  {
    id: 'post5',
    title: 'Nouveaux tracks Afro House - Recommandations',
    content: 'Salut les amateurs d\'Afro House ! Je viens de découvrir quelques pépites :\n\n- Black Coffee - "You Need Me"\n- Keinemusik - "Sondela"\n- Âme - "Howling" (Ame Remix)\n\nVous avez d\'autres recommandations dans ce style ?',
    authorId: 'user4',
    authorName: 'Luna Rodriguez',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    category: 'music',
    tags: ['afro house', 'recommandations', 'nouveautés'],
    createdAt: '2024-01-16T20:10:00Z',
    updatedAt: '2024-01-16T20:10:00Z',
    likes: 28,
    replies: 15,
    views: 203,
    isPinned: false,
    isSolved: undefined
  },
  {
    id: 'post6',
    title: 'Discussion : L\'avenir du DJing avec l\'IA',
    content: 'Avec l\'arrivée d\'outils IA pour le mixage automatique, pensez-vous que cela va changer notre métier ? Est-ce une menace ou une opportunité ? J\'aimerais avoir vos avis !',
    authorId: 'user1',
    authorName: 'Sarah Martin',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    category: 'discussion',
    tags: ['IA', 'futur', 'technologie', 'débat'],
    createdAt: '2024-01-15T11:30:00Z',
    updatedAt: '2024-01-15T11:30:00Z',
    likes: 19,
    replies: 23,
    views: 178,
    isPinned: false,
    isSolved: undefined
  }
];

// Réponses du forum
export const mockForumReplies: MockForumReply[] = [
  {
    id: 'reply1',
    postId: 'post1',
    content: 'Pour débuter, je recommande un contrôleur Pioneer DDJ-FLX4 ou DDJ-SB3. Avec un casque Audio-Technica ATH-M40x, tu as une base solide pour moins de 400€ !',
    authorId: 'user2',
    authorName: 'Mike Johnson',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-01-20T11:15:00Z',
    likes: 8,
    isAccepted: true
  },
  {
    id: 'reply2',
    postId: 'post1',
    content: 'N\'oublie pas un bon logiciel ! Serato DJ Lite est gratuit et parfait pour commencer. Virtual DJ aussi.',
    authorId: 'user4',
    authorName: 'Luna Rodriguez',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-01-20T12:30:00Z',
    likes: 5
  },
  {
    id: 'reply3',
    postId: 'post2',
    content: 'Excellente méthode ! J\'ajoute que les cue points sont essentiels aussi. Je marque toujours l\'intro, le premier drop, et l\'outro.',
    authorId: 'user3',
    authorName: 'Alex Rivera',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-01-19T15:45:00Z',
    likes: 12
  },
  {
    id: 'reply4',
    postId: 'post3',
    content: 'J\'ai eu exactement le même problème ! C\'est souvent un problème de driver USB. Essaie de mettre à jour les drivers Pioneer et redémarre ton PC.',
    authorId: 'user2',
    authorName: 'Mike Johnson',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-01-18T17:20:00Z',
    likes: 6,
    isAccepted: true
  },
  {
    id: 'reply5',
    postId: 'post4',
    content: 'Salut ! Je suis disponible cette date. DJ spécialisé mariages depuis 3 ans, matériel pro et playlist adaptable. MP moi pour plus d\'infos !',
    authorId: 'user2',
    authorName: 'Mike Johnson',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-01-17T10:45:00Z',
    likes: 2
  },
  {
    id: 'reply6',
    postId: 'post5',
    content: 'Merci pour ces découvertes ! Je recommande aussi "Bambaataa" de Shugasmakx et tout l\'album "Music Is King" de Black Coffee.',
    authorId: 'user1',
    authorName: 'Sarah Martin',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-01-16T21:30:00Z',
    likes: 9
  }
];

export const testAccounts = {
  user: {
    email: 'test@djhub.com',
    password: 'test123',
    name: 'Utilisateur Test',
    username: 'testuser'
  },
  dj: {
    email: 'dj@djhub.com',
    password: 'dj123',
    name: 'DJ Test',
    username: 'testdj'
  }
};