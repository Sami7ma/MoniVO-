// frontend/app/(auth)/LoginScreen.tsx
// Vault unlock screen: Numeric PIN + optional biometric unlock

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Fingerprint, Lock, Eye, EyeOff } from 'lucide-react-native';
import useTheme from '../../hooks/useTheme';
import useBanKoniStore from '../../store/useBanKoniStore';
import PrimaryButton from '../../components/common/buttons/PrimaryButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
  const colors = useTheme();
  const styles = createStyles(colors);

  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);

  const registeredUser = useBanKoniStore(
    (state) => state.registeredUser
  );

  const isBiometricSupported = useBanKoniStore(
    (state) => state.isBiometricSupported
  );

  const loginWithPin = useBanKoniStore(
    (state) => state.loginWithPin
  );

  const loginWithBiometrics = useBanKoniStore(
    (state) => state.loginWithBiometrics
  );

  /*
   * Optional automatic biometric prompt.
   *
   * If the user has enabled biometrics for this vault
   * and the device supports it, the biometric prompt
   * appears automatically when the login screen opens.
   */
  useEffect(() => {
    if (
      registeredUser?.isBiometricEnabled &&
      isBiometricSupported
    ) {
      handleBiometricUnlock();
    }
  }, [registeredUser?.isBiometricEnabled, isBiometricSupported]);

  const handlePinLogin = async () => {
    if (!/^\d{4,12}$/.test(pin)) {
      Alert.alert(
        'Invalid PIN',
        'Please enter a PIN between 4 and 12 digits.'
      );
      return;
    }

    setLoading(true);

    try {
      const ok = await loginWithPin(pin);

      if (!ok) {
        Alert.alert(
          'Incorrect PIN',
          'The PIN entered is not correct. Please try again.'
        );

        setPin('');
      }
    } catch (error: any) {
      Alert.alert(
        'Unlock Error',
        error?.message || 'Authentication failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricUnlock = async () => {
    if (
      !registeredUser?.isBiometricEnabled ||
      !isBiometricSupported
    ) {
      return;
    }

    if (biometricLoading) {
      return;
    }

    setBiometricLoading(true);

    try {
      const success = await loginWithBiometrics();

      if (!success) {
        Alert.alert(
          'Biometric Authentication Failed',
          'Biometric authentication was not successful. Please use your PIN instead.'
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Biometric Error',
        error?.message ||
        'Biometric authentication could not be completed.'
      );
    } finally {
      setBiometricLoading(false);
    }
  };

  const handleGoToRegister = () => {
    navigation.navigate('Register');
  };

  // Real name stays a real name.
  const displayName = registeredUser?.name || 'Your Vault';

  const biometricsEnabled =
    registeredUser?.isBiometricEnabled &&
    isBiometricSupported;

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

          <Text style={styles.tagline}>
            Welcome Back
          </Text>

          <Text style={styles.userBadge}>
            {displayName}
          </Text>

          <Text style={styles.subtitle}>
            Enter your PIN to access your vault
          </Text>
        </View>

        {/* PIN INPUT */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Security PIN
          </Text>

          <View style={styles.inputRow}>
            <Lock
              size={18}
              color={colors.textSecondary}
              style={styles.lockIcon}
            />

            <TextInput
              style={styles.textInput}
              value={pin}
              onChangeText={(text) => {
                const clean = text
                  .replace(/[^0-9]/g, '')
                  .slice(0, 12);

                setPin(clean);
              }}
              placeholder="Enter your PIN"
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
              secureTextEntry={!showPin}
              autoFocus
              maxLength={12}
              editable={!loading && !biometricLoading}
            />

            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPin((prev) => !prev)}
              disabled={loading || biometricLoading}
              activeOpacity={0.7}
            >
              {showPin ? (
                <EyeOff
                  size={18}
                  color={colors.textSecondary}
                />
              ) : (
                <Eye
                  size={18}
                  color={colors.textSecondary}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* PIN UNLOCK */}
        <PrimaryButton
          label={loading ? 'Verifying...' : 'Unlock Vault'}
          onPress={handlePinLogin}
          disabled={
            loading ||
            biometricLoading ||
            pin.length < 4
          }
          style={styles.pinButton}
        />

        {/* BIOMETRIC UNLOCK */}
        {biometricsEnabled && (
          <>
            <TouchableOpacity
              style={[
                styles.bioButton,
                {
                  borderColor: colors.border,
                },
              ]}
              onPress={handleBiometricUnlock}
              disabled={loading || biometricLoading}
              activeOpacity={0.8}
            >
              <Fingerprint
                size={24}
                color={colors.champagne}
              />

              <Text style={styles.bioButtonText}>
                {biometricLoading
                  ? 'Authenticating...'
                  : 'Use Biometrics'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* REGISTER / CREATE NEW */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>
            {registeredUser
              ? 'Not your vault? '
              : "Don't have a vault yet? "}
          </Text>

          <TouchableOpacity
            onPress={handleGoToRegister}
            disabled={loading || biometricLoading}
          >
            <Text style={styles.registerLink}>
              {registeredUser
                ? 'Create New'
                : 'Create One'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (
  colors: ReturnType<typeof useTheme>
) =>
  StyleSheet.create({
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
      fontSize: 42,
      fontWeight: 'bold',
      color: colors.champagne,
      letterSpacing: 2,
      fontFamily:
        Platform.OS === 'ios'
          ? 'Snell Roundhand'
          : 'cursive',
    },

    tagline: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.textPrimary,
      marginTop: 6,
    },

    userBadge: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.champagne,
      marginTop: 4,
    },

    subtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 4,
      textAlign: 'center',
    },

    inputGroup: {
      marginBottom: 12,
    },

    label: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 8,
      fontWeight: '600',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },

    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceAlt,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 14,
    },

    lockIcon: {
      marginRight: 8,
    },

    textInput: {
      flex: 1,
      color: colors.textPrimary,
      paddingVertical: 14,
      fontSize: 16,
      letterSpacing: 3,
    },

    eyeBtn: {
      padding: 8,
    },

    pinButton: {
      marginTop: 8,
    },

    /*
     * One single biometric button.
     * The fingerprint icon and "Use Biometrics"
     * are part of the same touch target.
     */
    bioButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceAlt,
      borderRadius: 12,
      borderWidth: 1,
      paddingVertical: 14,
      marginTop: 12,
      gap: 10,
    },

    bioButtonText: {
      fontSize: 14,
      textAlign: 'center',
      fontWeight: '600',
      color: colors.textPrimary,
    },

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
      fontWeight: '700',
    },
  });