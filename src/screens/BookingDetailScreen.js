import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';

const BookingDetailScreen = ({ route }) => {
    const navigation = useNavigation();
    
    const mockBookings = [
        {
            id: '1',
            bookingFor: 'self',
            contactInfo: {
                name: 'Nguyễn Văn A',
                email: 'nguyenvana@example.com',
                phone: '0123456789',
            },
            room: 'Phòng Deluxe - Tầng 5',
            roomImage: require('../assets/images/hotel1.jpg'),
            checkIn: new Date('2024-07-01T14:00:00'),
            checkOut: new Date('2024-07-05T12:00:00'),
            specialRequests: {
                earlyCheckIn: true,
                lateCheckOut: false,
                additionalRequests: 'Không hút thuốc trong phòng, vui lòng chuẩn bị hoa hồng',
            },
            originalPrice: 5000000,
            discountAmount: 500000,
            finalPrice: 4500000,
            status: 'confirmed',
            paymentStatus: 'completed',
            paymentMethod: 'credit_card',
        },
        {
            id: '2',
            bookingFor: 'other',
            contactInfo: {
                name: 'Lê Thị C',
                email: 'lethic@example.com',
                phone: '0988123456',
            },
            guestInfo: {
                name: 'Trần Thị D',
                email: 'tranthid@example.com',
                phone: '0909123456',
            },
            room: 'Phòng Standard - Tầng 2',
            roomImage: require('../assets/images/hotel2.jpg'),
            checkIn: new Date('2024-08-10T14:00:00'),
            checkOut: new Date('2024-08-15T12:00:00'),
            specialRequests: {
                earlyCheckIn: false,
                lateCheckOut: true,
                additionalRequests: '',
            },
            originalPrice: 3000000,
            discountAmount: 0,
            finalPrice: 3000000,
            status: 'pending',
            paymentStatus: 'pending',
            paymentMethod: 'vnpay',
        },
        {
            id: '3',
            bookingFor: 'other',
            contactInfo: {
                name: 'Trần Văn B',
                email: 'tranvanb@example.com',
                phone: '0909123456',
            },
            guestInfo: {
                name: 'Phạm Văn E',
                email: 'phamvane@example.com',
                phone: '0911123456',
            },
            room: 'Phòng Suite - Tầng 10',
            roomImage: require('../assets/images/hotel3.jpg'),
            checkIn: new Date('2024-09-01T14:00:00'),
            checkOut: new Date('2024-09-03T12:00:00'),
            specialRequests: {
                earlyCheckIn: true,
                lateCheckOut: true,
                additionalRequests: 'Chuẩn bị bánh sinh nhật',
            },
            originalPrice: 8000000,
            discountAmount: 1000000,
            finalPrice: 7000000,
            status: 'cancelled',
            paymentStatus: 'refunded',
            paymentMethod: 'bank_transfer',
            cancellationReason: 'Thay đổi kế hoạch du lịch'
        }
    ];

    const { bookingId } = route.params;
    const booking = mockBookings.find(b => b.id === bookingId);

    if (!booking) {
        return (
            <View style={styles.container}>
                <Text>Không tìm thấy thông tin đặt phòng</Text>
            </View>
        );
    }

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

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Header title="Chi tiết booking" onBackPress={() => navigation.goBack()} showBackIcon={true} />
                {/* Ảnh phòng */}
                <Image source={booking.roomImage} style={styles.detailImage} />

                {/* Thông tin cơ bản */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông tin đặt phòng</Text>
                    <DetailRow icon="hotel" label="Phòng" value={booking.room} />
                    <DetailRow icon="calendar" label="Ngày nhận phòng"
                        value={`${booking.checkIn.toLocaleDateString()} (14:00)`} />
                    <DetailRow icon="calendar" label="Ngày trả phòng"
                        value={`${booking.checkOut.toLocaleDateString()} (12:00)`} />
                    <DetailRow icon="moon-o" label="Số đêm"
                        value={Math.ceil((booking.checkOut - booking.checkIn) / (1000 * 60 * 60 * 24))} />
                    <DetailRow icon="info-circle" label="Trạng thái"
                        value={
                            booking.status === 'confirmed' ? 'Đã xác nhận' :
                                booking.status === 'pending' ? 'Đang chờ xử lý' : 'Đã hủy'
                        }
                        valueColor={
                            booking.status === 'confirmed' ? '#4CAF50' :
                                booking.status === 'pending' ? '#FFC107' : '#F44336'
                        }
                    />
                </View>

                {/* Thông tin người đặt */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông tin người đặt</Text>
                    <DetailRow icon="user" label="Họ tên" value={booking.contactInfo.name} />
                    <DetailRow icon="envelope" label="Email" value={booking.contactInfo.email} />
                    <DetailRow icon="phone" label="Điện thoại" value={booking.contactInfo.phone} />
                    <DetailRow icon="info-circle" label="Loại đặt phòng"
                        value={booking.bookingFor === 'self' ? 'Tự đặt cho mình' : 'Đặt cho người khác'} />
                </View>

                {/* Thông tin khách ở (nếu có) */}
                {booking.bookingFor === 'other' && booking.guestInfo && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Thông tin khách ở</Text>
                        <DetailRow icon="user" label="Họ tên" value={booking.guestInfo.name} />
                        {booking.guestInfo.email && (
                            <DetailRow icon="envelope" label="Email" value={booking.guestInfo.email} />
                        )}
                        {booking.guestInfo.phone && (
                            <DetailRow icon="phone" label="Điện thoại" value={booking.guestInfo.phone} />
                        )}
                    </View>
                )}

                {/* Thông tin thanh toán */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>
                    <DetailRow icon="money" label="Tổng tiền"
                        value={`${booking.originalPrice.toLocaleString()} VNĐ`} />
                    {booking.discountAmount > 0 && (
                        <DetailRow icon="tag" label="Giảm giá"
                            value={`-${booking.discountAmount.toLocaleString()} VNĐ`}
                            valueColor="#4CAF50"
                        />
                    )}
                    <DetailRow icon="credit-card" label="Thành tiền"
                        value={`${booking.finalPrice.toLocaleString()} VNĐ`}
                        valueStyle={{ fontWeight: 'bold', color: '#003366' }}
                    />
                    <DetailRow icon="check-circle" label="Phương thức thanh toán"
                        value={
                            booking.paymentMethod === 'credit_card' ? 'Thẻ tín dụng' :
                                booking.paymentMethod === 'vnpay' ? 'VNPay' :
                                    booking.paymentMethod === 'bank_transfer' ? 'Chuyển khoản' : 'Tiền mặt'
                        }
                    />
                    <DetailRow icon="info-circle" label="Trạng thái thanh toán"
                        value={
                            booking.paymentStatus === 'completed' ? 'Đã thanh toán' :
                                booking.paymentStatus === 'pending' ? 'Chờ thanh toán' :
                                    booking.paymentStatus === 'refunded' ? 'Đã hoàn tiền' : 'Đã hủy'
                        }
                        valueColor={
                            booking.paymentStatus === 'completed' ? '#4CAF50' :
                                booking.paymentStatus === 'refunded' ? '#2196F3' :
                                    booking.paymentStatus === 'pending' ? '#FFC107' : '#F44336'
                        }
                    />
                </View>

                {/* Yêu cầu đặc biệt */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Yêu cầu đặc biệt</Text>
                    <DetailRow icon="clock-o" label="Nhận phòng sớm"
                        value={booking.specialRequests.earlyCheckIn ? 'Có' : 'Không'} />
                    <DetailRow icon="clock-o" label="Trả phòng muộn"
                        value={booking.specialRequests.lateCheckOut ? 'Có' : 'Không'} />
                    {booking.specialRequests.additionalRequests && (
                        <View style={styles.detailRow}>
                            <Icon name="sticky-note" size={18} color="#555" style={styles.rowIcon} />
                            <Text style={styles.rowLabel}>Yêu cầu khác:</Text>
                            <Text style={[styles.rowValue, { flex: 1, fontStyle: 'italic' }]}>
                                {booking.specialRequests.additionalRequests}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Lý do hủy (nếu có) */}
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

                {/* Nút hành động */}
                <View style={styles.actionContainer}>
                    {booking.status === 'pending' && (
                        <>
                            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#F44336' }]}>
                                <Text style={styles.actionButtonText}>Hủy đặt phòng</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}>
                                <Text style={styles.actionButtonText}>Thanh toán ngay</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    {booking.status === 'confirmed' && (
                        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#2196F3' }]}>
                            <Text style={styles.actionButtonText}>Để lại bình luận</Text>
                        </TouchableOpacity>
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
        color: '#1167B1',
        fontWeight: '600',
    },
});

export default BookingDetailScreen;