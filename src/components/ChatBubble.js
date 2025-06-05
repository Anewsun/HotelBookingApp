import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { formatTime, formatDate } from '../utils/dateUtils';

const ChatBubble = memo(({ message, isSender, showDate }) => {
    const isAI = message.senderId._id === 'ai';

    return (
        <View style={styles.fullContainer}>
            {showDate && (
                <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>
                        {formatDate(message.createdAt)}
                    </Text>
                </View>
            )}
            <View style={[
                styles.container,
                isSender ? styles.senderContainer : styles.receiverContainer
            ]}>
                <View style={[
                    styles.bubble,
                    isSender ? styles.senderBubble :
                        isAI ? styles.aiBubble : styles.receiverBubble
                ]}>
                    <Text style={styles.messageText}>{message.message}</Text>
                    <View style={styles.statusContainer}>
                        <Text style={styles.time}>
                            {formatTime(message.createdAt)}
                        </Text>
                        {isSender && !isAI && (
                            <Ionicons
                                name={message.status === 'read' ? 'checkmark-done' : 'checkmark'}
                                size={14}
                                color={message.status === 'read' ? '#4FC3F7' : '#666'}
                            />
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    fullContainer: {
        marginVertical: 4,
    },
    dateContainer: {
        alignSelf: 'center',
        backgroundColor: '#E8E8E8',
        borderRadius: 10,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginBottom: 8,
    },
    dateText: {
        fontSize: 15,
        color: '#666',
    },
    container: {
        marginHorizontal: 8,
        maxWidth: '80%',
    },
    senderContainer: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    receiverContainer: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    },
    bubble: {
        borderRadius: 12,
        padding: 12,
    },
    senderBubble: {
        backgroundColor: '#DCF8C6',
        borderBottomRightRadius: 2,
    },
    receiverBubble: {
        backgroundColor: '#E8E8E8',
        borderBottomLeftRadius: 2,
    },
    messageText: {
        fontSize: 17,
        color: '#000',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    time: {
        fontSize: 15,
        color: '#666',
        marginRight: 4,
    },
    aiBubble: {
        backgroundColor: '#E3F2FD',
        borderBottomLeftRadius: 2,
    },
});

export default ChatBubble;