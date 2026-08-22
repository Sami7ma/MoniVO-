// Form modal for creating a new spending budget.
//
// User picks a category, sets a limit, chooses monthly/weekly,
// and selects the date range for the budget.

import React, { useState } from 'react';

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Pressable,
} from 'react-native';

import {
    X,
    Check,
    ChevronDown,
    CalendarDays,
} from 'lucide-react-native';

import { Calendar } from 'react-native-calendars';

import useTheme from '../../hooks/useTheme';
import useMoniVoStore from '../../store/useMoniVoStore';

interface AddBudgetModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function AddBudgetModal({
    visible,
    onClose,
}: AddBudgetModalProps) {

    // Get the current theme colors.
    const colors = useTheme();

    // Create the styles using the current theme colors.
    const styles = createStyles(colors);

    // ── ZUSTAND ──────────────────────────────────────────────

    const categories = useMoniVoStore((state) => state.categories);
    const budgets = useMoniVoStore((state) => state.budgets);
    const addBudget = useMoniVoStore((state) => state.addBudget);

    // ── LOCAL STATE ──────────────────────────────────────────

    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [limitAmount, setLimitAmount] = useState('');
    const [period, setPeriod] =
        useState<'monthly' | 'weekly'>('monthly');

    const [startDate, setStartDate] = useState(
        new Date().toISOString().split('T')[0]
    );

    const [endDate, setEndDate] = useState(
        new Date().toISOString().split('T')[0]
    );

    const [selectingDate, setSelectingDate] =
        useState<'start' | 'end'>('start');

    const [showCalendar, setShowCalendar] = useState(false);
    const [showCategoryPicker, setShowCategoryPicker] =
        useState(false);

    // ── AVAILABLE CATEGORIES ─────────────────────────────────

    // Only show EXPENSE categories because income is not budgeted.
    // Also exclude categories that already have a budget.
    const availableCategories = categories.filter((cat) => {

        // Must be an expense category.
        if (cat.flow !== 'EXPENSE') return false;

        // Must not already have a budget.
        const alreadyBudgeted = budgets.some(
            (b) => b.categoryId === cat.id
        );

        return !alreadyBudgeted;
    });

    // ── SELECTED CATEGORY ────────────────────────────────────

    const selectedCategory = categories.find(
        (cat) => cat.id === selectedCategoryId
    );

    // ── DATE FORMAT ──────────────────────────────────────────

    // Convert YYYY-MM-DD into a short readable date.
    // Example: 2026-08-21 -> Aug 21
    const formatDate = (date: string) => {
        return new Date(`${date}T00:00:00`).toLocaleDateString(
            'en-US',
            {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }
        );
    };

    // ── RESET ────────────────────────────────────────────────

    const resetForm = () => {
        setSelectedCategoryId('');
        setLimitAmount('');
        setPeriod('monthly');

        const today = new Date().toISOString().split('T')[0];

        setStartDate(today);
        setEndDate(today);

        setSelectingDate('start');
        setShowCalendar(false);
        setShowCategoryPicker(false);
    };

    // ── CALENDAR SELECTION ────────────────────────────────────

    const handleDateSelect = (date: string) => {

        // First select the start date.
        if (selectingDate === 'start') {
            setStartDate(date);

            // If the existing end date is before the new start date,
            // automatically move the end date to the same day.
            if (date > endDate) {
                setEndDate(date);
            }

            setSelectingDate('end');
            return;
        }

        // Prevent the end date from being before the start date.
        if (date < startDate) {
            alert('End date cannot be before the start date');
            return;
        }

        setEndDate(date);
        setShowCalendar(false);
    };

    // ── SUBMIT ───────────────────────────────────────────────

    const handleSubmit = () => {

        const numAmount = parseFloat(limitAmount);

        if (isNaN(numAmount) || numAmount <= 0) {
            alert('Please enter a valid budget amount');
            return;
        }

        if (!selectedCategoryId) {
            alert('Please select a category');
            return;
        }

        if (endDate < startDate) {
            alert('End date cannot be before the start date');
            return;
        }

        addBudget({
            categoryId: selectedCategoryId,
            limitAmount: numAmount,
            period: period,
            startDate: startDate,
            endDate: endDate,
        });

        resetForm();
        onClose();
    };

    // ── CALENDAR MARKINGS ─────────────────────────────────────

    const markedDates = {
        [startDate]: {
            startingDay: true,
            color: colors.champagne,
            textColor: colors.background,
        },

        [endDate]: {
            endingDay: true,
            color: colors.champagne,
            textColor: colors.background,
        },
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={() => {
                resetForm();
                onClose();
            }}
            statusBarTranslucent
        >
            <View style={styles.modalRoot}>

                <Pressable
                    style={styles.backdrop}
                    onPress={() => {
                        resetForm();
                        onClose();
                    }}
                />

                <KeyboardAvoidingView
                    style={styles.keyboardLayer}
                    behavior={
                        Platform.OS === 'ios'
                            ? 'padding'
                            : undefined
                    }
                >
                    <View style={styles.container}>

                        {/* ── HEADER ──────────────────────── */}

                        <View style={styles.header}>
                            <View>
                                <Text style={styles.headerEyebrow}>
                                    NEW BUDGET
                                </Text>

                                <Text style={styles.headerTitle}>
                                    Set Spending Limit
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => {
                                    resetForm();
                                    onClose();
                                }}
                                style={styles.closeButton}
                            >
                                <X
                                    size={20}
                                    color={colors.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            contentContainerStyle={styles.form}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >

                            {/* ── CATEGORY PICKER ─────────── */}

                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>
                                    Category
                                </Text>

                                <TouchableOpacity
                                    style={styles.selectorButton}
                                    onPress={() =>
                                        setShowCategoryPicker(
                                            !showCategoryPicker
                                        )
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.selectorText,
                                            !selectedCategory && {
                                                color: colors.textMuted,
                                            },
                                        ]}
                                    >
                                        {selectedCategory?.name ??
                                            'Choose a category'}
                                    </Text>

                                    <ChevronDown
                                        size={18}
                                        color={colors.textSecondary}
                                    />
                                </TouchableOpacity>

                                {showCategoryPicker && (
                                    <View
                                        style={styles.categoryList}
                                    >
                                        <ScrollView
                                            nestedScrollEnabled
                                            showsVerticalScrollIndicator={
                                                false
                                            }
                                        >
                                            {availableCategories.length ===
                                                0 ? (
                                                <Text
                                                    style={
                                                        styles.noCategoriesText
                                                    }
                                                >
                                                    All categories already
                                                    have budgets
                                                </Text>
                                            ) : (
                                                availableCategories.map(
                                                    (cat) => {
                                                        const isSelected =
                                                            cat.id ===
                                                            selectedCategoryId;

                                                        return (
                                                            <TouchableOpacity
                                                                key={cat.id}
                                                                style={[
                                                                    styles.categoryItem,
                                                                    isSelected && {
                                                                        backgroundColor:
                                                                            colors.champagne +
                                                                            '12',
                                                                    },
                                                                ]}
                                                                onPress={() => {
                                                                    setSelectedCategoryId(
                                                                        cat.id
                                                                    );
                                                                    setShowCategoryPicker(
                                                                        false
                                                                    );
                                                                }}
                                                            >
                                                                <Text
                                                                    style={[
                                                                        styles.categoryItemText,
                                                                        isSelected && {
                                                                            color: colors.champagne,
                                                                        },
                                                                    ]}
                                                                >
                                                                    {cat.name}
                                                                </Text>

                                                                {isSelected && (
                                                                    <Check
                                                                        size={
                                                                            17
                                                                        }
                                                                        color={
                                                                            colors.champagne
                                                                        }
                                                                    />
                                                                )}
                                                            </TouchableOpacity>
                                                        );
                                                    }
                                                )
                                            )}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>

                            {/* ── AMOUNT ──────────────────── */}

                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>
                                    Budget Limit
                                </Text>

                                <View style={styles.amountRow}>
                                    <Text style={styles.currency}>
                                        ETB
                                    </Text>

                                    <TextInput
                                        style={styles.amountInput}
                                        value={limitAmount}
                                        onChangeText={setLimitAmount}
                                        placeholder="0.00"
                                        placeholderTextColor={
                                            colors.textMuted
                                        }
                                        keyboardType="decimal-pad"
                                    />
                                </View>
                            </View>

                            {/* ── PERIOD TOGGLE ───────────── */}

                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>
                                    Period
                                </Text>

                                <View style={styles.periodRow}>
                                    {(
                                        ['monthly', 'weekly'] as const
                                    ).map((p) => (
                                        <TouchableOpacity
                                            key={p}
                                            style={[
                                                styles.periodButton,
                                                period === p && {
                                                    backgroundColor:
                                                        colors.champagne +
                                                        '20',
                                                    borderColor:
                                                        colors.champagne,
                                                },
                                            ]}
                                            onPress={() =>
                                                setPeriod(p)
                                            }
                                        >
                                            <Text
                                                style={[
                                                    styles.periodText,
                                                    period === p && {
                                                        color: colors.champagne,
                                                    },
                                                ]}
                                            >
                                                {p === 'monthly'
                                                    ? 'Monthly'
                                                    : 'Weekly'}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* ── DATE RANGE ───────────────── */}

                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>
                                    Budget Period
                                </Text>

                                <TouchableOpacity
                                    style={styles.dateButton}
                                    onPress={() => {
                                        setSelectingDate('start');
                                        setShowCalendar(!showCalendar);
                                    }}
                                >
                                    <CalendarDays
                                        size={19}
                                        color={colors.champagne}
                                    />

                                    <View style={styles.dateInfo}>
                                        <Text
                                            style={styles.dateTitle}
                                        >
                                            {selectingDate === 'start'
                                                ? 'Select start date'
                                                : 'Select end date'}
                                        </Text>

                                        <Text
                                            style={styles.dateRange}
                                        >
                                            {formatDate(startDate)}
                                            {'  →  '}
                                            {formatDate(endDate)}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                {showCalendar && (
                                    <View
                                        style={
                                            styles.calendarContainer
                                        }
                                    >
                                        <Calendar
                                            current={
                                                selectingDate === 'start'
                                                    ? startDate
                                                    : endDate
                                            }
                                            minDate={
                                                selectingDate === 'end'
                                                    ? startDate
                                                    : undefined
                                            }
                                            onDayPress={(day) =>
                                                handleDateSelect(
                                                    day.dateString
                                                )
                                            }
                                            markedDates={markedDates}
                                            markingType="period"
                                            theme={{
                                                backgroundColor:
                                                    colors.surface,
                                                calendarBackground:
                                                    colors.surface,
                                                textSectionTitleColor:
                                                    colors.textSecondary,
                                                selectedDayBackgroundColor:
                                                    colors.champagne,
                                                selectedDayTextColor:
                                                    colors.background,
                                                todayTextColor:
                                                    colors.champagne,
                                                dayTextColor:
                                                    colors.textPrimary,
                                                textDisabledColor:
                                                    colors.textMuted,
                                                monthTextColor:
                                                    colors.textPrimary,
                                                arrowColor:
                                                    colors.champagne,
                                                textDayFontWeight:
                                                    '500',
                                                textMonthFontWeight:
                                                    '700',
                                                textDayHeaderFontWeight:
                                                    '600',
                                            }}
                                        />
                                    </View>
                                )}
                            </View>

                            {/* ── SUBMIT ──────────────────── */}

                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={handleSubmit}
                                activeOpacity={0.85}
                            >
                                <Text style={styles.submitText}>
                                    Create Budget
                                </Text>
                            </TouchableOpacity>

                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const createStyles = (
    colors: ReturnType<typeof useTheme>
) =>
    StyleSheet.create({

        modalRoot: {
            flex: 1,
        },

        backdrop: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: colors.overlay,
        },

        keyboardLayer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 14,
        },

        container: {
            width: '100%',
            maxHeight: '90%',
            backgroundColor: colors.surface + 'F2',
            borderRadius: 28,
            borderWidth: 1,
            borderColor: colors.champagne + '40',
            overflow: 'hidden',
        },

        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 22,
            paddingTop: 20,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },

        headerEyebrow: {
            fontSize: 10,
            fontWeight: '700',
            letterSpacing: 1.5,
            color: colors.champagne,
            marginBottom: 4,
        },

        headerTitle: {
            fontSize: 20,
            fontWeight: '700',
            color: colors.textPrimary,
        },

        closeButton: {
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: colors.surfaceAlt,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.border,
        },

        form: {
            padding: 20,
            gap: 20,
        },

        fieldGroup: {
            gap: 8,
        },

        label: {
            fontSize: 12,
            fontWeight: '600',
            color: colors.textSecondary,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },

        selectorButton: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colors.surfaceAlt,
            borderRadius: 14,
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderWidth: 1,
            borderColor: colors.border,
        },

        selectorText: {
            fontSize: 15,
            color: colors.textPrimary,
        },

        categoryList: {
            backgroundColor: colors.surface,
            borderRadius: 14,
            marginTop: 8,
            borderWidth: 1,
            borderColor: colors.border,
            maxHeight: 180,
        },

        categoryItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 13,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },

        categoryItemText: {
            fontSize: 15,
            color: colors.textPrimary,
        },

        noCategoriesText: {
            padding: 16,
            fontSize: 14,
            color: colors.textSecondary,
            textAlign: 'center',
        },

        amountRow: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surfaceAlt,
            borderRadius: 14,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: colors.border,
            gap: 8,
        },

        currency: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.textSecondary,
        },

        amountInput: {
            flex: 1,
            fontSize: 28,
            fontWeight: '700',
            color: colors.champagne,
            paddingVertical: 14,
        },

        periodRow: {
            flexDirection: 'row',
            gap: 10,
        },

        periodButton: {
            flex: 1,
            paddingVertical: 14,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
        },

        periodText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.textSecondary,
        },

        dateButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surfaceAlt,
            borderRadius: 14,
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderWidth: 1,
            borderColor: colors.border,
            gap: 12,
        },

        dateInfo: {
            flex: 1,
            gap: 3,
        },

        dateTitle: {
            fontSize: 13,
            fontWeight: '600',
            color: colors.textSecondary,
        },

        dateRange: {
            fontSize: 15,
            fontWeight: '600',
            color: colors.textPrimary,
        },

        calendarContainer: {
            backgroundColor: colors.surface,
            borderRadius: 14,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors.border,
        },

        submitButton: {
            backgroundColor: colors.champagne,
            borderRadius: 14,
            paddingVertical: 16,
            alignItems: 'center',
            marginTop: 8,
        },

        submitText: {
            color: colors.background,
            fontSize: 16,
            fontWeight: 'bold',
        },
    });