import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { createBooking, getMyBookings, getBookingDetails, cancelBooking } from '../services/bookingService';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMyBookings = async () => {
        if (!user?.accessToken) return;

        setLoading(true);
        try {
            const data = await getMyBookings(user.accessToken);
            setBookings(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addBooking = async (bookingData) => {
        if (!user?.accessToken) {
            throw new Error('User not authenticated');
        }

        setLoading(true);
        try {
            const newBooking = await createBooking(bookingData, user.accessToken);
            setBookings(prev => [newBooking, ...prev]);
            return newBooking;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getDetails = async (bookingId) => {
        if (!user?.accessToken) {
            throw new Error('User not authenticated');
        }

        setLoading(true);
        try {
            return await getBookingDetails(bookingId, user.accessToken);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const cancelMyBooking = async (bookingId) => {
        if (!user?.accessToken) {
            throw new Error('User not authenticated');
        }

        setLoading(true);
        try {
            await cancelBooking(bookingId, user.accessToken);
            setBookings(prev => prev.filter(b => b._id !== bookingId));
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchMyBookings();
        }
    }, [user]);

    return (
        <BookingContext.Provider
            value={{
                bookings,
                loading,
                error,
                addBooking,
                getDetails,
                cancelBooking: cancelMyBooking,
                refreshBookings: fetchMyBookings
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => useContext(BookingContext);