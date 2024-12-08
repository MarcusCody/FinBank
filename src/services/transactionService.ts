import {Transaction} from '../types/Transaction';

const descriptions = [
  "McDonald's",
  'Apple Subscription',
  'Transfer',
  'Shopee Payment',
  'Petronas Fuel',
  'Grab Ride',
  '7-Eleven',
  'Starbucks Drink',
  'Lazada Payment',
  'Maxis Bill Payment',
  "Touch 'n Go Reload",
  'Boost Reload',
  'AirAsia Flight',
  'Setel Payment',
  'Tealive Drink',
  'Uniqlo Purchase',
  'Zalora Purchase',
  'Guardian Pharmacy',
  'Watsons',
  'MyNews',
];

// Global transaction list
let transactions: Transaction[] = generateInitialTransactions(50);

function generateUUID(): string {
  return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
    const r = Math.floor(Math.random() * 16);
    return r.toString(16);
  });
}

function generateInitialTransactions(count: number): Transaction[] {
  return Array.from({length: count}, (_, i) => {
    const randomDescription =
      descriptions[Math.floor(Math.random() * descriptions.length)];
    return {
      id: generateUUID(),
      amount: Math.round(Math.random() * 1000),
      date: new Date(Date.now() - i * 86400000).toISOString(),
      description: randomDescription,
      type: i % 2 === 0 ? 'credit' : 'debit',
    };
  });
}

function simulatePossibleError() {
  const isError = Math.random() < 0.1;
  if (isError) {
    const errors = [
      'Network error: Unable to fetch transactions. Please try again.',
    ];
    const chosenError = errors[Math.floor(Math.random() * errors.length)];
    throw new Error(chosenError);
  }
}

// Add a new transaction with the current time on refresh
export function addTransaction() {
  const randomDescription =
    descriptions[Math.floor(Math.random() * descriptions.length)];
  const newTransaction: Transaction = {
    id: generateUUID(),
    amount: Math.round(Math.random() * 1000),
    date: new Date().toISOString(), // current time
    description: randomDescription,
    type: Math.random() > 0.5 ? 'credit' : 'debit',
  };
  // Prepend the new transaction so it's most recent
  transactions = [newTransaction, ...transactions];
}

export async function fetchTransactions(): Promise<Transaction[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        simulatePossibleError();
        resolve(transactions);
      } catch (err: any) {
        reject(err);
      }
    }, 500);
  });
}

export async function getTransactionById(
  id: string,
): Promise<Transaction | undefined> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        simulatePossibleError();
        const tx = transactions.find(t => t.id === id);
        resolve(tx);
      } catch (err: any) {
        reject(err);
      }
    }, 300);
  });
}
