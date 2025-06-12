import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBox from '../components/SearchBox';
import HotelCard from '../components/HotelCard';
import BottomNav from '../components/BottomNav';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
import { useFavorite } from '../contexts/FavoriteContext';
import { useAuth } from '../contexts/AuthContext';
import { useHotels } from '../hooks/useHotels';
import useNotifications from '../hooks/useNotifications';
import { initSocket, getSocket, isSocketConnected } from '../utils/socket';
import PopularLocationCard from '../components/PopularLocationCard';
import { getPopularLocations } from '../services/locationService';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { data: hotels = [], isLoading, isError, refetch } = useHotels({ discounted: true });
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const { favoriteIds, toggleFavorite } = useFavorite();
  const [currentPage, setCurrentPage] = useState(1);
  const { notifications, hasUnread } = useNotifications(user?.accessToken);
  const [popularLocations, setPopularLocations] = useState([]);
  const hotelsPerPage = 6;

  const totalPages = Math.ceil(hotels.length / hotelsPerPage);
  const paginatedHotels = hotels.slice((currentPage - 1) * hotelsPerPage, currentPage * hotelsPerPage);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const setupSocket = async () => {
      try {
        if (!isSocketConnected()) {
          await initSocket();
        }

        const socket = getSocket();
        socket.on('notification', () => {
          refetch();
        });

        return () => {
          socket?.off('notification');
        };
      } catch (error) {
        console.log('Socket setup failed, using polling:', error.message);
        const interval = setInterval(refetch, 30000);
        return () => clearInterval(interval);
      }
    };

    setupSocket();
  }, []);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const data = await getPopularLocations();
        setPopularLocations(data);
      } catch (error) {
        console.error('Lỗi khi tải địa điểm nổi tiếng:', error);
      }
    };
    fetchPopular();
  }, []);

  const handlePressHotel = (hotel) => {
    navigation.navigate('Detail', {
      hotelId: hotel._id,
      searchParams: {
        checkIn: new Date().toLocaleDateString('en-CA'),
        checkOut: new Date(Date.now() + 86400000).toLocaleDateString('en-CA'),
        capacity: 1,
        fromSearch: false
      }
    });
  };

  const handlePressLocation = (location) => {
    navigation.navigate('SearchResult', {
      searchParams: {
        locationId: location._id,
        locationName: location.name,
        checkIn: new Date().toLocaleDateString('en-CA'),
        checkOut: new Date(Date.now() + 86400000).toLocaleDateString('en-CA'),
        capacity: 1,
      }
    });
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return <Text>Lỗi loading khách sạn</Text>;
  }

  if (!hotels || hotels.length === 0) {
    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/icons/error.jpg')}
          style={styles.noDealsImage}
        />
        <Text style={styles.noDealsText}>Hiện không có khách sạn giảm giá</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View style={styles.nameContainer}>
                <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                  {user && user.name ? `Chào ${user.name}!` : 'Đang tải...'}
                </Text>
                <Icon
                  name="hand-left-outline"
                  size={24}
                  color="gold"
                  style={styles.handIcon}
                />
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('Notification')}
                style={styles.notificationButton}
              >
                <Icon1 name="bell" size={24} color="red" />
                {hasUnread && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.badgeText}>!</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.title}>Bắt đầu đặt phòng ngay nào!</Text>
            <SearchBox />

            <Text style={styles.sectionTitle}>Địa điểm nổi tiếng</Text>
            <FlatList
              data={popularLocations}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ paddingHorizontal: 15 }}
              renderItem={({ item }) => (
                <PopularLocationCard
                  location={item}
                  onPress={() => handlePressLocation(item)}
                />
              )}
            />
            <Text style={styles.sectionTitle}>Khách sạn đang có giảm giá</Text>
          </>
        }
        data={paginatedHotels}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.hotelContainer}>
            <HotelCard
              hotel={item}
              onPress={() => handlePressHotel(item)}
              isFavorite={favoriteIds.includes(item._id)}
              onToggleFavorite={() => toggleFavorite(item._id)}
              showDiscountBadge={true}
            />
          </View>
        )}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListFooterComponent={
          <View style={styles.pagination}>
            {Array.from({ length: totalPages }, (_, index) => (
              <TouchableOpacity
                key={index + 1}
                onPress={() => setCurrentPage(index + 1)}
                style={[styles.pageButton, currentPage === index + 1 && styles.activePageButton]}
              >
                <Text style={styles.pageButtonText}>{index + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
        }
      />

      <BottomNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 35,
    paddingHorizontal: 15,
  },
  handIcon: {
    marginLeft: 5,
  },
  section: {
    padding: 20
  },
  hotelContainer: {
    flex: 1,
    alignItems: 'left',
    paddingLeft: 15,
    paddingBottom: 10
  },
  row: {
    justifyContent: 'space-between'
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  name: {
    fontSize: 17,
    color: 'gray',
    flexShrink: 1,
  },
  title: {
    padding: 20,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 20
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pageButton: {
    margin: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'lightgray'
  },
  activePageButton: {
    backgroundColor: '#1167B1'
  },
  pageButtonText: {
    fontSize: 16
  },
  notificationButton: {
    position: 'relative',
    marginRight: 10,
  },
  notificationBadge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  noDealsImage: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: 50,
  },
  noDealsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
});

export default HomeScreen;