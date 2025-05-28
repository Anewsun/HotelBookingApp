import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.2.2:5000/api/';

const getToken = async () => {
    return await AsyncStorage.getItem('token');
};

export const getPosts = async () => {
    try {
        const response = await axios.get(`${API_URL}posts`);
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const getPostById = async (postId) => {
    const response = await axios.get(`${API_URL}posts/${postId}`, {
        params: {
            populate: 'userId,interactions.userId'
        }
    });
    return response.data;
};

export const addInteraction = async (postId, type, content) => {
    try {
        const token = await getToken();
        const response = await axios.post(
            `${API_URL}posts/${postId}/interactions`,
            { type, content },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error adding interaction:', error);
        throw error;
    }
};

export const deleteInteraction = async (postId, interactionId) => {
    try {
        const token = await getToken();
        const response = await axios.delete(
            `${API_URL}posts/${postId}/interactions/${interactionId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error deleting interaction:', error);
        throw error;
    }
};