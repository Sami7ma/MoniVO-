// This is the global brain of MOvivo
// Any screen can connect here to read or update data
// and when data changes all screeen update automtically

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import api from '../utils/api';

import type { Transaction } from '../types/Transaction';
import type { Category } from '../types/Category';
import type { Budget } from '../types/Budget';
import type { Wallet } from '../types/Wallet';
import type { User } from '../types/User';

import { defaultCategories } from '../constants/defaultCategories';
import { defaultWallet, dummyTransactions, dummyBudgets } from '../utils/dummyData';
import { ThemeColors } from '../constants/theme';

export const defaultMockUser: User = {
    id: 'user-someone-1',
    name: 'Someone',
    email: 'Someone@gmail.com',
    createdAt: '2026-01-01T00:00:00.000Z',
};

// 1 we define the sape of the store 
interface MoniVoStore {
    // -State (the actual data)
    user: User | null; //the logged inuser
    isLoadingAuth: boolean; // To show loading screen while checking token
    transactions: Transaction[]; // every ecen and income entry
    categories: Category[]; // user definable categories built in + user cretaed
    budgets: Budget[]; //spending limits for each category
    wallets: Wallet[];    // all wallets (cash, bank, telebirr)
    isLoadingData: boolean; // NEW: loading flag for fetching transactions/budgets

    // Action (function that change data)
    checkAuth: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    setUser: (user: User | null) => void;

    // NEW: Fetch from backend
    fetchTransactions: () => Promise<void>;
    fetchBudgets: () => Promise<void>;

    // CRUD — now talk to the backend
    addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    updateTransaction: (id: string, updated: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => Promise<void>;

    addBudget: (budget: Omit<Budget, 'id'>) => Promise<void>;
    deleteBudget: (id: string) => Promise<void>;
    updateBudget: (id: string, updated: Partial<Omit<Budget, 'id'>>) => Promise<void>;

    addCategory: (cat: Omit<Category, 'id'>) => void;
    deleteCategory: (id: string) => void;
    addWallet: (wallet: Omit<Wallet, 'id'>) => void;
    deleteWallet: (id: string) => void;
    logOut: () => Promise<void>;

    // Getters (computed values => from the states above)
    totalBalance: () => number;
    totalIncome: () => number;
    totalExpenses: () => number;
    transactionByCategory: () => Record<string, number>;

    //  theme store
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

// 2. create the store
const useMoniVoStore = create<MoniVoStore>((set, get) => ({
    user: null,
    isLoadingAuth: true,
    transactions: dummyTransactions, // Initialized with dummy data so the app works immediately
    categories: defaultCategories,
    budgets: dummyBudgets,          // Initialized with dummy data
    wallets: [defaultWallet],
    isLoadingData: false,
    theme: 'light',

    // Authentication 
    checkAuth: async () => {
        set({ isLoadingAuth: true });
        try {
            const token = await SecureStore.getItemAsync('userToken');
            const storedUser = await SecureStore.getItemAsync('userProfile');
            if (token) {
                try {
                    const { data } = await api.get('/auth/me');
                    const userObj: User = {
                        ...data,
                        id: data.id || data._id || 'user-someone-1',
                    };
                    set({ user: userObj, isLoadingAuth: false });
                } catch {
                    // Backend offline — restore local/mock user
                    const userObj: User = storedUser ? JSON.parse(storedUser) : defaultMockUser;
                    set({ 
                        user: userObj, 
                        isLoadingAuth: false,
                        transactions: get().transactions.length > 0 ? get().transactions : dummyTransactions,
                        budgets: get().budgets.length > 0 ? get().budgets : dummyBudgets,
                    });
                }
            } else {
                set({ isLoadingAuth: false });
            }
        } catch (error) {
            set({ isLoadingAuth: false });
        }
    },

    login: async (email: string, password: string) => {
        const isSomeone = (email.trim().toLowerCase() === 'someone@gmail.com' && password === 'someone1');
        try {
            const { data } = await api.post('/auth/login', { email, password });
            await SecureStore.setItemAsync('userToken', data.token || 'mock-token');
            const userObj: User = {
                ...(data.user || data),
                id: (data.user || data).id || (data.user || data)._id || 'user-someone-1',
            };
            await SecureStore.setItemAsync('userProfile', JSON.stringify(userObj));
            set({ user: userObj });
            get().fetchTransactions();
            get().fetchBudgets();
        } catch (error) {
            console.warn('Backend unavailable or login failed, using local/mock user mode:', error);
            // Local fallback — works completely offline without backend!
            const userObj: User = isSomeone
                ? defaultMockUser
                : {
                    id: `user-${Date.now()}`,
                    name: email.split('@')[0] || 'Someone',
                    email: email.trim(),
                    createdAt: new Date().toISOString(),
                };
            await SecureStore.setItemAsync('userToken', 'mock-token');
            await SecureStore.setItemAsync('userProfile', JSON.stringify(userObj));
            set({
                user: userObj,
                transactions: get().transactions.length > 0 ? get().transactions : dummyTransactions,
                budgets: get().budgets.length > 0 ? get().budgets : dummyBudgets,
            });
        }
    },

    register: async (name: string, email: string, password: string) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            await SecureStore.setItemAsync('userToken', data.token || 'mock-token');
            const userObj: User = {
                ...(data.user || data),
                id: (data.user || data).id || (data.user || data)._id || `user-${Date.now()}`,
            };
            await SecureStore.setItemAsync('userProfile', JSON.stringify(userObj));
            set({ user: userObj });
            get().fetchTransactions();
            get().fetchBudgets();
        } catch (error) {
            console.warn('Backend unavailable, creating user locally:', error);
            const userObj: User = {
                id: `user-${Date.now()}`,
                name: name.trim() || 'Someone',
                email: email.trim(),
                createdAt: new Date().toISOString(),
            };
            await SecureStore.setItemAsync('userToken', 'mock-token');
            await SecureStore.setItemAsync('userProfile', JSON.stringify(userObj));
            set({
                user: userObj,
                transactions: get().transactions.length > 0 ? get().transactions : dummyTransactions,
                budgets: get().budgets.length > 0 ? get().budgets : dummyBudgets,
            });
        }
    },

    logOut: async () => {
        try {
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('userProfile');
        } catch (e) {
            // ignore
        }
        set({
            user: null,
            transactions: dummyTransactions,
            budgets: dummyBudgets,
        });
    },

    setUser: (user) => set({ user }),

    //  Fetch from Backend (with local fallback)
    fetchTransactions: async () => {
        set({ isLoadingData: true });
        try {
            const { data } = await api.get('/transactions');
            const normalized: Transaction[] = Array.isArray(data)
                ? data.map((t: any) => ({
                    ...t,
                    id: t.id || t._id,
                }))
                : [];
            set({ 
                transactions: normalized.length > 0 ? normalized : (get().transactions.length > 0 ? get().transactions : dummyTransactions), 
                isLoadingData: false 
            });
        } catch (error) {
            console.warn('Backend unavailable, using local transactions data');
            set((state) => ({
                transactions: state.transactions.length > 0 ? state.transactions : dummyTransactions,
                isLoadingData: false,
            }));
        }
    },

    fetchBudgets: async () => {
        try {
            const { data } = await api.get('/budgets');
            const normalized: Budget[] = Array.isArray(data)
                ? data.map((b: any) => ({
                    ...b,
                    id: b.id || b._id,
                }))
                : [];
            set({ 
                budgets: normalized.length > 0 ? normalized : (get().budgets.length > 0 ? get().budgets : dummyBudgets) 
            });
        } catch (error) {
            console.warn('Backend unavailable, using local budgets data');
            set((state) => ({
                budgets: state.budgets.length > 0 ? state.budgets : dummyBudgets,
            }));
        }
    },

    //  Transactions CRUD (talks to backend with offline/local fallback)
    addTransaction: async (tx) => {
        try {
            const { data } = await api.post('/transactions', tx);
            const normalized: Transaction = {
                ...data,
                id: data.id || data._id,
            };
            set((state) => ({
                transactions: [normalized, ...state.transactions],
            }));
        } catch (error) {
            console.warn('Backend unavailable, adding transaction locally');
            const localTx: Transaction = {
                ...tx,
                id: `txn-${Date.now()}`,
                createdAt: new Date().toISOString(),
            };
            set((state) => ({
                transactions: [localTx, ...state.transactions],
            }));
        }
    },

    deleteTransaction: async (id) => {
        try {
            await api.delete(`/transactions/${id}`);
        } catch (error) {
            console.warn('Backend unavailable, deleting transaction locally');
        }
        set((state) => ({
            transactions: state.transactions.filter((tx) => tx.id !== id),
        }));
    },

    updateTransaction: async (id, updated) => {
        try {
            await api.put(`/transactions/${id}`, updated);
        } catch (error) {
            console.warn('Backend unavailable, updating transaction locally');
        }
        set((state) => ({
            transactions: state.transactions.map((tx) =>
                tx.id === id ? { ...tx, ...updated } : tx
            ),
        }));
    },

    //  Budgets CRUD (talks to backend with offline/local fallback) 
    addBudget: async (budget) => {
        try {
            const { data } = await api.post('/budgets', budget);
            const normalized: Budget = {
                ...data,
                id: data.id || data._id,
            };
            set((state) => ({
                budgets: [normalized, ...state.budgets],
            }));
        } catch (error) {
            console.warn('Backend unavailable, adding budget locally');
            const localBudget: Budget = {
                ...budget,
                id: `budget-${Date.now()}`,
            };
            set((state) => ({
                budgets: [localBudget, ...state.budgets],
            }));
        }
    },

    deleteBudget: async (id) => {
        try {
            await api.delete(`/budgets/${id}`);
        } catch (error) {
            console.warn('Backend unavailable, deleting budget locally');
        }
        set((state) => ({
            budgets: state.budgets.filter((b) => b.id !== id),
        }));
    },

    updateBudget: async (id, updated) => {
        try {
            await api.put(`/budgets/${id}`, updated);
        } catch (error) {
            console.warn('Backend unavailable, updating budget locally');
        }
        set((state) => ({
            budgets: state.budgets.map((b) =>
                b.id === id ? { ...b, ...updated } : b
            ),
        }));
    },

    //  Categories & Wallets (still local for now) 
    addCategory: (cat) => set((state) => ({
        categories: [
            ...state.categories,
            {
                ...cat,
                id: `cat-custom-${Date.now()}`,
            },
        ],
    })),

    deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter((c) => c.id !== id || c.isBuiltIn),
    })),

    addWallet: (wallet) => set((state) => ({
        wallets: [
            ...state.wallets,
            {
                ...wallet,
                id: `wallet-${Date.now()}`
            },
        ],
    })),

    deleteWallet: (id) => set((state) => ({
        wallets: state.wallets.filter((wallet) => wallet.id !== id),
    })),

    //  Getters
    totalIncome: () => {
        return get().transactions
            .filter((tx) => tx.type === 'CREDIT')
            .reduce((sum, tx) => sum + tx.amount, 0);
    },

    totalExpenses: () => {
        return get().transactions
            .filter((tx) => tx.type === 'DEBIT')
            .reduce((sum, tx) => sum + tx.amount, 0);
    },

    totalBalance: () => {
        return get().totalIncome() - get().totalExpenses();
    },

    transactionByCategory: () => {
        return get().transactions
            .filter((tx) => tx.type === 'DEBIT')
            .reduce((acc, tx) => {
                acc[tx.categoryId] = (acc[tx.categoryId] || 0) + tx.amount;
                return acc;
            }, {} as Record<string, number>);
    },

    toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light',
    })),
}));

export default useMoniVoStore;
