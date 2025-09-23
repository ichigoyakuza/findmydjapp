import { useState, useEffect, useCallback } from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url: string;
  coverArt?: string;
  genre?: string;
  year?: number;
  bpm?: number;
  key?: string;
  isLiked?: boolean;
  playCount?: number;
  rating?: number;
  addedAt?: string;
  addedBy?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: Track[];
  coverArt?: string;
  isPublic?: boolean;
  isCollaborative?: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  totalDuration: number;
  followers?: number;
  tags?: string[];
  category?: 'personal' | 'shared' | 'public' | 'favorites';
}

interface UsePlaylistReturn {
  playlists: Playlist[];
  favorites: Track[];
  currentPlaylist: Playlist | null;
  isLoading: boolean;
  error: string | null;
  createPlaylist: (playlist: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt' | 'totalDuration'>) => Promise<void>;
  updatePlaylist: (playlistId: string, updates: Partial<Playlist>) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  addToPlaylist: (playlistId: string, track: Track) => Promise<void>;
  removeFromPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  toggleLike: (track: Track) => Promise<void>;
  sharePlaylist: (playlist: Playlist) => Promise<void>;
  duplicatePlaylist: (playlist: Playlist) => Promise<void>;
  importPlaylist: (file: File) => Promise<void>;
  exportPlaylist: (playlist: Playlist) => Promise<void>;
  setCurrentPlaylist: (playlist: Playlist | null) => void;
  refreshPlaylists: () => Promise<void>;
}

export const usePlaylist = (userId?: string): UsePlaylistReturn => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [favorites, setFavorites] = useState<Track[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Données de démonstration
  const mockTracks: Track[] = [
    {
      id: '1',
      title: 'Summer Vibes',
      artist: 'DJ Sunshine',
      album: 'Beach Party',
      duration: 240,
      url: '/audio/summer-vibes.mp3',
      coverArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300',
      genre: 'House',
      year: 2023,
      bpm: 128,
      key: 'Am',
      isLiked: true,
      playCount: 156,
      rating: 4.8,
      addedAt: '2024-01-15T10:30:00Z',
      addedBy: userId || 'user1'
    },
    {
      id: '2',
      title: 'Midnight Drive',
      artist: 'Neon Dreams',
      album: 'Synthwave Collection',
      duration: 320,
      url: '/audio/midnight-drive.mp3',
      coverArt: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300',
      genre: 'Synthwave',
      year: 2023,
      bpm: 110,
      key: 'Dm',
      isLiked: false,
      playCount: 89,
      rating: 4.5,
      addedAt: '2024-01-14T15:45:00Z',
      addedBy: userId || 'user1'
    },
    {
      id: '3',
      title: 'Electric Storm',
      artist: 'Bass Master',
      album: 'Thunderous Beats',
      duration: 280,
      url: '/audio/electric-storm.mp3',
      coverArt: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300',
      genre: 'Dubstep',
      year: 2024,
      bpm: 140,
      key: 'Em',
      isLiked: true,
      playCount: 234,
      rating: 4.9,
      addedAt: '2024-01-13T20:15:00Z',
      addedBy: userId || 'user1'
    },
    {
      id: '4',
      title: 'Smooth Jazz Nights',
      artist: 'The Groove Collective',
      album: 'Late Night Sessions',
      duration: 360,
      url: '/audio/smooth-jazz.mp3',
      coverArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300',
      genre: 'Jazz',
      year: 2023,
      bpm: 95,
      key: 'Bb',
      isLiked: false,
      playCount: 67,
      rating: 4.3,
      addedAt: '2024-01-12T18:30:00Z',
      addedBy: userId || 'user1'
    },
    {
      id: '5',
      title: 'Festival Anthem',
      artist: 'Crowd Control',
      album: 'Main Stage Hits',
      duration: 300,
      url: '/audio/festival-anthem.mp3',
      coverArt: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300',
      genre: 'Progressive House',
      year: 2024,
      bpm: 132,
      key: 'C',
      isLiked: true,
      playCount: 445,
      rating: 4.7,
      addedAt: '2024-01-11T14:20:00Z',
      addedBy: userId || 'user1'
    }
  ];

  const mockPlaylists: Playlist[] = [
    {
      id: 'playlist1',
      name: 'Mes Favoris',
      description: 'Mes morceaux préférés du moment',
      tracks: mockTracks.filter(track => track.isLiked),
      coverArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300',
      isPublic: false,
      isCollaborative: false,
      createdBy: userId || 'user1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      totalDuration: mockTracks.filter(track => track.isLiked).reduce((sum, track) => sum + track.duration, 0),
      followers: 0,
      tags: ['favoris', 'personnel'],
      category: 'favorites'
    },
    {
      id: 'playlist2',
      name: 'Mix Électro',
      description: 'Les meilleurs sons électroniques pour faire la fête',
      tracks: mockTracks.filter(track => ['House', 'Synthwave', 'Dubstep', 'Progressive House'].includes(track.genre || '')),
      coverArt: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300',
      isPublic: true,
      isCollaborative: false,
      createdBy: userId || 'user1',
      createdAt: '2024-01-05T12:00:00Z',
      updatedAt: '2024-01-14T15:45:00Z',
      totalDuration: mockTracks.filter(track => ['House', 'Synthwave', 'Dubstep', 'Progressive House'].includes(track.genre || '')).reduce((sum, track) => sum + track.duration, 0),
      followers: 23,
      tags: ['électro', 'dance', 'party'],
      category: 'public'
    },
    {
      id: 'playlist3',
      name: 'Chill Vibes',
      description: 'Pour se détendre après une longue journée',
      tracks: [mockTracks[3]], // Jazz track
      coverArt: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300',
      isPublic: false,
      isCollaborative: true,
      createdBy: userId || 'user1',
      createdAt: '2024-01-10T16:30:00Z',
      updatedAt: '2024-01-12T18:30:00Z',
      totalDuration: mockTracks[3].duration,
      followers: 5,
      tags: ['chill', 'relax', 'jazz'],
      category: 'shared'
    }
  ];

  // Initialiser les données
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setPlaylists(mockPlaylists);
        setFavorites(mockTracks.filter(track => track.isLiked));
      } catch (err) {
        setError('Erreur lors du chargement des playlists');
        console.error('Error loading playlists:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const createPlaylist = useCallback(async (playlistData: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt' | 'totalDuration'>) => {
    try {
      const newPlaylist: Playlist = {
        ...playlistData,
        id: `playlist_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalDuration: playlistData.tracks.reduce((sum, track) => sum + track.duration, 0)
      };

      setPlaylists(prev => [newPlaylist, ...prev]);
    } catch (err) {
      setError('Erreur lors de la création de la playlist');
      throw err;
    }
  }, []);

  const updatePlaylist = useCallback(async (playlistId: string, updates: Partial<Playlist>) => {
    try {
      setPlaylists(prev => prev.map(playlist => 
        playlist.id === playlistId 
          ? { 
              ...playlist, 
              ...updates, 
              updatedAt: new Date().toISOString(),
              totalDuration: updates.tracks 
                ? updates.tracks.reduce((sum, track) => sum + track.duration, 0)
                : playlist.totalDuration
            }
          : playlist
      ));
    } catch (err) {
      setError('Erreur lors de la mise à jour de la playlist');
      throw err;
    }
  }, []);

  const deletePlaylist = useCallback(async (playlistId: string) => {
    try {
      setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
      if (currentPlaylist?.id === playlistId) {
        setCurrentPlaylist(null);
      }
    } catch (err) {
      setError('Erreur lors de la suppression de la playlist');
      throw err;
    }
  }, [currentPlaylist]);

  const addToPlaylist = useCallback(async (playlistId: string, track: Track) => {
    try {
      setPlaylists(prev => prev.map(playlist => 
        playlist.id === playlistId 
          ? { 
              ...playlist, 
              tracks: [...playlist.tracks, { ...track, addedAt: new Date().toISOString() }],
              updatedAt: new Date().toISOString(),
              totalDuration: playlist.totalDuration + track.duration
            }
          : playlist
      ));
    } catch (err) {
      setError('Erreur lors de l\'ajout à la playlist');
      throw err;
    }
  }, []);

  const removeFromPlaylist = useCallback(async (playlistId: string, trackId: string) => {
    try {
      setPlaylists(prev => prev.map(playlist => {
        if (playlist.id === playlistId) {
          const trackToRemove = playlist.tracks.find(t => t.id === trackId);
          const newTracks = playlist.tracks.filter(track => track.id !== trackId);
          return {
            ...playlist,
            tracks: newTracks,
            updatedAt: new Date().toISOString(),
            totalDuration: playlist.totalDuration - (trackToRemove?.duration || 0)
          };
        }
        return playlist;
      }));
    } catch (err) {
      setError('Erreur lors de la suppression de la piste');
      throw err;
    }
  }, []);

  const toggleLike = useCallback(async (track: Track) => {
    try {
      const isCurrentlyLiked = favorites.some(fav => fav.id === track.id);
      
      if (isCurrentlyLiked) {
        setFavorites(prev => prev.filter(fav => fav.id !== track.id));
      } else {
        setFavorites(prev => [...prev, { ...track, isLiked: true }]);
      }

      // Mettre à jour dans toutes les playlists
      setPlaylists(prev => prev.map(playlist => ({
        ...playlist,
        tracks: playlist.tracks.map(t => 
          t.id === track.id ? { ...t, isLiked: !isCurrentlyLiked } : t
        )
      })));
    } catch (err) {
      setError('Erreur lors de la mise à jour des favoris');
      throw err;
    }
  }, [favorites]);

  const sharePlaylist = useCallback(async (playlist: Playlist) => {
    try {
      // Simuler le partage
      const shareUrl = `${window.location.origin}/playlist/${playlist.id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: playlist.name,
          text: playlist.description || 'Découvrez cette playlist !',
          url: shareUrl
        });
      } else {
        // Fallback: copier dans le presse-papiers
        await navigator.clipboard.writeText(shareUrl);
        alert('Lien copié dans le presse-papiers !');
      }
    } catch (err) {
      setError('Erreur lors du partage');
      throw err;
    }
  }, []);

  const duplicatePlaylist = useCallback(async (playlist: Playlist) => {
    try {
      const duplicatedPlaylist: Playlist = {
        ...playlist,
        id: `playlist_${Date.now()}`,
        name: `${playlist.name} (Copie)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: false,
        isCollaborative: false,
        createdBy: userId || 'user1',
        followers: 0
      };

      setPlaylists(prev => [duplicatedPlaylist, ...prev]);
    } catch (err) {
      setError('Erreur lors de la duplication');
      throw err;
    }
  }, [userId]);

  const importPlaylist = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Valider le format
      if (!data.name || !Array.isArray(data.tracks)) {
        throw new Error('Format de fichier invalide');
      }

      const importedPlaylist: Playlist = {
        id: `playlist_${Date.now()}`,
        name: data.name,
        description: data.description || '',
        tracks: data.tracks,
        coverArt: data.coverArt,
        isPublic: false,
        isCollaborative: false,
        createdBy: userId || 'user1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalDuration: data.tracks.reduce((sum: number, track: Track) => sum + track.duration, 0),
        followers: 0,
        tags: data.tags || [],
        category: 'personal'
      };

      setPlaylists(prev => [importedPlaylist, ...prev]);
    } catch (err) {
      setError('Erreur lors de l\'importation');
      throw err;
    }
  }, [userId]);

  const exportPlaylist = useCallback(async (playlist: Playlist) => {
    try {
      const exportData = {
        name: playlist.name,
        description: playlist.description,
        tracks: playlist.tracks,
        coverArt: playlist.coverArt,
        tags: playlist.tags,
        exportedAt: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${playlist.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Erreur lors de l\'exportation');
      throw err;
    }
  }, []);

  const refreshPlaylists = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simuler un rechargement
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Recharger les données
      setPlaylists([...mockPlaylists]);
      setFavorites(mockTracks.filter(track => track.isLiked));
    } catch (err) {
      setError('Erreur lors du rechargement');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    playlists,
    favorites,
    currentPlaylist,
    isLoading,
    error,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addToPlaylist,
    removeFromPlaylist,
    toggleLike,
    sharePlaylist,
    duplicatePlaylist,
    importPlaylist,
    exportPlaylist,
    setCurrentPlaylist,
    refreshPlaylists
  };
};