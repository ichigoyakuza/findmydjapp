import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth, User, UserRole } from './AuthContext';

export interface Permission {
  resource: string;
  action: string;
  condition?: (user: User, resourceId?: string) => boolean;
}

export interface AuthorizationContextType {
  hasPermission: (resource: string, action: string, resourceId?: string) => boolean;
  canEditProfile: (profileId: string) => boolean;
  canEditCalendar: (djId: string) => boolean;
  canViewDashboard: () => boolean;
  canModerateContent: () => boolean;
  canAccessAdminPanel: () => boolean;
  isOwner: (resourceOwnerId: string) => boolean;
  getUserRole: () => UserRole;
}

const AuthorizationContext = createContext<AuthorizationContextType | undefined>(undefined);

export const useAuthorization = () => {
  const context = useContext(AuthorizationContext);
  if (context === undefined) {
    throw new Error('useAuthorization must be used within an AuthorizationProvider');
  }
  return context;
};

interface AuthorizationProviderProps {
  children: ReactNode;
}

// Définition des permissions par rôle
const rolePermissions: Record<UserRole, Permission[]> = {
  visitor: [
    { resource: 'profile', action: 'view' },
    { resource: 'music', action: 'listen' },
    { resource: 'booking', action: 'create' },
    { resource: 'events', action: 'view' }
  ],
  dj: [
    { resource: 'profile', action: 'view' },
    { resource: 'profile', action: 'edit', condition: (user, resourceId) => user.ownedProfileId === resourceId },
    { resource: 'music', action: 'listen' },
    { resource: 'music', action: 'upload', condition: (user, resourceId) => user.ownedProfileId === resourceId },
    { resource: 'calendar', action: 'view', condition: (user, resourceId) => user.ownedProfileId === resourceId },
    { resource: 'calendar', action: 'edit', condition: (user, resourceId) => user.ownedProfileId === resourceId },
    { resource: 'booking', action: 'create' },
    { resource: 'booking', action: 'view', condition: (user, resourceId) => user.ownedProfileId === resourceId },
    { resource: 'booking', action: 'respond', condition: (user, resourceId) => user.ownedProfileId === resourceId },
    { resource: 'dashboard', action: 'access', condition: (user) => user.isDJ },
    { resource: 'events', action: 'view' }
  ],
  admin: [
    { resource: 'profile', action: 'view' },
    { resource: 'profile', action: 'edit' },
    { resource: 'music', action: 'listen' },
    { resource: 'music', action: 'upload' },
    { resource: 'music', action: 'moderate' },
    { resource: 'calendar', action: 'view' },
    { resource: 'calendar', action: 'edit' },
    { resource: 'booking', action: 'create' },
    { resource: 'booking', action: 'view' },
    { resource: 'booking', action: 'respond' },
    { resource: 'booking', action: 'moderate' },
    { resource: 'dashboard', action: 'access' },
    { resource: 'admin', action: 'access' },
    { resource: 'content', action: 'moderate' },
    { resource: 'users', action: 'manage' },
    { resource: 'events', action: 'view' },
    { resource: 'events', action: 'edit' }
  ]
};

export const AuthorizationProvider: React.FC<AuthorizationProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const getUserRole = (): UserRole => {
    if (!isAuthenticated || !user) return 'visitor';
    return user.role;
  };

  const hasPermission = (resource: string, action: string, resourceId?: string): boolean => {
    const userRole = getUserRole();
    const permissions = rolePermissions[userRole];
    
    const permission = permissions.find(p => p.resource === resource && p.action === action);
    
    if (!permission) return false;
    
    // Si il y a une condition, la vérifier
    if (permission.condition && user) {
      return permission.condition(user, resourceId);
    }
    
    return true;
  };

  const canEditProfile = (profileId: string): boolean => {
    return hasPermission('profile', 'edit', profileId);
  };

  const canEditCalendar = (djId: string): boolean => {
    return hasPermission('calendar', 'edit', djId);
  };

  const canViewDashboard = (): boolean => {
    return hasPermission('dashboard', 'access');
  };

  const canModerateContent = (): boolean => {
    return hasPermission('content', 'moderate');
  };

  const canAccessAdminPanel = (): boolean => {
    return hasPermission('admin', 'access');
  };

  const isOwner = (resourceOwnerId: string): boolean => {
    if (!user) return false;
    return user.id === resourceOwnerId || user.ownedProfileId === resourceOwnerId;
  };

  const value: AuthorizationContextType = {
    hasPermission,
    canEditProfile,
    canEditCalendar,
    canViewDashboard,
    canModerateContent,
    canAccessAdminPanel,
    isOwner,
    getUserRole
  };

  return (
    <AuthorizationContext.Provider value={value}>
      {children}
    </AuthorizationContext.Provider>
  );
};