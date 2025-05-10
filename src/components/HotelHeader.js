import { Animated, FlatList, StyleSheet, View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const HeaderHotelDetail = ({ showFavoriteIcon, isWished, toggleWishlist }) => {
    const [wishlistState, setWishlistState] = useState(isWished);
    const navigation = useNavigation();

    useEffect(() => {
        setWishlistState(isWished);
    }, [isWished]);

    const handleWishlistToggle = () => {
        toggleWishlist();
        setWishlistState(!wishlistState);
    };

    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.goBack()}>
                <Ionicons name={'arrow-back'} color={'black'} size={20} />
            </TouchableOpacity>
            {showFavoriteIcon && (
                <TouchableOpacity style={styles.favoriteIconContainer} onPress={handleWishlistToggle}>
                    <Icon name={'heart'} color={wishlistState ? 'red' : 'gray'} size={20} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const HotelHeader = ({ isWished, toggleWishlist }) => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const [index, setIndex] = useState(0);

    const localImages = [
        require('../assets/images/hotel1.jpg'),
        require('../assets/images/hotel2.jpg'),
        require('../assets/images/hotel3.jpg'),
        require('../assets/images/hotel4.jpg'),
    ];

    const handleonViewableItemsChanged = useRef(({ viewableItems }) => {
        const firstItem = viewableItems[0];
        if (firstItem && firstItem.index !== undefined) {
            setIndex(firstItem.index);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const SlideItem = ({ item }) => (
        <View style={styles.slideContainer}>
            <Image source={item} style={styles.slideImage} resizeMode="cover" />
        </View>
    );

    const Pagination = ({ data, scrollX }) => {
        const dotPosition = Animated.divide(scrollX, width);

        return (
            <View style={styles.paginationContainer}>
                {data.map((_, i) => {
                    const opacity = dotPosition.interpolate({
                        inputRange: [i - 1, i, i + 1],
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp',
                    });
                    return <Animated.View key={i} style={[styles.dot, { opacity }]} />;
                })}
            </View>
        );
    };

    return (
        <View>
            <HeaderHotelDetail
                showFavoriteIcon={true}
                isWished={isWished}
                toggleWishlist={toggleWishlist}
            />
            <FlatList
                data={localImages}
                renderItem={({ item }) => <SlideItem item={item} />}
                horizontal
                pagingEnabled
                snapToAlignment="center"
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                onViewableItemsChanged={handleonViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                decelerationRate="fast"
                keyExtractor={(_, index) => index.toString()}
            />
            <Pagination data={localImages} scrollX={scrollX} />
        </View>
    );
};

export default HotelHeader;

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 25,
        left: 8,
        right: 8,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        zIndex: 1,
    },
    iconContainer: {
        position: 'absolute',
        left: 5,
        width: 35,
        height: 35,
        borderRadius: 20,
        backgroundColor: 'white',
        borderWidth: 0.3,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    favoriteIconContainer: {
        position: 'absolute',
        right: 5,
        width: 35,
        height: 35,
        borderRadius: 20,
        backgroundColor: 'white',
        borderWidth: 0.3,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    slideContainer: {
        width: width,
        height: 250,
    },
    slideImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    paginationContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    dot: {
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: '#595959',
        marginHorizontal: 4,
    },
});
