// Fake transactions we use to test the UI before the real backend is ready.
// like a placeholder for our app

import { Transaction } from '../types/Transaction';
import { Wallet } from '../types/Wallet';

// One default wallet to start with
export const defaultWallet: Wallet = {
    id: 'wallet-1',
    name: 'Cash',
    icon: 'account_balance_wallet',
    balance: 12450.00,
    currency: 'ETB',
    isDefault: true,
    createdAt: new Date().toISOString(),
};

// 10 realistic fake transactions
export const dummyTransactions: Transaction[] = [
    { id: 'tx-1', amount: 5000, type: 'CREDIT', categoryId: 'cat-16', note: 'Monthly salary', date: '2026-08-01T09:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-08-01T09:00:00Z' },
    { id: 'tx-2', amount: 250, type: 'DEBIT', categoryId: 'cat-3', note: 'Lunch with team', date: '2026-08-11T13:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-08-11T13:00:00Z' },
    { id: 'tx-3', amount: 800, type: 'DEBIT', categoryId: 'cat-4', note: 'Weekly groceries', date: '2026-08-10T10:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-08-10T10:00:00Z' },
    { id: 'tx-4', amount: 199, type: 'DEBIT', categoryId: 'cat-8', note: 'Netflix monthly', date: '2026-08-09T08:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-08-09T08:00:00Z' },
    { id: 'tx-5', amount: 450, type: 'DEBIT', categoryId: 'cat-1', note: 'Gas station fill', date: '2026-08-08T07:30:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-08-08T07:30:00Z' },
    { id: 'tx-6', amount: 120, type: 'DEBIT', categoryId: 'cat-2', note: 'Breakfast', date: '2026-08-08T07:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-08-08T07:00:00Z' },
    { id: 'tx-7', amount: 350, type: 'DEBIT', categoryId: 'cat-6', note: 'Safaricom data', date: '2026-08-07T12:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-08-07T12:00:00Z' },
    { id: 'tx-8', amount: 200, type: 'DEBIT', categoryId: 'cat-7', note: 'Skincare products', date: '2026-08-06T15:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-08-06T15:00:00Z' },
    { id: 'tx-9', amount: 1500, type: 'CREDIT', categoryId: 'cat-18', note: 'Freelance payment', date: '2026-08-05T11:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-08-05T11:00:00Z' },
    { id: 'tx-10', amount: 300, type: 'DEBIT', categoryId: 'cat-5', note: 'Programming books', date: '2026-08-04T14:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-08-04T14:00:00Z' },
];
