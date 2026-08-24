import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/stores/themeStore';
import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { fetchAPI } from '@/api';
import { useAuthStore } from '@/stores/authStore';

export default function OtpScreen() {
  const Colors = useTheme();
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const login = useAuthStore(state => state.login);

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Auto focus the OTP input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }, []);

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetchAPI('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, otp }),
      });

      if (response.accessToken && response.user) {
        if (!response.user.name || response.user.name === '') {
          // New user, needs onboarding
          // Save tokens but navigate to onboarding
          await login(response.accessToken, response.user);
          router.replace('/(auth)/onboarding');
        } else {
          // Existing user, log in and go to tabs
          await login(response.accessToken, response.user);
          router.replace('/(tabs)/');
        }
      } else {
        setError('Verification failed, please try again.');
      }
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      setError(err.message || 'Invalid or expired OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await fetchAPI('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      });
      alert('OTP resent successfully. Check console.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../../assets/images/auth-bg.jpg')} 
        style={styles.backgroundImage}
        contentFit="cover"
      />
      
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <BlurView intensity={80} tint="dark" style={styles.glassCard}>
            <Text style={styles.title}>Verification</Text>
            <Text style={styles.subtitle}>Enter the 6-digit OTP sent to{'\n'}<Text style={{ fontWeight: 'bold' }}>+91 {phone}</Text></Text>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="0 0 0 0 0 0"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                textAlign="center"
              />
            </View>

            <TouchableOpacity 
              style={[styles.verifyButton, { backgroundColor: Colors.primary }, isLoading && styles.buttonDisabled]} 
              onPress={handleVerifyOtp}
              disabled={isLoading || otp.length < 6}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.verifyButtonText}>Verify & Continue</Text>
              )}
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code? </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={handleResend}>
                <Text style={styles.resendLink}>Resend OTP</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  keyboardView: { flex: 1 },
  content: { 
    flex: 1, 
    justifyContent: 'space-between', 
    padding: Spacing.xl,
    paddingTop: Spacing.xxxl * 1.5,
    paddingBottom: Spacing.xxxl
  },
  header: {
    alignItems: 'flex-start',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassCard: {
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: '#ffffff', marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.7)', marginBottom: Spacing.xl, lineHeight: 24 },
  
  errorContainer: { backgroundColor: 'rgba(255,59,48,0.2)', padding: Spacing.sm, borderRadius: Radius.sm, marginBottom: Spacing.lg },
  errorText: { color: '#ff4d4f', fontSize: FontSize.sm, fontWeight: FontWeight.medium, textAlign: 'center' },

  inputContainer: { 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.2)', 
    borderRadius: Radius.md, 
    height: 70,
    marginBottom: Spacing.xl,
    justifyContent: 'center'
  },
  input: { 
    color: '#ffffff', 
    fontSize: 32, 
    fontWeight: '700',
    letterSpacing: 10,
  },
  
  verifyButton: { 
    height: 56, 
    borderRadius: Radius.md, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: Spacing.lg
  },
  buttonDisabled: { opacity: 0.7 },
  verifyButtonText: { color: '#ffffff', fontSize: FontSize.lg, fontWeight: FontWeight.bold },

  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm
  },
  resendText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FontSize.md,
  },
  resendLink: {
    color: '#ffffff',
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  }
});
