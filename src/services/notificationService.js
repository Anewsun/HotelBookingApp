import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: 'https://hotel-management-backend-ofn4.onrender.com/api/notifications',
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getNotifications = async () => {
    const response = await api.get('/');
    return response.data.data;
};

export const markAsRead = async (notificationId) => {
    await api.put(`/${notificationId}/read`);
};

export const markAllAsRead = async () => {
    await api.put('/read-all');
};