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
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, KeyboardAvoidingView, Platform, Pressable, Dimensions, FlatList } from 'react-native';
import { X, Check, ChevronDown, Calendar as CalendarIcon, } from 'lucide-react-native';
import { Calendar } from 'react-native-calendars';
// hooks
import useTheme from '../../hooks/useTheme';
import useMoniVoStore from '../../store/useMoniVoStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// types
interface AddBudgetModalProps {
    visible: boolean;
    onClose: () => void;
}
type BudgetPeriod = | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';

const PERIOD_OPTIONS = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Biweekly' },
    { value: 'monthly', label: 'Monthly' },
];
type FixedBudgetPeriod =
    | 'daily'
    | 'weekly'
    | 'biweekly'
    | 'monthly';

interface PeriodWheelProps {
    value: FixedBudgetPeriod;
    onChange: (value: FixedBudgetPeriod) => void;
}

const PeriodWheel = ({
    value,
    onChange,
}: PeriodWheelProps) => {
    const colors = useTheme();
    const styles = createStyles(colors);

    const ITEM_HEIGHT = 42;

    const selectedIndex = PERIOD_OPTIONS.findIndex(
        item => item.value === value
    );

    const listRef = React.useRef<FlatList>(null);

    const handleScrollEnd = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;

        const index = Math.round(offsetY / ITEM_HEIGHT);

        const selected = PERIOD_OPTIONS[index];

        if (selected) {
            onChange(
                selected.value as FixedBudgetPeriod
            );
        }
    };

    return (
        <View style={styles.periodWheelContainer}>
            <FlatList
                ref={listRef}
                data={PERIOD_OPTIONS}
                keyExtractor={(item) => item.value}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                bounces={false}
                getItemLayout={(_, index) => ({
                    length: ITEM_HEIGHT,
                    offset: ITEM_HEIGHT * index,
                    index,
                })}
                contentContainerStyle={{
                    paddingVertical: ITEM_HEIGHT,
                }}
                initialScrollIndex={
                    selectedIndex >= 0
                        ? selectedIndex
                        : 0
                }
                onMomentumScrollEnd={handleScrollEnd}
                renderItem={({ item }) => {
                    const isSelected =
                        item.value === value;

                    return (
                        <View
                            style={[
                                styles.periodWheelItem,
                                {
                                    height: ITEM_HEIGHT,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.periodWheelText,
                                    isSelected &&
                                    styles.periodWheelTextActive,
                                ]}
                            >
                                {item.label}
                            </Text>
                        </View>
                    );
                }}
            />

            <View
                pointerEvents="none"
                style={styles.periodWheelSelection}
            />
        </View>
    );
};

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

    const recurring = period === 'custom' ? 'none' : period;
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
    const getDailyRange = () => {
        const today = new Date();
        const date = formatDateToString(today);
        return { start: date, end: date };
    }
    const getBiWeeklyRange = () => {
        const today = new Date();
        const currentDay = today.getDay();
        const daysFromMonday =
            currentDay === 0 ? 6 : currentDay - 1;
        const start = new Date(today);
        start.setDate(today.getDate() - daysFromMonday);
        const end = new Date(start);
        end.setDate(start.getDate() + 13);
        return {
            start: formatDateToString(start),
            end: formatDateToString(end),
        };
    }
    // GET RANGE OF DAYS
    // Example:
    // getRangeOfDays('monthly')
    // returns:
    // {
    //     start: '2026-08-01',
    //     end: '2026-08-31'
    // }
    const getRangeOfDays = (periodChosen: 'daily' | 'weekly' | 'biweekly' | 'monthly') => {
        if (periodChosen === 'daily') return getDailyRange();
        if (periodChosen === 'weekly') return getWeeklyRange();
        if (periodChosen === 'biweekly') return getBiWeeklyRange();

        return getMonthlyRange();
    };
    // HANDLE PERIOD CHANGE
    // Runs when the user presses:
    // Monthly, biweekly, week;u.. custom

    const handlePeriodChange = (newPeriod: BudgetPeriod) => {
        // Save the selected period.
        setPeriod(newPeriod);

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
            return;
        }
        const range = getRangeOfDays(newPeriod);
        setStartDate(range.start);
        setEndDate(range.end);
        setShowCalendar(false);
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
            recurring: recurring,
            startDate,
            endDate,
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
                                    onPress={() => setShowCategoryPicker(!showCategoryPicker)}
                                >
                                    <Text style={[
                                        styles.selectorText,
                                        !selectedCategory && {
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
                                        placeholderTextColor={colors.textMuted + '70'}
                                        keyboardType="decimal-pad"
                                    />
                                </View>
                            </View>
                            {/* PERIOD*/}

                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>
                                    Period
                                </Text>

                                <View style={styles.periodSelectorRow}>
                                    <PeriodWheel
                                        value={
                                            period === 'custom'
                                                ? 'monthly'
                                                : period
                                        }
                                        onChange={handlePeriodChange}
                                    />

                                    <TouchableOpacity
                                        style={[
                                            styles.customPeriodButton,
                                            period === 'custom' &&
                                            styles.customPeriodButtonActive,
                                        ]}
                                        onPress={() =>
                                            handlePeriodChange('custom')
                                        }
                                        activeOpacity={0.8}
                                    >
                                        <CalendarIcon
                                            size={20}
                                            color={
                                                period === 'custom'
                                                    ? colors.background
                                                    : colors.champagne
                                            }
                                        />

                                        <Text
                                            style={[
                                                styles.customPeriodText,
                                                period === 'custom' &&
                                                styles.customPeriodTextActive,
                                            ]}
                                        >
                                            Custom
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* BUDGET PERIOD*/}

                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>Budget Period</Text>
                                {/* DATE SUMMARY*/}
                                <View style={styles.dateSummary}>
                                    <CalendarIcon size={19} color={colors.champagne} />
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

                            {/*CREATE BUTTON*/}
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={handleSubmit}
                                activeOpacity={0.85}>
                                <Text style={styles.submitText}>
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
        maxWidth: 500,
        maxHeight: '88%',

        backgroundColor: colors.surface,

        borderColor: colors.champagne + '55',
        borderRadius: 30,
        borderWidth: 1,
        overflow: 'hidden',

        shadowOffset: {
            width: 0,
            height: 15,
        },
        shadowOpacity: 0.35,
        shadowRadius: 35,
        elevation: 25,
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
        fontSize: 46,
        fontWeight: '700',
        minWidth: SCREEN_WIDTH * 0.45,
        maxWidth: SCREEN_WIDTH * 0.62,
        textAlign: 'center',
        paddingVertical: 0,
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
    // SUBMIT
    submitButton: {
        minHeight: 52,
        borderRadius: 15,
        backgroundColor: colors.champagne,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
        shadowOffset: { width: 0, height: 6, },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 5,
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
    periodSelectorRow: {
        flexDirection: 'row',
        gap: 10,
        height: 126,
    },

    periodWheelContainer: {
        flex: 1,
        height: 126,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: colors.surfaceAlt,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },

    periodWheelItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    periodWheelText: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.textMuted,
    },

    periodWheelTextActive: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.champagne,
    },

    periodWheelSelection: {
        position: 'absolute',
        left: 8,
        right: 8,
        top: 42,
        height: 42,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.champagne + '55',
        backgroundColor: colors.champagne + '08',
        borderRadius: 10,
    },

    customPeriodButton: {
        width: '28%',
        minWidth: 90,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
    },

    customPeriodButtonActive: {
        backgroundColor: colors.champagne,
        borderColor: colors.champagne,
    },

    customPeriodText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textSecondary,
    },

    customPeriodTextActive: {
        color: colors.background,
    },

});