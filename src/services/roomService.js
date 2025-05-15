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