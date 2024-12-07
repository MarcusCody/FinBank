export interface Transaction {
  id: string;
  amount: number;
  date: string; // ISO string format
  description: string;
  type: 'debit' | 'credit';
}
