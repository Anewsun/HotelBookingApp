import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator, Image, ScrollView, RefreshControl, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../contexts/AuthContext';
import { getPostById, addInteraction, deleteInteraction, getPostInteractions } from '../services/postService';
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
    const isAuthor = user?.id === post?.userId;

    const loadPost = async () => {
        try {
            const [postResponse, interactionsResponse] = await Promise.all([
                getPostById(postId),
                getPostInteractions(postId)
            ]);

            const postData = {
                ...postResponse.data,
                interactions: interactionsResponse.data || []
            };

            setPost(postData);

            const likes = postData.interactions.filter(i => i.type === 'like');
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
                const like = post.interactions.find(
                    i => i.type === 'like' && i.userId._id === user?.id
                );
                if (like) {
                    await deleteInteraction(post._id, like._id);
                    setLikeCount(prev => prev - 1);
                }
            } else {
                await addInteraction(post._id, 'like', '');
                setLikeCount(prev => prev + 1);
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
                    <View style={styles.authorContainer}>
                        <Image
                            source={isAuthor && user?.avatar?.url
                                ? { uri: user.avatar.url }
                                : require('../assets/images/default-avatar.jpg')
                            }
                            style={styles.avatar}
                        />
                        <View style={styles.authorInfo}>
                            <Text style={styles.authorName}>{post?.userId?.name}</Text>
                            <Text style={styles.postDate}>Ngày {formatDate(post?.createdAt)}</Text>
                        </View>
                    </View>

                    <Text style={styles.postTitle}>{post?.title}</Text>

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
                                name={isLiked ? "thumb-up" : "thumb-up-off-alt"}
                                size={28}
                                color={isLiked ? '#007bff' : '#95a5a6'}
                            />
                            <Text style={[
                                styles.likeCountText,
                                isLiked && styles.likedText
                            ]}>
                                {likeCount} lượt thích
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
                                    avatar={item.userId.avatar}
                                />
                            )}
                            scrollEnabled={false}
                        />
                    </View>
                )}
            </ScrollView>

            {isAuthenticated && (
                <View style={styles.commentInputContainer}>
                    <Image
                        source={user?.avatar?.url ? { uri: user.avatar.url } : require('../assets/images/default-avatar.jpg')}
                        style={styles.userAvatar}
                    />
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
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    authorInfo: {
        flex: 1,
    },
    authorName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2d3436',
    },
    postDate: {
        fontSize: 14,
        color: '#636e72',
        marginTop: 4,
    },
    postTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2d3436',
        marginBottom: 16,
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
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    likeCountText: {
        marginLeft: 8,
        color: '#95a5a6',
        fontSize: 18,
        fontWeight: '500',
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
        fontSize: 20,
        fontWeight: '600',
        color: '#2d3436',
        marginBottom: 16,
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
        fontSize: 18,
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