import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Header from '../components/Header';

const VerifyCodeScreen = ({ navigation }) => {
  const [code, setCode] = useState('');

  const handleChangeText = (value) => {
    if (value.length <= 4) {
      setCode(value);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Xác nhận Code" onBackPress={() => navigation.goBack()} showBackIcon={true} />
      <Text style={styles.subText}>Hãy nhập mã code chúng tôi gửi bạn qua email</Text>
      <Text style={styles.emailText}>your-email@example.com</Text>

      <View style={styles.codeContainer}>
        {Array(4).fill('').map((_, index) => (
          <View key={index} style={styles.inputBox}>
            <Text style={styles.inputText}>{code[index] || ''}</Text>
          </View>
        ))}
      </View>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Không nhận được OTP? </Text>
        <TouchableOpacity>
          <Text style={styles.resendLink}>Gửi lại code</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NewPassword')} >
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  subText: {
    fontSize: 20,
    color: '#7D7D7D',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold'
  },
  emailText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 30,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    margin: 35,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#000',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 24,
    textAlign: 'center',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  resendText: {
    fontSize: 16,
    color: '#666',
  },
  resendLink: {
    fontSize: 16,
    color: '#007bff',
    textDecorationLine: 'underline',
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#1167B1',
    paddingVertical: 15,
    width: '90%',
    alignItems: 'center',
    borderRadius: 35,
    margin: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default VerifyCodeScreen;
