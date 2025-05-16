import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import VerifyCodeScreen from "../screens/VerifyCodeScreen";
import SendEmailScreen from "../screens/SendEmailScreen";
import NewPasswordScreen from "../screens/NewPasswordScreen";
import HomeScreen from "../screens/HomeScreen";
import FavScreen from "../screens/FavoriteScreen";
import FilterScreen from "../screens/FilterScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HotelDetailScreen from "../screens/HotelDetailScreen";
import SearchResultScreen from "../screens/SearchResultScreen";
import BookingSreen from "../screens/BookingScreen";
import BookingDetailScreen from '../screens/BookingDetailScreen';

import { useAuth } from "../contexts/AuthContext";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { ActivityIndicator, View } from 'react-native';

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
    <Stack.Screen name="SendEmail" component={SendEmailScreen} />
    <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Fav" component={FavScreen} />
    <Stack.Screen name="Filter" component={FilterScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Detail" component={HotelDetailScreen} />
    <Stack.Screen name="SearchResult" component={SearchResultScreen} />
    <Stack.Screen name="Booking" component={BookingSreen} />
    <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated, isReady } = useAuth();
  console.log("🧭 AppNavigator status:", { isReady, isAuthenticated });

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1167B1" />
      </View>
    );
  }

  return isAuthenticated ? <AppStack /> : <AuthStack />;
};

export default AppNavigator;
