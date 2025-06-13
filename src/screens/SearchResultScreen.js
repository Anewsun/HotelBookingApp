import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import HotelCard from '../components/HotelCard';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { searchHotelsWithAvailableRooms } from '../services/hotelService';
import { useFavorite } from '../contexts/FavoriteContext';
import { getLocations } from '../services/locationService';
import SortOptions from '../components/SortOptions';

const SearchResultScreen = () => {
    const route = useRoute();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useState(route.params?.searchParams || null);
    const [currentFilters, setCurrentFilters] = useState(route.params?.filters || null);
    const [location, setLocation] = useState(searchParams?.locationName || '');
    const [locationId, setLocationId] = useState(searchParams?.locationId || null);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [locationsList, setLocationsList] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const { favoriteIds, toggleFavorite } = useFavorite();
    const navigation = useNavigation();
    const [selectedSort, setSelectedSort] = useState(currentFilters?.sort || '-price');
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [total, setTotal] = useState(0);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    });

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const data = await getLocations();
                setLocationsList(data);
                setFilteredLocations(data);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };
        fetchLocations();
    }, []);

    const fetchData = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            setError(null);

            const combinedParams = {
                ...searchParams,
                ...currentFilters,
                ...params,
                page: pagination.page,
                limit: pagination.limit
            };

            console.log('API Params:', combinedParams);
            const response = await searchHotelsWithAvailableRooms(combinedParams);
            if (response.error) {
                setError(response.error);
                setHotels([]);
            } else {
                setHotels(response.data);
                setTotal(response.total || response.data.length);
                setPagination(prev => ({
                    ...prev,
                    total: response.total,
                    totalPages: response.pagination?.totalPages || Math.ceil(response.total / prev.limit)
                }));
                setError(response.data.length === 0 ? 'Không tìm thấy khách sạn phù hợp' : null);
            }

        } catch (err) {
            console.error('Fetch error:', err);
            setError('Đã xảy ra lỗi khi tải dữ liệu');
            setHotels([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [searchParams, currentFilters, pagination.page, pagination.limit]);

    useEffect(() => {
        console.log('Route changed:', route.params);
        if (route.params?.searchParams) {
            const { locationId, locationName, checkIn, checkOut, capacity } = route.params.searchParams;
            const newSearchParams = {
                locationId,
                locationName,
                checkIn,
                checkOut,
                capacity,
            };
            setSearchParams(newSearchParams);
            setLocation(locationName);
            setLocationId(locationId);
            setCurrentFilters(route.params.filters || null);
        }
    }, [route.params]);

    useEffect(() => {
        console.log('searchParams/currentFilters changed:', searchParams, currentFilters);
        if (searchParams?.locationId && searchParams?.checkIn && searchParams?.checkOut) {
            setPagination(prev => ({ ...prev, page: 1 }));
        }
    }, [searchParams, currentFilters]);

    useEffect(() => {
        if (!searchParams || !searchParams.locationId || !searchParams.checkIn || !searchParams.checkOut) {
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            console.log('Fetching data...');
            fetchData();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [pagination.page, searchParams, currentFilters, fetchData]);

    useEffect(() => {
        if (route.params?.filters?.sort) {
            setSelectedSort(route.params.filters.sort);
        }
    }, [route.params?.filters]);

    const handleLocationSearch = (text) => {
        setLocation(text);
        if (text.length > 0) {
            const filtered = locationsList.filter(item =>
                item.name.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredLocations(filtered);
        } else {
            setFilteredLocations(locationsList);
        }
        setShowLocationDropdown(true);
    };

    const selectLocation = (selectedLocation) => {
        setLocation(selectedLocation.name);
        setLocationId(selectedLocation._id);
        setShowLocationDropdown(false);
    };

    const handleSortChange = (sortValue) => {
        let backendSortValue;
        switch (sortValue) {
            case '-rating':
                backendSortValue = '-rating';
                break;
            case 'rating':
                backendSortValue = 'rating';
                break;
            case 'price':
                backendSortValue = 'price';
                break;
            case '-price':
            default:
                backendSortValue = '-price';
        }

        setSelectedSort(sortValue);
        setCurrentFilters(prev => ({ ...prev, sort: sortValue }));
    };

    const handleSearch = () => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        setSearchTimeout(
            setTimeout(async () => {
                try {
                    if (!location) {
                        Alert.alert('Lỗi', 'Vui lòng nhập địa điểm');
                        return;
                    }

                    const isValidLocation = locationsList.some(
                        loc => loc.name.toLowerCase() === location.toLowerCase()
                    );

                    if (!isValidLocation) {
                        setError('Không tìm thấy khách sạn ở địa điểm du lịch này');
                        setHotels([]);
                        return;
                    }

                    const newSearchParams = {
                        ...searchParams,
                        locationName: location,
                        locationId: locationId
                    };

                    setSearchParams(newSearchParams);
                    //setLocation(location);
                    await fetchData({
                        ...newSearchParams,
                        ...(currentFilters || {}),
                    });

                } catch (error) {
                    console.error('Search error:', error);
                }
            }, 500)
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const navigateToHotelDetail = (hotelId) => {
        navigation.navigate('Detail', {
            hotelId,
            searchParams: searchParams
        });
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    const PaginationControls = () => (
        <View style={styles.pagination}>
            {Array.from({ length: pagination.totalPages }, (_, index) => (
                <TouchableOpacity
                    key={index + 1}
                    onPress={() => handlePageChange(index + 1)}
                    style={[
                        styles.pageButton,
                        pagination.page === index + 1 && styles.activePageButton
                    ]}
                >
                    <Text style={styles.pageButtonText}>{index + 1}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    if (!loading && (error || !hotels || total === 0)) {
        const isLocationError = [
            'Không tìm thấy địa điểm du lịch này',
            'Vui lòng chọn địa điểm',
            'Không tìm thấy phòng phù hợp ở địa điểm này'
        ].includes(error);

        return (
            <SafeAreaView style={styles.errorContainer}>
                <View style={styles.errorContent}>
                    <Icon2
                        name={isLocationError ? "location-off" : "search-off"}
                        size={60}
                        color="#FF385C"
                    />
                    <Text style={styles.errorTitle}>
                        {isLocationError ? 'Địa điểm không tồn tại' : 'Không tìm thấy kết quả'}
                    </Text>
                    <Text style={styles.errorText}>
                        {error || 'Hãy thử điều chỉnh tiêu chí tìm kiếm của bạn'}
                    </Text>

                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.retryButtonText}>Quay lại tìm kiếm</Text>
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
                        placeholder="Tìm kiếm địa điểm"
                        style={styles.searchInput}
                        value={location}
                        onChangeText={handleLocationSearch}
                        onSubmitEditing={handleSearch}
                        onFocus={() => setShowLocationDropdown(true)}
                    />
                    <TouchableOpacity onPress={handleSearch}>
                        <Text style={styles.searchButtonText}>Tìm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => navigation.navigate('Filter', {
                            searchParams: {
                                ...searchParams,
                                locationId,
                                locationName: location
                            },
                            filters: currentFilters
                        })}
                    >
                        <Icon name="options-outline" size={25} color="#FF385C" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.sortButton}
                        onPress={() => setShowSortOptions(true)}
                    >
                        <Icon name="swap-vertical" size={25} color="#FF385C" />
                    </TouchableOpacity>
                </View>
            </View>

            {showLocationDropdown && (
                <Modal
                    transparent
                    visible={showLocationDropdown}
                    onRequestClose={() => setShowLocationDropdown(false)}
                >
                    <TouchableOpacity
                        style={styles.dropdownOverlay}
                        activeOpacity={1}
                        onPress={() => setShowLocationDropdown(false)}
                    >
                        <View style={styles.dropdownContainer}>
                            <FlatList
                                data={filteredLocations}
                                keyExtractor={(item) => item._id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.dropdownItem}
                                        onPress={() => selectLocation(item)}
                                    >
                                        <Text style={styles.dropdownItemText}>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                                ItemSeparatorComponent={() => <View style={styles.separator} />}
                                keyboardShouldPersistTaps="handled"
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}

            <Text style={styles.countSearch}>{total} kết quả được tìm thấy</Text>
            <FlatList
                data={hotels}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <HotelCard
                        hotel={item}
                        isFavorite={favoriteIds.includes(item._id)}
                        onFavoritePress={() => toggleFavorite(String(item._id))}
                        onPress={() => navigateToHotelDetail(item._id)}
                    />
                )}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContainer}
                ListFooterComponent={PaginationControls}
            />

            <Modal
                transparent
                visible={showSortOptions}
                onRequestClose={() => setShowSortOptions(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowSortOptions(false)}
                >
                    <View style={styles.sortModalContainer}>
                        <Text style={styles.sortTitle}>Sắp xếp theo</Text>
                        <SortOptions
                            selectedSort={selectedSort}
                            onSelect={(value) => {
                                handleSortChange(value);
                                setShowSortOptions(false);
                            }}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
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
    dropdownOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    dropdownContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        maxHeight: 300,
    },
    dropdownItem: {
        padding: 15,
    },
    dropdownItemText: {
        fontSize: 16,
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sortModalContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        width: '80%',
    },
    sortTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 10,
    },
    pageButton: {
        margin: 5,
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'lightgray'
    },
    activePageButton: {
        backgroundColor: '#1167B1'
    },
    pageButtonText: {
        fontSize: 16,
        color: 'black'
    },
});

export default SearchResultScreen;
