import React, { useEffect, useState } from 'react';
import { FlatList, View, ActivityIndicator, Text, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import NotificationItem from '../components/NotificationItem';
import MarkAllAsReadButton from '../components/MarkAllAsReadButton';
import useNotifications from '../hooks/useNotifications';
import { initSocket, getSocket, isSocketConnected } from '../utils/socket';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

const NotificationsScreen = () => {
    const { user } = useAuth();
    const navigation = useNavigation();
    const {
        notifications,
        loading,
        error,
        refresh,
        markAsRead,
        markAllAsRead,
    } = useNotifications(user?.accessToken);
    const [socketReady, setSocketReady] = useState(false);

    useEffect(() => {
        const setupSocket = async () => {
            try {
                if (!isSocketConnected()) {
                    await initSocket();
                }

                const socket = getSocket();
                socket.on('new-notification', refresh);
                setSocketReady(true);
            } catch (error) {
                console.error('Socket setup error:', error);
            }
        };

        setupSocket();

        return () => {
            try {
                const socket = getSocket();
                socket?.off('new-notification');
            } catch (error) {
                console.log('Socket cleanup error:', error.message);
            }
        };
    }, []);

    const renderItem = ({ item }) => (
        <NotificationItem
            notification={item}
            onPress={() => markAsRead(item._id)}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Thông báo" onBackPress={() => navigation.goBack()} showBackIcon={true} rightComponent={<MarkAllAsReadButton onPress={markAllAsRead} />} />

            {loading ? (
                <ActivityIndicator size="large" style={styles.loader} />
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={refresh}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Không có thông báo mới</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4ff',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: 'black',
        fontSize: 16,
    },
});

export default NotificationsScreen;