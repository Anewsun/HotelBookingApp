import { useEffect, useState } from 'react';
import * as notificationService from '../services/notificationService';
import { initSocket, getSocket, isSocketConnected } from '../utils/socket';

const useNotifications = (token) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err.message || 'Lỗi tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, status: 'read' } : n)
      );
    } catch (err) {
      console.error('Lỗi đánh dấu đã đọc:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
    } catch (err) {
      console.error('Lỗi đánh dấu tất cả:', err);
    }
  };

  const hasUnread = notifications.some(noti => noti.status === 'unread');

  useEffect(() => {
    const setupSocket = async () => {
      try {
        if (!isSocketConnected()) {
          await initSocket();
        }

        const socket = getSocket();
        socket.on('notification', fetchNotifications);

        return () => {
          socket?.off('notification');
        };
      } catch (error) {
        console.log('Socket setup failed, using polling instead:', error.message);
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
      }
    };

    fetchNotifications();
    setupSocket();
  }, [token]);

  return {
    notifications,
    loading,
    error,
    hasUnread,
    refresh: fetchNotifications,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
  };
};

export default useNotifications;