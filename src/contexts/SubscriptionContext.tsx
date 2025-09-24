import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { SUBSCRIPTION_PLANS, StripeCustomer } from '../config/stripe';
import { showSuccess, showError } from '../utils/notifications';
import { t } from '../utils/translations';

interface SubscriptionContextType {
  isSubscribed: boolean;
  currentPlan: keyof typeof SUBSCRIPTION_PLANS | null;
  subscriptionStatus: string | null;
  customer: StripeCustomer | null;
  isLoading: boolean;
  createCheckoutSession: (planId: keyof typeof SUBSCRIPTION_PLANS) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  updateSubscription: (planId: keyof typeof SUBSCRIPTION_PLANS) => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<keyof typeof SUBSCRIPTION_PLANS | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [customer, setCustomer] = useState<StripeCustomer | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simuler la récupération des données d'abonnement
  useEffect(() => {
    if (isAuthenticated && user) {
      loadSubscriptionData();
    } else {
      resetSubscriptionData();
    }
  }, [isAuthenticated, user]);

  const loadSubscriptionData = async () => {
    setIsLoading(true);
    try {
      // TODO: Remplacer par un vrai appel API vers votre backend
      // qui interroge Stripe pour récupérer les données d'abonnement
      
      // Simulation avec localStorage pour la démo
      const savedSubscription = localStorage.getItem(`subscription_${user?.id}`);
      if (savedSubscription) {
        const subscriptionData = JSON.parse(savedSubscription);
        setIsSubscribed(subscriptionData.isSubscribed);
        setCurrentPlan(subscriptionData.currentPlan);
        setSubscriptionStatus(subscriptionData.status);
        setCustomer(subscriptionData.customer);
      } else {
        // Utilisateur non abonné
        setIsSubscribed(false);
        setCurrentPlan(null);
        setSubscriptionStatus(null);
        setCustomer(null);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données d\'abonnement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSubscriptionData = () => {
    setIsSubscribed(false);
    setCurrentPlan(null);
    setSubscriptionStatus(null);
    setCustomer(null);
  };

  const createCheckoutSession = async (planId: keyof typeof SUBSCRIPTION_PLANS) => {
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    setIsLoading(true);
    try {
      // TODO: Remplacer par un vrai appel API vers votre backend
      // qui crée une session Stripe Checkout
      
      // Simulation pour la démo
      const plan = SUBSCRIPTION_PLANS[planId];
      
      // Simuler la création d'une session Stripe
      const checkoutUrl = `https://checkout.stripe.com/pay/cs_test_simulation#${planId}`;
      
      // Pour la vraie implémentation, vous feriez quelque chose comme :
      /*
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.id,
          customerId: user.id,
          customerEmail: user.email,
        }),
      });
      
      const { url } = await response.json();
      window.location.href = url;
      */
      
      // Simulation : rediriger vers une page de succès après 2 secondes
      setTimeout(() => {
        const subscriptionData = {
          isSubscribed: true,
          currentPlan: planId,
          status: 'active',
          customer: {
            id: `cus_${user.id}`,
            email: user.email,
            subscriptionId: `sub_${Date.now()}`,
            subscriptionStatus: 'active' as const,
            currentPlan: planId
          }
        };
        
        localStorage.setItem(`subscription_${user.id}`, JSON.stringify(subscriptionData));
        setIsSubscribed(true);
        setCurrentPlan(planId);
        setSubscriptionStatus('active');
        setCustomer(subscriptionData.customer);
        
        showSuccess(t('notifications.subscriptionActivated').replace('{planName}', plan.name));
      }, 2000);
      
    } catch (error) {
      console.error('Erreur lors de la création de la session de paiement:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async () => {
    if (!customer?.subscriptionId) {
      throw new Error('Aucun abonnement actif trouvé');
    }

    setIsLoading(true);
    try {
      // TODO: Appel API pour annuler l'abonnement Stripe
      /*
      await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: customer.subscriptionId,
        }),
      });
      */
      
      // Simulation
      localStorage.removeItem(`subscription_${user?.id}`);
      resetSubscriptionData();
      showSuccess(t('notifications.subscriptionCancelled'));
      
    } catch (error) {
      console.error('Erreur lors de l\'annulation de l\'abonnement:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubscription = async (planId: keyof typeof SUBSCRIPTION_PLANS) => {
    if (!customer?.subscriptionId) {
      throw new Error('Aucun abonnement actif trouvé');
    }

    setIsLoading(true);
    try {
      // TODO: Appel API pour modifier l'abonnement Stripe
      const plan = SUBSCRIPTION_PLANS[planId];
      
      // Simulation
      const subscriptionData = {
        isSubscribed: true,
        currentPlan: planId,
        status: 'active',
        customer: {
          ...customer,
          currentPlan: planId
        }
      };
      
      localStorage.setItem(`subscription_${user?.id}`, JSON.stringify(subscriptionData));
      setCurrentPlan(planId);
      alert(`Abonnement mis à jour vers ${plan.name} ! (Simulation)`);
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'abonnement:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSubscription = async () => {
    await loadSubscriptionData();
  };

  const value: SubscriptionContextType = {
    isSubscribed,
    currentPlan,
    subscriptionStatus,
    customer,
    isLoading,
    createCheckoutSession,
    cancelSubscription,
    updateSubscription,
    refreshSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionContext;