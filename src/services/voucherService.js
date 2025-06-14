import axios from 'axios';
import { BASE_API_URL } from '../../config';

export const getAvailableVouchers = async (totalAmount, page = 1, limit = 10, token = '') => {
    const response = await axios.get(`${BASE_API_URL}/api/vouchers/available`, {
        params: { totalAmount, page, limit },
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    return response.data;
};
