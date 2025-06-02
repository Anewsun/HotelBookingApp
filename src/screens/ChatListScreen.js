import React, { useState, useCallback, useRef } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getConversations } from '../services/chatService';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatTime, formatDate } from '../utils/dateUtils';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { getSocket, initSocket } from '../utils/socket';
import { useFocusEffect } from '@react-navigation/native';

const ChatListScreen = ({ navigation }) => {
    const [conversations, setConversations] = useState([]);
    const { user } = useAuth();
    const socketRef = useRef(null);

    const loadConversations = useCallback(async () => {
        try {
            const { data } = await getConversations();
            console.log('Conversations data:', data.data);
            setConversations(data.data);
        } catch (error) {
            console.error('Error loading conversations:', error);
        }
    }, []);

    const setupSocket = useCallback(async () => {
        try {
            await initSocket();
            const socket = getSocket();
            socketRef.current = socket;

            socket.emit('join', user.id);

            const handleNewMessage = () => {
                loadConversations();
            };

            socket.on('newMessage', handleNewMessage);

            return () => {
                socket.off('newMessage', handleNewMessage);
            };
        } catch (error) {
            console.error('Socket setup failed:', error);
        }
    }, [user.id, loadConversations]);

    useFocusEffect(
        useCallback(() => {
            let cleanup;

            const init = async () => {
                await loadConversations();
                cleanup = await setupSocket();
            };

            init();

            return () => {
                if (cleanup && typeof cleanup === 'function') {
                    cleanup();
                }
                if (socketRef.current) {
                    socketRef.current.off('newMessage');
                }
            };
        }, [loadConversations, setupSocket])
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigation.navigate('Chat', {
                userId: item._id,
                hotelName: item.hotelName,
                receiverName: "Chủ khách sạn"
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
                        {item.hotelName || item.name}
                    </Text>
                    <View style={styles.timeContainer}>
                        <Text style={styles.chatDate}>
                            {formatDate(item.lastMessageDate)}
                        </Text>
                        <Text style={styles.chatTime}>
                            {formatTime(item.lastMessageDate)}
                        </Text>
                    </View>
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

            {conversations.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Icon name="chat-bubble-outline" size={60} color="#CCC" style={styles.emptyIcon} />
                    <Text style={styles.emptyText}>Chưa có tin nhắn</Text>
                    <Text style={styles.emptySubText}>Hãy chat với chủ khách sạn nào đó để hiện danh sách nhé!</Text>
                </View>
            ) : (
                <FlatList
                    data={conversations}
                    keyExtractor={(item) => `conversation-${item._id}`}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                />
            )}
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
    },
    chatName: {
        fontSize: 17,
        fontWeight: '600',
        color: '#333',
        maxWidth: '70%'
    },
    lastMessage: {
        fontSize: 17,
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
        color: 'black',
        fontSize: 15,
        fontWeight: 'bold'
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIcon: {
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
    emptySubText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    timeContainer: {
        alignItems: 'flex-end',
    },
    chatDate: {
        fontSize: 15,
        color: 'gray',
        marginBottom: 2,
    },
    chatTime: {
        fontSize: 15,
        color: 'black'
    },
});

export default ChatListScreen;