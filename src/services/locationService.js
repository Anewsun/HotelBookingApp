import axios from 'axios';
import { BASE_API_URL } from '../../config';

export const getLocations = async () => {
    try {
        const response = await axios.get(`${BASE_API_URL}/api/locations`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching locations:', error);
        return [];
    }
};

export const getPopularLocations = async () => {
    try {
        const response = await axios.get(`${BASE_API_URL}/api/locations/popular`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching popular locations:', error);
        throw error;
    }
};

export const searchLocations = async (query, limit = 5) => {
    try {
        const response = await axios.get(`${BASE_API_URL}/api/locations/search`, {
            params: { location: query, limit }
        });
        return response.data.data || [];
    } catch (error) {
        console.log('Search locations error:', error.message);
        return [];
    }
};