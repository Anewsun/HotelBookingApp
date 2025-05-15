import axios from 'axios';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cookies } from '@react-native-cookies/cookies';

const API_URL = 'http://10.0.2.2:5000/api/auth';

export const refreshToken = async () => {
    try {
        // Lấy cookie hiện tại (ví dụ backend set cookie tên là 'refreshToken')
        const cookies = await Cookies.get('http://10.0.2.2:5000');
        // Tạo header Cookie dạng: "refreshToken=abc123; otherCookie=xyz"
        const cookieHeader = Object.entries(cookies)
            .map(([key, c]) => `${key}=${c.value}`)
            .join('; ');

        const response = await axios.post(`${API_URL}/refresh-token`, null, {
            headers: {
                Cookie: cookieHeader,
            },
            // Nếu backend cần withCredentials, bạn có thể thêm (không chắc React Native hỗ trợ 100%)
            // withCredentials: true,
        });

        const { accessToken } = response.data;
        await AsyncStorage.setItem('token', accessToken);
        return accessToken;
    } catch (error) {
        console.log("🔴 Refresh token thất bại:", error.response?.data || error);
        throw new Error("Không thể làm mới token");
    }
};

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
        const err = new Error(error.response?.data?.message || 'Failed to fetch user data');
        err.status = error.response?.status;
        throw err;
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
        console.log("🔥 Dữ liệu API trả về:", response.data);
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

axios.interceptors.response.use(
    res => res,
    async error => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/login')
        ) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshToken();
                axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axios(originalRequest);
            } catch (refreshError) {
                console.log("⚠️ Refresh token không thành công");
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('user');
            }
        }

        return Promise.reject(error);
    }
);
