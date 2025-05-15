import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import HotelHeader from "../components/HotelHeader";
import RoomTypeSelection from "../components/RoomTypeSelection";
import ReviewsSection from "../components/ReviewsSection";
import { useFavorite } from '../contexts/FavoriteContext';
import { fetchHotelById, fetchAllAmenities } from '../services/hotelService';
import { getAmenityIcon } from '../utils/AmenityIcons';

const starIcon = require('../assets/images/star.png');

const HotelDetailScreen = () => {
  const route = useRoute();
  const { hotelId } = route.params;
  const [hotel, setHotel] = useState(null);
  const [allAmenities, setAllAmenities] = useState([]);
  const [hotelAmenities, setHotelAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [selectedRoomIndexes, setSelectedRoomIndexes] = useState([]);
  const { favoriteIds, toggleFavorite } = useFavorite();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch song song hotel data và amenities
        const [hotelData, amenitiesData] = await Promise.all([
          fetchHotelById(hotelId),
          fetchAllAmenities() // Hàm này cần được thêm vào hotelService
        ]);

        setHotel(hotelData);
        setAllAmenities(amenitiesData);

        // Lọc amenities của khách sạn
        if (hotelData.amenities && amenitiesData.length > 0) {
          const filteredAmenities = amenitiesData.filter(amenity =>
            hotelData.amenities.includes(amenity._id)
          );
          setHotelAmenities(filteredAmenities);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [hotelId]);

  const handleSelectedRoomsChange = (selectedIndexes) => {
    setSelectedRoomIndexes(selectedIndexes);
  };

  if (loading || !hotel) {
    return <ActivityIndicator size="large" />;
  }

  const totalPrice = selectedRoomIndexes.reduce((sum, index) => sum + hotel.rooms[index].price, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={[{}]} // dummy data với 1 phần tử
        keyExtractor={() => 'hotel-detail'}
        renderItem={() => (
          <View>
            <HotelHeader
              hotel={hotel}
            />
            <View style={styles.container}>
              <View style={styles.hotelInfo}>
                <Text style={styles.hotelName}>{hotel.name}</Text>
                <View style={styles.addressRow}>
                  <Icon name="map-marker" size={25} color="black" />
                  <Text style={styles.hotelAddress}>{hotel.address}</Text>
                </View>
                <View style={styles.ratingContainer}>
                  <Image source={starIcon} style={styles.starIcon} />
                  <Text style={styles.rating}>{hotel.rating}</Text>
                  <Text style={styles.reviewCount}>(3 đánh giá)</Text>
                </View>
              </View>

              {hotelAmenities.length > 0 && (
                <View style={styles.facilitiesSection}>
                  <Text style={styles.facilitiesTitle}>Các tiện nghi</Text>
                  <FlatList
                    data={hotelAmenities}
                    keyExtractor={(item) => item._id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.facilityIcons}
                    renderItem={({ item }) => (
                      <View style={styles.facilityIconContainer}>
                        {getAmenityIcon(item.icon)}
                        <Text style={styles.facilityName}>{item.name}</Text>
                      </View>
                    )}
                  />
                </View>
              )}

              <View style={styles.descriptionSection}>
                <Text style={styles.descriptionTitle}>Miêu tả</Text>
                <Text
                  style={styles.descriptionText}
                  numberOfLines={showFullDesc ? 0 : 2}
                >
                  {hotel.description}
                </Text>
                <TouchableOpacity onPress={() => setShowFullDesc(!showFullDesc)}>
                  <Text style={styles.readMore}>{showFullDesc ? 'Thu gọn' : 'Xem thêm'}</Text>
                </TouchableOpacity>
              </View>
              <RoomTypeSelection
                rooms={hotel.rooms}
                selectedRoomIndexes={selectedRoomIndexes}
                onSelectedRoomsChange={handleSelectedRoomsChange}
              />
              <ReviewsSection />
            </View>
          </View>
        )}
        ListFooterComponent={
          <View style={{ height: 100 }} />
        }
      />

      <View style={styles.bookingSection}>
        <View style={styles.bookingPriceWrapper}>
          <Text style={styles.price}>{totalPrice.toLocaleString()} VNĐ/ngày</Text>
        </View>
        <TouchableOpacity style={styles.bookNowButton}>
          <Text style={styles.bookNowText}>Đặt phòng ngay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    width: '100%',
    padding: 14,
    backgroundColor: '#fefefe',
    paddingBottom: 100,
  },
  hotelInfo: {
    marginBottom: 20,
  },
  hotelName: {
    fontSize: 21,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hotelAddress: {
    fontSize: 16,
    color: 'black',
    marginLeft: 5,
    flexShrink: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  starIcon: {
    width: 15,
    height: 15,
    marginRight: 4,
  },
  rating: {
    fontSize: 16,
    color: 'black',
    marginRight: 5,
  },
  reviewCount: {
    fontSize: 15,
    color: 'gray',
  },
  facilitiesSection: {
    marginBottom: 20,
  },
  facilitiesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  facilityIcons: {
    gap: 15,
  },
  facilityIconContainer: {
    alignItems: 'center',
    width: 70,
  },
  facilityName: {
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
    marginTop: 4,
  },
  descriptionSection: {
    marginBottom: 5,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 15,
    color: 'black',
    lineHeight: 20,
  },
  readMore: {
    fontSize: 14,
    color: 'blue',
    marginTop: 5,
  },
  bookingSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    elevation: 10,
  },
  bookingPriceWrapper: {
    flex: 1,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  bookNowButton: {
    backgroundColor: '#1167B1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
  },
  bookNowText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default HotelDetailScreen;
