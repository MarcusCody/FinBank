const fs = require('fs');
const path = require('path');

const directories = [
  'src/components',
  'src/screens',
  'src/services',
  'src/types',
  'src/data',
  'src/navigation',
];

const files = [
  'src/components/TransactionCard.tsx',
  'src/components/MaskedText.tsx',
  'src/screens/TransactionHistoryScreen.tsx',
  'src/screens/TransactionDetailScreen.tsx',
  'src/services/AuthService.ts',
  'src/services/DataService.ts',
  'src/types/Transaction.ts',
  'src/data/mockTransactions.ts',
  'src/navigation/AppNavigator.tsx',
];

directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

files.forEach((file) => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, '', 'utf8');
  }
});

console.log('Project structure created successfully!');
