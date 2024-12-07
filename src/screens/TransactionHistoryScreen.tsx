import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { authenticateUser } from '../services/AuthService';
import { transactions } from '../data/mockTransactions';

const TransactionHistoryScreen = ({ navigation }: any) => {
  const [data] = useState(transactions);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data fetch
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleReveal = async () => {
    const success = await authenticateUser();
    if (success) {
      setShowSensitive(true);
    }
  };

  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}
          >
            <Text>{item.description}</Text>
            <Text>{showSensitive ? `$${item.amount}` : '****'}</Text>
            <Text>{item.date}</Text>
          </TouchableOpacity>
        )}
      />
      {!showSensitive && (
        <TouchableOpacity onPress={handleReveal}>
          <Text>Reveal Sensitive Data</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TransactionHistoryScreen;
