import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSession, clearSession } from '../services/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [checkingSession, setCheckingSession] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      const session = await getSession();
      setUser(session);
      setCheckingSession(false);
    };
    init();
  }, []);

  const login = (userData) => setUser(userData);

  const logout = async () => {
    await clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, checkingSession, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>');
  return ctx;
}