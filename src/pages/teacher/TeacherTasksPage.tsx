import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { FileText, Plus, Calendar, Users, RefreshCw, Edit, Trash2, Eye, CheckCircle, XCircle, Clock, Star, Trophy, BookOpen } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FileUpload from '../../components/ui/FileUpload';
import { activityStorage } from '../../services/activityStorage';
import ActivityEditor, { Activity } from '../../components/activities/ActivityEditor';

interface TeacherTask {
  id: number;
  titulo: string;
  descripcion?: string;
  materiaId?: number;
  materia?: string; // Nombre de la materia para mostrar
  grados?: string[];
  fechaEntrega?: string;
  tipo?: string;
  fechaCreacion?: string;
  submissions?: TaskSubmission[];
  archivosAdjuntos?: string[]; // URLs de archivos adjuntos
  activityConfig?: {
    type: string;
    questions: any[];
  };
}

interface TaskSubmission {
  studentId: string;
  studentName: string;
  submissionDate: string;
  score?: number;
  timeUsed?: number;
  files?: string[]; // Para tareas tradicionales
  comments?: string; // Comentarios del estudiante
  answers?: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
}

interface CreateTaskForm {
  titulo: string;
  descripcion: string;
  materiaId: number;
  grados: string[];
  fechaEntrega: string;
  tipo: string;
  actividadInteractivaId?: string;
  formatosPermitidos?: string[];
  comentario?: string;
  archivosAdjuntos: string[];
}

const TeacherTasksPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [tasks, setTasks] = useState<TeacherTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [availableGrades, setAvailableGrades] = useState<string[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<any[]>([]);
  const [interactiveLibrary, setInteractiveLibrary] = useState<any[]>([]); // Mantener para funcionalidad básica
  const [showActivityEditor, setShowActivityEditor] = useState(false);
  const [draftActivities, setDraftActivities] = useState<Activity[]>([]);
  const [editingDraft, setEditingDraft] = useState(false);
  // const [manageLibraryOpen, setManageLibraryOpen] = useState(false); // Ya no se usa
  const [editingLibraryId, setEditingLibraryId] = useState<string | null>(null);
  const [editingLibraryTask, setEditingLibraryTask] = useState<any | null>(null);
  const [selectedTaskSubmissions, setSelectedTaskSubmissions] = useState<TeacherTask | null>(null);
  const [filter, setFilter] = useState<'todos' | 'multimedia' | 'interactive' | 'pending' | 'completed'>('todos');
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<TeacherTask | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('');
  const [editingSubmissionId, setEditingSubmissionId] = useState<number | null>(null);
  const [editingScore, setEditingScore] = useState<number>(0);
  const [editingFeedback, setEditingFeedback] = useState<string>('');
  const [createForm, setCreateForm] = useState<CreateTaskForm>({
    titulo: '',
    descripcion: '',
    materiaId: 0,
    grados: [],
    fechaEntrega: '',
    tipo: 'traditional',
    actividadInteractivaId: undefined,
    formatosPermitidos: [],
    comentario: '',
    archivosAdjuntos: []
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { /* token, */ user } = useAuthStore();
  
  // Verificar si se debe abrir el formulario de creación automáticamente
  useEffect(() => {
    const shouldCreate = searchParams.get('create');
    const preSelectedSubject = searchParams.get('subject');
    const preSelectedGrade = searchParams.get('grade');
    
    if (shouldCreate === 'true') {
      setShowCreateForm(true);
      
      // Pre-seleccionar materia y grado si están en los parámetros
      if (preSelectedSubject || preSelectedGrade) {
        setCreateForm(prev => ({
          ...prev,
          materiaId: preSelectedSubject ? parseInt(preSelectedSubject) : 0,
          grados: preSelectedGrade ? [preSelectedGrade] : []
        }));
      }
    }
  }, [searchParams]);
  


  useEffect(() => {
    loadTasks();
    loadAvailableGrades();
    loadAvailableSubjects();
    // load interactive activities from local storage
    const lib = activityStorage.getTasks();
    console.log('📚 Biblioteca interactiva cargada:', lib);
    setInteractiveLibrary(lib);
  }, []);

  const handleAddDraftActivity = (activity: Activity) => {
    setDraftActivities(prev => [...prev, activity]);
    // keep editor open so teacher can add more
    setShowActivityEditor(true);
  };

  const handleSaveSingleActivity = (activity: Activity) => {
    // Save single activity immediately as before
    const id = `custom-${Date.now()}`;
    const title = activity.question || `Actividad ${new Date().toLocaleString()}`;
    const newTask = {
      id,
      title,
      description: activity.question || '',
      activities: [activity],
      createdAt: new Date().toISOString()
    } as any;

    try {
      activityStorage.saveTask(newTask);
      const updated = activityStorage.getTasks();
      setInteractiveLibrary(updated);
      setCreateForm({...createForm, actividadInteractivaId: id});
      setShowActivityEditor(false);
    } catch (err) {
      console.error('Error saving new activity:', err);
      alert('No se pudo guardar la actividad. Revisa la consola.');
    }
  };

  const handleSaveDraftAsLibrary = () => {
    if (draftActivities.length === 0) {
      alert('Agrega al menos una pregunta antes de guardar.');
      return;
    }

    const id = `custom-${Date.now()}`;
    const title = `Actividad ${new Date().toLocaleString()}`;
    const newTask = {
      id,
      title,
      description: draftActivities[0]?.question || title,
      activities: draftActivities,
      createdAt: new Date().toISOString()
    } as any;

    try {
      activityStorage.saveTask(newTask);
      const updated = activityStorage.getTasks();
      setInteractiveLibrary(updated);
      // select the newly created activity for the task
      setCreateForm({...createForm, actividadInteractivaId: id});
      // reset draft state
      setDraftActivities([]);
      setShowActivityEditor(false);
      setEditingDraft(false);
    } catch (err) {
      console.error('Error saving draft activities:', err);
      alert('No se pudo guardar la actividad. Revisa la consola.');
    }
  };

  const handleCancelDraft = () => {
    setDraftActivities([]);
    setShowActivityEditor(false);
    setEditingDraft(false);
  };

  // Funciones eliminadas - Ya no se usa gestión de biblioteca de actividades existentes

  // 🗑️ Eliminar tarea
  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?\n\n⚠️ Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setDeletingTaskId(taskId);
      
      // Simular procesamiento en el servidor
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Eliminar de la lista
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      // Actualizar almacenamiento
      const savedTasks = localStorage.getItem('altiusv3-teacher-tasks');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        const updatedTasks = parsedTasks.filter((task: any) => task.id !== taskId);
        localStorage.setItem('altiusv3-teacher-tasks', JSON.stringify(updatedTasks));
      }
      
      setDeletingTaskId(null);
      alert('✅ Tarea eliminada exitosamente');
    } catch (error) {
      console.error('Error eliminando tarea:', error);
      setDeletingTaskId(null);
      alert('❌ Error al eliminar la tarea. Inténtalo de nuevo.');
    }
  };

  // ✏️ Editar tarea
  const handleEditTask = (task: TeacherTask) => {
    console.log('📝 Editando tarea:', task);
    console.log('  - ID:', task.id);
    console.log('  - Título:', task.titulo);
    console.log('  - Materia ID:', task.materiaId);
    console.log('  - Materia Nombre:', task.materia);
    console.log('  - Grados:', task.grados);
    
    setEditingTask(task);
    setCreateForm({
      titulo: task.titulo,
      descripcion: task.descripcion || '',
      materiaId: task.materiaId || 0,
      grados: task.grados || [],
      fechaEntrega: task.fechaEntrega ? task.fechaEntrega.split('T')[0] : '',
      tipo: task.tipo || 'traditional',
      formatosPermitidos: [],
      comentario: '',
      archivosAdjuntos: []
    });
    
    console.log('📋 Formulario configurado con:', {
      materiaId: task.materiaId || 0,
      grados: task.grados || []
    });
    
    setShowEditForm(true);
    setShowCreateForm(false);
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingTask) return;
    
    try {
      const taskData = {
        title: createForm.titulo,
        description: createForm.descripcion,
        subjectId: createForm.materiaId || null,
        grades: createForm.grados,
        dueDate: createForm.fechaEntrega,
        taskType: createForm.tipo === 'interactive' ? 'INTERACTIVE' : 'MULTIMEDIA',
        priority: 'MEDIUM'
      };

      const { token } = useAuthStore.getState();
      if (!token) {
        alert('❌ No hay sesión activa');
        return;
      }

      const response = await fetch(`/api/teacher/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      });

      if (response.ok) {
        alert('✅ Tarea actualizada exitosamente!');
        await loadTasks();
        setShowEditForm(false);
        setEditingTask(null);
        setCreateForm({
          titulo: '',
          descripcion: '',
          materiaId: 0,
          grados: [],
          fechaEntrega: '',
          tipo: 'traditional',
          formatosPermitidos: [],
          comentario: '',
          archivosAdjuntos: []
        });
      } else {
        const error = await response.text();
        console.error('❌ Error actualizando tarea:', error);
        alert('❌ Error al actualizar la tarea. Verifica la consola.');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('❌ Error de conexión. Verifica tu conexión a internet.');
    }
  };

  // Función eliminada - Ya no se usa biblioteca de actividades existentes

  const loadAvailableSubjects = async () => {
    try {
      const { token } = useAuthStore.getState();
      console.log('📚 Cargando materias del profesor...');
      console.log('🔑 Token disponible:', token ? `${token.substring(0, 20)}...` : 'NO HAY TOKEN');
      
      if (!token) {
        console.error('❌ No hay token disponible');
        setAvailableSubjects([]);
        return;
      }
      
      const response = await fetch('/api/teacher/subjects', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Materias del profesor:', data);
        
        const subjects = data.subjects || [];
        console.log('📋 Total de combinaciones materia-grado:', subjects.length);
        subjects.forEach((s: any, i: number) => {
          console.log(`  ${i + 1}. ${s.name} - ${s.grade} (ID: ${s.id})`);
        });
        
        setAvailableSubjects(subjects);
      } else {
        console.warn('⚠️ Error obteniendo materias:', response.status);
        setAvailableSubjects([]);
      }
    } catch (error) {
      console.error('❌ Error loading subjects:', error);
      setAvailableSubjects([]);
    }
  };

  const loadAvailableGrades = async () => {
    try {
      const { token } = useAuthStore.getState();
      console.log('🎓 Cargando grados disponibles del profesor...');
      
      if (!token) {
        console.error('❌ No hay token disponible para cargar grados');
        return;
      }
      
      // Obtener grados asignados al profesor desde el backend
      const response = await fetch('/api/teacher/tasks/grades', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Grados del profesor:', data);
        
        // El backend puede devolver un array directamente o un objeto con la propiedad grades
        const grades = Array.isArray(data) ? data : (data.grades || []);
        setAvailableGrades(grades);
      } else {
        console.warn('⚠️ Error obteniendo grados, usando fallback');
        // Fallback con todos los grados
        const fallback = [
          'Preescolar A', 'Preescolar B', 'Preescolar C', 'Preescolar D',
          '1° A', '1° B', '1° C', '1° D',
          '2° A', '2° B', '2° C', '2° D',
          '3° A', '3° B', '3° C', '3° D',
          '4° A', '4° B', '4° C', '4° D',
          '5° A', '5° B', '5° C', '5° D'
        ];
        setAvailableGrades(fallback);
      }
      
      // if (response.ok) {
      //   const data = await response.json();
      //   console.log('📥 Response data:', data);
      //   // Backend returns { success: true, grades: [...] } but keep fallback
      //   if (data && Array.isArray(data)) {
      //     setAvailableGrades(data);
      //   } else if (data && data.success && Array.isArray(data.grades)) {
      //     setAvailableGrades(data.grades);
      //   } else {
      //     console.warn('❌ Respuesta inesperada al pedir grados, usando fallback');
      //     const fallback = [
      //       'Preescolar','1° A','1° B','1° C','2° A','2° B','2° C','3° A','3° B','3° C','4° A','4° B','4° C','5° A','5° B','5° C'
      //     ];
      //     setAvailableGrades(fallback);
      //   }
      // } else {
      //   console.error('❌ Error HTTP:', response.status);
      //   const fallback = [
      //     'Preescolar','1° A','1° B','1° C','2° A','2° B','2° C','3° A','3° B','3° C','4° A','4° B','4° C','5° A','5° B','5° C'
      //   ];
      //   setAvailableGrades(fallback);
      // }
    } catch (error) {
      console.error('❌ Error loading grades:', error);
      const fallback = [
        'Preescolar','1° A','1° B','1° C','2° A','2° B','2° C','3° A','3° B','3° C','4° A','4° B','4° C','5° A','5° B','5° C'
      ];
      setAvailableGrades(fallback);
    }
  };

  const loadTasks = async () => {
    try {
      const { token } = useAuthStore.getState();
      setLoading(true);
      
      if (!token) {
        console.error('❌ No hay token disponible para cargar tareas');
        setLoading(false);
        return;
      }
      
      // Cargar tareas desde el backend
      const response = await fetch('/api/teacher/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        try {
          const data = await response.json();
          console.log('✅ Respuesta del backend:', data);
          
          // El backend puede devolver un array directamente o un objeto con propiedad tasks
          let backendTasks = Array.isArray(data) ? data : (data.tasks || data.data || []);
          
          if (!Array.isArray(backendTasks)) {
            console.error('❌ No se pudo extraer array de tareas:', data);
            setTasks([]);
            setLoading(false);
            return;
          }
          
          console.log('📊 Total de tareas recibidas:', backendTasks.length);
          
          console.log('📊 Total de tareas recibidas:', backendTasks.length);
          
          // Convertir formato de MySQL al formato del frontend - CON ENTREGAS
          const convertedTasks: TeacherTask[] = backendTasks.map((task: any) => {
            // Convertir entregas del backend al formato del frontend
            const submissions: TaskSubmission[] = (task.submissions || []).map((sub: any) => {
              // Usar submissionFiles si está disponible, sino usar submissionFileUrl
              let files: string[] = [];
              if (sub.submissionFiles && Array.isArray(sub.submissionFiles)) {
                files = sub.submissionFiles;
              } else if (sub.submissionFileUrl) {
                files = [sub.submissionFileUrl];
              }
              
              return {
                studentId: sub.studentId?.toString() || '',
                studentName: sub.studentName || 'Estudiante',
                submissionDate: sub.submittedAt || '',
                score: sub.score,
                files: files,
                comments: sub.submissionText || '',
                answers: [] // TODO: Parsear respuestas de actividades interactivas si existen
              };
            });
            
            return {
              id: task.id,
              titulo: task.title || 'Sin título',
              descripcion: task.description || '',
              materiaId: task.subjectId || 0,
              materia: task.subjectName || 'Sin materia',
              grados: task.grade ? [task.grade] : [],
              fechaEntrega: task.dueDate || '',
              fechaCreacion: task.createdAt || '',
              tipo: task.taskType === 'INTERACTIVE' ? 'interactive' : 'traditional',
              archivosAdjuntos: [],
              submissions: submissions
            };
          });
          
          console.log(`✅ Total de tareas convertidas: ${convertedTasks.length}`);
          console.log('📋 Tareas con entregas:', convertedTasks.filter(t => t.submissions && t.submissions.length > 0).length);
          setTasks(convertedTasks);
          setLoading(false);
          return;
        } catch (error) {
          console.error('❌ Error procesando respuesta del backend:', error);
          setTasks([]);
          setLoading(false);
          return;
        }
      } else {
        console.error('❌ Error HTTP:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('❌ Respuesta de error:', errorText);
      }
      
      // Si falla, usar datos de demostración
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // 🎭 COMENTADO TEMPORALMENTE - Forzar datos nuevos para mostrar la tarea de animales
      // const savedTasks = localStorage.getItem('altiusv3-teacher-tasks');
      // if (savedTasks) {
      //   try {
      //     const parsedTasks = JSON.parse(savedTasks);
      //     setTasks(parsedTasks);
      //     setLoading(false);
      //     return;
      //   } catch (error) {
      //     console.warn('Error parsing saved teacher tasks, using default data');
      //   }
      // }
      
      // 📚 TAREAS EXACTAMENTE IGUALES A LAS DEL ESTUDIANTE - Vista del Profesor
      const fakeTasks: TeacherTask[] = [
        // TAREAS PENDIENTES (que ve el estudiante)
        {
          id: 1,
          titulo: 'Ejercicios de Sumas y Restas',
          descripcion: `Resolver los ejercicios de la página 45 del libro de matemáticas - Asignada por ${user?.firstName} ${user?.lastName}`,
          grados: ['5° A'],
          fechaEntrega: '2025-10-28',
          fechaCreacion: '2025-10-20T14:30:00Z',
          tipo: 'traditional',
          materia: 'Matemáticas',
          submissions: []
        },
        {
          id: 2,
          titulo: 'Lectura del Cuento "El Patito Feo"',
          descripcion: `Leer el cuento y hacer un dibujo de la parte que más te gustó - Creada por ${user?.firstName} ${user?.lastName}`,
          grados: ['5° A'],
          fechaEntrega: '2025-10-30',
          fechaCreacion: '2025-10-22T09:15:00Z',
          tipo: 'traditional',
          materia: 'Español',
          submissions: []
        },
        {
          id: 3,
          titulo: '🐾 Aventura en el Reino Animal',
          descripcion: `Descubre el fascinante mundo de los animales con preguntas divertidas y educativas - Creada por ${user?.firstName} ${user?.lastName}`,
          grados: ['5° A'],
          fechaEntrega: '2025-11-05',
          fechaCreacion: '2025-10-26T10:00:00Z',
          tipo: 'interactive',
          materia: 'Ciencias Naturales',
          activityConfig: {
            type: 'animal_adventure',
            questions: [
              {
                questionText: '🐱 ¿Qué sonido hace el gato?',
                type: 'short-answer',
                correctAnswer: 'Miau miau',
                explanation: '¡Correcto! Los gatos hacen "miau miau" 🐱',
                visual: '🐱'
              },
              {
                questionText: '🦁 ¿Cuál de estos animales es el rey de la selva?',
                type: 'multiple-choice',
                options: ['🐯 Tigre', '🦁 León', '🐻 Oso', '🐺 Lobo'],
                correctAnswer: '🦁 León',
                explanation: '¡Excelente! El león es conocido como el rey de la selva 🦁',
                visual: '🦁👑'
              },
              {
                questionText: '🐄 ¿Qué nos da la vaca?',
                type: 'multiple-choice',
                options: ['🥛 Leche', '🍯 Miel', '🥚 Huevos', '🧀 Solo queso'],
                correctAnswer: '🥛 Leche',
                explanation: '¡Perfecto! Las vacas nos dan leche fresca 🥛',
                visual: '🐄🥛'
              },
              {
                questionText: '🐠 ¿Dónde viven los peces?',
                type: 'multiple-choice',
                options: ['🌳 En los árboles', '🌊 En el agua', '🏠 En casas', '☁️ En las nubes'],
                correctAnswer: '🌊 En el agua',
                explanation: '¡Genial! Los peces viven en el agua 🌊',
                visual: '🐠🌊'
              },
              {
                questionText: '🐸 ¿Cómo se mueve la rana?',
                type: 'multiple-choice',
                options: ['🏃 Corriendo', '🦘 Saltando', '🚶 Caminando', '🏊 Nadando'],
                correctAnswer: '🦘 Saltando',
                explanation: '¡Muy bien! Las ranas se mueven saltando 🦘',
                visual: '🐸🦘'
              },
              {
                questionText: 'Une cada animal con su hogar',
                type: 'match-lines',
                leftItems: ['🐝 Abeja', '🐻 Oso', '🐧 Pingüino', '🦅 Águila'],
                rightItems: ['🏔️ Montañas', '🧊 Hielo', '🍯 Colmena', '🌲 Bosque'],
                correctMatches: [2, 3, 1, 0],
                explanation: '¡Fantástico! Cada animal tiene su hogar especial'
              },
              {
                questionText: '🦋 ¿Qué animal sale de una oruga?',
                type: 'short-answer',
                correctAnswer: 'Mariposa',
                explanation: '¡Increíble! De la oruga sale una hermosa mariposa 🦋',
                visual: '🐛➡️🦋'
              },
              {
                questionText: '🐘 ¿Cuál es el animal terrestre más grande?',
                type: 'multiple-choice',
                options: ['🦏 Rinoceronte', '🐘 Elefante', '🦒 Jirafa', '🐻 Oso'],
                correctAnswer: '🐘 Elefante',
                explanation: '¡Excelente! El elefante es el animal terrestre más grande 🐘',
                visual: '🐘📏'
              }
            ]
          },
          submissions: [
            {
              studentId: 'student-1',
              studentName: 'Estudiante Estudiante',
              submissionDate: new Date().toISOString(),
              score: 85,
              timeUsed: 240, // 4 minutos
              answers: [
                { question: '🐱 ¿Qué sonido hace el gato?', userAnswer: 'Miau miau', correctAnswer: 'Miau miau', isCorrect: true },
                { question: '🦁 ¿Cuál de estos animales es el rey de la selva?', userAnswer: '🦁 León', correctAnswer: '🦁 León', isCorrect: true },
                { question: '🐄 ¿Qué nos da la vaca?', userAnswer: '🥛 Leche', correctAnswer: '🥛 Leche', isCorrect: true },
                { question: '🐠 ¿Dónde viven los peces?', userAnswer: '🌊 En el agua', correctAnswer: '🌊 En el agua', isCorrect: true },
                { question: '🐸 ¿Cómo se mueve la rana?', userAnswer: '🏃 Corriendo', correctAnswer: '🦘 Saltando', isCorrect: false }
              ]
            }
          ]
        },
        {
          id: 4,
          titulo: '🧮 Aventura Matemática Interactiva',
          descripcion: `Resuelve problemas matemáticos divertidos con animaciones y efectos visuales - Creada por ${user?.firstName} ${user?.lastName}`,
          grados: ['5° A'],
          fechaEntrega: '2025-11-02',
          fechaCreacion: '2025-10-25T10:00:00Z',
          tipo: 'interactive',
          materia: 'Matemáticas',
          activityConfig: {
            type: 'math_adventure',
            questions: [
              {
                questionText: '🍎 María tiene 5 manzanas y compra 3 más. ¿Cuántas manzanas tiene en total?',
                type: 'multiple-choice',
                options: ['6', '7', '8', '9'],
                correctAnswer: '8',
                explanation: '¡Correcto! 5 + 3 = 8 manzanas 🍎',
                visual: '🍎🍎🍎🍎🍎 + 🍎🍎🍎 = 🍎🍎🍎🍎🍎🍎🍎🍎'
              },
              {
                questionText: '🚗 En el estacionamiento hay 10 carros, se van 4. ¿Cuántos carros quedan?',
                type: 'multiple-choice',
                options: ['5', '6', '7', '8'],
                correctAnswer: '6',
                explanation: '¡Excelente! 10 - 4 = 6 carros 🚗',
                visual: '🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗 - 🚗🚗🚗🚗 = 🚗🚗🚗🚗🚗🚗'
              },
              {
                questionText: '⭐ Si tienes 2 estrellas y encuentras 7 más, ¿cuántas estrellas tienes?',
                type: 'multiple-choice',
                options: ['8', '9', '10', '11'],
                correctAnswer: '9',
                explanation: '¡Fantástico! 2 + 7 = 9 estrellas ⭐',
                visual: '⭐⭐ + ⭐⭐⭐⭐⭐⭐⭐ = ⭐⭐⭐⭐⭐⭐⭐⭐⭐'
              },
              {
                questionText: '🎈 Ana tiene 15 globos y regala 8. ¿Cuántos globos le quedan?',
                type: 'multiple-choice',
                options: ['6', '7', '8', '9'],
                correctAnswer: '7',
                explanation: '¡Perfecto! 15 - 8 = 7 globos 🎈',
                visual: '🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈 - 🎈🎈🎈🎈🎈🎈🎈🎈 = 🎈🎈🎈🎈🎈🎈🎈'
              },
              {
                questionText: '🍪 En una caja hay 6 galletas, en otra hay 5. ¿Cuántas galletas hay en total?',
                type: 'multiple-choice',
                options: ['10', '11', '12', '13'],
                correctAnswer: '11',
                explanation: '¡Increíble! 6 + 5 = 11 galletas 🍪',
                visual: '🍪🍪🍪🍪🍪🍪 + 🍪🍪🍪🍪🍪 = 🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪'
              }
            ]
          },
          submissions: [
            {
              studentId: 'student-1',
              studentName: 'Estudiante Estudiante',
              submissionDate: new Date().toISOString(),
              score: 80,
              timeUsed: 180, // 3 minutos
              answers: [
                { question: '🍎 María tiene 5 manzanas y compra 3 más. ¿Cuántas manzanas tiene en total?', userAnswer: '8', correctAnswer: '8', isCorrect: true },
                { question: '🚗 En el estacionamiento hay 10 carros, se van 4. ¿Cuántos carros quedan?', userAnswer: '6', correctAnswer: '6', isCorrect: true },
                { question: '⭐ Si tienes 2 estrellas y encuentras 7 más, ¿cuántas estrellas tienes?', userAnswer: '8', correctAnswer: '9', isCorrect: false },
                { question: '🎈 Ana tiene 15 globos y regala 8. ¿Cuántos globos le quedan?', userAnswer: '7', correctAnswer: '7', isCorrect: true },
                { question: '🍪 En una caja hay 6 galletas, en otra hay 5. ¿Cuántas galletas hay en total?', userAnswer: '11', correctAnswer: '11', isCorrect: true }
              ]
            }
          ]
        },
        
        // TAREAS COMPLETADAS (que ve el estudiante como completadas)
        {
          id: 5,
          titulo: 'Dibujo de mi Familia',
          descripcion: `Dibujar a todos los miembros de tu familia - Asignada por ${user?.firstName} ${user?.lastName}`,
          grados: ['5° A'],
          fechaEntrega: '2025-10-20',
          fechaCreacion: '2025-10-15T14:30:00Z',
          tipo: 'traditional',
          materia: 'Sociales',
          submissions: [
            {
              studentId: 'student-1',
              studentName: 'Estudiante Estudiante',
              submissionDate: '2025-10-19T15:30:00Z',
              files: ['familia_dibujo.jpg'],
              comments: 'Dibujé a toda mi familia en el parque'
            }
          ]
        },
        {
          id: 6,
          titulo: 'Experimento con Plantas',
          descripcion: `Plantar una semilla y observar su crecimiento - Creada por ${user?.firstName} ${user?.lastName}`,
          grados: ['5° A'],
          fechaEntrega: '2025-10-18',
          fechaCreacion: '2025-10-10T09:00:00Z',
          tipo: 'traditional',
          materia: 'Ciencias Naturales',
          submissions: [
            {
              studentId: 'student-1',
              studentName: 'Estudiante Estudiante',
              submissionDate: '2025-10-17T16:45:00Z',
              files: ['planta_dia1.jpg', 'planta_dia7.jpg', 'planta_dia14.jpg'],
              comments: 'Mi planta creció mucho! Adjunto fotos del progreso'
            }
          ]
        },
        {
          id: 7,
          titulo: 'Tabla del 2',
          descripcion: `Memorizar y recitar la tabla de multiplicar del 2 - Asignada por ${user?.firstName} ${user?.lastName}`,
          grados: ['5° A'],
          fechaEntrega: '2025-10-15',
          fechaCreacion: '2025-10-08T11:00:00Z',
          tipo: 'traditional',
          materia: 'Matemáticas',
          submissions: [
            {
              studentId: 'student-1',
              studentName: 'Estudiante Estudiante',
              submissionDate: '2025-10-14T14:20:00Z',
              files: ['tabla_del_2.mp4'],
              comments: 'Video recitando la tabla del 2 completa'
            }
          ]
        }
      ];
      
      setTasks(fakeTasks);
      
      // 🎭 LIMPIAR Y GUARDAR DATOS NUEVOS - Para mostrar la tarea de animales
      localStorage.removeItem('altiusv3-teacher-tasks'); // Limpiar datos viejos
      localStorage.setItem('altiusv3-teacher-tasks', JSON.stringify(fakeTasks));
    } catch (error) {
      console.error('Error loading teacher tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Subir archivos si es tarea tradicional
      const uploadedFiles: string[] = [];
      if (createForm.tipo === 'traditional' && selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('folder', 'tasks');
          
          const uploadResponse = await fetch('/api/files/upload', {
            method: 'POST',
            body: formData
          });
          
          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            uploadedFiles.push(uploadData.filePath);
          } else {
            console.error('Error subiendo archivo:', file.name);
          }
        }
      }
      
      // Preparar configuración de actividad interactiva
      let activityConfig = null;
      
      // 🎯 CUESTIONARIOS: Si es interactiva, usar las preguntas del borrador o crear básicas
      if (createForm.tipo === 'interactive') {
        if (draftActivities.length > 0) {
          // Usar las preguntas creadas en el borrador
          const questionnaireActivity = {
            id: `questionnaire-${Date.now()}`,
            title: `Cuestionario: ${createForm.titulo}`,
            description: createForm.descripcion || createForm.titulo,
            activities: draftActivities,
            createdAt: new Date().toISOString()
          };
          
          // Guardar en biblioteca local
          activityStorage.saveTask(questionnaireActivity);
          setInteractiveLibrary(activityStorage.getTasks());
          
          // Limpiar borrador después de usar
          setDraftActivities([]);
        } else {
          // Crear cuestionario básico con múltiples preguntas de ejemplo
          const basicQuestionnaire = {
            id: `basic-questionnaire-${Date.now()}`,
            title: `Cuestionario: ${createForm.titulo}`,
            description: createForm.descripcion || createForm.titulo,
            activities: [
              {
                type: 'multiple-choice' as const,
                question: '¿Cuál es la respuesta correcta para esta pregunta de ejemplo?',
                options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
                correctAnswer: 0
              },
              {
                type: 'short-answer' as const,
                question: '¿Puedes escribir una respuesta corta de ejemplo?',
                correctAnswer: 'Respuesta de ejemplo'
              },
              {
                type: 'multiple-choice' as const,
                question: '¿Esta es otra pregunta de opción múltiple?',
                options: ['Sí', 'No', 'Tal vez', 'No estoy seguro'],
                correctAnswer: 0
              }
            ],
            createdAt: new Date().toISOString()
          };
          
          // Guardar en biblioteca local
          activityStorage.saveTask(basicQuestionnaire);
          setInteractiveLibrary(activityStorage.getTasks());
        }
      }

      // Crear tarea en el backend
      const taskData = {
        title: createForm.titulo,
        description: createForm.descripcion,
        subjectId: createForm.materiaId || null,
        grades: createForm.grados,
        dueDate: createForm.fechaEntrega,
        taskType: createForm.tipo === 'interactive' ? 'INTERACTIVE' : 'MULTIMEDIA',
        priority: 'MEDIUM',
        activityConfig: activityConfig ? JSON.stringify(activityConfig) : null,
        allowedFormats: createForm.formatosPermitidos || [],
        maxFiles: 3,
        maxSizeMb: 10,
        maxGrade: 5.0
      };

      const { token } = useAuthStore.getState();
      if (!token) {
        alert('❌ No hay sesión activa');
        return;
      }

      const response = await fetch('/api/teacher/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      });

      if (response.ok) {
        const createdTasks = await response.json();
        console.log('✅ Tareas creadas en MySQL:', createdTasks);
        
        // Recargar tareas desde el backend
        await loadTasks();
        
        setShowCreateForm(false);
        setCreateForm({
          titulo: '',
          descripcion: '',
          materiaId: 0,
          grados: [],
          fechaEntrega: '',
          tipo: 'traditional',
          formatosPermitidos: [],
          comentario: '',
          archivosAdjuntos: []
        });
        setSelectedFiles([]);
        setDraftActivities([]);
        
        const message = createForm.tipo === 'interactive'
          ? draftActivities.length > 0 
            ? `✅ Cuestionario creado con ${draftActivities.length} preguntas!`
            : '✅ Cuestionario creado con preguntas de ejemplo!'
          : '✅ Tarea creada exitosamente!';
        alert(message);
      } else {
        const error = await response.text();
        console.error('❌ Error creando tarea:', error);
        alert('❌ Error al crear la tarea. Verifica la consola.');
      }
      
      // CÓDIGO ORIGINAL COMENTADO:
      // const response = await fetch('/api/teacher/tasks', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token || ''}`
      //   },
      //   body: JSON.stringify({
      //     title: createForm.titulo,
      //     description: createForm.descripcion,
      //     grades: createForm.grados,
      //     dueDate: createForm.fechaEntrega,
      //     taskType: createForm.tipo === 'interactive' ? 'INTERACTIVE' : 'MULTIMEDIA',
      //     priority: 'MEDIUM',
      //     activityConfig: createForm.actividadInteractivaId || null,
      //     allowedFormats: createForm.formatosPermitidos || [],
      //     maxFiles: 3,
      //     maxSizeMb: 10,
      //     maxGrade: 5.0
      //   })
      // });
      
    } catch (error) {
      console.error('Error creating task:', error);
      alert('❌ Error de conexión. Verifica tu conexión a internet.');
    }
  };



  const getTaskTypeBadge = (tipo: string) => {
    return tipo === 'traditional' 
      ? <Badge variant="secondary" className="bg-blue-100 text-blue-800">📸 Evidencia</Badge>
      : <Badge variant="secondary" className="bg-purple-100 text-purple-800">🎮 Interactiva</Badge>;
  };

  const filteredTasks = tasks.filter(task => {
    // Filtro por tipo
    let matchesType = true;
    switch (filter) {
      case 'multimedia':
        matchesType = task.tipo === 'traditional';
        break;
      case 'interactive':
        matchesType = task.tipo === 'interactive';
        break;
      case 'pending':
        matchesType = !task.submissions || task.submissions.length === 0;
        break;
      case 'completed':
        matchesType = !!(task.submissions && task.submissions.length > 0);
        break;
    }
    
    // Filtro por grado
    const matchesGrade = !selectedGradeFilter || 
      (task.grados && task.grados.includes(selectedGradeFilter));
    
    return matchesType && matchesGrade;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Gestión de Tareas"
          description="Crea y administra tareas para tus estudiantes"
          icon={FileText}
        />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Tareas"
        description={`Gestiona las tareas de tus ${availableSubjects.length} materia${availableSubjects.length !== 1 ? 's' : ''}`}
        icon={FileText}
        action={
          <Button 
            onClick={() => {
              if (availableSubjects.length === 0) {
                alert('⚠️ No tienes materias asignadas. Contacta al coordinador.');
                return;
              }
              setShowCreateForm(true);
            }}
            className="bg-primary hover:bg-primary-600 text-white flex items-center gap-2 shadow-md"
          >
            <Plus className="h-4 w-4" />
            Nueva Tarea
          </Button>
        }
      />

      {/* Filtros Mejorados */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
            </div>
            <span className="text-sm text-gray-500">
              {filteredTasks.length} de {tasks.length} tareas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Filtro por tipo */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Tipo de tarea
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filter === 'todos' ? 'default' : 'outline'}
                  onClick={() => setFilter('todos')}
                  size="sm"
                  className={filter === 'todos' ? 'bg-primary text-white' : ''}
                >
                  Todas
                </Button>
                <Button
                  variant={filter === 'multimedia' ? 'default' : 'outline'}
                  onClick={() => setFilter('multimedia')}
                  size="sm"
                  className={filter === 'multimedia' ? 'bg-blue-600 text-white' : 'border-blue-300 text-blue-600 hover:bg-blue-50'}
                >
                  📸 Evidencias
                </Button>
                <Button
                  variant={filter === 'interactive' ? 'default' : 'outline'}
                  onClick={() => setFilter('interactive')}
                  size="sm"
                  className={filter === 'interactive' ? 'bg-purple-600 text-white' : 'border-purple-300 text-purple-600 hover:bg-purple-50'}
                >
                  🎮 Interactivas
                </Button>
                <Button
                  variant={filter === 'pending' ? 'default' : 'outline'}
                  onClick={() => setFilter('pending')}
                  size="sm"
                  className={filter === 'pending' ? 'bg-orange-600 text-white' : 'border-orange-300 text-orange-600 hover:bg-orange-50'}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Sin Entregas
                </Button>
                <Button
                  variant={filter === 'completed' ? 'default' : 'outline'}
                  onClick={() => setFilter('completed')}
                  size="sm"
                  className={filter === 'completed' ? 'bg-green-600 text-white' : 'border-green-300 text-green-600 hover:bg-green-50'}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Con Entregas
                </Button>
              </div>
            </div>

            {/* Filtro por grado */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Grado
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={!selectedGradeFilter ? 'default' : 'outline'}
                  onClick={() => setSelectedGradeFilter('')}
                  size="sm"
                  className={!selectedGradeFilter ? 'bg-primary text-white' : ''}
                >
                  Todos
                </Button>
                {Array.from(new Set(tasks.flatMap(t => t.grados || []))).sort().map(grade => (
                  <Button
                    key={grade}
                    variant={selectedGradeFilter === grade ? 'default' : 'outline'}
                    onClick={() => setSelectedGradeFilter(grade)}
                    size="sm"
                    className={selectedGradeFilter === grade ? 'bg-primary text-white' : 'border-gray-300 hover:bg-gray-50'}
                  >
                    {grade}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de creación */}
      {showCreateForm && (
        <Card className="border-primary-200 bg-primary-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Crear Nueva Tarea
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Título de la Tarea
                  </label>
                  <input
                    type="text"
                    value={createForm.titulo}
                    onChange={(e) => setCreateForm({...createForm, titulo: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Ej: Ejercicios de Álgebra"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Fecha de Entrega
                  </label>
                  <input
                    type="date"
                    value={createForm.fechaEntrega}
                    onChange={(e) => setCreateForm({...createForm, fechaEntrega: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-black mb-2">
                  Descripción
                </label>
                <textarea
                  value={createForm.descripcion}
                  onChange={(e) => setCreateForm({...createForm, descripcion: e.target.value})}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  rows={3}
                  placeholder="Describe la tarea y las instrucciones..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Materia y Grado
                  </label>
                  {availableSubjects.length === 0 ? (
                    <div className="w-full px-3 py-3 border border-orange-300 rounded-lg bg-orange-50 space-y-2">
                      <p className="text-sm text-orange-700 font-medium">
                        ⚠️ No tienes materias asignadas
                      </p>
                      <p className="text-xs text-orange-600">
                        Necesitas que el coordinador te asigne materias, o puedes inicializar materias de prueba para desarrollo.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          onClick={loadAvailableSubjects}
                          size="sm"
                          variant="outline"
                          className="border-orange-400 text-orange-700 hover:bg-orange-100"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Recargar
                        </Button>
                        <Button
                          type="button"
                          onClick={async () => {
                            try {
                              const { token } = useAuthStore.getState();
                              if (!token) {
                                alert('❌ No hay sesión activa');
                                return;
                              }

                              const response = await fetch('/api/teacher/init-test-subjects', {
                                method: 'POST',
                                headers: {
                                  'Authorization': `Bearer ${token}`,
                                  'Content-Type': 'application/json'
                                }
                              });
                              
                              if (response.ok) {
                                const data = await response.json();
                                alert(`✅ ${data.message || 'Materias inicializadas correctamente'}`);
                                await loadAvailableSubjects();
                              } else {
                                alert('❌ Error al inicializar materias');
                              }
                            } catch (error) {
                              console.error('Error:', error);
                              alert('❌ Error de conexión');
                            }
                          }}
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          🧪 Inicializar Materias de Prueba
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <select
                        value={createForm.materiaId && createForm.grados[0] ? `${createForm.materiaId}-${createForm.grados[0]}` : ''}
                        onChange={(e) => {
                          const [subjectIdStr, grade] = e.target.value.split('-');
                          const subjectId = parseInt(subjectIdStr);
                          const selectedSubject = availableSubjects.find(
                            s => s.id === subjectId && s.grade === grade
                          );
                          console.log('📝 Materia seleccionada:', selectedSubject);
                          setCreateForm({
                            ...createForm, 
                            materiaId: subjectId,
                            grados: selectedSubject ? [selectedSubject.grade] : []
                          });
                        }}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      >
                        <option value="">Seleccionar materia y grado</option>
                        {availableSubjects.map((subject, index) => (
                          <option key={`${subject.id}-${subject.grade}-${index}`} value={`${subject.id}-${subject.grade}`}>
                            {subject.name} - {subject.grade}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        {availableSubjects.length} materia{availableSubjects.length !== 1 ? 's' : ''} disponible{availableSubjects.length !== 1 ? 's' : ''}
                      </p>
                    </>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Tipo de Tarea
                  </label>
                  <select
                    value={createForm.tipo}
                    onChange={(e) => setCreateForm({...createForm, tipo: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="traditional">Tarea Tradicional</option>
                    <option value="interactive">Actividad Interactiva</option>
                  </select>
                </div>
              </div>

              {/* Opciones según tipo de tarea - CUESTIONARIOS INTERACTIVOS */}
              {createForm.tipo === 'interactive' ? (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-2xl">🎯</div>
                    <div>
                      <h3 className="font-semibold text-purple-800">Cuestionario Interactivo</h3>
                      <p className="text-sm text-purple-600">Crea un cuestionario con múltiples preguntas variadas</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-lg">📝</div>
                        <span className="font-medium text-purple-700">Configurar Preguntas</span>
                      </div>
                      <p className="text-sm text-purple-600 mb-3">
                        Agrega diferentes tipos de preguntas para crear un cuestionario completo
                      </p>
                      
                      {draftActivities.length > 0 && (
                        <div className="mb-3 p-2 bg-purple-50 rounded border">
                          <p className="text-sm font-medium text-purple-700">
                            ✅ {draftActivities.length} pregunta{draftActivities.length !== 1 ? 's' : ''} agregada{draftActivities.length !== 1 ? 's' : ''}
                          </p>
                          <ul className="text-xs text-purple-600 mt-1">
                            {draftActivities.slice(0, 3).map((activity, index) => (
                              <li key={index}>• {activity.question.substring(0, 50)}...</li>
                            ))}
                            {draftActivities.length > 3 && (
                              <li>• Y {draftActivities.length - 3} pregunta{draftActivities.length - 3 !== 1 ? 's' : ''} más...</li>
                            )}
                          </ul>
                        </div>
                      )}
                      
                      <Button
                        type="button"
                        onClick={() => { 
                          setEditingDraft(true); 
                          setShowActivityEditor(true); 
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        {draftActivities.length === 0 ? 'Crear Cuestionario' : 'Agregar Más Preguntas'}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-black mb-2">Formatos permitidos</label>
                      <div className="flex gap-2 flex-wrap">
                        {['pdf','docx','jpg','png'].map(fmt => (
                          <label key={fmt} className="inline-flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={(createForm.formatosPermitidos || []).includes(fmt)}
                              onChange={(e) => {
                                const set = new Set(createForm.formatosPermitidos || []);
                                if (e.target.checked) set.add(fmt); else set.delete(fmt);
                                setCreateForm({...createForm, formatosPermitidos: Array.from(set)});
                              }}
                            />
                            <span className="capitalize">{fmt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-black mb-2">Comentario (opcional)</label>
                      <input
                        type="text"
                        value={createForm.comentario}
                        onChange={(e) => setCreateForm({...createForm, comentario: e.target.value})}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Instrucciones o comentario para la entrega"
                      />
                    </div>
                  </div>

                  {/* Carga de archivos adjuntos */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">
                      Archivos adjuntos (opcional)
                    </label>
                    <FileUpload
                      onFilesChange={setSelectedFiles}
                      maxFiles={3}
                      maxSizeMB={10}
                      allowedFormats={(createForm.formatosPermitidos && createForm.formatosPermitidos.length > 0) ? createForm.formatosPermitidos : ['jpg', 'jpeg', 'png', 'pdf', 'docx']}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit"
                  className="bg-primary hover:bg-primary-600 text-neutral-white border-0"
                >
                  Crear Tarea
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="border-secondary-300 text-secondary hover:bg-secondary-50"
                >
                  Cancelar
                </Button>
              </div>
            </form>

            {showActivityEditor && (
              <div className="mt-4 space-y-4">
                <ActivityEditor
                  key={draftActivities.length + (editingLibraryId ? 100000 : 0)}
                  activity={editingLibraryTask ? editingLibraryTask.activities && editingLibraryTask.activities[0] : undefined}
                  onSave={(act) => {
                    if (editingLibraryId) {
                      // Save edited activity into existing library task
                      const task = activityStorage.getTask(editingLibraryId);
                      if (task) {
                        // Replace first activity by default
                        const updated = { ...task };
                        if (Array.isArray(updated.activities) && updated.activities.length > 0) {
                          updated.activities[0] = act;
                        } else {
                          updated.activities = [act];
                        }
                        updated.title = act.question || updated.title;
                        activityStorage.saveTask(updated);
                        setInteractiveLibrary(activityStorage.getTasks());
                        setEditingLibraryId(null);
                        setEditingLibraryTask(null);
                        setShowActivityEditor(false);
                        return;
                      }
                    }

                    if (editingDraft) {
                      handleAddDraftActivity(act);
                    } else {
                      handleSaveSingleActivity(act);
                    }
                  }}
                  onCancel={() => { setShowActivityEditor(false); setEditingDraft(false); setDraftActivities([]); setEditingLibraryId(null); setEditingLibraryTask(null); }}
                />

                {draftActivities.length > 0 && (
                  <div className="p-4 border rounded space-y-3">
                    <h3 className="font-semibold">Preguntas agregadas ({draftActivities.length})</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {draftActivities.map((d, i) => (
                        <li key={i} className="flex items-center justify-between">
                          <span>{d.question}</span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setDraftActivities(prev => prev.filter((_, idx) => idx !== i))}>Eliminar</Button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleSaveDraftAsLibrary} className="bg-primary text-neutral-white">Guardar actividad(s) en biblioteca</Button>
                      <Button variant="outline" onClick={handleCancelDraft}>Cancelar borrador</Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Panel de administración de biblioteca eliminado - Ya no se usa */}

          </CardContent>
        </Card>
      )}

      {/* Formulario de edición */}
      {showEditForm && editingTask && (
        <Card className="border-orange-200 bg-orange-50/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-orange-600" />
                Editar Tarea
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingTask(null);
                  setCreateForm({
                    titulo: '',
                    descripcion: '',
                    materiaId: 0,
                    grados: [],
                    fechaEntrega: '',
                    tipo: 'traditional',
                    formatosPermitidos: [],
                    comentario: '',
                    archivosAdjuntos: []
                  });
                }}
              >
                Cancelar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateTask} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Título de la Tarea
                  </label>
                  <input
                    type="text"
                    value={createForm.titulo}
                    onChange={(e) => setCreateForm({...createForm, titulo: e.target.value})}
                    className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Ej: Ejercicios de Álgebra"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Fecha de Entrega
                  </label>
                  <input
                    type="date"
                    value={createForm.fechaEntrega}
                    onChange={(e) => setCreateForm({...createForm, fechaEntrega: e.target.value})}
                    className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-black mb-2">
                  Descripción
                </label>
                <textarea
                  value={createForm.descripcion}
                  onChange={(e) => setCreateForm({...createForm, descripcion: e.target.value})}
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  rows={3}
                  placeholder="Describe la tarea y las instrucciones..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-black mb-2">
                  Materia y Grado
                </label>
                {availableSubjects.length === 0 ? (
                  <div className="w-full px-3 py-2 border border-orange-300 rounded-lg bg-orange-50">
                    <p className="text-sm text-orange-700">
                      ⚠️ No hay materias disponibles
                    </p>
                  </div>
                ) : (
                  <>
                    <select
                      value={createForm.materiaId && createForm.grados[0] ? `${createForm.materiaId}-${createForm.grados[0]}` : ''}
                      onChange={(e) => {
                        const [subjectIdStr, grade] = e.target.value.split('-');
                        const subjectId = parseInt(subjectIdStr);
                        const selectedSubject = availableSubjects.find(
                          s => s.id === subjectId && s.grade === grade
                        );
                        console.log('📝 Materia seleccionada para edición:', selectedSubject);
                        setCreateForm({
                          ...createForm, 
                          materiaId: subjectId,
                          grados: selectedSubject ? [selectedSubject.grade] : []
                        });
                      }}
                      className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    >
                      <option value="">Seleccionar materia y grado</option>
                      {availableSubjects.map((subject, index) => (
                        <option key={`${subject.id}-${subject.grade}-${index}`} value={`${subject.id}-${subject.grade}`}>
                          {subject.name} - {subject.grade}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-orange-600 mt-1">
                      Puedes cambiar la materia y el grado de esta tarea
                    </p>
                  </>
                )}
              </div>

              {/* Archivos adjuntos existentes */}
              {editingTask.archivosAdjuntos && editingTask.archivosAdjuntos.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">Archivos Adjuntos Actuales</h4>
                  </div>
                  <div className="space-y-2">
                    {editingTask.archivosAdjuntos.map((archivo, index) => {
                      const fileName = archivo.split('/').pop() || archivo;
                      const fileExtension = fileName.split('.').pop()?.toLowerCase();
                      const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension || '');
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded border border-blue-200">
                          <div className="flex items-center gap-3">
                            {isImage ? (
                              <div className="w-12 h-12 rounded overflow-hidden border border-gray-200">
                                <img 
                                  src={archivo} 
                                  alt={fileName}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                                <FileText className="h-6 w-6 text-gray-600" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{fileName}</p>
                              <p className="text-xs text-gray-500">{fileExtension?.toUpperCase()}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(archivo, '_blank')}
                              className="border-blue-300 text-blue-600 hover:bg-blue-50"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Ver
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                // Eliminar archivo de la lista
                                const nuevosArchivos = editingTask.archivosAdjuntos?.filter((_, i) => i !== index) || [];
                                setEditingTask({
                                  ...editingTask,
                                  archivosAdjuntos: nuevosArchivos
                                });
                              }}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Agregar nuevos archivos */}
              {editingTask.tipo === 'traditional' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Agregar Nuevos Archivos (opcional)
                  </label>
                  <FileUpload
                    onFilesChange={setSelectedFiles}
                    maxFiles={3}
                    maxSizeMB={10}
                    allowedFormats={['jpg', 'jpeg', 'png', 'pdf', 'docx']}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Los nuevos archivos se agregarán a los existentes
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-orange-200">
                <Button 
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white border-0"
                >
                  Guardar Cambios
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingTask(null);
                    setSelectedFiles([]);
                  }}
                  className="border-secondary-300 text-secondary hover:bg-secondary-50"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de tareas */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon="file"
          title="No hay tareas creadas"
          description="Crea tu primera tarea para comenzar a asignar trabajo a tus estudiantes."
          action={{
            label: "Crear Primera Tarea",
            onClick: () => setShowCreateForm(true),
            variant: "primary"
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTasks.map((task) => (
            <Card 
              key={task.id} 
              className="border-secondary-200 hover:shadow-lg transition-all duration-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg font-bold text-neutral-black">
                        {task.titulo}
                      </CardTitle>
                      {task.tipo && getTaskTypeBadge(task.tipo)}
                    </div>
                    {task.descripcion && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {task.descripcion}
                      </p>
                    )}
                  </div>
                </div>

                {/* Información principal en badges */}
                <div className="flex flex-wrap gap-2">
                  {(task as any).materia && (
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {(task as any).materia}
                    </Badge>
                  )}
                  {task.grados && task.grados.length > 0 && (
                    <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                      <Users className="h-3 w-3 mr-1" />
                      {task.grados.join(', ')}
                    </Badge>
                  )}
                  {task.fechaEntrega && (
                    <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(task.fechaEntrega).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* Estadísticas de entregas */}
                {task.submissions && task.submissions.length > 0 ? (
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        <span className="text-sm text-blue-900 font-semibold">
                          {task.submissions.length} estudiante{task.submissions.length !== 1 ? 's' : ''} entregó
                        </span>
                      </div>
                      {task.tipo === 'interactive' && task.submissions[0]?.score !== undefined && (
                        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded">
                          <Trophy className="h-4 w-4 text-orange-500" />
                          <span className="text-sm font-bold text-blue-900">
                            {Math.round(task.submissions.reduce((acc, sub) => acc + (sub.score || 0), 0) / task.submissions.length)}%
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Lista de estudiantes que entregaron */}
                    <div className="flex flex-wrap gap-1">
                      {task.submissions.slice(0, 3).map((sub, idx) => (
                        <span key={idx} className="text-xs bg-white text-blue-700 px-2 py-1 rounded border border-blue-200">
                          {sub.studentName}
                        </span>
                      ))}
                      {task.submissions.length > 3 && (
                        <span className="text-xs bg-white text-blue-700 px-2 py-1 rounded border border-blue-200">
                          +{task.submissions.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Sin entregas aún
                      </span>
                    </div>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex gap-2 pt-2 border-t border-gray-200">
                  {task.submissions && task.submissions.length > 0 ? (
                    <Button 
                      onClick={() => setSelectedTaskSubmissions(task)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center justify-center gap-2 font-medium"
                    >
                      <Eye className="h-4 w-4" />
                      Ver Entregas
                    </Button>
                  ) : (
                    <Button 
                      variant="outline"
                      size="sm"
                      disabled
                      className="flex-1 border-gray-300 text-gray-400 flex items-center justify-center gap-2"
                    >
                      <Clock className="h-4 w-4" />
                      Sin entregas
                    </Button>
                  )}
                  <Button 
                    onClick={() => handleEditTask(task)}
                    variant="outline"
                    size="sm"
                    className="border-orange-300 text-orange-600 hover:bg-orange-50 flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => handleDeleteTask(task.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-2"
                    disabled={deletingTaskId === task.id}
                  >
                    {deletingTaskId === task.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de entregas */}
      {selectedTaskSubmissions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  📊 Entregas: {selectedTaskSubmissions.titulo}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTaskSubmissions(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {selectedTaskSubmissions.submissions?.map((submission, index) => (
                <div key={index} className="border rounded-lg p-6 space-y-4">
                  {/* Header del estudiante */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{submission.studentName}</h3>
                      <p className="text-sm text-gray-600">
                        Entregado: {new Date(submission.submissionDate).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Estadísticas rápidas (solo para actividades interactivas) */}
                  {submission.answers && submission.answers.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                          <span className="font-bold text-blue-800">
                            {submission.answers.filter(a => a.isCorrect).length}
                          </span>
                        </div>
                        <div className="text-sm text-blue-600">Correctas</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <XCircle className="w-5 h-5 text-red-600" />
                          <span className="font-bold text-red-800">
                            {submission.answers.filter(a => !a.isCorrect).length}
                          </span>
                        </div>
                        <div className="text-sm text-red-600">Incorrectas</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <span className="font-bold text-blue-800">
                            {submission.answers.length}
                          </span>
                        </div>
                        <div className="text-sm text-blue-600">Total</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Resumen para tareas tradicionales */}
                  {(!submission.answers || submission.answers.length === 0) && submission.files && submission.files.length > 0 && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="font-semibold text-blue-800">Tarea Tradicional</p>
                          <p className="text-sm text-blue-600">
                            {submission.files.length} archivo{submission.files.length !== 1 ? 's' : ''} entregado{submission.files.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Archivos subidos (tareas tradicionales) */}
                  {submission.files && submission.files.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Archivos Entregados ({submission.files.length}):
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {submission.files.map((file, fileIndex) => {
                          const fileName = file.split('/').pop() || file;
                          const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
                          const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);
                          const isPdf = fileExtension === 'pdf';
                          const isDoc = ['doc', 'docx'].includes(fileExtension);
                          
                          return (
                            <div 
                              key={fileIndex}
                              className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                  isImage ? 'bg-blue-100' : 
                                  isPdf ? 'bg-red-100' : 
                                  isDoc ? 'bg-blue-100' : 'bg-gray-100'
                                }`}>
                                  {isImage ? (
                                    <span className="text-2xl">🖼️</span>
                                  ) : isPdf ? (
                                    <span className="text-2xl">📄</span>
                                  ) : isDoc ? (
                                    <span className="text-2xl">📝</span>
                                  ) : (
                                    <FileText className="w-6 h-6 text-gray-600" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate" title={fileName}>
                                    {fileName}
                                  </p>
                                  <p className="text-xs text-gray-500 uppercase">
                                    {fileExtension}
                                  </p>
                                </div>
                                <a
                                  href={`http://localhost:8090/api/files/download/${file}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-600 text-sm"
                                >
                                  Ver
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Comentarios del estudiante o resultados del quiz */}
                  {(submission.comments || (submission as any).feedback) && (() => {
                    // Intentar parsear como JSON para quiz interactivos
                    const dataToparse = submission.comments || (submission as any).feedback;
                    try {
                      const quizData = JSON.parse(dataToparse);
                      if (quizData.answers && Array.isArray(quizData.answers)) {
                        // Es un quiz interactivo - mostrar resultados bonitos
                        const correctCount = quizData.answers.filter((a: any) => a.isCorrect === 1 || a.isCorrect === true).length;
                        const incorrectCount = quizData.answers.length - correctCount;
                        
                        return (
                          <div className="space-y-4">
                            {/* Estadísticas del quiz */}
                            <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                  <span className="font-bold text-2xl text-green-700">{correctCount}</span>
                                </div>
                                <div className="text-sm text-green-600 font-medium">Correctas</div>
                              </div>
                              
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                  <XCircle className="w-5 h-5 text-red-600" />
                                  <span className="font-bold text-2xl text-red-700">{incorrectCount}</span>
                                </div>
                                <div className="text-sm text-red-600 font-medium">Incorrectas</div>
                              </div>
                              
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                  <FileText className="w-5 h-5 text-blue-600" />
                                  <span className="font-bold text-2xl text-blue-700">{quizData.answers.length}</span>
                                </div>
                                <div className="text-sm text-blue-600 font-medium">Total</div>
                              </div>
                            </div>

                            {/* Tiempo usado */}
                            {quizData.timeSpent && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">Tiempo: <strong>{quizData.timeSpent}</strong></span>
                              </div>
                            )}

                            {/* Detalle de respuestas */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-lg">Detalle de Respuestas:</h4>
                              {quizData.answers.slice(0, 5).map((answer: any, idx: number) => {
                                const isCorrect = answer.isCorrect === 1 || answer.isCorrect === true;
                                return (
                                  <div 
                                    key={idx}
                                    className={`p-4 rounded-lg border-2 ${
                                      isCorrect 
                                        ? 'bg-green-50 border-green-300' 
                                        : 'bg-red-50 border-red-300'
                                    }`}
                                  >
                                    <div className="flex items-start gap-3">
                                      {isCorrect ? (
                                        <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                                      ) : (
                                        <XCircle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                                      )}
                                      <div className="flex-1">
                                        <p className="font-semibold text-gray-800 mb-2">{answer.question}</p>
                                        <div className="space-y-1">
                                          <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                            <strong>Respuesta del estudiante:</strong> {answer.studentAnswer}
                                          </p>
                                          {!isCorrect && (
                                            <p className="text-sm text-green-700">
                                              <strong>✓ Respuesta correcta:</strong> {answer.correctAnswer}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }
                    } catch (e) {
                      // No es JSON o no tiene el formato esperado - mostrar como texto normal
                    }
                    
                    // Mostrar como comentario normal
                    return (
                      <div className="space-y-2">
                        <h4 className="font-semibold">Comentarios:</h4>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-700 whitespace-pre-wrap">{dataToparse}</p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Detalle de respuestas (actividades interactivas) */}
                  {submission.answers && submission.answers.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold">Detalle de Respuestas:</h4>
                      {submission.answers.map((answer, answerIndex) => (
                        <div 
                          key={answerIndex} 
                          className={`p-4 rounded-lg border ${
                            answer.isCorrect ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {answer.isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium mb-2">{answer.question}</p>
                              <div className="space-y-1">
                                <p className={`text-sm ${answer.isCorrect ? 'text-blue-700' : 'text-red-700'}`}>
                                  <strong>Respuesta del estudiante:</strong> {answer.userAnswer}
                                </p>
                                {!answer.isCorrect && (
                                  <p className="text-sm text-blue-700">
                                    <strong>Respuesta correcta:</strong> {answer.correctAnswer}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Sección de Calificación */}
                  <div className="mt-6 pt-6 border-t-2 border-gray-200">
                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Calificación del Profesor
                    </h4>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 space-y-4">
                      {/* Modo edición */}
                      {editingSubmissionId === (submission as any).id ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nota (0.0 - 5.0)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="5"
                              step="0.1"
                              value={editingScore}
                              onChange={(e) => setEditingScore(parseFloat(e.target.value))}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Retroalimentación
                            </label>
                            <textarea
                              value={editingFeedback}
                              onChange={(e) => setEditingFeedback(e.target.value)}
                              rows={3}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                              placeholder="Escribe tu retroalimentación aquí..."
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={async () => {
                                try {
                                  // Validar nota
                                  if (editingScore < 0 || editingScore > 5) {
                                    alert('La nota debe estar entre 0.0 y 5.0');
                                    return;
                                  }

                                  // Actualizar en la base de datos
                                  const response = await fetch(`/api/teacher/submissions/${(submission as any).id}/grade`, {
                                    method: 'PUT',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                      score: editingScore,
                                      feedback: editingFeedback
                                    })
                                  });

                                  if (response.ok) {
                                    alert('✅ Nota actualizada correctamente');
                                    // Actualizar en el estado local
                                    if (selectedTaskSubmissions) {
                                      const updatedSubmissions = selectedTaskSubmissions.submissions?.map(sub => 
                                        (sub as any).id === (submission as any).id 
                                          ? { ...sub, score: editingScore, feedback: editingFeedback }
                                          : sub
                                      );
                                      setSelectedTaskSubmissions({
                                        ...selectedTaskSubmissions,
                                        submissions: updatedSubmissions
                                      });
                                    }
                                    setEditingSubmissionId(null);
                                  } else {
                                    alert('❌ Error al actualizar la nota');
                                  }
                                } catch (error) {
                                  console.error('Error:', error);
                                  alert('❌ Error de conexión');
                                }
                              }}
                              className="bg-primary hover:bg-primary-600 text-white"
                            >
                              Guardar Cambios
                            </Button>
                            <Button
                              onClick={() => setEditingSubmissionId(null)}
                              variant="outline"
                              className="border-gray-300 text-gray-600 hover:bg-gray-50"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        /* Modo visualización */
                        (submission as any).score !== undefined && (submission as any).score !== null ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Nota asignada:</p>
                                <div className="flex items-center gap-3">
                                  <span className={`text-4xl font-bold ${
                                    (submission as any).score >= 4.5 ? 'text-green-600' : 
                                    (submission as any).score >= 4.0 ? 'text-blue-600' : 
                                    (submission as any).score >= 3.0 ? 'text-orange-600' : 'text-red-600'
                                  }`}>
                                    {(submission as any).score}
                                  </span>
                                  <span className="text-gray-500">/ 5.0</span>
                                </div>
                              </div>
                              <Button
                                onClick={() => {
                                  setEditingSubmissionId((submission as any).id);
                                  setEditingScore((submission as any).score || 0);
                                  setEditingFeedback((submission as any).feedback || '');
                                }}
                                variant="outline"
                                size="sm"
                                className="border-blue-300 text-blue-600 hover:bg-blue-50"
                              >
                                Editar Nota
                              </Button>
                            </div>
                            
                            {/* Feedback del profesor */}
                            {(submission as any).feedback && (submission as any).feedback !== 'null' && (
                              <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">Retroalimentación:</p>
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                  <p className="text-gray-700">{(submission as any).feedback}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-gray-600 mb-4">Esta entrega aún no ha sido calificada</p>
                            <Button 
                              onClick={() => {
                                setEditingSubmissionId((submission as any).id);
                                setEditingScore(3.0);
                                setEditingFeedback('');
                              }}
                              className="bg-primary hover:bg-primary-600 text-white"
                            >
                              Calificar Ahora
                            </Button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {selectedTaskSubmissions.submissions?.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-600">No hay entregas para esta tarea</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TeacherTasksPage;