import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Header = ({ title, onBackPress, showBackIcon }) => {
  return (
    <View style={styles.header}>
      {showBackIcon && (
        <TouchableOpacity style={styles.iconContainer} onPress={onBackPress}>
          <Ionicons name={'arrow-back'} color={'black'} size={28} />
        </TouchableOpacity>
      )}
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  iconContainer: {
    position: 'absolute',
    left: 5,
  },
  headerTitle: {
    fontSize: 30,
    color: 'black',
    padding: 10
  },
});
