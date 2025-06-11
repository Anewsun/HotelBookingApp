import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';

const HotelMap = ({ address }) => {
    const [location, setLocation] = useState(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchLocation = async () => {
            if (!address) {
                setNotFound(true);
                return;
            }

            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
                    {
                        headers: {
                            'User-Agent': 'HotelBookingApp/0.0.1 (bookit@gmail.com)',
                        },
                    }
                );

                const data = await response.json();
                if (data?.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);
                    setLocation({ latitude: lat, longitude: lon });
                    setNotFound(false);
                } else {
                    setNotFound(true);
                }
            } catch (error) {
                console.error('Geocoding error:', error);
                setNotFound(true);
            }
        };

        fetchLocation();
    }, [address]);

    if (notFound) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.notFoundText}>Không tìm thấy địa chỉ khách sạn</Text>
            </View>
        );
    }

    if (!location) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const { latitude, longitude } = location;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        #map { height: 100%; width: 100%; margin: 0; padding: 0; }
        html, body { height: 100%; margin: 0; padding: 0; }
      </style>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([${latitude}, ${longitude}], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);
        L.marker([${latitude}, ${longitude}])
          .addTo(map)
          .bindPopup("Khách sạn")
          .openPopup();
      </script>
    </body>
    </html>
  `;

    return (
        <View style={styles.container}>
            <WebView
                originWhitelist={['*']}
                source={{ html: htmlContent }}
                style={styles.map}
                javaScriptEnabled
                domStorageEnabled
                scrollEnabled={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 250,
        borderRadius: 12,
        overflow: 'hidden',
        marginVertical: 15,
    },
    map: {
        flex: 1,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    notFoundText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'red',
        textAlign: 'center',
        padding: 20,
    },
});

export default HotelMap;