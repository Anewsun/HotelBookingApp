import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://hotel-management-backend-ofn4.onrender.com/api';

export const uploadAvatar = async (file) => {
  const token = await AsyncStorage.getItem('token');
  const formData = new FormData();

  formData.append('avatar', {
    uri: file.uri,
    type: file.type || 'image/jpeg',
    name: file.fileName || `avatar_${Date.now()}.jpg`,
  });

  try {
    const response = await axios.patch(`${API_URL}/users/me/avatar`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("✅ Upload avatar thành công:", response.data);
    return response.data.data.avatar;
  } catch (error) {
    console.log("❌ Upload avatar thất bại:", {
      message: error.message,
      response: error.response?.data,
      config: error.config,
    });
    throw error.response?.data?.message || "Lỗi upload avatar";
  }
};

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const getFavorites = async () => {
  try {
    const config = await getAuthHeader();
    const response = await axios.get(`${API_URL}/favorites`, config);
    return response.data.data;
  } catch (error) {
    console.error('Error getting favorites:', error);
    throw error;
  }
};

export const addFavorite = async (hotelId) => {
  const config = await getAuthHeader();
  const res = await axios.post(`${API_URL}/favorites`, { hotelId }, config);
  return res.data.data;
};

export const removeFavorite = async (hotelId) => {
  const config = await getAuthHeader();
  const res = await axios.delete(`${API_URL}/favorites/${hotelId}`, config);
  return res.data.data;
};

export const updateMe = async (updateData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.put(`${API_URL}/users/me`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Cập nhật thất bại";
  }
};

export const deactivateAccount = async (password, reason) => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await axios.patch(
      `${API_URL}/users/me/deactivate`,
      { password, reason },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 8000 // Timeout 8 giây
      }
    );

    return response.data;

  } catch (error) {
    throw error;
  }
};