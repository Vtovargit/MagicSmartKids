import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { multiInstitutionApi } from '../services/api';
import { Users, Search, GraduationCap, UserCheck, Mail, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import Layout from '../components/Layout';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt?: string;
  lastLoginAt?: string;
}

const CoordinatorUsersPage: React.FC = () => {
  const { user } = useAuthStore();
  const [teachers, setTeachers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'teachers' | 'students'>('all');

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUsers = async () => {
    if (!user?.institution?.id) {
      console.warn('⚠️ Usuario sin institución asignada');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const institutionId = parseInt(user.institution.id);
      console.log('📊 Cargando usuarios de la institución:', institutionId, user.institution.name);
      
      // Usar el API helper que filtra por institución
      const response = await multiInstitutionApi.getInstitutionUsers(institutionId);
      console.log('✅ Datos recibidos:', response.data);
      
      if (response.data.success && response.data.users) {
        const usersData = response.data.users;
        setTeachers(usersData.teachers || []);
        setStudents(usersData.students || []);
        console.log(`✅ Cargados ${usersData.totalTeachers || 0} profesores y ${usersData.totalStudents || 0} estudiantes de ${user.institution.name}`);
      }
    } catch (error: unknown) {
      console.error('❌ Error loading users:', error);
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 403) {
        console.error('❌ Sin permisos para ver usuarios de esta institución');
      }
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'teacher':
        return <GraduationCap className="h-5 w-5 text-emerald-600" />;
      case 'student':
        return <UserCheck className="h-5 w-5 text-purple-600" />;
      default:
        return <Users className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'teacher':
        return 'bg-emerald-100 text-emerald-700';
      case 'student':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role.toLowerCase()) {
      case 'teacher':
        return 'Profesor';
      case 'student':
        return 'Estudiante';
      case 'coordinator':
        return 'Coordinador';
      default:
        return role;
    }
  };

  const filterUsers = (usersList: User[]) => {
    if (!searchTerm) return usersList;
    
    const term = searchTerm.toLowerCase();
    return usersList.filter(u => 
      u.firstName.toLowerCase().includes(term) ||
      u.lastName.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  };

  const filteredTeachers = filterUsers(teachers);
  const filteredStudents = filterUsers(students);
  const allUsers = [...filteredTeachers, ...filteredStudents];

  const displayUsers = activeTab === 'all' ? allUsers : 
                       activeTab === 'teachers' ? filteredTeachers : 
                       filteredStudents;

  return (
    <Layout>
      <div className="space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Gestión de Usuarios
                  </h1>
                  <p className="text-gray-600 text-sm">
                    {user?.institution?.name}
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={loadUsers}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {teachers.length + students.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <GraduationCap className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Profesores</p>
                  <p className="text-2xl font-bold text-gray-900">{teachers.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-purple-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <UserCheck className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Estudiantes</p>
                  <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todos ({allUsers.length})
                </button>
                <button
                  onClick={() => setActiveTab('teachers')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'teachers'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Profesores ({teachers.length})
                </button>
                <button
                  onClick={() => setActiveTab('students')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'students'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Estudiantes ({students.length})
                </button>
              </div>
            </div>
          </div>

          {/* Users List */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : displayUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No se encontraron usuarios</p>
                <p className="text-gray-400 text-sm mt-2">
                  {searchTerm ? 'Intenta con otro término de búsqueda' : 'No hay usuarios registrados'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {displayUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all duration-200 border border-gray-200"
                  >
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {u.firstName[0]}{u.lastName[0]}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">
                          {u.firstName} {u.lastName}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(u.role)}`}>
                          {getRoleLabel(u.role)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{u.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getRoleIcon(u.role)}
                      <div className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
    </Layout>
  );
};

export default CoordinatorUsersPage;
