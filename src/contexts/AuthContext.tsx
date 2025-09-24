import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockUsers as mockUsersData, testAccounts } from '../data/mockData';

export type UserRole = 'visitor' | 'dj' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar: string;
  bio: string;
  isDJ: boolean;
  role: UserRole;
  followers: number;
  following: number;
  joinedDate: string;
  subscription?: 'free' | 'premium';
  ownedProfileId?: string; // ID du profil DJ que cet utilisateur possède
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User> & { email: string; password: string }) => Promise<boolean>;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => void;
  updateSubscription: (subscription: 'free' | 'premium') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Utilisation des données de test centralisées avec abonnement et rôle par défaut
const mockUsers: User[] = mockUsersData.map(user => ({
  ...user,
  role: user.isDJ ? 'dj' : 'visitor' as UserRole,
  subscription: user.isDJ ? 'free' : undefined,
  ownedProfileId: user.isDJ ? user.id : undefined
}));

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Vérifier si un utilisateur est déjà connecté (localStorage)
    const savedUser = localStorage.getItem('djhub_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Vérifier d'abord les comptes de test
    if (email === testAccounts.user.email && password === testAccounts.user.password) {
      const testUser: User = {
        id: 'test-user',
        username: testAccounts.user.username,
        email: testAccounts.user.email,
        name: testAccounts.user.name,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
        bio: 'Compte de test utilisateur',
        isDJ: false,
        role: 'visitor',
        followers: 0,
        following: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        subscription: undefined,
        ownedProfileId: undefined
      };
      setUser(testUser);
      setIsAuthenticated(true);
      localStorage.setItem('djhub_user', JSON.stringify(testUser));
      return true;
    }

    if (email === testAccounts.dj.email && password === testAccounts.dj.password) {
      const testDJ: User = {
        id: 'test-dj',
        username: testAccounts.dj.username,
        email: testAccounts.dj.email,
        name: testAccounts.dj.name,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        bio: 'Compte de test DJ',
        isDJ: true,
        role: 'dj',
        followers: 0,
        following: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        subscription: 'free',
        ownedProfileId: 'test-dj-profile'
      };
      setUser(testDJ);
      setIsAuthenticated(true);
      localStorage.setItem('djhub_user', JSON.stringify(testDJ));
      return true;
    }

    // Simulation d'authentification pour les autres utilisateurs
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password123') {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('djhub_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('djhub_user');
  };

  const register = async (userData: Partial<User> & { email: string; password: string }): Promise<boolean> => {
    // Simulation d'inscription
    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username || `user${Date.now()}`,
      name: userData.name || 'Nouvel utilisateur',
      email: userData.email,
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      bio: userData.bio || '',
      isDJ: userData.isDJ || false,
      role: userData.isDJ ? 'dj' : 'visitor',
      followers: 0,
      following: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      ownedProfileId: userData.isDJ ? Date.now().toString() : undefined
    };

    mockUsers.push(newUser);
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('djhub_user', JSON.stringify(newUser));
    return true;
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('djhub_user', JSON.stringify(updatedUser));
    }
  };

  const updateSubscription = (subscription: 'free' | 'premium') => {
    if (user) {
      const updatedUser = { ...user, subscription };
      setUser(updatedUser);
      localStorage.setItem('djhub_user', JSON.stringify(updatedUser));
      
      // Mettre à jour aussi dans mockUsers pour la persistance
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser;
      }
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    isAuthenticated,
    updateUser,
    updateSubscription
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { mockUsers };