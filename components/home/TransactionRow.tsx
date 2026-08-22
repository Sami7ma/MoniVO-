// A single row in the transaction list.
// We make this a separate component because it gets reused many times.
// In React, anything you repeat -> extract it into a component.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { Transaction } from '../../types/Transaction';
import { Category } from '../../types/Category';

import useTheme from '../../hooks/useTheme';

// Props = the data and functions this component needs from its parent.
interface TransactionRowProps {
    transaction: Transaction;
    category?: Category; // The category might be undefined if it cannot be found.
    onPress: () => void; // Function that runs when the user taps the row.
}

export default function TransactionRow({
    transaction,
    category,
    onPress,
}: TransactionRowProps) {
    // Get the current theme colors.
    const colors = useTheme();

    // Create the styles using the current theme colors.
    const styles = createStyles(colors);

    // CREDIT = money coming in.
    // DEBIT = money going out.
    const isIncome = transaction.type === 'CREDIT';

    // Format the transaction date so it is easier to read.
    // Example: "Aug 21" instead of a long date string.
    const formattedDate = new Date(transaction.date).toLocaleDateString(
        'en-US',
        {
            month: 'short',
            day: 'numeric',
        }
    );

    // Format the amount as Ethiopian Birr with two decimal places.
    // Example: "ETB 1,500.00"
    const formattedAmount = `ETB ${transaction.amount.toLocaleString(
        'en-US',
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    )}`;

    return (
        <TouchableOpacity
            style={styles.row}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Middle: category name + date/note */}
            <View style={styles.info}>
                <Text style={styles.categoryName} numberOfLines={1}>
                    {category?.name ?? 'Uncategorized'}
                </Text>

                <Text style={styles.meta} numberOfLines={1}>
                    {transaction.note ? transaction.note : formattedDate}
                </Text>
            </View>

            {/* Right: amount - green for income, red for expense */}
            <Text
                style={[
                    styles.amount,
                    isIncome ? styles.income : styles.expense,
                ]}
            >
                {isIncome ? '+' : '-'}
                {formattedAmount}
            </Text>
        </TouchableOpacity>
    );
}

const createStyles = (colors: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        row: {
            // The row contains the transaction information and amount
            // arranged horizontally.
            flexDirection: 'row',
            alignItems: 'center',

            paddingVertical: 14,
            paddingHorizontal: 8,

            backgroundColor: colors.surface,
            borderRadius: 14,
            marginBottom: 5,

            // Creates space between the transaction information
            // and the amount.
            gap: 12,
        },

        info: {
            // Takes up the available space between the
            // transaction information and the amount.
            flex: 1,

            // Creates a small vertical gap between the
            // category name and the date/note.
            gap: 3,
        },

        categoryName: {
            fontSize: 15,
            fontWeight: '600',
            color: colors.textPrimary,
        },

        meta: {
            fontSize: 12,
            color: colors.textSecondary,
        },

        amount: {
            fontSize: 15,
            fontWeight: '700',
            letterSpacing: 0.3,
        },

        // Green indicates money coming into the account.
        income: {
            color: '#4CAF50',
        },

        // Red indicates money leaving the account.
        expense: {
            color: '#EF5350',
        },
    });