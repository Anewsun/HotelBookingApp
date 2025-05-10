import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import HotelHeader from "../components/HotelHeader";
import RoomTypeSelection from "../components/RoomTypeSelection";
import ReviewsSection from "../components/ReviewsSection";
import { rooms } from '../components/RoomData';

const starIcon = require('../assets/images/star.png');

const FACILITIES = [
  { name: 'Wifi', icon: 'wifi' },
  { name: 'Điều hoà', icon: 'snowflake-o' },
  { name: 'Gym', icon: 'heart' },
  { name: 'Bãi biển', icon: 'umbrella' },
  { name: 'Hồ bơi', icon: 'bath' },
];

const HotelDetailScreen = () => {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [selectedRoomIndexes, setSelectedRoomIndexes] = useState([]);
  const description = "Khách sạn Biển Xanh nằm ngay trung tâm thành phố Nha Trang, chỉ cách bãi biển vài bước chân. Khách sạn có phòng nghỉ hiện đại, tiện nghi đầy đủ và dịch vụ thân thiện.";

  const handleSelectedRoomsChange = (selectedIndexes) => {
    setSelectedRoomIndexes(selectedIndexes);
  };

  const totalPrice = selectedRoomIndexes.reduce((sum, index) => sum + rooms[index].price, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={[{}]} // dummy data với 1 phần tử
        keyExtractor={() => 'hotel-detail'}
        renderItem={() => (
          <View>
            <HotelHeader />
            <View style={styles.container}>
              <View style={styles.hotelInfo}>
                <Text style={styles.hotelName}>Khách sạn Biển Xanh</Text>
                <View style={styles.addressRow}>
                  <Icon name="map-marker" size={25} color="black" />
                  <Text style={styles.hotelAddress}>123 Đường Trần Phú, Phường Lộc Thọ, TP. Nha Trang, Khánh Hòa</Text>
                </View>
                <View style={styles.ratingContainer}>
                  <Image source={starIcon} style={styles.starIcon} />
                  <Text style={styles.rating}>4.7</Text>
                  <Text style={styles.reviewCount}>(3 đánh giá)</Text>
                </View>
              </View>

              <View style={styles.facilitiesSection}>
                <Text style={styles.facilitiesTitle}>Các tiện nghi</Text>
                <FlatList
                  data={FACILITIES}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.facilityIcons}
                  renderItem={({ item }) => (
                    <View style={styles.facilityIconContainer}>
                      <Icon name={item.icon} size={30} color="black" />
                      <Text style={styles.facilityName}>{item.name}</Text>
                    </View>
                  )}
                />
              </View>

              <View style={styles.descriptionSection}>
                <Text style={styles.descriptionTitle}>Miêu tả</Text>
                <Text
                  style={styles.descriptionText}
                  numberOfLines={showFullDesc ? 0 : 2}
                >
                  {description}
                </Text>
                <TouchableOpacity onPress={() => setShowFullDesc(!showFullDesc)}>
                  <Text style={styles.readMore}>{showFullDesc ? 'Thu gọn' : 'Xem thêm'}</Text>
                </TouchableOpacity>
              </View>
              <RoomTypeSelection selectedRoomIndexes={selectedRoomIndexes} onSelectedRoomsChange={handleSelectedRoomsChange} />
              <ReviewsSection />
            </View>
          </View>
        )}
        ListFooterComponent={
          <View style={{ height: 100 }} /> // để không bị che bởi booking section
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
