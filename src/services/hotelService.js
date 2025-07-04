import axios from 'axios';
import { BASE_API_URL } from '../../config';

export const fetchHotels = async () => {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/hotels`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching hotels:', error);
    throw error;
  }
};

export const fetchHotelById = async (hotelId) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/hotels/${hotelId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching hotel:', error);
    throw error;
  }
};

export const fetchAllAmenities = async () => {
  try {
    const response = await fetch(`${BASE_API_URL}/api/amenities`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching amenities:', error);
    return [];
  }
};

export const searchHotelsWithAvailableRooms = async (params) => {
  try {
    const queryParams = {
      locationName: params.locationName,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      capacity: params.capacity,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      minRating: params.minRating,
      maxRating: params.maxRating,
      roomType: params.roomTypes?.join(','),
      roomAmenities: Array.isArray(params.roomAmenities) 
        ? params.roomAmenities.join(',')
        : params.roomAmenities,
      hotelAmenities: Array.isArray(params.hotelAmenities)
        ? params.hotelAmenities.join(',')
        : params.hotelAmenities,
      sort: params.sort || 'price',
      page: params.page || 1,
      limit: params.limit || 10
    };

    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === undefined || queryParams[key] === '') {
        delete queryParams[key];
      }
    });

    const response = await axios.get(`${BASE_API_URL}/api/hotels/search`, {
      params: queryParams,
      timeout: 10000
    });

    if (response.data?.success) {
      return {
        data: response.data.data || [],
        total: response.data.total || 0,
        pagination: response.data.pagination || { 
          currentPage: 1, 
          totalPages: 1 
        },
      };
    }
    return {
      data: [],
      error: response.data?.message || 'Không tìm thấy khách sạn phù hợp'
    };
  } catch (error) {
    return {
      data: [],
      error: error.response?.data?.message || 
            error.message || 
            'Lỗi khi tải dữ liệu'
    };
  }
};

export const fetchDiscountedHotels = async (params = {}) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/hotels/discounts`, {
      params: {
        limit: params.limit || 8,
        sort: params.sort || '-highestDiscountPercent'
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching discounted hotels:', error);
    throw error;
  }
};

export const getAvailableRoomsByHotel = async (hotelId, params) => {
  try {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formatDate = (date) => date.toISOString().split('T')[0];

    const response = await axios.get(`${BASE_API_URL}/api/hotels/${hotelId}/rooms/available`, {
      params: {
        checkIn: params.checkIn || formatDate(today),
        checkOut: params.checkOut || formatDate(tomorrow),
        capacity: params.capacity || 1,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        roomType: params.roomType,
        amenities: params.amenities,
        sort: params.sort || 'price',
        page: params.page || 1,
        limit: params.limit || 10
      }
    });

    if (response.data && response.data.success) {
      return {
        data: response.data.data || [],
        total: response.data.total || 0,
        pagination: response.data.pagination || { currentPage: 1, totalPages: 1 },
      };
    }
    throw new Error(response.data.message || 'Không có dữ liệu trả về');
  } catch (error) {
    console.error('Get available rooms error:', error.response?.data || error.message);
    throw error;
  }
};