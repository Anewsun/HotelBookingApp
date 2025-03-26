import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const reviews = [
  { id: "1", name: "Tân Lương", rating: 5, comment: "Dịch vụ và phòng rất tuyệt." },
  { id: "2", name: "Hữu Phong", rating: 5, comment: "Căn phòng không có gì để chê." },
  { id: "3", name: "Quang Lâm", rating: 4, comment: "Tuyệt vời nhưng giá hơi đắt." },
];

const ReviewsSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đánh giá</Text>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reviewItem}>
            <Text style={styles.name}>{item.name} ⭐ {item.rating}</Text>
            <Text>{item.comment}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  reviewItem: { marginBottom: 10, padding: 10, backgroundColor: "#f9f9f9", borderRadius: 5 },
  name: { fontWeight: "bold" },
});

export default ReviewsSection;
