import axios from 'axios';

const API_URL = 'http://10.0.2.2:5000/api/';

export const createBooking = async (bookingData) => {
    try {
        const response = await axios.post(`${API_URL}bookings`, bookingData);
        return response.data.data;
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

export const processPayment = async (bookingId, paymentMethod) => {
    try {
        const response = await axios.post(`${API_URL}bookings/${bookingId}/pay`);
        return response.data.data || response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Request failed');
    }
};

export const checkPaymentStatus = async (transactionId) => {
    try {
        const response = await axios.get(`${API_URL}bookings/check-payment/${transactionId}`);
        return response.data.data || response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Request failed');
    }
};