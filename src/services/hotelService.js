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

export const fetchHotelById = async (hotelId) => {
  try {
    const response = await axios.get(`${API_URL}/${hotelId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching hotel:', error);
    throw error;
  }
};

export const fetchAllAmenities = async () => {
  try {
    const response = await fetch('http://10.0.2.2:5000/api/amenities');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching amenities:', error);
    return [];
  }
};

export const fetchHotelsWithFilters = async (filters) => {
  try {
    const params = {
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      rating: filters.rating,
      amenities: filters.amenities,
      sort: filters.sort || '-rating' // Giá trị mặc định nếu không có sort
    };

    const response = await axios.get(API_URL, { params });

    // Trường hợp 1: API trả về { data: { data: [...] } }
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    // Trường hợp 2: API trả về { data: [...] } trực tiếp
    else if (Array.isArray(response.data)) {
      return response.data;
    }
    // Trường hợp không có dữ liệu
    return [];
    
  } catch (error) {
    console.error('Fetch hotels error:', error);
    throw new Error(error.response?.data?.message || 'Không thể tải danh sách khách sạn');
  }
};