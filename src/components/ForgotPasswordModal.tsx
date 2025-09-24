import React, { useState } from 'react';
import { X, Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { passwordResetService } from '../services/passwordResetService';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
  onSuccess?: (token: string) => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ 
  isOpen, 
  onClose, 
  onBackToLogin,
  onSuccess 
}) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Veuillez saisir votre adresse email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await passwordResetService.sendResetEmail(email);
      
      if (result.success && result.token) {
        setSent(true);
        // Si onSuccess est fourni, on passe le token pour la suite du processus
        if (onSuccess) {
          setTimeout(() => {
            onSuccess(result.token!);
          }, 2000); // Laisser le temps de voir le message de succès
        }
      } else {
        setError(result.error || 'Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
       setLoading(false);
     }
   };

  const handleClose = () => {
    setEmail('');
    setError('');
    setSent(false);
    onClose();
  };

  const handleBackToLogin = () => {
    setEmail('');
    setError('');
    setSent(false);
    onBackToLogin();
  };

  return (
    <div className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="card max-w-md w-full max-h-[90vh] overflow-y-auto relative animate-modal-in">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-dark-800/50 text-gray-400 hover:text-white hover:bg-dark-700/50 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Back Button */}
        <button
          onClick={handleBackToLogin}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-dark-800/50 text-gray-400 hover:text-white hover:bg-dark-700/50 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {!sent ? (
          <>
            {/* Header */}
            <div className="text-center mb-6 pt-12">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Mot de passe oublié
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">
                Entrez votre adresse email pour recevoir un lien de réinitialisation
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Adresse email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field"
                  placeholder="votre@email.com"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-300 text-sm text-center p-3 rounded-lg animate-shake">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="btn-primary w-full py-3 text-base font-medium hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer le lien de réinitialisation
                  </>
                )}
              </button>
            </form>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-dark-800/50 rounded-xl border border-dark-700/50">
              <p className="text-xs text-gray-400 text-center">
                Vous recevrez un email avec un lien pour créer un nouveau mot de passe.
                Vérifiez aussi votre dossier spam.
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                Email envoyé !
              </h2>
              <p className="text-gray-400 text-sm sm:text-base mb-6">
                Nous avons envoyé un lien de réinitialisation à :
              </p>
              <p className="text-purple-400 font-medium mb-6">
                {email}
              </p>
              <p className="text-gray-400 text-sm mb-8">
                Cliquez sur le lien dans l'email pour créer un nouveau mot de passe.
                Le lien expire dans 24 heures.
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleBackToLogin}
                  className="btn-primary w-full py-3 text-base font-medium"
                >
                  Retour à la connexion
                </button>
                
                <button
                  onClick={() => {
                    setSent(false);
                    setEmail('');
                  }}
                  className="w-full py-3 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Renvoyer l'email
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;