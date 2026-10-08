// frontend/app/navigation/AppNavigator.tsx
// Traffic controller: Decides between Auth Stack (PIN / Biometrics) and Main App Tabs

import React, { useEffect } from "react";
import { View, ActivityIndicator, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, ArrowLeftRight, PiggyBank, BarChart } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useTheme from "../../hooks/useTheme";
import useBanKoniStore from "../../store/useBanKoniStore";

// Screens
import OnboardingScreen from "../(auth)/OnboardinScree";
import LoginScreen from "../(auth)/LoginScreen";
import RegisterScreen from "../(auth)/RegisterScreen";
import HomeScreen from "../(app)/HomeScreen";
import TransactionScreen from "../(app)/TransactionScreen";
import BudgetsScreen from "../(app)/BudgetsScreen";
import AnalyticsScreen from "../(app)/AnalyticsScreen";

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
};

export type AppTabParamList = {
  Home: undefined;
  Transactions: undefined;
  Budgets: undefined;
  Analytics: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();
const AppTabs = createBottomTabNavigator<AppTabParamList>();

function AuthNavigator() {
  const colors = useTheme();
  const registeredUser = useBanKoniStore((state) => state.registeredUser);

  return (
    <AuthStack.Navigator
      id="AuthStack"
      initialRouteName={registeredUser ? "Login" : "Onboarding"}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function AppTabNavigator() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <AppTabs.Navigator
      id="AppTabs"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height:
            Platform.OS === "ios"
              ? insets.bottom > 0
                ? 50 + insets.bottom
                : 60
              : 60 + insets.bottom,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: colors.champagne,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
        tabBarIcon: ({ color }) => {
          if (route.name === "Home") return <Home size={22} color={color} />;
          if (route.name === "Transactions") return <ArrowLeftRight size={22} color={color} />;
          if (route.name === "Budgets") return <PiggyBank size={22} color={color} />;
          if (route.name === "Analytics") return <BarChart size={22} color={color} />;
          return null;
        },
      })}
    >
      <AppTabs.Screen name="Home" component={HomeScreen} />
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

export default function AppNavigator() {
  const user = useBanKoniStore((state) => state.user);
  const isLoadingAuth = useBanKoniStore((state) => state.isLoadingAuth);
  const checkAuth = useBanKoniStore((state) => state.checkAuth);
  const colors = useTheme();

  useEffect(() => {
    checkAuth();
  }, []);

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
    <NavigationContainer>
      {user ? <AppTabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
