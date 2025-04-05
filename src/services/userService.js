import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.2.2:5000/api/users';

export const uploadAvatar = async (file) => {
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();
    formData.append('avatar', {
        uri: file.uri,
        type: file.type,
        name: file.fileName || `avatar_${Date.now()}.jpg`,
    });

    try {
        const response = await axios.patch(`${API_URL}/me/avatar`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log("✅ Upload avatar thành công:", response.data);
        return response.data.data.avatar[0]; // trả về avatar mới
    } catch (error) {
        console.log("❌ Upload avatar thất bại:", error.response?.data || error);
        throw error.response?.data?.message || "Lỗi upload avatar";
    }
};