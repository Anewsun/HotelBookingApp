import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image, Dimensions, TouchableOpacity, Alert } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getReviewsByHotel, deleteReview } from "../services/reviewService";
import { useAuth } from "../contexts/AuthContext";

const { width } = Dimensions.get('window');
const MAX_BAR_WIDTH = width * 0.25;

const ReviewsSection = ({ hotelId, onEditReview, onReviewSubmit }) => {
    const [reviews, setReviews] = useState([]);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const initialReviewCount = 2;

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await getReviewsByHotel(hotelId);
                setReviews(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching reviews:", error);
                setLoading(false);
            }
        };

        if (hotelId) fetchReviews();
    }, [hotelId]);

    const handleDelete = async (id) => {
        Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa đánh giá này?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Xóa",
                    onPress: async () => {
                        try {
                            await deleteReview(id);

                            const updatedReviews = reviews.filter(review => review._id !== id);
                            setReviews(updatedReviews);
                            
                            onReviewSubmit();
                        } catch (error) {
                            Alert.alert("Lỗi", error.message);
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Đang tải đánh giá...</Text>
            </View>
        );
    }

    if (reviews.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Đánh giá</Text>
                <Text style={styles.noReviewsText}>Chưa có bài đánh giá nào</Text>
            </View>
        );
    }

    const totalReviews = reviews.length;
    const averageRating = (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1);
    const displayedReviews = showAllReviews ? reviews : reviews.slice(0, initialReviewCount);

    const starCounts = [1, 2, 3, 4, 5].map(star =>
        reviews.filter(review => review.rating === star).length
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đánh giá</Text>
            <View style={styles.ratingContainer}>
                <View style={styles.ratingLeft}>
                    <Text style={styles.averageRating}>⭐{averageRating}</Text>
                    <Text style={styles.reviewCount}>{totalReviews} bài đánh giá</Text>
                </View>
                <View style={styles.ratingRight}>
                    {starCounts.map((count, index) => {
                        const proportion = count / totalReviews;
                        const filledWidth = proportion * MAX_BAR_WIDTH;

                        return (
                            <View key={index} style={styles.starRow}>
                                <Text style={styles.starNumber}>{index + 1} ⭐</Text>
                                <View style={styles.barWithCount}>
                                    <View style={styles.barBackground}>
                                        <View style={[styles.barFill, { width: filledWidth }]} />
                                        <View style={{ width: (1 - proportion) * MAX_BAR_WIDTH, backgroundColor: '#e0e0e0' }} />
                                    </View>
                                    <Text style={styles.countText}>{count} đánh giá</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>
            <FlatList
                data={displayedReviews}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.reviewItem}>
                        <View style={styles.userInfo}>
                            <Image
                                source={item.isAnonymous ? require('../assets/images/anonymous.png') :
                                    (item.userId?.profileImage ? { uri: item.userId.profileImage } : require('../assets/images/default-avatar.jpg'))}
                                style={styles.avatar}
                            />
                            <View style={styles.userDetails}>
                                <View style={styles.nameRow}>
                                    <Text style={styles.name}>{item.isAnonymous ? "Ẩn danh" : item.userId?.name || "Khách"}</Text>
                                    {user?.id === item.userId?._id && (
                                        <View style={styles.actions}>
                                            <TouchableOpacity
                                                onPress={() => onEditReview(item)}
                                                style={styles.actionButton}
                                            >
                                                <Icon name="edit" size={14} color="#666" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => handleDelete(item._id)}
                                                style={styles.actionButton}
                                            >
                                                <Icon name="trash" size={14} color="#FF4444" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</Text>
                                <Text style={styles.titleText}>{item.title}</Text>
                                <View style={styles.ratingStars}>
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <Text key={index} style={index < item.rating ? styles.filledStarText : styles.emptyStarText}>★</Text>
                                    ))}
                                </View>
                                <Text style={styles.comment}>{item.comment}</Text>
                            </View>
                        </View>
                        {item.images && item.images.length > 0 && (
                            <View style={styles.imageContainer}>
                                {item.images.map((image, index) => (
                                    <Image key={index} source={{ uri: image }} style={styles.reviewImage} />
                                ))}
                            </View>
                        )}
                    </View>
                )}
            />

            {totalReviews > initialReviewCount && (
                <TouchableOpacity
                    style={styles.toggleReviewsButton}
                    onPress={() => setShowAllReviews(!showAllReviews)}
                >
                    <Text style={styles.toggleReviewsText}>
                        {showAllReviews ? 'Thu gọn' : `Xem thêm ${totalReviews - initialReviewCount} đánh giá khác`}
                    </Text>
                    <Icon
                        name={showAllReviews ? "chevron-up" : "chevron-down"}
                        size={16}
                        color="black"
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    noReviewsText: {
        fontSize: 16,
        color: "#888",
        textAlign: "center",
        marginVertical: 20,
    },
    ratingContainer: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    ratingLeft: {
        flex: 1.2,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    ratingRight: {
        flex: 1.8,
        justifyContent: 'center',
    },
    averageRating: {
        fontSize: 35,
        fontWeight: 'bold',
    },
    reviewCount: {
        fontSize: 14,
        color: "#555",
    },
    starRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    starNumber: {
        fontSize: 16,
        marginRight: 5,
    },
    barWithCount: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1,
        flex: 1,
    },
    barBackground: {
        flexDirection: 'row',
        height: 16,
        borderRadius: 8,
        overflow: 'hidden',
        marginHorizontal: 5,
        width: MAX_BAR_WIDTH,
    },
    barFill: {
        height: 16,
        backgroundColor: '#FFD700',
    },
    countText: {
        fontSize: 14,
        color: "#555",
        flexShrink: 1,
    },
    reviewItem: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        marginTop: 30
    },
    userDetails: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontWeight: "bold",
        fontSize: 15
    },
    actions: {
        flexDirection: 'row',
    },
    actionButton: {
        padding: 5,
        marginLeft: 8,
    },
    date: {
        fontSize: 14,
        color: "#888",
    },
    titleText: {
        fontWeight: "bold",
        marginTop: 5,
        fontSize: 16
    },
    ratingStars: {
        flexDirection: 'row',
        marginTop: 5,
    },
    filledStarText: {
        color: '#FFD700',
        fontSize: 18,
    },
    emptyStarText: {
        color: '#D3D3D3',
        fontSize: 18,
    },
    comment: {
        fontSize: 14,
        color: "#333",
        marginTop: 5,
    },
    imageContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    reviewImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
        marginRight: 5,
    },
    toggleReviewsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        marginTop: 8,
        backgroundColor: '#8ab4f8',
        borderRadius: 25,
    },
    toggleReviewsText: {
        color: 'black',
        fontSize: 15,
        fontWeight: '500',
        marginRight: 6,
    },
});

export default ReviewsSection;
