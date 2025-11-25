import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { 
  Play, 
  Settings,
  Trophy,
  BookOpen,
  Plus,
  CheckCircle,
  Users,
  Target,
  Zap
} from 'lucide-react';
import TeacherActivityView from '../components/activities/TeacherActivityView';
import StudentActivityView from '../components/activities/StudentActivityView';
import { activityStorage } from '../services/activityStorage';

type ViewMode = 'main' | 'teacher' | 'student';

const InteractiveActivities: React.FC = () => {
  const { user } = useAuthStore();
  const [viewMode, setViewMode] = useState<ViewMode>('main');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const isTeacher = user?.role === 'teacher' || user?.role === 'coordinator' || user?.role === 'admin';
  const isStudent = user?.role === 'student';
  const tasks = activityStorage.getTasks();
  const results = activityStorage.getResults();

  const handleViewStudent = (taskId: string) => {
    setSelectedTaskId(taskId);
    setViewMode('student');
  };

  const handleBackToMain = () => {
    setViewMode('main');
    setSelectedTaskId(null);
  };

  if (viewMode === 'teacher') {
    return <TeacherActivityView onViewStudent={handleViewStudent} />;
  }

  if (viewMode === 'student' && selectedTaskId) {
    return <StudentActivityView taskId={selectedTaskId} onBack={handleBackToMain} />;
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-black flex items-center gap-2">
            <Target className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            {isStudent ? 'Actividades Interactivas' : 'Gestión de Actividades'}
          </h1>
          <p className="text-sm sm:text-base text-secondary">
            {isStudent 
              ? 'Completa actividades interactivas y mejora tu aprendizaje'
              : 'Crea y gestiona actividades interactivas para tus estudiantes'
            }
          </p>
        </div>
        {isTeacher && (
          <Button 
            onClick={() => setViewMode('teacher')}
            className="bg-primary hover:bg-primary-600 text-neutral-white border-0 flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Portal del Maestro</span>
            <span className="sm:hidden">Crear</span>
          </Button>
        )}
      </div>

      {/* Statistics */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-accent-yellow/10 rounded-lg">
                  <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-accent-yellow" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-neutral-black">{results.length}</p>
                  <p className="text-sm sm:text-base text-secondary">Actividades Completadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-accent-green/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-accent-green" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-neutral-black">
                    {Math.round(results.reduce((acc, r) => acc + (r.score / Object.keys(r.answers).length || 0), 0) / results.length * 100) || 0}%
                  </p>
                  <p className="text-sm sm:text-base text-secondary">Promedio de Aciertos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200 sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-neutral-black">{new Set(results.map(r => r.studentName)).size}</p>
                  <p className="text-sm sm:text-base text-secondary">Estudiantes Participantes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Available Tasks */}
      <Card className="border-secondary-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>Actividades Disponibles</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="p-4 bg-secondary-50 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-secondary" />
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-neutral-black mb-2">
                No hay actividades disponibles
              </h3>
              <p className="text-sm sm:text-base text-secondary mb-4 max-w-md mx-auto">
                {isTeacher 
                  ? 'Crea tu primera actividad interactiva para comenzar'
                  : 'Espera a que tus maestros creen actividades para ti'
                }
              </p>
              {isTeacher && (
                <Button 
                  onClick={() => setViewMode('teacher')}
                  className="bg-primary hover:bg-primary-600 text-neutral-white border-0"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Actividad
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {tasks.map((task) => {
                const taskResults = results.filter(r => r.taskId === task.id);
                const averageScore = taskResults.length > 0 
                  ? Math.round(taskResults.reduce((acc, r) => acc + (r.score / task.activities.length), 0) / taskResults.length * 100)
                  : 0;

                return (
                  <Card key={task.id} className="border-secondary-200 hover:shadow-lg hover:border-primary-200 transition-all duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base sm:text-lg text-neutral-black line-clamp-2">{task.title}</CardTitle>
                        <Badge className="bg-secondary-100 text-secondary-700 border-secondary-200 flex-shrink-0">
                          {task.activities.length}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-secondary line-clamp-2">{task.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-secondary">Completadas:</span>
                        <span className="font-medium text-neutral-black">{taskResults.length} veces</span>
                      </div>
                      
                      {taskResults.length > 0 && (
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-secondary">Promedio:</span>
                          <Badge className={`${averageScore >= 80 ? 'bg-accent-green/10 text-accent-green border-accent-green/20' : 
                                           averageScore >= 60 ? 'bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20' : 
                                           'bg-secondary-100 text-secondary-700 border-secondary-200'}`}>
                            {averageScore}%
                          </Badge>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button 
                          onClick={() => handleViewStudent(task.id)}
                          className="flex-1 bg-primary hover:bg-primary-600 text-neutral-white border-0 text-sm"
                        >
                          <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          Comenzar
                        </Button>
                        {isTeacher && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setViewMode('teacher')}
                            className="border-secondary-300 text-secondary hover:bg-secondary-50 hover:border-secondary-400"
                          >
                            <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border-secondary-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Zap className="h-5 w-5 text-primary" />
            Tipos de Actividades Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {[
              { emoji: '✅', title: 'Opción Múltiple', desc: 'Selecciona la respuesta correcta entre las opciones disponibles.' },
              { emoji: '🎯', title: 'Arrastrar y Soltar', desc: 'Arrastra elementos para ordenarlos correctamente.' },
              { emoji: '🔗', title: 'Conectar Líneas', desc: 'Conecta elementos relacionados haciendo clic en ambas columnas.' },
              { emoji: '✍️', title: 'Respuesta Corta', desc: 'Escribe tu respuesta en el campo de texto.' },
              { emoji: '🎥', title: 'Videos', desc: 'Mira videos educativos y completa la actividad.' }
            ].map((activity, index) => (
              <div key={index} className="text-center p-3 sm:p-4 border border-secondary-200 rounded-lg hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-200">
                <div className="text-2xl sm:text-3xl mb-2">{activity.emoji}</div>
                <h4 className="font-semibold mb-2 text-sm sm:text-base text-neutral-black">{activity.title}</h4>
                <p className="text-xs sm:text-sm text-secondary">
                  {activity.desc}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveActivities;