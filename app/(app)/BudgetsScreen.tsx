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
    const spentByBudget = useMemo(() => {

        const spentMap: Record<string, number> = {};

        budgets.forEach((budget) => {

            const startDate = new Date(budget.startDate);
            const endDate = new Date(budget.endDate);

            // Include the complete end date.
            endDate.setHours(23, 59, 59, 999);

            const totalSpent = transactions
                .filter((tx) => {

                    // Only expenses count toward a budget.
                    if (tx.type !== 'DEBIT') {
                        return false;
                    }

                    // Only transactions belonging to this
                    // budget's category count.
                    if (tx.categoryId !== budget.categoryId) {
                        return false;
                    }

                    const txDate = new Date(tx.date);

                    // Transaction must fall inside this budget's
                    // start and end dates.
                    return txDate >= startDate && txDate <= endDate;
                })
                .reduce((sum, tx) => sum + tx.amount, 0);

            spentMap[budget.id] = totalSpent;
        });

        return spentMap;

    }, [transactions, budgets]);

    // ── DELETE HANDLER ───────────────────────────────────────

    const handleDelete = (
        budgetId: string,
        categoryName: string
    ) => {

        Alert.alert(
            "Remove Budget",
            `Remove the budget for ${categoryName}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: () => deleteBudget(budgetId),
                },
            ]
        );
    };

    // ── SUMMARY ──────────────────────────────────────────────

    const totalBudgeted = budgets.reduce(
        (sum, budget) => sum + budget.limitAmount,
        0
    );

    const totalSpent = budgets.reduce(
        (sum, budget) => sum + (spentByBudget[budget.id] || 0),
        0
    );

    // ── UI ──────────────────────────────────────────────────

    return (
        <SafeAreaView
            style={styles.safeArea}
            edges={["top", "left", "right"]}
        >

            <StatusBar style={colors.statusBar} />

            {/* HEADER */}

            <View style={styles.header}>

                <View>

                    <Text style={styles.headerTitle}>
                        Budgets
                    </Text>

                    <Text style={styles.headerSubtitle}>
                        {budgets.length} active budget
                        {budgets.length !== 1 ? "s" : ""}
                    </Text>

                </View>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.8}
                >

                    <Plus
                        size={20}
                        color={colors.background}
                    />

                </TouchableOpacity>

            </View>

            {/* SUMMARY */}

            {budgets.length > 0 && (

                <View style={styles.summaryRow}>

                    <View style={styles.summaryItem}>

                        <Text style={styles.summaryLabel}>
                            Total Budgeted
                        </Text>

                        <Text style={styles.summaryValue}>
                            ETB {totalBudgeted.toLocaleString()}
                        </Text>

                    </View>

                    <View style={styles.summaryDivider} />

                    <View style={styles.summaryItem}>

                        <Text style={styles.summaryLabel}>
                            Total Spent
                        </Text>

                        <Text
                            style={[
                                styles.summaryValue,
                                {
                                    color:
                                        totalSpent > totalBudgeted
                                            ? colors.danger
                                            : colors.success,
                                },
                            ]}
                        >
                            ETB {totalSpent.toLocaleString()}
                        </Text>

                    </View>

                </View>

            )}

            {/* BUDGET LIST */}

            <FlatList
                data={budgets}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}

                renderItem={({ item }) => {

                    const category =
                        getCategoryById(item.categoryId);

                    return (
                        <BudgetCard
                            budget={item}
                            category={category}
                            spent={spentByBudget[item.id] || 0}
                            onDelete={() =>
                                handleDelete(
                                    item.id,
                                    category?.name ?? "Unknown"
                                )
                            }
                        />
                    );
                }}

                ListEmptyComponent={

                    <View style={styles.emptyState}>

                        <Text style={styles.emptyIcon}>
                            📊
                        </Text>

                        <Text style={styles.emptyTitle}>
                            No budgets yet
                        </Text>

                        <Text style={styles.emptySubtitle}>
                            Tap + to set your first spending limit
                        </Text>

                    </View>
                }
            />
            <AddBudgetModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
        </SafeAreaView>
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
            paddingTop: 80,
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