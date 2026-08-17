
// PLACEHOLDER — we'll build the real home screen next.
// For now, this proves navigation and authentication are working.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LockKeyhole } from 'lucide-react-native';

import { Colors } from '../../constants/colors';
import useMoniVoStore from '../../store/useMoniVoStore';

export default function HomeScreen() {
    // Pull the logout action from our Zustand store
    const logOut = useMoniVoStore((state) => state.logOut);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Main content */}
            <Text style={styles.title}>🎉 Navigation Works!</Text>

            <Text style={styles.subtitle}>
                You're now logged in to MoniVo
            </Text>

            <Text style={styles.note}>
                This is a placeholder — the real Home screen is coming next.
            </Text>

            {/* Logout button */}
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={logOut}
                activeOpacity={0.7}
            >
                <LockKeyhole
                    size={20}
                    color={Colors.danger}
                    strokeWidth={2}
                />

                <Text style={styles.logoutText}>
                    Log Out (Test)
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        gap: 16,
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.champagne,
        textAlign: 'center',
    },

    subtitle: {
        fontSize: 18,
        color: Colors.ivory,
        textAlign: 'center',
    },

    note: {
        fontSize: 14,
        color: Colors.muted,
        textAlign: 'center',
        marginTop: 8,
    },

    logoutButton: {
        marginTop: 32,
        backgroundColor: Colors.surface,
        borderRadius: 12,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: Colors.danger + '60',

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },

    logoutText: {
        color: Colors.danger,
        fontWeight: '600',
        fontSize: 15,
    },
});