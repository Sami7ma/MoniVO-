// frontend/app/(auth)/RegisterScreen.tsx
// Bank account creation:  Name + Pin

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, Switch, } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Fingerprint, Lock, Eye, EyeOff, User as UserIcon, AtSign, Mail, Nfc, } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import useTheme from '../../hooks/useTheme';
import PrimaryButton from '../../components/common/buttons/PrimaryButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AppNavigator';
import useBanKoniStore from '../../store/useBanKoniStore';

type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'Register'>;
};

export default function RegisterScreen({ navigation }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [enableBiometrics, setEnableBiometrics] = useState(true);
  const [loading, setLoading] = useState(false);

  const registerWithPin = useBanKoniStore((state) => state.registerWithPin);
  const isBiometricSupported = useBanKoniStore((state) => state.isBiometricSupported);

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert(
        'Required Field',
        'Please enter your Name'
      );
      return;
    }

    if (!/^\d{4,}$/.test(pin)) {
      Alert.alert('Security PIN Error',
        'PIN must be at least 4 numeric digits (0-9)'
      );
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert(
        'PIN Mismatch',
        'The PIN confirmation does not match.'
      );
      return;
    }

    setLoading(true);
    try {
      await registerWithPin(
        name.trim(),
        pin.trim(),
        enableBiometrics && isBiometricSupported
      );
      // AppNavigator automatically detects user !== null and transitions to main app
    } catch (error: any) {
      Alert.alert('Registration Failed', error?.message || 'Could not initialize local database.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style={colors.statusBar} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.logo}>BanKoni</Text>
          <Text style={styles.tagline}>Create Your Local Vault</Text>
        </View>

        {/* REGISTRATION FORM */}
        <View style={styles.card}>
          {/* FULL NAME */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <View style={styles.inputRow}>
              <UserIcon size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Tony Stark"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Security PIN</Text>
            <View style={styles.inputRow}>
              <Lock size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={pin}
                onChangeText={(text) => {
                  const clean = text.replace(/[^0-9]/g, '').slice(0, 12);
                  setPin(clean);
                }}
                placeholder="•••••"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
                secureTextEntry={!showPin}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPin(!showPin)}>
                {showPin ? (
                  <EyeOff size={18} color={colors.textSecondary} />
                ) : (
                  <Eye size={18} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* CONFIRM PIN */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Security PIN</Text>
            <View style={styles.inputRow}>
              <Lock size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={confirmPin}
                onChangeText={(text) => {
                  const clean = text.replace(/[^0-9]/g, '').slice(0, 12);
                  setConfirmPin(clean);
                }}
                placeholder="••••"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
                secureTextEntry={!showPin}
              />

            </View>
          </View>

          {/* BIOMETRICS SWITCH */}
          {isBiometricSupported && (
            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Fingerprint size={22} color={colors.champagne} />
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.switchTitle}>Biometric Unlock</Text>
                  <Text style={styles.switchSubtitle}>Fingerprint or Face ID</Text>
                </View>
              </View>
              <Switch
                value={enableBiometrics}
                onValueChange={setEnableBiometrics}
                trackColor={{ false: colors.border, true: colors.champagne }}
                thumbColor="#FFFFFF"
              />
            </View>
          )}

          {/* SUBMIT BUTTON */}
          <PrimaryButton
            label={loading ? 'Creating Vault...' : 'Create BanKoni Vault'}
            onPress={handleRegister}
            style={{ marginTop: 12 }}
            disabled={loading}
          />
        </View>

        {/* LOGIN LINK */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have a vault? </Text>
          <TouchableOpacity onPress={handleGoToLogin}>
            <Text style={styles.loginLink}>Unlock with PIN</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 48,
      paddingBottom: 36,
    },
    header: {
      marginBottom: 20,
      alignItems: 'center',
    },
    logo: {
      fontSize: 36,
      fontWeight: 'bold',
      color: colors.champagne,
      letterSpacing: 2,
      fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'cursive',
    },
    tagline: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.textPrimary,
      marginTop: 4,
    },
    subtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 4,
    },

    card: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    inputGroup: {
      marginBottom: 4,
    },
    labelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    label: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 6,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    optionalBadge: {
      fontSize: 11,
      color: colors.textMuted,
      fontStyle: 'italic',
      marginBottom: 6,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceAlt,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
    },
    inputIcon: {
      marginRight: 8,
    },
    textInput: {
      flex: 1,
      color: colors.textPrimary,
      paddingVertical: 12,
      fontSize: 15,
    },
    eyeBtn: {
      padding: 8,
    },
    switchRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      marginTop: 4,
    },
    switchInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    switchTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    switchSubtitle: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    loginRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 24,
    },
    loginText: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    loginLink: {
      color: colors.champagne,
      fontSize: 14,
      fontWeight: '700',
    },
  });
