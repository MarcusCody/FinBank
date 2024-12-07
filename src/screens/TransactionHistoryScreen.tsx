import React, {useCallback, useEffect, useState} from 'react';
import {
  Button,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Transaction} from '../types/Transaction';
import TransactionItem from '../components/TransactionItem';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import ReactNativeBiometrics from 'react-native-biometrics';
import {fetchTransactions} from '../services/transactionService.ts';

const rnb = new ReactNativeBiometrics();

type Props = NativeStackScreenProps<RootStackParamList, 'Transactions'>;

export default function TransactionHistoryScreen({navigation}: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [masked, setMasked] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTransactions();
      setTransactions(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const unmaskAmounts = async () => {
    try {
      const {success} = await rnb.simplePrompt({
        promptMessage: 'Unmask Amounts',
      });
      if (success) {
        setMasked(false);
      } else {
        setError('Authentication canceled or failed.');
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  const onPressTransaction = (id: string) => {
    navigation.navigate('TransactionDetail', {transactionId: id});
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Recent Transactions</Text>
        {masked && <Button title="Unmask" onPress={unmaskAmounts} />}
        {!masked && <Button title="Mask" onPress={() => setMasked(true)} />}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TransactionItem
            transaction={item}
            masked={masked}
            onPress={() => onPressTransaction(item.id)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadData} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {fontSize: 20, fontWeight: '600'},
  error: {color: 'red', marginTop: 10},
});
