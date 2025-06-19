import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_API_URL } from '../../config';

let socket = null;
let isInitialized = false;

export const initSocket = async () => {
  if (isInitialized && socket?.connected) return socket;

  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('No token available');

    if (socket) {
      socket.disconnect();
    }

    socket = io(`${BASE_API_URL}`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 5000,
    });

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Socket connection timeout'));
      }, 5000);

      socket.once('connect', () => {
        clearTimeout(timeout);
        isInitialized = true;
        console.log('Socket connected');
        resolve(socket);
      });

      socket.once('connect_error', (err) => {
        clearTimeout(timeout);
        isInitialized = false;
        reject(err);
      });
    });
  } catch (error) {
    console.error('Socket initialization failed:', error);
    throw error;
  }
};

export const getSocket = () => {
  if (!isInitialized || !socket) {
    throw new Error('Socket not initialized. Call initSocket() first.');
  }
  return socket;
};

export const disconnectSocket = async () => {
  if (!socket) return;

  try {
    await new Promise((resolve) => {
      socket.disconnect();
      socket.once('disconnect', resolve);
      setTimeout(resolve, 1000);
    });
  } finally {
    forceDisconnect();
  }
};

export const forceDisconnect = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    isInitialized = false;
  }
};

export const waitForSocketConnection = async () => {
  if (isSocketConnected()) return true;

  return new Promise((resolve, reject) => {
    const checkInterval = setInterval(() => {
      if (isSocketConnected()) {
        clearInterval(checkInterval);
        resolve(true);
      }
    }, 100);

    setTimeout(() => {
      clearInterval(checkInterval);
      reject(new Error('Socket connection timeout'));
    }, 5000);
  });
};

export const isSocketConnected = () => isInitialized && socket?.connected;