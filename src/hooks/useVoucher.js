import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAvailableVouchers } from '../services/voucherService';

export const useVoucher = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAvailableVouchers = useCallback(async (totalAmount, page = 1, limit = 10) => {
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
    }, [user?.accessToken]);

    return {
        isLoading,
        error,
        fetchAvailableVouchers,
    };
};