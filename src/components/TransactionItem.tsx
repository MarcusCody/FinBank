import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Transaction} from '../types/Transaction';
import {borderRadius, colors, fontSizes, fontWeights} from '../styles/theme';

type Props = {
  transaction: Transaction;
  masked: boolean;
  onPress: () => void;
};

export default function TransactionItem({transaction, masked, onPress}: Props) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.description}>{transaction.description}</Text>
        <Text
          style={[
            styles.amount,
            transaction.type === 'credit' ? styles.credit : styles.debit,
          ]}>
          {transaction.type === 'credit' ? '-' : ''}RM{' '}
          {masked ? '****' : transaction.amount.toFixed(2)}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.time}>
          {new Date(transaction.date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          })}
        </Text>
        <Text style={styles.type}>({transaction.type})</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: borderRadius.card,
    marginBottom: 8,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    fontSize: fontSizes.subtitle,
    fontWeight: fontWeights.button,
    color: colors.primary,
  },
  amount: {
    fontSize: fontSizes.subtitle,
    fontWeight: fontWeights.button,
  },
  credit: {
    color: colors.error,
  },
  debit: {
    color: colors.success,
  },
  time: {
    fontSize: fontSizes.caption,
    color: colors.subtitle,
  },
  type: {
    fontSize: fontSizes.caption,
    color: colors.subtitle,
    marginLeft: 8,
    textTransform: 'capitalize',
  },
});
