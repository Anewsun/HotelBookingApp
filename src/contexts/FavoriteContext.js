import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getFavorites, addFavorite, removeFavorite } from '../services/userService';
import { useAuth } from './AuthContext';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const queryClient = useQueryClient();
  const { user, logout, isAuthenticated } = useAuth();
  const [favoriteHotels, setFavoriteHotels] = useState([]);

  const loadFavorites = async () => {
    try {
      if (!isAuthenticated) {
        setFavoriteIds([]);
        return;
      }

      try {
        const data = await getFavorites();
        setFavoriteIds(data.map(item => String(item._id)));
        setFavoriteHotels(data);
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error('Error loading favorites:', err);

        if (error.response?.status === 401) {
          try {
            await logout();
          } catch (logoutError) {
            console.error('Logout failed:',
              logoutError instanceof Error ? logoutError : new Error(String(logoutError)));
          }
        }
      }
    } catch (error) {
      console.error('Unexpected error in loadFavorites:',
        error instanceof Error ? error : new Error(String(error)));
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [user, isAuthenticated]);

  const toggleFavorite = async (hotelId) => {
    if (!isAuthenticated) return;

    const hotelIdStr = String(hotelId);

    try {
      // Optimistic update
      const newFavorites = favoriteIds.includes(hotelIdStr)
      ? favoriteIds.filter(id => id !== hotelIdStr)
      : [...favoriteIds, hotelIdStr];

      setFavoriteIds(newFavorites);

      if (favoriteIds.includes(hotelIdStr)) {
        await removeFavorite(hotelIdStr);
        await loadFavorites();
      } else {
        await addFavorite(hotelIdStr);
        await loadFavorites();
      }

      // Cập nhật cache
      queryClient.invalidateQueries(['favorites']);
      queryClient.invalidateQueries(['hotels']);
    } catch (error) {
      // Rollback nếu có lỗi
      setFavoriteIds(favoriteIds);
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <FavoriteContext.Provider value={{ favoriteIds, favoriteHotels, toggleFavorite, loadFavorites }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => useContext(FavoriteContext);