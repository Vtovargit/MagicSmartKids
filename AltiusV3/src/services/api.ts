import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

// IMPORTANTE: Usar rutas relativas para que funcione el proxy de Vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Create axios instance for protected endpoints
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for public endpoints (no auth required)
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Lista de endpoints públicos que NO necesitan token
    const publicEndpoints = [
      '/auth/login',
      '/auth/register',
      '/school-grades/initialize',
      '/school-grades',
      '/student-validation/validate-student',
      '/institutions/validate-nit',
      '/institutions',
      '/health'
    ];

    // Verificar si el endpoint es público
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url?.includes(endpoint)
    );

    // Solo agregar token para endpoints protegidos
    if (!isPublicEndpoint) {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
    publicApi.post('/auth/login', { email, password }), // PUBLIC
  
  register: (userData: any) =>
    publicApi.post('/auth/register', userData), // PUBLIC
  
  refreshToken: () =>
    api.post('/auth/refresh'), // Protected
  
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/change-password', { currentPassword, newPassword }), // Protected
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

// Academic Grades endpoints (PUBLIC - no auth required)
export const academicGradesApi = {
  getAll: () => publicApi.get('/academic-grades'),
  initialize: () => publicApi.post('/academic-grades/initialize'),
  test: () => publicApi.get('/academic-grades/test'),
  health: () => publicApi.get('/academic-grades/health'),
  diagnostic: () => publicApi.get('/academic-grades/diagnostic'),
  assignToUsers: () => publicApi.post('/academic-grades/assign-to-users'),
  getById: (id: string) => api.get(`/academic-grades/${id}`), // Protected
};

// School Grades endpoints (PUBLIC - no auth required)
export const schoolGradesApi = {
  getAll: () => publicApi.get('/school-grades'),
  initialize: () => publicApi.post('/school-grades/initialize'),
  getById: (id: string) => api.get(`/school-grades/${id}`), // Protected
  create: (data: any) => api.post('/school-grades', data), // Protected
  update: (id: string, data: any) => api.put(`/school-grades/${id}`, data), // Protected
  delete: (id: string) => api.delete(`/school-grades/${id}`), // Protected
};

// Student Validation endpoints (PUBLIC - no auth required)
export const studentValidationApi = {
  validateStudent: (email: string) => publicApi.get(`/student-validation/validate-student?email=${encodeURIComponent(email)}`),
};

// Institution endpoints (PUBLIC - no auth required)
export const institutionApi = {
  getAll: () => publicApi.get('/institutions'),
  validateNit: (nit: string) => publicApi.get(`/institutions/validate-nit?nit=${encodeURIComponent(nit)}`),
  getById: (id: string) => api.get(`/institutions/${id}`), // Protected
  create: (data: any) => api.post('/institutions', data), // Protected
  update: (id: string, data: any) => api.put(`/institutions/${id}`, data), // Protected
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