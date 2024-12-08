import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Transaction} from '../types/Transaction';
import {borderRadius, colors, fontSizes, fontWeights} from '../styles/theme';

interface Props {
  transaction: Transaction;
  onPress: () => void;
  masked: boolean;
}

export default function TransactionItem({transaction, onPress, masked}: Props) {
  const displayAmount = masked
    ? '*****'
    : `${
        transaction.type === 'credit' ? '-' : ''
      }RM ${transaction.amount.toFixed(2)}`;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.infoContainer}>
        <Text style={styles.description}>{transaction.description}</Text>
        <Text style={styles.date}>
          {new Date(transaction.date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          })}
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
    backgroundColor: colors.white,
    borderRadius: borderRadius.card,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  infoContainer: {
    flexShrink: 1,
    marginRight: 16,
  },
  description: {
    fontSize: fontSizes.subtitle,
    fontWeight: fontWeights.button,
    color: colors.primary,
    marginBottom: 4,
  },
  date: {
    fontSize: fontSizes.subtitle,
    color: colors.subtitle,
  },
  amount: {
    fontSize: fontSizes.subtitle,
    fontWeight: fontWeights.title,
  },
  credit: {
    color: colors.error,
  },
  debit: {
    color: colors.success,
  },
});
