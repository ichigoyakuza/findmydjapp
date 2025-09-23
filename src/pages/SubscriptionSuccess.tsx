import React, { useEffect } from 'react';
import { CheckCircle, Crown, ArrowRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useAuth } from '../contexts/AuthContext';

const SubscriptionSuccess = () => {
  const { user } = useAuth();
  const { refreshSubscription, currentPlan, isSubscribed } = useSubscription();

  useEffect(() => {
    // Actualiser les données d'abonnement au chargement de la page
    refreshSubscription();
  }, [refreshSubscription]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Icône de succès */}
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>

          {/* Titre principal */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Paiement réussi !
          </h1>

          {/* Message de confirmation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-center mb-4">
              <Crown className="h-8 w-8 text-purple-600 mr-2" />
              <span className="text-lg font-semibold text-gray-900">
                Abonnement activé
              </span>
            </div>
            
            {isSubscribed && currentPlan ? (
              <div className="text-center">
                <p className="text-gray-600 mb-2">
                  Votre abonnement <strong>{currentPlan === 'supporter' ? 'Supporter' : 'Pro DJ'}</strong> est maintenant actif.
                </p>
                <p className="text-sm text-gray-500">
                  Bienvenue dans la communauté premium DJHUB !
                </p>
              </div>
            ) : (
              <p className="text-gray-600 text-center">
                Votre abonnement premium est maintenant actif.
              </p>
            )}
          </div>

          {/* Avantages débloqués */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Fonctionnalités débloquées
            </h3>
            <ul className="text-left space-y-2 text-sm text-gray-700">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                Accès aux playlists exclusives
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                Support prioritaire
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                Badge premium sur votre profil
              </li>
              {currentPlan === 'pro' && (
                <>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Outils DJ avancés
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Analytics détaillées
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Link
              to="/dashboard"
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              <Crown className="h-5 w-5 mr-2" />
              Accéder au Dashboard
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>

            <Link
              to="/"
              className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Home className="h-5 w-5 mr-2" />
              Retour à l'accueil
            </Link>
          </div>

          {/* Informations supplémentaires */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Vous recevrez un email de confirmation dans quelques minutes.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Des questions ? Contactez notre{' '}
              <a href="mailto:support@djhub.com" className="text-purple-600 hover:text-purple-500">
                support client
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;