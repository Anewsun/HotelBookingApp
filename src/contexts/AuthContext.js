import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMe } from '../services/authService';

export const AuthContext = createContext();

// Custom hook để sử dụng context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Kiểm tra phiên đăng nhập mỗi khi ứng dụng khởi động
    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const storedUser = await AsyncStorage.getItem('user');

                if (token && storedUser) {
                    // Set user từ local storage trước để UI có thể render ngay
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    setIsAuthenticated(true);

                    // Sau đó verify token với API
                    try {
                        const freshUserData = await getMe();
                        if (freshUserData) {
                            setUser(freshUserData);
                            await AsyncStorage.setItem('user', JSON.stringify(freshUserData));
                        } else {
                            // Token không hợp lệ
                            logout();
                        }
                    } catch (apiError) {
                        console.log("🔴 API Error:", apiError);
                        // Không logout ngay lập tức nếu API lỗi - giữ user đã lưu trong storage
                    }
                }
            } catch (error) {
                console.log("🔴 Error loading auth state:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    // Các functions xử lý authentication
    const login = async (userData) => {
        try {
            await AsyncStorage.setItem('token', userData.accessToken);

            // Đảm bảo userData có thông tin người dùng đầy đủ
            const userToStore = {
                ...userData,
            };

            await AsyncStorage.setItem('user', JSON.stringify(userToStore));
            setUser(userToStore);
            setIsAuthenticated(true);
            console.log("✅ AuthContext: Login successful", userToStore.name);
            return true;
        } catch (error) {
            console.log("🔴 AuthContext login error:", error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
            console.log("🟠 AuthContext: Logged out");
            return true;
        } catch (error) {
            console.log("🔴 AuthContext logout error:", error);
            return false;
        }
    };

    const refreshUserData = async () => {
        try {
            const userData = await getMe();
            if (userData) {
                setUser(userData);
                await AsyncStorage.setItem('user', JSON.stringify(userData));
                console.log("✅ AuthContext: User data refreshed", userData.name);
                return userData;
            }
            return null;
        } catch (error) {
            console.log("🔴 AuthContext refresh error:", error);
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            isLoading,
            isAuthenticated,
            login,
            logout,
            refreshUserData
        }}>
            {children}
        </AuthContext.Provider>
    );
};