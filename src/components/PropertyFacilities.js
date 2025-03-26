import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PropertyFacilities = () => {
  const facilities = ["Wifi", "Pool", "Beach", "AC", "Gym"];
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Property Facilities</Text>
      <View style={styles.facilitiesContainer}>
        {facilities.map((facility, index) => (
          <Text key={index} style={styles.facility}>✅ {facility}</Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  facilitiesContainer: { flexDirection: "row", flexWrap: "wrap" },
  facility: { marginRight: 10, color: "gray" },
});

export default PropertyFacilities;
