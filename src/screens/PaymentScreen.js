import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Modal } from 'react-native';
import { Stepper } from '../components/Stepper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { PaymentMethodCard } from '../components/PaymentMethodCard';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PaymentScreen = ({ navigation, route }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showVouchers, setShowVouchers] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const checkInDate = new Date('2024-09-16');
  const checkOutDate = new Date('2024-09-18');
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

  const vouchers = [
    {
      id: 'voucher1',
      name: 'GIAM10%',
      type: 'percentage',
      value: 10,
      minAmount: 100,
      maxDiscount: 50,
      icon: 'local-offer'
    },
    {
      id: 'voucher2',
      name: 'GIAM20%',
      type: 'percentage',
      value: 20,
      minAmount: 200,
      maxDiscount: 200,
      icon: 'local-offer'
    },
    {
      id: 'voucher3',
      name: 'GIAM50K',
      type: 'fixed',
      value: 50,
      minAmount: 300,
      icon: 'confirmation-number'
    }
  ];

  const basePrice = 256;
  const discount = selectedVoucher?.type === 'percentage'
    ? Math.min(basePrice * selectedVoucher.value / 100, selectedVoucher.maxDiscount || Infinity)
    : selectedVoucher?.value || 0;

  const total = basePrice - discount;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Thanh toán" onBackPress={() => navigation.goBack()} showBackIcon={true} />
      <Stepper steps={['Đặt phòng', 'Thông tin', 'Thanh toán']} currentStep={3} />

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.hotelSection}>
          <View style={styles.hotelContainer}>
            <Image
              source={require('../assets/images/hotel1.jpg')}
              style={styles.hotelImage}
              resizeMode="cover"
            />
            <View style={styles.hotelInfo}>
              <Text style={styles.hotelName}>Khách sạn KingDom</Text>

              <View style={styles.infoRow}>
                <Icon name="location-on" size={16} color="#666" />
                <Text style={styles.hotelLocation}>97 Lê Lợi, Đà Nẵng</Text>
              </View>

              <View style={styles.infoRow}>
                <Icon name="meeting-room" size={16} color="#666" />
                <Text style={styles.roomType}>Phòng: Family Alibaba</Text>
              </View>

              <View style={styles.infoRow}>
                <Icon name="king-bed" size={16} color="#666" />
                <Text style={styles.roomType}>Loại phòng: Suite</Text>
              </View>

              <View style={styles.infoRow}>
                <Icon name="attach-money" size={16} color="#1167B1" />
                <Text style={styles.price}>64 VNĐ/ngày</Text>
              </View>
            </View>
          </View>

          <View style={styles.dateContainer}>
            <View style={styles.dateBoxLeft}>
              <Text style={styles.dateLabel}>Nhận phòng</Text>
              <Text style={styles.dateValue}>16/09/2024</Text>
              <Text style={styles.timeValue}>14:00</Text>
            </View>

            <View style={styles.nightContainer}>
              <Icon name="wb-sunny" size={24} color="#FFA500" />
              <Text style={styles.nightText}>{nights} ngày</Text>
            </View>

            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>Trả phòng</Text>
              <Text style={styles.dateValue}>18/09/2024</Text>
              <Text style={styles.timeValue}>12:00</Text>
            </View>
          </View>
        </View>

        <View style={styles.guestInfoContainer}>
          <View style={styles.infoHeader}>
            <Icon name="person" size={20} color="#1167B1" />
            <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
          </View>

          <View style={styles.infoItem}>
            <Icon name="badge" size={18} color="#666" style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Tên người đặt</Text>
              <Text style={styles.infoValue}>Nhật Tân</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Icon name="info" size={18} color="#666" style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Yêu cầu đặc biệt (nếu có)</Text>
              <Text style={styles.infoValue}>Đến sớm hơn dự định 1 tiếng</Text>
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
            <Text style={styles.summaryValue}>{basePrice} VNĐ</Text>
          </View>

          {selectedVoucher && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Giảm giá:</Text>
              <Text style={[styles.summaryValue, styles.discountValue]}>
                -{discount} VNĐ
              </Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Thành tiền:</Text>
            <Text style={styles.totalValue}>{total} VNĐ</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.confirmButton, !selectedMethod && styles.disabledButton]}
        onPress={() => navigation.navigate('Confirm')}
        disabled={!selectedMethod}
      >
        <Text style={styles.confirmText}>Thanh toán</Text>
      </TouchableOpacity>

      <Modal visible={showVouchers} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Voucher khả dụng</Text>

            {vouchers.map(voucher => (
              <TouchableOpacity
                key={voucher.id}
                style={[
                  styles.voucherItem,
                  selectedVoucher?.id === voucher.id && styles.selectedVoucher
                ]}
                onPress={() => {
                  setSelectedVoucher(voucher);
                  setShowVouchers(false);
                }}
              >
                <Icon name={voucher.icon} size={24} color="#1167B1" />
                <View style={styles.voucherInfo}>
                  <Text style={styles.voucherName}>{voucher.name}</Text>
                  <Text style={styles.voucherDetails}>
                    {voucher.type === 'percentage'
                      ? `Giảm ${voucher.value}% (Tối đa ${voucher.maxDiscount} VNĐ)`
                      : `Giảm ${voucher.value} VNĐ`}
                  </Text>
                  <Text style={styles.voucherCondition}>
                    Áp dụng cho hóa đơn từ {voucher.minAmount} VNĐ
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

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
    padding: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'black',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1167B1',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  infoIcon: {
    marginTop: 2,
    color: 'black'
  },
  infoLabel: {
    fontSize: 16,
    color: 'black',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: 'black',
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
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
});

export default PaymentScreen;