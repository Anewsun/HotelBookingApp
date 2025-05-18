import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAvailableVouchers, validateVoucher } from '../services/voucherService';

export const useVoucher = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAvailableVouchers = async (totalAmount, page = 1, limit = 10) => {
        if (!user?.accessToken) {
            setError('User not authenticated');
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await getAvailableVouchers(totalAmount, page, limit, user.accessToken);
            return response.data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const validateVoucherCode = async (voucherId, originalPrice) => {
        if (!user?.accessToken) {
            setError('User not authenticated');
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await validateVoucher(voucherId, originalPrice, user.accessToken);
            return response;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        fetchAvailableVouchers,
        validateVoucherCode,
    };
};