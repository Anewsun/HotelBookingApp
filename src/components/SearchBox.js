import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';

const SearchBox = () => {
  // State lưu ngày nhận - trả phòng
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [dateModalVisible, setDateModalVisible] = useState(false);

  // State lưu số lượng khách
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [guestModalVisible, setGuestModalVisible] = useState(false);

  const formatDateRange = (start, end) => {
    if (!start || !end) return "Chọn ngày";
    const options = { day: "numeric", month: "long", year: "numeric" };
    return `${start.toLocaleDateString("vi-VN", options)} - ${end.toLocaleDateString("vi-VN", options)}`;
  };

  const totalGuests = () => adults + children;

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>Địa điểm</Text>
        <View style={styles.inputContainer}>
          <Icon name="location" size={20} color="#888" />
          <TextInput style={styles.input} placeholder="Điểm đến" placeholderTextColor="black" />
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Ngày</Text>
            <TouchableOpacity style={styles.inputContainer} onPress={() => setDateModalVisible(true)}>
              <Icon name="calendar" size={20} color="#888" />
              <Text style={styles.input}>{formatDateRange(checkInDate, checkOutDate)}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>Khách</Text>
            <TouchableOpacity style={styles.inputContainer} onPress={() => setGuestModalVisible(true)}>
              <Icon name="person" size={20} color="#888" />
              <Text style={styles.input}>{totalGuests()} khách</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchText}>Tìm kiếm</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={dateModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn ngày</Text>
            <Text style={styles.dateNote}>Ngày đến</Text>
            <DatePicker
              mode="date"
              date={checkInDate || new Date()}
              onDateChange={setCheckInDate}
            />
            <Text style={styles.dateNote}>Ngày đi</Text>
            <DatePicker
              mode="date"
              date={checkOutDate || new Date()}
              onDateChange={setCheckOutDate}
            />
            <TouchableOpacity style={styles.confirmButton} onPress={() => setDateModalVisible(false)}>
              <Text style={styles.confirmText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={guestModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn khách</Text>

            {[
              { label: "Người lớn", state: adults, setState: setAdults, note: "Từ 13 tuổi trở lên" },
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
    padding: 15,
    left: 15,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    maxWidth: '92%',
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  container: {
    padding: 10
  },
  label: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  },
  input: {
    marginLeft: 10,
    flex: 1
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  column: {
    flex: 1,
    marginRight: 10
  },
  searchButton: {
    backgroundColor: '#1167B1',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10
  },
  searchText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  confirmButton: {
    backgroundColor: '#1167B1',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10
  },
  confirmText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10
  },
  guestLabel: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  guestNote: {
    fontSize: 14,
    color: 'gray'
  },
  dateNote: {
    fontSize: 18,
    color: 'black'
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  counterButton: {
    backgroundColor: '#E0E0E0',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 10
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  counterValue: {
    fontSize: 16,
    fontWeight: 'bold'
  },
});

export default SearchBox;
