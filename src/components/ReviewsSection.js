import React from "react";
import { View, Text, FlatList, StyleSheet, Image, Dimensions } from "react-native";

const { width } = Dimensions.get('window');
const MAX_BAR_WIDTH = width * 0.25;

const reviews = [
    {
        id: "1",
        name: "Tân Lương",
        rating: 5,
        comment: "Dịch vụ và phòng rất tuyệt.",
        title: "Phòng rất đẹp",
        date: "23/04/2025",
        images: [require('../assets/images/hotel2.jpg')]
    },
    {
        id: "2",
        name: "Hữu Phong",
        rating: 5,
        comment: "Căn phòng không có gì để chê.",
        title: "Không có điểm nào để phàn nàn",
        date: "25/04/2025",
        images: [require('../assets/images/hotel3.jpg')]
    },
    {
        id: "3",
        name: "Quang Lâm",
        rating: 4,
        comment: "Tuyệt vời nhưng giá hơi đắt.",
        title: "Có thể cải thiện giá cả",
        date: "03/04/2025",
        images: [require('../assets/images/hotel2.jpg')]
    },
];

const ReviewsSection = () => {
    const totalReviews = reviews.length;
    const averageRating = (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1);

    const starCounts = [1, 2, 3, 4, 5].map(star => reviews.filter(review => review.rating === star).length);

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
                data={reviews}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.reviewItem}>
                        <View style={styles.userInfo}>
                            <Image source={require('../assets/images/Bat.jpg')} style={styles.avatar} />
                            <View style={styles.userDetails}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.date}>{item.date}</Text>
                                <Text style={styles.titleText}>{item.title}</Text>
                                <View style={styles.ratingStars}>
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <Text key={index} style={index < item.rating ? styles.filledStarText : styles.emptyStarText}>★</Text>
                                    ))}
                                </View>
                                <Text style={styles.comment}>{item.comment}</Text>
                            </View>
                        </View>
                        {item.images.length > 0 && (
                            <View style={styles.imageContainer}>
                                {item.images.map((image, index) => (
                                    <Image key={index} source={image} style={styles.reviewImage} />
                                ))}
                            </View>
                        )}
                    </View>
                )}
            />
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
    },
    userDetails: {
        flex: 1,
    },
    name: {
        fontWeight: "bold",
        fontSize: 15
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
});

export default ReviewsSection;
