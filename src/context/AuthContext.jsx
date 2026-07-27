import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getStoredUser, loginUser, registerUser, updateUserCredentials, deleteUser, setStoredUser,
  verifySecurityAnswer, resetPassword, SECURITY_QUESTIONS
} from '../utils/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [authError, setAuthError] = useState('');
  const [syncUserToCloud, setSyncUserToCloud] = useState(null);

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('finan_authenticated');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Method to set the sync function from FinanceContext
  const setSyncFunction = (fn) => {
    setSyncUserToCloud(() => fn);
  };

  const login = (identifier, password) => {
    const result = loginUser(identifier, password);
    if (result.success) {
      const user = getStoredUser();
      setIsAuthenticated(true);
      setCurrentUser(user);
      sessionStorage.setItem('finan_authenticated', 'true');
      setAuthError('');
      
      // Sync user to cloud if function is available
      if (syncUserToCloud) {
        syncUserToCloud(user);
      }
    } else {
      setAuthError(result.message);
    }
    return result;
  };

  const register = (identifier, password, name, securityQuestion, securityAnswer) => {
    const result = registerUser(identifier, password, name, securityQuestion, securityAnswer);
    if (result.success) {
      const user = getStoredUser();
      setIsAuthenticated(true);
      setCurrentUser(user);
      sessionStorage.setItem('finan_authenticated', 'true');
      setAuthError('');
      
      // Sync user to cloud if function is available
      if (syncUserToCloud) {
        syncUserToCloud(user);
      }
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
      const user = getStoredUser();
      setCurrentUser(user);
      
      // Sync user to cloud if function is available
      if (syncUserToCloud) {
        syncUserToCloud(user);
      }
    }
    return result;
  };

  const verifySecurity = (identifier, answer) => {
    return verifySecurityAnswer(identifier, answer);
  };

  const resetUserPassword = (identifier, answer, newPassword) => {
    const result = resetPassword(identifier, answer, newPassword);
    if (result.success) {
      const user = getStoredUser();
      setCurrentUser(user);
      
      // Sync user to cloud if function is available
      if (syncUserToCloud) {
        syncUserToCloud(user);
      }
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
        setAuthError,
        setSyncFunction,
        verifySecurity,
        resetUserPassword,
        securityQuestions: SECURITY_QUESTIONS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
