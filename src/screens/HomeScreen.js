import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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

const HomeScreen = () => {
  const navigation = useNavigation();
  const { data: hotels = [], isLoading, isError, refetch } = useHotels();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const { favoriteIds, toggleFavorite } = useFavorite();
  const [currentPage, setCurrentPage] = useState(1);
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

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  const handlePressHotel = (hotel) => {
    navigation.navigate('Detail', { hotelId: hotel._id });
  };

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  if (isError) {
    return <Text>Error loading hotels</Text>;
  }

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
            <HotelCard
              hotel={item}
              onPress={() => handlePressHotel(item)}
              isFavorite={favoriteIds.includes(item._id)}
              onToggleFavorite={() => toggleFavorite(item._id)}
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