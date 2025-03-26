import React from "react";
import { View, Text, StyleSheet } from "react-native";

const HotelDetail = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HCMUTE</Text>
      <Text style={styles.address}>📍 Số 1 Võ Văn Ngân, Linh Chiểu, Thủ Đức, Hồ Chí Minh</Text>
      <Text style={styles.rating}>⭐ 4.8 (374 đánh giá)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15 },
  title: { fontSize: 20, fontWeight: "bold" },
  address: { color: "gray", marginVertical: 5 },
  rating: { color: "orange", fontWeight: "bold" },
});

export default HotelDetail;
