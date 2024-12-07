import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen.tsx';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen.tsx';
import TransactionDetailScreen from '../screens/TransactionDetailScreen.tsx';

export type RootStackParamList = {
  Login: undefined;
  Transactions: undefined;
  TransactionDetail: { transactionId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Transactions" component={TransactionHistoryScreen} />
        <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
