// components/home/BalanceCards.tsx
// Premium swipeable MoniVo financial cards.
// Default card: Total Balance
// Swipe left/right: Total Income / Total Expenses
//
// NOTE:
// - No WiFi/contactless icon.
// - The entire "MoniVo" wordmark is italic.
// - Credit-card styling is kept.
// - Cards are slightly narrower than the screen so the neighboring cards
//   are visible, giving the stacked/swipeable-card feeling.
// - This component ONLY handles the cards. Your navbar, transactions,
//   buttons, and the rest of HomeScreen stay unchanged.

import React, { useRef, useState, forwardRef, useImperativeHandle, } from 'react';
import { Nfc } from 'lucide-react-native'
import { View, Text, FlatList, StyleSheet, Dimensions, ViewToken, Platform, } from 'react-native';
import { Colors } from '../../constants/colors';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// The card is intentionally smaller than the available screen width.
// This allows the next/previous card to peek through.
const CARD_WIDTH = SCREEN_WIDTH - 64;
const CARD_GAP = 12;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;


export interface BalanceCardsRef {
    scrollToIncome: () => void;
    scrollToExpense: () => void;
    scrollToBalance: () => void;
}

interface BalanceCardsProps {
    userName: string;
    totalBalance: number;
    totalIncome: number;
    totalExpenses: number;
}

// each card has a uniqu colr schee to mathc th epremim dark or light card look
interface CardData {
    id: string;
    type: 'income' | 'balance' | 'expense';
    label: string;
    amountColor: string;
}
const cardConfigs: CardData[] = [
    {
        id: 'income',
        type: 'income',
        label: 'TOTAL INCOME',
        amountColor: '#009688',
    },
    {
        id: 'balance',
        type: 'balance',
        label: 'TOTAL BALANCE',
        amountColor: Colors.champagne,
    },
    {
        id: 'expense',
        type: 'expense',
        label: 'TOTAL EXPENSES',
        amountColor: '#a34846ff',
    },
];
// COMPONENT
// forwardRef lets the parent (Homescreen) access methods ont thsi componetnt\

const BalanceCards = forwardRef<BalanceCardsRef, BalanceCardsProps>(
    ({ userName, totalBalance, totalIncome, totalExpenses }, ref) => {
        // Balance is the default card.

        const flatlistRef = useRef<FlatList>(null);
        const [activeIndex, setActiveIndex] = useState(1); // start on the balance card (middle)
        // expose scroll methods
        // useImpaciveHandle says: parent component can acess these methods
        const scrollToCard = (index: number) => {
            flatlistRef.current?.scrollToIndex({
                index,
                animated: true,
            });
        };
        useImperativeHandle(ref, () => ({
            scrollToIncome: () => scrollToCard(0),
            scrollToBalance: () => scrollToCard(1),
            scrollToExpense: () => scrollToCard(2),
        }));
        // track which card is visible.
        const onViewableItemsChanged = useRef(
            ({ viewableItems }: { viewableItems: ViewToken[]; }) => {
                if (viewableItems.length > 0) {
                    setActiveIndex(viewableItems[0].index ?? 1);
                }
            }
        ).current;
        const viewabilityConfig = useRef({
            viewAreaCoveragePercentThreshold: 60,
        }).current;
        // get the rign amoutn for each card type
        const getAmount = (type: string): number => {
            if (type === 'income') return totalIncome;
            if (type === 'expense') return totalExpenses;
            return totalBalance;
        }

        // format money nicley 
        const formatMoney = (amount: number) =>
            `ETB ${Math.abs(amount).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`;
        // ─────────────────────────────────────────────────────────────────────
        // CHIP
        // ─────────────────────────────────────────────────────────────────────

        // render a single Card
        const renderCard = ({ item }: { item: CardData; }) => (
            <View style={[
                styles.card,
                // i can use an image in the bakgoun for the future 
            ]}>
                {/* Top row: MOniVO logo + contactles icon */}
                < View style={styles.cardTopRow} >
                    <Text style={styles.cardLogoItalic} >
                        MoniVo
                    </Text>
                    {/* align right  */}
                    <Nfc size={20} style={styles.nfcIcon} />
                </View >
                {/* Fake chip  */}
                < View style={[styles.chip, { backgroundColor: "#C8A96B" }]} >
                    <View style={styles.chipLines}>
                        <View style={styles.chipLine}></View>
                        <View style={styles.chipLine}></View>
                        <View style={styles.chipLine}></View>
                    </View>
                </View >
                {/* Labe + amount */}
                < Text style={[styles.cardLabel, { color: item.amountColor }]} >
                    {item.label}
                </Text >
                <Text style={[styles.cardAmount, { color: item.amountColor }]}>
                    {formatMoney(getAmount(item.type))}
                </Text>
                {/* DOr indicaors sam dors forn onoardin bus amlller this time */}
                <View style={styles.cardDots}>
                    {[0, 1, 2, 3].map((_, i) => (
                        <View key={i} style={[
                            styles.fakeDot,
                            { backgroundColor: Colors.muted },
                        ]} />
                    ))}
                    <View style={{ width: 12 }} />
                    {[0, 1, 2, 3].map((_, i) => (
                        <View key={`b${i}`} style={[
                            styles.fakeDot,
                            { backgroundColor: Colors.muted },
                        ]} />
                    ))}
                    <View style={{ width: 12 }} />
                    {[0, 1, 2, 3].map((_, i) => (
                        <View key={`c${i}`} style={[
                            styles.fakeDot,
                            { backgroundColor: Colors.muted },
                        ]} />
                    ))}
                    <View style={{ width: 12 }} />
                    {[0, 1, 2, 3].map((_, i) => (
                        <View key={`d${i}`} style={[
                            styles.fakeDot,
                            { backgroundColor: Colors.muted },
                        ]} />
                    ))}
                </View>

                {/* bottom rowL name + Monivo logo */}
                <View style={styles.cardBottomRow}>
                    <Text style={[styles.cardHolder, { color: '#ffffff' }]}>
                        {userName}
                    </Text>
                    <Text style={styles.cardBrand}>
                        MONIVO
                    </Text>
                </View>
            </View >

        );
        return (
            <View>
                {/* flatlist is going to hold all the cards, slide left/right to switch between Income, Balance, Expense */}
                <FlatList
                    ref={flatlistRef}
                    data={cardConfigs}
                    renderItem={renderCard}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    onViewableItemsChanged={onViewableItemsChanged}
                    initialScrollIndex={1} // start on teh balacne card
                    getItemLayout={(_, index) => ({
                        // tell floatlist exactl how sien eac ite is 
                        // required for intial scrol indec to work 
                        length: SNAP_INTERVAL,
                        offset: index * SNAP_INTERVAL,
                        index,
                    })}
                    snapToInterval={SNAP_INTERVAL}
                    decelerationRate="fast"
                    contentContainerStyle={{ paddingHorizontal: 0 }}
                />
                {/* dot indicaros below the cards  */}
                <View style={styles.dotsRow}>
                    {cardConfigs.map((_, i) => (
                        <View key={i} style={
                            [styles.dots,
                            i === activeIndex ? styles.dotActive : styles.dotInactive]}
                        />
                    ))}
                </View>
            </View >
        );
    }
);
export default BalanceCards;

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        aspectRatio: 2,
        borderRadius: 18,
        marginRight: CARD_GAP,
        padding: 20,
        justifyContent: 'space-between',
        backgroundColor: '#000',
        borderWidth: 0.2,
        borderColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardLogo: {
        fontWeight: '500',
        color: Colors.champagne,
        letterSpacing: 1,
    },
    cardLogoItalic: {
        fontStyle: 'italic',
        fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'cursive',
        fontSize: 28,
        fontWeight: '500',
        color: 'white',
    },
    chip: {
        marginTop: 5,
        width: 40,
        height: 24,
        borderRadius: 6,
        justifyContent: 'center',
        opacity: 0.9,
    },
    chipLines: {
        flex: 1,
        justifyContent: 'space-around',

    },
    chipLine: {
        height: 2,
        borderRadius: 1,
    },
    cardLabel: {
        fontSize: 11,
        letterSpacing: 2,
        fontWeight: '600',
        marginTop: 8
    },
    cardAmount: {
        marginTop: 1,
        fontSize: 15,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    cardDots: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    fakeDot: {
        width: 8,
        height: 9,
        borderRadius: 4,
        marginTop: 4,
        marginBottom: 4,
    },
    cardBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardHolder: {
        fontSize: 13,
        letterSpacing: 0.7,
        fontWeight: '500',
    },
    cardBrand: {
        color: '#ffffff',
    },
    dotsRow: {
        flexDirection: 'row',
        gap: 6,
        justifyContent: 'center',
        marginTop: 10,
        alignItems: 'center',
        marginBottom: 8,
    },
    dots: {
        height: 6,
        borderRadius: 3,

    },
    dotActive: {
        width: 25,
        backgroundColor: Colors.champagne,
    },
    dotInactive: {
        width: 6,
        backgroundColor: Colors.muted + '30',
    },
    nfcIcon: {
        position: 'absolute',
        right: 0,
        color: Colors.champagne,
    },
});
