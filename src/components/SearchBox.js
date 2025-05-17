import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from '@react-navigation/native';

const SearchBox = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState('');
  // State lưu ngày nhận - trả phòng
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [selectedDateType, setSelectedDateType] = useState('checkIn');

  // State lưu số lượng khách
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [guestModalVisible, setGuestModalVisible] = useState(false);

  const formatDate = (date) => {
    if (!date) return "Chọn ngày";
    const day = date.getDate();
    const month = date.getMonth() + 1; // Tháng bắt đầu từ 0, nên cộng thêm 1
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const totalGuests = () => adults + children;

  const openDatePicker = (type) => {
    setSelectedDateType(type);
    setDateModalVisible(true);
  };

  const handleSearch = () => {
    if (!location || !checkInDate || !checkOutDate || totalGuests() === 0) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin tìm kiếm');
      return;
    }

    navigation.navigate('SearchResult', {
      searchParams: {
        locationName: location,
        checkIn: checkInDate.toLocaleDateString('en-CA'), // Format: YYYY-MM-DD
        checkOut: checkOutDate.toLocaleDateString('en-CA'),
        capacity: totalGuests(),
        fromSearch: true
      }
    });
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>Địa điểm</Text>
        <View style={styles.inputContainer}>
          <Icon name="location" size={20} color="#888" />
          <TextInput
            style={styles.input}
            placeholder="Điểm đến"
            placeholderTextColor="#666"
            value={location}
            onChangeText={setLocation}
          />
        </View>

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
          <Text style={styles.label}>Khách</Text>
          <TouchableOpacity style={styles.inputContainer} onPress={() => setGuestModalVisible(true)}>
            <Icon name="person" size={20} color="#888" />
            <Text style={styles.input}>{totalGuests()} khách</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch} >
          <Text style={styles.searchText}>Tìm kiếm</Text>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={dateModalVisible}
        mode="date"
        onConfirm={(date) => {
          if (selectedDateType === 'checkIn') {
            setCheckInDate(date);
            // Tự động set ngày trả = ngày đến + 1
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            setCheckOutDate(nextDay);
          } else {
            setCheckOutDate(date);
          }
          setDateModalVisible(false);
        }}
        onCancel={() => setDateModalVisible(false)}
        date={selectedDateType === 'checkIn' ? checkInDate : checkOutDate}
        minimumDate={selectedDateType === 'checkOut' ? checkInDate : new Date()}
        display="inline"
        headerTextIOS={selectedDateType === 'checkIn' ? "Chọn ngày đến" : "Chọn ngày trả phòng"}
        theme="light"
      />

      {/* Modal for Guest Selection */}
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
  },
  input: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
    color: '#333',
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
