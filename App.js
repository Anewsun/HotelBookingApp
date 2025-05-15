import { StyleSheet } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FavoriteProvider } from './src/contexts/FavoriteContext';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 15 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: true,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <AuthProvider>
          <FavoriteProvider>
            <AppNavigator />
          </FavoriteProvider>
        </AuthProvider>
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default App;
export { queryClient };

const styles = StyleSheet.create({});