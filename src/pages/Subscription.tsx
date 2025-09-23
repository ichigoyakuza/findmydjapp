import React, { useState } from 'react';
import { Check, Crown, Star, CreditCard, Shield, Zap, Loader2, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { SUBSCRIPTION_PLANS } from '../config/stripe';

const Subscription = () => {
  const { user } = useAuth();
  const { 
    isSubscribed, 
    currentPlan, 
    subscriptionStatus, 
    isLoading, 
    createCheckoutSession, 
    cancelSubscription,
    updateSubscription 
  } = useSubscription();

  const handleSubscribe = async (planId: keyof typeof SUBSCRIPTION_PLANS) => {
    if (!user) return;
    
    try {
      await createCheckoutSession(planId);
    } catch (error) {
      console.error('Erreur lors de l\'abonnement:', error);
      alert('Erreur lors du processus de paiement. Veuillez réessayer.');
    }
  };

  const handleCancelSubscription = async () => {
    if (!user) return;
    
    try {
      await cancelSubscription();
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      alert('Erreur lors de l\'annulation. Veuillez réessayer.');
    }
  };

  const handleChangePlan = async (planId: keyof typeof SUBSCRIPTION_PLANS) => {
    if (!user) return;
    
    try {
      await updateSubscription(planId);
    } catch (error) {
      console.error('Erreur lors du changement de plan:', error);
      alert('Erreur lors du changement de plan. Veuillez réessayer.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Connectez-vous pour accéder aux abonnements
          </h2>
          <p className="text-gray-600">
            Vous devez être connecté pour gérer vos abonnements.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choisissez votre plan d'abonnement
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Débloquez toutes les fonctionnalités de DJHUB et développez votre carrière de DJ
          </p>
        </div>

        {/* Current Subscription Status */}
        {isSubscribed && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Crown className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-green-900">
                    Abonnement actif : {currentPlan && SUBSCRIPTION_PLANS[currentPlan]?.name}
                  </h3>
                  <p className="text-green-700">
                    Statut : {subscriptionStatus === 'active' ? 'Actif' : subscriptionStatus}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCancelSubscription}
                disabled={isLoading}
                className="px-4 py-2 text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Annuler l\'abonnement'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plan Supporter */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 relative">
            <div className="text-center mb-8">
              <Star className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {SUBSCRIPTION_PLANS.supporter.name}
              </h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {SUBSCRIPTION_PLANS.supporter.price}€
                <span className="text-lg font-normal text-gray-600">/mois</span>
              </div>
              <p className="text-gray-600">Parfait pour commencer</p>
            </div>

            <ul className="space-y-4 mb-8">
              {SUBSCRIPTION_PLANS.supporter.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe('supporter')}
              disabled={isLoading || (currentPlan === 'supporter')}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                currentPlan === 'supporter'
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-50`}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              ) : currentPlan === 'supporter' ? (
                'Plan actuel'
              ) : isSubscribed ? (
                'Changer pour ce plan'
              ) : (
                'Choisir ce plan'
              )}
            </button>
          </div>

          {/* Plan Pro DJ */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-500 p-8 relative">
            {/* Badge Popular */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Le plus populaire
              </span>
            </div>

            <div className="text-center mb-8">
              <Crown className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {SUBSCRIPTION_PLANS.pro.name}
              </h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {SUBSCRIPTION_PLANS.pro.price}€
                <span className="text-lg font-normal text-gray-600">/mois</span>
              </div>
              <p className="text-gray-600">Pour les DJ professionnels</p>
            </div>

            <ul className="space-y-4 mb-8">
              {SUBSCRIPTION_PLANS.pro.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe('pro')}
              disabled={isLoading || (currentPlan === 'pro')}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                currentPlan === 'pro'
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              } disabled:opacity-50`}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              ) : currentPlan === 'pro' ? (
                'Plan actuel'
              ) : isSubscribed ? (
                'Changer pour ce plan'
              ) : (
                'Choisir ce plan'
              )}
            </button>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Pourquoi choisir un abonnement DJHUB ?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Paiements sécurisés
              </h4>
              <p className="text-gray-600">
                Tous les paiements sont traités de manière sécurisée via Stripe
              </p>
            </div>
            
            <div className="text-center">
              <Zap className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Accès instantané
              </h4>
              <p className="text-gray-600">
                Débloquez immédiatement toutes les fonctionnalités premium
              </p>
            </div>
            
            <div className="text-center">
              <CreditCard className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Annulation facile
              </h4>
              <p className="text-gray-600">
                Annulez votre abonnement à tout moment, sans frais cachés
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Questions fréquentes
          </h3>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Comment fonctionne le paiement ?
              </h4>
              <p className="text-gray-600">
                Les paiements sont traités de manière sécurisée via Stripe. Votre abonnement se renouvelle automatiquement chaque mois.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Puis-je changer de plan ?
              </h4>
              <p className="text-gray-600">
                Oui, vous pouvez passer d'un plan à l'autre à tout moment. Les changements prennent effet immédiatement.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Que se passe-t-il si j'annule ?
              </h4>
              <p className="text-gray-600">
                Vous gardez l'accès aux fonctionnalités premium jusqu'à la fin de votre période de facturation actuelle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;