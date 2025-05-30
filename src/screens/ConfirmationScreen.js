import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBooking } from '../contexts/BookingContext';
import { useNavigation } from '@react-navigation/native';

const ConfirmationScreen = ({ route }) => {
  const { transactionId, bookingId } = route.params;
  const { checkPaymentStatus, sendFakeZaloCallback, getDetails } = useBooking();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    let isMounted = true;
    let intervalId = null;

    const verifyAndSendCallback = async () => {
      try {
        const result = await checkPaymentStatus(transactionId);
        console.log('Payment verification result:', result);

        if (result.return_code === 1 && isMounted) {
          clearInterval(intervalId);

          try {
            const bookingDetail = await getDetails(bookingId);

            const callbackData = {
              app_id: 2554,
              app_trans_id: transactionId,
              zp_trans_id: result.zp_trans_id,
              amount: result.amount,
              embed_data: JSON.stringify({ bookingId }),
              item: JSON.stringify([
                {
                  itemid: bookingDetail.room._id,
                  itemname: 'Room Booking',
                  itemprice: result.amount,
                  itemquantity: 1
                }
              ]),
              merchant_user_id: bookingDetail.user,
              user_fee_amount: 0,
              discount_amount: 0,
              timestamp: result.server_time,
              server_time: result.server_time,
              channel: 14,
              description: `Payment for Booking ${bookingId}`,
              bank_code: 'zalopayapp',
              payment_method: 'zalopay',
              status: 1
            };

            const callbackResult = await sendFakeZaloCallback(callbackData);
            console.log('ZaloPay callback sent result:', callbackResult);
          } catch (callbackErr) {
            console.warn('Callback gửi thất bại:', callbackErr.message);
          }

          setStatus('paid');
          setLoading(false);
          return;
        }

        // Retry nếu chưa thành công
        let retryCount = 0;
        const maxRetries = 5;
        const retryInterval = 3000;

        intervalId = setInterval(async () => {
          if (!isMounted) return;

          if (retryCount >= maxRetries) {
            clearInterval(intervalId);
            if (isMounted) {
              setStatus('failed');
              setError('Không thể xác nhận thanh toán sau nhiều lần thử');
              setLoading(false);
            }
            return;
          }

          try {
            const retryResult = await checkPaymentStatus(transactionId);
            console.log(`Retry ${retryCount + 1} result:`, retryResult);

            if (retryResult.return_code === 1 && isMounted) {
              clearInterval(intervalId);

              try {
                const bookingDetail = await getDetails(bookingId);

                const callbackData = {
                  app_id: 2554,
                  app_trans_id: transactionId,
                  zp_trans_id: retryResult.zp_trans_id,
                  amount: retryResult.amount,
                  embed_data: JSON.stringify({ bookingId }),
                  item: JSON.stringify([
                    {
                      itemid: bookingDetail.room._id,
                      itemname: 'Room Booking',
                      itemprice: retryResult.amount,
                      itemquantity: 1
                    }
                  ]),
                  merchant_user_id: bookingDetail.user,
                  user_fee_amount: 0,
                  discount_amount: 0,
                  timestamp: retryResult.server_time,
                  server_time: retryResult.server_time,
                  channel: 14,
                  description: `Payment for Booking ${bookingId}`,
                  bank_code: 'zalopayapp',
                  payment_method: 'zalopay',
                  status: 1
                };

                const callbackResult = await sendFakeZaloCallback(callbackData);
                console.log('ZaloPay callback sent result:', callbackResult);
              } catch (callbackErr) {
                console.warn('Callback gửi thất bại:', callbackErr.message);
              }

              setStatus('paid');
              setLoading(false);
            }
          } catch (err) {
            console.error('Retry error:', err);
          }

          retryCount++;
        }, retryInterval);

      } catch (err) {
        console.error('Verification error:', err);
        if (isMounted) {
          setStatus('failed');
          setError(err.message || 'Lỗi xác nhận thanh toán');
          setLoading(false);
        }
      }
    };

    verifyAndSendCallback();

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [transactionId, bookingId]);

  const handleViewBooking = () => {
    navigation.navigate('BookingDetail', { bookingId });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#003366" />
          <Text style={styles.loadingText}>Đang xác nhận thanh toán...</Text>
          <Text style={styles.retryInfo}>Vui lòng chờ trong giây lát</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'paid') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Text style={styles.successIcon}>✓</Text>
          </View>
          <Text style={styles.title}>Thanh toán thành công</Text>
          <Text style={styles.subtitle}>
            Đặt phòng của bạn đã được xác nhận. Thông tin chi tiết sẽ được gửi đến email của bạn.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.secondaryButtonText}>Về trang chủ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.navigate('BookingDetail', { bookingId })}
          >
            <Text style={styles.primaryButtonText}>Xem chi tiết đặt phòng</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: '#F44336' }]}>
          <Text style={styles.errorIcon}>✕</Text>
        </View>
        <Text style={styles.title}>Thanh toán chưa hoàn tất</Text>
        <Text style={styles.subtitle}>
          {error || 'Vui lòng kiểm tra lại trong mục Đơn đặt phòng của bạn'}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.secondaryButtonText}>Về trang chủ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleViewBooking}
        >
          <Text style={styles.primaryButtonText}>Xem đơn đặt phòng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successIcon: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  errorIcon: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 12,
  },
  primaryButton: {
    backgroundColor: '#1167B1',
    marginLeft: 12,
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#003366',
  },
  retryInfo: {
    marginTop: 10,
    color: '#666',
  }
});

export default ConfirmationScreen;