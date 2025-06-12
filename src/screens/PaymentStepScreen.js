import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch, Image, TextInput } from 'react-native';
import { Stepper } from '../components/Stepper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatDate } from '../utils/dateUtils';

const parseDate = (dateString) => {
    if (!dateString) return new Date();
    if (typeof dateString === 'string' && dateString.includes('T')) {
        return new Date(dateString);
    }
    if (typeof dateString === 'string') {
        return new Date(dateString + 'T00:00:00');
    }
    if (dateString instanceof Date) {
        return dateString;
    }
    return new Date();
};

const PaymentStepScreen = ({ navigation, route }) => {
    const { selectedRoom, hotel, searchParams } = route.params;
    const checkInDate = parseDate(searchParams?.checkIn);
    const checkOutDate = parseDate(searchParams?.checkOut);
    const checkInTime = searchParams?.checkInTime || '14:00';
    const checkOutTime = searchParams?.checkOutTime || '12:00';
    const [specialRequests, setSpecialRequests] = useState({
        earlyCheckIn: false,
        lateCheckOut: false,
        additionalRequests: ''
    });
    const isFormValid = true;
    
    return (
        <SafeAreaView style={styles.container}>
            <Header title="Đặt phòng & thanh toán" onBackPress={() => navigation.goBack()} showBackIcon={true} />
            <Stepper steps={['Đặt phòng', 'Thông tin', 'Xác nhận']} currentStep={1} />

            <ScrollView style={styles.scrollContainer}>
                <View style={styles.hotelContainer}>
                    <Image
                        source={selectedRoom?.images?.[0]?.url
                            ? { uri: selectedRoom.images[0].url }
                            : require('../assets/images/hotel1.jpg')
                        }
                        style={styles.hotelImage}
                        resizeMode="cover"
                    />
                    <View style={styles.hotelInfo}>
                        <Text style={styles.hotelName}>{hotel?.name || 'Khách sạn'}</Text>

                        <View style={styles.infoRow}>
                            <Icon name="location-on" size={20} color="#666" />
                            <Text style={styles.hotelLocation}>{hotel?.address || 'Địa chỉ'}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Icon name="meeting-room" size={20} color="#666" />
                            <Text style={styles.roomType}>Phòng: {selectedRoom?.name || 'Phòng'}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Icon name="king-bed" size={20} color="#666" />
                            <Text style={styles.roomType}>Loại phòng: {selectedRoom?.roomType || 'Loại phòng'}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Icon name="attach-money" size={20} color="#1167B1" />
                            <Text style={styles.price}>{selectedRoom?.price ? selectedRoom.price.toLocaleString('vi-VN') : '0'} VNĐ/ngày</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ngày đến</Text>
                    <View style={styles.datetimeContainer}>
                        <View style={styles.dateInput}>
                            <Text style={styles.dateTimeText}>{formatDate(checkInDate)}</Text>
                        </View>
                        <View style={styles.timeInput}>
                            <Text style={styles.dateTimeText}>{checkInTime}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ngày trả phòng</Text>
                    <View style={styles.datetimeContainer}>
                        <View style={styles.dateInput}>
                            <Text style={styles.dateTimeText}>{formatDate(checkOutDate)}</Text>
                        </View>
                        <View style={styles.timeInput}>
                            <Text style={styles.dateTimeText}>{checkOutTime}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Yêu cầu khác</Text>
                    <View style={styles.switchContainer}>
                        <Text style={styles.roomType}>CheckIn sớm hơn</Text>
                        <Switch
                            value={specialRequests.earlyCheckIn}
                            onValueChange={(value) => setSpecialRequests({ ...specialRequests, earlyCheckIn: value })}
                            trackColor={{ false: "#767577", true: "#1167B1" }}
                            thumbColor={specialRequests.earlyCheckIn ? "#f4f3f4" : "#f4f3f4"}
                        />
                    </View>
                    <View style={styles.switchContainer}>
                        <Text style={styles.roomType}>Checkout trễ hơn</Text>
                        <Switch
                            value={specialRequests.lateCheckOut}
                            onValueChange={(value) => setSpecialRequests({ ...specialRequests, lateCheckOut: value })}
                            trackColor={{ false: "#767577", true: "#1167B1" }}
                            thumbColor={specialRequests.lateCheckOut ? "#f4f3f4" : "#f4f3f4"}
                        />
                    </View>
                    <Text style={styles.sectionTitle}>Khác(nếu có)</Text>
                    <TextInput
                        style={styles.dateInput}
                        value={specialRequests.additionalRequests}
                        onChangeText={(text) => setSpecialRequests({ ...specialRequests, additionalRequests: text })}  // Cập nhật đúng state
                        placeholder="Nhập yêu cầu khác nếu có"
                    />
                </View>
            </ScrollView>

            <TouchableOpacity
                style={[styles.nextButton, !isFormValid && styles.disabledButton]}
                onPress={() =>
                    navigation.navigate('AddInformation', {
                        selectedRoom: route.params.selectedRoom,
                        hotel: route.params.hotel,
                        checkInDate: checkInDate.toISOString(),
                        checkOutDate: checkOutDate.toISOString(),
                        checkInTime,
                        checkOutTime,
                        specialRequests
                    })
                }
                disabled={!isFormValid}
            >
                <Text style={styles.nextButtonText}>Tiếp tục</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4ff',
        paddingHorizontal: 16,
    },
    scrollContainer: {
        flex: 1,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    hotelContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 12,
    },
    hotelImage: {
        width: 100,
        height: 150,
        borderRadius: 8,
    },
    hotelInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    hotelName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    roomType: {
        fontSize: 17,
        color: 'black',
        marginTop: 4,
    },
    price: {
        fontSize: 16,
        color: '#1167B1',
        marginTop: 4,
    },
    hotelLocation: {
        fontSize: 16,
        color: 'black',
        marginTop: 4,
    },
    section: {
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sectionTitle: {
        fontSize: 19,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    datetimeContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    dateInput: {
        flex: 2,
        padding: 12,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 8,
        justifyContent: 'center',
        fontSize: 17
    },
    timeInput: {
        flex: 1,
        padding: 12,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateTimeText: {
        fontSize: 17,
        textAlign: 'center',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    nextButton: {
        backgroundColor: '#1167B1',
        paddingVertical: 16,
        borderRadius: 25,
        alignItems: 'center',
        marginVertical: 16,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
});

export default PaymentStepScreen;