import React, { useState, useEffect } from 'react';
import { X, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { passwordResetService } from '../services/passwordResetService';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token?: string;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: string;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  token 
}) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    color: 'text-gray-400'
  });

  if (!isOpen) return null;

  // Validation du token au montage
  useEffect(() => {
    if (isOpen && !token) {
      setError('Lien de réinitialisation invalide ou expiré');
    }
  }, [isOpen, token]);

  // Calcul de la force du mot de passe
  useEffect(() => {
    const password = formData.password;
    if (!password) {
      setPasswordStrength({ score: 0, feedback: [], color: 'text-gray-400' });
      return;
    }

    let score = 0;
    const feedback: string[] = [];

    // Longueur
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Au moins 8 caractères');
    }

    // Majuscules
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Une majuscule');
    }

    // Minuscules
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Une minuscule');
    }

    // Chiffres
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Un chiffre');
    }

    // Caractères spéciaux
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Un caractère spécial');
    }

    let color = 'text-red-400';
    if (score >= 4) color = 'text-green-400';
    else if (score >= 3) color = 'text-yellow-400';
    else if (score >= 2) color = 'text-orange-400';

    setPasswordStrength({ score, feedback, color });
  }, [formData.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordStrength.score < 3) {
      setError('Le mot de passe n\'est pas assez fort');
      return;
    }

    if (!token) {
      setError('Token de réinitialisation manquant');
      return;
    }

    setLoading(true);

    try {
      const result = await passwordResetService.resetPassword(token, formData.password);
      
      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Erreur lors de la réinitialisation. Veuillez réessayer.');
      }
    } catch (err) {
      setError('Erreur lors de la réinitialisation. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const getStrengthText = () => {
    switch (passwordStrength.score) {
      case 0:
      case 1: return 'Très faible';
      case 2: return 'Faible';
      case 3: return 'Moyen';
      case 4: return 'Fort';
      case 5: return 'Très fort';
      default: return '';
    }
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
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Nouveau mot de passe
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Choisissez un mot de passe sécurisé pour votre compte
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nouveau mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              Nouveau mot de passe
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
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Indicateur de force */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Force du mot de passe</span>
                  <span className={`text-xs font-medium ${passwordStrength.color}`}>
                    {getStrengthText()}
                  </span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.score <= 1 ? 'bg-red-500' :
                      passwordStrength.score === 2 ? 'bg-orange-500' :
                      passwordStrength.score === 3 ? 'bg-yellow-500' :
                      passwordStrength.score === 4 ? 'bg-green-500' :
                      'bg-green-600'
                    }`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    Manque : {passwordStrength.feedback.join(', ')}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Confirmation mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="input-field pr-12"
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Validation de correspondance */}
            {formData.confirmPassword && (
              <div className="mt-1 flex items-center">
                {formData.password === formData.confirmPassword ? (
                  <div className="flex items-center text-green-400 text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Les mots de passe correspondent
                  </div>
                ) : (
                  <div className="flex items-center text-red-400 text-xs">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Les mots de passe ne correspondent pas
                  </div>
                )}
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
            disabled={loading || passwordStrength.score < 3 || formData.password !== formData.confirmPassword || !token}
            className="btn-primary w-full py-3 text-base font-medium hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Réinitialiser le mot de passe
              </>
            )}
          </button>
        </form>

        {/* Security Tips */}
        <div className="mt-6 p-4 bg-dark-800/50 rounded-xl border border-dark-700/50">
          <p className="text-xs text-gray-400 font-medium mb-2">Conseils de sécurité :</p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• Utilisez un mot de passe unique pour ce compte</li>
            <li>• Mélangez majuscules, minuscules, chiffres et symboles</li>
            <li>• Évitez les informations personnelles</li>
            <li>• Considérez l'utilisation d'un gestionnaire de mots de passe</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal;