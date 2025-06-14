import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_API_URL } from '../../config';

const getToken = async () => {
    return await AsyncStorage.getItem('token');
};

export const getPosts = async () => {
    try {
        const response = await axios.get(`${BASE_API_URL}/api/posts`);
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const getPostById = async (postId) => {
    try {
        const response = await axios.get(`${BASE_API_URL}/api/posts/${postId}`, {
            params: {
                populate: 'userId,interactions.userId'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching post:', error);
        throw error;
    }
};

export const addInteraction = async (postId, type, content) => {
    try {
        const token = await getToken();
        const response = await axios.post(
            `${BASE_API_URL}/api/posts/${postId}/interactions`,
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
            `${BASE_API_URL}/api/posts/${postId}/interactions/${interactionId}`,
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

export const getPostInteractions = async (postId) => {
    try {
        const token = await getToken();
        const response = await axios.get(`${BASE_API_URL}/api/posts/${postId}/interactions`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching interactions:', error);
        throw error;
    }
};