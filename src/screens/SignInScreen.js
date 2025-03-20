import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import InputField from '../components/InputField';
import SocialLogin from '../components/SocialLogin';
import { useNavigation } from '@react-navigation/native';

const SignInScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.nameApp}>BookIt</Text>

      <Text style={styles.title}>Chào mừng trở lại</Text>
      <Text style={styles.subtitle}>Đăng nhập để tiếp tục sử dụng ứng dụng của chúng tôi</Text>

      <Text style={styles.label}>Email</Text>
      <InputField placeholder="Nhập email" icon="envelope" />

      <Text style={styles.label}>Mật khẩu</Text>
      <InputField placeholder="Nhập mật khẩu" icon="eye-slash" secureTextEntry />

      <TouchableOpacity onPress={() => navigation.navigate('VerifyCode')} style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Home')} >
        <Text style={styles.loginText}>Đăng nhập</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>HOẶC</Text>
      <SocialLogin onGooglePress={() => { }} onFacebookPress={() => { }} />

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
  },
  footerText: {
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