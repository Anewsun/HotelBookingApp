import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getConversations } from '../services/chatService';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatTime } from '../utils/dateUtils';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { getSocket, waitForSocketConnection } from '../utils/socket';
import { useFocusEffect } from '@react-navigation/native';

const ChatListScreen = ({ navigation }) => {
    const [conversations, setConversations] = useState([]);
    const [socketReady, setSocketReady] = useState(false);
    const { user } = useAuth();

    const loadConversations = useCallback(async () => {
        try {
            const { data } = await getConversations();
            console.log('Conversations data:', data.data);
            setConversations(data.data);
        } catch (error) {
            console.error('Error loading conversations:', error);
        }
    }, []);

    useEffect(() => {
        let socket;
        let mounted = true;

        const setupSocket = async () => {
            try {
                await waitForSocketConnection();
                if (!mounted) return;

                socket = getSocket();
                const handleNewMessage = () => loadConversations();

                socket.on('newMessage', handleNewMessage);
                setSocketReady(true);

                return () => {
                    socket?.off('newMessage', handleNewMessage);
                };
            } catch (error) {
                console.error('Socket setup failed:', error);
                if (mounted) setSocketReady(false);
            }
        };

        setupSocket();

        return () => {
            mounted = false;
        };
    }, [loadConversations]);

    useEffect(() => {
        if (!socketReady) return;

        const socket = getSocket();
        const handleNewMessage = () => {
            loadConversations();
        };

        socket.on('newMessage', handleNewMessage);

        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, [socketReady, loadConversations]);

    useFocusEffect(
        useCallback(() => {
            loadConversations();
        }, [loadConversations])
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigation.navigate('Chat', {
                userId: item._id,
                hotelName: item.name
            })}
        >
            <View style={styles.avatarContainer}>
                {item.avatar ? (
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                ) : (
                    <View style={styles.defaultAvatar}>
                        <Icon name="account-circle" size={24} color="#FFF" />
                    </View>
                )}
            </View>

            <View style={styles.chatContent}>
                <View style={styles.chatHeader}>
                    <Text style={styles.chatName} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <Text style={styles.chatTime}>
                        {formatTime(item.lastMessageDate)}
                    </Text>
                </View>

                <Text style={styles.lastMessage} numberOfLines={1}>
                    {item.lastMessage}
                </Text>
            </View>

            {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Tin nhắn" />

            <FlatList
                data={conversations}
                keyExtractor={(item) => `conversation-${item._id}`}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
            />
            <BottomNav />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4ff',
    },
    listContent: {
        paddingBottom: 16
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'black'
    },
    avatarContainer: {
        marginRight: 12
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#EEE'
    },
    defaultAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#4A90E2',
        justifyContent: 'center',
        alignItems: 'center'
    },
    chatContent: {
        flex: 1,
        justifyContent: 'center'
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4
    },
    chatName: {
        fontSize: 17,
        fontWeight: '600',
        color: '#333',
        maxWidth: '70%'
    },
    chatTime: {
        fontSize: 14,
        color: 'black'
    },
    lastMessage: {
        fontSize: 15,
        color: '#666',
        maxWidth: '90%'
    },
    unreadBadge: {
        backgroundColor: '#FF3B30',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8
    },
    unreadText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold'
    }
});

export default ChatListScreen;