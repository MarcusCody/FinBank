import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const rnb = new ReactNativeBiometrics();

export default function LoginScreen({navigation}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [selectedBiometryType, setSelectedBiometryType] = useState<
    keyof typeof BiometryTypes | null
  >(null);

  useEffect(() => {
    (async () => {
      const {available, biometryType} = await rnb.isSensorAvailable();
      if (!available) {
        setError('No Biometrics available on this device.');
      } else if (biometryType) {
        setSelectedBiometryType(biometryType);
      }
    })();
  }, []);

  const handleBiometricAuth = async () => {
    try {
      const {success} = await rnb.simplePrompt({promptMessage: 'Authenticate'});
      if (success) {
        navigation.replace('Transactions');
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getBiometryName = () => {
    if (selectedBiometryType === BiometryTypes.FaceID) {
      return 'Face ID';
    }
    if (selectedBiometryType === BiometryTypes.TouchID) {
      return 'Touch ID';
    }
    return 'Biometrics';
  };

  return (
    <View style={styles.container}>
      <View style={styles.overlay} />
      <View style={styles.card}>
        <Text style={styles.title}>FinBank</Text>
        <Text style={styles.subtitle}>Secure your finances</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <Pressable style={styles.button} onPress={handleBiometricAuth}>
          <Text style={styles.buttonText}>
            Login with {selectedBiometryType ? getBiometryName() : 'Biometrics'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(98,0,238,0.3)',
  },
  card: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 4},
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6200EE',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
