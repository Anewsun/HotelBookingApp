import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, TextInput, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, Alert, Text, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { sendMessage, getChatHistory } from '../services/chatService';
import { initSocket, getSocket, isSocketConnected } from '../utils/socket';
import ChatBubble from '../components/ChatBubble';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const ChatScreen = ({ route }) => {
    const { userId, hotelName: initialHotelName, receiverName: initialReceiverName } = route.params;
    const [socketError, setSocketError] = useState(false);
    const [socketReady, setSocketReady] = useState(false);
    const [state, setState] = useState({
        messages: [],
        newMessage: '',
        page: 1,
        hasMore: true,
        refreshing: false,
        isTyping: false,
        receiverName: initialReceiverName || 'Chủ khách sạn',
        hotelName: initialHotelName,
    });
    const { user } = useAuth();
    const flatListRef = useRef();
    const navigation = useNavigation();

    const loadMessages = useCallback(async (pageNum = 1) => {
        try {
            setState(prev => ({ ...prev, loading: true }));
            const { data } = await getChatHistory(userId);

            const newMessages = data.data;

            setState(prev => ({
                ...prev,
                messages: pageNum === 1
                    ? newMessages
                    : [...prev.messages, ...newMessages],
                hasMore: newMessages.length >= 20,
                loading: false,
                refreshing: false
            }));

            setTimeout(() => scrollToBottom(), 100);
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể tải tin nhắn');
            setState(prev => ({ ...prev, loading: false, refreshing: false }));
        }
    }, [userId]);

    const initializeSocket = useCallback(async () => {
        try {
            setSocketError(false);
            setSocketReady(false);

            const socket = await initSocket();
            console.log('Socket initialized, waiting for connection...');

            if (!socket.connected) {
                console.log('Waiting for socket connection...');
                await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => {
                        reject(new Error('Socket connection timeout'));
                    }, 5000);

                    socket.once('connect', () => {
                        console.log('Socket connected event received');
                        clearTimeout(timeout);
                        resolve();
                    });

                    socket.once('connect_error', (err) => {
                        console.log('Socket connection error', err);
                        clearTimeout(timeout);
                        reject(err);
                    });
                });
            }

            console.log('Socket connected successfully');
            setSocketReady(true);

            const onNewMessage = (newMsg) => {
                setState(prev => ({
                    ...prev,
                    messages: [...prev.messages, newMsg]
                }));
                scrollToBottom();
            };

            socket.on('newMessage', onNewMessage);

            await loadMessages();

            return () => {
                socket.off('newMessage', onNewMessage);
            };
        } catch (error) {
            console.error('Socket setup failed:', error);
            setSocketError(true);
            setSocketReady(false);

            setTimeout(initializeSocket, 3000);
        }
    }, [userId, user._id, loadMessages]);

    useEffect(() => {
        let isMounted = true;
        let socketCleanup;

        const setupChat = async () => {
            try {
                socketCleanup = await initializeSocket();
            } catch (error) {
                console.error('Chat setup error:', error);
            }
        };

        setupChat();

        return () => {
            isMounted = false;
            if (socketCleanup && typeof socketCleanup === 'function') {
                socketCleanup();
            }
        };
    }, [initializeSocket]);

    const handleSend = async () => {
        if (!state.newMessage.trim()) return;
        try {
            const { data } = await sendMessage(userId, state.newMessage);
            setState(prev => ({
                ...prev,
                messages: [...prev.messages, data.data],
                newMessage: ''
            }));
            scrollToBottom();
        } catch (error) {
            Alert.alert('Lỗi', 'Gửi tin nhắn thất bại');
        }
    };

    const scrollToBottom = () => {
        if (flatListRef.current && state.messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    };

    const handleLoadMore = () => {
        if (state.hasMore && !state.loading) {
            setState(prev => ({ ...prev, page: prev.page + 1 }));
            loadMessages(state.page + 1);
        }
    };

    const onRefresh = () => {
        setState(prev => ({ ...prev, refreshing: true, page: 1 }));
        loadMessages(1);
    };

    if (socketError) {
        return (
            <View style={styles.errorContainer}>
                <Icon name="wifi-off" size={50} color="#FF3B30" />
                <Text style={styles.errorText}>Không thể kết nối với máy chủ chat</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={initializeSocket}
                >
                    <Text style={styles.retryText}>THỬ LẠI</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!socketReady) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
                <Text style={styles.loadingText}>Đang thiết lập kết nối chat...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>{state.receiverName}</Text>
                    {state.hotelName && (
                        <Text style={styles.hotelName}>{state.hotelName}</Text>
                    )}
                </View>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.container}>
                <FlatList
                    ref={flatListRef}
                    data={state.messages}
                    renderItem={({ item }) => (
                        <ChatBubble
                            message={item}
                            isSender={item.senderId._id === user._id}
                        />
                    )}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.messagesContainer}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        <RefreshControl
                            refreshing={state.refreshing}
                            onRefresh={onRefresh}
                            colors={['#4A90E2']}
                        />
                    }
                    ListFooterComponent={
                        state.loading && <ActivityIndicator size="small" color="#4A90E2" />
                    }
                    ListHeaderComponent={
                        state.isTyping && (
                            <View style={styles.typingContainer}>
                                <ActivityIndicator size="small" color="#666" />
                                <Text style={styles.typingText}>Đang soạn tin nhắn...</Text>
                            </View>
                        )
                    }
                />

                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={state.newMessage}
                        onChangeText={(text) => setState(prev => ({ ...prev, newMessage: text }))}
                        placeholder="Nhập tin nhắn..."
                        placeholderTextColor="#999"
                        multiline
                    />
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleSend}
                        disabled={!state.newMessage.trim()}
                    >
                        <Icon
                            name="send"
                            size={24}
                            color={!state.newMessage.trim() ? "gray" : "#4A90E2"}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#4A90E2',
        borderBottomWidth: 1,
        borderBottomColor: '#DDD'
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 10
    },
    headerContent: {
        flex: 1,
        marginHorizontal: 10,
        alignItems: 'center'
    },
    hotelName: {
        fontSize: 16,
        color: 'black',
        marginTop: 2
    },
    container: {
        flex: 1,
        backgroundColor: '#f0f4ff'
    },
    messagesContainer: {
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#EEE'
    },
    input: {
        flex: 1,
        minHeight: 50,
        maxHeight: 120,
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 25,
        fontSize: 16,
        color: '#333'
    },
    sendButton: {
        marginLeft: 10,
        padding: 10
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        marginTop: 10,
        color: 'black',
        fontSize: 16
    },
    typingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginLeft: 10
    },
    typingText: {
        marginLeft: 8,
        color: '#666',
        fontStyle: 17
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#FF3B30',
        marginVertical: 10,
        fontWeight: 'bold',
    },
    errorSubText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#4A90E2',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
    },
    retryText: {
        color: 'white',
        fontWeight: 'bold',
    },
    cancelText: {
        color: 'red',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ChatScreen;