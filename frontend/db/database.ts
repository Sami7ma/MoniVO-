import * as SQLite from 'expo-sqlite';
import type { Transaction } from '../types/Transaction';
import type { Budget } from '../types/Budget';
import type { Category } from '../types/Category';
import type { Wallet } from '../types/Wallet';
import type { User } from '../types/User';
import { defaultCategories } from '../constants/defaultCategories';
import { defaultWallet, dummyBudgets, dummyTransactions } from '../utils/dummyData';

const DB_NAME = 'bankoni.db';

// Singleton DB connection instance
let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (!dbInstance) {
        dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
    }
    return dbInstance;
}


// 1. DATABASE INITIALIZATION & SCHEMA DEFINITION

export async function initDatabase(): Promise<void> {
    const db = await getDatabase();

    // Enable WAL mode for high concurrency & Foreign Keys for integrity
    await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      avatar_url TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon_key TEXT NOT NULL,
      color_key TEXT,
      flow TEXT CHECK(flow IN ('EXPENSE', 'INCOME')) NOT NULL,
      essential INTEGER NOT NULL DEFAULT 0,
      recurring INTEGER NOT NULL DEFAULT 0,
      is_built_in INTEGER NOT NULL DEFAULT 0,
      is_custom INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS wallets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      balance REAL NOT NULL DEFAULT 0.0,
      currency TEXT NOT NULL DEFAULT 'ETB',
      is_default INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      amount REAL NOT NULL,
      type TEXT CHECK(type IN ('CREDIT', 'DEBIT')) NOT NULL,
      category_id TEXT NOT NULL,
      note TEXT,
      date TEXT NOT NULL,
      status TEXT CHECK(status IN ('PENDING', 'CLEARED')) NOT NULL DEFAULT 'CLEARED',
      wallet_id TEXT NOT NULL,
      current_balance REAL,
      source TEXT DEFAULT 'manual',
      raw_sms TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS budgets (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL,
      limit_amount REAL NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      recurring TEXT DEFAULT 'monthly',
      alert_threshold REAL DEFAULT 0.8
    );
  `);

    // Auto-seed initial baseline data if tables are empty
    await seedInitialData(db);
}


// 2. SEEDING LOGIC (First-run bootstrap)

async function seedInitialData(db: SQLite.SQLiteDatabase): Promise<void> {
    // Check categories
    const catCountResult = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM categories;'
    );
    if (!catCountResult || catCountResult.count === 0) {
        for (const cat of defaultCategories) {
            await db.runAsync(
                `INSERT INTO categories (id, name, icon_key, color_key, flow, essential, recurring, is_built_in, is_custom)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                [
                    cat.id,
                    cat.name,
                    cat.iconKey,
                    cat.colorKey || null,
                    cat.flow,
                    cat.essential ? 1 : 0,
                    cat.recurring ? 1 : 0,
                    cat.isBuiltIn ? 1 : 0,
                    cat.isCustom ? 1 : 0,
                ]
            );
        }
    }

    // Check wallets
    const walletCountResult = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM wallets;'
    );
    if (!walletCountResult || walletCountResult.count === 0) {
        await db.runAsync(
            `INSERT INTO wallets (id, name, icon, balance, currency, is_default, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
            [
                defaultWallet.id,
                defaultWallet.name,
                defaultWallet.icon,
                defaultWallet.balance,
                defaultWallet.currency,
                defaultWallet.isDefault ? 1 : 0,
                defaultWallet.createdAt,
            ]
        );
    }

    // Check budgets
    const budgetCountResult = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM budgets;'
    );
    if (!budgetCountResult || budgetCountResult.count === 0) {
        for (const b of dummyBudgets) {
            await db.runAsync(
                `INSERT INTO budgets (id, category_id, limit_amount, start_date, end_date, recurring, alert_threshold)
         VALUES (?, ?, ?, ?, ?, ?, ?);`,
                [
                    b.id,
                    b.categoryId,
                    b.limitAmount,
                    b.startDate,
                    b.endDate,
                    b.recurring || 'monthly',
                    b.alertThreshold ?? 0.8,
                ]
            );
        }
    }

    // Check transactions
    const txCountResult = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM transactions;'
    );
    if (!txCountResult || txCountResult.count === 0) {
        for (const tx of dummyTransactions) {
            await db.runAsync(
                `INSERT INTO transactions (id, amount, type, category_id, note, date, status, wallet_id, current_balance, source, raw_sms, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                [
                    tx.id,
                    tx.amount,
                    tx.type,
                    tx.categoryId,
                    tx.note || '',
                    tx.date,
                    tx.status,
                    tx.walletId,
                    tx.currentBalance ?? null,
                    'manual',
                    null,
                    tx.createdAt,
                ]
            );
        }
    }
}


// 3. TRANSACTIONS CRUD REPOSITORY

export async function getTransactionsDB(): Promise<Transaction[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<any>(
        'SELECT * FROM transactions ORDER BY date DESC;'
    );

    return rows.map((r) => ({
        id: r.id,
        amount: Number(r.amount),
        type: r.type,
        categoryId: r.category_id,
        note: r.note || '',
        date: r.date,
        status: r.status,
        walletId: r.wallet_id,
        currentBalance: r.current_balance != null ? Number(r.current_balance) : undefined,
        createdAt: r.created_at,
    }));
}

export async function insertTransactionDB(tx: Transaction): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
        `INSERT INTO transactions (id, amount, type, category_id, note, date, status, wallet_id, current_balance, source, raw_sms, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
            tx.id,
            tx.amount,
            tx.type,
            tx.categoryId,
            tx.note || '',
            tx.date,
            tx.status,
            tx.walletId,
            tx.currentBalance ?? null,
            'manual',
            null,
            tx.createdAt,
        ]
    );
}

export async function updateTransactionDB(
    id: string,
    updated: Partial<Omit<Transaction, 'id' | 'createdAt'>>
): Promise<void> {
    const db = await getDatabase();
    const fields: string[] = [];
    const values: any[] = [];

    if (updated.amount !== undefined) {
        fields.push('amount = ?');
        values.push(updated.amount);
    }
    if (updated.type !== undefined) {
        fields.push('type = ?');
        values.push(updated.type);
    }
    if (updated.categoryId !== undefined) {
        fields.push('category_id = ?');
        values.push(updated.categoryId);
    }
    if (updated.note !== undefined) {
        fields.push('note = ?');
        values.push(updated.note);
    }
    if (updated.date !== undefined) {
        fields.push('date = ?');
        values.push(updated.date);
    }
    if (updated.status !== undefined) {
        fields.push('status = ?');
        values.push(updated.status);
    }
    if (updated.walletId !== undefined) {
        fields.push('wallet_id = ?');
        values.push(updated.walletId);
    }
    if (updated.currentBalance !== undefined) {
        fields.push('current_balance = ?');
        values.push(updated.currentBalance);
    }

    if (fields.length === 0) return;

    values.push(id);
    await db.runAsync(
        `UPDATE transactions SET ${fields.join(', ')} WHERE id = ?;`,
        values
    );
}

export async function deleteTransactionDB(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM transactions WHERE id = ?;', [id]);
}


// 4. BUDGETS CRUD REPOSITORY

export async function getBudgetsDB(): Promise<Budget[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<any>('SELECT * FROM budgets;');

    return rows.map((b) => ({
        id: b.id,
        categoryId: b.category_id,
        limitAmount: Number(b.limit_amount),
        startDate: b.start_date,
        endDate: b.end_date,
        recurring: b.recurring,
        alertThreshold: b.alert_threshold ? Number(b.alert_threshold) : 0.8,
    }));
}

export async function insertBudgetDB(budget: Budget): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
        `INSERT INTO budgets (id, category_id, limit_amount, start_date, end_date, recurring, alert_threshold)
     VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [
            budget.id,
            budget.categoryId,
            budget.limitAmount,
            budget.startDate,
            budget.endDate,
            budget.recurring || 'monthly',
            budget.alertThreshold ?? 0.8,
        ]
    );
}

export async function updateBudgetDB(
    id: string,
    updated: Partial<Omit<Budget, 'id'>>
): Promise<void> {
    const db = await getDatabase();
    const fields: string[] = [];
    const values: any[] = [];

    if (updated.categoryId !== undefined) {
        fields.push('category_id = ?');
        values.push(updated.categoryId);
    }
    if (updated.limitAmount !== undefined) {
        fields.push('limit_amount = ?');
        values.push(updated.limitAmount);
    }
    if (updated.startDate !== undefined) {
        fields.push('start_date = ?');
        values.push(updated.startDate);
    }
    if (updated.endDate !== undefined) {
        fields.push('end_date = ?');
        values.push(updated.endDate);
    }
    if (updated.recurring !== undefined) {
        fields.push('recurring = ?');
        values.push(updated.recurring);
    }
    if (updated.alertThreshold !== undefined) {
        fields.push('alert_threshold = ?');
        values.push(updated.alertThreshold);
    }

    if (fields.length === 0) return;

    values.push(id);
    await db.runAsync(
        `UPDATE budgets SET ${fields.join(', ')} WHERE id = ?;`,
        values
    );
}

export async function deleteBudgetDB(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM budgets WHERE id = ?;', [id]);
}

// 5. CATEGORIES CRUD REPOSITORY
export async function getCategoriesDB(): Promise<Category[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<any>('SELECT * FROM categories;');

    return rows.map((c) => ({
        id: c.id,
        name: c.name,
        iconKey: c.icon_key,
        colorKey: c.color_key || undefined,
        flow: c.flow,
        essential: Boolean(c.essential),
        recurring: Boolean(c.recurring),
        isBuiltIn: Boolean(c.is_built_in),
        isCustom: Boolean(c.is_custom),
    }));
}

export async function insertCategoryDB(category: Category): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
        `INSERT INTO categories (id, name, icon_key, color_key, flow, essential, recurring, is_built_in, is_custom)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
            category.id,
            category.name,
            category.iconKey,
            category.colorKey || null,
            category.flow,
            category.essential ? 1 : 0,
            category.recurring ? 1 : 0,
            category.isBuiltIn ? 1 : 0,
            category.isCustom ? 1 : 0,
        ]
    );
}

export async function deleteCategoryDB(id: string): Promise<void> {
    const db = await getDatabase();
    // Prevent deleting built-in categories
    await db.runAsync('DELETE FROM categories WHERE id = ? AND is_built_in = 0;', [id]);
}

// 6. WALLETS CRUD REPOSITORY
export async function getWalletsDB(): Promise<Wallet[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<any>('SELECT * FROM wallets;');

    return rows.map((w) => ({
        id: w.id,
        name: w.name,
        icon: w.icon,
        balance: Number(w.balance),
        currency: w.currency,
        isDefault: Boolean(w.is_default),
        createdAt: w.created_at,
    }));
}

export async function insertWalletDB(wallet: Wallet): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
        `INSERT INTO wallets (id, name, icon, balance, currency, is_default, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [
            wallet.id,
            wallet.name,
            wallet.icon,
            wallet.balance,
            wallet.currency,
            wallet.isDefault ? 1 : 0,
            wallet.createdAt,
        ]
    );
}

export async function deleteWalletDB(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM wallets WHERE id = ?;', [id]);
}

// 7. USER PROFILE REPOSITORY
export async function getUserDB(id: string): Promise<User | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<any>(
        'SELECT * FROM users WHERE id = ?;',
        [id]
    );
    if (!row) return null;
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        avatarUrl: row.avatar_url || undefined,
        createdAt: row.created_at,
    };
}

export async function saveUserDB(user: User): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
        `INSERT OR REPLACE INTO users (id, name, email, avatar_url, created_at)
     VALUES (?, ?, ?, ?, ?);`,
        [user.id, user.name, user.email, user.avatarUrl || null, user.createdAt]
    );
}
