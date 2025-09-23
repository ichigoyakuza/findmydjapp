import React, { ReactNode } from 'react';
import { Crown, Lock, Star } from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface PremiumGuardProps {
  children: ReactNode;
  requiredPlan?: 'supporter' | 'pro';
  fallback?: ReactNode;
  showUpgrade?: boolean;
}

const PremiumGuard: React.FC<PremiumGuardProps> = ({ 
  children, 
  requiredPlan = 'supporter',
  fallback,
  showUpgrade = true 
}) => {
  const { user } = useAuth();
  const { isSubscribed, currentPlan } = useSubscription();

  // Si l'utilisateur n'est pas connecté
  if (!user) {
    return fallback || (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Connexion requise
        </h3>
        <p className="text-gray-600 mb-4">
          Vous devez être connecté pour accéder à ce contenu.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  // Si l'utilisateur est un fan (non-DJ), accès gratuit à tout le contenu
  if (!user.isDJ) {
    return <>{children}</>;
  }

  // Pour les DJs, vérifier l'abonnement
  if (!isSubscribed) {
    return fallback || (showUpgrade ? (
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 text-center">
        <Crown className="h-12 w-12 text-purple-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Contenu Premium pour DJs
        </h3>
        <p className="text-gray-600 mb-4">
          En tant que DJ, abonnez-vous pour débloquer les outils professionnels.
        </p>
        <Link
          to="/subscription"
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Crown className="h-4 w-4 mr-2" />
          Voir les plans DJ
        </Link>
      </div>
    ) : null);
  }

  // Vérifier si le plan actuel est suffisant
  const planHierarchy = { supporter: 1, pro: 2 };
  const userPlanLevel = currentPlan ? planHierarchy[currentPlan] : 0;
  const requiredPlanLevel = planHierarchy[requiredPlan];

  if (userPlanLevel < requiredPlanLevel) {
    return fallback || (showUpgrade ? (
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 text-center">
        <Star className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Mise à niveau requise
        </h3>
        <p className="text-gray-600 mb-4">
          Cette fonctionnalité nécessite un abonnement {requiredPlan === 'pro' ? 'Pro DJ' : 'Supporter'}.
        </p>
        <Link
          to="/subscription"
          className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          <Crown className="h-4 w-4 mr-2" />
          Mettre à niveau
        </Link>
      </div>
    ) : null);
  }

  // L'utilisateur a accès au contenu
  return <>{children}</>;
};

export default PremiumGuard;