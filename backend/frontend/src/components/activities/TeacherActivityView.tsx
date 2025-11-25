import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Eye } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Task, activityStorage } from '../../services/activityStorage';
import ActivityEditor, { Activity } from './ActivityEditor';

interface TeacherActivityViewProps {
  onViewStudent: (taskId: string) => void;
}

export default function TeacherActivityView({ onViewStudent }: TeacherActivityViewProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showActivityEditor, setShowActivityEditor] = useState(false);
  const [editingActivityIndex, setEditingActivityIndex] = useState<number | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    setTasks(activityStorage.getTasks());
  };

  const createNewTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: 'Nueva Tarea',
      description: '',
      activities: [],
      createdAt: new Date().toISOString()
    };
    setEditingTask(newTask);
    setShowEditor(true);
  };

  const editTask = (task: Task) => {
    setEditingTask(task);
    setShowEditor(true);
  };

  const saveTask = (task: Task) => {
    activityStorage.saveTask(task);
    loadTasks();
    setShowEditor(false);
    setEditingTask(null);
  };

  const deleteTask = (taskId: string) => {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      activityStorage.deleteTask(taskId);
      loadTasks();
    }
  };

  const addActivity = (activity: Activity) => {
    if (!editingTask) return;
    
    if (editingActivityIndex !== null) {
      const newActivities = [...editingTask.activities];
      newActivities[editingActivityIndex] = activity;
      setEditingTask({ ...editingTask, activities: newActivities });
      setEditingActivityIndex(null);
    } else {
      setEditingTask({ 
        ...editingTask, 
        activities: [...editingTask.activities, activity] 
      });
    }
    setShowActivityEditor(false);
  };

  const deleteActivity = (index: number) => {
    if (!editingTask) return;
    const newActivities = editingTask.activities.filter((_, i) => i !== index);
    setEditingTask({ ...editingTask, activities: newActivities });
  };

  const editActivity = (index: number) => {
    setEditingActivityIndex(index);
    setShowActivityEditor(true);
  };

  if (showActivityEditor && editingTask) {
    return (
      <ActivityEditor
        activity={editingActivityIndex !== null ? editingTask.activities[editingActivityIndex] : undefined}
        onSave={addActivity}
        onCancel={() => {
          setShowActivityEditor(false);
          setEditingActivityIndex(null);
        }}
      />
    );
  }

  if (showEditor && editingTask) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {editingTask.id === Date.now().toString() ? 'Crear Nueva Tarea' : 'Editar Tarea'}
            </h1>
            <p className="text-gray-600 mt-1">
              Configura tu tarea interactiva y agrega actividades
            </p>
          </div>
          <Button
            onClick={() => {
              setShowEditor(false);
              setEditingTask(null);
            }}
            variant="outline"
          >
            ← Volver
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información de la Tarea</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={editingTask.title}
                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none"
                placeholder="Escribe un título divertido..."
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={editingTask.description}
                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none"
                rows={3}
                placeholder="Describe la tarea..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-700">
                  Actividades ({editingTask.activities.length})
                </h3>
                <Button
                  onClick={() => setShowActivityEditor(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Agregar Actividad
                </Button>
              </div>

              <div className="space-y-3">
                {editingTask.activities.map((activity, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-blue-600">
                        Actividad {index + 1}:
                      </span>
                      <span className="ml-2 text-gray-700">
                        {activity.type === 'drag-drop' && '🎯 Arrastrar y Soltar'}
                        {activity.type === 'match-lines' && '🔗 Unir con Líneas'}
                        {activity.type === 'short-answer' && '✍️ Respuesta Corta'}
                        {activity.type === 'multiple-choice' && '✅ Opción Múltiple'}
                        {activity.type === 'video' && '🎥 Video'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => editActivity(index)}
                        size="sm"
                        variant="outline"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => deleteActivity(index)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => saveTask(editingTask)}
                className="flex-1"
              >
                Guardar Tarea
              </Button>
              <Button
                onClick={() => {
                  setShowEditor(false);
                  setEditingTask(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-black flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              ✨
            </div>
            Portal del Maestro
          </h1>
          <p className="text-sm sm:text-base text-secondary">
            Crea y gestiona actividades interactivas para tus estudiantes
          </p>
        </div>
      </div>

      {/* Create Task Button */}
      <Card className="border-primary-200 bg-primary-50/30">
        <CardContent className="p-4 sm:p-6">
          <Button
            onClick={createNewTask}
            className="w-full bg-primary hover:bg-primary-600 text-neutral-white border-0 flex items-center justify-center gap-2 py-3 sm:py-4"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">Crear Nueva Tarea</span>
          </Button>
        </CardContent>
      </Card>

      {/* Tasks Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl text-neutral-black">Mis Tareas Interactivas</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="p-4 bg-secondary-50 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 flex items-center justify-center">
                <Plus className="h-8 w-8 sm:h-10 sm:w-10 text-secondary" />
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-neutral-black mb-2">
                No hay tareas creadas
              </h3>
              <p className="text-sm sm:text-base text-secondary mb-4 max-w-md mx-auto">
                Crea tu primera tarea interactiva para comenzar
              </p>
              <Button 
                onClick={createNewTask}
                className="bg-primary hover:bg-primary-600 text-neutral-white border-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Tarea
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {tasks.map(task => (
                <Card key={task.id} className="border-secondary-200 hover:shadow-lg hover:border-primary-200 transition-all duration-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg text-neutral-black line-clamp-2">{task.title}</CardTitle>
                    <p className="text-xs sm:text-sm text-secondary line-clamp-2">{task.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-secondary">Actividades:</span>
                      <Badge variant="secondary" className="bg-secondary-100 text-secondary-700 border-secondary-200">
                        {task.activities.length}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={() => editTask(task)}
                        size="sm"
                        className="flex-1 bg-primary hover:bg-primary-600 text-neutral-white border-0 text-xs sm:text-sm"
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        onClick={() => onViewStudent(task.id)}
                        size="sm"
                        variant="outline"
                        className="flex-1 border-secondary-300 text-secondary hover:bg-secondary-50 text-xs sm:text-sm"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Probar
                      </Button>
                      <Button
                        onClick={() => deleteTask(task.id)}
                        size="sm"
                        variant="destructive"
                        className="sm:flex-none"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}