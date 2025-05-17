import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

let socket;

export const initSocket = async () => {
  const token = await AsyncStorage.getItem('token');
  socket = io('http://10.0.2.2:5000', {
    auth: { token },
    transports: ['websocket'], // Bắt buộc cho Android
  });
  return socket;
};

export const getSocket = () => socket;