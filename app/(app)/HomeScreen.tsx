// app/(app)/HomeScreen.tsx
// The main dashboard — the first screen users see after logging in.
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,    // Keeps content away from the notch and home bar
    FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Plus, TrendingUp, TrendingDown, Bell } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import useMoniVoStore from '../../store/useMoniVoStore';
import TransactionRow from '../../components/home/TransactionRow';
import { useRef, useState } from 'react';
import BalanceCards, { BalanceCardsRef } from '../../components/home/BalanceCards';
import AddTransactionModal from '../../components/modals/AddTransactionModal';


export default function HomeScreen() {
    // ── ZUSTAND SELECTORS ───────────────────────────────────────────────────────
    // Each line below "subscribes" to one piece of state.
    // When that piece changes, ONLY this component re-renders — efficient!
    const user = useMoniVoStore((state) => state.user);
    const transactions = useMoniVoStore((state) => state.transactions);
    const categories = useMoniVoStore((state) => state.categories);
    const totalBalance = useMoniVoStore((state) => state.totalBalance);
    const totalIncome = useMoniVoStore((state) => state.totalIncome);
    const totalExpenses = useMoniVoStore((state) => state.totalExpenses);
    const cardsRef = useRef<BalanceCardsRef>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'CREDIT' | 'DEBIT'>('DEBIT');
    // Only show the 5 most recent transactions on the home screen
    // .slice(0, 5) takes items from index 0 up to (not including) index 5
    const recentTransactions = transactions.slice(0, 5);

    // Helper: find a category by its ID
    // This is why we have categoryId on transactions — we look up the full category here
    const getCategoryById = (id: string) =>
        categories.find((cat) => cat.id === id);

    // ── NUMBER FORMATTING ────────────────────────────────────────────────────────
    const formatMoney = (amount: number) =>
        `ETB ${amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

    // Get the first name only — "Samuel Tesfaye" → "Samuel"
    const firstName = user?.name?.split(' ')[0] ?? 'User';

    // Get hour to determine greeting
    const hour = new Date().getHours();
    const greeting =
        hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    // ── UI ──────────────────────────────────────────────────────────────────────
    return (
        // SafeAreaView prevents content from going under the phone's notch/home bar
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="light" />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >

                {/* ── HEADER ─────────────────────────────────────────────────────── */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>{greeting} 👋</Text>
                        <Text style={styles.userName}>{firstName}</Text>
                    </View>

                    {/* Notification Bell — top right */}
                    <TouchableOpacity style={styles.bellButton}>
                        <Bell size={22} color={Colors.ivory} />
                    </TouchableOpacity>
                </View>

                {/* ── PREMIUM CREDIT CARDS ─────────────────────────────────── */}
                <BalanceCards
                    ref={cardsRef}
                    userName={user?.name ?? 'User'}
                    totalBalance={totalBalance()}
                    totalIncome={totalIncome()}
                    totalExpenses={totalExpenses()}
                />



                {/* ── ACTION BUTTONS ─────────────────────────────────────────── */}
                <View style={styles.actionsRow}>
                    <TouchableOpacity
                        style={styles.actionButtonExpense}
                        onPress={() => {
                            cardsRef.current?.scrollToExpense();
                            setModalType('DEBIT');
                            setModalVisible(true);
                        }}
                    >
                        <Plus size={18} color={Colors.background} />
                        <Text style={styles.actionButtonText}>Add Expense</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButtonIncome}
                        onPress={() => {
                            cardsRef.current?.scrollToIncome();
                            setModalType('CREDIT');
                            setModalVisible(true);
                        }}
                    >
                        <Plus size={18} color={Colors.background} />
                        <Text style={styles.actionButtonText}>Add Income</Text>
                    </TouchableOpacity>
                </View>

                {/* ── RECENT TRANSACTIONS ─────────────────────────────────────────── */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Transactions</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See all</Text>
                    </TouchableOpacity>
                </View>

                {/* We render TransactionRow for each of the 5 recent transactions */}
                {recentTransactions.length === 0 ? (
                    // Empty state — show when there are no transactions yet
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>💳</Text>
                        <Text style={styles.emptyTitle}>No transactions yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Tap "Add Expense" to log your first one
                        </Text>
                    </View>
                ) : (
                    recentTransactions.map((transaction) => (
                        // .map() loops through the array and renders a TransactionRow for each one
                        <TransactionRow
                            key={transaction.id}      // React needs a unique key for each item in a list
                            transaction={transaction}
                            category={getCategoryById(transaction.categoryId)}
                            onPress={() => console.log('Tapped:', transaction.id)}
                        // TODO: Navigate to TransactionDetailScreen in next step
                        />
                    ))
                )}

            </ScrollView>
            {/* ── ADD TRANSACTION MODAL ──────────────────────────────────── */}
            <AddTransactionModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                defaultType={modalType}
            />
        </SafeAreaView>
    );
}


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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',    // Greeting left, bell right
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
        fontSize: 23,
        fontWeight: 'bold',
        color: Colors.ivory,
    },
    bellButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    balanceCard: {
        backgroundColor: '#000000',
        borderRadius: 24,
        padding: 24,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.subtleGold + '25',
    },
    balanceLabel: {
        fontSize: 13,
        color: Colors.muted,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: 36,
        fontWeight: 'bold',
        color: Colors.champagne,         // The big gold number!
        letterSpacing: 0.5,
        marginBottom: 24,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    statIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: Colors.muted,
        marginBottom: 2,
    },
    statValue: {
        fontSize: 14,
        fontWeight: '700',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: Colors.muted + '30',
        marginHorizontal: 16,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 28,
    },
    actionButtonExpense: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#EF5350',      // Red for expense
        borderRadius: 14,
        paddingVertical: 14,
    },
    actionButtonIncome: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#4CAF50',      // Green for income
        borderRadius: 14,
        paddingVertical: 14,
    },
    actionButtonText: {
        color: Colors.background,
        fontSize: 14,
        fontWeight: 'bold',
    },
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
