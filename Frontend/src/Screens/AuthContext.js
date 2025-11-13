import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../auth/api';;
import { API_URL } from '@env';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  const login = async (token, role) => {
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('role', role);
    setUserToken(token);
    setUserRole(role);
  };

  const logout = async () => {
    try {
      await api.post(`${API_URL}/user/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    }
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('role');
    setUserToken(null);
    setUserRole(null);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const role = await AsyncStorage.getItem('role');
      setUserToken(token);
      setUserRole(role);
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ userToken, userRole, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);