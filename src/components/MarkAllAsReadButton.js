import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MarkAllAsReadButton = ({ onPress }) => (
    <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
    >
        <View style={styles.button}>
            <Icon name="done-all" size={24} color="blue" />
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        position: 'static',
        right: 16,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
});

export default MarkAllAsReadButton;