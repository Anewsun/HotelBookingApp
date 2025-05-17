import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import HotelCard from '../components/HotelCard';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchHotelsWithFilters, searchHotelsWithAvailableRooms } from '../services/hotelService';
import { useFavorite } from '../contexts/FavoriteContext';

const SearchResultScreen = () => {
    const route = useRoute();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useState(route.params?.searchParams || null);
    const [location, setLocation] = useState(searchParams?.locationName || '');
    const [searchTimeout, setSearchTimeout] = useState(null);
    const { favoriteIds, toggleFavorite } = useFavorite();
    const navigation = useNavigation();

    const fetchData = async (params) => {
        try {
            setLoading(true);
            setError(null);

            let results = [];

            if (params) {
                const response = await searchHotelsWithAvailableRooms({
                    locationName: params.locationName,
                    checkIn: params.checkIn,
                    checkOut: params.checkOut,
                    capacity: params.capacity,
                    sort: params.sort || '-rating'
                });
                results = response.data;
            }
            else if (route.params?.filters) {
                const {
                    minPrice,
                    maxPrice,
                    minDiscountPercent,
                    rating,
                    hotelAmenities = [],
                    roomAmenities = []
                } = route.params.filters;

                const filters = {
                    minPrice,
                    maxPrice,
                    minDiscountPercent,
                    rating,
                    amenities: [...hotelAmenities, ...roomAmenities].join(','),
                    sort: route.params.filters.sort || '-createdAt'
                };

                const response = await fetchHotelsWithFilters(filters);
                results = response.data || [];
            }

            setHotels(Array.isArray(results) ? results : []);

        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message || 'Lỗi khi tải dữ liệu');
            setHotels([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (route.params?.searchParams) {
            setSearchParams(route.params.searchParams);
            setLocation(route.params.searchParams.locationName);
            fetchData(route.params.searchParams);
        }
    }, [route.params]);

    const handleSearch = () => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        setSearchTimeout(setTimeout(() => {
            if (!location) {
                Alert.alert('Lỗi', 'Vui lòng nhập địa điểm');
                return;
            }

            const newSearchParams = {
                ...searchParams,
                locationName: location
            };

            setSearchParams(newSearchParams);
            fetchData(newSearchParams);
        }, 500));
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const navigateToHotelDetail = (hotelId) => {
        if (!searchParams) return;

        navigation.navigate('Detail', {
            hotelId,
            searchParams: {
                checkIn: searchParams.checkIn,
                checkOut: searchParams.checkOut,
                capacity: searchParams.capacity,
                fromSearch: true
            }
        });
    };

    if (error) {
        return (
            <SafeAreaView style={styles.errorContainer}>
                <View style={styles.errorContent}>
                    <Icon name="warning-outline" size={60} color="#ff6b6b" />
                    <Text style={styles.errorTitle}>Đã xảy ra lỗi</Text>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={fetchData}
                    >
                        <Text style={styles.retryButtonText}>Thử lại</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    if (!hotels || hotels.length === 0) {
        return (
            <SafeAreaView style={styles.emptyContainer}>
                <View style={styles.emptyContent}>
                    <Icon2 name="search-off" size={60} color="black" />
                    <Text style={styles.emptyTitle}>Không tìm thấy kết quả</Text>
                    <Text style={styles.emptySubText}>Hãy thử điều chỉnh tiêu chí tìm kiếm của bạn</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={fetchData}
                    >
                        <Text style={styles.retryButtonText}>Tải lại</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backButtonText}>Quay lại tìm kiếm</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" color="black" size={28} />
                </TouchableOpacity>
                <View style={styles.searchContainer}>
                    <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Tìm kiếm"
                        style={styles.searchInput}
                        value={location}
                        onChangeText={setLocation}
                        onSubmitEditing={handleSearch}
                    />
                    <TouchableOpacity onPress={handleSearch}>
                        <Text style={styles.searchButtonText}>Tìm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => navigation.navigate('Filter')}
                    >
                        <Icon name="options-outline" size={25} color="#FF385C" />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.countSearch}>{hotels.length} kết quả được tìm thấy</Text>
            <FlatList
                data={hotels}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <HotelCard
                        hotel={item}
                        isFavorite={favoriteIds.includes(item._id)}
                        onFavoritePress={() => toggleFavorite(item._id)}
                        onPress={() => navigateToHotelDetail(item._id)}
                    />
                )}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4ff',
        paddingHorizontal: 15,
        paddingTop: 20
    },
    iconContainer: {
        marginRight: 10
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%'
    },
    countSearch: {
        fontSize: 16,
        paddingBottom: 10,
        color: 'black',
        fontWeight: 'bold'
    },
    searchIcon: {
        marginRight: 10
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
        backgroundColor: '#F8F8F8',
        paddingHorizontal: 20,
    },
    emptyContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
    },
    emptySubText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 40,
    },
    errorContainer: {
        flex: 1,
        backgroundColor: '#F8F8F8',
        paddingHorizontal: 20,
    },
    errorContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    errorTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ff6b6b',
        marginTop: 20,
        marginBottom: 10,
    },
    errorText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 40,
    },
    retryButton: {
        backgroundColor: '#FF385C',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
        marginBottom: 15,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    backButton: {
        borderWidth: 1,
        borderColor: '#FF385C',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
    },
    backButtonText: {
        color: '#FF385C',
        fontSize: 16,
        fontWeight: '600',
    },
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 10,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchInput: {
        flex: 1,
        fontSize: 17,
        paddingVertical: 5,
        marginHorizontal: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    filterButton: {
        padding: 5,
        marginLeft: 10,
    },
    searchButtonText: {
        fontSize: 16,
        color: 'blue',
        fontWeight: 'bold',
        paddingHorizontal: 10,
    },
});

export default SearchResultScreen;
