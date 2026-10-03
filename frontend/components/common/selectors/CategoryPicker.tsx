// components/common/CategoryPicker.tsx
//
// A dropdown category selector with an expandable list.
// WHERE IT'S USED:
// - AddTransactionModal (pick expense or income category)
// - AddBudgetModal (pick expense category for budget)
//
// WHY A COMPONENT?
// The category dropdown is ~60 lines of JSX duplicated in both modals.
// Extracting it saves ~120 lines total and ensures both modals
// have the exact same selection experience.

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import useTheme from '../../../hooks/useTheme';
import type { Category } from '../../../types/Category';

interface CategoryPickerProps {
    categories: Category[];        // the list of categories to display
    selectedId: string;            // currently selected category ID
    onSelect: (id: string) => void;  // called when user picks a category
    placeholder?: string;          // text shown when nothing is selected
    label?: string;                // field label (defaults to "Category")
}

export default function CategoryPicker({
    categories,
    selectedId,
    onSelect,
    placeholder = 'Select a category',
    label = 'Category',
}: CategoryPickerProps) {

    const colors = useTheme();
    const styles = createStyles(colors);

    // Internal state — controls whether the dropdown list is visible.
    const [isOpen, setIsOpen] = useState(false);
    // Find the full category object from the selected ID
    const selectedCategory = categories.find((cat) => cat.id === selectedId);

    return (
        <View style={styles.container}>
            {/* Label */}
            <Text style={styles.label}>{label}</Text>

            {/* Selector button — shows current selection or placeholder */}
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.selectorButton}
                onPress={() => setIsOpen(!isOpen)}>
                <Text
                    style={[
                        styles.selectorText,
                        // Gray text when nothing is selected
                        !selectedCategory && { color: colors.textMuted },
                    ]}
                >
                    {selectedCategory?.name ?? placeholder}
                </Text>

                <ChevronDown size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Expandable category list — only visible when isOpen */}
            {isOpen && (
                <View style={styles.list}>
                    <ScrollView
                        nestedScrollEnabled    // allows scrolling inside a ScrollView parent
                        showsVerticalScrollIndicator={false}
                    >
                        {categories.length === 0 ? (
                            <Text style={styles.emptyText}>
                                No categories available
                            </Text>
                        ) : (
                            categories.map((category) => {
                                const isSelected = category.id === selectedId;
                                return (
                                    <TouchableOpacity
                                        key={category.id}
                                        activeOpacity={0.7}
                                        style={[
                                            styles.item,
                                            // Gold tint background when selected
                                            isSelected && {
                                                backgroundColor: colors.champagne + '12',
                                            },
                                        ]}
                                        onPress={() => {
                                            onSelect(category.id);
                                            setIsOpen(false); // close dropdown after selection
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.itemText,
                                                // Gold text when selected
                                                isSelected && {
                                                    color: colors.champagne,
                                                },
                                            ]}
                                        >
                                            {category.name}
                                        </Text>

                                        {/* Checkmark icon — only on the selected item */}
                                        {isSelected && (
                                            <Check size={17} color={colors.champagne} />
                                        )}
                                    </TouchableOpacity>
                                );
                            })
                        )}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

const createStyles = (colors: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            gap: 8,
        },
        label: {
            fontSize: 11,
            fontWeight: '700',
            letterSpacing: 1,
            color: colors.textSecondary,
            textTransform: 'uppercase',
        },
        selectorButton: {
            minHeight: 50,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 15,
            borderRadius: 14,
            borderWidth: 1,
            backgroundColor: colors.surfaceAlt,
            borderColor: colors.border,
        },
        selectorText: {
            fontSize: 15,
            fontWeight: '500',
            color: colors.textPrimary,
        },
        list: {
            maxHeight: 170,
            marginTop: 6,
            borderRadius: 14,
            borderWidth: 1,
            overflow: 'hidden',
            backgroundColor: colors.surface,
            borderColor: colors.border,
        },
        item: {
            minHeight: 48,
            paddingHorizontal: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        itemText: {
            fontSize: 14,
            fontWeight: '500',
            color: colors.textPrimary,
        },
        emptyText: {
            padding: 16,
            fontSize: 14,
            color: colors.textSecondary,
            textAlign: 'center',
        },
    });
