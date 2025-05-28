import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Switch, Alert } from 'react-native';
import { Stepper } from '../components/Stepper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

const AddInformationScreen = ({ navigation, route }) => {
    const { user } = useAuth();
    const {
        selectedRoom,
        hotel,
        checkInDate,
        checkOutDate,
        checkInTime,
        checkOutTime,
        specialRequests
    } = route.params;

    // State cho form
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [bookForOthers, setBookForOthers] = useState(false);
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [guestPhone, setGuestPhone] = useState('');

    const isFormValid = () => {
        const basicInfoValid = name.trim() && email.trim() && phone.trim();

        // Nếu đặt cho người khác, kiểm tra thêm thông tin khách
        if (bookForOthers) {
            return basicInfoValid && guestName.trim() && guestEmail.trim();
        }
        return basicInfoValid;
    };

    const handleContinue = () => {
        if (!isFormValid()) {
            Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        navigation.navigate('Payment', {
            bookingData: {
                userInfo: {
                    name: name.trim(),
                    email: email.trim(),
                    phone: phone.trim()
                },
                guestInfo: bookForOthers ? {
                    name: guestName.trim(),
                    email: guestEmail.trim(),
                    phone: guestPhone.trim()
                } : null,
                room: selectedRoom,
                hotel,
                checkIn: {
                    date: checkInDate,
                    time: checkInTime
                },
                checkOut: {
                    date: checkOutDate,
                    time: checkOutTime
                },
                specialRequests,
                bookerId: user?._id
            }
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Đặt phòng và thanh toán" onBackPress={() => navigation.goBack()} showBackIcon={true} />
            <Stepper steps={['Đặt phòng', 'Thông tin', 'Xác nhận']} currentStep={2} />

            <ScrollView style={styles.scrollContainer}>
                <Text style={styles.sectionTitle}>Tên người đặt</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Nhập tên"
                    defaultValue={user?.name || ''}
                />

                <Text style={styles.sectionTitle}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Nhập email"
                    keyboardType="email-address"
                    defaultValue={user?.email || ''}
                />

                <Text style={styles.sectionTitle}>Số điện thoại</Text>
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Nhập số điện thoại"
                    keyboardType="phone-pad"
                    defaultValue={user?.phone || ''}
                />

                <View style={styles.switchContainer}>
                    <Text style={styles.sectionTitle}>Đặt cho người khác</Text>
                    <Switch
                        value={bookForOthers}
                        onValueChange={setBookForOthers}
                        trackColor={{ false: "#767577", true: "#1167B1" }}
                        thumbColor={bookForOthers ? "#f4f3f4" : "#f4f3f4"}
                    />
                </View>

                {bookForOthers && (
                    <>
                        <Text style={styles.sectionTitle}>Tên khách</Text>
                        <TextInput
                            style={styles.input}
                            value={guestName}
                            onChangeText={setGuestName}
                            placeholder="Nhập tên khách"
                        />

                        <Text style={styles.sectionTitle}>Email khách</Text>
                        <TextInput
                            style={styles.input}
                            value={guestEmail}
                            onChangeText={setGuestEmail}
                            placeholder="Nhập email khách"
                            keyboardType="email-address"
                        />

                        <Text style={styles.sectionTitle}>Số điện thoại khách</Text>
                        <TextInput
                            style={styles.input}
                            value={guestPhone}
                            onChangeText={setGuestPhone}
                            placeholder="Nhập số điện thoại khách"
                            keyboardType="phone-pad"
                        />
                    </>
                )}
            </ScrollView>

            <TouchableOpacity
                style={[styles.nextButton, !isFormValid() && styles.disabledButton]}
                onPress={handleContinue}
                disabled={!isFormValid()}
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 16,
        color: '#333',
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        fontSize: 17
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    nextButton: {
        backgroundColor: '#1167B1',
        paddingVertical: 16,
        borderRadius: 25,
        alignItems: 'center',
        marginVertical: 16,
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AddInformationScreen;