import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8090/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (userData: any) =>
    api.post('/auth/register', userData),
  
  refreshToken: () =>
    api.post('/auth/refresh'),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/change-password', { currentPassword, newPassword }),
};

// Users endpoints
export const usersApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  getUsersByRole: (role: string) => api.get(`/users/role/${role}`),
  activateUser: (userId: string) => api.put(`/users/${userId}/activate`),
  deactivateUser: (userId: string) => api.put(`/users/${userId}/deactivate`),
};

// Subjects endpoints
export const subjectsApi = {
  getAll: () => api.get('/materias'),
  getById: (id: string) => api.get(`/materias/${id}`),
  create: (data: any) => api.post('/materias', data),
  update: (id: string, data: any) => api.put(`/materias/${id}`, data),
  delete: (id: string) => api.delete(`/materias/${id}`),
  getByTeacher: (teacherId: string) => api.get(`/materias/teacher/${teacherId}`),
};

// Assignments endpoints
export const assignmentsApi = {
  getAll: () => api.get('/tareas'),
  getById: (id: string) => api.get(`/tareas/${id}`),
  create: (data: any) => api.post('/tareas', data),
  update: (id: string, data: any) => api.put(`/tareas/${id}`, data),
  delete: (id: string) => api.delete(`/tareas/${id}`),
  getBySubject: (subjectId: string) => api.get(`/tareas/subject/${subjectId}`),
  getByStudent: (studentId: string) => api.get(`/tareas/student/${studentId}`),
  submit: (assignmentId: string, data: any) => api.post(`/tareas/${assignmentId}/submit`, data),
  grade: (submissionId: string, grade: number, feedback?: string) =>
    api.put(`/tareas/submissions/${submissionId}/grade`, { grade, feedback }),
};

// Grades endpoints
export const gradesApi = {
  getByStudent: (studentId: string) => api.get(`/notas/student/${studentId}`),
  getBySubject: (subjectId: string) => api.get(`/notas/subject/${subjectId}`),
  getAverageByPeriod: (studentId: string, period: string) =>
    api.get(`/notas/student/${studentId}/period/${period}/average`),
  getComparative: (studentId: string) => api.get(`/notas/student/${studentId}/comparative`),
};

// Files endpoints
export const filesApi = {
  upload: (file: FormData) => 
    api.post('/archivos/upload', file, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  download: (fileId: string) => api.get(`/archivos/${fileId}`),
  delete: (fileId: string) => api.delete(`/archivos/${fileId}`),
};

// Activities endpoints
export const activitiesApi = {
  getAll: () => api.get('/actividades'),
  getById: (id: string) => api.get(`/actividades/${id}`),
  create: (data: any) => api.post('/actividades', data),
  solve: (activityId: string, answers: any) => 
    api.post(`/actividades/${activityId}/solve`, { answers }),
};

// Reports endpoints
export const reportsApi = {
  getStudentsByGrade: () => api.get('/reportes/students-by-grade'),
  getAveragesBySubject: () => api.get('/reportes/averages-by-subject'),
  getTeacherStats: () => api.get('/reportes/teacher-stats'),
  getInstitutionStats: (institutionId: string) => 
    api.get(`/reportes/institution/${institutionId}`),
  getGlobalStats: () => api.get('/reportes/global'),
  exportReport: (type: string, params: any) => 
    api.post(`/reportes/export/${type}`, params, { responseType: 'blob' }),
};

// Calendar endpoints
export const calendarApi = {
  getEvents: (startDate: string, endDate: string) =>
    api.get(`/calendario/events?start=${startDate}&end=${endDate}`),
  createEvent: (data: any) => api.post('/calendario/events', data),
  updateEvent: (id: string, data: any) => api.put(`/calendario/events/${id}`, data),
  deleteEvent: (id: string) => api.delete(`/calendario/events/${id}`),
};

export default api;