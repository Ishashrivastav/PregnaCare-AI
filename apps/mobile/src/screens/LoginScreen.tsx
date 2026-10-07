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
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext.js';

export const LoginScreen = ({ navigation }: any) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await login({ email: email.trim(), password });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoHeart}>♥</Text>
          </View>
          <Text style={styles.brandTitle}>PregnaCare AI</Text>
          <Text style={styles.brandSubtitle}>Your Intelligent Pregnancy Care Companion</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign In</Text>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="name@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>QUICK DEMO ACCOUNTS</Text>
            <View style={styles.demoButtons}>
              <TouchableOpacity
                style={styles.demoBtn}
                onPress={() => fillDemo('demo@pregnacare.com')}
              >
                <Text style={styles.demoBtnText}>Sarah (W24)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.demoBtn}
                onPress={() => fillDemo('emily@pregnacare.com')}
              >
                <Text style={styles.demoBtnText}>Emily (W10)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.demoBtn}
                onPress={() => fillDemo('olivia@pregnacare.com')}
              >
                <Text style={styles.demoBtnText}>Olivia (W34)</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.switchAuth}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.switchAuthText}>
              Don't have an account? <Text style={styles.linkText}>Create one</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.disclaimer}>
          PregnaCare AI provides educational and organizational assistance. It does not provide clinical diagnosis or emergency medical care.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faf9f8' },
  scroll: { padding: 24, justifyContent: 'center' },
  brandContainer: { alignItems: 'center', marginBottom: 28 },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#f06595',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoHeart: { color: '#fff', fontSize: 26 },
  brandTitle: { fontSize: 24, fontWeight: '800', color: '#1e293b' },
  brandSubtitle: { fontSize: 12, color: '#64748b', marginTop: 4 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#f1e8e8',
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 16 },
  errorBox: {
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#ffe4e6',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
  },
  errorText: { color: '#e11d48', fontSize: 12 },
  label: { fontSize: 12, fontWeight: '700', color: '#475569', marginBottom: 6 },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1e293b',
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#e64980',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  demoSection: { marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  demoTitle: { fontSize: 10, fontWeight: '800', color: '#94a3b8', textAlign: 'center', marginBottom: 10 },
  demoButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 6 },
  demoBtn: {
    flex: 1,
    backgroundColor: '#fff5f7',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  demoBtnText: { fontSize: 11, fontWeight: '700', color: '#d6336c' },
  switchAuth: { marginTop: 20, alignItems: 'center' },
  switchAuthText: { fontSize: 12, color: '#64748b' },
  linkText: { color: '#e64980', fontWeight: '700' },
  disclaimer: { fontSize: 10, color: '#94a3b8', textAlign: 'center', marginTop: 24, lineHeight: 14 },
});

export default LoginScreen;
