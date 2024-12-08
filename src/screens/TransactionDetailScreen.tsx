import React, {useEffect, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {Transaction} from '../types/Transaction';
import {getTransactionById} from '../services/transactionService';
import {borderRadius, colors, fontSizes, fontWeights} from '../styles/theme';

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
            tintColor={colors.primary}
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
            tintColor={colors.primary}
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
          tintColor={colors.primary}
        />
      }>
      <View style={styles.detailCard}>
        <Text style={styles.header}>Transaction Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Amount</Text>
          <Text
            style={[
              styles.amount,
              transaction.type === 'credit' ? styles.credit : styles.debit,
            ]}>
            {transaction.type === 'credit' ? '-' : ''}RM{' '}
            {transaction.amount.toFixed(2)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Transaction ID</Text>
          <Text style={styles.value}>{transactionId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{transaction.description}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Type:</Text>
          <Text style={styles.value}>{transaction.type}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>
            {new Date(transaction.date).toLocaleString()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flexGrow: 1, padding: 16, backgroundColor: colors.white},
  error: {
    color: colors.error,
    fontSize: fontSizes.subtitle,
    textAlign: 'center',
    marginTop: 20,
  },
  detailCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.card,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  header: {
    fontSize: fontSizes.title,
    fontWeight: fontWeights.title,
    marginBottom: 12,
    color: colors.primary,
    textAlign: 'center',
  },
  row: {
    marginBottom: 12,
  },
  label: {
    fontSize: fontSizes.subtitle,
    fontWeight: fontWeights.button,
    color: colors.subtitle,
    marginBottom: 4,
  },
  value: {
    fontSize: fontSizes.subtitle,
    color: colors.primary,
    fontWeight: fontWeights.button,
    marginBottom: 12,
  },
  amount: {
    fontSize: fontSizes.title,
    fontWeight: fontWeights.title,
    marginBottom: 12,
  },
  credit: {
    color: colors.error,
  },
  debit: {
    color: colors.success,
  },
});
