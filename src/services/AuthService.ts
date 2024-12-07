import ReactNativeBiometrics from 'react-native-biometrics';

export const authenticateUser = async (): Promise<boolean> => {
  const rnBiometrics = new ReactNativeBiometrics();
  const { available } = await rnBiometrics.isSensorAvailable();

  if (!available) {
    console.log('Biometrics not available');
    return false;
  }

  const { success } = await rnBiometrics.simplePrompt({
    promptMessage: 'Confirm your identity',
  });

  return success;
};
