import { TaskDocument } from './tasksMongo';
import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Helper para obtener el token del store
const getToken = (): string | null => {
  const state = useAuthStore.getState();
  return state.token;
};

export interface TaskResponse extends TaskDocument {
  id: string; // MongoDB _id formatted as string
}

// Transform MongoDB document to API response format
function transformTask(task: TaskDocument): TaskResponse {
  const { _id, ...rest } = task;
  return {
    ...rest,
    id: _id?.toString() || '',
  };
}

export const tasksApi = {
  getStudentTasks: async (studentId: string): Promise<TaskResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/tasks/student/${studentId}`);
    if (!response.ok) {
      throw new Error('Error fetching tasks');
    }
    const tasks = await response.json();
    return tasks.map(transformTask);
  },

  submitTask: async (taskId: string, formData: FormData): Promise<void> => {
    const token = getToken();
    
    console.log('🔑 Token encontrado:', token ? `${token.substring(0, 20)}...` : 'NO HAY TOKEN');
    console.log('🔍 Estado de autenticación:', useAuthStore.getState().isAuthenticated);
    
    // Convertir FormData a JSON para el backend
    const submissionData = {
      submissionText: formData.get('submissionText') || 'Evidencia enviada por el estudiante',
      submissionFileUrl: '' // TODO: Implementar subida de archivos real
    };
    
    console.log('📤 Enviando submission a:', `${API_BASE_URL}/student/tasks/${taskId}/submit`);
    console.log('📦 Datos:', submissionData);
    
    const response = await fetch(`${API_BASE_URL}/student/tasks/${taskId}/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token || ''}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submissionData)
    });
    
    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', response.status, errorText);
      throw new Error(`Error submitting task: ${response.status}`);
    }
    
    console.log('✅ Tarea enviada exitosamente');
  },

  startInteractiveTask: async (taskId: string): Promise<void> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/start`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token || ''}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Error starting interactive task');
    }
  }
};