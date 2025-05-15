import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getFavorites, addFavorite, removeFavorite } from '../services/userService';
import { useAuth } from './AuthContext';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const queryClient = useQueryClient();
  const { user, logout, isAuthenticated } = useAuth();

  const loadFavorites = async () => {
    try {
      if (!isAuthenticated) {
        setFavoriteIds([]);
        return;
      }

      try {
        const data = await getFavorites();
        setFavoriteIds(data.map(item => item._id));
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
    if (!isAuthenticated) return; // Không làm gì nếu chưa đăng nhập

    try {
      // Optimistic update
      const newFavorites = favoriteIds.includes(hotelId)
        ? favoriteIds.filter(id => id !== hotelId)
        : [...favoriteIds, hotelId];

      setFavoriteIds(newFavorites);

      // Gọi API
      if (favoriteIds.includes(hotelId)) {
        await removeFavorite(hotelId);
      } else {
        await addFavorite(hotelId);
      }

      // Cập nhật cache
      queryClient.invalidateQueries(['favorites']);
      queryClient.invalidateQueries(['hotels']); // Thêm dòng này
    } catch (error) {
      // Rollback nếu có lỗi
      setFavoriteIds(favoriteIds);
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <FavoriteContext.Provider value={{ favoriteIds, toggleFavorite, loadFavorites }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => useContext(FavoriteContext);