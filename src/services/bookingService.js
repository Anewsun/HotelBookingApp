const API_URL = 'http://10.0.2.2:5000/api/';

export const createBooking = async (bookingData, token) => {
    try {
        const response = await fetch(`${API_URL}bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bookingData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to create booking');
        }

        return data.data;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};

export const getMyBookings = async (token) => {
    try {
        const response = await fetch(`${API_URL}bookings/my-bookings`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Requesting URL:', response);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Request failed');
        }

        const data = await response.json();
        return data.data || data;
    } catch (error) {
        console.error('Error fetching bookings:', error);
        throw error;
    }
};

export const getBookingDetails = async (bookingId, token) => {
    try {
        const response = await fetch(`${API_URL}bookings/${bookingId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch booking details');
        }

        return data.data;
    } catch (error) {
        console.error('Error fetching booking details:', error);
        throw error;
    }
};

export const cancelBooking = async (bookingId, token) => {
    try {
        const response = await fetch(`${API_URL}bookings/${bookingId}/cancel`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to cancel booking');
        }

        return data.data;
    } catch (error) {
        console.error('Error cancelling booking:', error);
        throw error;
    }
};

export const processPayment = async (bookingId, paymentMethod, token) => {
    try {
        const response = await fetch(`${API_URL}bookings/${bookingId}/pay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ paymentMethod })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Payment processing failed');
        }

        return data.data;
    } catch (error) {
        console.error('Error processing payment:', error);
        throw error;
    }
};

export const checkPaymentStatus = async (transactionId, token) => {
    try {
        const response = await fetch(`${API_URL}bookings/check-payment/${transactionId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to check payment status');
        }

        return data.data;
    } catch (error) {
        console.error('Error checking payment status:', error);
        throw error;
    }
};