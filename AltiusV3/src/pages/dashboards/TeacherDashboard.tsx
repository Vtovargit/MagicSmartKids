import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Users, BookOpen, CheckCircle, AlertCircle, FileText, School, Target, TrendingUp, Clock, RefreshCw } from 'lucide-react';
import { translateRole, getRoleIcon } from '../../utils/roleTranslations';

interface DashboardStats {
  totalStudents: number;
  totalSubjects: number;
  totalTasks: number;
  pendingGrades: number;
  loading: boolean;
}

interface Subject {
  id: string;
  name: string;
  studentsCount: number;
  status: 'active' | 'inactive';
}

interface RecentTask {
  id: string;
  title: string;
  subject: string;
  submissions: number;
  status: 'pending' | 'graded' | 'active';
  dueDate?: string;
}

const TeacherDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalSubjects: 0,
    totalTasks: 0,
    pendingGrades: 0,
    loading: true
  });
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [recentTasks, setRecentTasks] = useState<RecentTask[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    await Promise.all([
      loadStats(),
      loadSubjects(),
      loadRecentTasks()
    ]);
  };

  const loadStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));
      
      // Simular carga de datos reales - aquí conectarías con tu API
      const response = await fetch('/api/teacher/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalStudents: data.totalStudents || 0,
          totalSubjects: data.totalSubjects || 0,
          totalTasks: data.totalTasks || 0,
          pendingGrades: data.pendingGrades || 0,
          loading: false
        });
      } else {
        // Datos de fallback si la API no está disponible
        setStats({
          totalStudents: 28,
          totalSubjects: 3,
          totalTasks: 15,
          pendingGrades: 7,
          loading: false
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      // Datos de fallback
      setStats({
        totalStudents: 28,
        totalSubjects: 3,
        totalTasks: 15,
        pendingGrades: 7,
        loading: false
      });
    }
  };

  const loadSubjects = async () => {
    try {
      setLoadingSubjects(true);
      const response = await fetch('/api/subjects/teacher', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubjects(data.subjects || []);
      } else {
        // Datos de fallback
        setSubjects([
          { id: '1', name: 'Matemáticas 5°A', studentsCount: 25, status: 'active' },
          { id: '2', name: 'Matemáticas 5°B', studentsCount: 23, status: 'active' },
          { id: '3', name: 'Álgebra 6°A', studentsCount: 20, status: 'active' }
        ]);
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
      setSubjects([
        { id: '1', name: 'Matemáticas 5°A', studentsCount: 25, status: 'active' },
        { id: '2', name: 'Matemáticas 5°B', studentsCount: 23, status: 'active' },
        { id: '3', name: 'Álgebra 6°A', studentsCount: 20, status: 'active' }
      ]);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const loadRecentTasks = async () => {
    try {
      setLoadingTasks(true);
      const response = await fetch('/api/tasks/recent', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecentTasks(data.tasks || []);
      } else {
        // Datos de fallback
        setRecentTasks([
          { id: '1', title: 'Quiz de Fracciones', subject: 'Matemáticas 5°A', submissions: 15, status: 'pending' },
          { id: '2', title: 'Ejercicios de Ecuaciones', subject: 'Álgebra 6°A', submissions: 18, status: 'graded' },
          { id: '3', title: 'Problemas de Geometría', subject: 'Matemáticas 5°B', submissions: 12, status: 'active', dueDate: 'mañana' }
        ]);
      }
    } catch (error) {
      console.error('Error loading recent tasks:', error);
      setRecentTasks([
        { id: '1', title: 'Quiz de Fracciones', subject: 'Matemáticas 5°A', submissions: 15, status: 'pending' },
        { id: '2', title: 'Ejercicios de Ecuaciones', subject: 'Álgebra 6°A', submissions: 18, status: 'graded' },
        { id: '3', title: 'Problemas de Geometría', subject: 'Matemáticas 5°B', submissions: 12, status: 'active', dueDate: 'mañana' }
      ]);
    } finally {
      setLoadingTasks(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-magic text-neutral-black flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              👨‍🏫
            </div>
            Bienvenido, Profesor {user?.firstName}
          </h1>
          <p className="text-sm sm:text-base text-secondary font-body">
            Panel de control para gestionar tus clases y estudiantes
          </p>
        </div>
        <Button 
          onClick={loadDashboardData}
          variant="outline"
          className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Actualizar</span>
        </Button>
      </div>

      {/* Institution Info */}
      {user?.institution ? (
        <Card className="border-accent-green/20 bg-accent-green/5">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-green/10 rounded-lg">
                <School className="h-5 w-5 text-accent-green" />
              </div>
              <div className="flex-1">
                <p className="text-neutral-black font-bold text-base sm:text-lg">
                  {user.institution.name}
                </p>
                <p className="text-accent-green text-sm">
                  {getRoleIcon(user.role)} {translateRole(user.role)}
                </p>
                {user.institution.address && (
                  <p className="text-secondary text-sm mt-1">
                    📍 {user.institution.address}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-accent-yellow/20 bg-accent-yellow/5">
          <CardContent className="p-4 sm:p-6">
            <p className="text-neutral-black font-medium flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-accent-yellow" />
              Sin institución asignada
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Estudiantes</p>
                <p className="text-xl sm:text-2xl font-bold text-neutral-black">
                  {stats.loading ? (
                    <div className="animate-pulse bg-secondary-200 h-6 w-8 rounded"></div>
                  ) : (
                    stats.totalStudents
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-accent-green/10 rounded-lg">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-accent-green" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Materias</p>
                <p className="text-xl sm:text-2xl font-bold text-neutral-black">
                  {stats.loading ? (
                    <div className="animate-pulse bg-secondary-200 h-6 w-8 rounded"></div>
                  ) : (
                    stats.totalSubjects
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-accent-yellow/10 rounded-lg">
                <Target className="h-6 w-6 sm:h-8 sm:w-8 text-accent-yellow" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Tareas Creadas</p>
                <p className="text-xl sm:text-2xl font-bold text-neutral-black">
                  {stats.loading ? (
                    <div className="animate-pulse bg-secondary-200 h-6 w-8 rounded"></div>
                  ) : (
                    stats.totalTasks
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-red-100 rounded-lg">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Por Calificar</p>
                <p className="text-xl sm:text-2xl font-bold text-neutral-black">
                  {stats.loading ? (
                    <div className="animate-pulse bg-secondary-200 h-6 w-8 rounded"></div>
                  ) : (
                    stats.pendingGrades
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-secondary-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <TrendingUp className="h-5 w-5 text-primary" />
            Acciones Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Link to="/actividades-interactivas" className="block">
              <Button className="w-full bg-primary hover:bg-primary-600 text-neutral-white border-0 flex items-center gap-2 py-3 sm:py-4">
                <Target className="h-4 w-4" />
                <span className="text-sm sm:text-base">Actividades Interactivas</span>
              </Button>
            </Link>
            <Link to="/subjects" className="block">
              <Button 
                variant="outline" 
                className="w-full border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2 py-3 sm:py-4"
              >
                <BookOpen className="h-4 w-4" />
                <span className="text-sm sm:text-base">Gestionar Materias</span>
              </Button>
            </Link>
            <Link to="/grades" className="block">
              <Button 
                variant="outline" 
                className="w-full border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2 py-3 sm:py-4"
              >
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm sm:text-base">Calificaciones</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Mis Materias */}
        <Card className="border-secondary-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <BookOpen className="h-5 w-5 text-primary" />
              Mis Materias
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingSubjects ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-secondary-50 rounded-lg">
                      <div className="space-y-2">
                        <div className="h-4 bg-secondary-200 rounded w-32"></div>
                        <div className="h-3 bg-secondary-200 rounded w-24"></div>
                      </div>
                      <div className="h-6 bg-secondary-200 rounded-full w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : subjects.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-secondary mx-auto mb-4" />
                <p className="text-secondary">No hay materias asignadas</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {subjects.map((subject) => (
                  <div key={subject.id} className="flex items-center justify-between p-3 sm:p-4 bg-secondary-50 rounded-lg border border-secondary-200 hover:border-primary-200 transition-all duration-200">
                    <div>
                      <p className="font-medium text-neutral-black text-sm sm:text-base">{subject.name}</p>
                      <p className="text-xs sm:text-sm text-secondary">{subject.studentsCount} estudiantes</p>
                    </div>
                    <Badge 
                      variant={subject.status === 'active' ? 'success' : 'secondary'}
                      className="text-xs"
                    >
                      {subject.status === 'active' ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tareas Recientes */}
        <Card className="border-secondary-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <FileText className="h-5 w-5 text-primary" />
              Tareas Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingTasks ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center justify-between p-3 border-l-4 border-secondary-200 bg-secondary-50">
                      <div className="space-y-2">
                        <div className="h-4 bg-secondary-200 rounded w-40"></div>
                        <div className="h-3 bg-secondary-200 rounded w-32"></div>
                      </div>
                      <div className="h-5 bg-secondary-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentTasks.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-secondary mx-auto mb-4" />
                <p className="text-secondary">No hay tareas recientes</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {recentTasks.map((task) => (
                  <div key={task.id} className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border-l-4 bg-secondary-50 rounded-r-lg gap-2 sm:gap-0 ${
                    task.status === 'pending' ? 'border-accent-yellow' :
                    task.status === 'graded' ? 'border-accent-green' :
                    'border-primary'
                  }`}>
                    <div className="flex-1">
                      <p className="font-medium text-neutral-black text-sm sm:text-base">{task.title}</p>
                      <p className="text-xs sm:text-sm text-secondary">
                        {task.subject} • {task.submissions} entregas
                        {task.dueDate && ` • Vence ${task.dueDate}`}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        task.status === 'pending' ? 'warning' :
                        task.status === 'graded' ? 'success' :
                        'default'
                      }
                      className="text-xs self-start sm:self-center"
                    >
                      {task.status === 'pending' ? 'Por calificar' :
                       task.status === 'graded' ? 'Calificado' :
                       'Activa'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;