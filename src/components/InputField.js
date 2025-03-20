import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const InputField = ({ placeholder, icon, secureTextEntry }) => {
  return (
    <View style={styles.container}>
      <Icon name={icon} size={20} color="#888" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#aaa"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  icon: {
    marginRight: 8
  },
  input: {
    flex: 1,
    paddingVertical: 20
  },
});

export default InputField;
