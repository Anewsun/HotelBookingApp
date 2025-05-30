import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator, Image, ScrollView, RefreshControl, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../contexts/AuthContext';
import { getPostById, addInteraction, deleteInteraction } from '../services/postService';
import CommentItem from '../components/CommentItem';
import Header from '../components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { formatDate } from '../utils/dateUtils';
import RenderHtml from 'react-native-render-html';
import sanitizeHtml from 'sanitize-html';

const BlogDetailScreen = ({ route }) => {
    const { postId } = route.params;
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const navigation = useNavigation();

    const loadPost = async () => {
        try {
            const { data } = await getPostById(postId);
            console.log('API Response:', data);
            setPost(data);

            const likes = data.interactions?.filter(i => i.type === 'like') || [];
            setLikeCount(likes.length);
            setIsLiked(likes.some(i => i.userId._id === user?.id));
        } catch (error) {
            console.error('Error loading post:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadPost();
    }, [postId]);

    const onRefresh = () => {
        setRefreshing(true);
        loadPost();
    };

    const handleComment = async () => {
        if (!comment.trim()) return;
        try {
            await addInteraction(postId, 'comment', comment);
            setComment('');
            await loadPost();
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    const handleLike = async () => {
        try {
            if (isLiked) {
                const like = post.interactions?.find(
                    i => i.type === 'like' && i.userId._id === user?.id
                );
                if (like) await deleteInteraction(post._id, like._id);
            } else {
                await addInteraction(post._id, 'like', '');
            }
            setIsLiked(!isLiked);
        } catch (error) {
            console.error('Error handling like:', error);
        }
    };

    const handleDeleteComment = async (interactionId) => {
        try {
            await deleteInteraction(postId, interactionId);
            await loadPost();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const cleanHtml = sanitizeHtml(post?.content || '', {
        allowedTags: ['p', 'img', 'b', 'i', 'em', 'strong', 'br'],
        allowedAttributes: {
            img: ['src', 'alt', 'width', 'height']
        }
    });

    if (loading && !post) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="Chi tiết bài viết"
                onBackPress={() => navigation.goBack()}
                showBackIcon={true}
            />

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={styles.postContainer}>
                    <Text style={styles.postTitle}>{post?.title}</Text>
                    <Text style={styles.postMeta}>
                        Đăng bởi {post?.userId?.name} • Ngày {formatDate(post?.createdAt)}
                    </Text>

                    {post?.images?.length > 0 && (
                        <FlatList
                            horizontal
                            data={post.images}
                            keyExtractor={(item) => item.publicId}
                            renderItem={({ item }) => (
                                <Image
                                    source={{ uri: item.url }}
                                    style={styles.postImage}
                                    resizeMode="cover"
                                />
                            )}
                            contentContainerStyle={styles.imageList}
                            showsHorizontalScrollIndicator={false}
                        />
                    )}

                    <View style={styles.htmlContentContainer}>
                        <RenderHtml
                            contentWidth={300}
                            source={{ html: cleanHtml || '' }}
                            tagsStyles={{
                                img: styles.htmlImage,
                                p: { marginVertical: 8 }
                            }}
                            imagesMaxWidth={Dimensions.get('window').width - 32}
                        />
                    </View>

                    <View style={styles.interactionContainer}>
                        <TouchableOpacity
                            style={styles.likeButton}
                            onPress={handleLike}
                        >
                            <Icon
                                name="thumb-up"
                                size={24}
                                color={isLiked ? '#007bff' : '#95a5a6'}
                            />
                            <Text style={[
                                styles.interactionText,
                                isLiked && styles.likedText
                            ]}>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {post?.interactions?.filter(i => i.type === 'comment').length > 0 && (
                    <View style={styles.commentSection}>
                        <Text style={styles.sectionTitle}>
                            Bình luận ({post.interactions.filter(i => i.type === 'comment').length})
                        </Text>

                        <FlatList
                            data={post.interactions.filter(i => i.type === 'comment')}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <CommentItem
                                    comment={item}
                                    onDelete={() => handleDeleteComment(item._id)}
                                    canDelete={item.userId._id === user?.id}
                                />
                            )}
                            scrollEnabled={false}
                        />
                    </View>
                )}
            </ScrollView>

            {isAuthenticated && (
                <View style={styles.commentInputContainer}>
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Viết bình luận..."
                        value={comment}
                        onChangeText={setComment}
                        multiline
                        placeholderTextColor="#95a5a6"
                    />
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleComment}
                        disabled={!comment.trim()}
                    >
                        <Icon name="send" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4ff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    postContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        margin: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    postTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2d3436',
        marginBottom: 8,
    },
    postMeta: {
        fontSize: 14,
        color: '#636e72',
        marginBottom: 16,
    },
    postContent: {
        fontSize: 16,
        lineHeight: 24,
        color: '#2d3436',
        marginVertical: 16,
    },
    imageList: {
        paddingBottom: 10,
    },
    postImage: {
        width: 300,
        height: 200,
        borderRadius: 12,
        marginRight: 12,
    },
    interactionContainer: {
        flexDirection: 'row',
        marginTop: 16,
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    interactionText: {
        marginLeft: 8,
        color: '#95a5a6',
        fontSize: 16,
    },
    likedText: {
        color: '#007bff',
        fontWeight: '600',
    },
    commentSection: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2d3436',
        marginBottom: 12,
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#dfe6e9',
    },
    commentInput: {
        flex: 1,
        backgroundColor: '#f1f3f4',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        marginRight: 8,
        maxHeight: 120,
    },
    sendButton: {
        backgroundColor: '#007bff',
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    htmlContentContainer: {
        marginVertical: 16,
    },
    htmlImage: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
        marginVertical: 8,
        borderRadius: 8,
    },
});

export default BlogDetailScreen;