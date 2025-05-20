import { useState } from 'react';
import { createBooking, getBookingDetails, retryPayment } from '../services/bookingService';
import { useAuth } from '../contexts/AuthContext';

export const useBookingActions = () => {
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const bookRoom = async (bookingData) => {
        if (!user?.accessToken) {
            throw new Error('User not authenticated');
        }

        setIsProcessing(true);
        setError(null);

        try {
            const booking = await createBooking(bookingData, user.accessToken);
            return booking;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsProcessing(false);
        }
    };

    const fetchBookingDetails = async (bookingId) => {
        if (!user?.accessToken) {
            throw new Error('User not authenticated');
        }

        setIsProcessing(true);
        setError(null);

        try {
            const details = await getBookingDetails(bookingId, user.accessToken);
            return details;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsProcessing(false);
        }
    };

    const retryBookingPayment = async (bookingId, paymentMethod) => {
        if (!user?.accessToken) {
            throw new Error('User not authenticated');
        }

        setIsProcessing(true);
        setError(null);

        try {
            const result = await retryPayment(bookingId, paymentMethod, user.accessToken);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        bookRoom,
        fetchBookingDetails,
        retryBookingPayment,
        isProcessing,
        error
    };
};