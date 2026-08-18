// A singl row in the transaction list
// we make this sperarer component befcaste it get reused many tines

//  in react , anythin you repeat -> extract into a component

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Transaction } from '../../types/Transaction';
import { Colors } from '../../constants/colors';
import { Category } from '../../types/Category';

// props = tje data this componten need form tis parent
interface TransactionRowProps {
    transaction: Transaction;
    category?: Category; // might have undefine category yet
    onPress: () => void;   // what happens when user taps the row
}

export default function TransactionRow({ transaction, category, onPress }: TransactionRowProps) {
    const isIncome = transaction.type === 'CREDIT';
    // format daute nicely 
    const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
    const formattedAmount = `ETB ${transaction.amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        minimumSignificantDigits: 2,
    })}`;
    return (
        <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
            {/* Left: catagorey incon cirvle */}
            <View style={styles.iconContainer}>
                <Text style={styles.iconText}>
                    {/* show a simple letter abbreviation since we don't have icon images yet */}
                    {category?.name?.charAt(0) ?? '?'}
                </Text>
            </View>
            {/* Middle : category name + date/note */}
            <View style={styles.info}>
                <Text style={styles.categoryName} numberOfLines={1}>
                    {category?.name ?? 'Uncategorized'}
                </Text>
                <Text style={styles.meta} numberOfLines={1}>
                    {transaction.note ? transaction.note : formattedDate}
                </Text>
            </View>
            {/* Right : amount - freen for income , red for expense */}
            <Text style={[
                styles.amount,
                isIncome ? styles.income : styles.expense,
            ]}>
                {isIncome ? '+' : '-'}{formattedAmount}
            </Text>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',       // Icon | Info | Amount — all in a horizontal line
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: Colors.surface,
        borderRadius: 14,
        marginBottom: 8,
        gap: 12,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,            // Perfect circle
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.subtleGold + '40',
    },
    iconText: {
        fontSize: 18,
        color: Colors.champagne,
        fontWeight: 'bold',
    },
    info: {
        flex: 1,                    // Takes up all space between icon and amount
        gap: 3,
    },
    categoryName: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.ivory,
    },
    meta: {
        fontSize: 12,
        color: Colors.muted,
    },
    amount: {
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    income: {
        color: '#4CAF50',           // Green for incoming money
    },
    expense: {
        color: '#EF5350',           // Red for outgoing money
    },
});