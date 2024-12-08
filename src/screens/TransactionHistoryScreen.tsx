import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
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
import {
  addTransaction,
  fetchTransactions,
} from '../services/transactionService';

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

  const onRefresh = async () => {
    // Add one new transaction before fetching
    addTransaction();
    loadData();
  };

  const unmaskAmounts = async () => {
    try {
      const {success} = await rnb.simplePrompt({
        promptMessage: 'Unmask Amounts',
      });
      if (success) {
        setMasked(false);
      } else {
        setError('Authentication canceled or failed. Please try again');
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
        <View style={styles.maskButtonContainer}>
          {masked ? (
            <Pressable style={styles.maskButton} onPress={unmaskAmounts}>
              <Text style={styles.maskButtonText}>Unmask</Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.maskButton, styles.maskedActive]}
              onPress={() => setMasked(true)}>
              <Text style={styles.maskButtonText}>Mask</Text>
            </Pressable>
          )}
        </View>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      {loading && transactions.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#6200EE" />
        </View>
      ) : (
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
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              tintColor="#6200EE"
            />
          }
          contentContainerStyle={
            transactions.length === 0 ? styles.emptyList : null
          }
          ListEmptyComponent={
            !loading && !error ? <Text>No Transactions Yet</Text> : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // styles identical to the previously provided UI improvements
  container: {flex: 1, padding: 16, backgroundColor: '#F5F5F5'},
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {fontSize: 24, fontWeight: '700', color: '#333'},
  error: {color: 'red', marginTop: 10, textAlign: 'center'},
  maskButtonContainer: {
    flexDirection: 'row',
  },
  maskButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  maskedActive: {
    backgroundColor: '#5E60CE',
  },
  maskButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
