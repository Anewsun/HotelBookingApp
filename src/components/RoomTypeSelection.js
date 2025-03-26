import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const rooms = [
  { name: "Twin View Room", price: 56, guests: 2, features: ["Seating Area", "Shower", "AC"] },
  { name: "Suite King Bed", price: 64, guests: 2, features: ["Dining Area", "Bathtub", "AC"] },
];

const RoomTypeSelection = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Room Type</Text>
      {rooms.map((room, index) => (
        <TouchableOpacity 
          key={index} 
          style={[styles.roomBox, selectedRoom === index && styles.selectedRoom]} 
          onPress={() => setSelectedRoom(index)}
        >
          <Text style={styles.roomTitle}>{room.name}</Text>
          <Text>{room.price} VNĐ/đêm</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.bookButton}>
        <Text style={styles.bookText}>Đặt phòng ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },
  roomBox: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    marginVertical: 5
  },
  selectedRoom: {
    backgroundColor: "#e3f2fd"
  },
  roomTitle: {
    fontSize: 16,
    fontWeight: "bold"
  },
  bookButton: {
    marginTop: 10,
    backgroundColor: "#00aaff",
    padding: 15,
    borderRadius: 5
  },
  bookText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold"
  },
});

export default RoomTypeSelection;
