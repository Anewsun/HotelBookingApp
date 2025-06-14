import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_API_URL } from '../../config';

const getAuthHeader = async () => {
    const token = await AsyncStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const sendMessage = async (receiverId, message) => {
    const config = await getAuthHeader();
    return axios.post(`${BASE_API_URL}/api/chats/`, { receiverId, message }, config);
};

export const getChatHistory = async (userId) => {
    const config = await getAuthHeader();
    return axios.get(`${BASE_API_URL}/api/chats/${userId}`, config);
};

export const getConversations = async () => {
    const config = await getAuthHeader();
    return axios.get(`${BASE_API_URL}/api/chats/conversations`, config);
};

export const markAsRead = async (chatId) => {
    const config = await getAuthHeader();
    return axios.put(`${BASE_API_URL}/api/chats/${chatId}/read`, {}, config);
};