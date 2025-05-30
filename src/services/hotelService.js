import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.2.2:3000/api/hotels';

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
    const response = await fetch('http://10.0.2.2:3000/api/amenities');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching amenities:', error);
    return [];
  }
};

export const searchHotelsWithAvailableRooms = async (params) => {
  try {
    console.log('API call with params:', params);

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
        amenities: params.amenities?.length ? params.amenities : undefined,
        sort: params.sort || '-rating',
        page: params.page || 1,
        limit: params.limit || 10
      },
      timeout: 10000
    });

    console.log('API response:', response.data);

    if (response.data && response.data.success) {
      return {
        data: response.data.data || [],
        total: response.data.total || 0,
        pagination: response.data.pagination || { currentPage: 1, totalPages: 1 },
      };
    }
    return {
      data: [],
      error: 'Không tìm thấy khách sạn phù hợp'
    };
  } catch (error) {
    if (error.response?.status === 404) {
      return {
        data: [],
        error: 'Không tìm thấy địa điểm du lịch này'
      };
    }
    // Các lỗi khác
    return {
      data: [],
      error: error.response?.data?.message || error.message || 'Lỗi khi tải dữ liệu'
    };
  }
};