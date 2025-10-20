import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BookOpen, Calendar, Trophy, Clock, FileText, School, Play, RefreshCw, AlertTriangle, Target } from 'lucide-react';
import { translateRole, getRoleIcon } from '../../utils/roleTranslations';

interface StudentStats {
  totalSubjects: number;
  pendingTasks: number;
  averageGrade: number;
  studyHours: string;
  completedActivities: number;
  loading: boolean;
}

interface Task {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
}

interface SubjectProgress {
  subject: string;
  progress: number;
  grade: number;
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<StudentStats>({
    totalSubjects: 0,
    pendingTasks: 0,
    averageGrade: 0,
    studyHours: '0h',
    completedActivities: 0,
    loading: true
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    await Promise.all([
      loadStats(),
      loadTasks(),
      loadSubjectProgress()
    ]);
  };

  const loadStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));
      
      const response = await fetch('/api/student/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalSubjects: data.totalSubjects || 0,
          pendingTasks: data.pendingTasks || 0,
          averageGrade: data.averageGrade || 0,
          studyHours: data.studyHours || '0h',
          completedActivities: data.completedActivities || 0,
          loading: false
        });
      } else {
        setStats(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Error loading student stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const loadTasks = async () => {
    try {
      setLoadingTasks(true);
      const response = await fetch('/api/student/tasks', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  const loadSubjectProgress = async () => {
    try {
      const response = await fetch('/api/student/progress', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubjectProgress(data.progress || []);
      } else {
        setSubjectProgress([]);
      }
    } catch (error) {
      console.error('Error loading subject progress:', error);
      setSubjectProgress([]);
    }
  };

  const getTaskStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning" className="text-xs">Pendiente</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="text-xs">En progreso</Badge>;
      case 'completed':
        return <Badge variant="success" className="text-xs">Completada</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">Desconocido</Badge>;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-black flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              👋
            </div>
            ¡Hola, {user?.firstName}!
          </h1>
          <p className="text-sm sm:text-base text-secondary">
            Bienvenido a tu dashboard de estudiante
          </p>
        </div>
        <Button 
          onClick={loadStudentData}
          variant="outline"
          className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2"
          disabled={stats.loading}
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Actualizar</span>
        </Button>
      </div>
      {/* Institution Info */}
      {user?.institution ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
                <School className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-neutral-black">
                  {user.institution.name}
                </h3>
                <p className="text-sm sm:text-base text-secondary flex items-center gap-2">
                  <span>{getRoleIcon(user.role)}</span>
                  <span>{translateRole(user.role)}</span>
                </p>
                {user.institution.address && (
                  <p className="text-xs sm:text-sm text-secondary mt-1">
                    📍 {user.institution.address}
                  </p>
                )}
              </div>
              {stats.pendingTasks > 0 && (
                <Badge variant="warning" className="text-xs">
                  {stats.pendingTasks} pendientes
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-accent-yellow/30 bg-accent-yellow/5">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-accent-yellow" />
              <div>
                <p className="font-medium text-neutral-black">Sin institución asignada</p>
                <p className="text-sm text-secondary">Contacta al administrador del sistema</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Materias</p>
                {stats.loading ? (
                  <div className="animate-pulse">
                    <div className="h-6 sm:h-8 bg-secondary-200 rounded w-12"></div>
                  </div>
                ) : (
                  <p className="text-xl sm:text-2xl font-bold text-neutral-black">{stats.totalSubjects}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-accent-yellow/10 rounded-lg">
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-accent-yellow" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Tareas Pendientes</p>
                {stats.loading ? (
                  <div className="animate-pulse">
                    <div className="h-6 sm:h-8 bg-secondary-200 rounded w-12"></div>
                  </div>
                ) : (
                  <p className="text-xl sm:text-2xl font-bold text-neutral-black">{stats.pendingTasks}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-accent-green/10 rounded-lg">
                <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-accent-green" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Promedio</p>
                {stats.loading ? (
                  <div className="animate-pulse">
                    <div className="h-6 sm:h-8 bg-secondary-200 rounded w-16"></div>
                  </div>
                ) : (
                  <p className="text-xl sm:text-2xl font-bold text-neutral-black">{stats.averageGrade.toFixed(1)}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-secondary/10 rounded-lg">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Horas Estudio</p>
                {stats.loading ? (
                  <div className="animate-pulse">
                    <div className="h-6 sm:h-8 bg-secondary-200 rounded w-16"></div>
                  </div>
                ) : (
                  <p className="text-xl sm:text-2xl font-bold text-neutral-black">{stats.studyHours}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-secondary-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-neutral-black">
            <div className="p-1 bg-primary/10 rounded">
              <Target className="h-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <span>Actividades Interactivas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 sm:py-8">
            <div className="text-4xl sm:text-6xl mb-4">📚</div>
            <h3 className="text-lg sm:text-xl font-semibold text-neutral-black mb-2">
              Sistema de Evaluaciones
            </h3>
            <p className="text-sm sm:text-base text-secondary mb-4 max-w-md mx-auto">
              Accede a las nuevas actividades interactivas y evaluaciones diseñadas especialmente para ti.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/actividades-interactivas">
                <Button className="bg-primary hover:bg-primary-600 text-neutral-white border-0 flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Acceder a Actividades
                </Button>
              </Link>
              <Link to="/student/tasks">
                <Button variant="outline" className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Ver Tareas
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="border-secondary-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-neutral-black">
              <div className="p-1 bg-accent-yellow/10 rounded">
                <Calendar className="h-4 h-4 sm:w-5 sm:h-5 text-accent-yellow" />
              </div>
              <span>Próximas Tareas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingTasks ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
                      <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
                    </div>
                    <div className="w-16 h-6 bg-secondary-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-black text-sm">{task.subject} - {task.title}</p>
                      <p className="text-xs text-secondary">Vence: {task.dueDate}</p>
                    </div>
                    {getTaskStatusBadge(task.status)}
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-secondary">No tienes tareas pendientes</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-secondary-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-neutral-black">
              <div className="p-1 bg-accent-green/10 rounded">
                <Trophy className="h-4 h-4 sm:w-5 sm:h-5 text-accent-green" />
              </div>
              <span>Progreso por Materias</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectProgress.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-black">{subject.subject}</span>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          subject.grade >= 4.0 ? 'success' :
                          subject.grade >= 3.0 ? 'warning' :
                          'destructive'
                        }
                        className="text-xs"
                      >
                        {subject.grade.toFixed(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-secondary-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${subject.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-secondary w-12 text-right">{subject.progress}%</span>
                  </div>
                </div>
              ))}
              {subjectProgress.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-secondary">No hay datos de progreso disponibles</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;