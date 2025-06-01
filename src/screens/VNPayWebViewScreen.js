import React, { useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { useBooking } from '../contexts/BookingContext';

const VNPayWebViewScreen = ({ route }) => {
    const { payUrl, bookingId } = route.params;
    const navigation = useNavigation();
    const webViewRef = useRef(null);
    const { confirmVNPayFromRawUrl } = useBooking();
    const didCallCallbackRef = useRef(false);

    const handleVNPayReturn = (url) => {
        if (didCallCallbackRef.current) return;
        didCallCallbackRef.current = true;

        const rawQuery = url.split('?')[1];
        const txnRef = getTxnRefFromQuery(rawQuery);

        setTimeout(async () => {
            try {
                await confirmVNPayFromRawUrl(rawQuery);
            } catch (err) {
                console.warn('VNPay return handling error:', err.message);
            }

            navigation.replace('Confirm', {
                transactionId: txnRef,
                bookingId,
                paymentMethod: 'vnpay',
            });
        }, 0);
    };

    const getTxnRefFromQuery = (query) => {
        const parts = query.split('&');
        for (let part of parts) {
            const [key, value] = part.split('=');
            if (key === 'vnp_TxnRef') {
                return decodeURIComponent(value || '');
            }
        }
        return null;
    };

    return (
        <View style={{ flex: 1 }}>
            <WebView
                ref={webViewRef}
                source={{ uri: payUrl }}
                onShouldStartLoadWithRequest={(request) => {
                    const { url } = request;
                    if (url.includes('/vnpay-return')) {
                        handleVNPayReturn(url);
                        return false;
                    }
                    return true;
                }}
                startInLoadingState
                javaScriptEnabled
                domStorageEnabled
                renderLoading={() => (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="#1167B1" />
                    </View>
                )}
            />
        </View>
    );
};

export default VNPayWebViewScreen;
