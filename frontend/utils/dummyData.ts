// Fake transactions we use to test the UI before the real backend is ready.
// like a placeholder for our app

import { Transaction } from '../types/Transaction';
import { Wallet } from '../types/Wallet';
import { Budget } from '../types/Budget';

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

// Full year of realistic transactions fitting the current spending data and categories (2026)
export const dummyTransactions: Transaction[] = [
    // ── SEPTEMBER 2026 (Current Month - Recent Transactions & Weekly Buckets) ──
    { id: 'tx-sep-1', amount: 250, type: 'DEBIT', categoryId: 'cat-3', note: 'Lunch with team', date: '2026-09-24T13:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-09-24T13:00:00Z' },
    { id: 'tx-sep-2', amount: 800, type: 'DEBIT', categoryId: 'cat-4', note: 'Weekly groceries', date: '2026-09-23T10:30:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-09-23T10:30:00Z' },
    { id: 'tx-sep-3', amount: 450, type: 'DEBIT', categoryId: 'cat-1', note: 'Gas station fill', date: '2026-09-22T08:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-09-22T08:00:00Z' },
    { id: 'tx-sep-4', amount: 120, type: 'DEBIT', categoryId: 'cat-2', note: 'Breakfast & pastry', date: '2026-09-21T07:45:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-09-21T07:45:00Z' },
    { id: 'tx-sep-5', amount: 350, type: 'DEBIT', categoryId: 'cat-6', note: 'Safaricom monthly data', date: '2026-09-20T11:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-09-20T11:00:00Z' },
    { id: 'tx-sep-6', amount: 300, type: 'DEBIT', categoryId: 'cat-5', note: 'Programming books', date: '2026-09-19T16:20:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-09-19T16:20:00Z' },
    { id: 'tx-sep-7', amount: 200, type: 'DEBIT', categoryId: 'cat-7', note: 'Skincare products', date: '2026-09-18T14:15:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-09-18T14:15:00Z' },
    { id: 'tx-sep-8', amount: 199, type: 'DEBIT', categoryId: 'cat-8', note: 'Netflix monthly', date: '2026-09-16T09:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-09-16T09:00:00Z' },
    { id: 'tx-sep-9', amount: 1500, type: 'CREDIT', categoryId: 'cat-18', note: 'Freelance payment', date: '2026-09-15T11:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-09-15T11:00:00Z' },
    { id: 'tx-sep-10', amount: 650, type: 'DEBIT', categoryId: 'cat-4', note: 'Supermarket vegetables & fruits', date: '2026-09-14T17:30:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-09-14T17:30:00Z' },
    { id: 'tx-sep-11', amount: 320, type: 'DEBIT', categoryId: 'cat-3', note: 'Dinner with friends', date: '2026-09-12T19:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-09-12T19:00:00Z' },
    { id: 'tx-sep-12', amount: 180, type: 'DEBIT', categoryId: 'cat-9', note: 'Taxi & transport fare', date: '2026-09-10T08:30:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-09-10T08:30:00Z' },
    { id: 'tx-sep-13', amount: 420, type: 'DEBIT', categoryId: 'cat-1', note: 'Gas refill', date: '2026-09-08T15:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-09-08T15:00:00Z' },
    { id: 'tx-sep-14', amount: 240, type: 'DEBIT', categoryId: 'cat-12', note: 'Pharmacy vitamins', date: '2026-09-05T12:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-09-05T12:00:00Z' },
    { id: 'tx-sep-15', amount: 480, type: 'DEBIT', categoryId: 'cat-11', note: 'Electricity and water bills', date: '2026-09-03T10:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-09-03T10:00:00Z' },
    { id: 'tx-sep-16', amount: 5000, type: 'CREDIT', categoryId: 'cat-16', note: 'Monthly salary', date: '2026-09-01T09:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-09-01T09:00:00Z' },
    { id: 'tx-sep-17', amount: 2500, type: 'DEBIT', categoryId: 'cat-10', note: 'Apartment rent', date: '2026-09-01T10:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-09-01T10:00:00Z' },

    // ── AUGUST 2026 (Preserving original dummy transactions) ──
    { id: 'tx-2', amount: 250, type: 'DEBIT', categoryId: 'cat-3', note: 'Lunch with team', date: '2026-08-11T13:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-08-11T13:00:00Z' },
    { id: 'tx-3', amount: 800, type: 'DEBIT', categoryId: 'cat-4', note: 'Weekly groceries', date: '2026-08-10T10:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-08-10T10:00:00Z' },
    { id: 'tx-4', amount: 199, type: 'DEBIT', categoryId: 'cat-8', note: 'Netflix monthly', date: '2026-08-09T08:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-08-09T08:00:00Z' },
    { id: 'tx-5', amount: 450, type: 'DEBIT', categoryId: 'cat-1', note: 'Gas station fill', date: '2026-08-08T07:30:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-08-08T07:30:00Z' },
    { id: 'tx-6', amount: 120, type: 'DEBIT', categoryId: 'cat-2', note: 'Breakfast', date: '2026-08-08T07:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-08-08T07:00:00Z' },
    { id: 'tx-7', amount: 350, type: 'DEBIT', categoryId: 'cat-6', note: 'Safaricom data', date: '2026-08-07T12:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-08-07T12:00:00Z' },
    { id: 'tx-8', amount: 200, type: 'DEBIT', categoryId: 'cat-7', note: 'Skincare products', date: '2026-08-06T15:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-08-06T15:00:00Z' },
    { id: 'tx-9', amount: 1500, type: 'CREDIT', categoryId: 'cat-18', note: 'Freelance payment', date: '2026-08-05T11:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-08-05T11:00:00Z' },
    { id: 'tx-10', amount: 300, type: 'DEBIT', categoryId: 'cat-5', note: 'Programming books', date: '2026-08-04T14:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-08-04T14:00:00Z' },
    { id: 'tx-1', amount: 5000, type: 'CREDIT', categoryId: 'cat-16', note: 'Monthly salary', date: '2026-08-01T09:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-08-01T09:00:00Z' },

    // ── JULY 2026 ──
    { id: 'tx-jul-1', amount: 750, type: 'DEBIT', categoryId: 'cat-4', note: 'Monthly grocery restock', date: '2026-07-28T16:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-07-28T16:00:00Z' },
    { id: 'tx-jul-2', amount: 460, type: 'DEBIT', categoryId: 'cat-1', note: 'Gas fill-up', date: '2026-07-24T08:15:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-07-24T08:15:00Z' },
    { id: 'tx-jul-3', amount: 280, type: 'DEBIT', categoryId: 'cat-3', note: 'Cafe lunch meeting', date: '2026-07-20T13:30:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-07-20T13:30:00Z' },
    { id: 'tx-jul-4', amount: 199, type: 'DEBIT', categoryId: 'cat-8', note: 'Netflix monthly', date: '2026-07-16T09:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-07-16T09:00:00Z' },
    { id: 'tx-jul-5', amount: 350, type: 'DEBIT', categoryId: 'cat-6', note: 'Safaricom 4G data bundle', date: '2026-07-11T12:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-07-11T12:00:00Z' },
    { id: 'tx-jul-6', amount: 1800, type: 'CREDIT', categoryId: 'cat-18', note: 'Mobile app consulting', date: '2026-07-08T10:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-07-08T10:00:00Z' },
    { id: 'tx-jul-7', amount: 220, type: 'DEBIT', categoryId: 'cat-7', note: 'Face cleanser and moisturizer', date: '2026-07-05T15:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-07-05T15:00:00Z' },
    { id: 'tx-jul-8', amount: 5000, type: 'CREDIT', categoryId: 'cat-16', note: 'Monthly salary', date: '2026-07-01T09:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-07-01T09:00:00Z' },

    // ── JUNE 2026 ──
    { id: 'tx-jun-1', amount: 820, type: 'DEBIT', categoryId: 'cat-4', note: 'Fresh market produce & meat', date: '2026-06-26T11:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-06-26T11:00:00Z' },
    { id: 'tx-jun-2', amount: 430, type: 'DEBIT', categoryId: 'cat-1', note: 'Fuel refill', date: '2026-06-21T07:30:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-06-21T07:30:00Z' },
    { id: 'tx-jun-3', amount: 199, type: 'DEBIT', categoryId: 'cat-8', note: 'Netflix monthly', date: '2026-06-16T09:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-06-16T09:00:00Z' },
    { id: 'tx-jun-4', amount: 350, type: 'DEBIT', categoryId: 'cat-6', note: 'Home broadband internet', date: '2026-06-12T14:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-06-12T14:00:00Z' },
    { id: 'tx-jun-5', amount: 260, type: 'DEBIT', categoryId: 'cat-3', note: 'Team dinner', date: '2026-06-08T20:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-06-08T20:00:00Z' },
    { id: 'tx-jun-6', amount: 2000, type: 'CREDIT', categoryId: 'cat-19', note: 'Mid-year performance bonus', date: '2026-06-05T10:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-06-05T10:00:00Z' },
    { id: 'tx-jun-7', amount: 130, type: 'DEBIT', categoryId: 'cat-2', note: 'Morning breakfast sandwich', date: '2026-06-03T08:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-06-03T08:00:00Z' },
    { id: 'tx-jun-8', amount: 5000, type: 'CREDIT', categoryId: 'cat-16', note: 'Monthly salary', date: '2026-06-01T09:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-06-01T09:00:00Z' },

    // ── MAY 2026 ──
    { id: 'tx-may-1', amount: 790, type: 'DEBIT', categoryId: 'cat-4', note: 'Supermarket weekly staples', date: '2026-05-27T10:15:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-05-27T10:15:00Z' },
    { id: 'tx-may-2', amount: 440, type: 'DEBIT', categoryId: 'cat-1', note: 'TotalEnergies gas refill', date: '2026-05-22T08:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-05-22T08:00:00Z' },
    { id: 'tx-may-3', amount: 290, type: 'DEBIT', categoryId: 'cat-5', note: 'TypeScript architecture guide', date: '2026-05-18T16:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-05-18T16:00:00Z' },
    { id: 'tx-may-4', amount: 199, type: 'DEBIT', categoryId: 'cat-8', note: 'Netflix monthly', date: '2026-05-16T09:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-05-16T09:00:00Z' },
    { id: 'tx-may-5', amount: 350, type: 'DEBIT', categoryId: 'cat-6', note: 'Safaricom 4G package', date: '2026-05-10T12:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-05-10T12:00:00Z' },
    { id: 'tx-may-6', amount: 1400, type: 'CREDIT', categoryId: 'cat-18', note: 'Website design gig', date: '2026-05-06T11:30:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-05-06T11:30:00Z' },
    { id: 'tx-may-7', amount: 240, type: 'DEBIT', categoryId: 'cat-3', note: 'Lunch at bistro', date: '2026-05-04T13:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-05-04T13:00:00Z' },
    { id: 'tx-may-8', amount: 5000, type: 'CREDIT', categoryId: 'cat-16', note: 'Monthly salary', date: '2026-05-01T09:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-05-01T09:00:00Z' },

    // ── APRIL 2026 ──
    { id: 'tx-apr-1', amount: 810, type: 'DEBIT', categoryId: 'cat-4', note: 'Weekly supermarket run', date: '2026-04-28T14:30:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-04-28T14:30:00Z' },
    { id: 'tx-apr-2', amount: 450, type: 'DEBIT', categoryId: 'cat-1', note: 'Gas fill-up', date: '2026-04-23T07:45:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-04-23T07:45:00Z' },
    { id: 'tx-apr-3', amount: 199, type: 'DEBIT', categoryId: 'cat-8', note: 'Netflix monthly', date: '2026-04-16T09:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-04-16T09:00:00Z' },
    { id: 'tx-apr-4', amount: 350, type: 'DEBIT', categoryId: 'cat-6', note: 'Safaricom internet renew', date: '2026-04-11T13:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-04-11T13:00:00Z' },
    { id: 'tx-apr-5', amount: 260, type: 'DEBIT', categoryId: 'cat-3', note: 'Lunch burger with friend', date: '2026-04-08T13:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-04-08T13:00:00Z' },
    { id: 'tx-apr-6', amount: 1600, type: 'CREDIT', categoryId: 'cat-18', note: 'Frontend bug fixing contract', date: '2026-04-05T10:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-04-05T10:00:00Z' },
    { id: 'tx-apr-7', amount: 190, type: 'DEBIT', categoryId: 'cat-7', note: 'Sunscreen and balm', date: '2026-04-03T16:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-04-03T16:00:00Z' },
    { id: 'tx-apr-8', amount: 5000, type: 'CREDIT', categoryId: 'cat-16', note: 'Monthly salary', date: '2026-04-01T09:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-04-01T09:00:00Z' },

    // ── MARCH 2026 ──
    { id: 'tx-mar-1', amount: 780, type: 'DEBIT', categoryId: 'cat-4', note: 'Groceries and pantry refill', date: '2026-03-27T17:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-03-27T17:00:00Z' },
    { id: 'tx-mar-2', amount: 460, type: 'DEBIT', categoryId: 'cat-1', note: 'Gas station refill', date: '2026-03-22T08:30:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-03-22T08:30:00Z' },
    { id: 'tx-mar-3', amount: 310, type: 'DEBIT', categoryId: 'cat-5', note: 'React Native performance book', date: '2026-03-18T15:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-03-18T15:00:00Z' },
    { id: 'tx-mar-4', amount: 199, type: 'DEBIT', categoryId: 'cat-8', note: 'Netflix monthly', date: '2026-03-16T09:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-03-16T09:00:00Z' },
    { id: 'tx-mar-5', amount: 350, type: 'DEBIT', categoryId: 'cat-6', note: 'Monthly internet bundle', date: '2026-03-10T12:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-03-10T12:00:00Z' },
    { id: 'tx-mar-6', amount: 250, type: 'DEBIT', categoryId: 'cat-3', note: 'Lunch combo', date: '2026-03-06T13:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-03-06T13:00:00Z' },
    { id: 'tx-mar-7', amount: 110, type: 'DEBIT', categoryId: 'cat-2', note: 'Morning tea and croissant', date: '2026-03-03T07:30:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-03-03T07:30:00Z' },
    { id: 'tx-mar-8', amount: 5000, type: 'CREDIT', categoryId: 'cat-16', note: 'Monthly salary', date: '2026-03-01T09:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-03-01T09:00:00Z' },

    // ── FEBRUARY 2026 ──
    { id: 'tx-feb-1', amount: 760, type: 'DEBIT', categoryId: 'cat-4', note: 'Supermarket weekly items', date: '2026-02-25T11:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-02-25T11:00:00Z' },
    { id: 'tx-feb-2', amount: 430, type: 'DEBIT', categoryId: 'cat-1', note: 'Gas fill-up', date: '2026-02-20T08:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-02-20T08:00:00Z' },
    { id: 'tx-feb-3', amount: 199, type: 'DEBIT', categoryId: 'cat-8', note: 'Netflix monthly', date: '2026-02-16T09:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-02-16T09:00:00Z' },
    { id: 'tx-feb-4', amount: 350, type: 'DEBIT', categoryId: 'cat-6', note: 'Safaricom 4G data pack', date: '2026-02-10T12:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-02-10T12:00:00Z' },
    { id: 'tx-feb-5', amount: 1500, type: 'CREDIT', categoryId: 'cat-18', note: 'Logo & UI contract payment', date: '2026-02-07T11:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-02-07T11:00:00Z' },
    { id: 'tx-feb-6', amount: 270, type: 'DEBIT', categoryId: 'cat-3', note: 'Lunch with friend', date: '2026-02-04T13:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-02-04T13:00:00Z' },
    { id: 'tx-feb-7', amount: 5000, type: 'CREDIT', categoryId: 'cat-16', note: 'Monthly salary', date: '2026-02-01T09:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-02-01T09:00:00Z' },

    // ── JANUARY 2026 ──
    { id: 'tx-jan-1', amount: 800, type: 'DEBIT', categoryId: 'cat-4', note: 'Groceries & fresh food', date: '2026-01-28T16:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-01-28T16:00:00Z' },
    { id: 'tx-jan-2', amount: 450, type: 'DEBIT', categoryId: 'cat-1', note: 'Gas station fill', date: '2026-01-22T07:30:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-01-22T07:30:00Z' },
    { id: 'tx-jan-3', amount: 280, type: 'DEBIT', categoryId: 'cat-5', note: 'Algorithms in Python book', date: '2026-01-18T14:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-01-18T14:00:00Z' },
    { id: 'tx-jan-4', amount: 199, type: 'DEBIT', categoryId: 'cat-8', note: 'Netflix monthly', date: '2026-01-16T09:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-01-16T09:00:00Z' },
    { id: 'tx-jan-5', amount: 350, type: 'DEBIT', categoryId: 'cat-6', note: 'Safaricom data package', date: '2026-01-10T12:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-01-10T12:00:00Z' },
    { id: 'tx-jan-6', amount: 200, type: 'DEBIT', categoryId: 'cat-7', note: 'Skincare products', date: '2026-01-07T15:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-01-07T15:00:00Z' },
    { id: 'tx-jan-7', amount: 120, type: 'DEBIT', categoryId: 'cat-2', note: 'Breakfast & coffee', date: '2026-01-04T08:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-01-04T08:00:00Z' },
    { id: 'tx-jan-8', amount: 5000, type: 'CREDIT', categoryId: 'cat-16', note: 'Monthly salary', date: '2026-01-01T09:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-01-01T09:00:00Z' },

    // ── OCTOBER 2026 ──
    { id: 'tx-oct-1', amount: 800, type: 'DEBIT', categoryId: 'cat-4', note: 'Weekly groceries', date: '2026-10-25T15:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-10-25T15:00:00Z' },
    { id: 'tx-oct-2', amount: 450, type: 'DEBIT', categoryId: 'cat-1', note: 'Gas fill-up', date: '2026-10-20T08:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-10-20T08:00:00Z' },
    { id: 'tx-oct-3', amount: 199, type: 'DEBIT', categoryId: 'cat-8', note: 'Netflix monthly', date: '2026-10-16T09:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-10-16T09:00:00Z' },
    { id: 'tx-oct-4', amount: 350, type: 'DEBIT', categoryId: 'cat-6', note: 'Safaricom monthly data', date: '2026-10-10T12:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-10-10T12:00:00Z' },
    { id: 'tx-oct-5', amount: 250, type: 'DEBIT', categoryId: 'cat-3', note: 'Lunch with colleagues', date: '2026-10-06T13:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-10-06T13:00:00Z' },
    { id: 'tx-oct-6', amount: 5000, type: 'CREDIT', categoryId: 'cat-16', note: 'Monthly salary', date: '2026-10-01T09:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-10-01T09:00:00Z' },

    // ── NOVEMBER 2026 ──
    { id: 'tx-nov-1', amount: 820, type: 'DEBIT', categoryId: 'cat-4', note: 'Weekly groceries & household items', date: '2026-11-26T16:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-11-26T16:00:00Z' },
    { id: 'tx-nov-2', amount: 440, type: 'DEBIT', categoryId: 'cat-1', note: 'Gas station fill', date: '2026-11-21T07:45:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-11-21T07:45:00Z' },
    { id: 'tx-nov-3', amount: 199, type: 'DEBIT', categoryId: 'cat-8', note: 'Netflix monthly', date: '2026-11-16T09:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-11-16T09:00:00Z' },
    { id: 'tx-nov-4', amount: 350, type: 'DEBIT', categoryId: 'cat-6', note: 'Safaricom 4G package', date: '2026-11-10T12:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-11-10T12:00:00Z' },
    { id: 'tx-nov-5', amount: 1600, type: 'CREDIT', categoryId: 'cat-18', note: 'Software freelance contract', date: '2026-11-06T10:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-11-06T10:00:00Z' },
    { id: 'tx-nov-6', amount: 260, type: 'DEBIT', categoryId: 'cat-3', note: 'Lunch with team', date: '2026-11-04T13:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-11-04T13:00:00Z' },
    { id: 'tx-nov-7', amount: 5000, type: 'CREDIT', categoryId: 'cat-16', note: 'Monthly salary', date: '2026-11-01T09:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-11-01T09:00:00Z' },

    // ── DECEMBER 2026 ──
    { id: 'tx-dec-1', amount: 950, type: 'DEBIT', categoryId: 'cat-4', note: 'Holiday dinner groceries & drinks', date: '2026-12-24T14:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-12-24T14:00:00Z' },
    { id: 'tx-dec-2', amount: 480, type: 'DEBIT', categoryId: 'cat-1', note: 'Road trip gas refill', date: '2026-12-20T08:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-12-20T08:00:00Z' },
    { id: 'tx-dec-3', amount: 199, type: 'DEBIT', categoryId: 'cat-8', note: 'Netflix monthly', date: '2026-12-16T09:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-12-16T09:00:00Z' },
    { id: 'tx-dec-4', amount: 350, type: 'DEBIT', categoryId: 'cat-6', note: 'Monthly internet renewal', date: '2026-12-10T12:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-12-10T12:00:00Z' },
    { id: 'tx-dec-5', amount: 2500, type: 'CREDIT', categoryId: 'cat-19', note: 'End of year annual bonus', date: '2026-12-05T10:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-12-05T10:00:00Z' },
    { id: 'tx-dec-6', amount: 350, type: 'DEBIT', categoryId: 'cat-15', note: 'Movie night & holiday celebration', date: '2026-12-03T19:30:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-12-03T19:30:00Z' },
    { id: 'tx-dec-7', amount: 5000, type: 'CREDIT', categoryId: 'cat-16', note: 'Monthly salary', date: '2026-12-01T09:00:00Z', status: 'CLEARED', walletId: 'wallet-1', createdAt: '2026-12-01T09:00:00Z' },
];

// Realistic fake budgets matching the expense categories and date range of dummy transactions (August 2026)
export const dummyBudgets: Budget[] = [
    {
        id: 'budget-1',
        categoryId: 'cat-4', // Groceries (spent: ETB 800) -> 66.7% (Yellow warning)
        limitAmount: 1200,
        startDate: '2026-08-01',
        endDate: '2026-08-31',
        recurring: 'monthly',
        alertThreshold: 0.8,
    },
    {
        id: 'budget-2',
        categoryId: 'cat-1', // Gas (spent: ETB 450) -> 90.0% (Red critical / danger)
        limitAmount: 500,
        startDate: '2026-08-01',
        endDate: '2026-08-31',
        recurring: 'monthly',
        alertThreshold: 0.8,
    },
    {
        id: 'budget-3',
        categoryId: 'cat-3', // Lunch (spent: ETB 250) -> 31.3% (Green safe)
        limitAmount: 800,
        startDate: '2026-08-01',
        endDate: '2026-08-31',
        recurring: 'monthly',
        alertThreshold: 0.8,
    },
    {
        id: 'budget-4',
        categoryId: 'cat-6', // Internet Package (spent: ETB 350) -> 70.0% (Yellow warning)
        limitAmount: 500,
        startDate: '2026-08-01',
        endDate: '2026-08-31',
        recurring: 'monthly',
        alertThreshold: 0.8,
    },
    {
        id: 'budget-5',
        categoryId: 'cat-8', // Subscription (spent: ETB 199) -> 99.5% (Red critical / near limit)
        limitAmount: 200,
        startDate: '2026-08-01',
        endDate: '2026-08-31',
        recurring: 'monthly',
        alertThreshold: 0.8,
    },
    {
        id: 'budget-6',
        categoryId: 'cat-2', // Breakfast (spent: ETB 120) -> 30.0% (Green safe)
        limitAmount: 400,
        startDate: '2026-08-01',
        endDate: '2026-08-31',
        recurring: 'monthly',
        alertThreshold: 0.8,
    },
    {
        id: 'budget-7',
        categoryId: 'cat-5', // Books (spent: ETB 300) -> 100.0% (Red critical / limit reached)
        limitAmount: 300,
        startDate: '2026-08-01',
        endDate: '2026-08-31',
        recurring: 'monthly',
        alertThreshold: 0.8,
    },
    {
        id: 'budget-8',
        categoryId: 'cat-7', // Skincare (spent: ETB 200) -> 66.7% (Yellow warning)
        limitAmount: 300,
        startDate: '2026-08-01',
        endDate: '2026-08-31',
        recurring: 'monthly',
        alertThreshold: 0.8,
    },
];
