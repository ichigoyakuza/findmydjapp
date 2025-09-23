import React, { useState } from 'react';
import CommunityPlaylist from '../components/CommunityPlaylist';
import AuthModal from '../components/AuthModal';

const CommunityPage: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <CommunityPlaylist onAuthRequired={handleAuthRequired} />
      </div>
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default CommunityPage;