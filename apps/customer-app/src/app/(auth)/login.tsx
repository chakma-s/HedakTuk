import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/stores/themeStore';
import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { fetchAPI } from '@/api';

export default function LoginScreen() {
  const Colors = useTheme();
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await fetchAPI('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      });

      // Navigate to OTP screen and pass the phone number
      router.push({
        pathname: '/(auth)/otp',
        params: { phone }
      });
    } catch (err: any) {
      console.error('Send OTP error:', err);
      setError(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../../assets/images/auth-bg.jpg')} 
        style={styles.backgroundImage}
        contentFit="cover"
        transition={1000}
      />
      
      {/* Dark overlay gradient to make text readable at the top and bottom */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logoText}>HedakTuk</Text>
            <Text style={styles.tagline}>Premium food delivery, reimagined.</Text>
          </View>

          <BlurView intensity={80} tint="dark" style={styles.glassCard}>
            <Text style={styles.title}>Let's get started</Text>
            <Text style={styles.subtitle}>Enter your phone number to continue</Text>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputContainer}>
              <Text style={styles.countryCode}>+91</Text>
              <View style={styles.divider} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
                autoFocus
              />
            </View>

            <TouchableOpacity 
              style={[styles.continueButton, { backgroundColor: Colors.primary }, isLoading && styles.buttonDisabled]} 
              onPress={handleSendOtp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.continueButtonText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={20} color={Colors.white} />
                </View>
              )}
            </TouchableOpacity>
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
    paddingTop: Spacing.xxxl * 2,
    paddingBottom: Spacing.xxxl
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  logoText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  tagline: {
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.9)',
    marginTop: Spacing.xs,
    fontWeight: '500',
  },
  glassCard: {
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: '#ffffff', marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.7)', marginBottom: Spacing.xl },
  
  errorContainer: { backgroundColor: 'rgba(255,59,48,0.2)', padding: Spacing.sm, borderRadius: Radius.sm, marginBottom: Spacing.lg },
  errorText: { color: '#ff4d4f', fontSize: FontSize.sm, fontWeight: FontWeight.medium, textAlign: 'center' },

  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.2)', 
    borderRadius: Radius.md, 
    height: 60,
    marginBottom: Spacing.xl
  },
  countryCode: {
    fontSize: FontSize.lg,
    color: '#ffffff',
    fontWeight: FontWeight.bold,
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.md,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginRight: Spacing.md,
  },
  input: { 
    flex: 1, 
    color: '#ffffff', 
    fontSize: FontSize.lg, 
    fontWeight: '600',
    height: '100%',
  },
  
  continueButton: { 
    height: 56, 
    borderRadius: Radius.md, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.7 },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm
  },
  continueButtonText: { color: '#ffffff', fontSize: FontSize.lg, fontWeight: FontWeight.bold },
});
