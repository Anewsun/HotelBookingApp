import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useNavigationState } from '@react-navigation/native';

const BottomNav = () => {
  const navigation = useNavigation();
  const currentRouteName = useNavigationState(state => state.routes[state.index].name);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.navItem, { backgroundColor: currentRouteName === 'Home' ? '#1167B1' : 'white' }]}
        onPress={() => navigation.navigate('Home')}
      >
        <Icon name="home-outline" size={34} />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, { backgroundColor: currentRouteName === 'Fav' ? '#1167B1' : 'white' }]}
        onPress={() => navigation.navigate('Fav')}
      >
        <Icon name="heart-outline" size={34} />
        <Text style={styles.navText}>Favorite</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, { backgroundColor: currentRouteName === 'BookingScreen' ? '#1167B1' : 'white' }]}
        onPress={() => navigation.navigate('BookingScreen')}
      >
        <Icon name="calendar-outline" size={34} />
        <Text style={styles.navText}>Booking</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, { backgroundColor: currentRouteName === 'ProfileScreen' ? '#1167B1' : 'white' }]}
        onPress={() => navigation.navigate('ProfileScreen')}
      >
        <Icon name="person-outline" size={34} />
        <Text style={styles.navText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderTopWidth: 2,
    borderTopColor: '#EEE'
  },
  navItem: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
  },
  navText: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 5
  },
});

export default BottomNav;