import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
import InputField from '../components/InputField';
import { useNavigation } from '@react-navigation/native';
import { register } from '../services/authService';

const SignUpScreen = () => {
    const navigation = useNavigation();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleRegister = async () => {
        console.log("🚀 handleRegister() called");
        console.log("📦 Data input:", { name, email, password });
        setIsLoading(true);

        try {
            const result = await register(name, email, password);
            console.log("✅ Register success:", result);

            Alert.alert('Đăng ký thành công', 'Hãy mở gmail lên và bấm xác nhận');
            navigation.navigate('SignIn');
        } catch (error) {
            Alert.alert('Lỗi', getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.nameApp}>BookIt</Text>

            <Text style={styles.title}>Bắt đầu ngay nào</Text>
            <Text style={styles.subtitle}>Tạo 1 tài khoản để sử dụng app của chúng tôi</Text>

            <InputField placeholder="Nhập tên của bạn" icon="user-circle" value={name} onChangeText={setName} />
            <InputField placeholder="Email" icon="envelope" value={email} onChangeText={setEmail} />

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
                    secureTextEntry={!showPassword}
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChangeText={setPassword}
                />
            </View>

            <TouchableOpacity
                style={[styles.registerButton, isLoading && { opacity: 0.7 }]}
                onPress={handleRegister}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.registerText}>Đăng ký</Text>
                )}
            </TouchableOpacity>

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
        fontSize: 17,
        color: 'gray',
        textAlign: 'center',
        marginBottom: 16
    },
    registerButton: {
        backgroundColor: '#1167B1',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginVertical: 8
    },
    registerText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white'
    },
    footerText: {
        textAlign: 'center',
        marginTop: 16,
        color: '#888',
        fontSize: 17
    },
    loginText: {
        color: '#1167B1',
        fontWeight: 'bold'
    },
});

export default SignUpScreen;
