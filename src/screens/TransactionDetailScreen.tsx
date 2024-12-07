import React from 'react';
import { View, Text } from 'react-native';

const TransactionDetailScreen = ({ route }: any) => {
  const { transaction } = route.params;

  return (
    <View>
      <Text>{transaction.description}</Text>
      <Text>{transaction.amount}</Text>
      <Text>{transaction.date}</Text>
      <Text>{transaction.type}</Text>
    </View>
  );
};

export default TransactionDetailScreen;
