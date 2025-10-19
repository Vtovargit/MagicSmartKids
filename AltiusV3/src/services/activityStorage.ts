// Sistema de almacenamiento local para actividades interactivas
import { Activity } from '../components/activities/ActivityEditor';

export interface Task {
  id: string;
  title: string;
  description: string;
  activities: Activity[];
  createdAt: string;
  subjectId?: string;
  teacherId?: string;
  institutionId?: string;
  isActive?: boolean;
}

export interface Result {
  id: string;
  taskId: string;
  studentName: string;
  answers: Record<number, any>;
  score: number;
  completedAt: string;
}

export interface ActivityProgress {
  taskId: string;
  activityIndex: number;
  completed: boolean;
  score: number;
  attempts: number;
}

class ActivityStorage {
  private readonly TASKS_KEY = 'altius_interactive_tasks';
  private readonly RESULTS_KEY = 'altius_interactive_results';
  private readonly PROGRESS_KEY = 'altius_activity_progress';

  // Gestión de Tareas
  getTasks(): Task[] {
    try {
      const tasks = localStorage.getItem(this.TASKS_KEY);
      return tasks ? JSON.parse(tasks) : this.getDefaultTasks();
    } catch (error) {
      console.error('Error loading tasks:', error);
      return this.getDefaultTasks();
    }
  }

  getTask(id: string): Task | null {
    const tasks = this.getTasks();
    return tasks.find(task => task.id === id) || null;
  }

  saveTask(task: Task): void {
    try {
      const tasks = this.getTasks();
      const existingIndex = tasks.findIndex(t => t.id === task.id);
      
      if (existingIndex >= 0) {
        tasks[existingIndex] = task;
      } else {
        tasks.push(task);
      }
      
      localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving task:', error);
    }
  }

  deleteTask(id: string): void {
    try {
      const tasks = this.getTasks();
      const filteredTasks = tasks.filter(task => task.id !== id);
      localStorage.setItem(this.TASKS_KEY, JSON.stringify(filteredTasks));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  // Gestión de Resultados
  getResults(): Result[] {
    try {
      const results = localStorage.getItem(this.RESULTS_KEY);
      return results ? JSON.parse(results) : [];
    } catch (error) {
      console.error('Error loading results:', error);
      return [];
    }
  }

  saveResult(result: Result): void {
    try {
      const results = this.getResults();
      results.push(result);
      localStorage.setItem(this.RESULTS_KEY, JSON.stringify(results));
    } catch (error) {
      console.error('Error saving result:', error);
    }
  }

  getResultsByTask(taskId: string): Result[] {
    return this.getResults().filter(result => result.taskId === taskId);
  }

  // Gestión de Progreso
  getProgress(): ActivityProgress[] {
    try {
      const progress = localStorage.getItem(this.PROGRESS_KEY);
      return progress ? JSON.parse(progress) : [];
    } catch (error) {
      console.error('Error loading progress:', error);
      return [];
    }
  }

  saveProgress(progress: ActivityProgress): void {
    try {
      const allProgress = this.getProgress();
      const existingIndex = allProgress.findIndex(
        p => p.taskId === progress.taskId && p.activityIndex === progress.activityIndex
      );
      
      if (existingIndex >= 0) {
        allProgress[existingIndex] = progress;
      } else {
        allProgress.push(progress);
      }
      
      localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(allProgress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  getTaskProgress(taskId: string): ActivityProgress[] {
    return this.getProgress().filter(p => p.taskId === taskId);
  }

  // Datos por defecto
  private getDefaultTasks(): Task[] {
    return [
      {
        id: 'demo-math',
        title: '🔢 Matemáticas Divertidas',
        description: 'Aprende matemáticas básicas con actividades interactivas',
        activities: [
          {
            type: 'multiple-choice',
            question: '¿Cuánto es 2 + 3?',
            options: ['4', '5', '6', '7'],
            correctAnswer: 1
          },
          {
            type: 'drag-drop',
            question: 'Ordena los números de menor a mayor',
            items: ['5', '2', '8', '1'],
            correctOrder: [3, 1, 0, 2]
          }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'demo-science',
        title: '🌱 Ciencias Naturales',
        description: 'Descubre el mundo natural a través de actividades',
        activities: [
          {
            type: 'match-lines',
            question: 'Conecta cada animal con su hábitat',
            leftItems: ['Pez', 'Pájaro', 'Oso'],
            rightItems: ['Bosque', 'Agua', 'Cielo'],
            correctMatches: [1, 2, 0]
          },
          {
            type: 'short-answer',
            question: '¿Cuál es el planeta más cercano al Sol?',
            correctAnswer: 'Mercurio'
          }
        ],
        createdAt: new Date().toISOString()
      }
    ];
  }

  // Utilidades
  clearAllData(): void {
    localStorage.removeItem(this.TASKS_KEY);
    localStorage.removeItem(this.RESULTS_KEY);
    localStorage.removeItem(this.PROGRESS_KEY);
  }

  exportData(): string {
    return JSON.stringify({
      tasks: this.getTasks(),
      results: this.getResults(),
      progress: this.getProgress()
    });
  }

  importData(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      if (parsed.tasks) localStorage.setItem(this.TASKS_KEY, JSON.stringify(parsed.tasks));
      if (parsed.results) localStorage.setItem(this.RESULTS_KEY, JSON.stringify(parsed.results));
      if (parsed.progress) localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(parsed.progress));
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

export const activityStorage = new ActivityStorage();