import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const VnPayWebViewScreen = ({ route, navigation }) => {
    const { paymentUrl, bookingId } = route.params;
    const [loading, setLoading] = useState(true);

    const handleNavigation = (event) => {
        const url = event.url;

        if (!url) return true;

        if (url.includes('/vnpay-return')) {
            const isSuccess = url.includes('vnp_ResponseCode=00');
            if (isSuccess) {
                navigation.replace('Confirm', { bookingId });
            } else {
                navigation.goBack();
            }
            return false;
        }

        return true;
    };

    return (
        <WebView
            source={{ uri: paymentUrl }}
            startInLoadingState
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            renderLoading={() => loading && (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#1167B1" />
                </View>
            )}
            onShouldStartLoadWithRequest={handleNavigation}
        />
    );
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default VnPayWebViewScreen;
