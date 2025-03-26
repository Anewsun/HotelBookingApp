import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import VerifyCodeScreen from '../screens/VerifyCodeScreen';
import SendEmailScreen from '../screens/SendEmailScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import FavScreen from '../screens/FavoriteScreen';
import FilterScreen from '../screens/FilterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HotelDetailScreen from '../screens/HotelDetailScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SignIn">
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
      <Stack.Screen name="SendEmail" component={SendEmailScreen} />
      <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Fav" component={FavScreen} />
      <Stack.Screen name="Filter" component={FilterScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Detail" component={HotelDetailScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;