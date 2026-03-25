import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bugtracker_user'));
    } catch {
      return null;
    }
  });

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const userData = res.data;
    setUser(userData);
    localStorage.setItem('bugtracker_user', JSON.stringify(userData));
    return userData;
  }, []);

  const register = useCallback(async (name, email, password, role) => {
    const res = await api.post('/auth/register', { name, email, password, role });
    const userData = res.data;
    setUser(userData);
    localStorage.setItem('bugtracker_user', JSON.stringify(userData));
    return userData;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('bugtracker_user');
    toast.success('Logged out successfully');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
