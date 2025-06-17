import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SORT_OPTIONS = [
    { label: 'Giá tăng dần', value: 'price' },
    { label: 'Giá giảm dần', value: '-price' },
    { label: 'Đánh giá thấp nhất', value: 'rating' },
    { label: 'Đánh giá cao nhất', value: '-rating' },
    { label: 'Giảm giá giảm dần', value: '-highestDiscountPercent' },
    { label: 'Giảm giá tăng dần', value: 'highestDiscountPercent' },
];

const SortOptions = ({ selectedSort, onSelect, containerStyle }) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {SORT_OPTIONS.map((option) => (
                <TouchableOpacity
                    key={option.value}
                    style={[
                        styles.option,
                        selectedSort === option.value && styles.selectedOption
                    ]}
                    onPress={() => onSelect(option.value)}
                >
                    <Text style={styles.optionText}>{option.label}</Text>
                    {selectedSort === option.value && (
                        <Icon name="checkmark" size={20} color="#FF385C" />
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 8,
    },
    selectedOption: {
        backgroundColor: '#E3F2FD',
        borderColor: '#1E90FF',
    },
    optionText: {
        fontSize: 16,
    },
});

export default SortOptions;