import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface PasswordResetNotificationProps {
  isVisible: boolean;
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const PasswordResetNotification: React.FC<PasswordResetNotificationProps> = ({
  isVisible,
  type,
  message,
  onClose,
  autoClose = true,
  duration = 5000
}) => {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' 
    ? 'bg-green-500/20 border-green-500/50' 
    : 'bg-red-500/20 border-red-500/50';
  
  const textColor = type === 'success' ? 'text-green-300' : 'text-red-300';
  const iconColor = type === 'success' ? 'text-green-400' : 'text-red-400';

  return (
    <div className="fixed top-4 right-4 z-[60] animate-slide-in-right">
      <div className={`${bgColor} border rounded-lg p-4 max-w-sm shadow-lg backdrop-blur-sm`}>
        <div className="flex items-start space-x-3">
          <div className={`flex-shrink-0 ${iconColor}`}>
            {type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
          </div>
          
          <div className="flex-1">
            <p className={`text-sm font-medium ${textColor}`}>
              {type === 'success' ? 'Succès' : 'Erreur'}
            </p>
            <p className="text-sm text-gray-300 mt-1">
              {message}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {autoClose && (
          <div className="mt-3">
            <div className="w-full bg-dark-700/50 rounded-full h-1">
              <div 
                className={`h-1 rounded-full ${
                  type === 'success' ? 'bg-green-500' : 'bg-red-500'
                } animate-progress`}
                style={{ 
                  animation: `progress ${duration}ms linear forwards` 
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordResetNotification;