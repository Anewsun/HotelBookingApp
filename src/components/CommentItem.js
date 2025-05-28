import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CommentItem = ({ comment, onDelete, canDelete }) => {
    return (
        <View style={styles.container}>
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
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    userName: {
        fontWeight: 'bold',
        color: '#333',
    },
    commentText: {
        color: '#555',
        lineHeight: 20,
    },
});

export default CommentItem;