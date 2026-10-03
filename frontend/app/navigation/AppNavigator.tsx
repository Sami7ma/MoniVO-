// app/navigation/AppNavigator.tsx
// This is the TRAFFIC CONTROLLER of the entire app.
// It decides which stack of screens to show based on whether the user is logged in.

import React from "react";
import { View, ActivityIndicator, Platform } from "react-native"; // new for activity
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, ArrowLeftRight, PiggyBank, BarChart } from "lucide-react-native";
import { SafeAreaProvider, useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context";
import useTheme from "../../hooks/useTheme";
import useMoniVoStore from "../../store/useMoniVoStore";

// Import all screens
import OnboardingScreen from "../(auth)/OnboardinScree"; // ← keep your typo filename
import LoginScreen from "../(auth)/LoginScreen";
import RegisterScreen from "../(auth)/RegisterScreen";
import HomeScreen from "../(app)/HomeScreen";
import TransactionScreen from "../(app)/TransactionScreen";
import BudgetsScreen from "../(app)/BudgetsScreen";
import AnalyticsScreen from "../(app)/AnalyticsScreen";

// TYPESCRIPT: Define what screens exist in each navigator
// This tells TypeScript the valid screen names so you get autocomplete later
export type AuthStackParamList = {
  Onboarding: undefined; // undefined = this screen takes no params
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

// AUTH STACK — shown when user is NOT logged in
function AuthNavigator() {
  const colors = useTheme();

  return (
    <AuthStack.Navigator
      id="AuthStack"
      screenOptions={{
        headerShown: false, // We design our own headers — hide the default one
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

// APP TABS — shown when user IS logged in
function AppTabNavigator() {
  const colors = useTheme();
  const insets = useSafeAreaInsets(); // gets bottom isntes in real time
  return (
    <AppTabs.Navigator
      id="AppTabs"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios'
            ? (insets.bottom > 0 ? 50 + insets.bottom : 60)
            : 60 + insets.bottom,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: colors.champagne, // Gold for selected tab
        tabBarInactiveTintColor: colors.textSecondary, // Gray for unselected tabs
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
        // tabBarIcon renders the icon for each tab
        tabBarIcon: ({ color, size }) => {
          // route.name is the name we gave the screen ("Home", "Transactions", etc.)
          if (route.name === "Home") return <Home size={22} color={color} />;
          if (route.name === "Transactions")
            return <ArrowLeftRight size={22} color={color} />;
          if (route.name === "Budgets")
            return <PiggyBank size={22} color={color} />;
          if (route.name === "Analytics")
            return <BarChart size={22} color={color} />;
          return null; // fallback — prevents undefined crash
        },
      })}
    >
      <AppTabs.Screen name="Home" component={HomeScreen} />
      {/* Placeholder components for tabs we haven't built yet */}
      <AppTabs.Screen
        name="Transactions"
        component={TransactionScreen}
        options={{ tabBarLabel: "Transactions" }}
      />
      <AppTabs.Screen
        name="Budgets"
        component={BudgetsScreen}
        options={{ tabBarLabel: "Budgets" }}
      />
      <AppTabs.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{ tabBarLabel: "Analytics" }}
      />
    </AppTabs.Navigator>
  );
}


// ROOT NAVIGATOR — The main export, decides Auth vs App
export default function AppNavigator() {
  // Read the user from Zustand — if null = not logged in
  const user = useMoniVoStore((state) => state.user);
  // Read loading state — true while checking for existing token
  const isLoadingAuth = useMoniVoStore((state) => state.isLoadingAuth);
  // Get the checkAuth function to verify token on app start
  const checkAuth = useMoniVoStore((state) => state.checkAuth);
  // Get theme colors for loading screen
  const colors = useTheme();

  // ↑ This subscription means: whenever user changes in the store,
  //   this component re-renders and shows the correct navigator

  // Check for existing token when app first loads
  // Check for existing token when app first loads, then fetch real data
  React.useEffect(() => {
    const init = async () => {
      await checkAuth();
      // After auth check, if user exists, fetch their data from backend
      const user = useMoniVoStore.getState().user;
      if (user) {
        await useMoniVoStore.getState().fetchTransactions();
        await useMoniVoStore.getState().fetchBudgets();
      }
    };
    init();
  }, []);


  // Show loading spinner while checking authentication
  if (isLoadingAuth) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.champagne} />
      </View>
    );
  }

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
