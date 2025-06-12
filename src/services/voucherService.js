import axios from 'axios';

const API_URL = 'https://hotel-management-backend-ofn4.onrender.com/api/';

export const getAvailableVouchers = async (totalAmount, page = 1, limit = 10, token = '') => {
    const response = await axios.get(`${API_URL}vouchers/available`, {
        params: { totalAmount, page, limit },
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    return response.data;
};
