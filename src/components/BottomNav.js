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
        style={[styles.navItem, { backgroundColor: currentRouteName === 'Home' ? '#0543FF' : 'white' }]}
        onPress={() => navigation.navigate('Home')}
      >
        <Icon name="home-outline" size={20} />
        <Text style={styles.navText}>Trang chủ</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, { backgroundColor: currentRouteName === 'Fav' ? '#0543FF' : 'white' }]}
        onPress={() => navigation.navigate('Fav')}
      >
        <Icon name="heart-outline" size={20} />
        <Text style={styles.navText}>Yêu thích</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, { backgroundColor: currentRouteName === 'Booking' ? '#0543FF' : 'white' }]}
        onPress={() => navigation.navigate('Booking')}
      >
        <Icon name="calendar-outline" size={20} />
        <Text style={styles.navText}>Lịch đặt</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, { backgroundColor: currentRouteName === 'BlogList' ? '#0543FF' : 'white' }]}
        onPress={() => navigation.navigate('BlogList')}
      >
        <Icon name="document-outline" size={20} />
        <Text style={styles.navText}>Bài viết</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, { backgroundColor: currentRouteName === 'ChatList' ? '#0543FF' : 'white' }]}
        onPress={() => navigation.navigate('ChatList')}
      >
        <Icon name="chatbubble-ellipses-outline" size={20} />
        <Text style={styles.navText}>Tin nhắn</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, { backgroundColor: currentRouteName === 'Profile' ? '#0543FF' : 'white' }]}
        onPress={() => navigation.navigate('Profile')}
      >
        <Icon name="person-outline" size={20} />
        <Text style={styles.navText}>Cá nhân</Text>
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
    padding: 15,
    borderRadius: 15,
  },
  navText: {
    fontSize: 8,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 5
  },
});

export default BottomNav;