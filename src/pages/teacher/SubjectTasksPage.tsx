import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, Plus, Edit, Trash2, Eye, Calendar, Users, FileText } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuthStore } from '../../stores/authStore';

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  taskType: string;
  status: string;
  submissionsCount: number;
  totalStudents: number;
}

const SubjectTasksPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  const subjectId = searchParams.get('subject');
  const subjectName = searchParams.get('name');
  const grade = searchParams.get('grade');

  useEffect(() => {
    if (subjectId && grade) {
      loadTasks();
    } else {
      // Si no hay parámetros, mostrar vacío
      setLoading(false);
    }
  }, [subjectId, grade]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      
      console.log('📡 Cargando tareas para:', { subjectId, grade });
      
      // Timeout de 5 segundos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`/api/teacher/subjects/${subjectId}/tasks?grade=${encodeURIComponent(grade || '')}`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Tareas cargadas:', data);
        setTasks(Array.isArray(data) ? data : []);
      } else {
        const errorText = await response.text();
        console.error('❌ Error cargando tareas:', response.status, errorText);
        setTasks([]);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('⏱️ Timeout: El backend no respondió en 5 segundos');
        alert('⚠️ El backend no está respondiendo. Por favor, reinicia el servidor backend.');
      } else {
        console.error('❌ Error loading tasks:', error);
      }
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId: number) => {
    if (!confirm('¿Estás seguro de eliminar esta tarea? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await fetch(`/api/teacher/subjects/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });

      if (response.ok) {
        alert('✅ Tarea eliminada correctamente');
        loadTasks();
      } else {
        alert('❌ Error al eliminar la tarea');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('❌ Error de conexión');
    }
  };

  const getTaskTypeBadge = (type: string) => {
    if (type === 'INTERACTIVE') {
      return <Badge className="bg-purple-100 text-purple-800 border-purple-200">🎮 Interactiva</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800 border-blue-200">📝 Tradicional</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={`Tareas de ${subjectName || 'Materia'}`}
          description={`Grado: ${grade}`}
          icon={FileText}
        />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Tareas de ${subjectName || 'Materia'}`}
        description={`Grado: ${grade} • ${tasks.length} tarea${tasks.length !== 1 ? 's' : ''}`}
        icon={FileText}
        action={
          <div className="flex gap-2">
            <Button
              onClick={() => navigate('/profesor/materias')}
              variant="outline"
              className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <Button
              onClick={() => navigate(`/profesor/tareas?create=true&subject=${subjectId}&grade=${encodeURIComponent(grade || '')}`)}
              className="bg-primary hover:bg-primary-600 text-white flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nueva Tarea
            </Button>
          </div>
        }
      />

      {tasks.length === 0 ? (
        <Card className="border-secondary-200">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-secondary mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-neutral-black mb-2">
              No hay tareas creadas
            </h3>
            <p className="text-secondary mb-4">
              Crea la primera tarea para este grado y materia.
            </p>
            <Button
              onClick={() => navigate(`/profesor/tareas?create=true&subject=${subjectId}&grade=${encodeURIComponent(grade || '')}`)}
              className="bg-primary hover:bg-primary-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Tarea
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <Card key={task.id} className="border-secondary-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-neutral-black mb-2">
                      {task.title}
                    </CardTitle>
                    {getTaskTypeBadge(task.taskType)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {task.description}
                </p>

                {/* Información de la tarea */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Entrega: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{task.submissionsCount} de {task.totalStudents} entregas</span>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Progreso de entregas</span>
                    <span className="text-xs font-semibold text-primary">
                      {task.totalStudents > 0 ? Math.round((task.submissionsCount / task.totalStudents) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ 
                        width: `${task.totalStudents > 0 ? (task.submissionsCount / task.totalStudents) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 pt-2 border-t border-gray-200">
                  <Button
                    onClick={() => navigate(`/profesor/tareas/${task.id}/entregas`)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Ver Entregas
                  </Button>
                  <Button
                    onClick={() => navigate(`/profesor/tareas/${task.id}/editar`)}
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(task.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectTasksPage;
