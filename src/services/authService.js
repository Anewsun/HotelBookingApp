import axios from 'axios';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.2.2:5000/api/auth';

export const getMe = async () => {
    const token = await AsyncStorage.getItem('token');
    console.log("📌 Token hiện tại:", token);

    if (!token) return null;

    try {
        const response = await axios.get(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("✅ getMe() thành công:", response.data);
        return response.data.data;
    } catch (error) {
        console.log("❌ Lỗi từ API /me:", error.response?.data || error);
        return null;
    }
};

export const register = async (name, email, password) => {
    try {
        console.log("📤 Sending request to:", `${API_URL}/register`);
        console.log("📦 Data:", { name, email, password });

        const response = await axios.post(`${API_URL}/register`, { name, email, password });

        console.log("✅ Response:", response.data);
        return response.data;
    } catch (error) {
        console.log("❌ Error Response:", error.response?.data || error);

        if (error.response && error.response.status === 400) {
            throw new Error(error.response.data.message || "Lỗi từ máy chủ!");
        }

        throw new Error("Đăng ký thất bại, thử lại sau!");
    }
};

export const logout = async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            console.log("🚫 Không có token để đăng xuất");
            return { success: false, message: "Bạn chưa đăng nhập" };
        }

        const response = await axios.get(`${API_URL}/logout`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data;
    } catch (error) {
        console.log("❌ Lỗi API logout:", error.response?.data || error);
        return error.response?.data || { success: false, message: "Lỗi đăng xuất" };
    }
};

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        console.log("🔥 Dữ liệu API trả về:", response.data); // Debug API response
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Lỗi kết nối máy chủ";
    }
};

export const loginWithGoogle = async () => {
    try {
        const authUrl = `${API_URL}/google`;
        Linking.openURL(authUrl);
    } catch (error) {
        console.log("🔴 Lỗi Google Login:", error);
        throw "Đăng nhập Google thất bại";
    }
};

export const loginWithFacebook = async () => {
    try {
        const response = await axios.get(`${API_URL}/facebook`);
        return response.data;
    } catch (error) {
        throw error.response?.data || "Đăng nhập Facebook thất bại";
    }
};

export const sendOTP = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/password/forgot`, { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || "Lỗi khi gửi email đặt lại mật khẩu";
    }
};

export const verifyOTP = async (email, otp) => {
    try {
        const response = await axios.post(`${API_URL}/password/verify-otp`, { email, otp });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Lỗi xác thực OTP";
    }
};

export const resetPassword = async (email, otp, newPassword) => {
    try {
        const response = await axios.post(`${API_URL}/password/reset`, { email, otp, password: newPassword });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Lỗi đặt lại mật khẩu";
    }
};
