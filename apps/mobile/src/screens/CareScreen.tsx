import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
  Alert,
} from 'react-native';
import mobileApi from '../api/client.js';

export const CareScreen = () => {
  const [subTab, setSubTab] = useState<'DOCTORS' | 'APPOINTMENTS' | 'ASK_DOCTOR'>('DOCTORS');
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Booking Modal
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [apptDate, setApptDate] = useState('');
  const [apptTime, setApptTime] = useState('10:00 AM');
  const [apptType, setApptType] = useState('Routine Checkup');

  // Ask Doctor State
  const [concern, setConcern] = useState('');
  const [questionsResult, setQuestionsResult] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchData = async () => {
    try {
      const [docs, appts] = await Promise.all([
        mobileApi.getDoctors(),
        mobileApi.getAppointments(),
      ]);
      setDoctors(docs || []);
      setAppointments(appts || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const handleBook = async () => {
    if (!selectedDoctor || !apptDate) {
      Alert.alert('Validation', 'Please provide an appointment date.');
      return;
    }
    try {
      await mobileApi.createAppointment({
        doctorId: selectedDoctor.id,
        appointmentDate: apptDate,
        appointmentTime: apptTime,
        appointmentType: apptType,
      });
      setShowBookingModal(false);
      setApptDate('');
      fetchData();
      Alert.alert('Success', 'Consultation scheduled successfully!');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleCancelAppt = async (id: string) => {
    try {
      await mobileApi.cancelAppointment(id);
      fetchData();
      Alert.alert('Cancelled', 'Appointment cancelled.');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleAskDoctor = async () => {
    if (!concern.trim()) return;
    setIsGenerating(true);
    try {
      const res = await mobileApi.askDoctor({ concern: concern.trim() });
      setQuestionsResult(res);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Sub Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, subTab === 'DOCTORS' && styles.tabBtnActive]}
          onPress={() => setSubTab('DOCTORS')}
        >
          <Text style={[styles.tabBtnText, subTab === 'DOCTORS' && styles.tabBtnTextActive]}>
            Doctors ({doctors.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, subTab === 'APPOINTMENTS' && styles.tabBtnActive]}
          onPress={() => setSubTab('APPOINTMENTS')}
        >
          <Text style={[styles.tabBtnText, subTab === 'APPOINTMENTS' && styles.tabBtnTextActive]}>
            Visits ({appointments.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, subTab === 'ASK_DOCTOR' && styles.tabBtnActive]}
          onPress={() => setSubTab('ASK_DOCTOR')}
        >
          <Text style={[styles.tabBtnText, subTab === 'ASK_DOCTOR' && styles.tabBtnTextActive]}>
            Ask Doctor Prep
          </Text>
        </TouchableOpacity>
      </View>

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
        <Text style={styles.pullHint}>↓ Pull down to refresh data from server</Text>

        {/* DOCTORS DIRECTORY */}
        {subTab === 'DOCTORS' && (
          <View style={{ gap: 10 }}>
            {doctors.map((doc) => (
              <View key={doc.id} style={styles.card}>
                <Text style={styles.docName}>{doc.name}</Text>
                <Text style={styles.docSpecialty}>{doc.specialty}</Text>
                <Text style={styles.docClinic}>
                  {doc.hospitalClinic} • ⭐ {doc.rating} ({doc.experience} yrs exp)
                </Text>
                <TouchableOpacity
                  style={styles.bookBtn}
                  onPress={() => {
                    setSelectedDoctor(doc);
                    setShowBookingModal(true);
                  }}
                >
                  <Text style={styles.bookBtnText}>Schedule Consultation</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* APPOINTMENTS */}
        {subTab === 'APPOINTMENTS' && (
          <View style={{ gap: 10 }}>
            {appointments.length === 0 ? (
              <Text style={styles.emptyText}>No appointments scheduled yet.</Text>
            ) : (
              appointments.map((a) => (
                <View key={a.id} style={styles.card}>
                  <View style={styles.statusRow}>
                    <Text style={styles.statusBadge}>{a.status}</Text>
                    <Text style={styles.apptTime}>
                      {new Date(a.appointmentDate).toLocaleDateString()} at {a.appointmentTime}
                    </Text>
                  </View>
                  <Text style={styles.apptType}>{a.appointmentType}</Text>
                  <Text style={styles.docClinic}>Provider: {a.doctor?.name || 'Assigned Specialist'}</Text>
                  {a.status === 'UPCOMING' && (
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => handleCancelAppt(a.id)}
                    >
                      <Text style={styles.cancelBtnText}>Cancel Appointment</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))
            )}
          </View>
        )}

        {/* ASK DOCTOR PREP */}
        {subTab === 'ASK_DOCTOR' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Ask Your Doctor Prep</Text>
            <Text style={styles.subHint}>
              Enter a symptom or question to generate doctor discussion points.
            </Text>
            <TextInput
              style={[styles.input, { height: 70 }]}
              placeholder="e.g. Lower back discomfort when walking..."
              value={concern}
              onChangeText={setConcern}
              multiline
            />
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleAskDoctor}
              disabled={isGenerating}
            >
              <Text style={styles.actionBtnText}>
                {isGenerating ? 'Generating...' : 'Generate Questions'}
              </Text>
            </TouchableOpacity>

            {questionsResult && (
              <View style={{ marginTop: 14 }}>
                <Text style={styles.resultHeader}>QUESTIONS TO ASK YOUR DOCTOR:</Text>
                {questionsResult.suggestedQuestions?.map((q: string, i: number) => (
                  <Text key={i} style={styles.questionItem}>
                    {i + 1}. {q}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Booking Modal */}
      <Modal visible={showBookingModal} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Book with {selectedDoctor?.name}</Text>
            <Text style={styles.label}>Date (YYYY-MM-DD) *</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 2027-02-10"
              value={apptDate}
              onChangeText={setApptDate}
            />
            <Text style={styles.label}>Appointment Type</Text>
            <TextInput
              style={styles.modalInput}
              value={apptType}
              onChangeText={setApptType}
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setShowBookingModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={handleBook}>
                <Text style={styles.modalSaveText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  scroll: { padding: 16, paddingBottom: 40 },
  pullHint: { fontSize: 11, color: '#94a3b8', textAlign: 'center', marginBottom: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1e8e8',
    marginBottom: 10,
  },
  docName: { fontSize: 15, fontWeight: '800', color: '#1e293b' },
  docSpecialty: { fontSize: 12, fontWeight: '700', color: '#e64980', marginTop: 2 },
  docClinic: { fontSize: 11, color: '#64748b', marginTop: 4 },
  bookBtn: {
    backgroundColor: '#fff5f7',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  bookBtnText: { color: '#e64980', fontSize: 12, fontWeight: '700' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0284c7',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  apptTime: { fontSize: 11, color: '#64748b' },
  apptType: { fontSize: 14, fontWeight: '700', color: '#1e293b', marginTop: 6 },
  cancelBtn: {
    marginTop: 10,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 8,
  },
  cancelBtnText: { color: '#dc2626', fontSize: 11, fontWeight: '700' },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#1e293b' },
  subHint: { fontSize: 11, color: '#64748b', marginTop: 2, marginBottom: 10 },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 10,
    fontSize: 12,
  },
  actionBtn: {
    backgroundColor: '#e64980',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  actionBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  resultHeader: { fontSize: 11, fontWeight: '800', color: '#334155', marginBottom: 6 },
  questionItem: { fontSize: 12, color: '#475569', lineHeight: 18, marginBottom: 4 },
  emptyText: { textAlign: 'center', color: '#94a3b8', fontSize: 13, marginTop: 20 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 12 },
  label: { fontSize: 11, fontWeight: '700', color: '#475569', marginBottom: 4 },
  modalInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 10,
    fontSize: 12,
    marginBottom: 10,
  },
  modalBtns: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 },
  modalCancel: { paddingVertical: 8, paddingHorizontal: 12 },
  modalCancelText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  modalSave: { backgroundColor: '#e64980', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 },
  modalSaveText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});

export default CareScreen;
