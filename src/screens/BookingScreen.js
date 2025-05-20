import React from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator, SafeAreaView } from 'react-native';
import BookingCard from '../components/BookingCard';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { useBooking } from '../contexts/BookingContext';
import { useNavigation } from '@react-navigation/native';

const BookingScreen = () => {
  const { bookings, loading, error } = useBooking();
  const navigation = useNavigation();

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
        <Text style={styles.errorText}>Lỗi khi tải dữ liệu: {error.message}</Text>
      </View>
    );
  }

  const handlePressBooking = (bookingId) => {
    navigation.navigate('BookingDetail', { bookingId });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="Lịch sử đặt phòng" />

        <View style={styles.scrollWrapper}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              bookings.length === 0 && { flexGrow: 1 }
            ]}
          >
            {bookings.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>📭</Text>
                <Text style={styles.emptyText}>Chưa có phòng nào được đặt</Text>
                <Text style={styles.emptySubText}>Hãy đặt phòng đầu tiên của bạn!</Text>
              </View>
            ) : (
              bookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={{
                    ...booking,
                    id: booking._id,
                    checkIn: new Date(booking.checkIn),
                    checkOut: new Date(booking.checkOut)
                  }}
                  onPress={handlePressBooking}
                />
              ))
            )}
          </ScrollView>
        </View>

        <BottomNav />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4ff'
  },
  container: {
    flex: 1,
    position: 'relative',
    paddingTop: 15
  },
  scrollWrapper: {
    flex: 1,
    paddingBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  emptyText: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    marginVertical: 8
  },
  emptySubText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center'
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    padding: 20,
    fontSize: 16
  },
});

export default BookingScreen;