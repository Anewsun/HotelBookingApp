import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Switch } from 'react-native';
import { Stepper } from '../components/Stepper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';

const AddInformationScreen = ({ navigation }) => {
    const [name, setName] = useState('Nhật Tân');
    const [email, setEmail] = useState('21110640@student.hcmute.edu.vn');
    const [phone, setPhone] = useState('0943594896');
    const [bookForOthers, setBookForOthers] = useState(false);
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [guestPhone, setGuestPhone] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Đặt phòng và thanh toán" onBackPress={() => navigation.goBack()} showBackIcon={true} />
            <Stepper steps={['Đặt phòng', 'Thông tin', 'Xác nhận']} currentStep={2} />

            <ScrollView style={styles.scrollContainer}>
                <Text style={styles.sectionTitle}>Tên người dùng</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Nhập tên"
                />

                <Text style={styles.sectionTitle}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Nhập email"
                    keyboardType="email-address"
                />

                <Text style={styles.sectionTitle}>Số điện thoại</Text>
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Nhập số điện thoại của bạn"
                    keyboardType="phone-pad"
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
                            value={phone}
                            onChangeText={setGuestPhone}
                            placeholder="Nhập số điện thoại khách"
                            keyboardType="phone-pad"
                        />
                    </>
                )}
            </ScrollView>

            <TouchableOpacity
                style={styles.nextButton}
                onPress={() => navigation.navigate('Payment')}
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
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AddInformationScreen;