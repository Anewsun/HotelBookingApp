import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HotelCard from '../components/HotelCard';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';

const favoriteHotels = [
    { id: 1, name: 'Khách sạn Bali', location: '5A ngã tư Sở, Lê Lợi, Huế', price: '800000 VND', rating: 4.7, image: require('../assets/images/hotel1.jpg') },
    { id: 2, name: 'Khách sạn Paradise', location: '56/7, Ngô Quyền, Vũng Tàu', price: '370000 VND', rating: 4.7, image: require('../assets/images/hotel2.jpg') },
    { id: 3, name: 'Khách sạn Sunrise', location: '123, Trần Phú, Đà Nẵng', price: '400000 VND', rating: 4.9, image: require('../assets/images/hotel3.jpg') },
    { id: 4, name: 'Khách sạn Ocean View', location: '45, Nguyễn Văn Cừ, Nha Trang', price: '450000 VND', rating: 4.6, image: require('../assets/images/hotel4.jpg') },
];

const FavoriteScreen = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Header title="Danh sách yêu thích" onBackPress={() => navigation.goBack()} />

            <View style={styles.searchContainer}>
                <Icon name="search" size={25} color="#888" style={styles.searchIcon} />
                <TextInput placeholder="Tìm kiếm" style={styles.searchInput} />
                <TouchableOpacity onPress={() => navigation.navigate('Filter')} >
                    <Icon name="options-outline" size={25} color="red" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={favoriteHotels}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <HotelCard hotel={item} />}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContainer}
            />

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
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15
    },
    searchIcon: {
        marginRight: 10
    },
    searchInput: {
        flex: 1,
        fontSize: 17
    },
    listContainer: {
        paddingBottom: 20
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 15
    },
});

export default FavoriteScreen;
