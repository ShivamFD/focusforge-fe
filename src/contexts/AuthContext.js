import React, { createContext, useContext, useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const authHook = useAuth();

  return (
    <AuthContext.Provider value={authHook}>
      {children}
    </AuthContext.Provider>
  );
};