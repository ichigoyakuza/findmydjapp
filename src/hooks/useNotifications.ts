import { useState, useEffect, useCallback } from 'react';

interface Notification {
  id: string;
  type: 'booking' | 'message' | 'review' | 'payment' | 'system' | 'social';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isArchived: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    userId?: string;
    userName?: string;
    userAvatar?: string;
    bookingId?: string;
    amount?: number;
    currency?: string;
    eventDate?: string;
    rating?: number;
  };
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  archiveNotification: (notificationId: string) => void;
  deleteNotification: (notificationId: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead' | 'isArchived'>) => void;
  refreshNotifications: () => void;
}

// Données de démonstration
const demoNotifications: Notification[] = [
  {
    id: '1',
    type: 'booking',
    title: 'Nouvelle réservation confirmée',
    message: 'Votre réservation pour le mariage de Sarah et Tom a été confirmée pour le 15 juillet 2024.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    isRead: false,
    isArchived: false,
    priority: 'high',
    actionUrl: '/bookings/123',
    actionLabel: 'Voir les détails',
    metadata: {
      userName: 'Sarah Martin',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      bookingId: '123',
      amount: 800,
      currency: 'EUR',
      eventDate: '2024-07-15T18:00:00Z'
    }
  },
  {
    id: '2',
    type: 'message',
    title: 'Nouveau message de client',
    message: 'Bonjour, j\'aimerais discuter des détails de la playlist pour notre événement.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isRead: false,
    isArchived: false,
    priority: 'medium',
    actionUrl: '/messages/456',
    actionLabel: 'Répondre',
    metadata: {
      userId: '456',
      userName: 'Marc Dubois',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    }
  },
  {
    id: '3',
    type: 'review',
    title: 'Nouvel avis reçu',
    message: 'Excellent DJ ! L\'ambiance était parfaite pour notre soirée d\'entreprise.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    isRead: true,
    isArchived: false,
    priority: 'medium',
    actionUrl: '/reviews/789',
    actionLabel: 'Voir l\'avis',
    metadata: {
      userName: 'Julie Leroy',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
      rating: 5,
      eventDate: '2024-06-20T20:00:00Z'
    }
  },
  {
    id: '4',
    type: 'payment',
    title: 'Paiement reçu',
    message: 'Le paiement de 600€ pour votre prestation du 10 juin a été traité avec succès.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    isRead: true,
    isArchived: false,
    priority: 'high',
    actionUrl: '/payments/101',
    actionLabel: 'Voir le reçu',
    metadata: {
      amount: 600,
      currency: 'EUR',
      eventDate: '2024-06-10T19:00:00Z'
    }
  },
  {
    id: '5',
    type: 'social',
    title: 'Nouveau follower',
    message: 'DJ_MixMaster a commencé à vous suivre.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    isRead: false,
    isArchived: false,
    priority: 'low',
    actionUrl: '/profile/dj-mixmaster',
    actionLabel: 'Voir le profil',
    metadata: {
      userId: 'dj-mixmaster',
      userName: 'DJ MixMaster',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    }
  },
  {
    id: '6',
    type: 'system',
    title: 'Mise à jour de profil requise',
    message: 'Veuillez mettre à jour vos informations de profil pour améliorer votre visibilité.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    isRead: true,
    isArchived: false,
    priority: 'medium',
    actionUrl: '/profile/edit',
    actionLabel: 'Mettre à jour'
  },
  {
    id: '7',
    type: 'booking',
    title: 'Demande de réservation',
    message: 'Une nouvelle demande de réservation pour un anniversaire le 25 juillet.',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    isRead: false,
    isArchived: false,
    priority: 'urgent',
    actionUrl: '/bookings/pending/202',
    actionLabel: 'Répondre',
    metadata: {
      userName: 'Pierre Moreau',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
      bookingId: '202',
      amount: 450,
      currency: 'EUR',
      eventDate: '2024-07-25T21:00:00Z'
    }
  },
  {
    id: '8',
    type: 'message',
    title: 'Message de suivi',
    message: 'Merci pour la superbe soirée ! Nous recommanderons vos services.',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    isRead: true,
    isArchived: false,
    priority: 'low',
    actionUrl: '/messages/303',
    actionLabel: 'Répondre',
    metadata: {
      userName: 'Emma Rousseau',
      userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face'
    }
  }
];

export const useNotifications = (userId?: string): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simuler le chargement des notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // En production, ceci serait un appel API
        setNotifications(demoNotifications);
      } catch (err) {
        setError('Erreur lors du chargement des notifications');
        console.error('Error loading notifications:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, [userId]);

  // Marquer une notification comme lue
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  }, []);

  // Archiver une notification
  const archiveNotification = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isArchived: true }
          : notification
      )
    );
  }, []);

  // Supprimer une notification
  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  }, []);

  // Ajouter une nouvelle notification
  const addNotification = useCallback((newNotification: Omit<Notification, 'id' | 'timestamp' | 'isRead' | 'isArchived'>) => {
    const notification: Notification = {
      ...newNotification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      isRead: false,
      isArchived: false
    };

    setNotifications(prev => [notification, ...prev]);
  }, []);

  // Actualiser les notifications
  const refreshNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // En production, ceci serait un appel API pour récupérer les dernières notifications
      // Pour la démo, on ajoute une nouvelle notification
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: 'system',
        title: 'Notifications actualisées',
        message: 'Vos notifications ont été mises à jour.',
        timestamp: new Date().toISOString(),
        isRead: false,
        isArchived: false,
        priority: 'low'
      };
      
      setNotifications(prev => [newNotification, ...prev]);
    } catch (err) {
      setError('Erreur lors de l\'actualisation des notifications');
      console.error('Error refreshing notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Calculer le nombre de notifications non lues
  const unreadCount = notifications.filter(n => !n.isRead && !n.isArchived).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    addNotification,
    refreshNotifications
  };
};

export default useNotifications;