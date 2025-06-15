import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, ActivityIndicator, ScrollView, TouchableWithoutFeedback } from 'react-native';
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
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // State lưu ngày nhận - trả phòng
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [selectedDateType, setSelectedDateType] = useState('checkIn');

  // State lưu số lượng khách
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [guestModalVisible, setGuestModalVisible] = useState(false);

  const totalGuests = () => adults + children;

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
    if (!locationId || !checkInDate || !checkOutDate || totalGuests() === 0) {
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
        capacity: totalGuests(),
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
            <View style={styles.column}>
              <Text style={styles.label}>Ngày đến</Text>
              <TouchableOpacity style={styles.inputContainer} onPress={() => openDatePicker('checkIn')}>
                <Icon name="calendar" size={20} color="#888" />
                <Text style={styles.input}>{formatDate(checkInDate)}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.column}>
              <Text style={styles.label}>Ngày trả phòng</Text>
              <TouchableOpacity style={styles.inputContainer} onPress={() => openDatePicker('checkOut')}>
                <Icon name="calendar" size={20} color="#888" />
                <Text style={styles.input}>{formatDate(checkOutDate)}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>Số người</Text>
            <TouchableOpacity style={styles.inputContainer} onPress={() => setGuestModalVisible(true)}>
              <Icon name="person" size={20} color="#888" />
              <Text style={styles.input}>{totalGuests()} khách</Text>
            </TouchableOpacity>
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

        <Modal visible={guestModalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Chọn khách</Text>

              {[{ label: "Người lớn", state: adults, setState: setAdults, note: "Từ 13 tuổi trở lên" },
              { label: "Trẻ em", state: children, setState: setChildren, note: "Từ 2 - 12 tuổi" },
              ].map(({ label, state, setState, note }) => (
                <View key={label} style={styles.rowBetween}>
                  <View>
                    <Text style={styles.guestLabel}>{label}</Text>
                    <Text style={styles.guestNote}>{note}</Text>
                  </View>
                  <View style={styles.counterContainer}>
                    <TouchableOpacity onPress={() => setState(Math.max(0, state - 1))} style={styles.counterButton}>
                      <Text style={styles.counterText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>{state}</Text>
                    <TouchableOpacity onPress={() => setState(state + 1)} style={styles.counterButton}>
                      <Text style={styles.counterText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <TouchableOpacity style={styles.confirmButton} onPress={() => setGuestModalVisible(false)}>
                <Text style={styles.confirmText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    position: 'relative',
    zIndex: 1,
  },
  input: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
    color: '#333',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  confirmButton: {
    backgroundColor: '#1167B1',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  guestLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  guestNote: {
    fontSize: 16,
    color: '#666',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    backgroundColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginHorizontal: 8,
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  counterValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SearchBox;
