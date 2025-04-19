import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBox from '../components/SearchBox';
import HotelCard from '../components/HotelCard';
import BottomNav from '../components/BottomNav';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { fetchHotels } from '../services/hotelService';
import { getFavorites, addFavorite, removeFavorite } from '../services/userService';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, refreshUserData } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 6;

  const totalPages = Math.ceil(hotels.length / hotelsPerPage);

  const paginatedHotels = hotels.slice((currentPage - 1) * hotelsPerPage, currentPage * hotelsPerPage);

  const loadHotels = async () => {
    try {
      const data = await fetchHotels();
      setHotels(data);
    } catch (error) {
      console.error('Failed to fetch hotels:', error);
    }
  };

  useEffect(() => {
    loadHotels();  // Load data lần đầu tiên khi màn hình được render lần đầu.
  }, []);

  // Đảm bảo khi màn hình quay lại, data sẽ được reload
  useFocusEffect(
    useCallback(() => {
      loadHotels();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await fetchHotels();
      setHotels(data);
    } catch (error) {
      console.error('Failed to fetch hotels:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handlePressHotel = (hotel) => {
    navigation.navigate('Detail', { hotelId: hotel._id });
  };

  const fetchFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavoriteIds(data.map(h => h._id));
    } catch (e) {
      console.log('❌ Lỗi fetch favorites:', e);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (hotelId) => {
    try {
      if (favoriteIds.includes(hotelId)) {
        await removeFavorite(hotelId);
        setFavoriteIds(prev => prev.filter(id => id !== hotelId));
      } else {
        await addFavorite(hotelId);
        setFavoriteIds(prev => [...prev, hotelId]);
      }
    } catch (err) {
      console.error('❌ Toggle favorite failed:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.name}>{user && user.name ? `Chào ${user.name}!` : 'Đang tải...'}</Text>
              <Icon name="hand-left-outline" size={24} color="gold" style={styles.icon} />
              <Icon1 name="bell" size={24} color="black" style={styles.bellIcon} />
            </View>
            <Text style={styles.title}>Bắt đầu đặt phòng ngay nào!</Text>
            <SearchBox />
            <Text style={styles.sectionTitle}>Khách sạn phổ biến</Text>
          </>
        }
        data={paginatedHotels}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.hotelContainer}>
            <HotelCard hotel={item} onPress={() => handlePressHotel(item)} isFavorite={favoriteIds.includes(item._id)} onToggleFavorite={() => handleToggleFavorite(item._id)} />
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
    backgroundColor: 'white'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 35,
  },
  icon: {
    marginRight: 200
  },
  bellIcon: {
    marginRight: 30
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
  name: {
    fontSize: 17,
    color: 'gray',
    marginLeft: 20
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
});

export default HomeScreen;