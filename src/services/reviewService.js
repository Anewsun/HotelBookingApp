import axios from 'axios';

const API_URL = 'http://10.0.2.2:5000/api/reviews/';

export const createReview = async (reviewData) => {
    try {
        const response = await axios.post(API_URL, reviewData);
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Tạo đánh giá thất bại');
    }
};

export const getReviewsByHotel = async (hotelId) => {
    try {
        const response = await axios.get(`${API_URL}${hotelId}`);
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi tải đánh giá');
    }
};

export const updateReview = async (reviewId, updateData) => {
    try {
        const response = await axios.put(`${API_URL}${reviewId}`, updateData);
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Cập nhật thất bại');
    }
};

export const deleteReview = async (reviewId) => {
    try {
        await axios.delete(`${API_URL}${reviewId}`);
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Xóa thất bại');
    }
};