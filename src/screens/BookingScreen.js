import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator, TouchableOpacity, Animated } from 'react-native';
import { Provider as PaperProvider, Menu, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BookingCard from '../components/BookingCard';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { useBooking } from '../contexts/BookingContext';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BookingScreen = () => {
  const isFocused = useIsFocused();
  const { bookings, loading, error, initialLoading, refreshBookings } = useBooking();
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isFocused) {
      refreshBookings();
    }
  }, [isFocused, refreshBookings]);

  const handlePressBooking = (bookingId) => {
    navigation.navigate('BookingDetail', { bookingId });
  };

  const openMenu = () => {
    setVisible(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.spring(scaleAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const handleFilter = (status) => {
    setFilterStatus(status === filterStatus ? null : status);
    closeMenu();
  };

  const filteredBookings = filterStatus
    ? bookings.filter(booking => booking.status === filterStatus)
    : bookings;

  if (initialLoading) {
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

  const getStatusLabel = (status) => {
    const statusLabels = {
      pending: 'Đang chờ',
      confirmed: 'Đã xác nhận',
      cancelled: 'Đã hủy',
      completed: 'Đã hoàn thành'
    };
    return statusLabels[status] || status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#4CAF50';
      case 'completed': return '#2196F3';
      case 'cancelled': return '#F44336';
      case 'pending': return '#FFC107';
      default: return '#003366';
    }
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <Header
          title="Lịch sử đặt phòng"
          rightComponent={
            <View style={styles.filterContainer}>
              <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                  <TouchableOpacity onPress={openMenu}>
                    <Icon name="filter-list" size={30} color={getStatusColor(filterStatus)} />
                  </TouchableOpacity>
                }
                contentStyle={styles.menuContent}
              >
                <Menu.Item
                  onPress={() => handleFilter(null)}
                  title="Tất cả"
                  titleStyle={filterStatus === null ? styles.selectedMenuText : null}
                />
                <Divider />
                {['pending', 'confirmed', 'cancelled', 'completed'].map((status) => (
                  <Menu.Item
                    key={status}
                    onPress={() => handleFilter(status)}
                    title={getStatusLabel(status)}
                    titleStyle={filterStatus === status ? styles.selectedMenuText : null}
                  />
                ))}
              </Menu>
            </View>
          }
        />

        <View style={styles.scrollWrapper}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              filteredBookings.length === 0 && { flexGrow: 1 }
            ]}
          >
            {filteredBookings.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>📭</Text>
                <Text style={styles.emptyText}>
                  {filterStatus
                    ? `Không có booking ${getStatusLabel(filterStatus)}`
                    : 'Chưa có phòng nào được đặt'}
                </Text>
                <Text style={styles.emptySubText}>
                  {filterStatus
                    ? 'Thử lọc trạng thái khác'
                    : 'Hãy đặt phòng đầu tiên của bạn!'}
                </Text>
              </View>
            ) : (
              filteredBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={{
                    ...booking,
                    id: booking._id,
                    checkIn: new Date(booking.checkIn),
                    checkOut: new Date(booking.checkOut)
                  }}
                  onPress={handlePressBooking}
                  extraData={booking.updatedAt || Date.now()}
                />
              ))
            )}
          </ScrollView>
        </View>

        <BottomNav />
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#f0f4ff',
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
  filterContainer: {
    marginRight: 10,
    position: 'relative',
  },
  menuContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 0,
    elevation: 3,
  },
  selectedMenuText: {
    color: '#003366',
    fontWeight: 'bold',
  },
});

export default BookingScreen;