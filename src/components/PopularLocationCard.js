import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';

const PopularLocationCard = ({ location, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <ImageBackground
        source={{ uri: location.image.url }}
        style={styles.image}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.overlay}>
          <Text style={styles.name} numberOfLines={1}>{location.name}</Text>
          <Text style={styles.count}>{location.hotelCount} khách sạn</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 140,
    height: 120,
    marginRight: 15,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#ccc',
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#fff',
  },
  count: {
    fontSize: 14,
    color: '#fff',
  },
});

export default PopularLocationCard;
