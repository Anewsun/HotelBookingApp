import axios from 'axios';

const API_URL = 'http://10.0.2.2:5000/api/locations';

export const getLocations = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
};

export const getPopularLocations = async () => {
    try {
        const response = await axios.get(`${API_URL}/popular`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching popular locations:', error);
        throw error;
    }
};