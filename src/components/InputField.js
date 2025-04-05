import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const InputField = ({ placeholder, icon, value, onChangeText, secureTextEntry }) => {
  return (
    <View style={styles.container}>
      <Icon name={icon} size={20} color="#888" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="black"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    paddingHorizontal: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
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
