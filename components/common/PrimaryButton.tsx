// components/common/PrimaryButton.tsx
//
// A full-width, rounded, bold button used across the entire app.
//
// WHERE IT'S USED:
// - LoginScreen       → "Sign In"
// - RegisterScreen    → "Create Account"
// - OnboardingScreen  → "Next" / "Get Started"
// - AddTransactionModal → "Add Income" / "Add Expense"
// - AddBudgetModal    → "Create Budget"
//
// WHY A COMPONENT?
// This button appears in 5+ files. If we ever want to change
// the border radius, add a loading spinner, or tweak the font —
// we change it ONCE here instead of hunting through 5 files.
//
// PROPS:
// - label: the text displayed on the button
// - onPress: function to call when tapped
// - color?: optional background color (defaults to champagne/gold)
// - style?: optional extra styles (e.g. marginTop, width)

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, } from 'react-native';
import useTheme from '../../hooks/useTheme';

// Props interface — defines what the parent can pass to this component
interface PrimaryButtonProps {
    label: string;
    onPress: () => void;
    color?: string;       // Optional — defaults to colors.champagne
    style?: ViewStyle;    // Optional — extra styles from the parent
}

export default function PrimaryButton({ label, onPress, color, style, }: PrimaryButtonProps) {
    const colors = useTheme();
    const styles = createStyles(colors);

    // ?? is "nullish coalescing" — if color is undefined, use champagne
    const backgroundColor = color ?? colors.champagne;

    return (
        <TouchableOpacity
            // We merge the base style + dynamic color + any extra parent styles
            style={[
                styles.button,
                { backgroundColor },
                style, // parent can override marginTop, width, etc.
            ]}
            onPress={onPress}
            activeOpacity={0.85}
        >
            <Text style={styles.label}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

// Styles — these live inside the component,
// so the parent doesn't need to define button styles anymore
const createStyles = (colors: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        button: {
            borderRadius: 14,
            paddingVertical: 16,
            alignItems: 'center',
            justifyContent: 'center',
        },
        label: {
            color: colors.background,
            fontSize: 16,
            fontWeight: 'bold',
            letterSpacing: 0.4,
        },
    });
