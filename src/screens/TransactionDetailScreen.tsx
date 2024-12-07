import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';

import {Transaction} from '../types/Transaction';
import {getTransactionById} from '../services/transactionService.ts';

type Props = NativeStackScreenProps<RootStackParamList, 'TransactionDetail'>;

export default function TransactionDetailScreen({route}: Props) {
  const {transactionId} = route.params;
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const tx = await getTransactionById(transactionId);
        if (!tx) {
          setError('Transaction not found');
        } else {
          setTransaction(tx);
        }
      } catch (e) {
        setError((e as Error).message);
      }
    })();
  }, [transactionId]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!transaction) {
    return (
      <View style={styles.container}>
        <Text>Loading transaction...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Description:</Text>
      <Text style={styles.value}>{transaction.description}</Text>

      <Text style={styles.label}>Amount:</Text>
      <Text style={styles.value}>${transaction.amount.toFixed(2)}</Text>

      <Text style={styles.label}>Type:</Text>
      <Text style={styles.value}>{transaction.type}</Text>

      <Text style={styles.label}>Date:</Text>
      <Text style={styles.value}>
        {new Date(transaction.date).toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  label: {fontSize: 14, fontWeight: '600', marginTop: 12},
  value: {fontSize: 16, marginTop: 4},
  error: {color: 'red'},
});
