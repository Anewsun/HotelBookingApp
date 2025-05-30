import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CommentItem = ({ comment, onDelete, canDelete, avatar }) => {
    return (
        <View style={styles.container}>
             <Image
                source={comment?.userId?.avatar?.url ? { uri: comment.userId.avatar.url } : require('../assets/images/default-avatar.jpg')}
                style={styles.avatar}
            />
            <View style={styles.commentHeader}>
                <Text style={styles.userName}>{comment.userId.name}</Text>
                {canDelete && (
                    <TouchableOpacity
                        onPress={() =>
                            Alert.alert(
                                'Xác nhận',
                                'Bạn chắc chắn muốn xóa?',
                                [
                                    { text: 'Hủy', style: 'cancel' },
                                    { text: 'Xóa', onPress: onDelete },
                                ]
                            )
                        }
                    >
                        <Icon name="delete" size={20} color="#ff4444" />
                    </TouchableOpacity>
                )}
            </View>
            <Text style={styles.commentText}>{comment.content}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f0f4ff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    userName: {
        fontWeight: 'bold',
        color: '#333',
        fontSize: 18
    },
    commentText: {
        color: '#555',
        lineHeight: 20,
        fontSize: 17
    },
});

export default CommentItem;