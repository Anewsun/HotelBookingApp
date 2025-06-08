import axios from 'axios';

const API_URL = 'http://10.0.2.2:3000/api';

// Lấy danh sách phòng của khách sạn
export const fetchRoomsByHotelId = async (hotelId) => {
  try {
    const response = await axios.get(`${API_URL}/rooms/hotels/${hotelId}/rooms`);
    return response.data.data || [];
  } catch (error) {
    console.error('Get rooms error:', error);
    throw error;
  }
};

// Lấy chi tiết 1 phòng
export const getRoomDetails = async (roomId) => {
  try {
    const response = await axios.get(`${API_URL}/rooms/${roomId}`);
    return response.data.data || null;
  } catch (error) {
    console.error('Get room details error:', error);
    throw error;
  }
};

export const getAvailableRoomsByHotel = async (hotelId, params) => {
  try {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formatDate = (date) => date.toISOString().split('T')[0];

    const response = await axios.get(`${API_URL}/hotels/${hotelId}/rooms/available`, {
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