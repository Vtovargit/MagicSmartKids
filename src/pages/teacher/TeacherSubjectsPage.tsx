import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BookOpen, Users, FileText, Plus, RefreshCw, TrendingUp, Award, Calendar } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuthStore } from '../../stores/authStore';

interface TeacherSubject {
  id: number;
  name: string;
  description?: string;
  grade: string;
  color: string;
  totalStudents: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  progress: number;
  averageGrade: number;
  nextTask?: {
    title: string;
    dueDate: string;
  };
}

const TeacherSubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<TeacherSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSubjects: 0,
    averageProgress: 0,
    overallAverage: 0
  });
  const navigate = useNavigate();
  const { token } = useAuthStore();

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/teacher/subjects', {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Materias del profesor:', data);
        
        const subjectsData = data.subjects || [];
        setSubjects(subjectsData);
        
        // Calcular estadísticas
        const totalSubjects = subjectsData.length;
        const averageProgress = totalSubjects > 0 
          ? Math.round(subjectsData.reduce((acc: number, s: TeacherSubject) => acc + (s.progress || 0), 0) / totalSubjects)
          : 0;
        const overallAverage = totalSubjects > 0
          ? Math.round(subjectsData.reduce((acc: number, s: TeacherSubject) => acc + (s.averageGrade || 0), 0) / totalSubjects * 10) / 10
          : 0;
        
        setStats({
          totalSubjects,
          averageProgress,
          overallAverage
        });
      } else {
        console.error('Error cargando materias');
        setSubjects([]);
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudents = (subject: TeacherSubject) => {
    // Navegar a la vista de estudiantes del grado
    navigate(`/profesor/estudiantes?grade=${encodeURIComponent(subject.grade)}&subject=${subject.id}`);
  };

  const handleCreateTask = (subject: TeacherSubject) => {
    // Navegar a la vista de tareas de la materia
    navigate(`/profesor/materias/${subject.id}/tareas?name=${encodeURIComponent(subject.name)}&grade=${encodeURIComponent(subject.grade)}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Mis Materias"
          description="Gestiona tus materias y grados asignados"
          icon={BookOpen}
        />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Materias"
        description="Gestiona tus materias y grados asignados"
        icon={BookOpen}
        action={
          <Button 
            onClick={loadSubjects}
            variant="outline"
            className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        }
      />

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-primary-200 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Materias</p>
                <p className="text-3xl font-bold text-primary">{stats.totalSubjects}</p>
              </div>
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Progreso Promedio</p>
                <p className="text-3xl font-bold text-blue-600">{stats.averageProgress}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Promedio General</p>
                <p className="text-3xl font-bold text-orange-600">{stats.overallAverage}</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de materias */}
      {subjects.length === 0 ? (
        <Card className="border-secondary-200">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-secondary mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-neutral-black mb-2">
              No tienes materias asignadas
            </h3>
            <p className="text-secondary mb-4">
              Contacta al coordinador para que te asigne materias y grados.
            </p>
            <Button
              onClick={async () => {
                try {
                  const response = await fetch('/api/teacher/init-test-subjects', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${token || ''}`
                    }
                  });
                  
                  if (response.ok) {
                    const data = await response.json();
                    alert(`✅ ${data.message || 'Materias inicializadas correctamente'}`);
                    loadSubjects();
                  } else {
                    alert('❌ Error al inicializar materias');
                  }
                } catch (error) {
                  console.error('Error:', error);
                  alert('❌ Error de conexión');
                }
              }}
              className="bg-primary hover:bg-primary-600 text-white"
            >
              🧪 Inicializar Materias de Prueba
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              (Solo para desarrollo - asigna materias automáticamente)
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Card 
              key={`${subject.id}-${subject.grade}`}
              className="border-secondary-200 hover:shadow-lg transition-all duration-200"
              style={{ borderTopColor: subject.color, borderTopWidth: '4px' }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${subject.color}20` }}
                  >
                    <BookOpen className="w-6 h-6" style={{ color: subject.color }} />
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="text-xs"
                    style={{ 
                      backgroundColor: `${subject.color}20`,
                      color: subject.color,
                      border: `1px solid ${subject.color}40`
                    }}
                  >
                    {subject.grade}
                  </Badge>
                </div>
                
                <CardTitle className="text-lg font-bold text-neutral-black">
                  {subject.name}
                </CardTitle>
                
                {subject.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {subject.description}
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Calificación promedio */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Calificación</span>
                  </div>
                  <span className="text-xl font-bold" style={{ color: subject.color }}>
                    {subject.averageGrade.toFixed(1)}
                  </span>
                </div>

                {/* Barra de progreso */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-secondary">Progreso</span>
                    <span className="text-sm font-semibold" style={{ color: subject.color }}>
                      {subject.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary-100 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${subject.progress}%`,
                        backgroundColor: subject.color
                      }}
                    />
                  </div>
                </div>

                {/* Estadísticas de tareas */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-700">{subject.totalStudents}</p>
                    <p className="text-xs text-gray-500">Estudiantes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-700">{subject.totalTasks}</p>
                    <p className="text-xs text-gray-500">Tareas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-700">{subject.completedTasks}</p>
                    <p className="text-xs text-gray-500">Completadas</p>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tareas pendientes</span>
                    <span className="font-semibold text-gray-800">{subject.pendingTasks}</span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleViewStudents(subject)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center justify-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Ver Estudiantes
                  </Button>
                  <Button
                    onClick={() => handleCreateTask(subject)}
                    size="sm"
                    className="flex-1 text-white flex items-center justify-center gap-2"
                    style={{ backgroundColor: subject.color }}
                  >
                    <Plus className="h-4 w-4" />
                    Crear Tarea
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

export default TeacherSubjectsPage;
