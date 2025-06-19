import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';

const contactItems = [
    { icon: 'headset-mic', title: 'Chăm sóc khách hàng', content: 'Luôn hiện diện 24/7' },
    { icon: 'phone-android', title: 'WhatsApp', content: 'BookingITApp' },
    { icon: 'language', title: 'Website', content: 'https://hotel-management-frontend-swart.vercel.app/' },
    { icon: 'facebook', title: 'Facebook', content: 'facebook.com/abc' },
    { icon: 'camera-alt', title: 'Instagram', content: 'instagram.com/abc' },
];

const ContactUsScreen = () => {
    const [expandedItem, setExpandedItem] = useState(null);
    const navigation = useNavigation();

    const toggleItem = (title) => {
        setExpandedItem(expandedItem === title ? null : title);
    };

    const handleLinkPress = (url) => {
        Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
    };

    const renderContent = (content, title) => {
        if (title === 'Website') {
            return (
                <Text
                    style={[styles.itemContent, styles.linkText]}
                    onPress={() => handleLinkPress(content)}
                >
                    {content}
                </Text>
            );
        }
        return <Text style={styles.itemContent}>{content}</Text>;
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Thông tin về chúng tôi" onBackPress={() => navigation.goBack()} showBackIcon={true} />

            <ScrollView>
                {contactItems.map((item) => (
                    <TouchableOpacity
                        key={item.title}
                        style={styles.itemContainer}
                        onPress={() => toggleItem(item.title)}
                    >
                        <View style={styles.itemHeader}>
                            <Icon name={item.icon} size={24} color="blue" />
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <Icon
                                name={expandedItem === item.title ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                                size={24}
                                color="#000"
                            />
                        </View>
                        {expandedItem === item.title && renderContent(item.content, item.title)}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 15
    },
    itemContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    itemTitle: {
        flex: 1,
        fontSize: 26,
        fontWeight: 'bold',
        marginLeft: 16,
        color: 'black'
    },
    itemContent: {
        padding: 16,
        paddingTop: 0,
        paddingLeft: 56,
        fontSize: 26,
        color: 'black'
    },
    linkText: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
});

export default ContactUsScreen;
