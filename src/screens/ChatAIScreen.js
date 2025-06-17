import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, Alert, Text, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { sendChatbotMessage } from '../services/chatbotService';
import Header from '../components/Header';
import ChatBubble from '../components/ChatBubble';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const ChatAIScreen = () => {
    const [state, setState] = useState({
        messages: [],
        newMessage: '',
        loading: false,
        refreshing: false,
        isTyping: false,
        sessionId: `ai-session-${Date.now()}`
    });

    const { user } = useAuth();
    const flatListRef = useRef();
    const [quickReplies, setQuickReplies] = useState([]);
    const navigation = useNavigation();

    const generateRandomId = () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };

    useEffect(() => {
        if (user?._id) {
            setState(prev => ({
                ...prev,
                sessionId: `ai-session-${user._id}-${generateRandomId()}`,
                messages: [
                    {
                        _id: 'welcome-message',
                        message: "Xin chào! Tôi là trợ lý ảo của bạn. Tôi có thể giúp gì cho bạn?",
                        createdAt: new Date().toISOString(),
                        senderId: { _id: 'ai' }
                    }
                ]
            }));
        }
    }, [user]);

    const onRefresh = () => {
        setState(prev => ({ ...prev, refreshing: true }));
        const newSessionId = `ai-session-${user._id}-${generateRandomId()}`;

        setState(prev => ({
            messages: [
                {
                    _id: 'welcome-message-' + Date.now(),
                    message: "Xin chào! Tôi là trợ lý ảo của bạn. Tôi có thể giúp gì cho bạn?",
                    createdAt: new Date().toISOString(),
                    senderId: { _id: 'ai' }
                }
            ],
            refreshing: false,
            sessionId: newSessionId
        }));
    };

    const handleSend = async () => {
        if (!state.newMessage.trim()) return;

        setQuickReplies([]);

        const userMessage = {
            _id: Date.now().toString(),
            message: state.newMessage,
            createdAt: new Date().toISOString(),
            senderId: { _id: user._id }
        };
        addMessage(userMessage);

        setState(prev => ({ ...prev, newMessage: '', isTyping: true }));

        try {
            const response = await sendChatbotMessage(state.newMessage, state.sessionId);

            if (response.parameters && response.parameters.fields) {
                handleParameters(response.parameters.fields);
            }

            addMessage({
                _id: Date.now().toString() + '-ai',
                message: response.responseText,
                createdAt: new Date().toISOString(),
                senderId: { _id: 'ai' }
            });

        } catch (error) {
            Alert.alert('Lỗi', 'Không thể kết nối với trợ lý AI');
            console.error('Chatbot error:', error);
        } finally {
            setState(prev => ({ ...prev, isTyping: false }));
        }
    };

    const handleParameters = (parameters) => {
        const replies = [];

        for (const key in parameters) {
            const param = parameters[key];

            if (param.listValue && param.listValue.values.length > 0) {
                const options = param.listValue.values.map(val => val.stringValue);
                setQuickReplies(options);
            }
            else if (key === 'location' && param.stringValue) {
                console.log('Location:', param.stringValue);
            }
            else if (key === 'date' && param.stringValue) {
                console.log('Date:', param.stringValue);
            }
        }
    };

    const handleQuickReply = async (reply) => {
        setState(prev => ({ ...prev, newMessage: reply }));

        setTimeout(() => {
            handleSend();
            setQuickReplies([]);
        }, 100);
    };

    const addMessage = (message) => {
        setState(prev => ({
            ...prev,
            messages: [...prev.messages, message]
        }));
        setTimeout(() => scrollToBottom(), 100);
    };

    const scrollToBottom = () => {
        if (flatListRef.current && state.messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header title="Trợ lý ảo AI" onBackPress={() => navigation.goBack()} showBackIcon={true} />

            <View style={styles.container}>
                <FlatList
                    ref={flatListRef}
                    data={state.messages}
                    renderItem={({ item, index }) => {
                        const isSender = item.senderId._id === user._id;
                        return (
                            <ChatBubble
                                message={item}
                                isSender={isSender}
                                showDate={false}
                            />
                        );
                    }}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.messagesContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={state.refreshing}
                            onRefresh={onRefresh}
                            colors={['#4A90E2']}
                        />
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

                {/* Hiển thị quick replies nếu có */}
                {quickReplies.length > 0 && (
                    <View style={styles.quickRepliesContainer}>
                        {quickReplies.map((reply, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.quickReplyButton}
                                onPress={() => handleQuickReply(reply)}
                            >
                                <Text style={styles.quickReplyText}>{reply}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={state.newMessage}
                        onChangeText={(text) => setState(prev => ({ ...prev, newMessage: text }))}
                        placeholder="Nhập câu hỏi..."
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
    quickRepliesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
        paddingBottom: 5,
    },
    quickReplyButton: {
        backgroundColor: '#E3F2FD',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 15,
        margin: 5,
        borderWidth: 1,
        borderColor: '#BBDEFB',
    },
    quickReplyText: {
        fontSize: 16,
        color: '#1976D2',
    },
});

export default ChatAIScreen;