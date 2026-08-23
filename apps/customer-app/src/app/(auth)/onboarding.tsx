import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/stores/themeStore';
import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { fetchAPI } from '@/api';
import { useAuthStore } from '@/stores/authStore';

export default function OnboardingScreen() {
  const Colors = useTheme();
  const router = useRouter();
  const { user, login, token } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompleteProfile = async () => {
    if (!name || !email) {
      setError('Please fill in both name and email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Assuming PATCH /users/me updates the profile and returns the updated user
      const updatedUser = await fetchAPI('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ name, email }),
      });

      if (token) {
        await login(token, updatedUser);
        router.replace('/(tabs)/');
      } else {
        setError('Session expired. Please log in again.');
      }
    } catch (err: any) {
      console.error('Update profile error:', err);
      setError(err.message || 'Failed to update profile');
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
      />
      
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.6)' }]} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logoText}>Almost There!</Text>
            <Text style={styles.tagline}>Tell us a bit about yourself.</Text>
          </View>

          <BlurView intensity={80} tint="dark" style={styles.glassCard}>
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity 
              style={[styles.continueButton, { backgroundColor: Colors.primary }, isLoading && styles.buttonDisabled]} 
              onPress={handleCompleteProfile}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.continueButtonText}>Complete Setup</Text>
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
    fontSize: 36,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  tagline: {
    fontSize: FontSize.lg,
    color: 'rgba(255,255,255,0.9)',
    marginTop: Spacing.sm,
    fontWeight: '500',
  },
  glassCard: {
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  
  errorContainer: { backgroundColor: 'rgba(255,59,48,0.2)', padding: Spacing.sm, borderRadius: Radius.sm, marginBottom: Spacing.lg },
  errorText: { color: '#ff4d4f', fontSize: FontSize.sm, fontWeight: FontWeight.medium, textAlign: 'center' },

  inputContainer: { 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.2)', 
    borderRadius: Radius.md, 
    height: 60,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center'
  },
  input: { 
    color: '#ffffff', 
    fontSize: FontSize.lg, 
    fontWeight: '500',
  },
  
  continueButton: { 
    height: 56, 
    borderRadius: Radius.md, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: Spacing.md
  },
  buttonDisabled: { opacity: 0.7 },
  continueButtonText: { color: '#ffffff', fontSize: FontSize.lg, fontWeight: FontWeight.bold },
});
