import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import Header from '../components/Header';
import { getAmenityIcon } from '../utils/AmenityIcons';
import { fetchAllAmenities } from '../services/hotelService';

const FilterScreen = ({ navigation, route }) => {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000000 });
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedHotelAmenities, setSelectedHotelAmenities] = useState([]);
  const [selectedRoomAmenities, setSelectedRoomAmenities] = useState([]);
  const [sortOption, setSortOption] = useState('-rating');
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách tiện nghi từ API
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const data = await fetchAllAmenities();
        setAmenities(data);
      } catch (error) {
        console.error('Error fetching amenities:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAmenities();
  }, []);

  // Phân loại tiện nghi
  const hotelAmenities = amenities.filter(a => a.type === 'hotel');
  const roomAmenities = amenities.filter(a => a.type === 'room');

  const handleApplyFilters = () => {
    navigation.navigate('SearchResult', {
      filters: {
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        rating: selectedRating,
        hotelAmenities: selectedHotelAmenities,
        roomAmenities: selectedRoomAmenities,
        sort: sortOption
      }
    });
  };

  const toggleAmenity = (amenityId, type) => {
    if (type === 'hotel') {
      setSelectedHotelAmenities(prev => 
        prev.includes(amenityId) 
          ? prev.filter(id => id !== amenityId) 
          : [...prev, amenityId]
      );
    } else {
      setSelectedRoomAmenities(prev => 
        prev.includes(amenityId) 
          ? prev.filter(id => id !== amenityId) 
          : [...prev, amenityId]
      );
    }
  };

  const resetFilters = () => {
    setPriceRange({ min: 0, max: 5000000 });
    setSelectedRating(0);
    setSelectedHotelAmenities([]);
    setSelectedRoomAmenities([]);
    setSortOption('-rating');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải tiện nghi...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title={`Bộ lọc (${(selectedRating ? 1 : 0) + selectedHotelAmenities.length + selectedRoomAmenities.length})`} 
        onBackPress={() => navigation.goBack()} 
        showBackIcon={true} 
      />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Lọc theo sao */}
        <Text style={styles.sectionTitle}>Đánh giá sao</Text>
        <View style={styles.ratingContainer}>
          {[5, 4, 3, 2, 1].map(rating => (
            <TouchableOpacity
              key={rating}
              style={[
                styles.ratingButton,
                selectedRating === rating && styles.selectedRating
              ]}
              onPress={() => setSelectedRating(prev => prev === rating ? 0 : rating)}
            >
              <Text style={styles.ratingText}>{rating}+</Text>
              <Icon name="star" size={16} color="#FFD700" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Lọc theo giá */}
        <Text style={styles.sectionTitle}>Khoảng giá (VND)</Text>
        <Slider
          minimumValue={0}
          maximumValue={5000000}
          step={100000}
          minimumTrackTintColor="#1E90FF"
          maximumTrackTintColor="#D3D3D3"
          value={priceRange.max}
          onValueChange={value => setPriceRange({ ...priceRange, max: value })}
        />
        <View style={styles.priceInputsContainer}>
          <TextInput
            style={styles.priceInput}
            value={priceRange.min.toLocaleString()}
            onChangeText={text => setPriceRange({ ...priceRange, min: Number(text.replace(/,/g, '')) })}
            keyboardType="numeric"
          />
          <Text style={styles.toText}>đến</Text>
          <TextInput
            style={styles.priceInput}
            value={priceRange.max.toLocaleString()}
            onChangeText={text => setPriceRange({ ...priceRange, max: Number(text.replace(/,/g, '')) })}
            keyboardType="numeric"
          />
        </View>

        {/* Sắp xếp */}
        <Text style={styles.sectionTitle}>Sắp xếp theo</Text>
        <View style={styles.sortOptionsContainer}>
          <TouchableOpacity
            style={[styles.sortOption, sortOption === '-rating' && styles.selectedSortOption]}
            onPress={() => setSortOption('-rating')}
          >
            <Text>Đánh giá cao</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortOption, sortOption === 'price' && styles.selectedSortOption]}
            onPress={() => setSortOption('price')}
          >
            <Text>Giá thấp</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortOption, sortOption === '-price' && styles.selectedSortOption]}
            onPress={() => setSortOption('-price')}
          >
            <Text>Giá cao</Text>
          </TouchableOpacity>
        </View>

        {/* Tiện nghi khách sạn */}
        <Text style={styles.sectionTitle}>Tiện nghi khách sạn</Text>
        <View style={styles.amenitiesContainer}>
          {hotelAmenities.map(item => (
            <TouchableOpacity
              key={item._id}
              style={[
                styles.amenityButton,
                selectedHotelAmenities.includes(item._id) && styles.selectedAmenity
              ]}
              onPress={() => toggleAmenity(item._id, 'hotel')}
            >
              {getAmenityIcon(item.icon)}
              <Text style={styles.amenityText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tiện nghi phòng */}
        <Text style={styles.sectionTitle}>Tiện nghi phòng</Text>
        <View style={styles.amenitiesContainer}>
          {roomAmenities.map(item => (
            <TouchableOpacity
              key={item._id}
              style={[
                styles.amenityButton,
                selectedRoomAmenities.includes(item._id) && styles.selectedAmenity
              ]}
              onPress={() => toggleAmenity(item._id, 'room')}
            >
              {getAmenityIcon(item.icon)}
              <Text style={styles.amenityText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={resetFilters}
        >
          <Text style={styles.resetButtonText}>Đặt lại</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.applyButton} 
          onPress={handleApplyFilters}
        >
          <Text style={styles.applyButtonText}>Áp dụng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  ratingButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedRating: {
    backgroundColor: '#E3F2FD',
    borderColor: '#1E90FF',
  },
  ratingText: {
    marginRight: 4,
    color: '#333',
  },
  priceInputsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    textAlign: 'center',
  },
  toText: {
    color: '#666',
  },
  sortOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  sortOption: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedSortOption: {
    backgroundColor: '#E3F2FD',
    borderColor: '#1E90FF',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  amenityButton: {
    width: '30%',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  selectedAmenity: {
    backgroundColor: '#E3F2FD',
    borderColor: '#1E90FF',
  },
  amenityText: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#1E90FF',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FilterScreen;