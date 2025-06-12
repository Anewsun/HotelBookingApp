import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import HotelHeader from "../components/HotelHeader";
import RoomTypeSelection from "../components/RoomTypeSelection";
import ReviewsSection from "../components/ReviewsSection";
import HotelMap from '../components/HotelMap';
import { fetchHotelById, fetchAllAmenities, getAvailableRoomsByHotel } from '../services/hotelService';
import { getAmenityIcon } from '../utils/AmenityIcons';
import { getReviewsByHotel, createReview, updateReview } from '../services/reviewService';
import ReviewFormModal from '../components/ReviewFormModal';
import { useAuth } from '../contexts/AuthContext';
import ImageView from "react-native-image-viewing";
import RoomSearchBox from '../components/RoomSearchBox';

const starIcon = require('../assets/images/star.png');

const HotelDetailScreen = () => {
  const route = useRoute();
  const { hotelId, searchParams } = route.params;
  const [hotel, setHotel] = useState(null);
  const [allAmenities, setAllAmenities] = useState([]);
  const [hotelAmenities, setHotelAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const navigation = useNavigation();
  const [reviewCount, setReviewCount] = useState(0);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewsData, setReviewsData] = useState([]);
  const { user } = useAuth();
  const [isCurrentUserHotelOwner, setIsCurrentUserHotelOwner] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [roomSearchParams, setRoomSearchParams] = useState({
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 86400000),
    adults: 1,
    children: 0
  });

  const loadData = async (searchParams = roomSearchParams) => {
    try {
      setLoading(true);
      const formattedParams = {
        checkIn: (searchParams.checkIn || new Date()).toISOString().split('T')[0],
        checkOut: (searchParams.checkOut || new Date(Date.now() + 86400000)).toISOString().split('T')[0],
        capacity: (searchParams.adults || 1) + (searchParams.children || 0)
      };

      const [hotelData, amenitiesData, roomsResponse, reviewsData] = await Promise.all([
        fetchHotelById(hotelId),
        fetchAllAmenities(),
        getAvailableRoomsByHotel(hotelId, formattedParams),
        getReviewsByHotel(hotelId)
      ]);

      setHotel(hotelData);
      setReviewsData(reviewsData);
      setAllAmenities(amenitiesData);
      setReviewCount(reviewsData.length);

      if (roomsResponse && roomsResponse.data) {
        setAvailableRooms(roomsResponse.data);
      } else {
        console.log('No rooms data returned from API');
        setAvailableRooms([]);
      }

      if (hotelData.amenities && amenitiesData.length > 0) {
        const filteredAmenities = amenitiesData.filter(amenity =>
          hotelData.amenities.includes(amenity._id)
        );
        setHotelAmenities(filteredAmenities);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [hotelId, route.params?.searchParams]);

  useEffect(() => {
    // Reset selected rooms khi availableRooms thay đổi
    setSelectedRoomIndex(null);
  }, [availableRooms]);

  useEffect(() => {
    if (hotel && user) {
      const isOwner = user.role === 'partner' && hotel.ownerId === user._id;
      setIsCurrentUserHotelOwner(isOwner);
    }
  }, [hotel, user]);

  useEffect(() => {
    const { searchParams } = route.params || {};

    if (searchParams) {
      const checkIn = searchParams.checkIn ? new Date(searchParams.checkIn + 'T00:00:00') : new Date();
      const checkOut = searchParams.checkOut ? new Date(searchParams.checkOut + 'T00:00:00') : new Date(Date.now() + 86400000);

      setRoomSearchParams({
        checkIn,
        checkOut,
        adults: searchParams.capacity || 1,
        children: 0
      });
    }
  }, [route.params]);

  const handleRoomSearch = (params) => {
    const safeParams = {
      checkIn: params.checkIn || new Date(),
      checkOut: params.checkOut || new Date(Date.now() + 86400000),
      adults: params.adults || 1,
      children: params.children || 0
    };
    setRoomSearchParams(safeParams);
    loadData(safeParams);
  };

  const handleSubmitReview = async (data) => {
    try {
      if (data.reviewId) {
        await updateReview(data.reviewId, data);
      } else {
        await createReview(data);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      await loadData();
      setReviewModalVisible(false);
      setSelectedReview(null);
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    }
  };

  const handleSelectedRoomChange = (selectedIndex) => {
    setSelectedRoomIndex(selectedIndex);
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

  const getAllHotelImages = () => {
    if (!hotel) return [];
    const images = [
      ...(hotel.images || []),
      ...(hotel.roomTypes?.flatMap(room => room.images) || [])
    ];

    // Thêm unique key cho mỗi hình ảnh bằng cách kết hợp URL và index
    return images.map((img, index) => ({
      uri: img.url,
      key: `${img.url}-${index}`
    }));
  };

  if (loading || !hotel) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const totalPrice = selectedRoomIndex !== null
    ? (availableRooms[selectedRoomIndex]?.discountedPrice || availableRooms[selectedRoomIndex]?.price || 0)
    : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={[{}]} // dummy data với 1 phần tử
        keyExtractor={() => 'hotel-detail'}
        renderItem={() => (
          <View>
            <TouchableOpacity onPress={() => {
              if (hotel?.images?.length > 0) {
                setCurrentImageIndex(0);
                setImageViewerVisible(true);
              }
            }}>
              <HotelHeader hotel={hotel} />
            </TouchableOpacity>
            <View style={styles.container}>
              <View style={styles.hotelInfo}>
                <Text style={styles.hotelName}>{hotel.name}</Text>
                <View style={styles.addressRow}>
                  <Icon name="map-marker" size={25} color="black" />
                  <Text style={styles.hotelAddress}>{hotel.address}</Text>
                </View>
                <View style={styles.ratingContainer}>
                  <Image source={starIcon} style={styles.starIcon} />
                  <Text style={styles.rating}>
                    {hotel.rating ? hotel.rating.toFixed(1) : '0.0'}
                  </Text>
                  <Text style={styles.reviewCount}>({reviewCount} đánh giá)</Text>
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

              {hotel.address && (
                <View style={styles.mapSection}>
                  <Text style={styles.sectionTitle}>Vị trí khách sạn</Text>
                  <HotelMap address={hotel.address} />
                  <Text style={styles.mapNote}>
                    Bản đồ hiển thị qua OpenStreetMap
                  </Text>
                </View>
              )}

              <RoomSearchBox
                initialCheckInDate={roomSearchParams.checkIn}
                initialCheckOutDate={roomSearchParams.checkOut}
                initialAdults={roomSearchParams.adults}
                initialChildren={roomSearchParams.children}
                onSearch={handleRoomSearch}
              />

              <RoomTypeSelection
                rooms={availableRooms}
                selectedRoomIndex={selectedRoomIndex}
                onSelectedRoomChange={handleSelectedRoomChange}
                searchParams={route.params.searchParams || null}
              />

              <TouchableOpacity
                style={[
                  styles.chatButton,
                  isCurrentUserHotelOwner && styles.disabledButton
                ]}
                onPress={() => {
                  if (isCurrentUserHotelOwner) return;

                  if (!user) {
                    Alert.alert('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để nhắn tin');
                    return;
                  }

                  navigation.navigate('Chat', {
                    userId: hotel.ownerId,
                    hotelId: hotel._id,
                    hotelName: hotel.name,
                    receiverName: "Chủ khách sạn"
                  });
                }}
                disabled={isCurrentUserHotelOwner}
              >
                <Icon
                  name="comments"
                  size={20}
                  color={isCurrentUserHotelOwner ? "#888" : "#FFF"}
                />
                <Text style={[
                  styles.chatButtonText,
                  isCurrentUserHotelOwner && { color: "#888" }
                ]}>
                  Nhắn tin với chủ khách sạn
                </Text>
              </TouchableOpacity>

              <ReviewsSection
                hotelId={hotelId}
                onEditReview={(review) => {
                  setSelectedReview(review);
                  setReviewModalVisible(true);
                }}
                onReviewSubmit={loadData}
              />
            </View>

            <ImageView
              images={getAllHotelImages()}
              imageIndex={currentImageIndex}
              visible={imageViewerVisible}
              onRequestClose={() => setImageViewerVisible(false)}
              presentationStyle="overFullScreen"
              backgroundColor="rgba(0,0,0,0.9)"
              swipeToCloseEnabled={true}
              doubleTapToZoomEnabled={true}
              keyExtractor={(item) => item.key}
            />
          </View>
        )}
        ListFooterComponent={
          <View style={{ height: 30 }} />
        }
      />

      <View style={styles.bookingSection}>
        <View style={styles.bookingPriceWrapper}>
          {selectedRoomIndex !== null && availableRooms[selectedRoomIndex]?.discountPercent > 0 && (
            <Text style={styles.originalPrice}>
              {availableRooms[selectedRoomIndex].price.toLocaleString()} VNĐ
            </Text>
          )}
          <Text style={styles.price}>
            {totalPrice.toLocaleString()} VNĐ
            {selectedRoomIndex !== null && <Text style={styles.perNight}>/đêm</Text>}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.bookNowButton, selectedRoomIndex === null && styles.disabledButton]}
          onPress={() => {
            if (selectedRoomIndex !== null) {
              const selectedRoom = availableRooms[selectedRoomIndex];
              const priceToUse = selectedRoom.discountPercent > 0
                ? selectedRoom.discountedPrice
                : selectedRoom.price;

              navigation.navigate('PaymentStep', {
                selectedRoom: {
                  ...selectedRoom,
                  price: selectedRoom.price,
                },
                hotel: hotel,
                searchParams: {
                  checkIn: roomSearchParams.checkIn.toISOString(),
                  checkOut: roomSearchParams.checkOut.toISOString(),
                  checkInTime: '14:00',
                  checkOutTime: '12:00'
                }
              });
            }
          }}
          disabled={selectedRoomIndex === null}
        >
          <Text style={styles.bookNowText}>Đặt phòng ngay</Text>
        </TouchableOpacity>
      </View>

      <ReviewFormModal
        visible={reviewModalVisible}
        hotelId={hotelId}
        initialData={selectedReview}
        onClose={() => {
          setReviewModalVisible(false);
          setSelectedReview(null);
        }}
        onSubmit={handleSubmitReview}
      />
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
    marginVertical: 0,
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
  originalPrice: {
    fontSize: 16,
    color: '#888',
    textDecorationLine: 'line-through',
    marginRight: 5,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 25,
    marginLeft: 10,
    flex: 1
  },
  chatButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold'
  },
  mapSection: {
    marginVertical: 15,
  },
  mapNote: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default HotelDetailScreen;
