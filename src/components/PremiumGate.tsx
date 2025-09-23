import React from 'react';
import { Crown, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface PremiumGateProps {
  children: React.ReactNode;
  feature: string;
  showUpgradePrompt?: boolean;
}

const PremiumGate: React.FC<PremiumGateProps> = ({ 
  children, 
  feature, 
  showUpgradePrompt = true 
}) => {
  const { user } = useAuth();

  // Si l'utilisateur n'est pas connecté ou est un fan, accès gratuit
  if (!user || !user.isDJ) {
    return <>{children}</>;
  }

  // Si l'utilisateur est DJ et a un abonnement premium, on affiche le contenu
  if (user.subscription === 'premium') {
    return <>{children}</>;
  }

  // Si l'utilisateur est DJ mais n'a pas d'abonnement premium
  if (!showUpgradePrompt) {
    return null;
  }

  return (
    <div className="relative">
      {/* Contenu flouté */}
      <div className="filter blur-sm pointer-events-none opacity-50">
        {children}
      </div>
      
      {/* Overlay de restriction */}
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm rounded-lg">
        <div className="text-center p-6 max-w-sm">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-lg font-semibold text-white mb-2">
            Fonctionnalité Premium DJ
          </h3>
          
          <p className="text-gray-300 text-sm mb-4">
            {feature} est disponible avec l'abonnement Premium pour les DJs
          </p>
          
          <Link
            to="/subscription"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all duration-300"
          >
            <Crown className="w-4 h-4" />
            <span>Abonnement DJ</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PremiumGate;