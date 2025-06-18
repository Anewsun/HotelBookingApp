import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator, ScrollView, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from '@react-navigation/native';
import { searchLocations } from '../services/locationService';
import { formatDate } from '../utils/dateUtils';
import { debounce } from 'lodash';

const SearchBox = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState('');
  const [locationId, setLocationId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [selectedDateType, setSelectedDateType] = useState('checkIn');

  const [adults, setAdults] = useState(1);

  const openDatePicker = (type) => {
    setSelectedDateType(type);
    setDateModalVisible(true);
  };

  const handleDateConfirm = (date) => {
    if (selectedDateType === 'checkIn') {
      setCheckInDate(date);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOutDate(nextDay);
    } else {
      if (date > checkInDate) {
        setCheckOutDate(date);
      } else {
        Alert.alert('Lỗi', 'Ngày trả phòng phải sau ngày đến');
        return;
      }
    }
    setDateModalVisible(false);
  };

  const handleSearch = () => {
    if (!locationId || !checkInDate || !checkOutDate || adults === 0) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin tìm kiếm');
      return;
    }

    if (checkOutDate <= checkInDate) {
      Alert.alert('Lỗi', 'Ngày trả phòng phải sau ngày đến');
      return;
    }

    navigation.navigate('SearchResult', {
      searchParams: {
        locationId,
        locationName: location,
        checkIn: checkInDate.toLocaleDateString('en-CA'),
        checkOut: checkOutDate.toLocaleDateString('en-CA'),
        capacity: adults,
        fromSearch: true
      }
    });
  };

  const selectLocation = (selectedLocation) => {
    setLocation(selectedLocation.name);
    setLocationId(selectedLocation._id);
    setShowLocationDropdown(false);
  };

  const searchLocationsDebounced = useCallback(
    debounce(async (query) => {
      if (!query || query.trim().length < 2) {
        setSearchResults([]);
        setShowLocationDropdown(false);
        return;
      }

      try {
        setIsSearching(true);
        const data = await searchLocations(query);
        setSearchResults(data);
        setShowLocationDropdown(data.length > 0);
      } catch (error) {
        console.log('Search error:', error);
        setSearchResults([]);
        setShowLocationDropdown(false);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    []
  );

  const handleLocationChange = (text) => {
    setLocation(text);
    setLocationId(null);
    if (text.trim().length > 0) {
      searchLocationsDebounced(text);
    } else {
      setSearchResults([]);
      setShowLocationDropdown(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => setShowLocationDropdown(false)} accessible={false} importantForAccessibility="no">
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          <Text style={styles.label}>Địa điểm</Text>
          <View style={styles.inputContainer}>
            <Icon name="location" size={20} color="#888" />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Nhập điểm đến"
              value={location}
              onChangeText={handleLocationChange}
              onFocus={() => {
                if (locationId) {
                  setShowLocationDropdown(false);
                } else if (searchResults.length > 0) {
                  setShowLocationDropdown(true);
                }
              }}
            />
            {isSearching && <ActivityIndicator size="small" color="#888" />}
          </View>

          {showLocationDropdown && searchResults.length > 0 && (
            <View style={styles.dropdownWrapper}>
              <View
                style={styles.dropdownContainer}
                onStartShouldSetResponder={() => true}
              >
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}
                >
                  {searchResults.map(item => (
                    <TouchableOpacity
                      key={item._id}
                      style={styles.dropdownItem}
                      onPress={() => selectLocation(item)}
                    >
                      <Text style={styles.dropdownItemText}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          )}

          <View style={styles.row}>
            <View style={[styles.column, { flex: 1, marginRight: 15 }]}>
              <Text style={styles.label}>Ngày đến</Text>
              <TouchableOpacity style={styles.inputContainer} onPress={() => openDatePicker('checkIn')}>
                <Icon name="calendar" size={20} color="#888" />
                <Text style={styles.input} numberOfLines={1}>
                  {formatDate(checkInDate)}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.column, { flex: 1, marginRight: 5 }]}>
              <Text style={styles.label}>Ngày trả phòng</Text>
              <TouchableOpacity style={styles.inputContainer} onPress={() => openDatePicker('checkOut')}>
                <Icon name="calendar" size={20} color="#888" />
                <Text style={styles.input} numberOfLines={1}>
                  {formatDate(checkOutDate)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>Số người</Text>
            <View style={[styles.inputContainer, { width: '50%' }]}>
              <Icon name="people" size={20} color="#888" style={{ marginRight: 10 }} />
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  onPress={() => setAdults(Math.max(1, adults - 1))}
                  style={styles.counterButton}
                >
                  <Text style={styles.counterText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{adults}</Text>
                <TouchableOpacity
                  onPress={() => setAdults(adults + 1)}
                  style={styles.counterButton}
                >
                  <Text style={styles.counterText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchText}>Tìm kiếm</Text>
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={dateModalVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={() => setDateModalVisible(false)}
          date={selectedDateType === 'checkIn' ? checkInDate : checkOutDate}
          minimumDate={selectedDateType === 'checkIn' ? new Date() : checkInDate}
          display="inline"
          headerTextIOS={selectedDateType === 'checkIn' ? "Chọn ngày đến" : "Chọn ngày trả phòng"}
          confirmTextIOS="Xác nhận"
          cancelTextIOS="Hủy"
          locale="vi"
          theme="light"
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    marginHorizontal: 10,
  },
  container: {
    padding: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1,
  },
  input: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
    color: '#333',
    minWidth: 120,
  },
  dropdownWrapper: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  dropdownContainer: {
    maxHeight: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden',
    zIndex: 1000,
  },
  scrollView: {
    flexGrow: 1,
  },
  dropdownList: {
    flexGrow: 1,
    minHeight: 100,
  },
  dropdownItem: {
    padding: 12,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    gap: 8,
  },
  column: {
    flex: 1,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#1167B1',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 15,
  },
  searchText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  counterButton: {
    backgroundColor: '#ddd',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterValue: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
});

export default SearchBox;
