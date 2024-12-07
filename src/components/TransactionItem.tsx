import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Transaction } from '../types/Transaction';

interface Props {
  transaction: Transaction;
  onPress: () => void;
  masked: boolean;
}


export default function TransactionItem({ transaction, onPress, masked }: Props) {
  const displayAmount = masked ? '****' : `$${transaction.amount.toFixed(2)}`;

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View>
        <Text style={styles.description}>{transaction.description}</Text>
        <Text style={styles.date}>{new Date(transaction.date).toLocaleString()}</Text>
      </View>
      <Text style={[styles.amount, transaction.type === 'credit' ? styles.credit : styles.debit]}>
        {displayAmount}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  description: { fontSize: 16, fontWeight: '500' },
  date: { fontSize: 12, color: '#888', marginTop: 4 },
  amount: { fontSize: 16, fontWeight: '600' },
  credit: { color: 'green' },
  debit: { color: 'red' },
});
