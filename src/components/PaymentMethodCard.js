import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const PaymentMethodCard = ({ method, selected, onSelect }) => {
  return (
    <TouchableOpacity 
      style={[styles.container, selected && styles.selectedContainer]}
      onPress={onSelect}
    >
      <View style={styles.row}>
        {method.image ? (
          <Image source={method.image} style={styles.methodImage} />
        ) : (
          <Icon name={method.icon} size={24} color="#333" />
        )}
        <Text style={styles.methodName}>{method.name}</Text>
      </View>
      {selected && <Icon name="check-circle" size={20} color="#1167B1" />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginVertical: 8,
    backgroundColor: '#fff',
  },
  selectedContainer: {
    borderColor: '#1167B1',
    backgroundColor: '#F0F8FF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodImage: {
    width: 29,
    height: 29,
    resizeMode: 'contain',
  },
  methodName: {
    fontSize: 19,
    fontWeight: '500',
    color: '#333',
  },
});