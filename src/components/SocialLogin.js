import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

const SocialLogin = ({ onGooglePress, onFacebookPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onGooglePress}>
        <Image source={require('../assets/icons/google.png')} style={styles.icon} />
        <Text style={styles.text}>Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onFacebookPress}>
        <Image source={require('../assets/icons/facebook.png')} style={styles.icon} />
        <Text style={styles.text}>Facebook</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 8,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 8
  },
  text: {
    fontSize: 19,
    fontWeight: 'bold'
  },
});

export default SocialLogin;
