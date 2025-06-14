import axios from 'axios';
import { BASE_API_URL } from '../../config';

export const createReview = async (reviewData) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/api/reviews/`, reviewData);
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Tạo đánh giá thất bại');
    }
};

export const getReviewsByHotel = async (hotelId) => {
    try {
        const response = await axios.get(`${BASE_API_URL}/api/reviews/${hotelId}`);
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi tải đánh giá');
    }
};

export const updateReview = async (reviewId, updateData) => {
    try {
        const response = await axios.put(`${BASE_API_URL}/api/reviews/${reviewId}`, updateData);
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Cập nhật thất bại');
    }
};

export const deleteReview = async (reviewId) => {
    try {
        await axios.delete(`${BASE_API_URL}/api/reviews/${reviewId}`);
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Xóa thất bại');
    }
};