import axios from 'axios';

const API_URL = 'https://hotel-management-backend-ofn4.onrender.com/api/';

export const createBooking = async (bookingData) => {
    try {
        const response = await axios.post(`${API_URL}bookings`, bookingData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create booking');
    }
};

export const getMyBookings = async () => {
    try {
        const response = await axios.get(`${API_URL}bookings/my-bookings`);
        return response.data.data || response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Request failed');
    }
};

export const getBookingDetails = async (bookingId) => {
    try {
        const response = await axios.get(`${API_URL}bookings/${bookingId}`);
        return response.data.data || response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Request failed');
    }
};

export const cancelBooking = async (bookingId) => {
    try {
        const response = await axios.patch(`${API_URL}bookings/${bookingId}/cancel`);
        return response.data.data || response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Request failed');
    }
};

export const retryPayment = async (bookingId, paymentMethod) => {
    try {
        const response = await axios.post(`${API_URL}bookings/retry-payment`, { bookingId, paymentMethod });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Request failed');
    }
};

export const checkZaloPaymentStatus = async (transactionId) => {
    try {
        const response = await axios.get(`${API_URL}bookings/payment-status/${transactionId}`);
        return response.data;
    } catch (error) {
        throw new Error('ZaloPay: ' + (error.response?.data?.message || 'Lỗi kiểm tra trạng thái'));
    }
};

export const checkVNPayPaymentStatus = async (transactionId) => {
    try {
        const response = await axios.post(`${API_URL}bookings/confirm-payment`, {
            transactionId,
            paymentMethod: 'vnpay',
        });

        console.log('[Smart Check] Calling VNPay for:', transactionId);
        const result = response.data.data || {};
        if (result.status === 'completed') {
            result.status = 'paid';
        }
        return result;
    } catch (error) {
        throw new Error('VNPay: ' + (error.response?.data?.message || 'Lỗi kiểm tra trạng thái'));
    }
};

export const forceZaloPayCallback = async (callbackData) => {
    try {
        const response = await axios.post(`${API_URL}bookings/zalopay-callback`, callbackData);
        return response.data;
    } catch (error) {
        throw new Error('Gửi callback thất bại');
    }
};

export const confirmVNPayFromRawUrl = async (queryString) => {
    try {
        const response = await axios.get(`${API_URL}bookings/vnpay-return?${queryString}`);

        if (!response.data || typeof response.data !== 'object') {
            return { success: true, status: 'paid' };
        }

        return response.data;
    } catch (error) {
        if (error.message === 'Network Error') {
            console.log('[VNPay] Axios network error — giả định thành công');
            return { success: true, status: 'paid' };
        }

        throw new Error(error.response?.data?.message || 'VNPay return xác nhận thất bại');
    }
};
