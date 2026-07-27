import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getStoredUser, loginUser, registerUser, updateUserCredentials, deleteUser, setStoredUser,
  generateVerificationCode, storeResetCode, verifyResetCode, clearResetCode, userExistsForReset,
  resetPasswordWithCode
} from '../utils/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [authError, setAuthError] = useState('');
  const [syncUserToCloud, setSyncUserToCloud] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');

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

  const register = (identifier, password, name) => {
    const result = registerUser(identifier, password, name);
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

  // Generate and store verification code for password reset
  const requestPasswordReset = (identifier) => {
    // Check if user exists
    if (!userExistsForReset(identifier)) {
      return { success: false, message: 'Correo/celular no encontrado.' };
    }

    // Generate 6-digit code
    const code = generateVerificationCode();
    storeResetCode(identifier, code);
    setVerificationCode(code);
    
    // In a real app, this would send an email/SMS
    // For demo purposes, we'll return the code
    return { 
      success: true, 
      message: 'Código de verificación enviado.',
      code: code // In production, remove this and send via email/SMS
    };
  };

  // Verify the reset code
  const verifyCode = (identifier, code) => {
    return verifyResetCode(identifier, code);
  };

  // Reset password with code
  const resetPassword = (identifier, code, newPassword) => {
    const result = resetPasswordWithCode(identifier, code, newPassword);
    if (result.success) {
      const user = getStoredUser();
      setCurrentUser(user);
      clearResetCode();
      setVerificationCode('');
      
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
        requestPasswordReset,
        verifyCode,
        resetPassword,
        verificationCode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
