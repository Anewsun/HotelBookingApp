import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';

const contactItems = [
    { icon: 'headset-mic', title: 'Chăm sóc khách hàng', content: 'Luôn hiện diện 24/7' },
    { icon: 'phone-android', title: 'WhatsApp', content: 'BookingITApp' },
    { icon: 'language', title: 'Website', content: 'www.bookingit.com' },
    { icon: 'facebook', title: 'Facebook', content: 'facebook.com/abc' },
    { icon: 'history', title: 'Twitter', content: 'twitter.com/abc' },
    { icon: 'camera-alt', title: 'Instagram', content: 'instagram.com/abc' },
];

const ContactUsScreen = () => {
    const [expandedItem, setExpandedItem] = useState(null);
    const navigation = useNavigation();

    const toggleItem = (title) => {
        setExpandedItem(expandedItem === title ? null : title);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Thông tin về chúng tôi" onBackPress={() => navigation.goBack()} showBackIcon={true}/>

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
                        {expandedItem === item.title && (
                            <Text style={styles.itemContent}>{item.content}</Text>
                        )}
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
});

export default ContactUsScreen;
