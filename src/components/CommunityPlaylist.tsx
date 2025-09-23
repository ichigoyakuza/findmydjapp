import React, { useState } from 'react';
import { Music, Plus, Play, Download, Vote, Calendar, Users, Headphones } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Track {
  id: string;
  title: string;
  artist: string;
  proposedBy: string;
  proposedByAvatar: string;
  votes: number;
  duration: string;
  genre: string;
  isSelected: boolean;
  proposedAt: string;
}

interface CommunityPlaylistProps {
  onAuthRequired?: () => void;
}

const CommunityPlaylist: React.FC<CommunityPlaylistProps> = ({ onAuthRequired }) => {
  const { isAuthenticated, user } = useAuth();
  const [showAddTrack, setShowAddTrack] = useState(false);
  const [newTrack, setNewTrack] = useState({
    title: '',
    artist: '',
    genre: ''
  });

  // Données de test pour la playlist collaborative
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: '1',
      title: 'Midnight City',
      artist: 'M83',
      proposedBy: 'Sophie Martin',
      proposedByAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      votes: 15,
      duration: '4:03',
      genre: 'Electronic',
      isSelected: true,
      proposedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'One More Time',
      artist: 'Daft Punk',
      proposedBy: 'Marc Dubois',
      proposedByAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      votes: 23,
      duration: '5:20',
      genre: 'House',
      isSelected: true,
      proposedAt: '2024-01-14T14:20:00Z'
    },
    {
      id: '3',
      title: 'Strobe',
      artist: 'Deadmau5',
      proposedBy: 'Emma Rodriguez',
      proposedByAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      votes: 18,
      duration: '10:32',
      genre: 'Progressive House',
      isSelected: true,
      proposedAt: '2024-01-13T16:45:00Z'
    },
    {
      id: '4',
      title: 'Levels',
      artist: 'Avicii',
      proposedBy: 'Thomas Leroy',
      proposedByAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      votes: 31,
      duration: '3:18',
      genre: 'Progressive House',
      isSelected: true,
      proposedAt: '2024-01-12T11:15:00Z'
    },
    {
      id: '5',
      title: 'Satisfaction',
      artist: 'Benny Benassi',
      proposedBy: 'Léa Moreau',
      proposedByAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      votes: 12,
      duration: '4:52',
      genre: 'Electro House',
      isSelected: false,
      proposedAt: '2024-01-16T09:30:00Z'
    },
    {
      id: '6',
      title: 'Titanium',
      artist: 'David Guetta ft. Sia',
      proposedBy: 'Antoine Petit',
      proposedByAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      votes: 8,
      duration: '4:05',
      genre: 'EDM',
      isSelected: false,
      proposedAt: '2024-01-17T13:20:00Z'
    },
    {
      id: '7',
      title: 'Animals',
      artist: 'Martin Garrix',
      proposedBy: 'Camille Durand',
      proposedByAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      votes: 19,
      duration: '5:05',
      genre: 'Big Room',
      isSelected: true,
      proposedAt: '2024-01-11T18:40:00Z'
    },
    {
      id: '8',
      title: 'Clarity',
      artist: 'Zedd ft. Foxes',
      proposedBy: 'Julien Bernard',
      proposedByAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
      votes: 14,
      duration: '4:31',
      genre: 'Electro Pop',
      isSelected: true,
      proposedAt: '2024-01-10T20:15:00Z'
    }
  ]);

  const selectedTracks = tracks.filter(track => track.isSelected).sort((a, b) => b.votes - a.votes);
  const pendingTracks = tracks.filter(track => !track.isSelected).sort((a, b) => b.votes - a.votes);

  const currentMonth = new Date().toLocaleDateString('fr-FR', { 
    month: 'long', 
    year: 'numeric' 
  });

  const handleSubmitTrack = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      onAuthRequired?.();
      return;
    }

    if (newTrack.title.trim() && newTrack.artist.trim()) {
      const track: Track = {
        id: Date.now().toString(),
        title: newTrack.title.trim(),
        artist: newTrack.artist.trim(),
        proposedBy: user.name,
        proposedByAvatar: user.avatar,
        votes: 1,
        duration: '3:30',
        genre: newTrack.genre || 'Electronic',
        isSelected: false,
        proposedAt: new Date().toISOString()
      };

      setTracks(prev => [...prev, track]);
      setNewTrack({ title: '', artist: '', genre: '' });
      setShowAddTrack(false);
    }
  };

  const handleVote = (trackId: string) => {
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }

    setTracks(prev => prev.map(track => 
      track.id === trackId 
        ? { ...track, votes: track.votes + 1 }
        : track
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Music className="w-8 h-8 text-purple-500 mr-3" />
          <h1 className="text-3xl font-bold text-white">Mixtape du Mois</h1>
        </div>
        <p className="text-gray-400 text-lg mb-2">
          Playlist collaborative - {currentMonth}
        </p>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {tracks.length} propositions
          </div>
          <div className="flex items-center">
            <Headphones className="w-4 h-4 mr-1" />
            {selectedTracks.length} morceaux sélectionnés
          </div>
        </div>
      </div>

      {/* Lecteur de playlist */}
      <div className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 rounded-lg p-6 border border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Playlist Officielle</h2>
          <div className="flex space-x-3">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center">
              <Play className="w-4 h-4 mr-2" />
              Écouter
            </button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          {selectedTracks.slice(0, 10).map((track, index) => (
            <div key={track.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-purple-400 font-bold w-6">{index + 1}</span>
                <div>
                  <h3 className="text-white font-medium">{track.title}</h3>
                  <p className="text-gray-400 text-sm">{track.artist}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>{track.genre}</span>
                <span>{track.duration}</span>
                <div className="flex items-center">
                  <Vote className="w-4 h-4 mr-1" />
                  {track.votes}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proposer un morceau */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Proposer un morceau</h2>
          <button
            onClick={() => {
              if (!isAuthenticated) {
                onAuthRequired?.();
                return;
              }
              setShowAddTrack(!showAddTrack);
            }}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-cyan-700 transition-all flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </button>
        </div>

        {showAddTrack && (
          <form onSubmit={handleSubmitTrack} className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Titre du morceau
                </label>
                <input
                  type="text"
                  value={newTrack.title}
                  onChange={(e) => setNewTrack(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Nom du morceau"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Artiste
                </label>
                <input
                  type="text"
                  value={newTrack.artist}
                  onChange={(e) => setNewTrack(prev => ({ ...prev, artist: e.target.value }))}
                  placeholder="Nom de l'artiste"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Genre (optionnel)
              </label>
              <input
                type="text"
                value={newTrack.genre}
                onChange={(e) => setNewTrack(prev => ({ ...prev, genre: e.target.value }))}
                placeholder="House, Techno, Electronic..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Proposer
              </button>
              <button
                type="button"
                onClick={() => setShowAddTrack(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        <p className="text-gray-400 text-sm">
          Chaque utilisateur peut proposer un morceau par mois. Les 10 morceaux les plus votés seront sélectionnés pour la playlist officielle.
        </p>
      </div>

      {/* Morceaux en attente */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Propositions en cours</h2>
        
        <div className="space-y-3">
          {pendingTracks.map((track) => (
            <div key={track.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <img
                  src={track.proposedByAvatar}
                  alt={track.proposedBy}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-white font-medium">{track.title}</h3>
                  <p className="text-gray-400 text-sm">{track.artist}</p>
                  <p className="text-gray-500 text-xs">
                    Proposé par {track.proposedBy} • {formatDate(track.proposedAt)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm">{track.genre}</span>
                <button
                  onClick={() => handleVote(track.id)}
                  className="bg-purple-600 text-white px-3 py-1 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center"
                >
                  <Vote className="w-4 h-4 mr-1" />
                  {track.votes}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityPlaylist;