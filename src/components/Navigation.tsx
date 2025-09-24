import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Music, Search, Calendar, Settings, Menu, X, MapPin, Users, CreditCard, Home, LogIn, UserPlus, User, MessageSquare, MessageCircle, Bell, Headphones } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from './LanguageSelector';
import AuthModal from './AuthModal';
import NotificationCenter from './NotificationCenter';
import { useNotifications } from '../hooks/useNotifications';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  
  // Hook pour les notifications
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification
  } = useNotifications(user?.id);

  const navItems = [
    { path: '/', label: t('nav.discovery'), icon: Search },
    { path: '/map', label: t('map.title'), icon: MapPin },
    { path: '/community', label: t('community.title'), icon: Users },
    { path: '/forum', label: t('nav.forum'), icon: MessageSquare },
    { path: '/messages', label: t('nav.messages'), icon: MessageCircle },
    { path: '/events', label: t('nav.events'), icon: Calendar },
    { path: '/artists', label: t('nav.artists'), icon: Music },
    { path: '/music-store', label: t('nav.musicStore'), icon: Music },
    { path: '/music-hub', label: t('nav.musicHub'), icon: Headphones },
    { path: '/subscription', label: t('nav.subscription'), icon: CreditCard },
    { path: '/dashboard', label: t('nav.dashboard'), icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Effet de scroll pour la navigation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Gestionnaire d'action pour les notifications
  const handleNotificationAction = (notification: any) => {
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setNotificationCenterOpen(false);
    }
  };

  return (
    <>
      {/* Navigation Desktop */}
      <nav className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-dark-950/95 backdrop-blur-xl border-b border-dark-700 shadow-2xl' 
          : 'bg-dark-950/80 backdrop-blur-md border-b border-dark-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img 
                  src="/logo.svg" 
                  alt="DJHUB Logo" 
                  className="w-10 h-10 lg:w-12 lg:h-12 transition-transform duration-300 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-primary-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <span className="text-xl lg:text-2xl font-bold text-gradient">
                DJHUB
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.slice(0, 6).map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive(path)
                      ? 'bg-gradient-to-r from-purple-500/20 to-primary-500/20 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-dark-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{label}</span>
                </Link>
              ))}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {isAuthenticated && (
                <button
                  onClick={() => setNotificationCenterOpen(true)}
                  className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-dark-800/50 transition-all duration-300"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              )}
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-primary-500/20 text-white hover:from-purple-500/30 hover:to-primary-500/30 transition-all duration-300"
                  >
                    <User className="w-4 h-4" />
                    <span className="font-medium text-sm">{user?.name || 'Profil'}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
                  >
                    <LogIn className="w-4 h-4 rotate-180" />
                    <span className="font-medium text-sm">{t('nav.logout')}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setAuthModalOpen(true);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-dark-800/50 transition-all duration-300"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="font-medium text-sm">Connexion</span>
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setAuthModalOpen(true);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-primary-500 text-white hover:from-purple-600 hover:to-primary-600 transition-all duration-300"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="font-medium text-sm">S'inscrire</span>
                  </button>
                </div>
              )}
              
              <LanguageSelector />
            </div>
          </div>
        </div>
      </nav>

      {/* Navigation Mobile uniquement */}
      <nav className={`md:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-dark-950/95 backdrop-blur-xl border-b border-dark-700 shadow-2xl' 
          : 'bg-dark-950/80 backdrop-blur-md border-b border-dark-800'
      }`}>
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img 
                  src="/logo.svg" 
                  alt="DJHUB Logo" 
                  className="w-10 h-10 lg:w-12 lg:h-12 transition-transform duration-300 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-primary-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <span className="text-xl lg:text-2xl font-bold text-gradient">
                DJHUB
              </span>
            </Link>

            {/* Bouton utilisateur/menu mobile */}
            <div className="flex items-center space-x-2">
              {isAuthenticated && (
                <button
                  onClick={() => setNotificationCenterOpen(true)}
                  className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-dark-800/50 transition-all duration-300"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              )}
              
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-primary-500/20 text-white"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium text-sm">{user?.name || 'Profil'}</span>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-primary-500 text-white"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="font-medium text-sm">Connexion</span>
                </button>
              )}
              
              {/* Sélecteur de langue - après le bouton de connexion */}
              <div>
                <LanguageSelector />
              </div>
              
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-dark-800/50 transition-all duration-300"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Menu déroulant mobile */}
          {isOpen && (
            <div className="py-4 border-t border-dark-700">
              <div className="space-y-1">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive(path)
                        ? 'bg-gradient-to-r from-purple-500/20 to-primary-500/20 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-dark-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{label}</span>
                  </Link>
                ))}
                
                {/* Actions utilisateur */}
                {isAuthenticated && (
                  <div className="border-t border-dark-700 mt-4 pt-4">
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 w-full text-left"
                    >
                      <LogIn className="w-5 h-5 rotate-180" />
                      <span className="font-medium">{t('nav.logout')}</span>
                    </button>
                  </div>
                )}
                
                {!isAuthenticated && (
                  <div className="border-t border-dark-700 mt-4 pt-4">
                    <button
                      onClick={() => {
                        setAuthMode('register');
                        setAuthModalOpen(true);
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-primary-500 text-white w-full text-left"
                    >
                      <UserPlus className="w-5 h-5" />
                      <span className="font-medium">{t('nav.createAccount')}</span>
                    </button>
                  </div>
                )}
                
                <div className="px-4 py-3 border-t border-dark-700 mt-4">
                  <LanguageSelector />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Navigation Mobile Bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 mobile-nav">
        <div className="flex items-center justify-around py-3 px-2">
          {[
            { path: '/', label: t('nav.discovery'), icon: Search },
            { path: '/map', label: t('map.title'), icon: MapPin },
            { path: '/forum', label: t('nav.forum'), icon: MessageSquare },
            { path: '/events', label: t('nav.events'), icon: Calendar },
            { path: '/dashboard', label: t('nav.dashboard'), icon: User }
          ].map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-300 min-w-0 ${
                isActive(path)
                  ? 'text-purple-400 bg-purple-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-dark-800/50'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium truncate">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Spacer pour éviter le chevauchement avec le contenu */}
      <div className="h-16"></div>
      <div className="md:hidden mobile-content"></div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />

      {/* Notification Center */}
      {isAuthenticated && (
        <NotificationCenter
          isOpen={notificationCenterOpen}
          onClose={() => setNotificationCenterOpen(false)}
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onArchive={archiveNotification}
          onDelete={deleteNotification}
          onAction={handleNotificationAction}
          currentUserId={user?.id}
        />
      )}
    </>
  );
};

export default Navigation;