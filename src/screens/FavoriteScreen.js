import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import HotelCard from '../components/HotelCard';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import { getFavorites, removeFavorite } from '../services/userService';

const FavoriteScreen = () => {
    const navigation = useNavigation();
    const [favorites, setFavorites] = useState([]);

    const fetchFavorites = async () => {
        try {
            const data = await getFavorites();
            setFavorites(data);
        } catch (err) {
            console.error('Lỗi lấy danh sách yêu thích:', err);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const handleToggleFavorite = async (hotelId) => {
        try {
            await removeFavorite(hotelId);
            setFavorites((prev) => prev.filter(h => h._id !== hotelId));
        } catch (err) {
            console.error('Lỗi xóa yêu thích:', err);
        }
    };

    return (
        <View style={styles.container}>
            <Header title="Danh sách yêu thích" onBackPress={() => navigation.goBack()} />

            {favorites.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        Chưa có khách sạn nào được thêm vào danh sách, hãy chọn khách sạn mà bạn muốn thêm vào đây nhé!
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <HotelCard
                            hotel={item}
                            isFavorite={true}
                            onToggleFavorite={() => handleToggleFavorite(item._id)}
                        />
                    )}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.listContainer}
                />
            )}

            <BottomNav />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
        paddingHorizontal: 15,
        paddingTop: 20
    },
    listContainer: {
        paddingBottom: 20
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 15
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: 'gray',
    },
});

export default FavoriteScreen;
