import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch, Image, TextInput } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Stepper } from '../components/Stepper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PaymentStepScreen = ({ navigation }) => {
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(null);
    const [specialRequests, setSpecialRequests] = useState({
        earlyCheckIn: false,
        lateCheckOut: false,
        additionalRequests: ''
    });

    const handleDateConfirm = (date) => {
        if (showDatePicker === 'checkIn') {
            setCheckInDate(date);
        } else {
            setCheckOutDate(date);
        }
        setShowDatePicker(null);
    };

    const formatDate = (date) => {
        if (!date) return "Chọn ngày";
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Đặt phòng và thanh toán" onBackPress={() => navigation.goBack()} showBackIcon={true} />
            <Stepper steps={['Đặt phòng', 'Thông tin', 'Xác nhận']} currentStep={1} />

            <ScrollView style={styles.scrollContainer}>
                <View style={styles.hotelContainer}>
                    <Image
                        source={require('../assets/images/hotel1.jpg')}
                        style={styles.hotelImage}
                        resizeMode="cover"
                    />
                    <View style={styles.hotelInfo}>
                        <Text style={styles.hotelName}>Khách sạn KingDom</Text>

                        <View style={styles.infoRow}>
                            <Icon name="location-on" size={20} color="#666" />
                            <Text style={styles.hotelLocation}>97 Lê Lợi, Đà Nẵng</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Icon name="meeting-room" size={20} color="#666" />
                            <Text style={styles.roomType}>Phòng: Family Alibaba</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Icon name="king-bed" size={20} color="#666" />
                            <Text style={styles.roomType}>Loại phòng: Suite</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Icon name="attach-money" size={20} color="#1167B1" />
                            <Text style={styles.price}>64 VNĐ/ngày</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ngày đến</Text>
                    <TouchableOpacity
                        style={styles.dateInput}
                        onPress={() => setShowDatePicker('checkIn')}
                    >
                        <Text>{formatDate(checkInDate)}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ngày trả phòng</Text>
                    <TouchableOpacity
                        style={styles.dateInput}
                        onPress={() => setShowDatePicker('checkOut')}
                    >
                        <Text>{formatDate(checkOutDate)}</Text>
                    </TouchableOpacity>
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
                style={styles.nextButton}
                onPress={() => navigation.navigate('AddInformation')}
            >
                <Text style={styles.nextButtonText}>Tiếp tục</Text>
            </TouchableOpacity>

            <DateTimePickerModal
                isVisible={showDatePicker !== null}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={() => setShowDatePicker(null)}
                minimumDate={showDatePicker === 'checkOut' && checkInDate ? checkInDate : new Date()}
            />
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
    dateInput: {
        padding: 12,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 8,
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
});

export default PaymentStepScreen;