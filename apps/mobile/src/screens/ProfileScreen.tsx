import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext.js';

export const ProfileScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out of your session?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Profile Card */}
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>{user?.fullName?.charAt(0) || 'U'}</Text>
          </View>
          <Text style={styles.name}>{user?.fullName || 'User'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>SECURITY & PRIVACY</Text>
          <Text style={styles.infoText}>• JWT authentication stored securely in Expo SecureStore.</Text>
          <Text style={styles.infoText}>• Passwords hashed with bcrypt; secrets held strictly on backend.</Text>
          <Text style={styles.infoText}>• Connects to the same PostgreSQL database as the web application.</Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Sign Out of Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faf9f8' },
  content: { padding: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1e8e8',
    marginBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e64980',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarLetter: { color: '#fff', fontSize: 26, fontWeight: '800' },
  name: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  email: { fontSize: 12, color: '#64748b', marginTop: 2 },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1e8e8',
    marginBottom: 20,
    gap: 6,
  },
  infoTitle: { fontSize: 10, fontWeight: '800', color: '#94a3b8', marginBottom: 4 },
  infoText: { fontSize: 11, color: '#475569', lineHeight: 16 },
  logoutBtn: {
    backgroundColor: '#fee2e2',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  logoutBtnText: { color: '#dc2626', fontSize: 13, fontWeight: '700' },
});

export default ProfileScreen;
