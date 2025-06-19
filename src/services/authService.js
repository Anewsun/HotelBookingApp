import axios from 'axios';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from '@react-native-cookies/cookies';
import { BASE_API_URL } from '../../config';

export const refreshToken = async () => {
    try {
        // Lấy refreshToken từ AsyncStorage (đã lưu khi login)
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (!refreshToken) {
            throw new Error('Không có refresh token');
        }

        // Gửi request kèm refreshToken trong cookies
        const response = await axios.post(
            `${BASE_API_URL}/api/auth/refresh-token`,
            {},
            {
                headers: {
                    Cookie: `refreshToken=${refreshToken}`,
                },
                withCredentials: true
            }
        );

        await AsyncStorage.setItem('token', response.data.accessToken);
        return response.data.accessToken;
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
        const response = await axios.get(`${BASE_API_URL}/api/auth/me`, {
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
        console.log("📤 Sending request to:", `${BASE_API_URL}/api/auth/register`);
        console.log("📦 Data:", { name, email, password });

        const response = await axios.post(`${BASE_API_URL}/api/auth/register`, { name, email, password });

        console.log("✅ Response:", response.data);
        return response.data;
    } catch (error) {
        console.log("❌ Error Response:", error.response?.data || error);

        if (error.response && error.response.status === 400) {
            throw new Error(error.response.data.message);
        }
        throw new Error(error.response.data.message);
    }
};

export const logout = async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return { success: true };

        try {
            await axios.post(`${BASE_API_URL}/api/auth/logout`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (postError) {
            console.log("Logout API call failed (non-critical):", postError);
        }

        return { success: true };
    } catch (error) {
        console.log("Logout error:", error);
        return { success: true };
    }
};

export const login = async (email, password) => {
    const response = await axios.post(`${BASE_API_URL}/api/auth/login`, { email, password });

    // Đọc cookie từ response
    const cookies = await CookieManager.get(BASE_API_URL);
    const refreshToken = cookies.refreshToken?.value;

    if (response.data.user?.status === 'rejected') {
        throw new Error('Tài khoản đã bị vô hiệu hóa');
    }

    if (refreshToken) {
        await AsyncStorage.setItem('refreshToken', refreshToken);
    }
    console.log("🔥 Dữ liệu API trả về:", response.data);
    return response.data;
};

export const loginWithGoogle = async () => {
    try {
        const authUrl = `${BASE_API_URL}/api/auth/google?source=mobile`;
        console.log("📤 Đang mở URL:", authUrl);

        const canOpen = await Linking.canOpenURL(authUrl);
        console.log("📌 Có thể mở URL:", canOpen);

        if (canOpen) {
            await Linking.openURL(authUrl);
            return true;
        }

        console.warn("⚠️ Không thể mở URL:", authUrl);
        return false;
    } catch (error) {
        console.error("Google login error:", error);
        throw new Error("Không thể mở trình duyệt để đăng nhập Google");
    }
};

export const loginWithFacebook = async () => {
    try {
        const authUrl = `${BASE_API_URL}/api/auth/facebook?source=mobile`;
        const canOpen = await Linking.canOpenURL(authUrl);
        if (canOpen) {
            await Linking.openURL(authUrl);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Facebook login error:", error);
        throw new Error("Không thể mở trình duyệt để đăng nhập Facebook");
    }
};

export const handleOAuthRedirect = async (url) => {
    try {
        const parsedUrl = new URL(url);
        if (parsedUrl.pathname.includes('/oauth')) {
            const token = parsedUrl.searchParams.get('token');
            const refreshToken = parsedUrl.searchParams.get('refreshToken');

            if (token && refreshToken) {
                await AsyncStorage.multiSet([
                    ['token', token],
                    ['refreshToken', refreshToken]
                ]);

                const userInfo = await getMe();
                if (userInfo) {
                    return {
                        success: true,
                        user: { ...userInfo, accessToken: token }
                    };
                }
            }
        }
        return { success: false };
    } catch (error) {
        console.error("OAuth redirect error:", error);
        throw error;
    }
};

export const sendOTP = async (email) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/api/auth/password/forgot`, { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || "Lỗi khi gửi email đặt lại mật khẩu";
    }
};

export const verifyOTP = async (email, otp) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/api/auth/password/verify-otp`, { email, otp });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Lỗi xác thực OTP";
    }
};

export const resetPassword = async (email, otp, newPassword) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/api/auth/password/reset`, { email, otp, password: newPassword });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Lỗi đặt lại mật khẩu";
    }
};

axios.interceptors.response.use(
    res => res,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/login')) {
            originalRequest._retry = true;

            try {
                const newToken = await refreshToken();
                axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return axios(originalRequest);
            } catch (refreshError) {
                console.log("⚠️ Refresh token không thành công", refreshError);
                await AsyncStorage.multiRemove(['token', 'refreshToken', 'user']);
                throw new Error('Phiên đăng nhập hết hạn');
            }
        }

        return Promise.reject(error);
    }
);
