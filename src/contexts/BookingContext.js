import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { createBooking, getMyBookings, getBookingDetails, cancelBooking, retryPayment, checkPaymentStatus, confirmPayment, forceZaloPayCallback } from '../services/bookingService';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchMyBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getMyBookings();
            setBookings(data);
            setLastUpdated(Date.now());
        } catch (err) {
            setError(err.message);
            setBookings([]);
        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    };

    const addBooking = async (bookingData) => {
        setLoading(true);
        try {
            const newBookingResponse = await createBooking(bookingData);
            setBookings(prev => [newBookingResponse.data, ...prev]);
            return newBookingResponse;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getDetails = async (bookingId) => {
        setLoading(true);
        try {
            return await getBookingDetails(bookingId);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const cancelMyBooking = async (bookingId) => {
        setLoading(true);
        try {
            await cancelBooking(bookingId);
            setBookings(prev => prev.filter(b => b._id !== bookingId));
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const checkPaymentStatusForBooking = async (transactionId) => {
        try {
            const result = await checkPaymentStatus(transactionId);
            return result;
        } catch (error) {
            console.error('Error checking payment status:', error);
            throw error;
        }
    };

    const retryPaymentForBooking = async (bookingId, paymentMethod) => {
        setLoading(true);
        try {
            const response = await retryPayment(bookingId, paymentMethod);
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const sendFakeZaloCallback = async (callbackData) => {
        try {
            const result = await forceZaloPayCallback(callbackData);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchMyBookings();
        } else {
            setBookings([]);
            setLoading(false);
        }
    }, [user?.id]);

    return (
        <BookingContext.Provider
            value={{
                bookings,
                loading,
                error,
                lastUpdated,
                addBooking,
                getDetails,
                cancelBooking: cancelMyBooking,
                refreshBookings: fetchMyBookings,
                initialLoading,
                checkPaymentStatus: checkPaymentStatusForBooking,
                retryPayment: retryPaymentForBooking,
                sendFakeZaloCallback,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => useContext(BookingContext);