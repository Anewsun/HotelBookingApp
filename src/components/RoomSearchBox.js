import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDate } from '../utils/dateUtils';

const RoomSearchBox = ({
    initialCheckInDate,
    initialCheckOutDate,
    initialAdults = 1,
    initialChildren = 0,
    onSearch
}) => {

    useEffect(() => {
        setCheckInDate(initialCheckInDate);
        setCheckOutDate(initialCheckOutDate);
        setAdults(initialAdults);
        setChildren(initialChildren);
    }, [initialCheckInDate, initialCheckOutDate, initialAdults, initialChildren]);

    const [checkInDate, setCheckInDate] = useState(initialCheckInDate || new Date());
    const [checkOutDate, setCheckOutDate] = useState(initialCheckOutDate || new Date(Date.now() + 86400000));
    const [dateModalVisible, setDateModalVisible] = useState(false);
    const [selectedDateType, setSelectedDateType] = useState('checkIn');

    const [adults, setAdults] = useState(initialAdults);
    const [children, setChildren] = useState(initialChildren);
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
        if (!checkInDate || !checkOutDate || totalGuests() === 0) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (checkOutDate <= checkInDate) {
            Alert.alert('Lỗi', 'Ngày trả phòng phải sau ngày đến');
            return;
        }

        onSearch({
            checkIn: checkInDate,
            checkOut: checkOutDate,
            adults,
            children
        });
    };

    return (
        <View style={styles.container}>
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
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: '#FFF',
        borderRadius: 15,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
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

export default RoomSearchBox;