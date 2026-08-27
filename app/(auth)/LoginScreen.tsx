// the login form screen. User enter emai l+ passwords to access their account

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,  // Moves the screen up when keyboard appears
    Platform,             // Lets us write different behavior for iOS vs Android
    ScrollView,           // Allows scrolling if the keyboard pushes content off screen
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Eye, EyeOff } from 'lucide-react-native';
import useTheme from '../../hooks/useTheme';
import useMoniVoStore from '../../store/useMoniVoStore';
import PrimaryButton from '../../components/common/PrimaryButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AppNavigator';

type Props = {
    navigation: StackNavigationProp<AuthStackParamList, 'Login'>;
};
export default function LoginScreen({ navigation }: Props) {
    const colors = useTheme();
    const styles = createStyles(colors);

    // state
    // usestate() creates a value and functio to update it
    // format : const[value, setValue] = useState(initialValue)
    // every time setValue is called  the component rerender with the new value

    const [email, setEmail] = useState('');
    const [passwords, setPasswords] = useState('');
    const [showPassword, setShowPassword] = useState(false);// for show/ hide password
    const setUser = useMoniVoStore((state) => state.setUser);

    // Handlers
    const handleLogin = () => {
        // basic validation - check fields aren't empty before procceding
        if (!email || !passwords) {
            alert('Please fill in all fields');
            return;
        }
        // TODO Replace this with real API call in week 6
        // for now , well just log an dpretedn the login wroked ;)

        setUser({
            id: 'user-1',
            name: 'Samuel',
            email: email,
            createdAt: new Date().toISOString(),
        });
        // TODO: replace with navigaion to Homescreen one navigator is set up
        // navigation.replace('HOME');
    };

    const handleGoToRegister = () => {
        navigation.navigate('Register');  // Now this actually works!
    };
    // UI

    return (
        // keyboardAvoidngView  is a wrapper that shifts the whole screen up
        // when the keyboard appears - preventing content from being hidden
        // behavior: platform specific adjust 
        // behavior='pladding' works best on ios, 'height' works better on Android.

        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            {/* StatusBar  */}
            <StatusBar style={colors.statusBar} />

            {/* ScrollView allows us to scroll if the keyboard pushes content up */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            // "handled" means tapping outside the keyboad dismmes it
            // without accidentally triggering other button
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.logo}>
                        Moni<Text style={styles.logoItalic}>Vo</Text>
                    </Text>
                    <Text style={styles.tagline}>Welcome back</Text>
                    <Text style={styles.subtitle}>Sign in to your account</Text>
                </View>
                {/* Form Card */}
                <View style={styles.card}>
                    {/* Email input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email} // controlled: input shows what in state
                            onChangeText={setEmail}//called every keystrodk - updates state
                            placeholder="you@example.com" // shows email keyboard onphone
                            placeholderTextColor={colors.textSecondary}//makes placeholer text gray
                            keyboardType="email-address" // shows emaul keyboard on phone
                            autoCapitalize="none" // prevents auto-capitalizing first letter
                            autoCorrect={false}// turns off predictive text
                        />
                    </View>
                    {/* Password Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Passwords</Text>

                        {/* We wrap input + eye icon in a row View */}
                        <View style={styles.passwordRow}>
                            <TextInput
                                style={styles.passwordInput}
                                value={passwords}
                                onChangeText={setPasswords}
                                placeholder="****************"
                                placeholderTextColor={colors.textSecondary}
                                secureTextEntry={!showPassword} // shows dots if true, text if false
                                // we flip it with our toggle handler
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            {/* Eye icon -toggle password vissibility  */}
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowPassword(!showPassword)}
                            // Tou
                            >
                                {showPassword
                                    ? <EyeOff size={20} color={colors.textSecondary} />
                                    : <Eye size={20} color={colors.textSecondary} />}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Forgot password link */}
                    <TouchableOpacity style={styles.forgotContainer}>
                        <Text style={styles.forgotText}>Forgot password?</Text>
                    </TouchableOpacity>
                    {/* Login Button — uses reusable PrimaryButton */}
                    <PrimaryButton
                        label="Sign In"
                        onPress={handleLogin}
                        style={{ marginTop: 8 }}
                    />
                </View>
                {/* Register Link */}
                <View style={styles.registerRow}>
                    <Text style={styles.registerText}>
                        Don't have an account?{" "}
                        <TouchableOpacity onPress={handleGoToRegister}>
                            <Text style={styles.registerLink}>Create One</Text>
                        </TouchableOpacity>
                    </Text>
                </View>
            </ScrollView>

        </KeyboardAvoidingView >
    );

}
// styles

const createStyles = (colors: ReturnType<typeof useTheme>) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1, // flexgro lets scrollviews content epan to fill space
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
        textTransform: 'uppercase'
    },
    input: {
        backgroundColor: colors.surfaceAlt,
        color: colors.textPrimary,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        borderWidth: 1,
        borderColor: colors.border, //subtle border
    },
    passwordRow: {
        flexDirection: 'row',// input and eye icon sit side by side
        alignItems: 'center',//vertically centers the items 
        backgroundColor: colors.surfaceAlt,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    passwordInput: {
        flex: 1, // allows input to take all available space
        color: colors.textPrimary,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
    },
    eyeButton: {
        padding: 14,
    },
    forgotContainer: {
        alignItems: 'flex-end',
        marginBottom: 8,
        marginTop: 4,
    },
    forgotText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    // loginButton and loginButtonText REMOVED
    // → now handled by PrimaryButton component
    registerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 28,
    },
    registerText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    registerLink: {
        color: colors.champagne,
        fontSize: 14,
        fontWeight: '600',
    },
});