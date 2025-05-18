import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Modal } from 'react-native';
import { Stepper } from '../components/Stepper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';

const PaymentScreen = ({ navigation, route }) => {
  const [selectedMethod, setSelectedMethod] = useState('creditCard');
  const [showVouchers, setShowVouchers] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

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
      name: '10% Discount',
      discount: '10%',
      expiry: 'Expired in 18 Sep 2024'
    },
    {
      id: 'voucher2',
      name: '20% Discount',
      discount: '20%',
      expiry: 'Expired in 24 Sep 2024'
    },
    {
      id: 'voucher3',
      name: '15% Cashback',
      discount: '15%',
      expiry: 'Expired in 30 Sep 2024'
    },
    {
      id: 'voucher4',
      name: '$5 Discount',
      discount: '$5',
      expiry: 'Expired in 2 Oct 2024'
    }
  ];

  const baseAmount = 256;
  const tax = 2.56;
  const discount = selectedVoucher?.discount === '20%' ? baseAmount * 0.2 : 0;
  const total = baseAmount + tax - discount;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Đặt phòng và thanh toán" onBackPress={() => navigation.goBack()} showBackIcon={true} />
      <Stepper steps={['Đặt phòng', 'Thông tin', 'Xác nhận']} currentStep={3} />

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.hotelInfo}>
          <Text style={styles.hotelName}>Hyatt Regency Bali</Text>
          <Text style={styles.hotelLocation}>Denpasar, Bali</Text>
          <Text style={styles.roomType}>Suite King Bed</Text>
          <Text style={styles.price}>$64/night</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Check in</Text>
          <Text style={styles.infoValue}>Mon, 16 Sep | 14:00</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Check out</Text>
          <Text style={styles.infoValue}>Thu, 18 Sep | 12:00</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Guests and Rooms</Text>
          <Text style={styles.infoValue}>2 Rooms | 4 Guests</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Guest Info</Text>
          <Text style={styles.infoValue}>Hasna Aziya</Text>
        </View>

        <Text style={styles.sectionTitle}>Payment Method</Text>

        {paymentMethods.map(method => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentMethod,
              selectedMethod === method.id && styles.selectedPaymentMethod
            ]}
            onPress={() => setSelectedMethod(method.id)}
          >
            <Image source={method.image} style={styles.paymentIcon} />
            <Text style={styles.paymentText}>{method.name}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.voucherButton}
          onPress={() => setShowVouchers(true)}
        >
          <Text style={styles.voucherButtonText}>🔄 {selectedVoucher ? selectedVoucher.name : 'Select Voucher'}</Text>
        </TouchableOpacity>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Amount:</Text>
            <Text style={styles.summaryValue}>${baseAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax:</Text>
            <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
          </View>
          {selectedVoucher && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount {selectedVoucher.discount}:</Text>
              <Text style={[styles.summaryValue, styles.discountValue]}>-${discount.toFixed(2)}</Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => navigation.navigate('Confirm')}
      >
        <Text style={styles.confirmText}>Book Now</Text>
      </TouchableOpacity>

      {/* Voucher Modal */}
      <Modal
        visible={showVouchers}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVouchers(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Available Vouchers</Text>
            {vouchers.map(voucher => (
              <TouchableOpacity
                key={voucher.id}
                style={[
                  styles.voucherItem,
                  selectedVoucher?.id === voucher.id && styles.selectedVoucherItem
                ]}
                onPress={() => {
                  setSelectedVoucher(voucher);
                  setShowVouchers(false);
                }}
              >
                <Text style={styles.voucherName}>{voucher.name}</Text>
                <Text style={styles.voucherExpiry}>{voucher.expiry}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowVouchers(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
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
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  hotelInfo: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  hotelLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  roomType: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    color: '#1167B1',
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#333',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedPaymentMethod: {
    borderColor: '#1167B1',
    backgroundColor: '#f0f8ff',
  },
  paymentIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  paymentText: {
    fontSize: 16,
  },
  voucherButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginVertical: 16,
  },
  voucherButtonText: {
    fontSize: 16,
  },
  summaryContainer: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
  },
  discountValue: {
    color: '#4CAF50',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1167B1',
  },
  confirmButton: {
    backgroundColor: '#1167B1',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  confirmText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  voucherItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedVoucherItem: {
    borderColor: '#1167B1',
    backgroundColor: '#f0f8ff',
  },
  voucherName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  voucherExpiry: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#1167B1',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;