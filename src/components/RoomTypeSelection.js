import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getAmenityIcon } from '../utils/AmenityIcons';
import { formatDate } from '../utils/dateUtils';
import ImageView from "react-native-image-viewing";
import { getAvailableRoomsByHotel } from '../services/hotelService';

const { width: viewportWidth } = Dimensions.get('window');

const RoomTypeSelection = ({
  rooms = [],
  selectedRoomIndex = null,
  onSelectedRoomChange = () => { },
  searchParams = null,
  hotelId
}) => {
  const [expandedRooms, setExpandedRooms] = useState([]);
  const [showAllRooms, setShowAllRooms] = useState(false);
  const initialRoomCount = 2;
  const [localSelectedIndex, setLocalSelectedIndex] = useState(selectedRoomIndex);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentRoomImages, setCurrentRoomImages] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState(rooms);
  const [loading, setLoading] = useState(false);

  // Kiểm tra chế độ tìm kiếm
  const isSearchMode = searchParams?.checkIn && searchParams?.checkOut && searchParams?.capacity;

  useEffect(() => {
    setLocalSelectedIndex(selectedRoomIndex);
  }, [selectedRoomIndex]);

  useEffect(() => {
    if (searchParams) {
      fetchFilteredRooms();
    } else {
      setFilteredRooms(rooms);
    }
  }, [searchParams, rooms]);

  const fetchFilteredRooms = async () => {
    try {
      setLoading(true);
      const formattedParams = {
        checkIn: searchParams.checkIn.toISOString().split('T')[0],
        checkOut: searchParams.checkOut.toISOString().split('T')[0],
        capacity: searchParams.adults + searchParams.children
      };
      const response = await getAvailableRoomsByHotel(hotelId, formattedParams);
      setFilteredRooms(response.data || []);
    } catch (error) {
      console.error('Error fetching filtered rooms:', error);
      setFilteredRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const displayedRooms = showAllRooms ? filteredRooms : filteredRooms.slice(0, initialRoomCount);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  const handleRoomSelect = (index) => {
    if (!isSearchMode && rooms[index].status !== 'available') return;

    const newIndex = localSelectedIndex === index ? null : index;

    setLocalSelectedIndex(newIndex);
    onSelectedRoomChange(newIndex);
  };

  const formatPrice = (room) => {
    const hasDiscount = room.discountPercent > 0 && room.discountedPrice;

    return {
      original: room.price?.toLocaleString('vi-VN') || '0',
      discounted: hasDiscount
        ? room.discountedPrice?.toLocaleString('vi-VN')
        : room.price?.toLocaleString('vi-VN'),
      hasDiscount: !!hasDiscount,
      priceToUse: hasDiscount ? room.discountedPrice : room.price
    };
  };

  const toggleRoomDetails = (index) => {
    setExpandedRooms(prev => {
      const currentExpanded = Array.isArray(prev) ? prev : [];
      return currentExpanded.includes(index)
        ? currentExpanded.filter(i => i !== index)
        : [...currentExpanded, index];
    });
  };

  const openImageViewer = (images, index) => {
    setCurrentRoomImages(images.map(img => ({ uri: img.url })));
    setCurrentImageIndex(index);
    setImageViewerVisible(true);
  };

  const renderSearchInfo = () => {
    if (!searchParams || !searchParams.fromSearch) return null;

    return (
      <View style={styles.searchInfoContainer}>
        <Text style={styles.searchInfoText}>
          <Icon name="calendar-alt" size={14} color="black" /> {searchParams.checkIn} → {searchParams.checkOut}
        </Text>
        <Text style={styles.searchInfoText}>
          <Icon name="users" size={14} color="black" /> {searchParams.capacity} người
        </Text>
      </View>
    );
  };

  const renderRoomPrice = (room) => {
    const priceInfo = formatPrice(room);

    return (
      <View>
        {priceInfo.hasDiscount && (
          <>
            <Text style={styles.originalPrice}>{priceInfo.original} VNĐ</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{room.discountPercent}%</Text>
            </View>
          </>
        )}
        <Text style={styles.roomPrice}>
          {priceInfo.discounted} VNĐ
          <Text style={styles.perNight}> /đêm</Text>
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chọn phòng</Text>

      {renderSearchInfo()}

      {displayedRooms.length === 0 ? (
        <Text style={styles.noRoomsText}>Không có phòng nào</Text>
      ) : (
        displayedRooms.map((room, index) => (
          <View key={room._id || index} style={[
            styles.roomBox,
            localSelectedIndex === index && styles.selectedRoom,
            (!isSearchMode && room.status !== 'available') && styles.disabledRoom
          ]}>
            <View style={[styles.roomContent, localSelectedIndex === index && styles.selectedRoomBorder]}>
              {room.images?.length > 0 && (
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  style={styles.imageScrollView}
                >
                  {room.images.map((img, imgIndex) => (
                    <TouchableOpacity
                      key={img._id || imgIndex}
                      onPress={() => openImageViewer(room.images, imgIndex)}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={{ uri: img.url }}
                        style={styles.roomImage}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              <View style={styles.roomInfo}>
                <View style={styles.roomHeader}>
                  <Text style={styles.roomTitle}>{room.name}</Text>
                  <TouchableOpacity onPress={() => toggleRoomDetails(index)}>
                    <Icon name={expandedRooms.includes(index) ? "chevron-up" : "chevron-down"} size={20} />
                  </TouchableOpacity>
                </View>

                {room.amenities?.length > 0 ? (
                  <View style={styles.featuresContainer}>
                    {room.amenities.map((amenity, idx) => {
                      return (
                        <View key={amenity._id || idx} style={styles.featureItem}>
                          {getAmenityIcon(amenity.icon)}
                          <Text style={styles.featureText}>{amenity.name}</Text>
                        </View>
                      );
                    })}
                  </View>
                ) : null}

                <View style={styles.priceAndCheckbox}>
                  {renderRoomPrice(room)}
                  <TouchableOpacity onPress={() => handleRoomSelect(index)} disabled={!isSearchMode && room.status !== 'available'}>
                    <View style={styles.checkbox}>
                      <Icon
                        name={localSelectedIndex === index ? "check-square" : "square"}
                        size={24}
                        color={
                          (!isSearchMode && room.status !== 'available') ? '#ddd' :
                            localSelectedIndex === index ? '#2196F3' : '#aaa'
                        }
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {expandedRooms.includes(index) && (
              <View style={styles.detailsContainer}>
                {room.description && (
                  <>
                    <Text style={styles.detailsTitle}>Mô tả</Text>
                    <Text style={styles.detailsText}>{room.description}</Text>
                  </>
                )}

                <View style={styles.infoContainer}>
                  <Text style={styles.detailsTitle}>Thông tin chi tiết phòng</Text>
                  <View style={styles.infoRow}>
                    <Icon name="building" size={20} color="#555" />
                    <Text style={styles.detailsText}>Tầng: {room.floor}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Icon name="chart-area" size={20} color="#555" />
                    <Text style={styles.detailsText}>Diện tích: {room.squareMeters} m²</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Icon name="door-closed" size={20} color="#555" />
                    <Text style={styles.detailsText}>Loại phòng: {room.roomType}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Icon name="bed" size={20} color="#555" />
                    <Text style={styles.detailsText}>Loại giường: {room.bedType}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Icon name="user-friends" size={20} color="#555" />
                    <Text style={styles.detailsText}>Số lượng khách tối đa: {room.capacity}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        ))
      )}

      {rooms.length > initialRoomCount && (
        <TouchableOpacity
          style={styles.toggleRoomsButton}
          onPress={() => setShowAllRooms(!showAllRooms)}
        >
          <Text style={styles.toggleRoomsText}>
            {showAllRooms ? 'Thu gọn' : `Xem thêm (${rooms.length - initialRoomCount})`}
          </Text>
          <Icon
            name={showAllRooms ? "chevron-up" : "chevron-down"}
            size={16}
            color="white"
          />
        </TouchableOpacity>
      )}

      <ImageView
        images={currentRoomImages}
        imageIndex={currentImageIndex}
        visible={imageViewerVisible}
        onRequestClose={() => setImageViewerVisible(false)}
        presentationStyle="overFullScreen"
        backgroundColor="rgba(0,0,0,0.9)"
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: '#333',
  },
  roomBox: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
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
  selectedRoom: {
    backgroundColor: "#e3f2fd",
    borderColor: '#2196F3',
  },
  selectedRoomBorder: {
    borderColor: '#2196F3',
  },
  roomContent: {
    flexDirection: "column",
  },
  roomInfo: {
    flex: 1,
    flexDirection: "column",
  },
  roomHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  roomTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  imageScrollView: {
    height: 200,
    marginBottom: 15,
  },
  roomImage: {
    width: viewportWidth - 60,
    height: 200,
    resizeMode: 'cover',
  },
  priceAndCheckbox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  featuresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 8,
    padding: 5,
    borderRadius: 5,
  },
  featureText: {
    marginLeft: 5,
    fontSize: 13,
    color: "#555",
  },
  noRoomsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666'
  },
  checkbox: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  detailsTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: "#333",
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 16,
    color: "black",
    marginBottom: 8,
    lineHeight: 20,
    fontWeight: '500'
  },
  infoContainer: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  discount: {
    fontSize: 14,
    color: '#E53935',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 3,
    alignSelf: 'flex-start',
  },
  discountText: {
    fontSize: 18,
    color: 'red',
  },
  originalPrice: {
    fontSize: 16,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  roomPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  perNight: {
    fontSize: 17,
    fontWeight: 'normal',
    color: 'black',
  },
  disabledRoom: {
    opacity: 0.7,
    backgroundColor: '#f5f5f5',
  },
  toggleRoomsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginTop: 8,
    backgroundColor: 'gray',
    borderRadius: 25,
  },
  toggleRoomsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 6,
  },
  searchInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  searchInfoText: {
    fontSize: 14,
    color: '#555',
    alignItems: 'center',
  },
  discountBadge: {
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 3,
  },
  loadingContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default RoomTypeSelection;