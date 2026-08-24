import React, { useState, useMemo } from "react";

import {
    Text,
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Plus } from "lucide-react-native";

import useTheme from "../../hooks/useTheme";
import useMoniVoStore from "../../store/useMoniVoStore";
import BudgetCard from "../../components/home/BudgetCard";
import AddBudgetModal from '../../components/modals/AddBudgetModal';


export default function BudgetsScreen() {

    // Get current theme
    const colors = useTheme();
    const styles = createStyles(colors);

    // ── ZUSTAND ──────────────────────────────────────────────

    const budgets = useMoniVoStore((state) => state.budgets);
    const transactions = useMoniVoStore((state) => state.transactions);
    const categories = useMoniVoStore((state) => state.categories);
    const deleteBudget = useMoniVoStore((state) => state.deleteBudget);

    // ── LOCAL STATE ──────────────────────────────────────────

    const [modalVisible, setModalVisible] = useState(false);

    // ── HELPERS ──────────────────────────────────────────────

    const getCategoryById = (id: string) =>
        categories.find((cat) => cat.id === id);

    // ── CALCULATE SPENT PER CATEGORY ─────────────────────────

    // Calculate how much was spent inside each budget's
    // own start and end dates.
    // for now we use this month oly 

    const spendByCategory = useMemo(() => {
        // Get the current month's start ans end dates
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth());

        // build a map:{categoryID: totalSpent}
        const spentMap: Record<string, number> = {};
        transactions.filter((tx) => {
            // onlu count DEBIT (expenses), not income
            if (tx.type !== 'DEBIT') return false;
            // only count transactions from thsi month
            const txDate = new Date(tx.date);
            return txDate >= monthStart && txDate <= monthEnd;
        }).forEach((tx) => {
            // add up spending per category
            spentMap[tx.categoryId] = (spentMap[tx.categoryId] || 0 + tx.amount);
        });
        return spentMap;
    }, [transactions]);

    // ── DELETE HANDLER ───────────────────────────────────────

    const handleDelete = (budgetId: string, categoryName: string) => {

        Alert.alert(
            "Delete Budget", // title 
            `Remove the budget for ${categoryName}?`, // message 
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete', style: 'destructive',
                    onPress: () => deleteBudget(budgetId)
                }
            ]
        );
    };

    //SUMMARY 
    const totalBudgeted = budgets.reduce(
        (sum, budget) => sum + budget.limitAmount,
        0
    );

    const totalSpent = budgets.reduce(
        (sum, budget) => sum + (spendByCategory[budget.id] || 0), 0
    );

    // ── UI ──────────────────────────────────────────────────

    return (
        <SafeAreaView>
            <StatusBar />
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Budgets</Text>
                    <Text style={styles.headerSubtitle}>
                        {budgets.length} active budget{budgets.length !== 1 ? 's' : ''}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.8}
                >
                    <Plus size={20} color={colors.background} />
                </TouchableOpacity>
            </View>
            {/* summary row */}
            {budgets.length > 0 && (
                <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Total Budgeted</Text>
                        <Text style={styles.summaryValue}>
                            ETB {totalBudgeted.toLocaleString()}
                        </Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Total Spent</Text>
                        <Text style={[
                            styles.summaryValue,
                            {
                                color: totalSpent > totalBudgeted
                                    ? colors.danger
                                    : colors.success
                            },
                        ]}>
                            ETB {totalSpent.toLocaleString()}
                        </Text>
                    </View>
                </View>
            )}

            {/* Budger */}
            <FlatList
                data={budgets}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <BudgetCard
                        budget={item}
                        category={getCategoryById(item.categoryId)}
                        spent={spendByCategory[item.categoryId] || 0}
                        onDelete={() =>
                            handleDelete(
                                item.id,
                                getCategoryById(item.categoryId)?.name ?? 'Unknown'
                            )
                        }
                    />
                )}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>an empty icon here</Text>
                        <Text style={styles.emptyTitle}>No budgets yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Tap + to set your first spending limit
                        </Text>
                    </View>
                }
            />
        </SafeAreaView >

    );
}

const createStyles = (
    colors: ReturnType<typeof useTheme>
) =>
    StyleSheet.create({

        safeArea: {
            flex: 1,
            backgroundColor: colors.background,
        },

        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingTop: 16,
            paddingBottom: 12,
        },

        headerTitle: {
            fontSize: 28,
            fontWeight: "bold",
            color: colors.textPrimary,
        },

        headerSubtitle: {
            fontSize: 14,
            color: colors.textSecondary,
            marginTop: 2,
        },

        addButton: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.champagne,
            alignItems: "center",
            justifyContent: "center",
        },

        summaryRow: {
            flexDirection: "row",
            marginHorizontal: 10,
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 10,
            marginBottom: 5,
            borderWidth: 1,
            borderColor: colors.border,
        },

        summaryItem: {
            flex: 1,
            alignItems: "center",
            gap: 4,
        },

        summaryLabel: {
            fontSize: 12,
            color: colors.textSecondary,
            textTransform: "uppercase",
            letterSpacing: 0.5,
        },

        summaryValue: {
            fontSize: 18,
            fontWeight: "700",
            color: colors.textPrimary,
        },

        summaryDivider: {
            width: 1,
            backgroundColor: colors.border,
            marginHorizontal: 12,
        },

        listContent: {
            paddingHorizontal: 10,
            paddingBottom: 32,
        },

        emptyState: {
            alignItems: "center",
            paddingTop: 100,
            gap: 8,
        },

        emptyIcon: {
            fontSize: 48,
            marginBottom: 8,
        },

        emptyTitle: {
            fontSize: 16,
            fontWeight: "600",
            color: colors.textPrimary,
        },

        emptySubtitle: {
            fontSize: 14,
            color: colors.textSecondary,
            textAlign: "center",
        },
    });