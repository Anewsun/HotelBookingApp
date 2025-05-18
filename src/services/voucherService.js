const API_URL = 'http://10.0.2.2:5000/api/hotels';

export const getAvailableVouchers = async (totalAmount, page = 1, limit = 10, token) => {
    try {
        const response = await fetch(`${API_URL}vouchers/available?totalAmount=${totalAmount}&page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch vouchers');
        }

        return data;
    } catch (error) {
        console.error('Error fetching available vouchers:', error);
        throw error;
    }
};

export const validateVoucher = async (voucherId, originalPrice, token) => {
    try {
        const response = await fetch(`${API_URL}vouchers/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                voucherId,
                originalPrice
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to validate voucher');
        }

        return data;
    } catch (error) {
        console.error('Error validating voucher:', error);
        throw error;
    }
};