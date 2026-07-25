import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredPin, setStoredPin } from '../utils/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPin, setCurrentPin] = useState(getStoredPin());
  const [pinError, setPinError] = useState('');

  useEffect(() => {
    // Check if session was unlocked previously
    const sessionAuth = sessionStorage.getItem('finan_authenticated');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (pinInput) => {
    if (pinInput === currentPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem('finan_authenticated', 'true');
      setPinError('');
      return true;
    } else {
      setPinError('Código PIN incorrecto. Intenta de nuevo.');
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('finan_authenticated');
  };

  const updatePin = (newPin) => {
    if (!newPin || newPin.length < 4) {
      return { success: false, message: 'El PIN debe tener al menos 4 dígitos.' };
    }
    setStoredPin(newPin);
    setCurrentPin(newPin);
    return { success: true, message: 'PIN de acceso actualizado correctamente.' };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        pinError,
        login,
        logout,
        updatePin,
        currentPin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
