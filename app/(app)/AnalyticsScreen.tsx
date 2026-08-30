// this page reads transacion form Zustand
// has period tabs(Week, Month, Year)
// Data Flow:
// 1. Read transactions + categories from Zustand
// 2. User selects period: Week / Month / Year
// 3. Group expenses by day/week/month into chart data
// 4. Also compute top spending categories with percentages
// 5. Pass chart data to SpendingLineChart

// why useMemo?
// Groupn hunderds fo transacon by date is expesnive
// UseMemo caches the result - onl recalculates when
// transaction or the selected periond changes

// why useState?
// to track the active tab (Week/Month/Year)
// when user taps a tab, useState updates,
// component re-renders with the new period

import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../hooks/useTheme";
import useMoniVoStore from '../../store/useMoniVoStore';
import SpendingLineChart from "../../components/common/charts/SpendingPiechart";
import { FileVideoIcon, TrendingUp, TrendingDown, } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";

// period tabs
type Period = 'Week' | 'Month' | 'Year';

// Each category gets a unique dot color.
const CATEGORY_COLORS = [
    '#C9A84C', '#E74C3C', '#2ECC71', '#3498DB',
    '#9B59B6', '#E67E22', '#1ABC9C', '#F39C12',
    '#E91E63', '#00BCD4', '#8BC34A', '#FF5722',
];
// helper get month name shor
const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
// helpert get date name short
const DAY_NAMES = [
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
];
// helper format curreny
const formatCurrency = (amount: number): string => {
    return `ETB ${amount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;
};
export default function AnalyticsScreen() {
    const colors = useTheme();
    const styles = createStyles(colors);

    // local state
    const [period, setPeriod] = useState<Period>('Month');
    // get data form zustand
    const transactions = useMoniVoStore((state) => state.transactions);
    const categories = useMoniVoStore((state) => state.categories);
    const totalIncome = useMoniVoStore((state) => state.totalIncome);
    const totalExpenses = useMoniVoStore((state) => state.totalExpenses);

    // helper: find category name by ID
    const getCategoryName = (id: string) => categories.find((cat) => cat.id === id)?.name ?? 'Unknown'

    // compute char data based on selected period
    // this is the hear of the ansalyisc scren
    // It groups expenses into time buckets for the chart.
    const chartData = useMemo(() => {
        const now = new Date();
        const expenses = transactions.filter((tx) => tx.type === 'DEBIT');
        if (period === 'Week') {
            // creaet 7 buckets, one per day
            const labels: string[] = [];
            const values: number[] = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(now.getDate() - i);
                const dateStr = d.toDateString().split('T')[0];
                // label "MON", "TUE" from d
                labels.push(DAY_NAMES[d.getDay()]);
                // sum all expenses for that day
                const dayTotal = expenses
                    .filter((tx) => tx.date.split('T')[0] === dateStr)
                    .reduce((sum, tx) => sum + tx.amount, 0);
                values.push(dayTotal);
            }
            return { labels, values };
        }
        if (period == 'Month') {
            const labels: string[] = [];
            const values: number[] = [];
            for (let i = 3; i >= 0; i--) {
                const weekEnd = new Date(now);
                // this is geeting week end by subtracting 7 dates for each iteration
                weekEnd.setDate(now.getDate() - (i * 7));
                const weekStart = new Date(weekEnd);
                weekStart.setDate(weekEnd.getDate() - 6);
                labels.push(
                    `${MONTH_NAMES[weekStart.getMonth()]}  ${weekStart.getDate()}`
                );
                const startStr = weekStart.toDateString().split('T')[0];
                const endStr = weekEnd.toDateString().split('T')[0];
                // sum all expenses for this week
                const weekTotal = expenses
                    .filter((tx) => {
                        const txDate = tx.date.split('T')[0];
                        return txDate >= startStr && txDate <= endStr;
                    })
                    .reduce((sum, tx) => sum + tx.amount, 0);
                values.push(weekTotal);
            }
            return { labels, values };
        }
        // YEAR: show last 6 months
        const labels: string[] = [];
        const values: number[] = [];
        for (let i = 5; i >= 0; i--) {
            const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthIndex = monthDate.getMonth();
            const year = monthDate.getFullYear();
            // Label: "Jun", "Jul", etc.
            labels.push(MONTH_NAMES[monthIndex]);
            // Sum all expenses in this month
            const monthTotal = expenses
                .filter((tx) => {
                    const txDate = new Date(tx.date);
                    return txDate.getMonth() === monthIndex
                        && txDate.getFullYear() === year;
                })
                .reduce((sum, tx) => sum + tx.amount, 0);
            values.push(monthTotal);
        }
        return { labels, values };
    }, [transactions, period]);
    // compute top spending categories
    // group all expenses by category, sum, sort by highest spend
    const topSpending = useMemo(() => {
        const expenses = transactions.filter((tx) => tx.type === 'DEBIT');
        // reduce() builds: { "cat-1": 500, "cat-4": 200, ... }
        const grouped = expenses.reduce((acc, tx) => {
            acc[tx.categoryId] = (acc[tx.categoryId] || 0) + tx.amount;
            return acc;
        }, {} as Record<string, number>);
        // Convert to array, add names + colors, sort highest first
        return Object.entries(grouped)
            .map(([categoryId, amount], index) => ({
                categoryId,
                name: getCategoryName(categoryId),
                amount,
                color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
            }))
            .sort((a, b) => b.amount - a.amount);
    }, [transactions, categories]);
    // Total spent(for percentage calucation)
    const totalSpent = topSpending.reduce((sum, cat) => sum + cat.amount, 0);
    // UI
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style={colors.statusBar} />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Analytics</Text>
                <Text style={styles.headerSubtitle}>
                    Your spending overview
                </Text>
            </View>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* summary cards */}
                <View style={styles.summaryRow}>
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryIconRow}>
                            <TrendingUp size={18} color={colors.success} />
                            <Text style={styles.summaryLabel}>
                                Income
                            </Text>
                        </View>
                        <Text style={[styles.summaryAmount, { color: colors.success }]}>
                            ETB {totalIncome().toLocaleString()}
                        </Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryIconRow}>
                            <TrendingDown size={18} color={colors.danger} />
                            <Text style={styles.summaryLabel}>Expenses</Text>
                        </View>
                        <Text
                            style={[styles.summaryAmount, { color: colors.danger }]}
                        >
                            ETB {totalExpenses().toLocaleString()}
                        </Text>
                    </View>
                </View>
            </ScrollView>

        </SafeAreaView>
    )
}
const createStyles = (colors: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: colors.background,
        },
        // HEADER
        header: {
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 12,
        },
        headerTitle: {
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.textPrimary,
        },
        headerSubtitle: {
            fontSize: 14,
            color: colors.textSecondary,
            marginTop: 2,
        },
        scrollContent: {
            paddingHorizontal: 16,
            paddingBottom: 32,
            gap: 20,
        },
        // SUMMARY ROW
        summaryRow: {
            flexDirection: 'row',
            gap: 12,
        },
        summaryCard: {
            flex: 1,
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            gap: 10,
            borderWidth: 1,
            borderColor: colors.border,
        },
        summaryIconRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        summaryLabel: {
            fontSize: 13,
            fontWeight: '600',
            color: colors.textSecondary,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        summaryAmount: {
            fontSize: 20,
            fontWeight: '700',
        },
        // SECTIONS
        section: {
            gap: 10,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: colors.textPrimary,
        },
        // PERIOD TABS (Week / Month / Year)
        periodTabs: {
            flexDirection: 'row',
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 4,
            borderWidth: 1,
            borderColor: colors.border,
        },
        periodTab: {
            flex: 1,
            paddingVertical: 10,
            borderRadius: 10,
            alignItems: 'center',
        },
        periodTabActive: {
            backgroundColor: colors.champagne,
        },
        periodTabText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.textSecondary,
        },
        periodTabTextActive: {
            color: colors.background,
        },
        // BREAKDOWN LIST
        breakdownCard: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: 'hidden',
        },
        breakdownRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 14,
            paddingHorizontal: 16,
        },
        breakdownBorder: {
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        breakdownLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        colorDot: {
            width: 12,
            height: 12,
            borderRadius: 6,
        },
        breakdownName: {
            fontSize: 15,
            fontWeight: '500',
            color: colors.textPrimary,
        },
        breakdownRight: {
            alignItems: 'flex-end',
            gap: 2,
        },
        breakdownAmount: {
            fontSize: 15,
            fontWeight: '600',
            color: colors.textPrimary,
        },
        breakdownPercent: {
            fontSize: 12,
            color: colors.textSecondary,
        },
        noDataText: {
            padding: 24,
            fontSize: 14,
            color: colors.textSecondary,
            textAlign: 'center',
        },
    });
