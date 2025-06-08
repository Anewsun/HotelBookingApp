import React, { useRef, useEffect } from 'react';
import { View, ActivityIndicator, Alert, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { useBooking } from '../contexts/BookingContext';

const VNPayWebViewScreen = ({ route }) => {
    const { payUrl, bookingId } = route.params;
    const navigation = useNavigation();
    const webViewRef = useRef(null);
    const { confirmVNPayFromRawUrl } = useBooking();
    const didCallCallbackRef = useRef(false);
    const isScreenActiveRef = useRef(true);

    useEffect(() => {
        // Xử lý khi người dùng nhấn nút back vật lý
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (isScreenActiveRef.current) {
                handlePaymentCancel();
                return true;
            }
            return false;
        });

        return () => {
            backHandler.remove();
            isScreenActiveRef.current = false;
        };
    }, []);

    const handlePaymentCancel = () => {
        Alert.alert(
            'Thanh toán bị hủy',
            'Bạn đã hủy quá trình thanh toán. Vui lòng thanh toán lại trong mục chi tiết đặt phòng.',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Home' }],
                        });
                    }
                }
            ]
        );
    };

    const handleVNPayReturn = (url) => {
        if (didCallCallbackRef.current) return;
        didCallCallbackRef.current = true;
        isScreenActiveRef.current = false;

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
