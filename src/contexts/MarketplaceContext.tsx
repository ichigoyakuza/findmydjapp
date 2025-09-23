import React, { createContext, useContext, useState, useEffect } from 'react';
import { stripePromise, COMMISSION_CONFIG, STRIPE_CONFIG, MusicTrack, MarketplaceTransaction } from '../config/stripe';
import { useAuth } from './AuthContext';

interface MarketplaceContextType {
  // État des ventes
  tracks: MusicTrack[];
  transactions: MarketplaceTransaction[];
  isLoading: boolean;
  
  // Revenus de la plateforme
  totalRevenue: number;
  monthlyRevenue: number;
  
  // Actions
  createMusicSale: (track: MusicTrack, buyerId: string) => Promise<void>;
  loadTracks: () => Promise<void>;
  loadTransactions: () => Promise<void>;
  updateTrackPrice: (trackId: string, newPrice: number) => void;
  calculateCommission: (amount: number) => { platformFee: number; sellerAmount: number };
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [transactions, setTransactions] = useState<MarketplaceTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);

  // Calculer la commission (2% pour la plateforme)
  const calculateCommission = (amount: number) => {
    const platformFee = Math.round(amount * (COMMISSION_CONFIG.platformFeePercent / 100) * 100) / 100;
    const sellerAmount = amount - platformFee;
    return { platformFee, sellerAmount };
  };

  // Créer une vente de musique avec Stripe
  const createMusicSale = async (track: MusicTrack, buyerId: string) => {
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    setIsLoading(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe non initialisé');
      }

      const { platformFee, sellerAmount } = calculateCommission(track.price);

      // Créer une session de checkout avec commission
      const response = await fetch('/api/create-music-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trackId: track.id,
          buyerId,
          sellerId: track.djId,
          amount: track.price,
          platformFee,
          sellerAmount,
          currency: track.currency,
          successUrl: STRIPE_CONFIG.musicSaleSuccessUrl,
          cancelUrl: STRIPE_CONFIG.musicSaleCancelUrl,
        }),
      });

      const session = await response.json();

      if (session.error) {
        throw new Error(session.error);
      }

      // Rediriger vers Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Enregistrer la transaction
      const transaction: MarketplaceTransaction = {
        id: session.id,
        trackId: track.id,
        buyerId,
        sellerId: track.djId,
        amount: track.price,
        platformFee,
        sellerAmount,
        currency: track.currency,
        status: 'pending',
        createdAt: new Date(),
      };

      setTransactions(prev => [...prev, transaction]);

    } catch (error) {
      console.error('Erreur lors de la création de la vente:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les tracks disponibles
  const loadTracks = async () => {
    setIsLoading(true);
    try {
      // Simulation - en production, ceci viendrait de votre API
      const mockTracks: MusicTrack[] = [
        {
          id: '1',
          title: 'Summer Vibes',
          artist: 'DJ Alex',
          price: 2.99,
          currency: 'eur',
          djId: 'dj_alex_123',
          audioUrl: '/audio/summer-vibes.mp3',
          coverUrl: '/covers/summer-vibes.jpg',
        },
        {
          id: '2',
          title: 'Night Drive',
          artist: 'DJ Sarah',
          price: 3.99,
          currency: 'eur',
          djId: 'dj_sarah_456',
          audioUrl: '/audio/night-drive.mp3',
          coverUrl: '/covers/night-drive.jpg',
        },
        {
          id: '3',
          title: 'Electronic Dreams',
          artist: 'DJ Mike',
          price: 4.99,
          currency: 'eur',
          djId: 'dj_mike_789',
          audioUrl: '/audio/electronic-dreams.mp3',
          coverUrl: '/covers/electronic-dreams.jpg',
        },
      ];

      setTracks(mockTracks);
    } catch (error) {
      console.error('Erreur lors du chargement des tracks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les transactions
  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      // Simulation - en production, ceci viendrait de votre API
      const mockTransactions: MarketplaceTransaction[] = [
        {
          id: 'txn_1',
          trackId: '1',
          buyerId: 'user_123',
          sellerId: 'dj_alex_123',
          amount: 2.99,
          platformFee: 0.06,
          sellerAmount: 2.93,
          currency: 'eur',
          status: 'completed',
          createdAt: new Date('2024-01-15'),
        },
        {
          id: 'txn_2',
          trackId: '2',
          buyerId: 'user_456',
          sellerId: 'dj_sarah_456',
          amount: 3.99,
          platformFee: 0.08,
          sellerAmount: 3.91,
          currency: 'eur',
          status: 'completed',
          createdAt: new Date('2024-01-16'),
        },
      ];

      setTransactions(mockTransactions);

      // Calculer les revenus
      const completedTransactions = mockTransactions.filter(t => t.status === 'completed');
      const total = completedTransactions.reduce((sum, t) => sum + t.platformFee, 0);
      const thisMonth = completedTransactions
        .filter(t => t.createdAt.getMonth() === new Date().getMonth())
        .reduce((sum, t) => sum + t.platformFee, 0);

      setTotalRevenue(total);
      setMonthlyRevenue(thisMonth);

    } catch (error) {
      console.error('Erreur lors du chargement des transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour le prix d'une track
  const updateTrackPrice = (trackId: string, newPrice: number) => {
    setTracks(prevTracks => 
      prevTracks.map(track => 
        track.id === trackId 
          ? { ...track, price: newPrice }
          : track
      )
    );
  };

  // Charger les données au montage
  useEffect(() => {
    loadTracks();
    loadTransactions();
  }, []);

  const value: MarketplaceContextType = {
    tracks,
    transactions,
    isLoading,
    totalRevenue,
    monthlyRevenue,
    createMusicSale,
    loadTracks,
    loadTransactions,
    updateTrackPrice,
    calculateCommission,
  };

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
};