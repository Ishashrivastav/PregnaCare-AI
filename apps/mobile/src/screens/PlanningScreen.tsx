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
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import mobileApi from '../api/client.js';

export const PlanningScreen = ({ navigation }: any) => {
  const [tab, setTab] = useState<'PROJECTS' | 'TASKS' | 'MILESTONES'>('PROJECTS');
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // New Project Modal State
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  // New Task Modal State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('MEDIUM');

  const fetchData = async () => {
    try {
      const [projData, taskData, mileData] = await Promise.all([
        mobileApi.getProjects(),
        mobileApi.getTasks(),
        mobileApi.getMilestones(),
      ]);
      setProjects(projData || []);
      setTasks(taskData || []);
      setMilestones(mileData || []);
      if (projData && projData.length > 0 && !selectedProjectId) {
        setSelectedProjectId(projData[0].id);
      }
    } catch (err: any) {
      console.error('Failed to load planning data', err);
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

  const handleToggleTask = async (id: string) => {
    try {
      await mobileApi.toggleTask(id);
      fetchData();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleToggleMilestone = async (id: string) => {
    try {
      await mobileApi.toggleMilestone(id);
      fetchData();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      await mobileApi.createProject({
        name: newProjectName.trim(),
        description: newProjectDesc.trim(),
      });
      setNewProjectName('');
      setNewProjectDesc('');
      setShowProjectModal(false);
      fetchData();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskName.trim() || !selectedProjectId) {
      Alert.alert('Validation', 'Please select a project and provide a task name.');
      return;
    }
    try {
      await mobileApi.createTask({
        projectId: selectedProjectId,
        name: newTaskName.trim(),
        description: newTaskDesc.trim(),
        priority: newTaskPriority,
      });
      setNewTaskName('');
      setNewTaskDesc('');
      setShowTaskModal(false);
      fetchData();
      Alert.alert('Success', 'Task created! Refreshed on database.');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'PROJECTS' && styles.tabBtnActive]}
          onPress={() => setTab('PROJECTS')}
        >
          <Text style={[styles.tabBtnText, tab === 'PROJECTS' && styles.tabBtnTextActive]}>
            Projects ({projects.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, tab === 'TASKS' && styles.tabBtnActive]}
          onPress={() => setTab('TASKS')}
        >
          <Text style={[styles.tabBtnText, tab === 'TASKS' && styles.tabBtnTextActive]}>
            Tasks ({tasks.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, tab === 'MILESTONES' && styles.tabBtnActive]}
          onPress={() => setTab('MILESTONES')}
        >
          <Text style={[styles.tabBtnText, tab === 'MILESTONES' && styles.tabBtnTextActive]}>
            Milestones
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

        {/* PROJECTS TAB */}
        {tab === 'PROJECTS' && (
          <View>
            <View style={styles.headerRow}>
              <Text style={styles.sectionTitle}>Pregnancy Care Projects</Text>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => setShowProjectModal(true)}
              >
                <Text style={styles.addBtnText}>+ New Project</Text>
              </TouchableOpacity>
            </View>

            {projects.length === 0 ? (
              <Text style={styles.emptyText}>No pregnancy projects yet. Add one!</Text>
            ) : (
              projects.map((p) => {
                const progress = p.progressPercentage || 0;
                return (
                  <View key={p.id} style={styles.projectCard}>
                    <View style={styles.cardTop}>
                      <Text style={styles.badge}>{p.status.replace('_', ' ')}</Text>
                      <Text style={styles.progressText}>{progress}%</Text>
                    </View>
                    <Text style={styles.cardTitle}>{p.name}</Text>
                    {p.description ? <Text style={styles.cardDesc}>{p.description}</Text> : null}

                    {/* Progress Bar */}
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressBar, { width: `${progress}%` }]} />
                    </View>
                    <Text style={styles.taskCountText}>
                      {p.completedTasks || 0} of {p.totalTasks || 0} tasks completed
                    </Text>
                  </View>
                );
              })
            )}
          </View>
        )}

        {/* TASKS TAB */}
        {tab === 'TASKS' && (
          <View>
            <View style={styles.headerRow}>
              <Text style={styles.sectionTitle}>Care Checklist Tasks</Text>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => setShowTaskModal(true)}
              >
                <Text style={styles.addBtnText}>+ Add Task</Text>
              </TouchableOpacity>
            </View>

            {tasks.length === 0 ? (
              <Text style={styles.emptyText}>No care tasks found.</Text>
            ) : (
              tasks.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={styles.taskRow}
                  onPress={() => handleToggleTask(t.id)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      t.status === 'COMPLETED' && styles.checkboxActive,
                    ]}
                  >
                    {t.status === 'COMPLETED' ? <Text style={styles.checkTick}>✓</Text> : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.taskName,
                        t.status === 'COMPLETED' && styles.taskDone,
                      ]}
                    >
                      {t.name}
                    </Text>
                    {t.project ? (
                      <Text style={styles.taskProject}>Plan: {t.project.name}</Text>
                    ) : null}
                  </View>
                  <View
                    style={[
                      styles.priorityBadge,
                      t.priority === 'HIGH' && { backgroundColor: '#fee2e2' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        t.priority === 'HIGH' && { color: '#dc2626' },
                      ]}
                    >
                      {t.priority}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* MILESTONES TAB */}
        {tab === 'MILESTONES' && (
          <View>
            <Text style={styles.sectionTitle}>Pregnancy Milestones</Text>
            {milestones.map((m) => (
              <TouchableOpacity
                key={m.id}
                style={styles.milestoneRow}
                onPress={() => handleToggleMilestone(m.id)}
              >
                <View
                  style={[
                    styles.checkbox,
                    m.isCompleted && styles.checkboxActive,
                  ]}
                >
                  {m.isCompleted ? <Text style={styles.checkTick}>✓</Text> : null}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.taskName, m.isCompleted && styles.taskDone]}>
                    {m.title}
                  </Text>
                  <Text style={styles.milestoneWeek}>Target: Week {m.targetWeek}</Text>
                  {m.description ? (
                    <Text style={styles.cardDesc}>{m.description}</Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* New Project Modal */}
      <Modal visible={showProjectModal} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Pregnancy Project</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Project Name (e.g. Hospital Prep)"
              value={newProjectName}
              onChangeText={setNewProjectName}
            />
            <TextInput
              style={[styles.modalInput, { height: 70 }]}
              placeholder="Description"
              value={newProjectDesc}
              onChangeText={setNewProjectDesc}
              multiline
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setShowProjectModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={handleCreateProject}>
                <Text style={styles.modalSaveText}>Create Project</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* New Task Modal */}
      <Modal visible={showTaskModal} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Care Task</Text>
            <Text style={styles.label}>Select Project:</Text>
            <ScrollView horizontal style={{ marginBottom: 12 }}>
              {projects.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.projPill,
                    selectedProjectId === p.id && styles.projPillActive,
                  ]}
                  onPress={() => setSelectedProjectId(p.id)}
                >
                  <Text
                    style={[
                      styles.projPillText,
                      selectedProjectId === p.id && styles.projPillTextActive,
                    ]}
                  >
                    {p.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TextInput
              style={styles.modalInput}
              placeholder="Task Name (e.g. Choose hospital)"
              value={newTaskName}
              onChangeText={setNewTaskName}
            />
            <TextInput
              style={[styles.modalInput, { height: 60 }]}
              placeholder="Description / Notes"
              value={newTaskDesc}
              onChangeText={setNewTaskDesc}
              multiline
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setShowTaskModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={handleCreateTask}>
                <Text style={styles.modalSaveText}>Save Task</Text>
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
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabBtnActive: { backgroundColor: '#fff5f7' },
  tabBtnText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  tabBtnTextActive: { color: '#e64980' },
  scroll: { padding: 16, paddingBottom: 40 },
  pullHint: { fontSize: 11, color: '#94a3b8', textAlign: 'center', marginBottom: 12 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#1e293b' },
  addBtn: {
    backgroundColor: '#e64980',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addBtnText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  emptyText: { textAlign: 'center', color: '#94a3b8', fontSize: 13, marginTop: 20 },
  projectCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1e8e8',
    marginBottom: 12,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  badge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#e64980',
    backgroundColor: '#fff0f5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  progressText: { fontSize: 12, fontWeight: '800', color: '#e64980' },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  cardDesc: { fontSize: 11, color: '#64748b', marginTop: 4 },
  progressTrack: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBar: { height: '100%', backgroundColor: '#e64980', borderRadius: 3 },
  taskCountText: { fontSize: 10, color: '#94a3b8', marginTop: 6 },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1e8e8',
    marginBottom: 8,
    gap: 12,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1e8e8',
    marginBottom: 8,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  checkTick: { color: '#fff', fontSize: 12, fontWeight: '900' },
  taskName: { fontSize: 13, fontWeight: '700', color: '#1e293b' },
  taskDone: { textDecorationLine: 'line-through', color: '#94a3b8' },
  taskProject: { fontSize: 10, color: '#e64980', fontWeight: '600', marginTop: 2 },
  milestoneWeek: { fontSize: 10, color: '#7c3aed', fontWeight: '700', marginTop: 2 },
  priorityBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityText: { fontSize: 9, fontWeight: '800', color: '#b45309' },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 14 },
  modalInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 10,
    fontSize: 12,
    marginBottom: 10,
  },
  label: { fontSize: 11, fontWeight: '700', color: '#475569', marginBottom: 6 },
  projPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 6,
  },
  projPillActive: { backgroundColor: '#e64980' },
  projPillText: { fontSize: 11, fontWeight: '600', color: '#475569' },
  projPillTextActive: { color: '#fff' },
  modalBtns: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  modalCancel: { paddingVertical: 8, paddingHorizontal: 12 },
  modalCancelText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  modalSave: {
    backgroundColor: '#e64980',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  modalSaveText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});

export default PlanningScreen;
