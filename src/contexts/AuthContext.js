import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMe, refreshToken } from '../services/authService';
import { jwtDecode } from "jwt-decode";
import { initSocket, disconnectSocket, isSocketConnected } from '../utils/socket';

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
      try {
        if (!isSocketConnected()) {
          await initSocket().catch(error => {
            console.log('Non-critical socket init error:', error.message);
          });
        }
      } catch (error) {
        console.log('Background socket init error (non-critical):', error.message);
      }
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const connectSocketIfNeeded = async () => {
    try {
      if (!isSocketConnected()) {
        await initSocket();
      }
      return true;
    } catch (error) {
      console.log('Socket connection attempt failed:', error.message);
      return false;
    }
  };

  const logout = useCallback(async () => {
    try {
      setUser(null);
      setIsAuthenticated(false);

      if (isSocketConnected()) {
        await disconnectSocket().catch(e =>
          console.log('Socket disconnect warning:', e)
        );
      }

      await AsyncStorage.multiRemove(['token', 'refreshToken', 'user']);

    } catch (error) {
      console.error('Logout cleanup error:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

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
        connectSocketIfNeeded
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
