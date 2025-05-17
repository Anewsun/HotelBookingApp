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
      sort: filters.sort || '-price'
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

export const searchHotelsWithAvailableRooms = async (params) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: {
        locationName: params.locationName,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        capacity: params.capacity,
        hotelName: params.hotelName,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        roomType: params.roomType,
        amenities: params.amenities,
        sort: params.sort || '-rating',
        page: params.page || 1,
        limit: params.limit || 10
      },
      timeout: 10000
    });

    if (response.data && response.data.success) {
      return {
        data: response.data.data || [],
        total: response.data.total || 0,
        pagination: response.data.pagination || { currentPage: 1, totalPages: 1 },
      };
    }
    throw new Error(response.data.message || 'Lỗi server');
  } catch (error) {
    console.error('Search hotels error:', error.response?.data || error.message);
    throw error;
  }
};