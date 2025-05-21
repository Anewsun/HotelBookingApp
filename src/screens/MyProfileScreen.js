import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert, Image, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { updateMe, deactivateAccount } from '../services/userService';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyProfileScreen = () => {
    const navigation = useNavigation();
    const { user, refreshUserData } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });
    const [password, setPassword] = useState('');
    const [reason, setReason] = useState('');
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            loadUserData();
        }, [user])
    );

    const loadUserData = () => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address?.street || '',
            });
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const updatePayload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: { street: formData.address }
            };

            await updateMe(updatePayload);
            await refreshUserData();
            Alert.alert('Thành công', 'Cập nhật thông tin thành công!');
        } catch (error) {
            Alert.alert('Lỗi', error.message);
        }
    };

    const handleDeactivate = async () => {
        try {
            setLoading(true);

            const response = await deactivateAccount(password, reason);
            console.log('Deactivation response:', response);

            if (!response.success) {
                Alert.alert('Lỗi', response.message || 'Vô hiệu hóa thất bại');
                return;
            }

            await AsyncStorage.multiRemove(['token', 'refreshToken']);
            Alert.alert('Thành công', response.message);
            navigation.navigate('SignIn');

        } catch (error) {
            console.log('Full error:', {
                message: error.message,
                response: error.response?.data
            });

            Alert.alert(
                'Lỗi',
                error.response?.data?.message ||
                'Không nhận được phản hồi từ máy chủ'
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Header
                    title="Thông tin cá nhân"
                    onBackPress={() => navigation.goBack()}
                    showBackIcon={true}
                />

                <View style={styles.loadingOverlay}>
                    <ActivityIndicator
                        size="large"
                        color="#1167B1"
                    />
                </View>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <Header
                title="Thông tin cá nhân"
                onBackPress={() => navigation.goBack()}
                showBackIcon={true}
            />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>

                <View style={styles.inputContainer}>
                    <Feather name="user" size={20} color="#1167B1" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        value={formData.name}
                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                        placeholder="Họ và tên"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Feather name="mail" size={20} color="#1167B1" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        value={formData.email}
                        onChangeText={(text) => setFormData({ ...formData, email: text })}
                        placeholder="Email"
                        keyboardType="email-address"
                        editable={false}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Feather name="phone" size={20} color="#1167B1" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        value={formData.phone}
                        onChangeText={(text) => setFormData({ ...formData, phone: text })}
                        placeholder="Số điện thoại"
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Feather name="map-pin" size={20} color="#1167B1" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        value={formData.address}
                        onChangeText={(text) => setFormData({ ...formData, address: text })}
                        placeholder="Địa chỉ"
                    />
                </View>

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleUpdateProfile}
                >
                    <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tùy chọn tài khoản</Text>
                <TouchableOpacity
                    style={styles.deactivateButton}
                    onPress={() => setShowDeactivateModal(true)}
                >
                    <MaterialIcons name="warning" size={20} color="white" style={styles.icon} />
                    <Text style={styles.deactivateText}>Vô hiệu hóa tài khoản</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={showDeactivateModal}
                transparent
                animationType="fade"
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContent}>
                        <MaterialIcons
                            name="warning"
                            size={40}
                            color="#FF5252"
                            style={styles.modalIcon}
                        />
                        <Text style={styles.modalTitle}>Xác nhận vô hiệu hóa tài khoản</Text>
                        <Text style={styles.modalText}>
                            Bạn có chắc muốn vô hiệu hóa tài khoản? Hành động này rất khó để hoàn tác.
                        </Text>

                        <View style={styles.modalInputContainer}>
                            <TextInput
                                style={styles.modalInput}
                                secureTextEntry={!showPassword}
                                placeholder="Nhập mật khẩu để xác nhận"
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Feather
                                    name={showPassword ? "eye" : "eye-off"}
                                    size={20}
                                    color="black"
                                />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.modalInput}
                            placeholder="Lý do (tùy chọn)"
                            value={reason}
                            onChangeText={setReason}
                            multiline
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => {
                                    setShowDeactivateModal(false);
                                    setPassword('');
                                    setReason('');
                                }}
                            >
                                <Text style={styles.cancelText}>Hủy</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                title={loading ? "Đang xử lý..." : "Vô hiệu hóa tài khoản"}
                                style={styles.confirmButton}
                                onPress={handleDeactivate}
                                disabled={loading}
                            >
                                <Text style={styles.confirmText}>Xác nhận vô hiệu hóa</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4ff',
        paddingTop: 15
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        margin: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: 48,
        paddingHorizontal: 12,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#1167B1',
        borderRadius: 8,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        flexDirection: 'row',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    deactivateButton: {
        backgroundColor: '#FF5252',
        borderRadius: 8,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    deactivateText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    modalInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        paddingBottom: 15
    },
    modalBackdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        width: '90%',
        alignItems: 'center',
    },
    modalIcon: {
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    modalInput: {
        width: '100%',
        height: 48,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 16,
        marginBottom: 16,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 16,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    cancelText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButton: {
        flex: 1,
        backgroundColor: '#FF5252',
        borderRadius: 8,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
});

export default MyProfileScreen;