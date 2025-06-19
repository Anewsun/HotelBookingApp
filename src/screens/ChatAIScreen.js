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
                        text: "Xin chào! Tôi là trợ lý ảo của bạn. Tôi có thể giúp gì cho bạn?",
                        createdAt: new Date().toISOString(),
                        senderId: { _id: 'ai' },
                        isBot: true
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
                    text: "Xin chào! Tôi là trợ lý ảo của bạn. Tôi có thể giúp gì cho bạn?",
                    createdAt: new Date().toISOString(),
                    senderId: { _id: 'ai' },
                    isBot: true
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
            text: state.newMessage,
            createdAt: new Date().toISOString(),
            senderId: { _id: user._id },
            isBot: false
        };
        addMessage(userMessage);

        setState(prev => ({ ...prev, newMessage: '', isTyping: true }));

        try {
            const response = await sendChatbotMessage(state.newMessage, state.sessionId);

            const botResponse = {
                _id: Date.now().toString() + '-ai',
                createdAt: new Date().toISOString(),
                senderId: { _id: 'ai' },
                isBot: true,
                text: response.responseText,
                ...(response.richContent ? { richContent: response.richContent } : {})
            };

            addMessage(botResponse);

            if (response.parameters && response.parameters.fields) {
                handleParameters(response.parameters.fields);
            }

        } catch (error) {
            Alert.alert('Lỗi', 'Không thể kết nối với trợ lý AI');
            console.error('Chatbot error:', error);

            addMessage({
                _id: 'error-' + Date.now(),
                text: 'Đã xảy ra lỗi khi kết nối với trợ lý AI',
                createdAt: new Date().toISOString(),
                senderId: { _id: 'ai' },
                isBot: true
            });
        } finally {
            setState(prev => ({ ...prev, isTyping: false }));
        }
    };

    const handleButtonPress = (link) => {
        if (link.includes('/hoteldetail/')) {
            try {
                let hotelId = '';
                let checkIn = '';
                let checkOut = '';
                let capacity = '2';
                let roomType = '';

                const [pathPart, queryPart] = link.split('?');

                const pathParts = pathPart.split('/');
                const hotelIndex = pathParts.indexOf('hoteldetail');
                if (hotelIndex !== -1 && pathParts.length > hotelIndex + 1) {
                    hotelId = pathParts[hotelIndex + 1];
                }

                if (queryPart) {
                    const queryParams = queryPart.split('&');
                    queryParams.forEach(param => {
                        const [key, value] = param.split('=');
                        switch (key) {
                            case 'checkIn':
                                checkIn = value;
                                break;
                            case 'checkOut':
                                checkOut = value;
                                break;
                            case 'capacity':
                                capacity = value;
                                break;
                            case 'roomType':
                                roomType = value;
                                break;
                        }
                    });
                }

                navigation.navigate('Detail', {
                    hotelId,
                    checkIn,
                    checkOut,
                    capacity,
                    roomType
                });
            } catch (error) {
                console.error('Error parsing hotel detail link:', error);
                Alert.alert('Lỗi', 'Không thể mở chi tiết khách sạn');
            }
        } else {
            Linking.openURL(link).catch(err => {
                Alert.alert('Lỗi', 'Không thể mở liên kết');
                console.error('Failed to open URL:', err);
            });
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

    const renderRichContent = (richContent) => {
        return richContent.map((card, index) => (
            <View key={index} style={styles.richContentCard}>
                {card.title && <Text style={styles.richContentTitle}>{card.title}</Text>}
                {card.subtitle && <Text style={styles.richContentSubtitle}>{card.subtitle}</Text>}
                {card.text && card.text.map((line, idx) => (
                    <Text key={idx} style={styles.richContentText}>{line}</Text>
                ))}
                {card.button && (
                    <TouchableOpacity
                        style={styles.richContentButton}
                        onPress={() => handleButtonPress(card.button.link)}
                    >
                        <Text style={styles.richContentButtonText}>{card.button.text}</Text>
                    </TouchableOpacity>
                )}
            </View>
        ));
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
                                renderRichContent={item.richContent ? () => renderRichContent(item.richContent) : null}
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
                                <View style={styles.typingDots}>
                                    <View style={[styles.typingDot, { backgroundColor: '#4A90E2' }]} />
                                    <View style={[styles.typingDot, { backgroundColor: '#4A90E2', marginHorizontal: 4 }]} />
                                    <View style={[styles.typingDot, { backgroundColor: '#4A90E2' }]} />
                                </View>
                                <Text style={styles.typingText}>Đang soạn tin nhắn...</Text>
                            </View>
                        )
                    }
                />

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
    typingDots: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    typingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    typingText: {
        marginLeft: 8,
        color: '#666',
        fontSize: 17
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
    richContentCard: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#EEE',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    richContentTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    richContentSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    richContentText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    richContentButton: {
        backgroundColor: '#4A90E2',
        borderRadius: 25,
        padding: 8,
        marginTop: 8,
        alignItems: 'center',
    },
    richContentButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default ChatAIScreen;