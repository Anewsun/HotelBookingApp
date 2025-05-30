import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QRCodeCustom = ({ value, size = 250 }) => {
    const qrRef = useRef(null);

    return (
        <View style={styles.container}>
            <QRCode
                value={value}
                size={size}
                color="black"
                backgroundColor="white"
                getRef={qrRef}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        marginVertical: 20,
    },
});

export default QRCodeCustom;