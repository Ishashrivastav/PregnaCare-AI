import React, { createContext, useContext, useState, useEffect } from 'react';
import mobileApi from '../api/client.js';

interface AuthContextType {
  user: any;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const userData = await mobileApi.getMe();
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: any) => {
    const res = await mobileApi.login(credentials);
    if (res?.token) {
      await mobileApi.setToken(res.token);
      setUser(res.user);
    }
  };

  const register = async (data: any) => {
    const res = await mobileApi.register(data);
    if (res?.token) {
      await mobileApi.setToken(res.token);
      setUser(res.user);
    }
  };

  const logout = async () => {
    await mobileApi.removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
