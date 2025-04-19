import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.2.2:5000/api/hotels';

export const fetchHotels = async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching hotels:', error);
      throw error;
    }
  };