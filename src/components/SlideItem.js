import { StyleSheet, View, Image } from 'react-native';
import React from 'react';

const SlideItem = ({ item }) => {
  return (
    <View style={styles.container}>
      <Image source={item} style={styles.image} />
    </View>
  );
};

export default SlideItem;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 350,
    alignItems: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
});
