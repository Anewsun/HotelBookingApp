import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useBooking } from '../contexts/BookingContext';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import ReviewFormModal from "../components/ReviewFormModal";
import { createReview } from "../services/reviewService";

const BookingDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { bookingId } = route.params;
    const { getDetails, cancelBooking } = useBooking();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const details = await getDetails(bookingId);
                setBooking(details);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [bookingId]);

    const handleCancelBooking = async () => {
        try {
            await cancelBooking(bookingId);
            navigation.goBack();
        } catch (err) {
            setError(err.message);
        }
    };

    const DetailRow = ({ icon, label, value, valueColor, valueStyle }) => (
        <View style={styles.detailRow}>
            <Icon name={icon} size={18} color="#555" style={styles.rowIcon} />
            <Text style={styles.rowLabel}>{label}:</Text>
            <Text style={[
                styles.rowValue,
                valueColor && { color: valueColor },
                valueStyle
            ]}>
                {value}
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#003366" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!booking) {
        return (
            <View style={styles.container}>
                <Text>Không tìm thấy thông tin đặt phòng</Text>
            </View>
        );
    }

    const getRoomImageSource = () => {
        try {
            const firstImage = booking.room?.images?.[0];
            const imageUrl = firstImage?.url ||
                (typeof firstImage === 'string' ? firstImage : null) ||
                booking.room?.imageUrl ||
                booking.room?.hotelId?.images?.[0]?.url;

            if (imageUrl) {
                return { uri: String(imageUrl) };
            }
        } catch (error) {
            console.error('Error processing image URL:', error);
        }
        return require('../assets/images/hotel1.jpg');
    };

    const formatDate = (date) => {
        return format(new Date(date), 'dd/MM/yyyy', { locale: vi });
    };

    const nights = Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24));

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Header title="Chi tiết booking" onBackPress={() => navigation.goBack()} showBackIcon={true} />

                <Image source={getRoomImageSource()} style={styles.detailImage} />

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông tin đặt phòng</Text>
                    <DetailRow
                        icon="hotel"
                        label="Phòng"
                        value={booking.room?.roomType || 'Không có thông tin'}
                    />
                    <DetailRow
                        icon="calendar"
                        label="Ngày nhận phòng"
                        value={`${formatDate(booking.checkIn)} (14:00)`}
                    />
                    <DetailRow
                        icon="calendar"
                        label="Ngày trả phòng"
                        value={`${formatDate(booking.checkOut)} (12:00)`}
                    />
                    <DetailRow
                        icon="moon-o"
                        label="Số đêm"
                        value={nights}
                    />
                    <DetailRow
                        icon="info-circle"
                        label="Trạng thái"
                        value={
                            booking.status === 'confirmed' ? 'Đã xác nhận' :
                                booking.status === 'pending' ? 'Đang chờ xử lý' :
                                    booking.status === 'completed' ? 'Đã hoàn thành' : 'Đã hủy'
                        }
                        valueColor={
                            booking.status === 'confirmed' ? '#4CAF50' :
                                booking.status === 'pending' ? '#FFC107' :
                                    booking.status === 'completed' ? '#2196F3' : '#F44336'
                        }
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông tin người đặt</Text>
                    <DetailRow
                        icon="user"
                        label="Họ tên"
                        value={booking.contactInfo?.name || 'Không có thông tin'}
                    />
                    <DetailRow
                        icon="envelope"
                        label="Email"
                        value={booking.contactInfo?.email || 'Không có thông tin'}
                    />
                    <DetailRow
                        icon="phone"
                        label="Điện thoại"
                        value={booking.contactInfo?.phone || 'Không có thông tin'}
                    />
                    <DetailRow
                        icon="info-circle"
                        label="Loại đặt phòng"
                        value={booking.bookingFor === 'self' ? 'Tự đặt cho mình' : 'Đặt cho người khác'}
                    />
                </View>

                {booking.bookingFor === 'other' && booking.guestInfo && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Thông tin khách ở</Text>
                        <DetailRow
                            icon="user"
                            label="Họ tên"
                            value={booking.guestInfo.name}
                        />
                        {booking.guestInfo.email && (
                            <DetailRow
                                icon="envelope"
                                label="Email"
                                value={booking.guestInfo.email}
                            />
                        )}
                        {booking.guestInfo.phone && (
                            <DetailRow
                                icon="phone"
                                label="Điện thoại"
                                value={booking.guestInfo.phone}
                            />
                        )}
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>
                    <DetailRow
                        icon="money"
                        label="Tổng tiền"
                        value={`${booking.originalPrice?.toLocaleString() || '0'} VNĐ`}
                    />
                    {booking.discountAmount > 0 && (
                        <DetailRow
                            icon="tag"
                            label="Giảm giá"
                            value={`-${booking.discountAmount.toLocaleString()} VNĐ`}
                            valueColor="#4CAF50"
                        />
                    )}
                    <DetailRow
                        icon="credit-card"
                        label="Thành tiền"
                        value={`${booking.finalPrice?.toLocaleString() || '0'} VNĐ`}
                        valueStyle={{ fontWeight: 'bold', color: '#003366' }}
                    />
                    <DetailRow
                        icon="check-circle"
                        label="Phương thức thanh toán"
                        value={
                            booking.paymentMethod === 'vnpay' ? 'VNPay' :
                                booking.paymentMethod === 'zalopay' ? 'ZaloPay' : 'Tiền mặt'
                        }
                    />
                    <DetailRow
                        icon="info-circle"
                        label="Trạng thái thanh toán"
                        value={
                            booking.paymentStatus === 'paid' ? 'Đã thanh toán' :
                                booking.paymentStatus === 'pending' ? 'Chờ thanh toán' :
                                    booking.paymentStatus === 'refunded' ? 'Đã hoàn tiền' : 'Đã hủy'
                        }
                        valueColor={
                            booking.paymentStatus === 'paid' ? '#4CAF50' :
                                booking.paymentStatus === 'refunded' ? '#2196F3' :
                                    booking.paymentStatus === 'pending' ? '#FFC107' : '#F44336'
                        }
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Yêu cầu đặc biệt</Text>
                    <DetailRow
                        icon="clock-o"
                        label="Nhận phòng sớm"
                        value={booking.specialRequests?.earlyCheckIn ? 'Có' : 'Không'}
                    />
                    <DetailRow
                        icon="clock-o"
                        label="Trả phòng muộn"
                        value={booking.specialRequests?.lateCheckOut ? 'Có' : 'Không'}
                    />
                    {booking.specialRequests?.additionalRequests && (
                        <View style={styles.detailRow}>
                            <Icon name="sticky-note" size={18} color="#555" style={styles.rowIcon} />
                            <Text style={styles.rowLabel}>Yêu cầu khác:</Text>
                            <Text style={[styles.rowValue, { flex: 1, fontStyle: 'italic' }]}>
                                {booking.specialRequests.additionalRequests}
                            </Text>
                        </View>
                    )}
                </View>

                {booking.status === 'cancelled' && booking.cancellationReason && (
                    <View style={[styles.section, { borderLeftWidth: 4, borderLeftColor: '#F44336' }]}>
                        <Text style={styles.sectionTitle}>Lý do hủy phòng</Text>
                        <View style={styles.detailRow}>
                            <Icon name="exclamation-triangle" size={18} color="#F44336" style={styles.rowIcon} />
                            <Text style={[styles.rowValue, { flex: 1, color: '#F44336' }]}>
                                {booking.cancellationReason}
                            </Text>
                        </View>
                    </View>
                )}

                <View style={styles.actionContainer}>
                    {(booking.status === 'confirmed' || booking.status === 'pending') && booking.paymentStatus !== 'paid' && (
                        <>
                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: '#F44336' }]}
                                onPress={handleCancelBooking}
                            >
                                <Text style={styles.actionButtonText}>Hủy đặt phòng</Text>
                            </TouchableOpacity>

                            {booking.paymentStatus === 'pending' && (
                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
                                    onPress={() => { }}
                                >
                                    <Text style={styles.actionButtonText}>Thanh toán ngay</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}

                    {booking.status === 'completed' && !hasReviewed && (
                        <>
                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
                                onPress={() => setReviewModalVisible(true)}
                            >
                                <Text style={styles.actionButtonText}>Để lại bình luận</Text>
                            </TouchableOpacity>

                            <ReviewFormModal
                                visible={reviewModalVisible}
                                hotelId={booking.room?.hotelId?._id || booking.room?.hotelId}
                                onClose={() => setReviewModalVisible(false)}
                                onSubmit={async (data) => {
                                    try {
                                        await createReview(data);
                                        setHasReviewed(true);
                                        setReviewModalVisible(false);
                                    } catch (error) {
                                        Alert.alert("Lỗi", error.message);
                                    }
                                }}
                            />
                        </>
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#F5F7FA',
    },
    detailImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#003366',
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    rowIcon: {
        width: 24,
        marginRight: 8,
    },
    rowLabel: {
        fontWeight: '600',
        width: 120,
        color: '#555',
    },
    rowValue: {
        flex: 1,
        color: '#222',
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    actionButton: {
        flex: 1,
        padding: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginHorizontal: 8,
    },
    actionButtonText: {
        fontSize: 16,
        color: 'white',
        fontWeight: '600',
    },
    errorText: {
        color: '#F44336',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
});

export default BookingDetailScreen;