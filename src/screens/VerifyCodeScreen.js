import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import Header from '../components/Header';
import { verifyEmail } from '../services/authService';

const VerifyCodeScreen = ({ navigation, route }) => {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (route.params?.email) {
      setEmail(route.params.email);
    }
  }, [route.params]);

  const handleChangeText = (value) => {
    const sanitizedValue = value.replace(/[^0-9]/g, '');
    if (sanitizedValue.length <= 4) {
      setCode(sanitizedValue);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 4) {
      Alert.alert('Lỗi', 'Vui lòng nhập đủ 4 số của mã xác nhận');
      return;
    }

    if (!email) {
      Alert.alert('Lỗi', 'Không tìm thấy email, vui lòng thử lại');
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyEmail(email, code);
      console.log("✅ Verification success:", result);
      Alert.alert(
        'Thành công', 
        'Email đã được xác thực thành công',
        [{ text: 'OK', onPress: () => navigation.navigate('SignIn') }]
      );
    } catch (error) {
      console.log("❌ Verification error:", error);
      Alert.alert('Lỗi', typeof error === 'string' ? error : 'Xác thực thất bại, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Không tìm thấy email, vui lòng thử lại');
      return;
    }
    Alert.alert('Thông báo', 'Chức năng gửi lại mã đang được phát triển');
  };

  return (
    <View style={styles.container}>
      <Header title="Xác nhận Code" onBackPress={() => navigation.goBack()} showBackIcon={true} />
      <Text style={styles.subText}>Hãy nhập mã code chúng tôi gửi bạn qua email</Text>
      <Text style={styles.emailText}>{email || 'your-email@example.com'}</Text>

      <View style={styles.codeInputContainer}>
        <TextInput
          style={styles.codeInput}
          value={code}
          onChangeText={handleChangeText}
          keyboardType="number-pad"
          maxLength={4}
          autoFocus
        />
      </View>

      <View style={styles.codeContainer}>
        {Array(4).fill('').map((_, index) => (
          <View key={index} style={styles.inputBox}>
            <Text style={styles.inputText}>{code[index] || ''}</Text>
          </View>
        ))}
      </View>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Không nhận được OTP? </Text>
        <TouchableOpacity onPress={handleResendCode}>
          <Text style={styles.resendLink}>Gửi lại code</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleVerify}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? 'Đang xử lý...' : 'Xác nhận'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  subText: {
    fontSize: 20,
    color: '#7D7D7D',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold'
  },
  emailText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 30,
  },
  codeInputContainer: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: '100%',
  },
  codeInput: {
    height: 0,
    width: 0,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignSelf: 'center',
    marginVertical: 35,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#000',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  inputText: {
    fontSize: 24,
    textAlign: 'center',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  resendText: {
    fontSize: 16,
    color: '#666',
  },
  resendLink: {
    fontSize: 16,
    color: '#007bff',
    textDecorationLine: 'underline',
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#1167B1',
    paddingVertical: 15,
    width: '90%',
    alignItems: 'center',
    borderRadius: 35,
    marginTop: 30,
    alignSelf: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#7D7D7D',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default VerifyCodeScreen;