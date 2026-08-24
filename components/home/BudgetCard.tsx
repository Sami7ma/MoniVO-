// A single budget card in the budget list.
//
// We make this a separate component because each budget
// needs to display the same layout and behavior.
//
// The card shows:
// - Category name and budget period
// - Budget start and end dates
// - Amount spent and budget limit
// - Progress bar
// - Percentage used
// - Remaining amount
// - Remove budget action

import React from 'react';

import {
    Text,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

import { Trash2 } from 'lucide-react-native';

import useTheme from '../../hooks/useTheme';

import type { Budget } from '../../types/Budget';
import type { Category } from '../../types/Category';

// Props = the data and functions this component needs from its parent.
interface BudgetCardProps {
    budget: Budget;
    category: Category | undefined;
    spent: number;
    onDelete: () => void;
}

export default function BudgetCard({
    budget,
    category,
    spent,
    onDelete,
}: BudgetCardProps) {

    // Get the current theme colors.
    const colors = useTheme();

    // Create the styles using the current theme colors.
    const styles = createStyles(colors);

    // Calculate how much of the budget has been used.
    //
    // Example:
    // spent = 320
    // limit = 500
    // percentage = 0.64 = 64%
    const percentage =
        budget.limitAmount > 0
            ? spent / budget.limitAmount
            : 0;

    // Limit the progress bar to a maximum of 100%.
    //
    // The percentage itself can still be greater than 100%,
    // but the visual bar should never grow outside its container.
    const barWidth = Math.min(percentage, 1) * 100;

    // Calculate how much money is still available.
    //
    // A negative value means the user has gone over the budget.
    const remaining = budget.limitAmount - spent;

    // Choose the progress color based on how much
    // of the budget has been used.
    //
    // Under 50% -> green
    // 50% - 79% -> yellow
    // 80%+      -> red
    const getBarColor = () => {
        if (percentage >= 0.8) {
            return colors.danger;
        }

        if (percentage >= 0.5) {
            return '#F5A623';
        }

        return colors.success;
    };

    const barColor = getBarColor();

    // Format money as Ethiopian Birr with two decimal places.
    //
    // Example:
    // 1500 -> ETB 1,500.00
    const formatMoney = (amount: number) => {
        return `ETB ${Math.abs(amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    // Format a date for the budget period.
    //
    // Example:
    // 2026-08-21 -> Aug 21
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    // Display the complete budget period.
    //
    // Example:
    // Weekly · Aug 21 – Aug 27
    const periodText =
        `${formatDate(budget.startDate)} – ${formatDate(budget.endDate)}`;

    return (
        <View style={styles.card}>

            {/* Top row: category information + remove button */}
            <View style={styles.topRow}>

                <View style={styles.categoryInfo}>

                    <Text
                        style={styles.categoryName}
                        numberOfLines={1}
                    >
                        {category?.name ?? 'Uncategorized'}
                    </Text>

                    {/* Shows the budget type and exact date range. */}
                    <Text
                        style={styles.period}
                        numberOfLines={1}
                    >
                        {periodText}
                    </Text>

                </View>

                {/* Remove button for this budget. */}
                <TouchableOpacity
                    onPress={onDelete}
                    style={styles.deleteButton}
                    activeOpacity={0.7}
                >
                    <Trash2
                        size={17}
                        color={colors.textSecondary}
                        strokeWidth={2}
                    />
                </TouchableOpacity>

            </View>

            {/* Amount row: amount spent / budget limit */}
            <View style={styles.amountRow}>

                <Text style={styles.spentText}>
                    {formatMoney(spent)}
                </Text>

                <Text style={styles.limitText}>
                    / {formatMoney(budget.limitAmount)}
                </Text>

            </View>

            {/* Progress bar showing how much of the budget has been used. */}
            <View style={styles.barBackground}>
                <View
                    style={[
                        styles.barFill,
                        {
                            width: `${barWidth}%`,
                            backgroundColor: barColor,
                        },
                    ]}
                />
            </View>

            {/* Bottom row: percentage used + remaining budget */}
            <View style={styles.bottomRow}>

                <Text
                    style={[
                        styles.percentText,
                        { color: barColor },
                    ]}
                >
                    {Math.round(percentage * 100)}%
                </Text>

                <Text style={styles.remainingText}>
                    {remaining >= 0
                        ? `${formatMoney(remaining)} left`
                        : `${formatMoney(Math.abs(remaining))} over!`}
                </Text>

            </View>

        </View>
    );
}

const createStyles = (
    colors: ReturnType<typeof useTheme>
) => StyleSheet.create({

    card: {
        // Main budget container.
        // Uses the same surface color as the rest of the app.
        backgroundColor: colors.surface,
        borderRadius: 14,
        padding: 14,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },

    topRow: {
        // Category information and remove button
        // are positioned on opposite sides.
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },

    categoryInfo: {
        // Category name and period are stacked vertically.
        flex: 1,
        gap: 3,
        paddingRight: 8,
    },

    categoryName: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.textPrimary,
    },

    period: {
        // Small secondary information, similar to
        // the date/note metadata in TransactionRow.
        fontSize: 12,
        color: colors.textSecondary,
        letterSpacing: 0.2,
    },

    deleteButton: {
        // Small neutral action button.
        // The trash icon is intentionally subtle instead
        // of using a strong red background.
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    amountRow: {
        // Spent amount and budget limit stay
        // on the same horizontal line.
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 12,
    },

    spentText: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
    },

    limitText: {
        fontSize: 13,
        color: colors.textSecondary,
        marginLeft: 4,
    },

    barBackground: {
        // The full progress bar background.
        height: 7,
        borderRadius: 4,
        backgroundColor: colors.border,
        // Clips the colored bar so it stays
        // inside the rounded container.
        overflow: 'hidden',
        marginBottom: 10,
    },

    barFill: {
        // The colored section represents the
        // percentage of the budget already spent.
        height: '100%',
        borderRadius: 4,
    },

    bottomRow: {
        // Percentage and remaining amount
        // are placed on opposite sides.
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    percentText: {
        fontSize: 13,
        fontWeight: '700',
    },

    remainingText: {
        fontSize: 12,
        color: colors.textSecondary,
    },

});