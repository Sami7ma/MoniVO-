// components/modals/AddTransactionModal.tsx
//
// MoniVo — Add Income / Add Expense modal
//
// Design:
// - Floating glassmorphism card
// - Centered on screen
// - HomeScreen remains visible behind it
// - Theme-aware using useTheme()
// - No hardcoded Colors import
// - Dark/light mode supported
// - Expense = danger
// - Income = success
// - Champagne/gold used for MoniVo accents
//

import React, { useEffect, useState } from 'react';

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
    Dimensions,
    Pressable,
} from 'react-native';

import {
    X,
    ChevronDown,
    Check,
} from 'lucide-react-native';

import { Transaction } from '../../types/Transaction';
import useMoniVoStore from '../../store/useMoniVoStore';
import useTheme from '../../hooks/useTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// PROPS

interface AddTransactionModalProps {
    visible: boolean;
    onClose: () => void;
    defaultType: 'CREDIT' | 'DEBIT';
}

// COMPONENT

export default function AddTransactionModal({
    visible,
    onClose,
    defaultType,
}: AddTransactionModalProps) {
    // THEME
    const colors = useTheme();
    // Styles must be created using the current theme.
    const styles = createStyles(colors);
    // ZUSTAND
    const categories = useMoniVoStore(
        (state) => state.categories
    );

    const addTransaction = useMoniVoStore(
        (state) => state.addTransaction
    );

    const wallets = useMoniVoStore(
        (state) => state.wallets
    );


    // FORM STATE
    const [type, setType] = useState<'CREDIT' | 'DEBIT'>(
        defaultType
    );
    const [amount, setAmount] = useState('');

    const [note, setNote] = useState('');

    const [selectedCategoryId, setSelectedCategoryId] =
        useState<string>('');

    const [showCategoryPicker, setShowCategoryPicker] =
        useState(false);

    // RESET FORM

    useEffect(() => {
        if (visible) {
            setType(defaultType);
            setAmount('');
            setNote('');
            setSelectedCategoryId('');
            setShowCategoryPicker(false);
        }
    }, [defaultType, visible]);

    // CATEGORY    

    const selectedCategory = categories.find(
        (category) => category.id === selectedCategoryId
    );

    const filteredCategories = categories.filter(
        (category) =>
            type === 'DEBIT'
                ? category.flow === 'EXPENSE'
                : category.flow === 'INCOME'
    );

    // SUBMIT

    const handleSubmit = () => {

        const numAmount = parseFloat(amount);
        // Validate amount
        if (isNaN(numAmount) || numAmount <= 0 || !amount.trim()) {
            alert('Please enter a valid amount');
            return;
        }
        // Validate category
        if (!selectedCategory) {
            alert('Please select a category');
            return;
        }
        const now = new Date().toISOString();
        const newTransaction: Transaction = {
            id: `txn-${Date.now()}`,
            amount: numAmount,
            type,
            categoryId: selectedCategoryId,
            walletId:
                wallets.length > 0
                    ? wallets[0].id
                    : 'wallet-1',

            date: now,

            note: note.trim() || undefined,

            createdAt: now,

            status: 'CLEARED',
        };

        // Add transaction to Zustand.
        // HomeScreen automatically receives the new state.
        addTransaction(newTransaction);

        // Close modal.
        onClose();
    };


    // ─────────────────────────────────────────────────────────────────────────
    // CURRENT TYPE COLOR
    // ─────────────────────────────────────────────────────────────────────────

    const accentColor =
        type === 'CREDIT'
            ? colors.success
            : colors.danger;


    // ─────────────────────────────────────────────────────────────────────────
    // UI
    // ─────────────────────────────────────────────────────────────────────────

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
        >

            {/* Full screen modal layer */}
            <View style={styles.modalRoot}>

                {/* Dark / glass backdrop */}
                <Pressable
                    style={styles.backdrop}
                    onPress={onClose}
                />

                {/* Keyboard handling */}
                <KeyboardAvoidingView
                    style={styles.keyboardLayer}
                    behavior={
                        Platform.OS === 'ios'
                            ? 'padding'
                            : undefined
                    }
                >

                    {/* ─────────────────────────────────────────────────────
                        FLOATING GLASS CARD
                    ───────────────────────────────────────────────────── */}

                    <View
                        style={[
                            styles.container,
                            {
                                borderColor:
                                    colors.champagne + '55',
                            },
                        ]}
                    >

                        {/* Inner glass highlight */}
                        <View
                            pointerEvents="none"
                            style={[
                                styles.glassHighlight,
                                {
                                    borderColor:
                                        colors.champagne + '18',
                                },
                            ]}
                        />


                        {/* ───────────────────────────────────────────────
                            HEADER
                        ─────────────────────────────────────────────── */}

                        <View style={styles.header}>

                            <View>
                                <Text style={styles.headerEyebrow}>
                                    TRANSACTION
                                </Text>

                                <Text style={styles.headerTitle}>
                                    {type === 'CREDIT'
                                        ? 'Add Income'
                                        : 'Add Expense'}
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={onClose}
                                style={[
                                    styles.closeButton,
                                    {
                                        borderColor:
                                            colors.border,
                                    },
                                ]}
                                activeOpacity={0.7}
                            >
                                <X
                                    size={20}
                                    color={colors.textSecondary}
                                    strokeWidth={2}
                                />
                            </TouchableOpacity>

                        </View>


                        {/* ───────────────────────────────────────────────
                            FORM
                        ─────────────────────────────────────────────── */}

                        <ScrollView
                            style={styles.scroll}
                            contentContainerStyle={styles.form}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >


                            {/* ─────────────────────────────────────────
                                TYPE TOGGLE
                            ───────────────────────────────────────── */}

                            <View style={styles.toggleContainer}>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        setType('DEBIT');
                                        setSelectedCategoryId('');
                                    }}
                                    style={[
                                        styles.toggleButton,
                                        type === 'DEBIT' && {
                                            borderColor:
                                                colors.danger,
                                            backgroundColor:
                                                colors.danger + '10',
                                        },
                                    ]}
                                >

                                    <View
                                        style={[
                                            styles.typeDot,
                                            {
                                                backgroundColor:
                                                    colors.danger,
                                            },
                                        ]}
                                    />

                                    <Text
                                        style={[
                                            styles.toggleText,
                                            {
                                                color:
                                                    type === 'DEBIT'
                                                        ? colors.danger
                                                        : colors.textSecondary,
                                            },
                                        ]}
                                    >
                                        Expense
                                    </Text>

                                </TouchableOpacity>


                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        setType('CREDIT');
                                        setSelectedCategoryId('');
                                    }}
                                    style={[
                                        styles.toggleButton,
                                        type === 'CREDIT' && {
                                            borderColor:
                                                colors.success,
                                            backgroundColor:
                                                colors.success + '10',
                                        },
                                    ]}
                                >

                                    <View
                                        style={[
                                            styles.typeDot,
                                            {
                                                backgroundColor:
                                                    colors.success,
                                            },
                                        ]}
                                    />

                                    <Text
                                        style={[
                                            styles.toggleText,
                                            {
                                                color:
                                                    type === 'CREDIT'
                                                        ? colors.success
                                                        : colors.textSecondary,
                                            },
                                        ]}
                                    >
                                        Income
                                    </Text>

                                </TouchableOpacity>

                            </View>


                            {/* ─────────────────────────────────────────
                                AMOUNT
                            ───────────────────────────────────────── */}

                            <View style={styles.amountSection}>

                                <Text
                                    style={[
                                        styles.currency,
                                        {
                                            color:
                                                colors.textSecondary,
                                        },
                                    ]}
                                >
                                    ETB
                                </Text>

                                <TextInput
                                    style={[
                                        styles.amountInput,
                                        {
                                            color:
                                                colors.champagne,
                                        },
                                    ]}
                                    value={amount}
                                    onChangeText={setAmount}
                                    placeholder="0.00"
                                    placeholderTextColor={
                                        colors.textMuted + '70'
                                    }
                                    keyboardType="decimal-pad"
                                    autoFocus
                                />

                            </View>


                            {/* ─────────────────────────────────────────
                                CATEGORY
                            ───────────────────────────────────────── */}

                            <View style={styles.fieldGroup}>

                                <Text style={styles.label}>
                                    Category
                                </Text>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[
                                        styles.selectorButton,
                                        {
                                            backgroundColor:
                                                colors.surfaceAlt,
                                            borderColor:
                                                colors.border,
                                        },
                                    ]}
                                    onPress={() =>
                                        setShowCategoryPicker(
                                            !showCategoryPicker
                                        )
                                    }
                                >

                                    <Text
                                        style={[
                                            styles.selectorText,
                                            {
                                                color:
                                                    selectedCategory
                                                        ? colors.textPrimary
                                                        : colors.textMuted,
                                            },
                                        ]}
                                    >
                                        {selectedCategory?.name ??
                                            'Select a category'}
                                    </Text>

                                    <ChevronDown
                                        size={18}
                                        color={
                                            colors.textSecondary
                                        }
                                    />

                                </TouchableOpacity>


                                {/* Category dropdown */}

                                {showCategoryPicker && (

                                    <View
                                        style={[
                                            styles.categoryList,
                                            {
                                                backgroundColor:
                                                    colors.surface,
                                                borderColor:
                                                    colors.border,
                                            },
                                        ]}
                                    >

                                        <ScrollView
                                            nestedScrollEnabled
                                            showsVerticalScrollIndicator={
                                                false
                                            }
                                        >

                                            {filteredCategories.map(
                                                (category) => {

                                                    const isSelected =
                                                        category.id ===
                                                        selectedCategoryId;

                                                    return (
                                                        <TouchableOpacity
                                                            key={
                                                                category.id
                                                            }
                                                            activeOpacity={
                                                                0.7
                                                            }
                                                            style={[
                                                                styles.categoryItem,
                                                                {
                                                                    borderBottomColor:
                                                                        colors.border,
                                                                    backgroundColor:
                                                                        isSelected
                                                                            ? colors.champagne + '12'
                                                                            : 'transparent',
                                                                },
                                                            ]}
                                                            onPress={() => {
                                                                setSelectedCategoryId(
                                                                    category.id
                                                                );
                                                                setShowCategoryPicker(
                                                                    false
                                                                );
                                                            }}
                                                        >

                                                            <Text
                                                                style={[
                                                                    styles.categoryItemText,
                                                                    {
                                                                        color:
                                                                            isSelected
                                                                                ? colors.champagne
                                                                                : colors.textPrimary,
                                                                    },
                                                                ]}
                                                            >
                                                                {
                                                                    category.name
                                                                }
                                                            </Text>

                                                            {isSelected && (
                                                                <Check
                                                                    size={17}
                                                                    color={
                                                                        colors.champagne
                                                                    }
                                                                />
                                                            )}

                                                        </TouchableOpacity>
                                                    );
                                                }
                                            )}

                                        </ScrollView>

                                    </View>
                                )}

                            </View>


                            {/* ─────────────────────────────────────────
                                NOTE
                            ───────────────────────────────────────── */}

                            <View style={styles.fieldGroup}>

                                <Text style={styles.label}>
                                    Note
                                    <Text
                                        style={{
                                            color:
                                                colors.textMuted,
                                        }}
                                    >
                                        {' '}
                                        Optional
                                    </Text>
                                </Text>

                                <TextInput
                                    style={[
                                        styles.noteInput,
                                        {
                                            backgroundColor:
                                                colors.surfaceAlt,
                                            borderColor:
                                                colors.border,
                                            color:
                                                colors.textPrimary,
                                        },
                                    ]}
                                    value={note}
                                    onChangeText={setNote}
                                    placeholder="e.g. Coffee at Tomoca"
                                    placeholderTextColor={
                                        colors.textMuted
                                    }
                                    multiline
                                    numberOfLines={2}
                                    textAlignVertical="top"
                                />

                            </View>


                            {/* ─────────────────────────────────────────
                                SUBMIT
                            ───────────────────────────────────────── */}

                            <TouchableOpacity
                                activeOpacity={0.78}
                                onPress={handleSubmit}
                                style={[
                                    styles.submitButton,
                                    {
                                        backgroundColor:
                                            accentColor,
                                        shadowColor:
                                            accentColor,
                                    },
                                ]}
                            >

                                <Text style={styles.submitText}>
                                    {type === 'CREDIT'
                                        ? 'Add Income'
                                        : 'Add Expense'}
                                </Text>

                            </TouchableOpacity>

                        </ScrollView>

                    </View>

                </KeyboardAvoidingView>

            </View>

        </Modal>
    );
}


// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

const createStyles = (colors: ReturnType<typeof useTheme>) =>
    StyleSheet.create({

        // Full screen transparent modal.
        modalRoot: {
            flex: 1,
        },

        // This is what keeps HomeScreen visible behind
        // the floating form.
        backdrop: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: colors.overlay,
        },

        // Centers the floating form.
        keyboardLayer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 14,
            paddingVertical: 24,
        },

        // ─────────────────────────────────────────────────────────────────
        // GLASS CARD
        // ─────────────────────────────────────────────────────────────────

        container: {
            width: '100%',
            maxWidth: 500,

            // Important:
            // Do NOT use height: 85%.
            // That was part of the reason the layout was behaving badly.
            maxHeight: '88%',

            backgroundColor:
                colors.surface + 'F2',

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

        // Very subtle inner glass border.
        glassHighlight: {
            ...StyleSheet.absoluteFillObject,

            borderRadius: 30,

            borderWidth: 1,

            pointerEvents: 'none',
        },

        // ─────────────────────────────────────────────────────────────────
        // HEADER
        // ─────────────────────────────────────────────────────────────────

        header: {
            flexDirection: 'row',

            justifyContent: 'space-between',

            alignItems: 'center',

            paddingHorizontal: 22,

            paddingTop: 20,

            paddingBottom: 18,

            borderBottomWidth: 1,

            borderBottomColor:
                colors.border,
        },

        headerEyebrow: {
            fontSize: 10,

            fontWeight: '700',

            letterSpacing: 1.5,

            color: colors.champagne,

            marginBottom: 4,
        },

        headerTitle: {
            fontSize: 21,

            fontWeight: '700',

            color: colors.textPrimary,

            letterSpacing: -0.3,
        },

        closeButton: {
            width: 38,

            height: 38,

            borderRadius: 19,

            alignItems: 'center',

            justifyContent: 'center',

            backgroundColor:
                colors.surfaceAlt,

            borderWidth: 1,
        },

        // ─────────────────────────────────────────────────────────────────
        // SCROLL
        // ─────────────────────────────────────────────────────────────────

        scroll: {
            flexGrow: 0,
        },

        form: {
            paddingHorizontal: 20,

            paddingTop: 20,

            paddingBottom: 20,

            gap: 18,
        },

        // ─────────────────────────────────────────────────────────────────
        // TYPE TOGGLE
        // ─────────────────────────────────────────────────────────────────

        toggleContainer: {
            flexDirection: 'row',

            gap: 10,
        },

        toggleButton: {
            flex: 1,

            minHeight: 48,

            borderRadius: 15,

            borderWidth: 1,

            borderColor:
                colors.border,

            backgroundColor:
                colors.surfaceAlt,

            flexDirection: 'row',

            alignItems: 'center',

            justifyContent: 'center',

            gap: 8,
        },

        typeDot: {
            width: 7,

            height: 7,

            borderRadius: 4,
        },

        toggleText: {
            fontSize: 14,

            fontWeight: '600',
        },

        // ─────────────────────────────────────────────────────────────────
        // AMOUNT
        // ─────────────────────────────────────────────────────────────────

        amountSection: {
            flexDirection: 'row',

            alignItems: 'center',

            justifyContent: 'center',

            minHeight: 100,

            gap: 8,
        },

        currency: {
            fontSize: 17,

            fontWeight: '500',

            marginTop: 8,
        },

        amountInput: {
            fontSize: 46,

            fontWeight: '700',

            minWidth: SCREEN_WIDTH * 0.45,

            maxWidth: SCREEN_WIDTH * 0.62,

            textAlign: 'center',

            paddingVertical: 0,
        },

        // ─────────────────────────────────────────────────────────────────
        // FIELDS
        // ─────────────────────────────────────────────────────────────────

        fieldGroup: {
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
        },

        selectorText: {
            fontSize: 15,

            fontWeight: '500',
        },

        // ─────────────────────────────────────────────────────────────────
        // CATEGORY LIST
        // ─────────────────────────────────────────────────────────────────

        categoryList: {
            maxHeight: 170,

            marginTop: 6,

            borderRadius: 14,

            borderWidth: 1,

            overflow: 'hidden',
        },

        categoryItem: {
            minHeight: 48,

            paddingHorizontal: 15,

            flexDirection: 'row',

            alignItems: 'center',

            justifyContent: 'space-between',

            borderBottomWidth: 1,
        },

        categoryItemText: {
            fontSize: 14,

            fontWeight: '500',
        },

        // ─────────────────────────────────────────────────────────────────
        // NOTE
        // ─────────────────────────────────────────────────────────────────

        noteInput: {
            minHeight: 72,

            borderRadius: 14,

            borderWidth: 1,

            paddingHorizontal: 15,

            paddingTop: 13,

            paddingBottom: 12,

            fontSize: 14,

            lineHeight: 20,
        },

        // ─────────────────────────────────────────────────────────────────
        // SUBMIT
        // ─────────────────────────────────────────────────────────────────

        submitButton: {
            minHeight: 52,

            borderRadius: 15,

            alignItems: 'center',

            justifyContent: 'center',

            marginTop: 2,

            shadowOffset: {
                width: 0,

                height: 6,
            },

            shadowOpacity: 0.18,

            shadowRadius: 12,

            elevation: 5,
        },

        submitText: {
            color: '#FFFFFF',

            fontSize: 15,

            fontWeight: '700',

            letterSpacing: 0.4,
        },
    });