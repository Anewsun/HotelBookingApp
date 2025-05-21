import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import InputField from '../components/InputField';
import SocialLogin from '../components/SocialLogin';
import { login as apiLogin, loginWithGoogle, loginWithFacebook, getMe } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getErrorMessage } from '../utils/errorHandler';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      const userData = await apiLogin(email, password);

      if (userData && userData.accessToken) {
        console.log("✅ Đăng nhập thành công, token:", userData.accessToken);

        // Lưu token trước
        await AsyncStorage.setItem('token', userData.accessToken);

        const userInfo = await getMe();
        if (userInfo) {
          // Sử dụng function từ context để lưu user
          const success = await login({
            ...userInfo,
            accessToken: userData.accessToken
          });

          if (success) {
            console.log("Chuyển hướng tới Home");
          } else {
            Alert.alert('Lỗi', 'Không thể lưu thông tin đăng nhập');
          }
        }
      }
    } catch (error) {
      Alert.alert('Lỗi', getErrorMessage(error));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      Alert.alert('Thành công', 'Đăng nhập bằng Google thành công');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Lỗi', getErrorMessage(error));
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const result = await loginWithFacebook();
      Alert.alert('Thành công', 'Đăng nhập bằng Facebook thành công');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Lỗi', getErrorMessage(error));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.nameApp}>BookIt</Text>

      <Text style={styles.title}>Chào mừng trở lại</Text>
      <Text style={styles.subtitle}>Đăng nhập để tiếp tục sử dụng ứng dụng của chúng tôi</Text>

      <Text style={styles.label}>Email</Text>
      <InputField placeholder="Email" icon="envelope" value={email} onChangeText={setEmail} />

      <Text style={styles.label}>Mật khẩu</Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={toggleShowPassword}>
          <Image
            source={showPassword
              ? require('../assets/icons/ic_openeye.png')
              : require('../assets/icons/ic_blindeye.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          secureTextEntry={!showPassword}
          placeholder="Nhập mật khẩu"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('SendEmail')} style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} >
        <Text style={styles.loginText}>Đăng nhập</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>HOẶC</Text>
      <SocialLogin onGooglePress={handleGoogleLogin} onFacebookPress={handleFacebookLogin} />

      <Text style={styles.footerText}>
        Chưa có tài khoản? <Text style={styles.registerText} onPress={() => navigation.navigate('SignUp')} >Đăng ký</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 30,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#7D7D7D',
  },
  nameApp: {
    color: 'blue',
    fontSize: 48,
    padding: 20,
    textAlign: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginBottom: 16
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'left',
    marginTop: 10
  },
  loginButton: {
    backgroundColor: '#1167B1',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 8
  },
  loginText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white'
  },
  orText: {
    textAlign: 'center',
    marginVertical: 19,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 17,
  },
  footerText: {
    fontSize: 17,
    textAlign: 'center',
    marginTop: 16,
    color: '#888'
  },
  registerText: {
    color: '#1167B1',
    fontWeight: 'bold'
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8
  },
  forgotPasswordText: {
    color: '#1167B1',
    fontWeight: 'bold',
    fontSize: 17
  },
});

export default SignInScreen;