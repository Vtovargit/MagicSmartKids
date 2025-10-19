import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Eye } from 'lucide-react';
import { Task, Activity } from '../types';
import { storage } from '../storage';
import ActivityEditor from './ActivityEditor';

interface TeacherViewProps {
  onViewStudent: (taskId: string) => void;
}

export default function TeacherView({ onViewStudent }: TeacherViewProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    setTasks(storage.getTasks());
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
    storage.saveTask(task);
    loadTasks();
    setShowEditor(false);
    setEditingTask(null);
  };

  const deleteTask = (taskId: string) => {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      storage.deleteTask(taskId);
      loadTasks();
    }
  };

  if (showEditor && editingTask) {
    return (
      <TaskEditor
        task={editingTask}
        onSave={saveTask}
        onCancel={() => {
          setShowEditor(false);
          setEditingTask(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h1 className="text-5xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ✨ Portal del Maestro ✨
          </h1>
          <p className="text-center text-gray-600 text-lg">
            Crea actividades divertidas para tus estudiantes
          </p>
        </div>

        <button
          onClick={createNewTask}
          className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-6 px-8 rounded-3xl shadow-lg transform transition hover:scale-105 mb-8 flex items-center justify-center gap-3 text-xl"
        >
          <Plus size={32} />
          Crear Nueva Tarea
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map(task => (
            <div
              key={task.id}
              className="bg-white rounded-3xl shadow-lg p-6 transform transition hover:scale-105 hover:shadow-xl"
            >
              <h3 className="text-2xl font-bold text-purple-600 mb-2">
                {task.title}
              </h3>
              <p className="text-gray-600 mb-4">{task.description}</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {task.activities.length} actividades
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => editTask(task)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-2xl transition flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  Editar
                </button>
                <button
                  onClick={() => onViewStudent(task.id)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-2xl transition flex items-center justify-center gap-2"
                >
                  <Eye size={20} />
                  Vista Niño
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-2xl transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-400">
              No hay tareas aún. ¡Crea tu primera tarea!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface TaskEditorProps {
  task: Task;
  onSave: (task: Task) => void;
  onCancel: () => void;
}

function TaskEditor({ task, onSave, onCancel }: TaskEditorProps) {
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [showActivityEditor, setShowActivityEditor] = useState(false);
  const [editingActivityIndex, setEditingActivityIndex] = useState<number | null>(null);

  const updateTask = (updates: Partial<Task>) => {
    setEditedTask({ ...editedTask, ...updates });
  };

  const addActivity = (activity: Activity) => {
    if (editingActivityIndex !== null) {
      const newActivities = [...editedTask.activities];
      newActivities[editingActivityIndex] = activity;
      updateTask({ activities: newActivities });
      setEditingActivityIndex(null);
    } else {
      updateTask({ activities: [...editedTask.activities, activity] });
    }
    setShowActivityEditor(false);
  };

  const deleteActivity = (index: number) => {
    const newActivities = editedTask.activities.filter((_, i) => i !== index);
    updateTask({ activities: newActivities });
  };

  const editActivity = (index: number) => {
    setEditingActivityIndex(index);
    setShowActivityEditor(true);
  };

  if (showActivityEditor) {
    return (
      <ActivityEditor
        activity={editingActivityIndex !== null ? editedTask.activities[editingActivityIndex] : undefined}
        onSave={addActivity}
        onCancel={() => {
          setShowActivityEditor(false);
          setEditingActivityIndex(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-4xl font-bold text-purple-600 mb-6">
            Editar Tarea
          </h2>

          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) => updateTask({ title: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border-2 border-purple-300 focus:border-purple-500 focus:outline-none text-lg"
              placeholder="Escribe un título divertido..."
            />
          </div>

          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={editedTask.description}
              onChange={(e) => updateTask({ description: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border-2 border-purple-300 focus:border-purple-500 focus:outline-none text-lg"
              rows={3}
              placeholder="Describe la tarea..."
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-700">
                Actividades ({editedTask.activities.length})
              </h3>
              <button
                onClick={() => setShowActivityEditor(true)}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-2xl transition flex items-center gap-2"
              >
                <Plus size={20} />
                Agregar Actividad
              </button>
            </div>

            <div className="space-y-3">
              {editedTask.activities.map((activity, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-purple-600">
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
                    <button
                      onClick={() => editActivity(index)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteActivity(index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => onSave(editedTask)}
              className="flex-1 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transform transition hover:scale-105"
            >
              Guardar Tarea
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transform transition hover:scale-105"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
