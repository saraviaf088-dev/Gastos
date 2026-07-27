import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredUser, loginUser, registerUser, updateUserCredentials, deleteUser } from '../utils/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('finan_authenticated');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (identifier, password) => {
    const result = loginUser(identifier, password);
    if (result.success) {
      setIsAuthenticated(true);
      setCurrentUser(getStoredUser());
      sessionStorage.setItem('finan_authenticated', 'true');
      setAuthError('');
    } else {
      setAuthError(result.message);
    }
    return result;
  };

  const register = (identifier, password, name) => {
    const result = registerUser(identifier, password, name);
    if (result.success) {
      setIsAuthenticated(true);
      setCurrentUser(getStoredUser());
      sessionStorage.setItem('finan_authenticated', 'true');
      setAuthError('');
    } else {
      setAuthError(result.message);
    }
    return result;
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

  const updateCredentials = (identifier, newPassword) => {
    const result = updateUserCredentials(identifier, newPassword);
    if (result.success) {
      setCurrentUser(getStoredUser());
    }
    return result;
  };

  const hasAccount = currentUser !== null;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authError,
        currentUser,
        hasAccount,
        login,
        register,
        logout,
        updateCredentials,
        setAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
