import { loadStripe } from '@stripe/stripe-js';

// Configuration Stripe avec variables d'environnement
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo_key';

// Initialisation de Stripe
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Configuration des plans d'abonnement
export const SUBSCRIPTION_PLANS = {
  supporter: {
    id: 'price_supporter_monthly', // ID du prix Stripe à créer
    name: 'Supporter',
    price: 5,
    currency: 'eur',
    interval: 'month',
    features: [
      'Accès aux playlists exclusives',
      'Support prioritaire',
      'Badge Supporter',
      'Pas de publicité'
    ],
    popular: false
  },
  pro: {
    id: 'price_pro_monthly', // ID du prix Stripe à créer
    name: 'Pro DJ',
    price: 9,
    currency: 'eur',
    interval: 'month',
    features: [
      'Tous les avantages Supporter',
      'Outils DJ avancés',
      'Analytics détaillées',
      'Priorité dans les recherches',
      'Accès aux événements VIP'
    ],
    popular: true
  }
};

// Configuration Stripe pour les paiements
const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin;

export const STRIPE_CONFIG = {
  successUrl: `${APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
  cancelUrl: `${APP_URL}/subscription`,
  // URLs pour la vente de musique
  musicSaleSuccessUrl: `${APP_URL}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
  musicSaleCancelUrl: `${APP_URL}/music`,
  // Mode par défaut
  mode: 'subscription' as const
};

// Configuration des commissions (2% pour la plateforme)
export const COMMISSION_CONFIG = {
  platformFeePercent: 2, // 2% de commission
  currency: 'eur',
};

// Configuration Stripe Connect pour les DJs
export const STRIPE_CONNECT_CONFIG = {
  // URL de redirection après connexion du compte Stripe
  connectAccountUrl: `${APP_URL}/connect/callback`,
  // Configuration des transferts automatiques
  transferSettings: {
    interval: 'daily', // Transferts quotidiens
    delay_days: 2, // Délai de 2 jours pour les transferts
  },
};

// Types TypeScript
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  popular: boolean;
}

export interface StripeCustomer {
  id: string;
  email: string;
  subscriptionId?: string;
  subscriptionStatus?: 'active' | 'canceled' | 'past_due' | 'incomplete';
  currentPlan?: keyof typeof SUBSCRIPTION_PLANS;
}

// Nouveaux types pour le marketplace
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  genre?: string; // Genre musical
  price: number;
  currency: string;
  djId: string; // ID du DJ vendeur
  audioUrl?: string;
  coverUrl?: string;
}

export interface MarketplaceTransaction {
  id: string;
  trackId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  platformFee: number;
  sellerAmount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}