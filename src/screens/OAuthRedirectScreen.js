import React, { useEffect } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import { getMe } from '../services/authService';

const OAuthRedirectScreen = () => {
    const navigation = useNavigation();
    const { login } = useAuth();

    useEffect(() => {
        const finishOAuth = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const refreshToken = await AsyncStorage.getItem('refreshToken');

                if (!token || !refreshToken) {
                    throw new Error("Thiếu token sau đăng nhập");
                }

                const userInfo = await getMe();
                if (!userInfo) throw new Error("Không thể lấy thông tin người dùng");

                await login({ ...userInfo, accessToken: token });
                navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
            } catch (error) {
                Alert.alert("Lỗi đăng nhập", error.message);
                navigation.navigate('SignIn');
            }
        };

        finishOAuth();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
    );
};

export default OAuthRedirectScreen;
