import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBox from '../components/SearchBox';
import HotelCard from '../components/HotelCard';
import BottomNav from '../components/BottomNav';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

const hotels = [
  { id: 1, name: 'The Dreamland Villas', location: '8, Lê Lợi, Nha Trang', price: '340000 VND', rating: 4.8, image: require('../assets/images/hotel1.jpg') },
  { id: 2, name: 'Khách sạn Paradise', location: '56/7, Ngô Quyền, Vũng Tàu', price: '370000 VND', rating: 4.7, image: require('../assets/images/hotel2.jpg') },
  { id: 3, name: 'Khách sạn Sunrise', location: '123, Trần Phú, Đà Nẵng', price: '400000 VND', rating: 4.9, image: require('../assets/images/hotel3.jpg') },
  { id: 4, name: 'Khách sạn Ocean View', location: '45, Nguyễn Văn Cừ, Nha Trang', price: '450000 VND', rating: 4.6, image: require('../assets/images/hotel4.jpg') },
  { id: 5, name: 'Khách sạn Luxury', location: '78, Lê Thánh Tôn, TP.HCM', price: '500000 VND', rating: 4.5, image: require('../assets/images/hotel5.jpg') },
  { id: 6, name: 'Khách sạn Royal', location: '90, Trần Hưng Đạo, Hà Nội', price: '550000 VND', rating: 4.4, image: require('../assets/images/hotel6.jpg') },
  { id: 7, name: 'Khách sạn Diamond', location: '12, Lê Duẩn, Nha Trang', price: '600000 VND', rating: 4.3, image: require('../assets/images/hotel7.jpg') },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, refreshUserData } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 6;
  const totalPages = Math.ceil(hotels.length / hotelsPerPage);

  const paginatedHotels = hotels.slice((currentPage - 1) * hotelsPerPage, currentPage * hotelsPerPage);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
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
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.hotelContainer}>
            <HotelCard hotel={item} onPress={() => navigation.navigate('Detail', { hotel: item })} />            </View>
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