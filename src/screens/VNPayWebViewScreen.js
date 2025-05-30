import React, { useRef } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

const VNPayWebViewScreen = ({ route }) => {
    const { payUrl, bookingId } = route.params;
    const navigation = useNavigation();
    const webViewRef = useRef(null);

    const handleNavigationChange = (navState) => {
        const { url } = navState;

        if (url.includes('/vnpay-return')) {
            console.log('Detected return from VNPay:', url);

            const transactionId = extractTransactionId(url);
            if (!transactionId) {
                Alert.alert('Lỗi', 'Không thể xác định mã giao dịch');
                navigation.replace('BookingDetail', { bookingId });
                return;
            }

            navigation.replace('Confirm', {
                transactionId,
                bookingId
            });
        }
    };

    const extractTransactionId = (url) => {
        const match = url.match(/vnp_TxnRef=([^&]+)/);
        return match ? decodeURIComponent(match[1]) : '';
    };

    return (
        <View style={{ flex: 1 }}>
            <WebView
                ref={webViewRef}
                source={{ uri: payUrl }}
                onNavigationStateChange={handleNavigationChange}
                startInLoadingState
                renderLoading={() => (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="#1167B1" />
                    </View>
                )}
                javaScriptEnabled
                domStorageEnabled
            />
        </View>
    );
};

export default VNPayWebViewScreen;
