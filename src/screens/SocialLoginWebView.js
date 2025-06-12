import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import { getMe } from '../services/authService';
import { SafeAreaView } from 'react-native-safe-area-context';

const SocialLoginWebView = ({ route, navigation }) => {
    const { provider } = route.params;
    const { login } = useAuth();
    const authUrl = `http://10.0.2.2:3000/api/auth/${provider}`;

    const handleNavigationStateChange = async (navState) => {
        const { url } = navState;
        if (url.includes('/oauth')) {
            const match = url.match(/token=([^&]+).*refreshToken=([^&]+)/);
            if (match) {
                const [, token, refreshToken] = match;
                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('refreshToken', refreshToken);

                const userInfo = await getMe();
                if (userInfo.success) {
                    await login({ ...userInfo.data, accessToken: token });
                    navigation.replace('Home');
                }
            }
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <WebView
                source={{ uri: authUrl }}
                onNavigationStateChange={handleNavigationStateChange}
                startInLoadingState
                renderLoading={() => <ActivityIndicator size="large" />}
            />
        </SafeAreaView>
    );
};

export default SocialLoginWebView;
