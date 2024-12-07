import React, { useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator.tsx';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const rnb = new ReactNativeBiometrics();

export default function LoginScreen({ navigation }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [biometryType, setBiometryType] = useState<string | null>(null);

  const checkBiometricAvailability = async () => {
    const { available, biometryType } = await rnb.isSensorAvailable();
    if (!available) {
      setError('Biometrics not available on this device');
      return;
    }
    if (biometryType === BiometryTypes.TouchID) {
      setBiometryType('Touch ID');
    } else if (biometryType === BiometryTypes.FaceID) {
      setBiometryType('Face ID');
    } else if (biometryType === BiometryTypes.Biometrics) {
      setBiometryType('Biometrics');
    }
  };

  const handleBiometricAuth = async () => {
    try {
      // This will prompt the user for their biometrics (Face ID/Touch ID)
      const { success } = await rnb.simplePrompt({ promptMessage: 'Login with Biometrics' });

      if (success) {
        // Navigate to Transactions screen if authentication passes
        navigation.replace('Transactions');
      } else {
        setError('Authentication failed or was canceled by user.');
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Fintech App</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      {biometryType && <Text>Supported Biometry: {biometryType}</Text>}
      <Button title="Check Biometry" onPress={checkBiometricAvailability} />
      <Button title="Login with Biometrics" onPress={handleBiometricAuth} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 20 },
  error: { color: 'red', marginBottom: 10 },
});
