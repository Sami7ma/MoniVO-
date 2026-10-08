// frontend/store/useBanKoniStore.ts
// The central brain of BanKoni — 100% Local-First with SQLite, PIN & Biometrics

import { create } from 'zustand';
import * as LocalAuthentication from 'expo-local-authentication';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { hashPin, verifyPin, isHashedPin, } from '../security/pinSecurity';
import type { Transaction } from '../types/Transaction';
import type { Category } from '../types/Category';
import type { Budget } from '../types/Budget';
import type { Wallet } from '../types/Wallet';
import type { User, ExportDataPayload } from '../types/User';
import {
    initDatabase,
    getActiveUserDB,
    saveUserDB,
    setBiometricEnabledDB,
    getTransactionsDB,
    insertTransactionDB,
    updateTransactionDB,
    deleteTransactionDB,
    getBudgetsDB,
    insertBudgetDB,
    updateBudgetDB,
    deleteBudgetDB,
    getCategoriesDB,
    insertCategoryDB,
    deleteCategoryDB,
    getWalletsDB,
    insertWalletDB,
    deleteWalletDB,
    exportDatabaseToJSON,
    updateUserPinHashDB
} from '../db/database';

interface BanKoniStore {
    // State
    user: User | null;
    registeredUser: User | null;
    isBiometricSupported: boolean;
    isLoadingAuth: boolean;
    isLoadingData: boolean;
    transactions: Transaction[];
    categories: Category[];
    budgets: Budget[];
    wallets: Wallet[];
    theme: 'light' | 'dark';

    // Auth & Security
    checkAuth: () => Promise<void>;
    registerWithPin: (
        name: string,
        pin: string,
        enableBiometrics?: boolean
    ) => Promise<void>;
    loginWithPin: (pin: string) => Promise<boolean>;
    loginWithBiometrics: () => Promise<boolean>;
    enableBiometrics: (enabled: boolean) => Promise<void>;
    logOut: () => Promise<void>;
    setUser: (user: User | null) => void;

    // Backwards-compatible aliases
    login: (pincode: string) => Promise<void>;
    register: (name: string, pincode: string) => Promise<void>;

    // Data Loading
    loadAllData: () => Promise<void>;
    fetchTransactions: () => Promise<void>;
    fetchBudgets: () => Promise<void>;
    fetchCategories: () => Promise<void>;
    fetchWallets: () => Promise<void>;

    // Transaction CRUD
    addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'> | Transaction) => Promise<void>;
    updateTransaction: (
        id: string,
        updated: Partial<Omit<Transaction, 'id' | 'createdAt'>>
    ) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;

    // Budgets CRUD
    addBudget: (budget: Omit<Budget, 'id'> | Budget) => Promise<void>;
    updateBudget: (id: string, updated: Partial<Omit<Budget, 'id'>>) => Promise<void>;
    deleteBudget: (id: string) => Promise<void>;

    // Categories & Wallets CRUD
    addCategory: (cat: Omit<Category, 'id'>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    addWallet: (wallet: Omit<Wallet, 'id' | 'createdAt'>) => Promise<void>;
    deleteWallet: (id: string) => Promise<void>;

    // Telegram Bot / Data Export Pipeline
    exportDataToJSONFile: () => Promise<string | null>;
    getExportPayload: () => Promise<ExportDataPayload>;

    // Computed Getters
    totalIncome: () => number;
    totalExpenses: () => number;
    totalBalance: () => number;
    transactionByCategory: () => Record<string, number>;

    // Themes
    toggleTheme: () => void;
}

const useBanKoniStore = create<BanKoniStore>((set, get) => ({
    user: null,
    registeredUser: null,
    isBiometricSupported: false,
    isLoadingAuth: true,
    isLoadingData: false,
    transactions: [],
    categories: [],
    budgets: [],
    wallets: [],
    theme: 'light',

    // ── Authentication & Security Lifecycle ──
    checkAuth: async () => {
        set({ isLoadingAuth: true });
        try {
            await initDatabase();

            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            const canUseBiometrics = hasHardware && isEnrolled;
            set({ isBiometricSupported: canUseBiometrics });

            const active = await getActiveUserDB();
            if (active) {
                set({ registeredUser: active.user });

                // If biometric is enabled by user and hardware is ready, prompt unlock
                if (active.user.isBiometricEnabled && canUseBiometrics) {
                    const bioRes = await LocalAuthentication.authenticateAsync({
                        promptMessage: `Unlock BanKoni for ${active.user.name}`,
                        fallbackLabel: 'Use PIN',
                        disableDeviceFallback: true,
                    });

                    if (bioRes.success) {
                        set({ user: active.user });
                        await get().loadAllData();
                    } else {
                        // Keep locked on PIN screen
                        set({ user: null });
                    }
                } else {
                    // Locked on PIN screen, profile cached
                    set({ user: null });
                }
            } else {
                set({ registeredUser: null, user: null });
            }
        } catch (error) {
            console.error('Error during BanKoni checkAuth:', error);
            set({ user: null, registeredUser: null });
        } finally {
            set({ isLoadingAuth: false });
        }
    },

    registerWithPin: async (name: string, pin: string, enableBiometrics?: boolean) => {
        const cleanName = name.trim();
        const cleanPin = pin.trim();
        if (!/^\d{4,}$/.test(cleanPin)) {
            throw new Error('PIN must be at least 4 digits');
        }
        const pinHash = await hashPin(cleanPin);
        const newUser: User = {
            id: `usr_${Date.now()}`,
            name: cleanName,

            isBiometricEnabled: Boolean(enableBiometrics),
            createdAt: new Date().toISOString(),
        };
        // Save to SQLite
        await saveUserDB(newUser, pinHash);


        set({ user: newUser, registeredUser: newUser });
        await get().loadAllData();
    },

    loginWithPin: async (pin: string): Promise<boolean> => {
        const cleanPin = pin.trim();
        const active = await getActiveUserDB();
        if (!active) return false;
        const valid = await verifyPin(cleanPin, active.pinHash);
        if (!valid) return false;
        if (!isHashedPin(active.pinHash)) {
            const upgradedHash = await hashPin(cleanPin);
            await updateUserPinHashDB(active.user.id, upgradedHash);
        }
        set({ user: active.user, registeredUser: active.user });
        await get().loadAllData();
        return true;
    },

    loginWithBiometrics: async (): Promise<boolean> => {
        try {
            const active = await getActiveUserDB();
            if (!active?.user.isBiometricEnabled) return false;

            const bioRes = await LocalAuthentication.authenticateAsync({
                promptMessage: `Unlock BanKoni for ${active.user.name}`,
                fallbackLabel: 'Enter PIN',
                disableDeviceFallback: true,
            });

            if (bioRes.success) {
                set({ user: active.user, registeredUser: active.user });
                await get().loadAllData();
                return true;
            }
            return false;
        } catch (error) {
            console.warn('Biometric authentication failed:', error);
            return false;
        }
    },

    enableBiometrics: async (enabled: boolean) => {
        const user = get().user;
        if ((!user)) return;
        if (enabled) {
            const supported = await LocalAuthentication.hasHardwareAsync();
            const enrolled = await LocalAuthentication.isEnrolledAsync();
            if (!supported || !enrolled) {
                throw new Error('Biometrics are not available');
            }
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Confirm Biometeric unlock',
                disableDeviceFallback: true,
            });
            if (!result.success) {
                throw new Error('Biometeric Verification failed');
            }
        }
        await setBiometricEnabledDB(user.id, enabled);
        set({
            user: {
                ...user,
                isBiometricEnabled: enabled,
            },
        });

    },

    logOut: async () => {
        // Locks the app: user profile stays in SQLite, active session locks to PIN screen
        set({ user: null });
    },

    setUser: (user) => set({ user }),

    // Backwards-compatible adapters for older callers
    login: async (emailOrPin: string, pincode?: string) => {
        const pinToTry = (pincode && pincode.length === 4) ? pincode : emailOrPin;
        await get().loginWithPin(pinToTry);
    },

    register: async (name, pincode) => {
        if (!pincode) {
            throw new Error('A PIN is required to register.');
        }
        await get().registerWithPin(name, pincode,);
    },

    // ── Data Loading ──
    loadAllData: async () => {
        set({ isLoadingData: true });
        try {
            const [txs, cats, budgets, wallets] = await Promise.all([
                getTransactionsDB(),
                getCategoriesDB(),
                getBudgetsDB(),
                getWalletsDB(),
            ]);
            set({
                transactions: txs,
                categories: cats,
                budgets,
                wallets,
            });
        } catch (error) {
            console.error('Error loading SQLite data:', error);
        } finally {
            set({ isLoadingData: false });
        }
    },

    fetchTransactions: async () => {
        const txs = await getTransactionsDB();
        set({ transactions: txs });
    },

    fetchBudgets: async () => {
        const budgets = await getBudgetsDB();
        set({ budgets });
    },

    fetchCategories: async () => {
        const cats = await getCategoriesDB();
        set({ categories: cats });
    },

    fetchWallets: async () => {
        const wallets = await getWalletsDB();
        set({ wallets });
    },

    // ── Transaction CRUD (SQLite-backed) ──
    addTransaction: async (tx) => {
        const fullTx: Transaction = {
            ...tx,
            id: 'id' in tx && tx.id ? tx.id : `tx_${Date.now()}`,
            createdAt: 'createdAt' in tx && tx.createdAt ? tx.createdAt : new Date().toISOString(),
        };
        await insertTransactionDB(fullTx);
        set((state) => ({ transactions: [fullTx, ...state.transactions] }));
    },

    updateTransaction: async (id, updated) => {
        await updateTransactionDB(id, updated);
        set((state) => ({
            transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...updated } : t)),
        }));
    },

    deleteTransaction: async (id) => {
        await deleteTransactionDB(id);
        set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== id),
        }));
    },

    // ── Budget CRUD (SQLite-backed) ──
    addBudget: async (budget) => {
        const fullBudget: Budget = {
            ...budget,
            id: 'id' in budget && budget.id ? budget.id : `b_${Date.now()}`,
        };
        await insertBudgetDB(fullBudget);
        set((state) => ({ budgets: [fullBudget, ...state.budgets] }));
    },

    updateBudget: async (id, updated) => {
        await updateBudgetDB(id, updated);
        set((state) => ({
            budgets: state.budgets.map((b) => (b.id === id ? { ...b, ...updated } : b)),
        }));
    },

    deleteBudget: async (id) => {
        await deleteBudgetDB(id);
        set((state) => ({
            budgets: state.budgets.filter((b) => b.id !== id),
        }));
    },

    // ── Categories & Wallets CRUD ──
    addCategory: async (cat) => {
        const fullCat: Category = {
            ...cat,
            id: `cat_custom_${Date.now()}`,
        };
        await insertCategoryDB(fullCat);
        set((state) => ({ categories: [...state.categories, fullCat] }));
    },

    deleteCategory: async (id) => {
        await deleteCategoryDB(id);
        set((state) => ({
            categories: state.categories.filter((c) => c.id !== id || c.isBuiltIn),
        }));
    },

    addWallet: async (wallet) => {
        const fullWallet: Wallet = {
            ...wallet,
            id: `wallet_${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        await insertWalletDB(fullWallet);
        set((state) => ({ wallets: [...state.wallets, fullWallet] }));
    },

    deleteWallet: async (id) => {
        await deleteWalletDB(id);
        set((state) => ({
            wallets: state.wallets.filter((w) => w.id !== id),
        }));
    },

    // ── Telegram Bot / Export Pipeline ──
    getExportPayload: async (): Promise<ExportDataPayload> => {
        return await exportDatabaseToJSON();
    },

    exportDataToJSONFile: async (): Promise<string | null> => {
        try {
            const data = await exportDatabaseToJSON();
            const jsonString = JSON.stringify(data, null, 2);
            const fileName = `BanKoni_export_vault_${Date.now()}.json`;
            const baseDir = FileSystem.documentDirectory || FileSystem.cacheDirectory;
            const filePath = `${baseDir}${fileName}`;
            await FileSystem.writeAsStringAsync(filePath, jsonString, {
                encoding: FileSystem.EncodingType.UTF8,
            });
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(filePath, {
                    mimeType: 'application/json',
                    dialogTitle: 'Exporting Bankoni Vault for Telegram Bot',
                    UTI: 'public.json',
                });
            }
            return fileName;
        } catch (error) {
            console.error('Error exporting BanKoni data:', error);
            return null;
        }
    },

    // ── Computed Getters ──
    totalIncome: () => {
        return get()
            .transactions.filter((tx) => tx.type === 'CREDIT')
            .reduce((sum, tx) => sum + tx.amount, 0);
    },

    totalExpenses: () => {
        return get()
            .transactions.filter((tx) => tx.type === 'DEBIT')
            .reduce((sum, tx) => sum + tx.amount, 0);
    },

    totalBalance: () => {
        return get().totalIncome() - get().totalExpenses();
    },

    transactionByCategory: () => {
        return get()
            .transactions.filter((tx) => tx.type === 'DEBIT')
            .reduce(
                (acc, tx) => {
                    acc[tx.categoryId] = (acc[tx.categoryId] || 0) + tx.amount;
                    return acc;
                },
                {} as Record<string, number>
            );
    },

    toggleTheme: () =>
        set((state) => ({
            theme: state.theme === 'light' ? 'dark' : 'light',
        })),
}));

export default useBanKoniStore;
