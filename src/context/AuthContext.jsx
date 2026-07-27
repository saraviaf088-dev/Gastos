import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredCredentials, setStoredCredentials } from '../utils/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentCredentials, setCurrentCredentials] = useState(getStoredCredentials());
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('finan_authenticated');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username, password) => {
    if (username === currentCredentials.username && password === currentCredentials.password) {
      setIsAuthenticated(true);
      sessionStorage.setItem('finan_authenticated', 'true');
      setAuthError('');
      return true;
    } else {
      setAuthError('Usuario o contraseña incorrectos. Intenta de nuevo.');
      return false;
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('finan_authenticated');

    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      } catch (e) {
        console.warn('Error clearing caches on logout:', e);
      }
    }

    window.location.reload();
  };

  const updateCredentials = (newUsername, newPassword) => {
    if (!newUsername || newUsername.length < 3) {
      return { success: false, message: 'El usuario debe tener al menos 3 caracteres.' };
    }
    if (!newPassword || newPassword.length < 4) {
      return { success: false, message: 'La contraseña debe tener al menos 4 caracteres.' };
    }
    setStoredCredentials(newUsername, newPassword);
    setCurrentCredentials({ username: newUsername, password: newPassword });
    return { success: true, message: 'Credenciales actualizadas correctamente.' };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authError,
        login,
        logout,
        updateCredentials,
        currentCredentials
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
