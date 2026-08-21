// components/home/BalanceCards.tsx
// Premium swipeable MoniVo financial cards.
// Default card: Total Balance
// Swipe left/right: Total Income / Total Expenses

import React, {
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
} from 'react';
import { Nfc } from 'lucide-react-native';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Dimensions,
    ViewToken,
    Platform,
    ImageBackground
} from 'react-native';
import useTheme from '../../hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// The card is intentionally smaller than the available screen width.
// This allows the next/previous card to peek through.
const CARD_WIDTH = SCREEN_WIDTH - 25;
const CARD_GAP = 12;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;
// REF

export interface BalanceCardsRef {
    scrollToIncome: () => void;
    scrollToExpense: () => void;
    scrollToBalance: () => void;
}
// PROPS

interface BalanceCardsProps {
    userName: string;
    totalBalance: number;
    totalIncome: number;
    totalExpenses: number;
}
// CARD DATA

interface CardData {
    id: string;
    type: 'income' | 'balance' | 'expense';
    label: string;
    amountColor: string;
    gradientColors: [string, string, ...string[]];
}

const cardConfigs: CardData[] = [
    {
        id: 'income',
        type: 'income',
        label: 'TOTAL INCOME',
        amountColor: '#009688',
        gradientColors: ['#1A3A2A', '#0F2318', '#0A1A12'],
    },
    {
        id: 'balance',
        type: 'balance',
        label: 'TOTAL BALANCE',
        amountColor: '#C8A96B',
        gradientColors: ['#1C1A14', '#12100C', '#0A0906'],
    },
    {
        id: 'expense',
        type: 'expense',
        label: 'TOTAL EXPENSES',
        amountColor: '#A34846',
        gradientColors: ['#2A1A1A', '#1E1010', '#140A0A'],
    },
];
// COMPONENT

const BalanceCards = forwardRef<BalanceCardsRef, BalanceCardsProps>(
    (
        {
            userName,
            totalBalance,
            totalIncome,
            totalExpenses,
        },
        ref) => {
        // Get the current theme from Zustand through useTheme().
        const colors = useTheme();
        const flatlistRef = useRef<FlatList>(null);
        // Start on the Balance card in the middle.
        const [activeIndex, setActiveIndex] = useState(1);

        // SCROLLING
        const scrollToCard = (index: number) => {
            flatlistRef.current?.scrollToIndex({
                index,
                animated: true,
            });
        };

        // Expose these methods to HomeScreen.
        useImperativeHandle(ref, () => ({
            scrollToIncome: () => scrollToCard(0),
            scrollToBalance: () => scrollToCard(1),
            scrollToExpense: () => scrollToCard(2),
        }));
        // TRACK ACTIVE CARD
        const onViewableItemsChanged = useRef(
            ({
                viewableItems,
            }: {
                viewableItems: ViewToken[];
            }) => {
                if (viewableItems.length > 0) {
                    setActiveIndex(
                        viewableItems[0].index ?? 1
                    );
                }
            }
        ).current;

        const viewabilityConfig = useRef({
            viewAreaCoveragePercentThreshold: 60,
        }).current;
        // GET AMOUNT
        const getAmount = (type: string): number => {
            if (type === 'income') return totalIncome;
            if (type === 'expense') return totalExpenses;
            return totalBalance;
        };

        // FORMAT MONEY
        const formatMoney = (amount: number) =>
            `ETB ${Math.abs(amount).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`;

        // RENDER CARD
        const renderCard = ({
            item,
        }: {
            item: CardData;
        }) => (
            <LinearGradient
                colors={item.gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.card, { borderColor: colors.cardBorder, }]}
            >
                <View style={styles.cardOverlay} />
                {/*TOP ROW*/}
                <View style={styles.cardTopRow}>
                    <Text style={[styles.cardLogoItalic, { color: '#FFF' },]}>
                        MoniVo
                    </Text>
                    <Nfc size={20} color={colors.champagne} style={styles.nfcIcon} />
                </View>
                {/* CHIP*/}
                <View style={[styles.chip, { backgroundColor: colors.champagne, },]}>
                    <View style={styles.chipLines}>
                        <View style={styles.chipLine} />
                        <View style={styles.chipLine} />
                        <View style={styles.chipLine} />
                    </View>
                </View>
                {/*LABEL + AMOUNT*/}
                <Text style={[styles.cardLabel, { color: item.amountColor, },]}>
                    {item.label}
                </Text>
                <Text style={[styles.cardAmount, { color: item.amountColor, },]}>
                    {formatMoney(getAmount(item.type))}
                </Text>
                {/* CARD NUMBER DOTS*/}
                <View style={styles.cardDots}>
                    {[0, 1, 2, 3].map((_, i) => (
                        <View key={i} style={[styles.fakeDot, { backgroundColor: colors.textSecondary, },]} />
                    ))}
                    <View style={{ width: 12 }} />
                    {[0, 1, 2, 3].map((_, i) => (
                        <View key={`b${i}`} style={[styles.fakeDot, { backgroundColor: colors.textSecondary, },]} />
                    ))}
                    <View style={{ width: 12 }} />
                    {[0, 1, 2, 3].map((_, i) => (
                        <View key={`c${i}`} style={[styles.fakeDot, { backgroundColor: colors.textSecondary, },]} />
                    ))}
                    <View style={{ width: 12 }} />
                    {[0, 1, 2, 3].map((_, i) => (
                        <View key={`d${i}`} style={[styles.fakeDot, { backgroundColor: colors.textSecondary, },]} />
                    ))}
                </View>
                {/* BOTTOM ROW */}
                <View style={styles.cardBottomRow}>
                    <Text style={[styles.cardHolder, { color: '#FFF', },]}>
                        {userName}
                    </Text>
                    <Text style={[styles.cardBrand, { color: colors.champagne, },]}>
                        MONIVO
                    </Text>
                </View>
            </LinearGradient>
        );
        // RETURN
        return (
            <View>
                <FlatList
                    ref={flatlistRef}
                    data={cardConfigs}
                    renderItem={renderCard}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    onViewableItemsChanged={
                        onViewableItemsChanged
                    }
                    viewabilityConfig={viewabilityConfig}
                    initialScrollIndex={1}
                    getItemLayout={(_, index) => ({
                        length: SNAP_INTERVAL,
                        offset: index * SNAP_INTERVAL,
                        index,
                    })}
                    snapToInterval={SNAP_INTERVAL}
                    decelerationRate="fast"
                    contentContainerStyle={{
                        paddingHorizontal: 0,
                    }}
                />

                {/* CARD INDICATORS*/}
                <View style={styles.dotsRow}>
                    {cardConfigs.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dots,
                                i === activeIndex
                                    ? [
                                        styles.dotActive,
                                        { backgroundColor: colors.champagne, },
                                    ]
                                    : [
                                        styles.dotInactive,
                                        { backgroundColor: colors.textMuted + '30', },
                                    ],
                            ]}
                        />
                    ))}

                </View>
            </View>
        );
    }
);

export default BalanceCards;
// STYLES

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        aspectRatio: 2,
        borderRadius: 18,
        marginRight: CARD_GAP,
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: 'space-between',
        borderWidth: 1,
        // Subtle shadow
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    cardBackground: {
        borderRadius: 18,
    },
    cardOverlay: {

    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardLogoItalic: {
        fontStyle: 'italic',
        fontFamily: Platform.OS === 'ios'
            ? 'Snell Roundhand'
            : 'cursive',

        fontSize: 28,
        fontWeight: '500',
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
        marginTop: 8,
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
        fontWeight: '600',
        letterSpacing: 1,
    },
    dotsRow: {
        flexDirection: 'row',
        gap: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 8,
    },
    dots: {
        height: 6,
        borderRadius: 3,
    },
    dotActive: {
        width: 25,
    },
    dotInactive: {
        width: 6,
    },
    nfcIcon: {
        position: 'absolute',
        right: 0,
    },
});
