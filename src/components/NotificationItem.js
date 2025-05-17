import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const NotificationItem = ({ notification, onPress }) => {
    const isUnread = notification.status === 'unread';
    const iconInfo = getIconInfo(notification.type);

    return (
        <TouchableOpacity
            onPress={() => onPress(notification._id)}
            style={[styles.container, isUnread && styles.unreadContainer]}
        >
            <View style={[styles.iconContainer, { backgroundColor: iconInfo.bg }]}>
                <Icon
                    name={iconInfo.name}
                    size={24}
                    color={iconInfo.color}
                />
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>{notification.title}</Text>
                <Text style={styles.message}>{notification.message}</Text>
                <View style={styles.footer}>
                    <Text style={styles.time}>
                        {format(new Date(notification.createdAt), 'HH:mm dd/MM/yyyy', { locale: vi })}
                    </Text>
                    {isUnread && <View style={styles.unreadDot} />}
                </View>
            </View>
            {isUnread && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );
};

const getIconInfo = (type) => {
    const icons = {
        booking: { name: 'event-available', bg: '#e8f5e9', color: '#4caf50' },
        voucher: { name: 'local-offer', bg: '#f3e5f5', color: '#9c27b0' },
        admin: { name: 'admin-panel-settings', bg: '#e3f2fd', color: '#2196f3' },
        room: { name: 'meeting-room', bg: '#fff3e0', color: '#ef6c00' },
        payment: { name: 'payment', bg: '#fbe9e7', color: '#d84315' },
        default: { name: 'notifications', bg: '#f5f5f5', color: '#9e9e9e' }
    };
    return icons[type] || icons.default;
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    unreadContainer: {
        borderLeftWidth: 4,
        borderLeftColor: '#2196F3',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        color: '#333',
    },
    message: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    time: {
        fontSize: 12,
        color: '#999',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#2196F3',
    },
});

export default NotificationItem;