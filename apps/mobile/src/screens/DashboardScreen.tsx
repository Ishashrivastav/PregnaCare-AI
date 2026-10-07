import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import mobileApi from '../api/client.js';

export const DashboardScreen = ({ navigation }: any) => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setError(null);
      const data = await mobileApi.getDashboard();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load statistics.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStats();
  }, []);

  if (isLoading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e64980" />
        <Text style={styles.loadingText}>Syncing with PregnaCare cloud...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#e64980']}
            tintColor="#e64980"
          />
        }
      >
        {/* Top Gestational Hero Card */}
        <View style={styles.heroCard}>
          <Text style={styles.trimesterBadge}>
            {stats?.trimester === 1
              ? 'FIRST TRIMESTER (W1–13)'
              : stats?.trimester === 2
              ? 'SECOND TRIMESTER (W14–27)'
              : 'THIRD TRIMESTER (W28–40+)'}
          </Text>

          <Text style={styles.weekTitle}>Week {stats?.currentPregnancyWeek || 1}</Text>
          <Text style={styles.heroSub}>
            Gestational Progress: {stats?.pregnancyProgressPercentage || 0}%
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                { width: `${Math.min(100, stats?.pregnancyProgressPercentage || 0)}%` },
              ]}
            />
          </View>

          {stats?.estimatedDueDate && (
            <Text style={styles.dueDateText}>
              Estimated Due: {new Date(stats.estimatedDueDate).toLocaleDateString()}
              {stats.daysRemaining !== undefined ? ` • ${stats.daysRemaining} days remaining` : ''}
            </Text>
          )}
        </View>

        {/* Sync Prompt Pill */}
        <View style={styles.syncPill}>
          <Text style={styles.syncText}>↓ Pull down to refresh data from server</Text>
        </View>

        {/* Mandatory Project Management Statistics */}
        <Text style={styles.sectionHeader}>Care Plan Statistics</Text>
        <View style={styles.statsGrid}>
          {/* Projects */}
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Projects</Text>
            <Text style={styles.statNum}>{stats?.totalProjects || 0}</Text>
            <Text style={styles.statSub}>{stats?.projectsInProgress || 0} In Progress</Text>
          </View>

          {/* Tasks */}
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Tasks</Text>
            <Text style={styles.statNum}>{stats?.totalTasks || 0}</Text>
            <Text style={[styles.statSub, { color: '#16a34a' }]}>
              {stats?.completedTasks || 0} Completed
            </Text>
          </View>

          {/* Appointments */}
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Upcoming Visits</Text>
            <Text style={styles.statNum}>{stats?.upcomingAppointments || 0}</Text>
            <Text style={styles.statSub}>{stats?.completedAppointments || 0} Attended</Text>
          </View>

          {/* Milestones */}
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Milestones</Text>
            <Text style={styles.statNum}>
              {stats?.completedMilestones || 0}/{stats?.totalMilestones || 0}
            </Text>
            <Text style={[styles.statSub, { color: '#7c3aed' }]}>Achieved</Text>
          </View>
        </View>

        {/* Next Appointment Card */}
        {stats?.nextAppointment && (
          <View style={styles.card}>
            <Text style={styles.cardHeader}>NEXT APPOINTMENT</Text>
            <Text style={styles.cardTitle}>
              {stats.nextAppointment.doctor?.name || 'Healthcare Professional'}
            </Text>
            <Text style={styles.cardDetail}>
              {stats.nextAppointment.appointmentType} •{' '}
              {new Date(stats.nextAppointment.appointmentDate).toLocaleDateString()} at{' '}
              {stats.nextAppointment.appointmentTime}
            </Text>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickGrid}>
          <TouchableOpacity
            style={styles.quickBtn}
            onPress={() => navigation.navigate('AIAssistant')}
          >
            <Text style={styles.quickBtnTitle}>✨ Ask PregnaCare AI</Text>
            <Text style={styles.quickBtnSub}>Educational support</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickBtn}
            onPress={() => navigation.navigate('Planning')}
          >
            <Text style={styles.quickBtnTitle}>📋 Care Projects & Tasks</Text>
            <Text style={styles.quickBtnSub}>Manage checklist</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.disclaimer}>
          PregnaCare AI provides educational and organizational information. It does not provide medical diagnosis or replace a doctor.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faf9f8' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#faf9f8' },
  loadingText: { marginTop: 12, fontSize: 13, color: '#64748b', fontWeight: '600' },
  scroll: { padding: 18, paddingBottom: 40 },
  heroCard: {
    backgroundColor: '#e64980',
    borderRadius: 24,
    padding: 20,
    marginBottom: 12,
    elevation: 3,
  },
  trimesterBadge: {
    color: '#ffe3ec',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  weekTitle: { color: '#fff', fontSize: 26, fontWeight: '800' },
  heroSub: { color: '#fff5f8', fontSize: 13, marginTop: 4, fontWeight: '600' },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    marginTop: 14,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  dueDateText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 12,
  },
  syncPill: {
    alignItems: 'center',
    marginBottom: 16,
  },
  syncText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#f1e8e8',
  },
  statLabel: { fontSize: 11, fontWeight: '700', color: '#64748b' },
  statNum: { fontSize: 22, fontWeight: '800', color: '#1e293b', marginTop: 4 },
  statSub: { fontSize: 11, fontWeight: '600', color: '#e64980', marginTop: 2 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  cardHeader: { fontSize: 10, fontWeight: '800', color: '#64748b', marginBottom: 4 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  cardDetail: { fontSize: 12, color: '#475569', marginTop: 4 },
  quickGrid: { gap: 10, marginBottom: 16 },
  quickBtn: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#f1e8e8',
  },
  quickBtnTitle: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  quickBtnSub: { fontSize: 11, color: '#64748b', marginTop: 2 },
  disclaimer: { fontSize: 10, color: '#94a3b8', textAlign: 'center', lineHeight: 14, marginTop: 10 },
});

export default DashboardScreen;
