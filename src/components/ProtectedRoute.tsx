import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAuthorization } from '../contexts/AuthorizationContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireRole?: 'dj' | 'admin';
  resource?: string;
  action?: string;
  resourceId?: string;
  fallbackPath?: string;
  showFallback?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = false,
  requireRole,
  resource,
  action,
  resourceId,
  fallbackPath = '/',
  showFallback = false
}) => {
  const { isAuthenticated, user } = useAuth();
  const { hasPermission, getUserRole } = useAuthorization();

  // Vérifier l'authentification si requise
  if (requireAuth && !isAuthenticated) {
    if (showFallback) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-black flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Accès restreint</h2>
            <p className="text-gray-400 mb-6">Vous devez être connecté pour accéder à cette page.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all duration-200"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      );
    }
    return <Navigate to={fallbackPath} replace />;
  }

  // Vérifier le rôle si requis
  if (requireRole && getUserRole() !== requireRole && getUserRole() !== 'admin') {
    if (showFallback) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-black flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Accès non autorisé</h2>
            <p className="text-gray-400 mb-6">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all duration-200"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      );
    }
    return <Navigate to={fallbackPath} replace />;
  }

  // Vérifier les permissions spécifiques si définies
  if (resource && action && !hasPermission(resource, action, resourceId)) {
    if (showFallback) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-black flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Permission insuffisante</h2>
            <p className="text-gray-400 mb-6">Vous n'avez pas l'autorisation d'effectuer cette action.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all duration-200"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      );
    }
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;