import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import InputField from '../components/InputField';
import SocialLogin from '../components/SocialLogin';
import { useNavigation } from '@react-navigation/native';

const SignUpScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.nameApp}>BookIt</Text>

            <Text style={styles.title}>Bắt đầu ngay nào</Text>
            <Text style={styles.subtitle}>Tạo 1 tài khoản để sử dụng app của chúng tôi</Text>

            <InputField placeholder="Nhập tên của bạn" icon="user-circle" />
            <InputField placeholder="Email" icon="envelope" />
            <InputField placeholder="Nhập số điện thoại" icon="phone-alt" />
            <InputField placeholder="Nhập mật khẩu" icon="eye-slash" secureTextEntry />

            <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('SignIn')} >
                <Text style={styles.registerText}>Đăng ký</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>HOẶC</Text>
            <SocialLogin onGooglePress={() => { }} onFacebookPress={() => { }} />

            <Text style={styles.footerText}>
                Đã có tài khoản? <Text style={styles.loginText} onPress={() => navigation.navigate('SignIn')} >Đăng nhập</Text>
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
        fontSize: 44,
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
        color: '#888',
        textAlign: 'center',
        marginBottom: 16
    },
    registerButton: {
        backgroundColor: '#1167B1',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 8
    },
    registerText: {
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
    loginText: {
        color: '#1167B1',
        fontWeight: 'bold'
    },
});

export default SignUpScreen;
