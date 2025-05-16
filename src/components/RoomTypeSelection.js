import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getAmenityIcon } from '../utils/AmenityIcons';

const { width: viewportWidth } = Dimensions.get('window');

const RoomTypeSelection = ({ rooms = [], selectedRoomIndexes = [], onSelectedRoomsChange = () => { } }) => {
  const [expandedRoom, setExpandedRoom] = useState(null);
  const [showAllRooms, setShowAllRooms] = useState(false);
  const initialRoomCount = 2;
  const displayedRooms = showAllRooms ? rooms : rooms.slice(0, initialRoomCount);

  const toggleRoomDetails = (index) => {
    setExpandedRoom(expandedRoom === index ? null : index);
  };

  const handleRoomSelect = (index) => {
    if (rooms[index].status !== 'available') return;

    const updated = selectedRoomIndexes.includes(index)
      ? selectedRoomIndexes.filter(i => i !== index)
      : [...selectedRoomIndexes, index];
    onSelectedRoomsChange(updated);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Trống';
      case 'booked': return 'Đã đặt';
      case 'maintenance': return 'Đang dọn phòng';
      default: return status;
    }
  };

  const getStatusStyle = (statusText) => {
    switch (statusText) {
      case 'Trống': return { backgroundColor: '#4CAF50', color: '#fff' };
      case 'Đã đặt': return { backgroundColor: '#2196F3', color: '#fff' };
      case 'Đang dọn phòng': return { backgroundColor: '#F44336', color: '#fff' };
      default: return {};
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chọn phòng</Text>

      {displayedRooms.length === 0 ? (
        <Text style={styles.noRoomsText}>Không có phòng nào</Text>
      ) : (
        displayedRooms.map((room, index) => (
          <View key={room._id || index} style={[
            styles.roomBox,
            selectedRoomIndexes.includes(index) && styles.selectedRoom,
            room.status !== 'available' && styles.disabledRoom
          ]}>
            <View style={[styles.roomContent, selectedRoomIndexes.includes(index) && styles.selectedRoomBorder]}>
              {room.images?.length > 0 && (
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  style={styles.imageScrollView}
                >
                  {room.images.map((img, imgIndex) => (
                    <Image
                      key={img._id || imgIndex}
                      source={{ uri: img.url }}
                      style={styles.roomImage}
                    />
                  ))}
                </ScrollView>
              )}

              <View style={styles.roomInfo}>
                <View style={styles.roomHeader}>
                  <Text style={styles.roomTitle}>{room.name}</Text>
                  <TouchableOpacity onPress={() => toggleRoomDetails(index)}>
                    <Icon name={expandedRoom === index ? "chevron-up" : "chevron-down"} size={20} />
                  </TouchableOpacity>
                </View>

                {room.amenities?.length > 0 && (
                  <View style={styles.featuresContainer}>
                    {room.amenities?.map((amenity, idx) => (
                      <View key={amenity._id || idx} style={styles.featureItem}>
                        {getAmenityIcon(amenity.icon)}
                        <Text style={styles.featureText}>{amenity.name}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.priceAndCheckbox}>
                  <View>
                    {room.discountPercent > 0 && (
                      <Text style={styles.originalPrice}>{formatPrice(room.price)} VNĐ</Text>
                    )}
                    <Text style={styles.roomPrice}>
                      {formatPrice(room.discountPercent > 0 ?
                        room.price * (1 - room.discountPercent / 100) :
                        room.price)} VNĐ
                      <Text style={styles.perNight}> /ngày</Text>
                    </Text>

                    <View style={styles.statusContainer}>
                      <Text style={styles.detailsTitle}>Trạng thái</Text>
                      <Text style={[styles.detailsTextStatus, getStatusStyle(getStatusText(room.status))]}>
                        {getStatusText(room.status)}
                      </Text>
                    </View>
                  </View>

                  {room.status === 'available' && (
                    <TouchableOpacity onPress={() => handleRoomSelect(index)}>
                      <View style={styles.checkbox}>
                        <Icon
                          name={selectedRoomIndexes.includes(index) ? "check-square" : "square"}
                          size={24}
                          color={selectedRoomIndexes.includes(index) ? '#2196F3' : '#aaa'}
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>

            {expandedRoom === index && (
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

                {room.discountPercent > 0 && (
                  <View style={styles.promotionContainer}>
                    <Text style={styles.detailsTitle}>Khuyến mãi</Text>
                    <Text style={styles.detailsText}>
                      Giảm giá: <Text style={styles.discount}>{room.discountPercent}%</Text>
                    </Text>
                    <Text style={styles.detailsText}>
                      Thời gian: {formatDate(room.discountStartDate)} đến {formatDate(room.discountEndDate)}
                    </Text>
                  </View>
                )}
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 10
  },
  detailsTextStatus: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  infoContainer: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  promotionContainer: {
    backgroundColor: "#e0f7fa",
    padding: 12,
    borderRadius: 15,
    marginBottom: 15,
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
  roomStatus: {
    fontSize: 15,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginTop: 5,
    alignSelf: 'flex-start',
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
});

export default RoomTypeSelection;