import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Users, School, RefreshCw, UserCheck, GraduationCap, BookOpen } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { coordinatorApi } from '../../services/api';
import QuickActions from '../../components/coordinator/QuickActions';
import SubjectsSection from '../../components/coordinator/SubjectsSection';
import CreateSubjectModal from '../../components/coordinator/CreateSubjectModal';
import AcademicAnalytics from '../../components/coordinator/AcademicAnalytics';
import TeacherSubjectsSection from '../../components/coordinator/TeacherSubjectsSection';

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  subjects: string[];
  students: number;
  status: string;
}

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  average: number;
  status: string;
}

const CoordinatorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalStudents: 0,
    totalSubjects: 0,
    activeTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [showCreateSubject, setShowCreateSubject] = useState(false);

  useEffect(() => {
    loadUsersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUsersData = async () => {
    try {
      setLoading(true);
      console.log('📊 Cargando datos del dashboard del coordinador...');

      const institutionId = user?.institution?.id ? parseInt(user.institution.id) : 1;

      // Cargar datos reales del backend
      let teachersData: unknown[] = [];
      let studentsData: unknown[] = [];
      let subjectsData: unknown = { subjects: [], total: 0 };

      try {
        const [teachersRes, studentsRes, subjectsRes] = await Promise.all([
          coordinatorApi.getTeachers(institutionId, 100),
          coordinatorApi.getStudents(institutionId, 100),
          coordinatorApi.getSubjects(institutionId)
        ]);

        teachersData = teachersRes.data || [];
        studentsData = studentsRes.data || [];
        subjectsData = subjectsRes || { subjects: [], total: 0 };

        console.log('✅ Datos cargados:', {
          profesores: teachersData.length,
          estudiantes: studentsData.length,
          materias: subjectsData.total || subjectsData.subjects?.length || 0
        });
      } catch (error) {
        console.error('❌ Error cargando datos:', error);
      }

      // Actualizar estado con datos reales
      setTeachers(teachersData);
      setStudents(studentsData);
      setStats({
        totalTeachers: teachersData.length,
        totalStudents: studentsData.length,
        totalSubjects: subjectsData.total || subjectsData.subjects?.length || 0,
        activeTasks: 0 // TODO: Implementar endpoint para tareas activas
      });

    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <School className="h-8 w-8 text-blue-600" />
                Panel de Coordinación
              </h1>
              <p className="text-gray-600 mt-1">
                Bienvenido, {user?.firstName} {user?.lastName}
                {user?.institution && ` - ${user.institution.name}`}
              </p>
            </div>
            <Button
              onClick={loadUsersData}
              variant="outline"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Usuarios */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {loading ? '...' : stats.totalTeachers + stats.totalStudents}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profesores */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profesores</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {loading ? '...' : stats.totalTeachers}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estudiantes */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Estudiantes</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {loading ? '...' : stats.totalStudents}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <UserCheck className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Materias */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Materias</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {loading ? '...' : stats.totalSubjects}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Listas de Usuarios y Materias */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profesores */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Profesores ({teachers.length})
                </h2>
                <Button
                  onClick={() => navigate('/users')}
                  size="sm"
                  variant="outline"
                >
                  Ver todos
                </Button>
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {teachers.slice(0, 10).map((teacher: Teacher) => (
                    <div key={teacher.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-semibold">
                        {teacher.firstName[0]}{teacher.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">{teacher.firstName} {teacher.lastName}</p>
                        <p className="text-xs text-gray-500 truncate">{teacher.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estudiantes */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Estudiantes ({students.length})
                </h2>
                <Button
                  onClick={() => navigate('/users')}
                  size="sm"
                  variant="outline"
                >
                  Ver todos
                </Button>
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {students.slice(0, 10).map((student: Student) => (
                    <div key={student.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-semibold">
                        {student.firstName[0]}{student.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">{student.firstName} {student.lastName}</p>
                        <p className="text-xs text-gray-500 truncate">{student.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profesores y sus Materias */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Profesores y Materias
                </h2>
                <Button
                  onClick={() => navigate('/materias')}
                  size="sm"
                  variant="outline"
                >
                  Ver todas
                </Button>
              </div>
              <TeacherSubjectsSection />
            </CardContent>
          </Card>
        </div>



        {/* Modal Crear Materia */}
        {showCreateSubject && (
          <CreateSubjectModal
            onClose={() => setShowCreateSubject(false)}
            onSuccess={() => {
              setShowCreateSubject(false);
              loadUsersData(); // Recargar datos
            }}
          />
        )}



      </div>
    </div>
  );
};

export default CoordinatorDashboard;