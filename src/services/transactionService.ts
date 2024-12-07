import {Transaction} from '../types/Transaction';

// Generate mock data
const transactions: Transaction[] = Array.from({length: 20}, (_, i) => {
  return {
    id: `tx_${i}`,
    amount: Math.round(Math.random() * 1000),
    date: new Date(Date.now() - i * 86400000).toISOString(),
    description: `Payment #${i + 1}`,
    type: i % 2 === 0 ? 'credit' : 'debit',
  };
});

export async function fetchTransactions(): Promise<Transaction[]> {
  // Simulate network delay
  return new Promise(resolve => {
    setTimeout(() => resolve(transactions), 500);
  });
}

export async function getTransactionById(
  id: string,
): Promise<Transaction | undefined> {
  return transactions.find(t => t.id === id);
}
