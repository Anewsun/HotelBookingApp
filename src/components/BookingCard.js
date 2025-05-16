import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const BookingCard = ({ booking, onPress }) => {
    const getStatusColor = () => {
        switch (booking.status) {
            case 'confirmed': return '#4CAF50';
            case 'pending': return '#FFC107';
            case 'cancelled': return '#F44336';
            default: return '#9E9E9E';
        }
    };

    const nights = Math.ceil((booking.checkOut - booking.checkIn) / (1000 * 60 * 60 * 24));

    return (
        <View style={styles.cardContainer}>
            <Image
                source={booking.roomImage}
                style={styles.roomImage}
                resizeMode="cover"
            />

            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={styles.roomName}>{booking.room}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
                        <Text style={styles.statusText}>
                            {booking.status === 'confirmed' ? 'Đã xác nhận' :
                                booking.status === 'pending' ? 'Đang chờ' : 'Đã hủy'}
                        </Text>
                    </View>
                </View>

                <View style={styles.dateContainer}>
                    <Icon name="calendar" size={16} color="#555" />
                    <Text style={styles.dateText}>
                        {booking.checkIn.toLocaleDateString()} - {booking.checkOut.toLocaleDateString()}
                    </Text>
                    <Text style={styles.nightsText}>({nights} đêm)</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>
                        <Text style={styles.infoLabel}>Người đặt: </Text>
                        {booking.contactInfo.name}
                    </Text>
                    {booking.bookingFor === 'other' && booking.guestInfo && (
                        <Text style={styles.infoText}>
                            <Text style={styles.infoLabel}>Khách ở: </Text>
                            {booking.guestInfo.name}
                        </Text>
                    )}
                </View>

                <View style={styles.priceContainer}>
                    <Text style={styles.finalPrice}>{booking.finalPrice.toLocaleString()} VNĐ</Text>
                    {booking.discountAmount > 0 && (
                        <Text style={styles.originalPrice}>{booking.originalPrice.toLocaleString()} VNĐ</Text>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.detailButton}
                    onPress={() => onPress(booking.id)}
                >
                    <Text style={styles.detailButtonText}>Xem chi tiết</Text>
                    <Icon name="angle-right" size={18} color="#1167B1" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    roomImage: {
        width: 100,
        height: '100%',
        aspectRatio: 1,
    },
    contentContainer: {
        flex: 1,
        padding: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    roomName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#003366',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    dateText: {
        fontSize: 14,
        color: '#555',
        marginLeft: 6,
        marginRight: 8,
    },
    nightsText: {
        fontSize: 13,
        color: '#888',
    },
    infoContainer: {
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#444',
        marginBottom: 4,
    },
    infoLabel: {
        fontWeight: '600',
        color: '#333',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    finalPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#003366',
    },
    originalPrice: {
        fontSize: 13,
        color: '#999',
        textDecorationLine: 'line-through',
        marginLeft: 8,
    },
    detailButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 4,
    },
    detailButtonText: {
        fontSize: 14,
        color: '#1167B1',
        fontWeight: '500',
        marginRight: 4,
    },
});

export default BookingCard;