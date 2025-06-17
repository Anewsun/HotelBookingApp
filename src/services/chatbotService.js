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

export const sendChatbotMessage = async (message, sessionId) => {
    const config = await getAuthHeader();
    const response = await axios.post(`${BASE_API_URL}/api/chatbot/message`, {
        message,
        sessionId
    }, config);

    return response.data.response;
};

export const sendChatbotEvent = async (eventName, sessionId, parameters = {}) => {
    const config = await getAuthHeader();
    return axios.post(`${BASE_API_URL}/api/chatbot/event`, {
        eventName,
        sessionId,
        parameters
    }, config);
};

export const clearChatbotSession = async (sessionId) => {
    const config = await getAuthHeader();
    return axios.delete(`${BASE_API_URL}/api/chatbot/session/${sessionId}`, config);
};