import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../contexts/AuthContext';

const ReviewFormModal = ({ visible, hotelId, onClose, onSubmit, initialData }) => {
    const [rating, setRating] = useState(initialData?.rating || 0);
    const [title, setTitle] = useState(initialData?.title || '');
    const [comment, setComment] = useState(initialData?.comment || '');
    const [isAnonymous, setIsAnonymous] = useState(initialData?.isAnonymous || false);
    const { user } = useAuth();

    const handleSubmit = () => {
        if (!rating || !title || !comment) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
            return;
        }

        onSubmit({
            hotelId,
            rating,
            title,
            comment,
            isAnonymous,
            ...(initialData && { reviewId: initialData._id })
        });
    };

    useEffect(() => {
        if (initialData) {
            setRating(initialData.rating);
            setTitle(initialData.title);
            setComment(initialData.comment);
            setIsAnonymous(initialData.isAnonymous);
        } else {
            // Reset state nếu không có initialData
            setRating(0);
            setTitle('');
            setComment('');
            setIsAnonymous(false);
        }
    }, [initialData]);

    const renderStars = () => (
        <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((i) => (
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                    <Icon
                        name={i <= rating ? 'star' : 'star-o'}
                        size={30}
                        color="#FFD700"
                        style={{ marginHorizontal: 3 }}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>
                        {initialData ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá'}
                    </Text>

                    {renderStars()}

                    <TextInput
                        placeholder="Tiêu đề"
                        value={title}
                        onChangeText={setTitle}
                        style={styles.input}
                        maxLength={100}
                    />

                    <TextInput
                        placeholder="Nội dung đánh giá"
                        value={comment}
                        onChangeText={setComment}
                        style={[styles.input, { height: 100 }]}
                        multiline
                        maxLength={500}
                    />

                    <TouchableOpacity
                        onPress={() => setIsAnonymous(!isAnonymous)}
                        style={styles.anonymousRow}
                    >
                        <Text style={styles.anonymousText}>Ẩn danh: </Text>
                        <View style={[styles.checkbox, isAnonymous && styles.checked]}>
                            {isAnonymous && <Icon name="check" size={14} color="white" />}
                        </View>
                    </TouchableOpacity>

                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>Hủy</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.submitButton]}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.buttonText}>Gửi</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    starsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
    },
    anonymousRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    anonymousText: {
        color: 'black',
        fontSize: 18,
        fontWeight: '400'
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: 'black',
        marginLeft: 10,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checked: {
        backgroundColor: '#1167B1',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        padding: 15,
        borderRadius: 25,
        width: '45%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold'
    },
    cancelButton: {
        backgroundColor: 'gray',
    },
    submitButton: {
        backgroundColor: '#1167B1',
    },
});

export default ReviewFormModal;
