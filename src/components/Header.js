import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Header = ({ title, onBackPress, showBackIcon, rightComponent }) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBackIcon && (
          <TouchableOpacity onPress={onBackPress}>
            <Ionicons name="arrow-back" color="black" size={28} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerContainer}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.rightContainer}>
        {rightComponent}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 19,
  },
  leftContainer: {
    minWidth: 40,
    marginLeft: 10
  },
  centerContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
  },
  rightContainer: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
});
