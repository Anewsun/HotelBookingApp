import React, { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getPosts } from '../services/postService';
import PostCard from '../components/PostCard';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';

const BlogListScreen = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();
    
    useEffect(() => {
        const loadPosts = async () => {
            try {
                setLoading(true);
                const { data } = await getPosts();
                setPosts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadPosts();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4a90e2" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Danh sách bài viết" />

            {posts.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Icon name="newspaper-o" size={100} color="black" style={styles.emptyIcon} />
                    <Text style={styles.emptyText}>
                        Chưa có bài viết, hãy đợi Admin và các chủ khách sạn đăng bài nhé!
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <PostCard
                            post={item}
                            onPress={(id) => navigation.navigate('BlogDetail', { postId: id })}
                        />
                    )}
                    
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
        paddingVertical: 16,
        paddingHorizontal: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f4ff',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    emptyIcon: {
        width: 200,
        height: 200,
        marginLeft: 50
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        lineHeight: 24,
    },
});

export default BlogListScreen;