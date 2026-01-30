import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);
  const [loading, setLoading]  = useState(true);

  useEffect(() => {
    const authenticationToken = sessionStorage.getItem('auth-token');
    const savedName = sessionStorage.getItem('firstName');
    if (authenticationToken) {
      setIsLoggedIn(true);
      setUserName(savedName || 'User');
    }
    setLoading(false);
  }, []);

  if (loading) return null;


  return (
    <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, userName, setUserName }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
 