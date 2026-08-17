// THis is the traffic controller of the entire app.
// It decides which stack of scresn to show base on wehre the user
// i slogged in or not
import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// in this line create stack is used to create
// stack of screens for auth process
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, ArrowLeftRight, PiggyBank, BarChart3 } from 'lucide-react-native'

import { Colors } from '../constants/colors';
import useMoniVoStore from '../store/useMoniVoStore';

import OnboardingScreen from './(auth)/OnboardinScree';
import LoginScreen from './(auth)/LoginScreen';
import RegisterScreen from './(auth)/RegisterScreen';
import HomeScreen from './(app)/HomeScreen';

// Typescript : define what screens exist in each navaigator
// this tells ts the valid screen names so you get autocomplete later

export type AuthStackParamList = {
    Onboarding: undefined, // this screen takes no params
    Login: undefined,
    Register: undefined,
}

export type AppStackParamList = {
    Home: undefined,
    Transactions: undefined,
    Budgets: undefined,
    Analytics: undefined,
}
// createstackNavigator() creates a "stack" navigator - screesn pile on top of eachoter
// like a stack of cards. Going back to pops the top card off
// This is what we use for auth flow (Login/Register)
const AuthStack = createStackNavigator<AuthStackParamList>();
// createbottomTabNavigator() create a tab bar navigator - screens sit side by side at bottom
// This is what we use for main app navigation
const AppTabs = createBottomTabNavigator<AppStackParamList>();

function AuthNavigator() {
    return (
        <AuthStack.Navigator screenOptions={{
            headerShown: false, // we design our own header - hide the default 
            cardStyle: { backgroundColor: Colors.background }, // cardstyle sets the backrournd color during transtions
        }} >
            {/* The first screen listed here is the one shown first (Onboardring) */}
            <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
    );
}

// Apps Tabs - shown when user Is logged in 
function AppTabNavigator() {
    return (
        <AppTabs.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colors.surface,
                    borderTopColor: Colors.subtleGold + '20',
                    borderTopWidth: 1,
                    height: 65, // extra space for big fingers
                    paddingBottom: 8,
                },
                tabBarActiveTintColor: Colors.champagne, // Gold for selected tab
                tabBarInactiveTineColor: Colors.muted, // Gray for unserlected
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeigh: 500,
                },
                // tabBar icon render the icon for each tab
                tabBarIcon: ({ color, size }) => {
                    // route.name is teh name we gave the screen ("Home", "transactions"....)
                    if (route.name == 'Home') return <Home size={22} color={color} />
                    if (route.name == 'Transactions') return <ArrowLeftRight size={22} color={color} />
                    if (route.name == 'Budgets') return <PiggyBank size={22} color={color} />
                    if (route.name == 'Analytics') return <BarChart3 size={22} color={color} />
                },
            })}
        >
            {/* they are all home screen temporarly */}
            <AppTabs.Screen name="Home" component={HomeScreen} />
            <AppTabs.Screen name="Transactions" component={HomeScreen}
                options={{ tabBarLabel: 'Transactions' }} />
            <AppTabs.Screen name="Budgets" component={HomeScreen}
                options={{ tabBarLabel: 'Budgets' }} />
            <AppTabs.Screen name="Analytics" component={HomeScreen}
                options={{ tabBarLabel: 'Analytics' }} />
        </ AppTabs.Navigator>
    );
}
// Rott navitatot - main export , descide auth vs app

export default function AppNavigator() {
    // read teh user from zustand - if null = not logged in
    const user = useMoniVoStore((state) => state.user);
    // this subscrioptn means wheneve user chage in the store change
    // thsi compornet re-renders and shows the correct navigator

    // decide which navigator to render
    return (
        // Naviagtino contarin is the outremost wrapper - the "building"
        // All navigator must live instd the navigaoin container
        <NavigationContainer>
            {user ? <AppTabNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}