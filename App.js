import { StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FavoriteProvider } from './src/contexts/FavoriteContext';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { navigationRef } from './src/navigation/RootNavigation';
import { BookingProvider } from './src/contexts/BookingContext';
import { Linking } from 'react-native';
import { handleOAuthRedirect } from './src/services/authService';

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
  useEffect(() => {
    const handleDeepLink = (event) => {
      console.log('Deep link received:', event.url);
      if (!event.url) return;

      const url = new URL(event.url);
      const params = new URLSearchParams(url.search);

      if (url.pathname.includes('zalopay-return')) {
        const status = params.get('status');
        const apptransid = params.get('apptransid');
        const bookingId = params.get('bookingId');

        if (status === '1' && apptransid) {
          navigationRef.current?.navigate('Confirm', {
            transactionId: apptransid,
            bookingId: bookingId || ''
          });
        } else {
          navigationRef.current?.navigate('Home');
        }
        return;
      }

      if (url.pathname.includes('oauth')) {
        handleOAuthRedirect(event.url)
          .then(result => {
            if (result.success) {
              navigationRef.current?.navigate('OAuthRedirect');
            }
          })
          .catch(error => {
            console.error('OAuth error:', error);
          });
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink({ url });
    }).catch(err => console.error('Error getting initial URL:', err));

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationContainer ref={navigationRef}>
          <FavoriteProvider>
            <BookingProvider>
              <AppNavigator />
            </BookingProvider>
          </FavoriteProvider>
        </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
export { queryClient };

const styles = StyleSheet.create({});