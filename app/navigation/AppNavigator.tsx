// app/navigation/AppNavigator.tsx
// This is the TRAFFIC CONTROLLER of the entire app.
// It decides which stack of screens to show based on whether the user is logged in.

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, ArrowLeftRight, PiggyBank, BarChart } from 'lucide-react-native';

import useTheme from '../../hooks/useTheme';
import useMoniVoStore from '../../store/useMoniVoStore';

// Import all screens
import OnboardingScreen from '../(auth)/OnboardinScree'; // ← keep your typo filename
import LoginScreen from '../(auth)/LoginScreen';
import RegisterScreen from '../(auth)/RegisterScreen';
import HomeScreen from '../(app)/HomeScreen';

// ─────────────────────────────────────────────────────────────────────────────
// TYPESCRIPT: Define what screens exist in each navigator
// This tells TypeScript the valid screen names so you get autocomplete later
// ─────────────────────────────────────────────────────────────────────────────
export type AuthStackParamList = {
    Onboarding: undefined;  // undefined = this screen takes no params
    Login: undefined;
    Register: undefined;
};

export type AppTabParamList = {
    Home: undefined;
    Transactions: undefined;
    Budgets: undefined;
    Analytics: undefined;
};

// createStackNavigator() creates a "stack" navigator — screens pile on top of each other
// like a stack of cards. Going back pops the top card off.
const AuthStack = createStackNavigator<AuthStackParamList>();

// createBottomTabNavigator() creates the bottom tab bar you see in most apps
const AppTabs = createBottomTabNavigator<AppTabParamList>();

// ─────────────────────────────────────────────────────────────────────────────
// AUTH STACK — shown when user is NOT logged in
// ─────────────────────────────────────────────────────────────────────────────
function AuthNavigator() {
    const colors = useTheme();

    return (
        <AuthStack.Navigator
            screenOptions={{
                headerShown: false,  // We design our own headers — hide the default one
                cardStyle: { backgroundColor: colors.background },
                // cardStyle sets the background color during transitions
            }}
        >
            {/* The first screen listed here is the one shown first (Onboarding) */}
            <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP TABS — shown when user IS logged in
// ─────────────────────────────────────────────────────────────────────────────
function AppTabNavigator() {
    const colors = useTheme();

    return (
        <AppTabs.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    height: 61,
                    paddingBottom: 8,
                },
                tabBarActiveTintColor: colors.champagne,    // Gold for selected tab
                tabBarInactiveTintColor: colors.textSecondary,      // Gray for unselected tabs
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '500',
                },
                // tabBarIcon renders the icon for each tab
                tabBarIcon: ({ color, size }) => {
                    // route.name is the name we gave the screen ("Home", "Transactions", etc.)
                    if (route.name === 'Home') return <Home size={22} color={color} />;
                    if (route.name === 'Transactions') return <ArrowLeftRight size={22} color={color} />;
                    if (route.name === 'Budgets') return <PiggyBank size={22} color={color} />;
                    if (route.name === 'Analytics') return <BarChart size={22} color={color} />;
                },
            })}
        >
            <AppTabs.Screen name="Home" component={HomeScreen} />
            {/* Placeholder components for tabs we haven't built yet */}
            <AppTabs.Screen
                name="Transactions"
                component={HomeScreen}  // ← temporary placeholder
                options={{ tabBarLabel: 'Transactions' }}
            />
            <AppTabs.Screen
                name="Budgets"
                component={HomeScreen}  // ← temporary placeholder
                options={{ tabBarLabel: 'Budgets' }}
            />
            <AppTabs.Screen
                name="Analytics"
                component={HomeScreen}  // ← temporary placeholder
                options={{ tabBarLabel: 'Analytics' }}
            />
        </AppTabs.Navigator>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT NAVIGATOR — The main export, decides Auth vs App
// ─────────────────────────────────────────────────────────────────────────────
export default function AppNavigator() {
    // Read the user from Zustand — if null = not logged in
    const user = useMoniVoStore((state) => state.user);
    // ↑ This subscription means: whenever user changes in the store,
    //   this component re-renders and shows the correct navigator

    return (
        // NavigationContainer is the outermost wrapper — the "building"
        // ALL navigators must live inside NavigationContainer
        <NavigationContainer>
            {user ? (
                // If user exists → show the main app tabs
                <AppTabNavigator />
            ) : (
                // If user is null → show the auth flow
                <AuthNavigator />
            )}
        </NavigationContainer>
    );
}
