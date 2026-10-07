function sanitizeApiBaseUrl(rawUrl?: string): string {
  let url = (rawUrl || '').trim();

  if (!url) {
    return import.meta.env.DEV
      ? 'http://localhost:5000/api'
      : 'https://pregnacare-ai-backend.onrender.com/api';
  }

  // Strip trailing slashes
  url = url.replace(/\/+$/, '');

  // Strip accidental /health from the base URL if configured in deployment
  if (url.endsWith('/health')) {
    url = url.slice(0, -7).replace(/\/+$/, '');
  }

  // Ensure path ends with /api
  if (!url.endsWith('/api') && !url.includes('/api/')) {
    url = `${url}/api`;
  }

  return url;
}

const API_BASE_URL = sanitizeApiBaseUrl(import.meta.env.VITE_API_URL);

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = this.getHeaders();

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...(options.headers || {}),
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
            window.location.href = '/login?expired=true';
          }
        }
        throw new Error(data?.message || `HTTP Error ${response.status}`);
      }

      return data?.data !== undefined ? data.data : data;
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      }
      throw error;
    }
  }

  // Auth
  async register(data: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: any) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  // Pregnancy Profile
  async getProfile() {
    return this.request('/pregnancy/profile');
  }

  async createProfile(data: any) {
    return this.request('/pregnancy/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProfile(data: any) {
    return this.request('/pregnancy/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Projects
  async getProjects(params?: { search?: string; status?: string }) {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.request(`/projects${queryString}`);
  }

  async getProject(id: string) {
    return this.request(`/projects/${id}`);
  }

  async createProject(data: any) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, data: any) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Tasks
  async getTasks(params?: { projectId?: string; status?: string; priority?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.projectId) query.append('projectId', params.projectId);
    if (params?.status) query.append('status', params.status);
    if (params?.priority) query.append('priority', params.priority);
    if (params?.search) query.append('search', params.search);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.request(`/tasks${queryString}`);
  }

  async getTask(id: string) {
    return this.request(`/tasks/${id}`);
  }

  async createTask(data: any) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: string, data: any) {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async toggleTask(id: string) {
    return this.request(`/tasks/${id}/complete`, {
      method: 'PATCH',
    });
  }

  async deleteTask(id: string) {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Doctors
  async getDoctors(params?: { search?: string; specialty?: string; location?: string }) {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.specialty) query.append('specialty', params.specialty);
    if (params?.location) query.append('location', params.location);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.request(`/doctors${queryString}`);
  }

  async getDoctor(id: string) {
    return this.request(`/doctors/${id}`);
  }

  // Appointments
  async getAppointments(params?: { status?: string; date?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.date) query.append('date', params.date);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.request(`/appointments${queryString}`);
  }

  async createAppointment(data: any) {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAppointment(id: string, data: any) {
    return this.request(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async cancelAppointment(id: string) {
    return this.request(`/appointments/${id}/cancel`, {
      method: 'PATCH',
    });
  }

  async deleteAppointment(id: string) {
    return this.request(`/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  // Reminders
  async getReminders() {
    return this.request('/reminders');
  }

  async createReminder(data: any) {
    return this.request('/reminders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async toggleReminder(id: string) {
    return this.request(`/reminders/${id}/toggle`, {
      method: 'PATCH',
    });
  }

  async deleteReminder(id: string) {
    return this.request(`/reminders/${id}`, {
      method: 'DELETE',
    });
  }

  // Milestones
  async getMilestones() {
    return this.request('/milestones');
  }

  async toggleMilestone(id: string) {
    return this.request(`/milestones/${id}/toggle`, {
      method: 'PATCH',
    });
  }

  // AI Chat
  async sendChatMessage(data: { message: string; sessionId?: string; currentWeek?: number }) {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getChatHistory() {
    return this.request('/chat/history');
  }

  async deleteChatSession(id: string) {
    return this.request(`/chat/sessions/${id}`, {
      method: 'DELETE',
    });
  }

  async askDoctor(data: { concern: string; currentWeek?: number }) {
    return this.request('/chat/ask-doctor', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Dashboard
  async getDashboard() {
    return this.request('/dashboard');
  }

  // Health check (independently calls /health, never part of API base URL)
  async checkHealth() {
    return this.request('/health');
  }
}

export const api = new ApiClient();
export default api;
