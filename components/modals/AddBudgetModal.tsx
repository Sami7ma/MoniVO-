// Modal form for creating a new budget.
//
// The user selects:
// - A spending category
// - A budget limit
// - A budget period
// - Monthly, Weekly, or Custom
// - A start date and end date for Custom

// Monthly: 1st day of current month -> last day of current month
// Weekly: Monday -> Sunday
// Custom: User chooses start date -> end date using calendar

import React, { useState } from 'react';
import { BlurView } from 'expo-blur';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, KeyboardAvoidingView, Platform, Pressable, } from 'react-native';
import { X, Check, ChevronDown, Calendar as CalendarIcon, } from 'lucide-react-native';
import { Calendar } from 'react-native-calendars';
// hooks
import useTheme from '../../hooks/useTheme';
import useMoniVoStore from '../../store/useMoniVoStore';

// types
interface AddBudgetModalProps {
    visible: boolean;
    onClose: () => void;
}

type BudgetPeriod = | 'monthly' | 'weekly' | 'custom';

export default function AddBudgetModal({
    visible,
    onClose,
}: AddBudgetModalProps) {
    // THEME
    // Get the current theme colors.
    const colors = useTheme();

    // Create styles using the current theme.
    const styles = createStyles(colors);

    // ZUSTAND
    // Get all categories from Zustand.
    const categories = useMoniVoStore(
        (state) => state.categories
    );
    // Get existing budgets.
    const budgets = useMoniVoStore((state) => state.budgets);
    // Function used to create the new budget.
    const addBudget = useMoniVoStore((state) => state.addBudget);

    // LOCAL STATE
    // Selected expense category.
    const [selectedCategoryId, setSelectedCategoryId,] = useState('');
    // Amount entered by the user.
    const [limitAmount, setLimitAmount,] = useState('');
    // Selected budget period.
    // It can be:monthly, weekly, custom
    const [period, setPeriod,] = useState<BudgetPeriod>('monthly');
    // Start date of the budget.
    const [startDate, setStartDate,] = useState(new Date().toISOString().split('T')[0]);
    // End date of the budget.
    const [endDate, setEndDate,] = useState(new Date().toISOString().split('T')[0]);

    // Used only when Custom is selected.
    // First the user chooses "start".
    // Then the user chooses "end".
    const [selectingDate, setSelectingDate,] = useState<'start' | 'end'>('start');
    // Controls whether the calendar is visible.
    const [showCalendar, setShowCalendar,] = useState(false);
    // Controls the category dropdown.
    const [showCategoryPicker, setShowCategoryPicker,] = useState(false);

    // AVAILABLE CATEGORIES
    // Only expense categories can have budgets.
    // We also remove categories that already have a budget.
    const availableCategories = categories.filter((cat) => {

        // Income categories cannot have
        // spending budgets.
        if (cat.flow !== 'EXPENSE') {
            return false;
        }

        // Check whether this category
        // already has a budget.
        const alreadyBudgeted =
            budgets.some(
                (b) =>
                    b.categoryId === cat.id
            );
        return !alreadyBudgeted;
    });

    // SELECTED CATEGORY
    // Find the complet category object
    // using the selected ID.
    const selectedCategory =
        categories.find(
            (cat) =>
                cat.id === selectedCategoryId
        );

    // DATE FORMAT
    // Convert:2026-08-24 into:Aug 24, 2026
    const formatDate = (date: string) => {
        return new Date(`${date}T00:00:00`).
            toLocaleDateString(
                'en-US',
                { month: 'short', day: 'numeric', year: 'numeric' }
            );
    };
    // GET DATE AS YYYY-MM-DD
    // We use this helper whenever we create dates programmatically.
    const formatDateToString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    // GET MONTHLY RANGE Monthly budget: 
    // 1st day of current month
    // ->
    // Last day of current month
    const getMonthlyRange = () => {
        const today = new Date();

        const year = today.getFullYear();
        const month = today.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const start = formatDateToString(firstDay);
        const end = formatDateToString(lastDay);

        return { start, end, };
    };
    // GET WEEKLY RANGE
    const getWeeklyRange = () => {
        const today = new Date();

        const currentDay = today.getDay();
        const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;
        // Create Monday.
        const weeklyStart = new Date(today);

        weeklyStart.setDate(today.getDate() - daysFromMonday);
        // Create Sunday.
        const weeklyEnd = new Date(weeklyStart);
        weeklyEnd.setDate(weeklyStart.getDate() + 6);
        const start = formatDateToString(weeklyStart);
        const end = formatDateToString(weeklyEnd);

        return { start, end };
    };
    // GET RANGE OF DAYS
    // Example:
    // getRangeOfDays('monthly')
    // returns:
    // {
    //     start: '2026-08-01',
    //     end: '2026-08-31'
    // }
    const getRangeOfDays = (periodChosen: 'monthly' | 'weekly') => {
        if (periodChosen === 'monthly') {
            return getMonthlyRange();
        }
        return getWeeklyRange();
    };
    // HANDLE PERIOD CHANGE
    // Runs when the user presses:
    // Monthly
    // Weekly
    // Custom

    const handlePeriodChange = (newPeriod: BudgetPeriod) => {
        // Save the selected period.
        setPeriod(newPeriod);

        // MONTHLY
        if (newPeriod === 'monthly') {
            const range = getRangeOfDays('monthly');
            setStartDate(range.start);
            setEndDate(range.end);
            // Monthly does not need
            // the custom calendar.
            setShowCalendar(false);
        }
        // WEEKLY
        if (newPeriod === 'weekly') {
            const range = getRangeOfDays('weekly');
            setStartDate(range.start);
            setEndDate(range.end);
            // Weekly does not need
            // the custom calendar.
            setShowCalendar(false);
        }
        // CUSTOM
        if (newPeriod === 'custom') {
            // Start a fresh custom selection.
            const today = new Date().toISOString().split('T')[0];
            setStartDate(today);
            setEndDate(today);

            // The first date the user chooses
            // will be the START date.
            setSelectingDate('start');
            // Open the calendar.
            setShowCalendar(true);
        }
    };

    // RESET FORM
    const resetForm = () => {
        setSelectedCategoryId('');
        setLimitAmount('');
        // Reset to Monthly.
        setPeriod('monthly');
        // When the form is reset,
        // use the current mnth's range.

        const range = getMonthlyRange();
        setStartDate(range.start);

        setEndDate(range.end);
        setSelectingDate('start');

        setShowCalendar(false);
        setShowCategoryPicker(false);
    };

    // CALENDAR DATE SELECTION
    const handleDateSelect = (date: string) => {
        // STEP 1: SELECT START DATE
        if (selectingDate === 'start') {
            setStartDate(date);
            setSelectingDate('end');
            return;
        }
        // STEP 2: SELECT END DATE
        if (selectingDate === 'end') {
            if (date < startDate) {
                alert('End date cannot be before the start date');
                return;
            }

            setEndDate(date);
            setShowCalendar(false);
        }
    };
    // get dates betteen the two dates
    const getDatesBetween = (start: string, end: string) => {

        const dates: string[] = [];
        // Start from the selected start date.
        const current = new Date(`${start}T00:00:00`);
        // Stop when we reach the end date.
        const last = new Date(`${end}T00:00:00`);
        while (current <= last) {
            dates.push(
                formatDateToString(
                    current
                )
            );

            // Move forward one day.
            current.setDate(current.getDate() + 1);
        }
        return dates;
    };

    // CALENDAR MARKINGS
    const rangeDates = getDatesBetween(startDate, endDate);
    // Create the object required by
    // react-native-calendars.

    const markedDates = rangeDates.reduce(
        (marks, date, index) => {

            const isStart = date === startDate;
            const isEnd = date === endDate;
            marks[date] = {
                // First day.
                startingDay: isStart,
                // Last day.

                endingDay: isEnd,
                // Middle days also receive
                // the same color.
                color: colors.champagne,
                // Text inside selected area.
                textColor: colors.background,
            };
            return marks;

        },
        {} as Record<string, any>
    );
    // SUBMIT
    const handleSubmit = () => {
        // Convert text input into number.
        const numAmount = parseFloat(limitAmount);
        // CHECK AMOUNT

        if (isNaN(numAmount) || numAmount <= 0) {
            alert('Please enter a valid budget amount');
            return;
        }

        // CHECK CATEGORY
        if (!selectedCategoryId) {
            alert('Please select a category');
            return;
        }

        // CHECK DATE RANGE
        if (endDate < startDate) {
            alert('End date cannot be before the start date');
            return;
        }
        // create budget
        addBudget({
            categoryId: selectedCategoryId,

            limitAmount: numAmount,
            recurring: 'none',
            startDate: startDate,
            endDate: endDate,
        });

        // Clear everything.
        resetForm();
        // Close modal.
        onClose();
    };

    // UI
    return (

        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={() => {
                resetForm();
                onClose();
            }}
            statusBarTranslucent >
            <View style={styles.modalRoot} >

                <Pressable style={styles.backdrop}
                    onPress={() => {
                        resetForm();
                        onClose();
                    }} />
                <KeyboardAvoidingView
                    style={styles.keyboardLayer}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <View style={styles.container} >
                        {/* HEADER */}
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
                                style={styles.closeButton}>
                                <X size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>


                        {/*FORM*/}
                        <ScrollView
                            contentContainerStyle={styles.form}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >

                            {/*CATEGORY*/}
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>
                                    Category
                                </Text>
                                <TouchableOpacity style={styles.selectorButton}
                                    onPress={() => setShowCategoryPicker(
                                        !showCategoryPicker
                                    )}
                                >
                                    <Text style={[
                                        styles.selectorText, !selectedCategory && {
                                            color: colors.textMuted,
                                        },
                                    ]}>
                                        {selectedCategory?.name ?? 'Choose a category'}
                                    </Text>
                                    <ChevronDown size={18} color={colors.textSecondary} />
                                </TouchableOpacity>

                                {/* CATEGORY DROPDOWN */}
                                {
                                    showCategoryPicker && (
                                        <View style={styles.categoryList}>

                                            <ScrollView
                                                nestedScrollEnabled
                                                showsVerticalScrollIndicator={false}>
                                                {availableCategories.length ===
                                                    0 ? (
                                                    <Text style={styles.noCategoriesText}>
                                                        All categories already
                                                        have budgets
                                                    </Text>
                                                ) : (
                                                    availableCategories.map(
                                                        (cat) => {
                                                            const isSelected = cat.id === selectedCategoryId;
                                                            return (
                                                                <TouchableOpacity
                                                                    key={cat.id}
                                                                    style={[styles.categoryItem,
                                                                    isSelected && { backgroundColor: colors.champagne + '12', },
                                                                    ]}
                                                                    onPress={() => {
                                                                        setSelectedCategoryId(cat.id);
                                                                        setShowCategoryPicker(false);
                                                                    }}
                                                                >

                                                                    <Text
                                                                        style={[
                                                                            styles.categoryItemText,
                                                                            isSelected && {
                                                                                color: colors.champagne,
                                                                            },
                                                                        ]}>
                                                                        {cat.name}
                                                                    </Text>


                                                                    {
                                                                        isSelected && (
                                                                            <Check size={17}
                                                                                color={colors.champagne} />
                                                                        )
                                                                    }
                                                                </TouchableOpacity>
                                                            );
                                                        }
                                                    )
                                                )}
                                            </ScrollView>
                                        </View>
                                    )
                                }
                            </View>

                            {/* AMOUNT*/}
                            <View
                                style={styles.fieldGroup}>
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
                                        placeholderTextColor={colors.textMuted}
                                        keyboardType="decimal-pad"
                                    />
                                </View>
                            </View>
                            {/* PERIOD*/}

                            <View style={styles.fieldGroup} >

                                <Text style={styles.label}>
                                    Period
                                </Text>

                                <View style={styles.periodRow}>

                                    {/* MONTHLY */}
                                    <TouchableOpacity
                                        style={[
                                            styles.periodButton,
                                            period === 'monthly' && {
                                                backgroundColor: colors.champagne + '20',
                                                borderColor: colors.champagne,
                                            },
                                        ]}
                                        onPress={() => handlePeriodChange('monthly')}>
                                        <Text style={[
                                            styles.periodText,
                                            period === 'monthly' && {
                                                color: colors.champagne,
                                            },
                                        ]}>
                                            Monthly
                                        </Text>
                                    </TouchableOpacity>

                                    {/* WEEKLY */}

                                    <TouchableOpacity
                                        style={[
                                            styles.periodButton,
                                            period === 'weekly' && {
                                                backgroundColor: colors.champagne + '20',
                                                borderColor: colors.champagne,
                                            },
                                        ]}

                                        onPress={() => handlePeriodChange('weekly')}>

                                        <Text style={[styles.periodText,
                                        period === 'weekly' && {
                                            color: colors.champagne,
                                        },
                                        ]}>
                                            Weekly
                                        </Text>

                                    </TouchableOpacity>


                                    {/* CUSTOM */}

                                    <TouchableOpacity
                                        style={[
                                            styles.periodButton,
                                            period === 'custom' && {
                                                backgroundColor: colors.champagne + '20',
                                                borderColor: colors.champagne,
                                            },
                                        ]}

                                        onPress={() => handlePeriodChange('custom')}
                                    >

                                        <View style={styles.periodContent}>

                                            <CalendarIcon size={16} color={
                                                period === 'custom'
                                                    ? colors.champagne
                                                    : colors.textSecondary
                                            } />


                                            <Text
                                                style={[
                                                    styles.periodText,

                                                    period === 'custom' && {
                                                        color: colors.champagne,
                                                    },
                                                ]}
                                            >
                                                Custom
                                            </Text>

                                        </View>

                                    </TouchableOpacity>

                                </View>

                            </View>


                            {/* BUDGET PERIOD*/}

                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>
                                    Budget Period
                                </Text>


                                {/* DATE SUMMARY*/}

                                <View style={styles.dateSummary}>

                                    <CalendarIcon
                                        size={19}
                                        color={
                                            colors.champagne
                                        }
                                    />


                                    <View style={styles.dateInfo}>

                                        <Text style={styles.dateTitle}>

                                            {
                                                period === 'monthly'
                                                    ? 'Monthly budget'
                                                    : period === 'weekly'
                                                        ? 'Weekly budget'
                                                        : selectingDate === 'start'
                                                            ? 'Select start date'
                                                            : 'Select end date'
                                            }

                                        </Text>


                                        <Text style={styles.dateRange}>

                                            {formatDate(startDate)}
                                            {'  →  '}
                                            {formatDate(endDate)}

                                        </Text>

                                    </View>

                                </View>


                                {/* CUSTOM CALENDAR*/}

                                {period === 'custom' && (
                                    <>
                                        <View style={styles.rangeSelector}>
                                            {/* start */}
                                            <TouchableOpacity
                                                style={styles.rangeField}
                                                onPress={() => {
                                                    setSelectingDate('start');
                                                    setShowCalendar(true);
                                                }}
                                                activeOpacity={0.8}
                                            >
                                                <Text style={styles.rangeLabel}>
                                                    Start
                                                </Text>

                                                <Text
                                                    style={[
                                                        styles.rangeDate,
                                                        selectingDate === 'start' &&
                                                        styles.rangeDateActive
                                                    ]}
                                                >
                                                    {formatDate(startDate)}
                                                </Text>
                                                {selectingDate == 'start' && (
                                                    <View style={styles.activeIndicator} />
                                                )}

                                            </TouchableOpacity>

                                            {/* ARROW / DIVIDER  */}
                                            <View style={styles.rangeDivider}>
                                                <Text style={styles.rangeArrow}>
                                                    →
                                                </Text>
                                            </View>
                                            {/* End */}
                                            <TouchableOpacity
                                                style={styles.rangeField}
                                                onPress={() => {
                                                    setSelectingDate('end');
                                                    setShowCalendar(true);
                                                }}
                                                activeOpacity={0.8}
                                            >
                                                <Text style={styles.rangeLabel}>
                                                    End
                                                </Text>
                                                <Text
                                                    style={[
                                                        styles.rangeDate,
                                                        selectingDate === 'end' && styles.rangeDateActive
                                                    ]}
                                                >
                                                    {formatDate(endDate)}
                                                </Text>
                                                {selectingDate === 'end' && (
                                                    <View style={styles.activeIndicator} />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                        {/* calendar */}

                                        {showCalendar && (
                                            <View style={styles.calendarContainer}>
                                                <Calendar
                                                    current={selectingDate === 'start'
                                                        ? startDate
                                                        : endDate
                                                    }
                                                    minDate={selectingDate === 'end'
                                                        ? startDate
                                                        : undefined
                                                    }
                                                    onDayPress={(day) => handleDateSelect(day.dateString)}

                                                    markedDates={markedDates}
                                                    markingType="period"
                                                    theme={{
                                                        backgroundColor: colors.surface,
                                                        calendarBackground: colors.surface,
                                                        textSectionTitleColor: colors.textSecondary,
                                                        selectedDayBackgroundColor: colors.champagne,
                                                        selectedDayTextColor: colors.background,
                                                        todayTextColor: colors.champagne,
                                                        dayTextColor: colors.textPrimary,
                                                        textDisabledColor: colors.textMuted,
                                                        monthTextColor: colors.textPrimary,
                                                        arrowColor: colors.champagne,
                                                        textDayFontWeight: '500',
                                                        textMonthFontWeight: '700',
                                                        textDayHeaderFontWeight: '600',
                                                    }}
                                                />
                                            </View>
                                        )}
                                    </>
                                )}

                            </View>


                            {/* =================================
                                CREATE BUTTON
                            ================================= */}

                            <TouchableOpacity

                                style={
                                    styles.submitButton
                                }

                                onPress={
                                    handleSubmit
                                }

                                activeOpacity={0.85}
                            >

                                <Text
                                    style={
                                        styles.submitText
                                    }
                                >
                                    Create Budget
                                </Text>

                            </TouchableOpacity>

                        </ScrollView>

                    </View>

                </KeyboardAvoidingView>

            </View >

        </Modal >
    );
}


// ======================================================
// STYLES
// ======================================================

const createStyles = (colors: ReturnType<typeof useTheme>) => StyleSheet.create({
    // MODAL
    modalRoot: {
        flex: 1,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: colors.overlay,
        // HIDE ETG BEHIND MODAL

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
        shadowColor: colors.border,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    // HEADER
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 22,
        paddingTop: 15,
        paddingBottom: 10,
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

    // FORM
    form: {
        padding: 15,
        gap: 17,
    },
    fieldGroup: {
        gap: 6,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    // CATEGORY
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

    // AMOUNT
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
    // PERIOD
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
        justifyContent: 'center',
    },
    periodContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    periodText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    dateSummary: {
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
    // CALENDAR
    calendarContainer: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
        marginTop: 10,
    },


    // ==============================================
    // SUBMIT
    // ==============================================

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
    rangeSelector: {
        flexDirection: 'row',
        alignItems: 'stretch',
        backgroundColor: colors.surfaceAlt,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
    },
    rangeField: {
        flex: 1,
        height: 55,
        paddingHorizontal: 10,
        paddingVertical: 5,
        justifyContent: 'center',
        position: 'relative',
    },


    rangeLabel: {
        fontSize: 11,
        fontWeight: '500',
        letterSpacing: 1,
        color: colors.textMuted,

    },
    rangeDate: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    rangeDateActive: {
        color: colors.champagne,
    },
    rangeDivider: {
        width: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rangeArrow: {
        fontSize: 17,
        color: colors.textMuted,
    },
    activeIndicator: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: colors.champagne,
    },

});