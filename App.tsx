import React from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { StatusBar as RNStatusBar, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ExpoStatusBar style="dark" />
        {Platform.OS === 'android' && (
          <RNStatusBar barStyle="dark-content" backgroundColor="#F8FAFC" translucent={false} />
        )}
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
