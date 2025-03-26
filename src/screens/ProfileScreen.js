import React, { useState } from 'react';
import { View, Text, Image, StatusBar, StyleSheet, TouchableOpacity, FlatList, Modal, Alert, SafeAreaView } from 'react-native';
import Header from '../components/Header';
import Feather from 'react-native-vector-icons/Feather';
import BottomNav from '../components/BottomNav';

const menuItems = [
    { title: 'My profile', icon: 'user' },
    { title: 'Lịch sử đơn hàng', icon: 'shopping-bag' },
    { title: 'Cài đặt', icon: 'settings' },
    { title: 'Liên hệ', icon: 'help-circle' },
    { title: 'Chính sách bảo mật', icon: 'lock' },
    { title: 'Đăng xuất', icon: 'log-out' },
];

const ProfileScreen = ({ navigation }) => {
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [userName, setUserName] = useState('User');  // Hardcoded user name
    const [userImageUrl, setUserImageUrl] = useState('https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/03/avatar-trang-68.jpg');  // Default image URL

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
                if (item.title === 'Cài đặt') {
                    navigation.navigate('Setting');
                } else if (item.title === 'Privacy Policy') {
                    navigation.navigate('Chính sách bảo mật');
                } else if (item.title === 'Liên hệ') {
                    navigation.navigate('ContactUs');
                } else if (item.title === 'Đăng xuất') {
                    setLogoutModalVisible(true);
                } else if (item.title === 'Lịch sử đơn hàng') {
                    navigation.navigate('MyOrders');
                } else if (item.title === 'My profile') {
                    navigation.navigate('MyProfile');
                }
            }}
        >
            <View style={styles.menuIconContainer}>
                <Feather name={item.icon} size={24} color={'black'} />
            </View>
            <Text style={styles.menuText}>{item.title}</Text>
            <Feather name="chevron-right" size={15} color={'black'} />
        </TouchableOpacity>
    );

    const handleLogout = () => {
        Alert.alert('Đăng xuất', 'Bạn đã đăng xuất thành công');
        navigation.navigate('SignIn');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={'white'} />
            <Header title="Profile" />

            <View style={styles.profileImageContainer}>
                <Image
                    source={{ uri: userImageUrl }}
                    style={styles.profileImage}
                />
                <TouchableOpacity style={styles.editIconContainer}>
                    <Feather name={"edit-2"} size={15} color={'white'} />
                </TouchableOpacity>
            </View>

            <View style={styles.nameContainer}>
                <Text style={styles.name}>{userName}</Text>
            </View>

            <FlatList
                data={menuItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.title}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={logoutModalVisible}
                onRequestClose={() => setLogoutModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Bạn có chắc muốn đăng xuất không?</Text>
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
            <BottomNav />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    profileImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'auto',
    },
    profileImage: {
        height: 80,
        width: 80,
        borderRadius: 40,
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
        marginVertical: 'auto',
    },
    name: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold'
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 'auto',
        paddingHorizontal: 'auto',
    },
    menuIconContainer: {
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuText: {
        flex: 1,
        fontSize: 14,
        color: 'black',
        fontWeight: 'bold'
    },
    separator: {
        height: 1,
        backgroundColor: 'lightgray',
    },
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '100%',
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        color: 'black',
        fontWeight: 'bold',
        textAlign: "center",
        fontSize: 18
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        borderRadius: 20,
        padding: 10,
        width: '48%',
    },
    buttonCancel: {
        backgroundColor: 'gray',
        borderWidth: 1,
        borderColor: 'gray',
    },
    buttonLogout: {
        backgroundColor: '#1167B1',
    },
    textStyleCancel: {
        color: 'white',
        fontWeight: "bold",
        textAlign: "center",
    },
    textStyleLogout: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default ProfileScreen;
