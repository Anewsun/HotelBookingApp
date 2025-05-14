import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { resetPassword } from '../services/authService';

const NewPasswordScreen = ({ route }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigation = useNavigation();

  const handleCreatePassword = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Chú ý', 'Mật khẩu phải giống nhau.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Chú ý', 'Mật khẩu ít nhất 6 ký tự.');
      return;
    }

    try {
      // Lấy email và OTP từ route.params
      const { email, otp } = route.params;

      // Gọi API reset password
      const result = await resetPassword(email, otp, password);

      Alert.alert('Thành công', 'Mật khẩu đã được đặt lại.');
      navigation.navigate('SignIn');
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Đặt lại mật khẩu thất bại');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <View style={styles.container}>
      <Header title="Mật khẩu mới" onBackPress={() => navigation.goBack()} showBackIcon={true} />
      <Text style={styles.subText}>Mật khẩu mới phải khác với mật khẩu trước đó.</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          secureTextEntry={!showPassword}
          placeholder="Mật khẩu mới"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={toggleShowPassword}>
          <Image
            source={showPassword
              ? require('../assets/icons/ic_openeye.png')
              : require('../assets/icons/ic_blindeye.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          secureTextEntry={!showConfirmPassword}
          placeholder="Xác nhận mật khẩu mới"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={toggleShowConfirmPassword}>
          <Image
            source={showConfirmPassword
              ? require('../assets/icons/ic_openeye.png')
              : require('../assets/icons/ic_blindeye.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCreatePassword}>
        <Text style={styles.buttonText}>Tạo mật khẩu mới</Text>
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
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 30,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#7D7D7D',
  },
  button: {
    backgroundColor: '#1167B1',
    padding: 15,
    width: '100%',
    alignItems: 'center',
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NewPasswordScreen;