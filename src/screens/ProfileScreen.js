import React, { useState, useEffect } from 'react';
import { View, Text, Image, StatusBar, StyleSheet, TouchableOpacity, FlatList, Modal, Alert, ActivityIndicator } from 'react-native';
import Header from '../components/Header';
import Feather from 'react-native-vector-icons/Feather';
import BottomNav from '../components/BottomNav';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation, CommonActions } from "@react-navigation/native";
import { logout, getMe } from '../services/authService';
import { uploadAvatar } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageView from "react-native-image-viewing";
import AsyncStorage from '@react-native-async-storage/async-storage';

const menuItems = [
    { title: 'Trang cá nhân của tôi', icon: 'user', screen: 'MyProfile' },
    { title: 'Liên hệ', icon: 'help-circle', screen: 'ContactUs' },
    { title: 'Chính sách bảo mật', icon: 'lock', screen: 'PrivacyPolicy' },
    { title: 'Đăng xuất', icon: 'log-out', action: 'logout' },
];

const ProfileScreen = () => {
    const navigation = useNavigation();
    const { user, refreshUserData, logout: logoutContext } = useAuth();
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleMenuPress = (item) => {
        if (item.action === 'logout') {
            setLogoutModalVisible(true);
        } else if (item.screen) {
            navigation.navigate(item.screen);
        }
    };

    const handleChangeAvatar = async () => {
        const options = {
            mediaType: 'photo',
            quality: 0.8,
            selectionLimit: 1,
            includeBase64: false,
        };

        launchImageLibrary(options, async (response) => {
            if (response.didCancel) return;
            if (response.errorCode || !response.assets) {
                Alert.alert('Thông báo', 'Không thể chọn ảnh');
                return;
            }

            const selectedImage = response.assets[0];
            try {
                setLoading(true);
                await uploadAvatar(selectedImage);
                await refreshUserData();
                Alert.alert("Thành công", "Cập nhật ảnh đại diện thành công!");
            } catch (error) {
                Alert.alert("Lỗi", error.message || "Không thể cập nhật avatar, thử lại sau.");
            } finally {
                setLoading(false);
            }
        });
    };

    const handleLogout = async () => {
        try {
            setLogoutModalVisible(false);
            setLoading(true);

            try {
                await logout();
            } catch (apiError) {
                console.log('API logout error (ignored):', apiError);
            }

            await logoutContext();

        } catch (error) {
            console.log('❌ Unexpected error:', error);
        } finally {
            setLoading(false);
        }
    };

    const getAvatarImages = () => {
        if (user?.avatar?.url) {
            return [{ uri: user.avatar.url }];
        }
        return [require('../assets/images/default-avatar.jpg')];
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress(item)}>
            <View style={styles.menuIconContainer}>
                <Feather name={item.icon} size={24} color={"#1167B1"} />
            </View>
            <Text style={styles.menuText}>{item.title}</Text>
            <Feather name="chevron-right" size={15} color={"#1167B1"} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
            <Header title="Profile" />

            <View style={styles.profileImageContainer}>
                <TouchableOpacity onPress={() => {
                    setCurrentImageIndex(0);
                    setImageViewerVisible(true);
                }}>
                    <Image
                        source={{
                            uri: user?.avatar?.url || require('../assets/images/default-avatar.jpg')
                        }}
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.editIconContainer} onPress={handleChangeAvatar}>
                    <Feather name="edit-2" size={15} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.nameContainer}>
                <Text style={styles.name}>{user?.name || 'User'}</Text>
            </View>

            <FlatList
                data={menuItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.title}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />

            <Modal
                animationType="slide"
                transparent
                visible={logoutModalVisible}
                onRequestClose={() => setLogoutModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Bạn có chắc muốn đăng xuất?</Text>
                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonCancel]}
                                onPress={() => setLogoutModalVisible(false)}
                            >
                                <Text style={styles.textStyleCancel}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonLogout]}
                                onPress={() => {
                                    setLogoutModalVisible(false);
                                    handleLogout();
                                }}
                            >
                                <Text style={styles.textStyleLogout}>Đăng xuất</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <ImageView
                images={getAvatarImages()}
                imageIndex={currentImageIndex}
                visible={imageViewerVisible}
                onRequestClose={() => setImageViewerVisible(false)}
                presentationStyle="overFullScreen"
                backgroundColor="rgba(0,0,0,0.9)"
                swipeToCloseEnabled={true}
                doubleTapToZoomEnabled={true}
            />

            <BottomNav />

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#1167B1" />
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4ff',
    },
    profileImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        height: 80,
        width: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#1167B1',
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: '40%',
        height: 24,
        width: 24,
        backgroundColor: '#1167B1',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginBottom: 10,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
    },
    menuIconContainer: {
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#1167B1',
        marginLeft: 10,
    },
    separator: {
        height: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        width: '48%',
        padding: 12,
        borderRadius: 30,
        alignItems: 'center',
    },
    buttonCancel: {
        backgroundColor: 'gray',
    },
    buttonLogout: {
        backgroundColor: '#1167B1',
    },
    textStyleCancel: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    textStyleLogout: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    loadingText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1167B1',
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 10,
        overflow: 'hidden',
    },
});

export default ProfileScreen;
