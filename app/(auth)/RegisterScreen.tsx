// THe signup form new users create theri MoniVo account
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Eye, EyeOff } from "lucide-react-native";
import useTheme from "../../hooks/useTheme";
import PrimaryButton from '../../components/common/PrimaryButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AppNavigator';

type Props = {
    navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

export default function RegisterScreen({ navigation }: Props) {
    const colors = useTheme();
    const styles = createStyles(colors);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Handlers
    const handleRegister = () => {
        // basic validation - check fields aren't empty before procceding
        if (!name || !email || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        if (password.length < 4) {
            alert('Password must be at least 4 characters');
            return;
        }
        if (!email.includes('@')) {
            alert('Please enter a valid email');
            return;
        }
        // if we get here, validation passed! 🎉
        console.log('Register pressed for', { name, email, password }); ``
    };
    const handleGoToLogin = () => {
        navigation.goBack();
    }
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar style={colors.statusBar} />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.logo}>
                        Moni<Text style={styles.logoItalic}>Vo</Text>
                    </Text>
                    <Text style={styles.tagline}>Create Account</Text>
                    <Text style={styles.subtitle}>Start tracking your money today</Text>
                </View>
                {/* FORM CARD */}
                <View style={styles.card}>
                    {/* FULL NAME */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Samuel Tesfaye"
                            placeholderTextColor={colors.textSecondary}
                            autoCapitalize="words"  // Capitalizes each word — good for names
                            autoCorrect={false}
                        />
                    </View>
                    {/* EMAIL */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="you@example.com"
                            placeholderTextColor={colors.textSecondary}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>
                    {/* PASSWORD */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.passwordRow}>
                            <TextInput
                                style={styles.passwordInput}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Min. 8 characters"
                                placeholderTextColor={colors.textSecondary}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                {showPassword
                                    ? <EyeOff size={20} color={colors.textSecondary} />
                                    : <Eye size={20} color={colors.textSecondary} />
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* CONFIRM PASSWORD */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <View style={styles.passwordRow}>
                            <TextInput
                                style={styles.passwordInput}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Repeat your password"
                                placeholderTextColor={colors.textSecondary}
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword
                                    ? <EyeOff size={20} color={colors.textSecondary} />
                                    : <Eye size={20} color={colors.textSecondary} />
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* REGISTER BUTTON — uses reusable PrimaryButton */}
                    <PrimaryButton
                        label="Create Account"
                        onPress={handleRegister}
                        style={{ marginTop: 8 }}
                    />
                </View>
                {/* LOGIN LINK */}
                <View style={styles.loginRow}>
                    <Text style={styles.loginText}>Already have an account? </Text>
                    <TouchableOpacity onPress={handleGoToLogin}>
                        <Text style={styles.loginLink}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
// ─────────────────────────────────────────────────────────────────────────────
const createStyles = (colors: ReturnType<typeof useTheme>) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 22,
        paddingVertical: 48,
    },
    header: {
        marginBottom: 32,
        alignItems: 'center',
    },
    logo: {
        fontSize: 40,
        fontWeight: 'bold',
        color: colors.champagne,
        letterSpacing: 2,
        marginBottom: 12,
        fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'cursive',
    },
    logoItalic: {
        fontStyle: 'italic',
        fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'cursive',

    },
    tagline: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 22,
        padding: 24,
        gap: 4,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        color: colors.textSecondary,
        marginBottom: 8,
        fontWeight: '500',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: colors.surfaceAlt,
        color: colors.textPrimary,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        borderWidth: 1,
        borderColor: colors.border,
    },
    passwordRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceAlt,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    passwordInput: {
        flex: 1,
        color: colors.textPrimary,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
    },
    eyeButton: {
        padding: 14,
    },
    // registerButton and registerButtonText REMOVED
    // → now handled by PrimaryButton component
    loginRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 28,
    },
    loginText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    loginLink: {
        color: colors.champagne,
        fontSize: 14,
        fontWeight: '600',
    },
});