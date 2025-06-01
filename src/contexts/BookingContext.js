import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { createBooking, getMyBookings, getBookingDetails, cancelBooking, retryPayment, forceZaloPayCallback, checkVNPayPaymentStatus, checkZaloPaymentStatus, confirmVNPayFromRawUrl as apiConfirmVNPayFromRawUrl } from '../services/bookingService';

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

    const confirmVNPayFromRawUrl = async (queryString) => {
        try {
            return await apiConfirmVNPayFromRawUrl(queryString);
        } catch (err) {
            throw err;
        }
    };

    const checkPaymentSmart = async (transactionId, bookingId, overrideMethod) => {
        try {
            let paymentMethod = overrideMethod;

            if (!paymentMethod) {
                const booking = await getDetails(bookingId);
                paymentMethod = booking?.paymentMethod;
            }

            console.log('[Smart Check] Using payment method:', paymentMethod);

            if (paymentMethod === 'zalopay') {
                return await checkZaloPaymentStatus(transactionId);
            } else if (paymentMethod === 'vnpay') {
                return await checkVNPayPaymentStatus(transactionId);
            } else {
                throw new Error('Phương thức thanh toán không được hỗ trợ');
            }
        } catch (err) {
            throw new Error(err.message || 'Lỗi xác định trạng thái thanh toán');
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
                retryPayment: retryPaymentForBooking,
                sendFakeZaloCallback,
                checkPaymentSmart,
                confirmVNPayFromRawUrl,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => useContext(BookingContext);