import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ChatBubble = memo(({ message, isSender }) => {
    return (
        <View style={[
            styles.container,
            isSender ? styles.senderContainer : styles.receiverContainer
        ]}>
            <View style={[
                styles.bubble,
                isSender ? styles.senderBubble : styles.receiverBubble
            ]}>
                <Text style={styles.messageText}>{message.message}</Text>
                <View style={styles.statusContainer}>
                    <Text style={styles.time}>
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    {isSender && (
                        <Ionicons
                            name={message.status === 'read' ? 'checkmark-done' : 'checkmark'}
                            size={14}
                            color={message.status === 'read' ? '#4FC3F7' : '#666'}
                        />
                    )}
                </View>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        marginVertical: 4,
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
        fontSize: 14,
        color: '#666',
        marginRight: 4,
    },
});

export default ChatBubble;