import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://hotel-management-backend-ofn4.onrender.com/api/chatbot';

const getAuthHeader = async () => {
    const token = await AsyncStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const sendChatbotMessage = async (message, sessionId) => {
    const config = await getAuthHeader();
    const response = await axios.post(`${API_URL}/message`, {
        message,
        sessionId
    }, config);

    return response.data.response;
};

export const sendChatbotEvent = async (eventName, sessionId, parameters = {}) => {
    const config = await getAuthHeader();
    return axios.post(`${API_URL}/event`, {
        eventName,
        sessionId,
        parameters
    }, config);
};

export const clearChatbotSession = async (sessionId) => {
    const config = await getAuthHeader();
    return axios.delete(`${API_URL}/session/${sessionId}`, config);
};