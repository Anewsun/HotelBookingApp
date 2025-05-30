import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.2.2:3000/api/chats/';

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
    return axios.post(API_URL, { receiverId, message }, config);
};

export const getChatHistory = async (userId) => {
    const config = await getAuthHeader();
    return axios.get(`${API_URL}${userId}`, config);
};

export const getConversations = async () => {
    const config = await getAuthHeader();
    return axios.get(`${API_URL}conversations`, config);
};

export const markAsRead = async (chatId) => {
    const config = await getAuthHeader();
    return axios.put(`${API_URL}${chatId}/read`, {}, config);
};