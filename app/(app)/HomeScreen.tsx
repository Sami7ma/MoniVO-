// app/(app)/HomeScreen.tsx
// Main MoniVo dashboard.
// The ONLY dashboard section changed here is the old balance card.
// Everything else — header, action buttons, recent transactions, etc.
// stays in the HomeScreen.

import React, { useRef } from 'react';

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';

import {
    Plus,
    Bell,
} from 'lucide-react-native';

import { Colors } from '../../constants/colors';

import useMoniVoStore from '../../store/useMoniVoStore';

import TransactionRow from '../../components/home/TransactionRow';

import BalanceCards, {
    BalanceCardsRef,
} from '../../components/home/BalanceCards';

export default function HomeScreen() {
    // ─────────────────────────────────────────────────────────────────────────
    // ZUSTAND
    // ─────────────────────────────────────────────────────────────────────────

    const user = useMoniVoStore((state) => state.user);

    const transactions = useMoniVoStore(
        (state) => state.transactions
    );

    const categories = useMoniVoStore(
        (state) => state.categories
    );

    const totalBalance = useMoniVoStore(
        (state) => state.totalBalance
    );

    const totalIncome = useMoniVoStore(
        (state) => state.totalIncome
    );

    const totalExpenses = useMoniVoStore(
        (state) => state.totalExpenses
    );

    // ─────────────────────────────────────────────────────────────────────────
    // BALANCE CARDS REF
    // ─────────────────────────────────────────────────────────────────────────

    const balanceCardsRef =
        useRef<BalanceCardsRef>(null);

    // ─────────────────────────────────────────────────────────────────────────
    // RECENT TRANSACTIONS
    // ─────────────────────────────────────────────────────────────────────────

    const recentTransactions =
        transactions.slice(0, 5);

    // ─────────────────────────────────────────────────────────────────────────
    // CATEGORY HELPER
    // ─────────────────────────────────────────────────────────────────────────

    const getCategoryById = (id: string) =>
        categories.find((cat) => cat.id === id);

    // ─────────────────────────────────────────────────────────────────────────
    // USER
    // ─────────────────────────────────────────────────────────────────────────

    const firstName =
        user?.name?.split(' ')[0] ?? 'User';

    // ─────────────────────────────────────────────────────────────────────────
    // GREETING
    // ─────────────────────────────────────────────────────────────────────────

    const hour = new Date().getHours();

    const greeting =
        hour < 12
            ? 'Good morning'
            : hour < 17
                ? 'Good afternoon'
                : 'Good evening';

    // ─────────────────────────────────────────────────────────────────────────
    // UI
    // ─────────────────────────────────────────────────────────────────────────

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="light" />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={
                    styles.scrollContent
                }
            >
                {/* ───────────────────────────────────────────────────────────── */}
                {/* HEADER — UNCHANGED */}
                {/* ───────────────────────────────────────────────────────────── */}

                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>
                            {greeting} 👋
                        </Text>

                        <Text style={styles.userName}>
                            {firstName}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.bellButton}
                    >
                        <Bell
                            size={22}
                            color={Colors.ivory}
                        />
                    </TouchableOpacity>
                </View>

                {/* ───────────────────────────────────────────────────────────── */}
                {/* PREMIUM SWIPEABLE BALANCE / INCOME / EXPENSE CARDS */}
                {/* ───────────────────────────────────────────────────────────── */}

                <BalanceCards
                    ref={balanceCardsRef}
                    userName={
                        user?.name ?? 'MoniVo User'
                    }
                    totalBalance={totalBalance()}
                    totalIncome={totalIncome()}
                    totalExpenses={totalExpenses()}
                />

                {/* ───────────────────────────────────────────────────────────── */}
                {/* ACTION BUTTONS — UNCHANGED */}
                {/* ───────────────────────────────────────────────────────────── */}

                <View style={styles.actionsRow}>
                    <TouchableOpacity
                        style={
                            styles.actionButtonExpense
                        }
                    >
                        <Plus
                            size={18}
                            color={Colors.background}
                        />

                        <Text
                            style={
                                styles.actionButtonText
                            }
                        >
                            Add Expense
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={
                            styles.actionButtonIncome
                        }
                    >
                        <Plus
                            size={18}
                            color={Colors.background}
                        />

                        <Text
                            style={
                                styles.actionButtonText
                            }
                        >
                            Add Income
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* ───────────────────────────────────────────────────────────── */}
                {/* RECENT TRANSACTIONS — UNCHANGED */}
                {/* ───────────────────────────────────────────────────────────── */}

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Recent Transactions
                    </Text>

                    <TouchableOpacity>
                        <Text style={styles.seeAll}>
                            See all
                        </Text>
                    </TouchableOpacity>
                </View>

                {recentTransactions.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text
                            style={styles.emptyIcon}
                        >
                            💳
                        </Text>

                        <Text
                            style={styles.emptyTitle}
                        >
                            No transactions yet
                        </Text>

                        <Text
                            style={
                                styles.emptySubtitle
                            }
                        >
                            Tap "Add Expense" to log
                            your first one
                        </Text>
                    </View>
                ) : (
                    recentTransactions.map(
                        (transaction) => (
                            <TransactionRow
                                key={transaction.id}
                                transaction={
                                    transaction
                                }
                                category={getCategoryById(
                                    transaction.categoryId
                                )}
                                onPress={() =>
                                    console.log(
                                        'Tapped:',
                                        transaction.id
                                    )
                                }
                            />
                        )
                    )
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 32,
    },

    // ─────────────────────────────────────────────────────────────────────────
    // HEADER
    // ─────────────────────────────────────────────────────────────────────────

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        paddingTop: 16,
        marginBottom: 24,
    },

    greeting: {
        fontSize: 14,
        color: Colors.muted,
        marginBottom: 2,
    },

    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.ivory,
    },

    bellButton: {
        width: 44,
        height: 44,

        borderRadius: 22,

        backgroundColor:
            Colors.surface,

        alignItems: 'center',
        justifyContent: 'center',
    },

    // ─────────────────────────────────────────────────────────────────────────
    // ACTION BUTTONS
    // ─────────────────────────────────────────────────────────────────────────

    actionsRow: {
        flexDirection: 'row',

        gap: 12,

        marginTop: 20,
        marginBottom: 28,
    },

    actionButtonExpense: {
        flex: 1,

        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'center',

        gap: 8,

        backgroundColor: '#EF5350',

        borderRadius: 14,

        paddingVertical: 14,
    },

    actionButtonIncome: {
        flex: 1,

        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'center',

        gap: 8,

        backgroundColor: '#4CAF50',

        borderRadius: 14,

        paddingVertical: 14,
    },

    actionButtonText: {
        color: Colors.background,

        fontSize: 14,

        fontWeight: 'bold',
    },

    // ─────────────────────────────────────────────────────────────────────────
    // RECENT TRANSACTIONS
    // ─────────────────────────────────────────────────────────────────────────

    sectionHeader: {
        flexDirection: 'row',

        justifyContent: 'space-between',

        alignItems: 'center',

        marginBottom: 12,
    },

    sectionTitle: {
        fontSize: 18,

        fontWeight: 'bold',

        color: Colors.ivory,
    },

    seeAll: {
        fontSize: 14,

        color: Colors.champagne,

        fontWeight: '500',
    },

    // ─────────────────────────────────────────────────────────────────────────
    // EMPTY STATE
    // ─────────────────────────────────────────────────────────────────────────

    emptyState: {
        alignItems: 'center',

        paddingVertical: 40,

        gap: 8,
    },

    emptyIcon: {
        fontSize: 48,

        marginBottom: 8,
    },

    emptyTitle: {
        fontSize: 16,

        fontWeight: '600',

        color: Colors.ivory,
    },

    emptySubtitle: {
        fontSize: 14,

        color: Colors.muted,

        textAlign: 'center',
    },
});