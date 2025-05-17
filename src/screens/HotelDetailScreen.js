import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import HotelHeader from "../components/HotelHeader";
import RoomTypeSelection from "../components/RoomTypeSelection";
import ReviewsSection from "../components/ReviewsSection";
import { fetchHotelById, fetchAllAmenities } from '../services/hotelService';
import { getAvailableRoomsByHotel } from '../services/roomService';
import { getAmenityIcon } from '../utils/AmenityIcons';

const starIcon = require('../assets/images/star.png');

const HotelDetailScreen = () => {
  const route = useRoute();
  const { hotelId, searchParams } = route.params;
  const [hotel, setHotel] = useState(null);
  const [allAmenities, setAllAmenities] = useState([]);
  const [hotelAmenities, setHotelAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [selectedRoomIndexes, setSelectedRoomIndexes] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const searchParams = route.params?.searchParams || {
          checkIn: new Date().toISOString().split('T')[0],
          checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          capacity: 2
        };
        // Fetch song song hotel data và amenities
        const [hotelData, amenitiesData, roomsResponse] = await Promise.all([
          fetchHotelById(hotelId),
          fetchAllAmenities(),
          getAvailableRoomsByHotel(hotelId, searchParams)
        ]);

        setHotel(hotelData);
        setAllAmenities(amenitiesData);
        if (roomsResponse && roomsResponse.data) {
          setAvailableRooms(roomsResponse.data);
        } else {
          console.log('No rooms data returned from API');
          setAvailableRooms([]);
        }
        // Lọc amenities của khách sạn
        if (hotelData.amenities && amenitiesData.length > 0) {
          const filteredAmenities = amenitiesData.filter(amenity =>
            hotelData.amenities.includes(amenity._id)
          );
          setHotelAmenities(filteredAmenities);
        }
      } catch (error) {
        console.error('Full error details:', {
          error: error.response?.data || error.message,
          stack: error.stack
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [hotelId, route.params?.searchParams]);

  useEffect(() => {
    // Reset selected rooms khi availableRooms thay đổi
    setSelectedRoomIndexes([]);
  }, [availableRooms]);

  const handleSelectedRoomsChange = (selectedIndexes) => {
    setSelectedRoomIndexes(selectedIndexes);
  };

  const renderPolicyItem = (label, value, iconName) => {
    return (
      <View style={styles.policyRow}>
        <View style={styles.rowContainer}>
          <View style={styles.leftCell}>
            <View style={styles.labelContent}>
              <Icon name={iconName} size={16} color="#fff" style={styles.policyIcon} />
              <Text style={styles.policyLabel}>{label}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.rightCell}>
            <Text style={styles.policyValue}>{value}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading || !hotel) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const totalPrice = selectedRoomIndexes.reduce((sum, index) => {
    const room = availableRooms[index];
    if (!room) return sum;

    // Kiểm tra điều kiện giảm giá
    const hasDiscount = room.discountPercent > 0 && room.discountedPrice;

    // Lấy giá đúng (ưu tiên discountedPrice nếu có discount hợp lệ)
    const price = hasDiscount ? room.discountedPrice : room.price;

    return sum + (price || 0);
  }, 0);

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
                  <Text style={styles.readMore}>{showFullDesc ? 'Thu gọn' : 'Xem thêm ...'}</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionTitle}>Chính sách khách sạn</Text>
              <View style={styles.policiesSection}>
                <View style={styles.policiesContainer}>
                  {renderPolicyItem('Giờ nhận phòng', hotel.policies.checkInTime, 'sign-in')}
                  {renderPolicyItem('Giờ trả phòng', hotel.policies.checkOutTime, 'sign-out')}
                  {renderPolicyItem('Chính sách hủy phòng',
                    hotel.policies.cancellationPolicy === "24h-full-refund" ? "Hoàn tiền 100% nếu hủy trước 24h" :
                      hotel.policies.cancellationPolicy === "24h-half-refund" ? "Hoàn tiền 50% nếu hủy trước 24h" :
                        "Không hoàn tiền khi hủy phòng",
                    'undo')}
                  {renderPolicyItem('Chính sách trẻ em',
                    hotel.policies.childrenPolicy === "yes" ? "Cho phép" : "Không cho phép",
                    'child')}
                  {renderPolicyItem('Chính sách thú cưng',
                    hotel.policies.petPolicy === "yes" ? "Cho phép" : "Không cho phép",
                    'paw')}
                  {renderPolicyItem('Chính sách hút thuốc',
                    hotel.policies.smokingPolicy === "yes" ? "Cho phép" : "Không cho phép",
                    'fire')}
                </View>
              </View>

              <RoomTypeSelection
                rooms={availableRooms}
                selectedRoomIndexes={selectedRoomIndexes}
                onSelectedRoomsChange={handleSelectedRoomsChange}
                searchParams={route.params.searchParams || null}
              />
              <ReviewsSection />
            </View>
          </View>
        )}
        ListFooterComponent={
          <View style={{ height: 30 }} />
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 15,
  },
  policiesSection: {
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  policiesContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  policyRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  rowContainer: {
    flexDirection: 'row',
    minHeight: 50,
  },
  leftCell: {
    flex: 1,
    backgroundColor: '#1a73e8',
    justifyContent: 'center',
  },
  rightCell: {
    flex: 1,
    backgroundColor: '#8ab4f8',
    padding: 10,
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: '#fff',
    marginVertical: 0, // Đảm bảo không có margin dọc
  },
  labelContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  policyIcon: {
    marginRight: 10,
    marginLeft: 5
  },
  policyLabel: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '500',
  },
  policyValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1a3e8c',
    textAlign: 'right',
  },
});

export default HotelDetailScreen;
