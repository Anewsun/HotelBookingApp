import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_API_URL } from '../../config';

export const uploadAvatar = async (file) => {
  const token = await AsyncStorage.getItem('token');
  const formData = new FormData();

  formData.append('avatar', {
    uri: file.uri,
    type: file.type || 'image/jpeg',
    name: file.fileName || `avatar_${Date.now()}.jpg`,
  });

  try {
    const response = await fetch(`${BASE_API_URL}/api/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log("❌ Upload avatar thất bại:", errorData);
      throw new Error(errorData.message || "Upload thất bại");
    }

    const responseData = await response.json();
    console.log("✅ Upload avatar thành công:", responseData);
    return responseData.data.avatar;
  } catch (error) {
    console.log("❌ Upload avatar lỗi:", error.message);
    throw error;
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
    const response = await axios.get(`${BASE_API_URL}/api/favorites`, config);
    return response.data.data;
  } catch (error) {
    console.error('Error getting favorites:', error);
    throw error;
  }
};

export const addFavorite = async (hotelId) => {
  const config = await getAuthHeader();
  const res = await axios.post(`${BASE_API_URL}/api/favorites`, { hotelId }, config);
  return res.data.data;
};

export const removeFavorite = async (hotelId) => {
  const config = await getAuthHeader();
  const res = await axios.delete(`${BASE_API_URL}/api/favorites/${hotelId}`, config);
  return res.data.data;
};

export const updateMe = async (updateData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.put(`${BASE_API_URL}/api/users/me`, updateData, {
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
      `${BASE_API_URL}/api/users/me/deactivate`,
      { password, reason },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 8000
      }
    );

    return response.data;

  } catch (error) {
    throw error;
  }
};