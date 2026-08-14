// the first screen users see when tehy open Monivo for the first time.
// 3 sliding horizontal swiper that introduces the app.

import React, { useRef, useState } from 'react';

import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ViewToken, // Ts type for the visible item tracking
} from 'react-native';
import {
    WalletCards,
    ChartNoAxesCombined,
    Target,
} from 'lucide-react-native';

import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../constants/colors';


// SLIDE DATA
//  each slide is just a plain object with an id, title,subtitle and emoji
// This lives outise the component becaus it never chages it's constatnt


const slides = [
    {
        id: 1,
        icon: WalletCards,
        title: 'Your Money.\n Clearly.',
        subtitle: 'MoniVO helps you see exaclty where your money goes, every single day.',
    },
    {
        id: 2,
        icon: ChartNoAxesCombined,
        title: 'Track Every\n Birr.',
        subtitle: 'Add expenses and income , Just you and your money.'
    },
    {
        id: 3,
        icon: Target,
        title: 'Build Better\nHabits.',
        subtitle:
            'Set budgets, spot patterns, and take control of your financial life.',
    },
];
// Dimensions.get ('window).widht gives us th exact screen widht o fhte
// we need this to make eadh slide fil the full widh.
// This works on every phone size automatically 
const { width: SCREEN_WIDTH } = Dimensions.get('window');
// the component

export default function OnboardingScreen() {
    // useStat tracks whid slide indes is currentls visible
    // also we use this to highl eth ecorrect do t indicator at the bottom.
    const [activeIndex, setActiveIndex] = useState(0);
    // useRef give us direft refrecn to the FLastList so we can call
    // .scrollToIndex() on it programmaticllu (when user taps "Next")
    // we start with 'null' until the component mounts and the FlatList is rendered.
    const flatListRef = useRef<FlatList>(null);
    // --next button hadler
    const handleNext = () => {
        if (activeIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: activeIndex + 1,
                animated: true,
            });
        } else {
            // on the lasst slide -"Get Started" was pressed
            // TODO: we'll replace this alret with bavigation to loginScreen
            console.log('Navigate to Login!');
        }
    };
    // Viewablitly tracking
    // this callback fires everytime the visible slides chage (user swipes)
    // it updates the activeIndex ->
    const onViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems.length > 0) {
                setActiveIndex(viewableItems[0].index ?? 0);
            }
        }
    ).current;

    // this config tells flatlist: "an item is viewable" 
    // when 50% of it is visible
    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
    // Render a single slide
    // Flatscreen calls this once for each item in our slides array
    // {item } is the current slie object
    const renderSlide = ({ item }: { item: typeof slides[0] }) => (
        <View style={styles.slide}>
            <item.icon size={80}
                color={Colors.champagne}
                strokeWidth={1.8} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
    )
    // the ui (what gets render on screen)
    return (
        <View style={styles.container}>
            {/* Makes the phoen status bar (time, battery)  white instead of black*/}
            <StatusBar style="light" />
            {/* the swiper */}
            <FlatList
                ref={flatListRef} // remote control refrence
                data={slides} // the array fo 3 slides
                renderItem={renderSlide} // function that render each slide
                keyExtractor={(item) => item.id.toString()} // unique key for item(required by react)
                horizontal // maks it scroll left-right
                pagingEnabled // snaps to each full slide widht
                showsHorizontalScrollIndicator={false} // hide scroll bar
                onViewableItemsChanged={onViewableItemsChanged} // tracks whih slides is visible
                viewabilityConfig={viewabilityConfig} // config for viewability
            />
            {/* bottom section dots+ section */}
            <View style={styles.bottomSection}>
                {/* dot incicators */}
                <View style={styles.dotContainer}>
                    {slides.map((_, index) => (
                        // _ means we dont need actual data just index number
                        // each dot is small circle active as wide champge colored
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                // active dot get extra styles applide on top of the base dot style
                                index === activeIndex ? styles.dotActive : styles.dotInactive,
                            ]}
                        />
                    ))}
                </View>
                {/* Next/ get started button*/}
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleNext}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>
                        {/* show doffrent tect on the last slide */}
                        {activeIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                    </Text>
                </TouchableOpacity>
                {/* skip link - onlu show on slides 1 and 2, not  the last */}
                {activeIndex < slides.length - 1 && (
                    <TouchableOpacity onPress={() => setActiveIndex(slides.length - 1)}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
// styles
// Stylesheet.create() is react natives's styling system.
//  its like css but written as js object.
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    slide: {
        width: SCREEN_WIDTH,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    icon: {
        fontSize: 80,
        marginBottom: 24,
    },
    title: {
        fontSize: 38,
        fontWeight: 'bold',
        color: Colors.ivory,
        textAlign: 'center',
        lineHeight: 45,
        marginBottom: 18,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.muted,
        textAlign: 'center',
        lineHeight: 25,
    },
    bottomSection: {
        alignItems: 'center',
        paddingBottom: 45,
        gap: 18,
    },
    dotContainer: {
        flexDirection: 'row', // arragne dots horizontally side bu site
        gap: 8,
        alignItems: 'center',
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    dotActive: {
        width: 24,
        backgroundColor: Colors.champagne,
    },
    dotInactive: {
        width: 8,
        backgroundColor: Colors.muted
    },
    button: {
        backgroundColor: Colors.champagne,
        paddingHorizontal: 55,
        paddingVertical: 16,
        borderRadius: 14,
        width: SCREEN_WIDTH - 80, // centered button with 40px padding on each side
        alignItems: 'center',

    },
    buttonText: {
        color: Colors.background,
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,

    },
    skipText: {
        fontSize: 14,
        color: Colors.muted,
    }
});