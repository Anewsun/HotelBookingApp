import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Stepper } from '../components/Stepper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';

const PaymentStepScreen = ({ navigation }) => {
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(null);
    const [rooms, setRooms] = useState(1);
    const [guests, setGuests] = useState(1);
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
        if (!date) return 'Select date';
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Đặt phòng và thanh toán" onBackPress={() => navigation.goBack()} showBackIcon={true} />
            <Stepper steps={['Đặt phòng', 'Thông tin', 'Xác nhận']} currentStep={1} />

            <ScrollView style={styles.scrollContainer}>
                <View style={styles.hotelInfo}>
                    <Text style={styles.hotelName}>Hyatt Regency Bali</Text>
                    <Text style={styles.hotelLocation}>Denpasar, Bali</Text>
                    <Text style={styles.roomType}>Suite King Bed</Text>
                    <Text style={styles.price}>$64/night</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Check in</Text>
                    <TouchableOpacity
                        style={styles.dateInput}
                        onPress={() => setShowDatePicker('checkIn')}
                    >
                        <Text>{formatDate(checkInDate)}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Check out</Text>
                    <TouchableOpacity
                        style={styles.dateInput}
                        onPress={() => setShowDatePicker('checkOut')}
                    >
                        <Text>{formatDate(checkOutDate)}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Rooms and Guests</Text>
                    <View style={styles.counterContainer}>
                        <Text>Rooms: {rooms}</Text>
                        <View style={styles.counterButtons}>
                            <TouchableOpacity onPress={() => setRooms(Math.max(1, rooms - 1))}>
                                <Text style={styles.counterButton}>-</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setRooms(rooms + 1)}>
                                <Text style={styles.counterButton}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.counterContainer}>
                        <Text>Guests: {guests}</Text>
                        <View style={styles.counterButtons}>
                            <TouchableOpacity onPress={() => setGuests(Math.max(1, guests - 1))}>
                                <Text style={styles.counterButton}>-</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setGuests(guests + 1)}>
                                <Text style={styles.counterButton}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Additional Request</Text>
                    <View style={styles.switchContainer}>
                        <Text>Early Check-In</Text>
                        <Switch
                            value={specialRequests.earlyCheckIn}
                            onValueChange={(value) => setSpecialRequests({ ...specialRequests, earlyCheckIn: value })}
                        />
                    </View>
                    <View style={styles.switchContainer}>
                        <Text>Late Check-Out</Text>
                        <Switch
                            value={specialRequests.lateCheckOut}
                            onValueChange={(value) => setSpecialRequests({ ...specialRequests, lateCheckOut: value })}
                        />
                    </View>
                </View>
            </ScrollView>

            <TouchableOpacity
                style={styles.nextButton}
                onPress={() => navigation.navigate('AddInformation')}
            >
                <Text style={styles.nextButtonText}>Next</Text>
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
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    scrollContainer: {
        flex: 1,
    },
    hotelInfo: {
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    hotelName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    hotelLocation: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    roomType: {
        fontSize: 16,
        color: '#333',
        marginTop: 8,
    },
    price: {
        fontSize: 16,
        color: '#1167B1',
        marginTop: 4,
    },
    section: {
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    dateInput: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    },
    counterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    counterButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    counterButton: {
        fontSize: 18,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#ddd',
        marginHorizontal: 4,
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
        borderRadius: 8,
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