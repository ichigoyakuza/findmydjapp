import React, { useState, useEffect } from 'react';
import { 
  Bell, X, Check, Calendar, MessageCircle, Star, Music, 
  DollarSign, Users, Clock, AlertCircle, Info, CheckCircle,
  Filter, MoreHorizontal, Trash2, Archive, Settings
} from 'lucide-react';

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

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onArchive?: (notificationId: string) => void;
  onDelete?: (notificationId: string) => void;
  onAction?: (notification: Notification) => void;
  currentUserId?: string;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onArchive,
  onDelete,
  onAction,
  currentUserId
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'booking' | 'message' | 'review' | 'payment'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'priority' | 'type'>('recent');

  // Filtrer les notifications
  const filteredNotifications = notifications
    .filter(notification => {
      if (notification.isArchived) return false;
      
      switch (filter) {
        case 'unread':
          return !notification.isRead;
        case 'booking':
        case 'message':
        case 'review':
        case 'payment':
          return notification.type === filter;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'type':
          return a.type.localeCompare(b.type);
        case 'recent':
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });

  const unreadCount = notifications.filter(n => !n.isRead && !n.isArchived).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'message':
        return <MessageCircle className="w-5 h-5 text-green-500" />;
      case 'review':
        return <Star className="w-5 h-5 text-yellow-500" />;
      case 'payment':
        return <DollarSign className="w-5 h-5 text-purple-500" />;
      case 'social':
        return <Users className="w-5 h-5 text-pink-500" />;
      case 'system':
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
      default:
        return 'border-l-gray-300 bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `Il y a ${diffInMinutes} min`;
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)}h`;
    } else if (diffInHours < 48) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      onMarkAsRead?.(notification.id);
    }
    if (notification.actionUrl && onAction) {
      onAction(notification);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {unreadCount}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={onMarkAllAsRead}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                disabled={unreadCount === 0}
              >
                Tout marquer lu
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filtres</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
              >
                <option value="recent">Plus récents</option>
                <option value="priority">Priorité</option>
                <option value="type">Type</option>
              </select>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'Toutes', count: notifications.filter(n => !n.isArchived).length },
                { value: 'unread', label: 'Non lues', count: unreadCount },
                { value: 'booking', label: 'Réservations', count: notifications.filter(n => n.type === 'booking' && !n.isArchived).length },
                { value: 'message', label: 'Messages', count: notifications.filter(n => n.type === 'message' && !n.isArchived).length },
                { value: 'review', label: 'Avis', count: notifications.filter(n => n.type === 'review' && !n.isArchived).length },
                { value: 'payment', label: 'Paiements', count: notifications.filter(n => n.type === 'payment' && !n.isArchived).length }
              ].map(({ value, label, count }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value as typeof filter)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    filter === value
                      ? 'bg-purple-100 border-purple-300 text-purple-700'
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Bell className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune notification
                </h3>
                <p className="text-sm text-center">
                  {filter === 'unread' 
                    ? 'Toutes vos notifications ont été lues'
                    : 'Vous n\'avez aucune notification pour le moment'
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 ${
                      !notification.isRead ? 'bg-blue-50' : 'bg-white'
                    } ${getPriorityColor(notification.priority)}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            
                            {/* Metadata */}
                            {notification.metadata && (
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                {notification.metadata.userName && (
                                  <div className="flex items-center space-x-1">
                                    {notification.metadata.userAvatar && (
                                      <img
                                        src={notification.metadata.userAvatar}
                                        alt={notification.metadata.userName}
                                        className="w-4 h-4 rounded-full"
                                      />
                                    )}
                                    <span>{notification.metadata.userName}</span>
                                  </div>
                                )}
                                {notification.metadata.amount && (
                                  <span className="font-medium text-green-600">
                                    {notification.metadata.amount}€
                                  </span>
                                )}
                                {notification.metadata.rating && (
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                    <span>{notification.metadata.rating}/5</span>
                                  </div>
                                )}
                                {notification.metadata.eventDate && (
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{new Date(notification.metadata.eventDate).toLocaleDateString('fr-FR')}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center space-x-1 ml-2">
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            <div className="flex items-center space-x-1">
                              {!notification.isRead && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onMarkAsRead?.(notification.id);
                                  }}
                                  className="text-gray-400 hover:text-green-500 transition-colors"
                                  title="Marquer comme lu"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onArchive?.(notification.id);
                                }}
                                className="text-gray-400 hover:text-blue-500 transition-colors"
                                title="Archiver"
                              >
                                <Archive className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete?.(notification.id);
                                }}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Button */}
                        {notification.actionLabel && notification.actionUrl && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAction?.(notification);
                            }}
                            className="mt-2 text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors"
                          >
                            {notification.actionLabel}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <button className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1">
                <Settings className="w-4 h-4" />
                <span>Paramètres</span>
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1">
                <Archive className="w-4 h-4" />
                <span>Archives</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;