import React, { useState } from 'react';
import { X, User, Mail, Lock, UserPlus, LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import ForgotPasswordModal from './ForgotPasswordModal';
import ResetPasswordModal from './ResetPasswordModal';
import PasswordResetNotification from './PasswordResetNotification';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    type: 'fan' as 'fan' | 'dj' | 'organizer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // États pour la réinitialisation de mot de passe
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetToken, setResetToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<{
    isVisible: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    isVisible: false,
    type: 'success',
    message: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let success = false;
      
      if (mode === 'login') {
        success = await login(formData.email, formData.password);
        if (!success) {
          setError('Email ou mot de passe incorrect');
        }
      } else {
        success = await register(formData);
        if (!success) {
          setError('Erreur lors de l\'inscription');
        }
      }

      if (success) {
        onClose();
        setFormData({ name: '', email: '', password: '', type: 'fan' });
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Fonctions pour la réinitialisation de mot de passe
  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setShowResetPassword(false);
  };

  const handleResetSuccess = () => {
    setShowResetPassword(false);
    setNotification({
      isVisible: true,
      type: 'success',
      message: 'Votre mot de passe a été réinitialisé avec succès !'
    });
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({
      isVisible: true,
      type,
      message
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <div className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="card max-w-md w-full max-h-[90vh] overflow-y-auto relative animate-modal-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-dark-800/50 text-gray-400 hover:text-white hover:bg-dark-700/50 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 pt-2">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            {mode === 'login' ? (
              <LogIn className="w-8 h-8 text-white" />
            ) : (
              <UserPlus className="w-8 h-8 text-white" />
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {mode === 'login' ? 'Connexion' : 'Inscription'}
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            {mode === 'login' 
              ? 'Connectez-vous pour accéder aux fonctionnalités sociales'
              : 'Rejoignez la communauté DJHUB'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Nom
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder={t('forms.yourName')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type de compte
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="fan">{t('forms.fanMelomane')}</option>
                  <option value="dj">DJ</option>
                  <option value="organizer">Organisateur</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="input-field"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="input-field pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {mode === 'login' && (
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">
                  Utilisez "password123" pour tester
                </p>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 text-sm text-center p-3 rounded-lg animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base font-medium hover:scale-105 active:scale-95 disabled:hover:scale-100"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              <>
                {mode === 'login' ? (
                  <LogIn className="w-4 h-4 mr-2" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-2" />
                )}
                {mode === 'login' ? 'Se connecter' : 'S\'inscrire'}
              </>
            )}
          </button>
        </form>

        {/* Mode Switch */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            {mode === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
          </p>
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
              setFormData({ name: '', email: '', password: '', type: 'fan' });
            }}
            className="text-purple-400 hover:text-purple-300 font-medium mt-2 transition-colors"
          >
            {mode === 'login' ? 'Créer un compte' : 'Se connecter'}
          </button>
        </div>

        {/* Test Accounts */}
        {mode === 'login' && (
          <div className="mt-6 p-4 bg-dark-800/50 rounded-xl border border-dark-700/50">
            <p className="text-xs text-gray-400 mb-3 font-medium">Comptes de test :</p>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-dark-700/30 rounded-lg">
                <span className="text-gray-300">sophie@example.com</span>
                <span className="text-purple-400 text-xs">Fan</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-dark-700/30 rounded-lg">
                <span className="text-gray-300">marc@example.com</span>
                <span className="text-cyan-400 text-xs">Organisateur</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-dark-700/30 rounded-lg">
                <span className="text-gray-300">thomas@example.com</span>
                <span className="text-green-400 text-xs">DJ</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Mot de passe : password123
            </p>
          </div>
        )}
      </div>

      {/* Modal Mot de passe oublié */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={onClose}
        onBackToLogin={handleBackToLogin}
        onSuccess={(token) => {
          setResetToken(token);
          setShowForgotPassword(false);
          setShowResetPassword(true);
        }}
      />

      {/* Modal Réinitialisation */}
      <ResetPasswordModal
        isOpen={showResetPassword}
        onClose={handleBackToLogin}
        token={resetToken}
        onSuccess={handleResetSuccess}
      />

      {/* Notifications */}
      <PasswordResetNotification
        isVisible={notification.isVisible}
        type={notification.type}
        message={notification.message}
        onClose={hideNotification}
      />
    </div>
  );
};

export default AuthModal;