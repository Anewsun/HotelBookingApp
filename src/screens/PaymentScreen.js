import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Modal, Alert, ActivityIndicator } from 'react-native';
import { Stepper } from '../components/Stepper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { PaymentMethodCard } from '../components/PaymentMethodCard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useVoucher } from '../hooks/useVoucher';

const PaymentScreen = ({ navigation, route }) => {
  const { bookingData } = route.params;
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showVouchers, setShowVouchers] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const { fetchAvailableVouchers, isLoading, error } = useVoucher();
  const [discount, setDiscount] = useState(0);
  const basePrice = Number(bookingData.room.price) || 0;
  const [total, setTotal] = useState(basePrice);

  const checkInDate = new Date(bookingData.checkIn.date);
  const checkOutDate = new Date(bookingData.checkOut.date);
  const checkInTime = bookingData.checkIn.time;
  const checkOutTime = bookingData.checkOut.time;
  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

  const paymentMethods = [
    {
      id: 'zalopay',
      name: 'ZaloPay',
      icon: 'wallet',
      image: require('../assets/icons/zalopay.png')
    },
    {
      id: 'vnpay',
      name: 'VNPay',
      icon: 'credit-card',
      image: require('../assets/icons/vnpay.png')
    },
  ];

  useEffect(() => {
    const loadVouchers = async () => {
      const vouchers = await fetchAvailableVouchers(basePrice);
      if (vouchers) {
        setAvailableVouchers(vouchers);
      }
    };

    loadVouchers();
  }, [basePrice]);

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount).replace('₫', 'VNĐ');
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      Alert.alert('Lỗi', 'Vui lòng chọn phương thức thanh toán');
      return;
    }

    try {
      const bookingPayload = {
        ...bookingData,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        paymentMethod: selectedMethod,
        voucher: selectedVoucher?._id || null,
        totalAmount: total,
        discountAmount: discount,
        status: 'pending'
      };

      // const response = await createBooking(bookingPayload, user.accessToken);

      navigation.navigate('Confirm');
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Lỗi', error.message || 'Đã xảy ra lỗi khi thanh toán');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Thanh toán" onBackPress={() => navigation.goBack()} showBackIcon={true} />
      <Stepper steps={['Đặt phòng', 'Thông tin', 'Thanh toán']} currentStep={3} />

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.hotelSection}>
          <View style={styles.hotelContainer}>
            <Image
              source={{ uri: bookingData.hotel.images?.[0]?.url || require('../assets/images/hotel1.jpg') }}
              style={styles.hotelImage}
              resizeMode="cover"
            />
            <View style={styles.hotelInfo}>
              <Text style={styles.hotelName}>{bookingData.hotel.name}</Text>

              <View style={styles.infoRow}>
                <Icon name="location-on" size={16} color="#666" />
                <Text style={styles.hotelLocation}>{bookingData.hotel.address}</Text>
              </View>

              <View style={styles.infoRow}>
                <Icon name="meeting-room" size={16} color="#666" />
                <Text style={styles.roomType}>Tên phòng: {bookingData.room.name}</Text>
              </View>

              <View style={styles.infoRow}>
                <Icon name="king-bed" size={16} color="#666" />
                <Text style={styles.roomType}>Loại phòng: {bookingData.room.roomType}</Text>
              </View>

              <View style={styles.infoRow}>
                <Icon name="king-bed" size={16} color="#666" />
                <Text style={styles.price}>Giá: {formatCurrency(bookingData.room.price)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.dateContainer}>
            <View style={styles.dateBoxLeft}>
              <Text style={styles.dateLabel}>Nhận phòng</Text>
              <Text style={styles.dateValue}>{formatDate(checkInDate)}</Text>
              <Text style={styles.timeValue}>{checkInTime}</Text>
            </View>

            <View style={styles.nightContainer}>
              <Icon name="wb-sunny" size={24} color="#FFA500" />
              <Text style={styles.nightText}>{nights} ngày</Text>
            </View>

            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>Trả phòng</Text>
              <Text style={styles.dateValue}>{formatDate(checkOutDate)}</Text>
              <Text style={styles.timeValue}>{checkOutTime}</Text>
            </View>
          </View>
        </View>

        <View style={styles.guestInfoContainer}>
          <View style={styles.infoHeader}>
            <Icon name="person" size={20} color="#1167B1" />
            <Text style={styles.sectionTitle}>
              {bookingData.guestInfo ? 'Thông tin khách hàng' : 'Thông tin người đặt'}
            </Text>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Icon name="badge" size={18} color="#666" />
              <Text style={styles.infoLabel}>Tên người đặt:</Text>
              <Text style={styles.infoValue}>
                {bookingData.guestInfo ? bookingData.guestInfo.name : bookingData.userInfo.name}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="email" size={18} color="#666" />
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>
                {bookingData.guestInfo ? bookingData.guestInfo.email : bookingData.userInfo.email}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="phone" size={18} color="#666" />
              <Text style={styles.infoLabel}>Số điện thoại:</Text>
              <Text style={styles.infoValue}>
                {bookingData.guestInfo ? bookingData.guestInfo.phone : bookingData.userInfo.phone}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Icon name="info" size={18} color="#666" style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Yêu cầu đặc biệt</Text>
              {bookingData.specialRequests.earlyCheckIn && (
                <Text style={styles.infoValue}>• Check-in sớm</Text>
              )}
              {bookingData.specialRequests.lateCheckOut && (
                <Text style={styles.infoValue}>• Check-out muộn</Text>
              )}
              {bookingData.specialRequests.additionalRequests && (
                <Text style={styles.infoValue}>• {bookingData.specialRequests.additionalRequests}</Text>
              )}
              {!bookingData.specialRequests.earlyCheckIn &&
                !bookingData.specialRequests.lateCheckOut &&
                !bookingData.specialRequests.additionalRequests && (
                  <Text style={styles.infoValue}>Không có yêu cầu đặc biệt</Text>
                )}
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
        {paymentMethods.map(method => (
          <PaymentMethodCard
            key={method.id}
            method={method}
            selected={selectedMethod === method.id}
            onSelect={() => setSelectedMethod(method.id)}
          />
        ))}

        <TouchableOpacity
          style={styles.voucherButton}
          onPress={() => setShowVouchers(true)}
        >
          <Icon name="local-offer" size={24} color="#1167B1" />
          <Text style={styles.voucherButtonText}>
            {selectedVoucher ? selectedVoucher.name : 'Chọn voucher'}
          </Text>
        </TouchableOpacity>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tổng tiền:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(basePrice)}</Text>
          </View>

          {selectedVoucher && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Giảm giá:</Text>
              <Text style={[styles.summaryValue, styles.discountValue]}>
                -{formatCurrency(discount)}
              </Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Thành tiền:</Text>
            <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.confirmButton, !selectedMethod && styles.disabledButton]}
        onPress={handlePayment}
        disabled={!selectedMethod}
      >
        <Text style={styles.confirmText}>Thanh toán</Text>
      </TouchableOpacity>

      <Modal visible={showVouchers} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Voucher khả dụng</Text>

            {isLoading ? (
              <ActivityIndicator size="large" color="#1167B1" />
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              availableVouchers.map(voucher => (
                <TouchableOpacity
                  key={voucher._id}
                  style={[
                    styles.voucherItem,
                    selectedVoucher?._id === voucher._id && styles.selectedVoucher
                  ]}
                  onPress={async () => {
                    try {
                      const validationResult = await validateVoucherCode(voucher._id, basePrice);

                      if (validationResult && validationResult.success) {
                        setSelectedVoucher(voucher);
                        setDiscount(validationResult.discountAmount);
                        setTotal(basePrice - validationResult.discountAmount);
                        setShowVouchers(false);
                      } else {
                        Alert.alert('Lỗi', validationResult?.message || 'Voucher không hợp lệ');
                      }
                    } catch (error) {
                      console.error('Error validating voucher:', error);
                      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi kiểm tra voucher');
                    }
                  }}
                >
                  <Icon
                    name={voucher.discountType === 'percentage' ? 'local-offer' : 'confirmation-number'}
                    size={24}
                    color="#1167B1"
                  />
                  <View style={styles.voucherInfo}>
                    <Text style={styles.voucherName}>{voucher.code}</Text>
                    <Text style={styles.voucherDetails}>
                      {voucher.discountType === 'percentage'
                        ? `Giảm ${formatCurrency(voucher.discount)}% (Tối đa ${formatCurrency(voucher.maxDiscount)})`
                        : `Giảm ${formatCurrency(voucher.discount)}`}
                    </Text>
                    <Text style={styles.voucherCondition}>
                      Áp dụng cho hóa đơn từ {formatCurrency(voucher.minOrderValue)}
                    </Text>
                    <Text style={styles.voucherExpiry}>
                      HSD: {new Date(voucher.expiryDate).toLocaleDateString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowVouchers(false)}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 16,
  },
  hotelSection: {
    marginVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 16,
  },
  hotelContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  hotelImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  hotelInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  hotelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  roomType: {
    fontSize: 17,
    color: 'black',
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    color: '#1167B1',
    marginTop: 4,
  },
  hotelLocation: {
    fontSize: 16,
    color: 'black',
    marginTop: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  dateBox: {
    width: '40%',
    alignItems: 'flex-end',
  },
  dateBoxLeft: {
    width: '40%',
    alignItems: 'flex-start',
  },
  dateLabel: {
    fontSize: 17,
    color: '#666',
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  timeValue: {
    fontSize: 16,
    color: '#666',
  },
  nightContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  nightText: {
    fontSize: 16,
    color: 'black',
    marginTop: 4,
  },
  guestInfoContainer: {
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 8,
  },
  infoSection: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    minWidth: 50,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoIcon: {
    marginTop: 3,
    color: '#666'
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1167B1',
  },
  voucherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    backgroundColor: 'white',
    marginVertical: 16,
    gap: 10,
  },
  voucherButtonText: {
    fontSize: 16,
    color: '#333',
  },
  summaryContainer: {
    borderTopWidth: 1,
    borderTopColor: 'black',
    paddingTop: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 18,
    color: '#666',
  },
  summaryValue: {
    fontSize: 18,
    color: 'black',
  },
  discountValue: {
    color: 'red',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'black',
  },
  totalLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1167B1',
  },
  confirmButton: {
    backgroundColor: '#1167B1',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  confirmText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    padding: 5,
    color: 'black',
    fontWeight: 'bold'
  },
  voucherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  selectedVoucher: {
    borderColor: '#1167B1',
    backgroundColor: '#F0F8FF',
  },
  voucherInfo: {
    flex: 1,
  },
  voucherName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  voucherDetails: {
    fontSize: 14,
    color: '#666',
  },
  voucherCondition: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  closeButton: {
    backgroundColor: '#1167B1',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 16,
  },
  voucherExpiry: {
    fontSize: 12,
    color: '#FF0000',
    marginTop: 4,
  },
});

export default PaymentScreen;