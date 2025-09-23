import React, { ReactNode } from 'react';
import { useAuthorization } from '../contexts/AuthorizationContext';
import { useAuth, UserRole } from '../contexts/AuthContext';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  resource?: string;
  action?: string;
  resourceId?: string;
  requireAuth?: boolean;
  fallback?: ReactNode;
  showFallback?: boolean;
}

const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  resource,
  action,
  resourceId,
  requireAuth = false,
  fallback = null,
  showFallback = false
}) => {
  const { isAuthenticated } = useAuth();
  const { hasPermission, getUserRole } = useAuthorization();

  // Vérifier l'authentification si requise
  if (requireAuth && !isAuthenticated) {
    if (showFallback) {
      return (
        <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-yellow-400">Connexion requise</p>
              <p className="text-xs text-gray-400">Connectez-vous pour accéder à cette fonctionnalité</p>
            </div>
          </div>
        </div>
      );
    }
    return <>{fallback}</>;
  }

  // Vérifier les rôles autorisés
  if (allowedRoles && !allowedRoles.includes(getUserRole()) && getUserRole() !== 'admin') {
    if (showFallback) {
      return (
        <div className="p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-red-400">Accès restreint</p>
              <p className="text-xs text-gray-400">Cette fonctionnalité est réservée aux DJs</p>
            </div>
          </div>
        </div>
      );
    }
    return <>{fallback}</>;
  }

  // Vérifier les permissions spécifiques
  if (resource && action && !hasPermission(resource, action, resourceId)) {
    if (showFallback) {
      return (
        <div className="p-4 bg-gradient-to-r from-gray-500/10 to-gray-600/10 border border-gray-500/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-500/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Permission insuffisante</p>
              <p className="text-xs text-gray-500">Vous n'êtes pas autorisé à effectuer cette action</p>
            </div>
          </div>
        </div>
      );
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default RoleGuard;