import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Transaction} from '../types/Transaction';

interface Props {
  transaction: Transaction;
  onPress: () => void;
  masked: boolean;
}

export default function TransactionItem({transaction, onPress, masked}: Props) {
  const displayAmount = masked ? '****' : `RM ${transaction.amount.toFixed(2)}`;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.infoContainer}>
        <Text style={styles.description}>{transaction.description}</Text>
        <Text style={styles.date}>
          {new Date(transaction.date).toLocaleString()}
        </Text>
      </View>
      <Text
        style={[
          styles.amount,
          transaction.type === 'credit' ? styles.credit : styles.debit,
        ]}>
        {displayAmount}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    // subtle shadow on iOS
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 2},
  },
  infoContainer: {
    flexShrink: 1,
  },
  description: {fontSize: 16, fontWeight: '600', color: '#333'},
  date: {fontSize: 12, color: '#888', marginTop: 4},
  amount: {fontSize: 16, fontWeight: '600'},
  credit: {color: 'green'},
  debit: {color: 'red'},
});
