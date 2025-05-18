import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Switch } from 'react-native';
import { Stepper } from '../components/Stepper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';

const AddInformationScreen = ({ navigation }) => {
    const [name, setName] = useState('Hasna Aziya');
    const [email, setEmail] = useState('hasnaziya@gmail.com');
    const [phone, setPhone] = useState('+1 234 567 89');
    const [bookForOthers, setBookForOthers] = useState(false);
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Đặt phòng và thanh toán" onBackPress={() => navigation.goBack()} showBackIcon={true} />
            <Stepper steps={['Đặt phòng', 'Thông tin', 'Xác nhận']} currentStep={2} />

            <ScrollView style={styles.scrollContainer}>
                <Text style={styles.sectionTitle}>Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                />

                <Text style={styles.sectionTitle}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                />

                <Text style={styles.sectionTitle}>Phone Number</Text>
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                />

                <View style={styles.switchContainer}>
                    <Text style={styles.sectionTitle}>Book for others</Text>
                    <Switch
                        value={bookForOthers}
                        onValueChange={setBookForOthers}
                    />
                </View>

                {bookForOthers && (
                    <>
                        <Text style={styles.sectionTitle}>Guest Name</Text>
                        <TextInput
                            style={styles.input}
                            value={guestName}
                            onChangeText={setGuestName}
                            placeholder="Enter guest name"
                        />

                        <Text style={styles.sectionTitle}>Guest Email</Text>
                        <TextInput
                            style={styles.input}
                            value={guestEmail}
                            onChangeText={setGuestEmail}
                            placeholder="Enter guest email"
                            keyboardType="email-address"
                        />
                    </>
                )}
            </ScrollView>

            <TouchableOpacity
                style={styles.nextButton}
                onPress={() => navigation.navigate('PaymentScreen')}
            >
                <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
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
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 16,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
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

export default AddInformationScreen;