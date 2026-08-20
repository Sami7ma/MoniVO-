// the form modal for addin a new expense or income
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,          // Built-in React Native overlay component
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
} from 'react-native';
import { X, ChevronDown, Check, Scroll, Touchpad } from 'lucide-react-native';
import { Colors } from "../../constants/colors";
import { Transaction } from "../../types/Transaction";
import useMoniVoStore from "../../store/useMoniVoStore";
import { CurrentRenderContext } from "@react-navigation/native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Props

interface AddTransactionModalProps {
    visible: boolean; // contros where the modal is shown
    onClose: () => void; // called when user tops X or bacdrop or done
    defaultType: 'CREDIT' | 'DEBIT'; // is it an expense or income
    // onSubmit: (transaction: Transaction) => void; // called when user taps "Add Transaction"
}
export default function AddTransactionModal({
    visible,
    onClose,
    defaultType,
}: AddTransactionModalProps) {
    // form state
    const [type, setType] = useState<'CREDIT' | 'DEBIT'>(defaultType);
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    // ZUstand
    // explain what is happein in her
    const categories = useMoniVoStore((state) => state.categories);
    const addTransaction = useMoniVoStore((state) => state.addTransaction);
    const wallets = useMoniVoStore((state) => state.wallets);
    // reset form when defaultType changes (modal)
    React.useEffect(() => {
        setType(defaultType);
        setAmount('');
        setNote('');
        setSelectedCategoryId('');
        setShowCategoryPicker(false);
    }, [defaultType, visible]);
    // find teh selected category object for display
    const selectedCategory = categories.find((c) => c.id === selectedCategoryId)
    const filteredCategories = categories.filter((c) =>
        type === 'DEBIT'
            ? c.flow === 'EXPENSE'
            : c.flow === 'INCOME'
    );
    //submit handler
    const handleSubmit = () => {
        // validate
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0 || !amount) {
            alert('Please enter a valid amount');
            return;
        }
        if (!selectedCategory) {
            alert('Please select a category');
            return;
        }
        // build the transaction object mathcing our transaction type
        const newTransaction: Transaction = {
            id: `txn-${Date.now()}`,   // Simple unique ID using timestamp
            amount: numAmount,
            type: type,
            categoryId: selectedCategoryId,
            walletId: wallets.length > 0 ? wallets[0].id : 'wallet-1',
            date: new Date().toISOString(),
            note: note.trim() || undefined,
            createdAt: new Date().toISOString(),
            status: 'CLEARED'
        };
        // add to Zustand stor e -t hi simpedialteu update teh HOmescren
        addTransaction(newTransaction);

        onClose();
    };

    // UI
    return (
        <Modal
            visible={visible}
            animationType='slide' // slide, fade , none
            transparent={true}
            onRequestClose={onClose}// andorid back button
        >
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>
                            {type === 'CREDIT' ? 'Add Income' : 'Add Expense'}
                        </Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={22} color={Colors.ivory} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.form}
                        keyboardShouldPersistTaps='handled'>
                        {/* toggle row */}
                        <View style={styles.toggleRow}>
                            <TouchableOpacity
                                style={[styles.toggleButton,
                                type === 'DEBIT' && styles.toggleButtonActive,
                                type === 'DEBIT' && { borderColor: '#EF5350' },
                                ]}
                                onPress={() => setType('DEBIT')}
                            >
                                <Text style={[
                                    styles.toggleText,
                                    type === 'DEBIT' && { color: '#EF5350' },
                                ]}>
                                    Expense
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.toggleButton,
                                    type === 'CREDIT' && styles.toggleButtonActive,
                                    type === 'CREDIT' && { borderColor: '#4CAF50' },
                                ]}
                                onPress={() => setType('CREDIT')}
                            >
                                <Text style={[
                                    styles.toggleText,
                                    type === 'CREDIT' && { color: '#4CAF50' },
                                ]}>
                                    Income
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {/* amount input */}
                        <View style={styles.amountSection}>
                            <Text style={styles.currency}>ETB</Text>
                            <TextInput
                                style={styles.amountInput}
                                value={amount}
                                onChangeText={setAmount}
                                placeholder='0.00'
                                placeholderTextColor={Colors.muted + '60'}
                                keyboardType='decimal-pad'
                                autoFocus={true}
                            />
                        </View>
                        {/* Category Selector */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Category</Text>
                            <TouchableOpacity
                                style={styles.selectorButton}
                                onPress={() => setShowCategoryPicker(!showCategoryPicker)}
                            >
                                <Text style={[
                                    styles.selectorText,
                                    !selectedCategory && { color: Colors.muted },
                                ]}>
                                    {selectedCategory?.name ?? 'Select a category'}
                                </Text>
                            </TouchableOpacity>
                            {/* category dropdown List -shows when ShowCategorpicker is true */}
                            {showCategoryPicker && (
                                <View style={styles.categroryList}>
                                    {filteredCategories.map((cat) => (
                                        <TouchableOpacity
                                            key={cat.id}
                                            style={[
                                                styles.categroryItem,
                                                cat.id == selectedCategoryId && styles.categoryItemActive,
                                            ]}
                                            onPress={() => {
                                                setSelectedCategoryId(cat.id);
                                                setShowCategoryPicker(false); // close picker after selction
                                            }}
                                        >
                                            <Text style={[
                                                styles.categoryItemText,
                                                cat.id === selectedCategoryId && { color: Colors.champagne },
                                            ]}>
                                                {cat.name}
                                            </Text>

                                        </TouchableOpacity>
                                    ))}
                                </View>

                            )}
                        </View>
                        {/* ── NOTE INPUT ──────────────────────────────────────────────── */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Note (Optional)</Text>
                            <TextInput
                                style={styles.noteInput}
                                value={note}
                                onChangeText={setNote}
                                placeholder="e.g. Coffee at Tomoca"
                                placeholderTextColor={Colors.muted}
                                multiline={true}         // Allows multiple lines
                                numberOfLines={2}
                            />
                        </View>
                        {/* ── SUBMIT BUTTON ───────────────────────────────────────────── */}
                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                {
                                    backgroundColor: type === 'CREDIT' ? '#4CAF50' : '#EF5350',
                                },
                            ]}
                            onPress={handleSubmit}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.submitText}>
                                {type === 'CREDIT' ? 'Add Income' : 'Add Expense'}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
    },
    container: {
        width: '100%',
        maxHeight: '100%',
        backgroundColor: Colors.background,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.surface,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.ivory,
    },
    closeButton: {
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    form: {
        padding: 20,
        gap: 20,
    },
    toggleRow: {
        flexDirection: 'row',
        gap: 10,
    },
    toggleButton: {
        flex: 1,
        borderRadius: 16, // pill shape
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 6,
        borderWidth: 1.5,
        borderColor: Colors.surface,
    },
    toggleButtonActive: {
        borderColor: Colors.background,
    },
    toggleText: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.3,
        color: Colors.muted,
    },
    amountSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 13,
    },
    currency: {
        fontSize: 24,
        fontWeight: '200',
        color: Colors.muted,
    },
    amountInput: {
        fontSize: 48,
        fontWeight: 'bold',
        color: Colors.champagne,
        minWidth: SCREEN_WIDTH * 0.5,
        textAlign: 'center',
    },
    fieldGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        color: Colors.muted,
        fontWeight: '500',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    selectorButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        paddingHorizontal: 16,
        borderRadius: 12,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: Colors.subtleGold + '30',
    },
    selectorText: {
        fontSize: 16,
        color: Colors.ivory,
    },
    categroryList: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        marginTop: 8,
        borderWidth: 1,
        borderColor: Colors.subtleGold + '20',
        maxHeight: 200,
    },
    categroryItem: {
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: Colors.subtleGold + '15',
    },
    categoryItemActive: {
        backgroundColor: Colors.subtleGold + '10',
    },
    categoryItemText: {
        fontSize: 16,
        color: Colors.ivory,
    },
    noteInput: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: Colors.ivory,
        borderColor: Colors.subtleGold + '20',
        borderWidth: 1,
        textAlignVertical: 'top',
        minHeight: 75,
    },
    submitButton: {
        borderRadius: 13,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    submitText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});