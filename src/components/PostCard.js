import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const PostCard = ({ post, onPress }) => {
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) throw new Error('Invalid date');

            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } catch (error) {
            console.error('Lỗi định dạng ngày:', error);
            return '--/--/----';
        }
    };

    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress(post._id)}>
            {post.images?.[0]?.url && (
                <Image source={{ uri: post.images[0].url }} style={styles.image} />
            )}
            <View style={styles.content}>
                <Text style={styles.title}>{post.title}</Text>
            </View>
            <Text style={styles.postMeta}>
                Đăng bởi {post.userId?.name} • Ngày {formatDate(post.createdAt)}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    postMeta: {
        fontSize: 16,
        color: 'black',
        marginBottom: 8,
        marginLeft: 10
    },
});

export default PostCard;