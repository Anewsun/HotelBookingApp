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
        setLoading(true);
        try {
            const data = await getMyBookings();
            setBookings(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addBooking = async (bookingData) => {
        setLoading(true);
        try {
            const newBooking = await createBooking(bookingData);
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