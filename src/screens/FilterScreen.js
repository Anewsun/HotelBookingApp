import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import Header from '../components/Header';

const FilterScreen = ({ navigation }) => {
  const [selectedRating, setSelectedRating] = useState(5);
  const [priceRange, setPriceRange] = useState({ min: 100000, max: 5000000 });
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedType, setSelectedType] = useState('Hotel');

  const ratings = [5, 4, 3, 2, 1];
  const facilities = ['Free Wifi', 'Hồ bơi', 'Máy lạnh', 'Tủ lạnh', 'Tivi', 'Phòng gym', 'Máy nước nóng'];
  const propertyTypes = ['Khách sạn', 'Villa', 'Căn hộ', 'Resort'];

  const handleRatingSelect = (rating) => setSelectedRating(rating);

  const toggleFacility = (facility) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility) ? prev.filter((item) => item !== facility) : [...prev, facility]
    );
  };

  const handleTypeSelect = (type) => setSelectedType(type);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Bộ lọc" onBackPress={() => navigation.goBack()} showBackIcon={true} />

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Số sao</Text>
        <View style={styles.ratingContainer}>
          {ratings.map((rating) => (
            <TouchableOpacity
              key={rating}
              style={[styles.ratingButton, selectedRating === rating && styles.ratingSelected]}
              onPress={() => handleRatingSelect(rating)}
            >
              <Icon name="star" size={20} color="gold" />
              <Text style={styles.ratingText}>{rating}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Giá</Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={100000}
          maximumValue={5000000}
          step={100000}
          value={priceRange.max}
          onValueChange={(value) => setPriceRange({ ...priceRange, max: value })}
          minimumTrackTintColor="#008CBA"
          maximumTrackTintColor="#D3D3D3"
        />
        <View style={styles.priceContainer}>
          <TextInput
            style={styles.priceInput}
            keyboardType="numeric"
            value={`${priceRange.min} VND`}
            onChangeText={(text) => {
              const minValue = parseInt(text.replace(' VND', ''), 10);
              setPriceRange({ ...priceRange, min: isNaN(minValue) ? priceRange.min : minValue });
            }}
          />
          <TextInput
            style={styles.priceInput}
            keyboardType="numeric"
            value={`${priceRange.max} VND`}
            onChangeText={(text) => {
              const maxValue = parseInt(text.replace(' VND', ''), 10);
              setPriceRange({ ...priceRange, max: isNaN(maxValue) ? priceRange.max : maxValue });
            }}
          />
        </View>

        <Text style={styles.sectionTitle}>Các loại tiện nghi</Text>
        <View style={styles.facilityContainer}>
          {facilities.map((facility) => (
            <TouchableOpacity
              key={facility}
              style={[styles.facilityButton, selectedFacilities.includes(facility) && styles.facilitySelected]}
              onPress={() => toggleFacility(facility)}
            >
              <Text style={styles.facilityText}>{facility}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Thuộc tính</Text>
        <View style={styles.propertyContainer}>
          {propertyTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.propertyButton, selectedType === type && styles.propertySelected]}
              onPress={() => handleTypeSelect(type)}
            >
              <Text style={styles.propertyText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.applyButton}>
        <Text style={styles.applyText}>Lọc</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 15
  },
  content: {
    flex: 1
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  ratingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#DDD'
  },
  ratingSelected: {
    backgroundColor: '#008CBA',
    borderColor: '#00ACC1'
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 16
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10
  },
  priceInput: {
    width: '48%',
    fontSize: 17,
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    textAlign: 'center'
  },
  facilityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  facilityButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#DDD'
  },
  facilitySelected: {
    backgroundColor: '#008CBA',
    borderColor: '#00ACC1'
  },
  facilityText: {
    fontSize: 17
  },
  propertyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  propertyButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#DDD',
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5
  },
  propertySelected: {
    backgroundColor: '#008CBA',
    borderColor: '#0079A1'
  },
  propertyText: {
    fontSize: 17,
    color: 'black'
  },
  applyButton: {
    backgroundColor: '#1167B1',
    padding: 15,
    alignItems: 'center',
    borderRadius: 30,
    marginVertical: 20
  },
  applyText: {
    fontSize: 19,
    color: 'white',
    fontWeight: 'bold'
  },
});

export default FilterScreen;
