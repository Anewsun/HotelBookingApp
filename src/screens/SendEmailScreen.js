import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Header from '../components/Header';
import { forgotPassword } from '../services/authService';

const SendEmailScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Hãy nhập email của bạn.');
      return;
    }

    try {
      const result = await forgotPassword(email);
      Alert.alert('Thành công', 'Vui lòng kiểm tra email để đặt lại mật khẩu.');
      navigation.navigate('VerifyCode', { email });
    } catch (error) {
      Alert.alert('Lỗi', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Send Email" onBackPress={() => navigation.goBack()} showBackIcon={true} />

      <View style={styles.content}>
        <Text style={styles.headerText}>Nhập Email</Text>
        <Text style={styles.subtitle}>Điền email của bạn để lấy lại mật khẩu</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Đang gửi...' : 'Gửi Email'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderRadius: 30,
    width: '100%',
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4A8B98',
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SendEmailScreen;