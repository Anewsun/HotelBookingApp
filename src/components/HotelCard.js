import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFavorite } from '../contexts/FavoriteContext';

const HotelCard = ({ hotel, onPress, showDiscountBadge = false }) => {
  const { favoriteIds, toggleFavorite } = useFavorite();
  const isFavorite = favoriteIds.includes(hotel._id);
  const hasDiscount = hotel.lowestPrice > hotel.lowestDiscountedPrice;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: hotel.featuredImage?.url }}
          style={styles.image}
        />
        {showDiscountBadge && hotel.highestDiscountPercent > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{hotel.highestDiscountPercent}%</Text>
          </View>
        )}
        <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(hotel._id)}>
          <Icon
            name={isFavorite ? "heart" : "heart-o"}
            size={24}
            color={isFavorite ? "red" : "white"}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.textContent}>
          <Text style={styles.name} numberOfLines={2}>{hotel.name}</Text>
          <Text style={styles.location} numberOfLines={2}>
            {hotel.address}
          </Text>
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.priceColumn}>
            {hasDiscount ? (
              <>
                <Text style={styles.originalPrice}>
                  {formatPrice(hotel.lowestPrice)}
                </Text>
                <Text style={styles.discountedPrice}>
                  {formatPrice(hotel.lowestDiscountedPrice)}
                </Text>
              </>
            ) : (
              <Text style={[styles.discountedPrice, { marginTop: 18 }]}>
                {formatPrice(hotel.lowestDiscountedPrice)}
              </Text>
            )}
          </View>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="gold" />
            <Text style={styles.rating}>{hotel.rating?.toFixed(1) || '5.0'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const formatPrice = (price) => {
  return `${Intl.NumberFormat('vi-VN').format(price)} VNĐ`;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    width: 180,
    height: 320,
    marginRight: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 150,
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    borderRadius: 15,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  discountText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 5,
  },
  infoContainer: {
    padding: 5,
    flex: 1,
    justifyContent: 'space-between',
  },
  textContent: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: 'black',
    marginBottom: 5,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceColumn: {
    flex: 1,
  },
  originalPrice: {
    fontSize: 14,
    color: 'gray',
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  discountedPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'blue',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  rating: {
    marginLeft: 5,
    fontSize: 15,
  },
});

export default HotelCard;