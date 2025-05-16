import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import BookingCard from '../components/BookingCard';
import { useNavigation } from '@react-navigation/native';

const BookingScreen = () => {
  const navigation = useNavigation();

  const bookings = [
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

  const handleDetailPress = (bookingId) => {
    navigation.navigate('BookingDetail', { bookingId });
  };

  return (
    <View style={styles.screenContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Header title="Lịch sử đặt phòng" />

        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onPress={handleDetailPress}
          />
        ))}

        <View style={{ height: 50 }} />
      </ScrollView>

      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
});

export default BookingScreen;