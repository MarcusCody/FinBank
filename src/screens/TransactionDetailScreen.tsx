import React, {useEffect, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {Transaction} from '../types/Transaction';
import {getTransactionById} from '../services/transactionService';

type Props = NativeStackScreenProps<RootStackParamList, 'TransactionDetail'>;

export default function TransactionDetailScreen({route}: Props) {
  const {transactionId} = route.params;
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadTransaction = async () => {
    setRefreshing(true);
    setError(null);
    setTransaction(null);
    try {
      const tx = await getTransactionById(transactionId);
      if (!tx) {
        setError('Transaction not found');
      } else {
        setTransaction(tx);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTransaction();
  }, [transactionId]);

  const onRefresh = () => {
    loadTransaction();
  };

  if (error) {
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6200EE"
          />
        }>
        <Text style={styles.error}>{error}</Text>
      </ScrollView>
    );
  }

  if (!transaction) {
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6200EE"
          />
        }>
        <Text>Loading transaction...</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#6200EE"
        />
      }>
      <View style={styles.detailCard}>
        <Text style={styles.header}>Transaction Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{transaction.description}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.value}>RM {transaction.amount.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Type:</Text>
          <Text style={styles.value}>{transaction.type}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>
            {new Date(transaction.date).toLocaleString()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flexGrow: 1, padding: 16, backgroundColor: '#F5F5F5'},
  error: {color: 'red', fontSize: 16, textAlign: 'center', marginTop: 20},
  detailCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    // subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  label: {
    width: 100,
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  value: {
    fontSize: 14,
    flexShrink: 1,
    color: '#333',
    fontWeight: '500',
  },
});
