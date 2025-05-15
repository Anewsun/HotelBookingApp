import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import BottomNav from '../components/BottomNav';

const BookingCard = ({ booking }) => {
  return (
    <View style={styles.cardContainer}>
      {/* Hình ảnh phòng bên trái */}
      <Image
        source={booking.roomImage}
        style={styles.roomImage}
        resizeMode="cover"
      />

      {/* Nội dung bên phải */}
      <View style={styles.contentContainer}>
        {/* Contact & Guest Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông Tin Người Đặt & Khách</Text>
          <Text style={styles.textLine}><Text style={styles.label}>Người đặt: </Text>{booking.contactInfo.name}</Text>
          <Text style={styles.textLine}><Text style={styles.label}>Email: </Text>{booking.contactInfo.email}</Text>
          <Text style={styles.textLine}><Text style={styles.label}>Điện thoại: </Text>{booking.contactInfo.phone}</Text>
        </View>

        <View style={styles.separator} />

        {/* Room & Dates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông Tin Phòng & Thời Gian</Text>
          <Text style={styles.textLine}><Text style={styles.label}>Phòng: </Text>{booking.room}</Text>
          <Text style={styles.textLine}><Text style={styles.label}>Nhận phòng: </Text>{booking.checkIn.toLocaleDateString()}</Text>
          <Text style={styles.textLine}><Text style={styles.label}>Trả phòng: </Text>{booking.checkOut.toLocaleDateString()}</Text>
        </View>

        <View style={styles.separator} />

        {/* Special Requests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yêu Cầu Đặc Biệt</Text>
          <Text style={styles.textLine}><Text style={styles.label}>Nhận phòng sớm: </Text>{booking.specialRequests.earlyCheckIn ? 'Có' : 'Không'}</Text>
          <Text style={styles.textLine}><Text style={styles.label}>Trả phòng muộn: </Text>{booking.specialRequests.lateCheckOut ? 'Có' : 'Không'}</Text>
          <Text style={styles.textLine}><Text style={styles.label}>Yêu cầu khác: </Text>{booking.specialRequests.additionalRequests || 'Không có'}</Text>
        </View>

        <View style={styles.separator} />

        {/* Financial Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông Tin Tài Chính</Text>
          <Text style={styles.textLine}><Text style={styles.label}>Giá gốc: </Text>{booking.originalPrice.toLocaleString()} VNĐ</Text>
          <Text style={styles.textLine}><Text style={styles.label}>Giảm giá: </Text>{booking.discountAmount.toLocaleString()} VNĐ</Text>
          <Text style={styles.textLine}><Text style={styles.label}>Giá cuối: </Text>{booking.finalPrice.toLocaleString()} VNĐ</Text>
          <Text style={styles.textLine}><Text style={styles.label}>Thanh toán: </Text>{booking.paymentStatus} - {booking.paymentMethod}</Text>
        </View>

        <View style={styles.separator} />

        {/* Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trạng Thái Đặt Phòng</Text>
          <Text style={styles.textLine}><Text style={styles.label}>Trạng thái: </Text>{booking.status}</Text>
          {booking.cancellationReason ? (
            <Text style={styles.textLine}><Text style={styles.label}>Lý do hủy: </Text>{booking.cancellationReason}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const BookingScreen = () => {
  const bookings = [
    {
      id: '1',
      bookingFor: 'other',
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
      cancellationReason: '',
    },
    {
      id: '2',
      bookingFor: 'self',
      contactInfo: {
        name: 'Lê Thị C',
        email: 'lethic@example.com',
        phone: '0988123456',
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
      cancellationReason: '',
    },
  ];

  return (
    <ScrollView style={styles.screenContainer} contentContainerStyle={{ paddingVertical: 20 }}>
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
      <BottomNav />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4, // shadow android
    shadowColor: '#000', // shadow ios
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  roomImage: {
    width: 120,
    height: 140,
  },
  contentContainer: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 6,
  },
  label: {
    fontWeight: '600',
    color: '#444',
  },
  textLine: {
    fontSize: 15,
    color: '#222',
    marginBottom: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#d0d7e7',
    marginVertical: 6,
  },
});

export default BookingScreen;
