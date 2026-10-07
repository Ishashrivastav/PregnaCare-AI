import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// In Android emulator, 10.0.2.2 points to host machine's localhost
const DEFAULT_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_URL;

class MobileApiClient {
  private async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('auth_token');
    } catch {
      return null;
    }
  }

  async setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync('auth_token', token);
  }

  async removeToken(): Promise<void> {
    await SecureStore.deleteItemAsync('auth_token');
  }

  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = await this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data: any = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          await this.removeToken();
          throw new Error('Your session has expired. Please log in again.');
        }
        throw new Error(data?.message || `Request failed (${response.status})`);
      }

      return (data?.data !== undefined ? data.data : data) as T;
    } catch (error: any) {
      if (error.message && error.message.includes('Network request failed')) {
        throw new Error('Unable to connect to the server. Please check your network connection.');
      }
      throw error;
    }
  }

  // Auth
  register(data: any) {
    return this.request('/auth/register', { method: 'POST', body: JSON.stringify(data) });
  }

  login(data: any) {
    return this.request('/auth/login', { method: 'POST', body: JSON.stringify(data) });
  }

  getMe() {
    return this.request('/auth/me');
  }

  // Pregnancy Profile
  getProfile() {
    return this.request('/pregnancy/profile');
  }

  updateProfile(data: any) {
    return this.request('/pregnancy/profile', { method: 'PUT', body: JSON.stringify(data) });
  }

  // Projects
  getProjects(params?: { search?: string; status?: string }) {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request(`/projects${qs}`);
  }

  getProject(id: string) {
    return this.request(`/projects/${id}`);
  }

  createProject(data: any) {
    return this.request('/projects', { method: 'POST', body: JSON.stringify(data) });
  }

  deleteProject(id: string) {
    return this.request(`/projects/${id}`, { method: 'DELETE' });
  }

  // Tasks
  getTasks(params?: { projectId?: string; status?: string; priority?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.projectId) query.append('projectId', params.projectId);
    if (params?.status) query.append('status', params.status);
    if (params?.priority) query.append('priority', params.priority);
    if (params?.search) query.append('search', params.search);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request(`/tasks${qs}`);
  }

  createTask(data: any) {
    return this.request('/tasks', { method: 'POST', body: JSON.stringify(data) });
  }

  toggleTask(id: string) {
    return this.request(`/tasks/${id}/complete`, { method: 'PATCH' });
  }

  deleteTask(id: string) {
    return this.request(`/tasks/${id}`, { method: 'DELETE' });
  }

  // Doctors & Appointments
  getDoctors(params?: { search?: string; specialty?: string }) {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.specialty) query.append('specialty', params.specialty);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request(`/doctors${qs}`);
  }

  getDoctor(id: string) {
    return this.request(`/doctors/${id}`);
  }

  getAppointments(params?: { status?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request(`/appointments${qs}`);
  }

  createAppointment(data: any) {
    return this.request('/appointments', { method: 'POST', body: JSON.stringify(data) });
  }

  cancelAppointment(id: string) {
    return this.request(`/appointments/${id}/cancel`, { method: 'PATCH' });
  }

  // Reminders & Milestones
  getReminders() {
    return this.request('/reminders');
  }

  toggleReminder(id: string) {
    return this.request(`/reminders/${id}/toggle`, { method: 'PATCH' });
  }

  createReminder(data: any) {
    return this.request('/reminders', { method: 'POST', body: JSON.stringify(data) });
  }

  getMilestones() {
    return this.request('/milestones');
  }

  toggleMilestone(id: string) {
    return this.request(`/milestones/${id}/toggle`, { method: 'PATCH' });
  }

  // AI & Ask Doctor
  sendChatMessage(data: { message: string; sessionId?: string }) {
    return this.request('/chat', { method: 'POST', body: JSON.stringify(data) });
  }

  askDoctor(data: { concern: string; currentWeek?: number }) {
    return this.request('/chat/ask-doctor', { method: 'POST', body: JSON.stringify(data) });
  }

  // Dashboard
  getDashboard() {
    return this.request('/dashboard');
  }
}

export const mobileApi = new MobileApiClient();
export default mobileApi;
