import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import mobileApi from '../api/client.js';

export const PregnancyScreen = () => {
  const [subTab, setSubTab] = useState<'PROFILE' | 'TIMELINE' | 'WEEKLY' | 'EDUCATION'>('PROFILE');
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Profile Form
  const [dueDate, setDueDate] = useState('');
  const [currentWeek, setCurrentWeek] = useState('24');
  const [preferredDoctor, setPreferredDoctor] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Weekly selection
  const [weekNum, setWeekNum] = useState(24);

  const fetchProfile = async () => {
    try {
      const data = await mobileApi.getProfile();
      if (data) {
        setProfile(data);
        setDueDate(data.dueDate ? data.dueDate.split('T')[0] : '');
        setCurrentWeek(String(data.currentWeek || 1));
        setPreferredDoctor(data.preferredDoctor || '');
        setNotes(data.notes || '');
        setWeekNum(data.currentWeek || 24);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!dueDate) {
      Alert.alert('Validation', 'Please enter your estimated due date.');
      return;
    }
    setIsSaving(true);
    try {
      const updated = await mobileApi.updateProfile({
        dueDate,
        currentWeek: parseInt(currentWeek, 10) || 1,
        preferredDoctor,
        notes,
      });
      setProfile(updated);
      Alert.alert('Success', 'Pregnancy profile saved.');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Sub Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, subTab === 'PROFILE' && styles.tabBtnActive]}
          onPress={() => setSubTab('PROFILE')}
        >
          <Text style={[styles.tabBtnText, subTab === 'PROFILE' && styles.tabBtnTextActive]}>
            Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, subTab === 'TIMELINE' && styles.tabBtnActive]}
          onPress={() => setSubTab('TIMELINE')}
        >
          <Text style={[styles.tabBtnText, subTab === 'TIMELINE' && styles.tabBtnTextActive]}>
            Timeline
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, subTab === 'WEEKLY' && styles.tabBtnActive]}
          onPress={() => setSubTab('WEEKLY')}
        >
          <Text style={[styles.tabBtnText, subTab === 'WEEKLY' && styles.tabBtnTextActive]}>
            Weekly Guide
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, subTab === 'EDUCATION' && styles.tabBtnActive]}
          onPress={() => setSubTab('EDUCATION')}
        >
          <Text style={[styles.tabBtnText, subTab === 'EDUCATION' && styles.tabBtnTextActive]}>
            Nutrition & Wellness
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* PROFILE TAB */}
        {subTab === 'PROFILE' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>My Pregnancy Profile</Text>

            <Text style={styles.label}>Estimated Due Date (YYYY-MM-DD) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 2027-01-15"
              value={dueDate}
              onChangeText={setDueDate}
            />

            <Text style={styles.label}>Current Pregnancy Week (1–42) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 24"
              value={currentWeek}
              onChangeText={setCurrentWeek}
              keyboardType="number-pad"
            />

            <Text style={styles.label}>Preferred Doctor / Clinic</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Dr. Evelyn Vance, MD"
              value={preferredDoctor}
              onChangeText={setPreferredDoctor}
            />

            <Text style={styles.label}>General Notes & Observations</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Personal symptoms, ultrasound notes..."
              value={notes}
              onChangeText={setNotes}
              multiline
            />

            <TouchableOpacity
              style={[styles.saveBtn, isSaving && { opacity: 0.6 }]}
              onPress={handleSaveProfile}
              disabled={isSaving}
            >
              <Text style={styles.saveBtnText}>
                {isSaving ? 'Saving...' : 'Save Pregnancy Profile'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* TIMELINE TAB */}
        {subTab === 'TIMELINE' && (
          <View style={{ gap: 12 }}>
            <View style={styles.card}>
              <Text style={styles.trimTag}>TRIMESTER 1 (WEEKS 1–13)</Text>
              <Text style={styles.cardTitle}>Cellular Division & Organ Formation</Text>
              <Text style={styles.bodyText}>
                Major systems form. Common symptoms include mild nausea, breast changes, and fatigue. Prioritize 400–800 mcg folic acid daily.
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.trimTag}>TRIMESTER 2 (WEEKS 14–27)</Text>
              <Text style={styles.cardTitle}>Quickening & Growth Phase</Text>
              <Text style={styles.bodyText}>
                Baby begins moving actively, hearing develops. Schedule the mid-pregnancy anatomy scan (weeks 18–22) and focus on iron and hydration.
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.trimTag}>TRIMESTER 3 (WEEKS 28–40+)</Text>
              <Text style={styles.cardTitle}>Maturation & Birth Preparation</Text>
              <Text style={styles.bodyText}>
                Baby gains weight and lung surfactant develops. Prepare hospital bag, take infant safety courses, and track daily fetal movement.
              </Text>
            </View>
          </View>
        )}

        {/* WEEKLY GUIDE TAB */}
        {subTab === 'WEEKLY' && (
          <View style={styles.card}>
            <View style={styles.weekSelectRow}>
              <TouchableOpacity
                onPress={() => setWeekNum((w) => Math.max(1, w - 1))}
                style={styles.weekNavBtn}
              >
                <Text style={styles.navArrow}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.weekTitle}>Week {weekNum}</Text>
              <TouchableOpacity
                onPress={() => setWeekNum((w) => Math.min(40, w + 1))}
                style={styles.weekNavBtn}
              >
                <Text style={styles.navArrow}>›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>👶 BABY DEVELOPMENT</Text>
              <Text style={styles.infoText}>
                At week {weekNum}, baby is undergoing crucial nervous system coordination and sensory development.
              </Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>🤰 MOTHER'S BODY</Text>
              <Text style={styles.infoText}>
                Maintain supportive side-sleeping with pillow alignment and drink 8-10 glasses of water daily.
              </Text>
            </View>
          </View>
        )}

        {/* NUTRITION & WELLNESS TAB */}
        {subTab === 'EDUCATION' && (
          <View style={{ gap: 12 }}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Essential Nutrition</Text>
              <Text style={styles.bodyText}>
                • Folate & Iron: Dark greens, lentils, lean protein.{'\n'}
                • Calcium & Vitamin D: Pasteurized dairy or fortified plant milks.{'\n'}
                • Hydration: Aim for 2.5 liters of clean water daily.{'\n'}
                • Avoid: Raw/undercooked meats, unpasteurized soft cheeses.
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Maternal Wellness</Text>
              <Text style={styles.bodyText}>
                • Side-sleeping on left side supports optimum uterine blood flow.{'\n'}
                • 150 mins weekly of gentle low-impact walking or prenatal yoga.{'\n'}
                • Deep diaphragmatic relaxation breathing reduces cortisol.
              </Text>
            </View>
          </View>
        )}

        <Text style={styles.disclaimer}>
          Disclaimer: PregnaCare AI provides educational guidance only and does not replace clinical consultation.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faf9f8' },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1e8e8',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabBtnActive: { backgroundColor: '#fff5f7' },
  tabBtnText: { fontSize: 11, fontWeight: '700', color: '#64748b' },
  tabBtnTextActive: { color: '#e64980' },
  scroll: { padding: 18, paddingBottom: 40 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#f1e8e8',
  },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#1e293b', marginBottom: 12 },
  trimTag: { fontSize: 10, fontWeight: '800', color: '#e64980', marginBottom: 4 },
  bodyText: { fontSize: 12, color: '#475569', lineHeight: 18 },
  label: { fontSize: 11, fontWeight: '700', color: '#475569', marginBottom: 4 },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 10,
    fontSize: 12,
    marginBottom: 12,
  },
  saveBtn: {
    backgroundColor: '#e64980',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  saveBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  weekSelectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  weekNavBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrow: { fontSize: 20, color: '#475569', fontWeight: 'bold' },
  weekTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  infoBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  infoLabel: { fontSize: 10, fontWeight: '800', color: '#64748b', marginBottom: 4 },
  infoText: { fontSize: 12, color: '#334155', lineHeight: 17 },
  disclaimer: { fontSize: 10, color: '#94a3b8', textAlign: 'center', marginTop: 20, lineHeight: 14 },
});

export default PregnancyScreen;
