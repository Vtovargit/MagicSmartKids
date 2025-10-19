import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Users, School, BarChart3, Settings, UserCheck, GraduationCap, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { translateRole, getRoleIcon } from '../../utils/roleTranslations';
import { useUserInfo } from '../../hooks/useUserInfo';

const CoordinatorDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { userInfo, loading: userLoading, error: userError } = useUserInfo();
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsersData();
  }, []);

  const loadUsersData = async () => {
    try {
      console.log('👥 Cargando datos de usuarios...');
      
      // Cargar profesores
      const teachersResponse = await fetch('/api/users/teachers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (teachersResponse.ok) {
        const teachersData = await teachersResponse.json();
        console.log('👩‍🏫 Profesores cargados:', teachersData);
        setTeachers(teachersData.teachers || []);
      } else {
        console.error('❌ Error cargando profesores:', teachersResponse.status);
      }

      // Cargar estudiantes
      const studentsResponse = await fetch('/api/users/students/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (studentsResponse.ok) {
        const studentsData = await studentsResponse.json();
        console.log('👨‍🎓 Estudiantes cargados:', studentsData);
        setStudents(studentsData.students || []);
      } else {
        console.error('❌ Error cargando estudiantes:', studentsResponse.status);
      }
      
    } catch (error) {
      console.error('❌ Error loading users:', error);
      alert('Error de conexión al cargar usuarios: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-black flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              🏛️
            </div>
            Panel de Coordinación
          </h1>
          <p className="text-sm sm:text-base text-secondary">
            Bienvenido, {user?.firstName}. Gestión institucional y supervisión académica
          </p>
        </div>
        <Button 
          onClick={loadUsersData}
          variant="outline"
          className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2"
          disabled={loading}
        >
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Actualizar Datos</span>
          <span className="sm:hidden">Actualizar</span>
        </Button>
      </div>
      {/* Institution Info */}
      {userLoading ? (
        <Card className="border-secondary-200">
          <CardContent className="p-4 sm:p-6">
            <div className="animate-pulse flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
                <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : userError ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-red-800">Error de conexión</p>
                <p className="text-sm text-red-600">{userError}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : userInfo?.institution ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
                <School className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-neutral-black">
                  {userInfo.institution.name}
                </h3>
                <p className="text-sm sm:text-base text-secondary flex items-center gap-2">
                  <span>{getRoleIcon(userInfo.role)}</span>
                  <span>{translateRole(userInfo.role)}</span>
                </p>
                {userInfo.institution.address && (
                  <p className="text-xs sm:text-sm text-secondary mt-1">
                    📍 {userInfo.institution.address}
                  </p>
                )}
              </div>
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
                <p className="text-sm text-secondary">
                  Usuario: {userInfo?.firstName} {userInfo?.lastName} ({userInfo?.email})
                </p>
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
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Total Usuarios</p>
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-6 sm:h-8 bg-secondary-200 rounded w-16"></div>
                  </div>
                ) : (
                  <p className="text-xl sm:text-2xl font-bold text-neutral-black">
                    {teachers.length + students.length}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-accent-green/10 rounded-lg">
                <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-accent-green" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Profesores</p>
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-6 sm:h-8 bg-secondary-200 rounded w-12"></div>
                  </div>
                ) : (
                  <p className="text-xl sm:text-2xl font-bold text-neutral-black">
                    {teachers.length}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-accent-yellow/10 rounded-lg">
                <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-accent-yellow" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Estudiantes</p>
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-6 sm:h-8 bg-secondary-200 rounded w-12"></div>
                  </div>
                ) : (
                  <p className="text-xl sm:text-2xl font-bold text-neutral-black">
                    {students.length}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-secondary/10 rounded-lg">
                <School className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Institución</p>
                <p className="text-sm sm:text-base font-bold text-neutral-black line-clamp-2">
                  {user?.institution?.name || 'Sin institución'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="border-secondary-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-neutral-black">
              <div className="p-1 bg-accent-green/10 rounded">
                <GraduationCap className="h-4 h-4 sm:w-5 sm:h-5 text-accent-green" />
              </div>
              <span>Profesores ({teachers.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
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
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {teachers.slice(0, 10).map((teacher: any) => (
                  <div key={teacher.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-black text-sm">{teacher.firstName} {teacher.lastName}</p>
                      <p className="text-xs text-secondary truncate">{teacher.email}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {getRoleIcon('TEACHER')} {translateRole('TEACHER')}
                    </Badge>
                  </div>
                ))}
                {teachers.length > 10 && (
                  <p className="text-sm text-secondary text-center py-2">Y {teachers.length - 10} más...</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-secondary-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-neutral-black">
              <div className="p-1 bg-accent-yellow/10 rounded">
                <UserCheck className="h-4 h-4 sm:w-5 sm:h-5 text-accent-yellow" />
              </div>
              <span>Estudiantes ({students.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
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
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {students.slice(0, 10).map((student: any) => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-black text-sm">{student.firstName} {student.lastName}</p>
                      <p className="text-xs text-secondary truncate">{student.email}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {getRoleIcon('STUDENT')} {translateRole('STUDENT')}
                    </Badge>
                  </div>
                ))}
                {students.length > 10 && (
                  <p className="text-sm text-secondary text-center py-2">Y {students.length - 10} más...</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="border-secondary-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-neutral-black">
              <div className="p-1 bg-primary/10 rounded">
                <Settings className="h-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <span>Gestión de Usuarios</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-primary/5 rounded-lg">
                <div>
                  <p className="font-medium text-neutral-black">Crear Usuario</p>
                  <p className="text-xs sm:text-sm text-secondary">Agregar nuevos usuarios al sistema</p>
                </div>
                <Button className="bg-primary hover:bg-primary-600 text-neutral-white border-0">
                  Crear
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-accent-green/5 rounded-lg">
                <div>
                  <p className="font-medium text-neutral-black">Listar Usuarios</p>
                  <p className="text-xs sm:text-sm text-secondary">Ver y editar usuarios existentes</p>
                </div>
                <Button 
                  onClick={() => loadUsersData()}
                  className="bg-accent-green hover:bg-accent-green/80 text-neutral-white border-0"
                  disabled={loading}
                >
                  Actualizar
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-secondary/5 rounded-lg">
                <div>
                  <p className="font-medium text-neutral-black">Reportes</p>
                  <p className="text-xs sm:text-sm text-secondary">Generar reportes institucionales</p>
                </div>
                <Button className="bg-secondary hover:bg-secondary/80 text-neutral-white border-0">
                  Generar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-neutral-black">
              <div className="p-1 bg-primary/10 rounded">
                <BarChart3 className="h-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <span>Actividad Reciente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-black">Sistema actualizado</p>
                  <p className="text-xs text-secondary">Nuevos endpoints agregados - Ahora</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                <div className="w-2 h-2 bg-accent-green rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-black">{teachers.length} profesores activos</p>
                  <p className="text-xs text-secondary">Datos cargados correctamente</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                <div className="w-2 h-2 bg-accent-yellow rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-black">{students.length} estudiantes registrados</p>
                  <p className="text-xs text-secondary">Base de datos actualizada</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;