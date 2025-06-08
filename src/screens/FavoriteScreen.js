import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import HotelCard from '../components/HotelCard';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import { useFavorite } from '../contexts/FavoriteContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const FavoriteScreen = () => {
    const navigation = useNavigation();
    const { favoriteIds, toggleFavorite, favoriteHotels } = useFavorite();

    const handlePressHotel = (hotel) => {
        navigation.navigate('Detail', {
            hotelId: hotel._id,
            searchParams: {
                checkIn: new Date().toLocaleDateString('en-CA'),
                checkOut: new Date(Date.now() + 86400000).toLocaleDateString('en-CA'),
                capacity: 1,
                fromSearch: false
            }
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Danh sách yêu thích" onBackPress={() => navigation.goBack()} />

            {favoriteHotels.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        Chưa có khách sạn nào được thêm vào danh sách, hãy chọn khách sạn mà bạn muốn thêm vào đây nhé!
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={favoriteHotels}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <HotelCard
                            hotel={item}
                            onPress={() => handlePressHotel(item)}
                            isFavorite={true}
                            onToggleFavorite={() => toggleFavorite(item._id)}
                        />
                    )}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.listContainer}
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
    listContainer: {
        paddingBottom: 20
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 15,
        paddingHorizontal: 10,
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default FavoriteScreen;
