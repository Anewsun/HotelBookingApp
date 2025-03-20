import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const HotelCard = ({ hotel }) => {
  return (
    <TouchableOpacity style={styles.card}>
      <Image source={hotel.image} style={styles.image} />
      <TouchableOpacity style={styles.heartIcon}>
        <Icon name="heart" size={20} color="#fff" />
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.name}>{hotel.name}</Text>
        <Text style={styles.location}>{hotel.location}</Text>
        <View style={styles.row}>
          <Text style={styles.price}>{hotel.price}</Text>
          <View style={styles.rating}>
            <Image
              source={require('../assets/images/star.png')}
              style={{ width: 16, height: 16 }}
            />
            <Text style={styles.ratingText}>{hotel.rating}</Text>
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
    height: 250,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#000',
    // Hiệu ứng bóng
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    // Hiệu ứng nghiêng nhẹ
    transform: [{ perspective: 1000 }, { rotateX: '5deg' }, { rotateY: '-5deg' }]
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
  info: {
    padding: 10,
    flex: 1, 
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 15,
    color: 'black',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'red',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 5,
  },
});

export default HotelCard;