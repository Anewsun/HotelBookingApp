import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFavorite } from '../contexts/FavoriteContext';

const HotelCard = ({ hotel, onPress }) => {
  const { favoriteIds, toggleFavorite } = useFavorite();
  const isFavorite = favoriteIds.includes(hotel._id);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: hotel.featuredImage.url }} style={styles.image} />
      
      {hotel.lowestDiscountedPrice < hotel.lowestPrice && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{hotel.highestDiscountPercent}%</Text>
        </View>
      )}

      <TouchableOpacity style={styles.heartIcon} onPress={() => toggleFavorite(hotel._id)}>
        <Icon name="heart" size={20} color={isFavorite ? 'red' : '#fff'} />
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.name}>{hotel.name}</Text>
        <Text style={styles.location}>{hotel.address}</Text>
        <View style={styles.row}>
          <View style={styles.priceGroupVertical}>
            {hotel.lowestDiscountedPrice < hotel.lowestPrice && (
              <Text style={styles.originalPrice}>
                {Intl.NumberFormat('vi-VN').format(hotel.lowestPrice)}VNĐ
              </Text>
            )}
            <View style={styles.discountRow}>
              <Text style={styles.discountedPrice}>
                {Intl.NumberFormat('vi-VN').format(hotel.lowestDiscountedPrice)}VNĐ
              </Text>
            </View>
          </View>
          <View style={styles.rating}>
            <Image
              source={require('../assets/images/star.png')}
              style={{ width: 16, height: 16 }}
            />
            <Text style={styles.ratingText}>{hotel.rating.toFixed(1)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    width: 180,
    height: 280,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 5,
    borderRadius: 15,
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#e53935',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  info: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  },
  location: {
    fontSize: 14,
    fontWeight: '400',
    color: 'black',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    marginLeft: 5,
  },
  priceGroupVertical: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  originalPrice: {
    fontSize: 15,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
  },
});

export default HotelCard;