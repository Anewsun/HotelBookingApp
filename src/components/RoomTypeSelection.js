import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { rooms } from './RoomData';

const features = [
  { name: 'Cấm hút thuốc', icon: 'smoking-ban' },
  { name: 'Wifi', icon: 'wifi' },
  { name: 'Máy lạnh', icon: 'wind' },
  { name: 'Free bữa sáng', icon: 'bread-slice' },
  { name: 'Bồn tắm', icon: 'bath' },
];

const RoomTypeSelection = ({ selectedRoomIndexes = [], onSelectedRoomsChange = () => { } }) => {
  const [expandedRoom, setExpandedRoom] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState([]);

  const toggleRoomDetails = (index) => {
    setExpandedRoom(expandedRoom === index ? null : index);
  };

  const handleRoomSelect = (index) => {
    const updated = selectedRoomIndexes.includes(index)
      ? selectedRoomIndexes.filter(i => i !== index)
      : [...selectedRoomIndexes, index];
    onSelectedRoomsChange(updated);
  };

  const getFeatureIcon = (featureName) => {
    const feature = features.find(f => f.name === featureName);
    return feature ? feature.icon : null;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Trống':
        return { backgroundColor: 'green', color: '#fff' };
      case 'Đã đặt':
        return { backgroundColor: 'blue', color: '#fff' };
      case 'Đang bảo trì':
        return { backgroundColor: 'red', color: '#fff' };
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Loại phòng</Text>
      {rooms.map((room, index) => (
        <View key={index} style={[styles.roomBox, selectedRoomIndexes.includes(index) && styles.selectedRoom]}>
          <View style={[styles.roomContent, selectedRoomIndexes.includes(index) && styles.selectedRoomBorder]}>
            <Image source={room.image} style={styles.roomImage} />
            <View style={styles.roomInfo}>
              <View style={styles.roomHeader}>
                <Text style={styles.roomTitle}>{room.name}</Text>
                <TouchableOpacity onPress={() => toggleRoomDetails(index)}>
                  <Icon name={expandedRoom === index ? "chevron-up" : "chevron-down"} size={20} />
                </TouchableOpacity>
              </View>
              <View style={styles.featuresContainer}>
                {room.features.map((feature, idx) => (
                  <View key={idx} style={styles.featureItem}>
                    <Icon name={getFeatureIcon(feature)} size={16} color="black" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.priceAndCheckbox}>
                <Text style={styles.roomPrice}>{room.price} VNĐ/đêm</Text>
                <TouchableOpacity onPress={() => handleRoomSelect(index)}>
                  <View style={[
                    styles.checkbox,
                    selectedRooms.includes(index) && { backgroundColor: '#1167B1' }
                  ]}>
                    <Icon
                      name={selectedRoomIndexes.includes(index) ? "check-square" : "square"}
                      size={20}
                      color={selectedRoomIndexes.includes(index) ? 'blue' : 'grey'}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {expandedRoom === index && (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsTitle}>Mô tả</Text>
              <Text style={styles.detailsText}>{room.description}</Text>

              <View style={styles.infoContainer}>
                <Text style={styles.detailsTitle}>Thông tin phòng</Text>
                <View style={styles.infoRow}>
                  <Icon name="building" size={20} color="#555" />
                  <Text style={styles.detailsText}>Tầng: {room.floor}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Icon name="bed" size={20} color="#555" />
                  <Text style={styles.detailsText}>Loại giường: {room.bedType}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Icon name="user-friends" size={20} color="#555" />
                  <Text style={styles.detailsText}>Số lượng khách tối đa: {room.maxGuests}</Text>
                </View>
              </View>

              <View style={styles.promotionContainer}>
                <Text style={styles.detailsTitle}>Khuyến mãi</Text>
                <Text style={styles.detailsText}>Giảm giá: <Text style={styles.discount}>{room.discount}%</Text></Text>
                <Text style={styles.detailsText}>Thời gian: {room.discountStart} đến {room.discountEnd}</Text>
              </View>

              <View style={styles.statusContainer}>
                <Text style={styles.detailsTitle}>Trạng thái</Text>
                <Text style={[styles.detailsTextStatus, getStatusStyle(room.status)]}>{room.status}</Text>
              </View>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  roomBox: {
    padding: 15,
    borderWidth: 1,
    borderColor: "black",
    marginVertical: 5,
    borderRadius: 20,
  },
  selectedRoom: {
    backgroundColor: "#e3f2fd",
  },
  selectedRoomBorder: {
    borderColor: '#1167B1',
  },
  roomContent: {
    flexDirection: "row",
  },
  roomImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 15,
  },
  roomInfo: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  roomHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  priceAndCheckbox: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
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
    width: '45%',
    marginBottom: 10,
  },
  featureText: {
    marginLeft: 5,
    fontSize: 12,
    color: "#555",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.5,
    elevation: 3,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "black",
    marginBottom: 5,
  },
  detailsText: {
    fontSize: 15,
    color: "#555",
    marginBottom: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailsTextStatus: {
    fontSize: 14,
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  infoContainer: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  promotionContainer: {
    backgroundColor: "#e0f7fa",
    padding: 10,
    borderRadius: 15,
    marginBottom: 15,
  },
  discount: {
    fontWeight: 'bold',
    color: "red",
  },
});

export default RoomTypeSelection;
