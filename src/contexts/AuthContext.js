import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMe, refreshToken } from '../services/authService';
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'refreshToken', 'user']);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const refreshUserData = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;

    const freshData = await getMe();
    setUser({
      ...freshData,
      accessToken: token
    });
  };

  useEffect(() => {
    const loadAuthState = async () => {
      setIsLoading(true);
      try {
        const [token, refreshToken] = await AsyncStorage.multiGet(['token', 'refreshToken']);
        const storedUser = await AsyncStorage.getItem('user');

        if (!token[1]) {
          await logout();
          return;
        }

        // Kiểm tra token hết hạn
        const decoded = jwtDecode(token[1]);
        if (decoded.exp < Date.now() / 1000) {
          try {
            const newToken = await refreshToken();
            await AsyncStorage.setItem('token', newToken);
          } catch (refreshError) {
            await logout();
            return;
          }
        }

        if (storedUser) setUser(JSON.parse(storedUser));

        const freshUserData = await getMe();
        const updatedUser = {
          ...freshUserData,
          accessToken: token,
        };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsAuthenticated(true);
      } catch (error) {
        await logout();
      } finally {
        setIsLoading(false);
        setIsReady(true);
      }
    };

    loadAuthState();
  }, [logout]);

  const login = async (userData) => {
    try {
      await AsyncStorage.setItem('token', userData.accessToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  if (!isReady || isLoading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isReady,
        login,
        logout,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
