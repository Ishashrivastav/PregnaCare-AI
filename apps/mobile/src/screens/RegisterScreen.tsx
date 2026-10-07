import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext.js';

export const RegisterScreen = ({ navigation }: any) => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Email may already be registered.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoHeart}>♥</Text>
          </View>
          <Text style={styles.brandTitle}>PregnaCare AI</Text>
          <Text style={styles.brandSubtitle}>Create your personal pregnancy care plan</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Register</Text>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Sarah Jenkins"
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="name@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password (min 8 chars)</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchAuth}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.switchAuthText}>
              Already have an account? <Text style={styles.linkText}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faf9f8' },
  scroll: { padding: 24, justifyContent: 'center' },
  brandContainer: { alignItems: 'center', marginBottom: 20 },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: '#f06595',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoHeart: { color: '#fff', fontSize: 22 },
  brandTitle: { fontSize: 22, fontWeight: '800', color: '#1e293b' },
  brandSubtitle: { fontSize: 11, color: '#64748b', marginTop: 2 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#f1e8e8',
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 14 },
  errorBox: {
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#ffe4e6',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
  },
  errorText: { color: '#e11d48', fontSize: 12 },
  label: { fontSize: 11, fontWeight: '700', color: '#475569', marginBottom: 5 },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#1e293b',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#e64980',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  switchAuth: { marginTop: 18, alignItems: 'center' },
  switchAuthText: { fontSize: 12, color: '#64748b' },
  linkText: { color: '#e64980', fontWeight: '700' },
});

export default RegisterScreen;
