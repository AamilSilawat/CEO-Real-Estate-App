import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants/theme';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SalesScreen from '../screens/SalesScreen';
import OperationsScreen from '../screens/OperationsScreen';
import FinanceScreen from '../screens/FinanceScreen';
import MarketingScreen from '../screens/MarketingScreen';
import HRScreen from '../screens/HRScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.background,
    card: COLORS.white,
    text: COLORS.textPrimary,
    border: COLORS.border,
    primary: COLORS.primary
  }
};

export const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={AppNavigationTheme}>
      <Stack.Navigator
        screenOptions={{
          animation: 'slide_from_right',
          headerStyle: {
            backgroundColor: COLORS.white
          },
          headerTintColor: COLORS.textPrimary,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 17,
            color: COLORS.textPrimary
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: COLORS.background
          }
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Sales"
              component={SalesScreen}
              options={{
                title: 'Sales & Pipeline',
                headerBackTitle: 'Dashboard'
              }}
            />
            <Stack.Screen
              name="Operations"
              component={OperationsScreen}
              options={{
                title: 'Site Operations',
                headerBackTitle: 'Dashboard'
              }}
            />
            <Stack.Screen
              name="Finance"
              component={FinanceScreen}
              options={{
                title: 'Finance & Invoices',
                headerBackTitle: 'Dashboard'
              }}
            />
            <Stack.Screen
              name="Marketing"
              component={MarketingScreen}
              options={{
                title: 'Growth & Marketing',
                headerBackTitle: 'Dashboard'
              }}
            />
            <Stack.Screen
              name="HR"
              component={HRScreen}
              options={{
                title: 'Human Resources & Talent',
                headerBackTitle: 'Dashboard'
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
