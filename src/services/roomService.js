import axios from 'axios';

const API_URL = 'http://10.0.2.2:5000/api';

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

export const searchRooms = async (params) => {
  try {
    const response = await axios.get(`${API_URL}/rooms/search`, {
      params: {
        locationName: params.locationName,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        capacity: params.capacity,
        sort: params.sort || '-rating',
        page: params.page || 1,
        limit: params.limit || 10,
      },
    });

    // Nếu thành công trả data bình thường
    if (response.data && response.data.success) {
      return {
        data: response.data.data || [],
        total: response.data.total || 0,
        pagination: response.data.pagination || { currentPage: 1, totalPages: 1 },
      };
    } else {
      // Nếu API trả lỗi nhưng status không phải 200
      throw new Error(response.data.message || 'Lỗi không xác định từ server');
    }
  } catch (error) {
    // Log lỗi chi tiết
    console.error('Fetch error:', error.response?.data || error.message || error);
    throw error;
  }
};
