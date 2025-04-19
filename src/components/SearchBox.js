import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import { useNavigation } from '@react-navigation/native';

const SearchBox = () => {
  const navigation = useNavigation();
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

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>Địa điểm</Text>
        <View style={styles.inputContainer}>
          <Icon name="location" size={20} color="#888" />
          <TextInput style={styles.input} placeholder="Điểm đến" placeholderTextColor="#666" />
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
            <Text style={styles.label}>Ngày đi</Text>
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

        <TouchableOpacity style={styles.searchButton} onPress={() => navigation.navigate('SearchResult')} >
          <Text style={styles.searchText}>Tìm kiếm</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for DatePicker */}
      <Modal visible={dateModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn ngày</Text>
            <Text style={styles.dateNote}>{selectedDateType === 'checkIn' ? 'Ngày đến' : 'Ngày đi'}</Text>
            <DatePicker
              mode="date"
              date={selectedDateType === 'checkIn' ? checkInDate : checkOutDate}
              onDateChange={(date) => {
                if (selectedDateType === 'checkIn') {
                  setCheckInDate(date);
                } else {
                  setCheckOutDate(date);
                }
              }}
            />
            <TouchableOpacity style={styles.confirmButton} onPress={() => setDateModalVisible(false)}>
              <Text style={styles.confirmText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  dateNote: {
    fontSize: 17,
    color: 'black',
    fontWeight: 'bold'
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
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 30,
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
