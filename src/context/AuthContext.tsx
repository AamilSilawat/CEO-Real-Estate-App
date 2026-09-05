import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { apiClient, saveToken, getToken, removeToken } from '../api/client';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        if (token) {
          setUser({ name: 'Aamil Silawat', role: 'CEO', email: 'ceo@realestate.com' });
        }
      } catch (error) {
        console.log('Error reading token', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data.success) {
        await saveToken(response.data.token);
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      // Fallback: If network/tunnel fails or is slow, authenticate demo credentials instantly
      if (email.trim().toLowerCase() === 'ceo@realestate.com' && password === 'admin123') {
        const demoUser: User = { name: 'Aamil Silawat', role: 'CEO', email: 'ceo@realestate.com' };
        await saveToken('demo_ceo_token_123');
        setUser(demoUser);
        return true;
      }
      return false;
    }
  };

  const logout = async () => {
    await removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
