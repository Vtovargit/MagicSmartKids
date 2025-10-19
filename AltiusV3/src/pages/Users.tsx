import React, { useState } from 'react';
import { Plus, Users as UsersIcon, Search, Filter, Edit, Trash2, UserCheck, UserX, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/Dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { useAuthStore } from '../stores/authStore';

const Users: React.FC = () => {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const users = [
    {
      id: 1,
      firstName: 'Ana',
      lastName: 'García',
      email: 'ana.garcia@colegio.edu.co',
      role: 'teacher',
      phone: '300-123-4567',
      institution: 'I.E. San José',
      isActive: true,
      createdAt: '2024-09-15',
      lastLogin: '2025-01-10',
      subjects: ['Matemáticas 3°A', 'Matemáticas 3°B'],
      studentsCount: 53
    },
    {
      id: 2,
      firstName: 'Carlos',
      lastName: 'Ruiz',
      email: 'carlos.ruiz@colegio.edu.co',
      role: 'teacher',
      phone: '301-234-5678',
      institution: 'I.E. San José',
      isActive: true,
      createdAt: '2024-09-20',
      lastLogin: '2025-01-09',
      subjects: ['Español 3°A', 'Español 4°A'],
      studentsCount: 48
    },
    {
      id: 3,
      firstName: 'María',
      lastName: 'López',
      email: 'maria.lopez@colegio.edu.co',
      role: 'coordinator',
      phone: '302-345-6789',
      institution: 'I.E. San José',
      isActive: true,
      createdAt: '2024-08-10',
      lastLogin: '2025-01-10',
      studentsCount: 485,
      teachersCount: 28
    },
    {
      id: 4,
      firstName: 'Pedro',
      lastName: 'Martín',
      email: 'pedro.martin@gmail.com',
      role: 'parent',
      phone: '303-456-7890',
      institution: 'I.E. San José',
      isActive: true,
      createdAt: '2024-10-05',
      lastLogin: '2025-01-08',
      children: ['Ana Martín (3°A)', 'Carlos Martín (1°B)']
    },
    {
      id: 5,
      firstName: 'Laura',
      lastName: 'Rodríguez',
      email: 'laura.rodriguez@estudiante.edu.co',
      role: 'student',
      phone: '304-567-8901',
      institution: 'I.E. San José',
      isActive: true,
      createdAt: '2024-09-01',
      lastLogin: '2025-01-10',
      grade: '3°A',
      currentAverage: 4.2,
      parentEmail: 'padre.rodriguez@gmail.com'
    },
    {
      id: 6,
      firstName: 'Admin',
      lastName: 'Sistema',
      email: 'admin@altiusacademy.com',
      role: 'admin',
      phone: '305-678-9012',
      institution: 'Sistema',
      isActive: true,
      createdAt: '2024-08-01',
      lastLogin: '2025-01-10'
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'coordinator': return 'default';
      case 'teacher': return 'secondary';
      case 'student': return 'outline';
      case 'parent': return 'warning';
      default: return 'secondary';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'coordinator': return 'Coordinador';
      case 'teacher': return 'Profesor';
      case 'student': return 'Estudiante';
      case 'parent': return 'Padre';
      default: return role;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const usersByRole = {
    admin: users.filter(u => u.role === 'admin'),
    coordinator: users.filter(u => u.role === 'coordinator'),
    teacher: users.filter(u => u.role === 'teacher'),
    student: users.filter(u => u.role === 'student'),
    parent: users.filter(u => u.role === 'parent')
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
    teachers: usersByRole.teacher.length,
    students: usersByRole.student.length,
    parents: usersByRole.parent.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios 👥</h1>
          <p className="text-gray-600 mt-1">
            Administra usuarios, roles y permisos del sistema
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Nuevo Usuario</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombres
                  </label>
                  <Input placeholder="Nombres" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellidos
                  </label>
                  <Input placeholder="Apellidos" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input type="email" placeholder="usuario@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <Input placeholder="300-123-4567" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher">Profesor</SelectItem>
                    <SelectItem value="student">Estudiante</SelectItem>
                    <SelectItem value="parent">Padre de Familia</SelectItem>
                    <SelectItem value="coordinator">Coordinador</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setIsCreateModalOpen(false)}>
                  Cancelar
                </Button>
                <Button className="flex-1">
                  Crear Usuario
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <UsersIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <UserCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              <p className="text-sm text-gray-600">Activos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <UserX className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
              <p className="text-sm text-gray-600">Inactivos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <UsersIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.teachers}</p>
              <p className="text-sm text-gray-600">Profesores</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <UsersIcon className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.students}</p>
              <p className="text-sm text-gray-600">Estudiantes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <UsersIcon className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.parents}</p>
              <p className="text-sm text-gray-600">Padres</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="admin">Administradores</SelectItem>
                <SelectItem value="coordinator">Coordinadores</SelectItem>
                <SelectItem value="teacher">Profesores</SelectItem>
                <SelectItem value="student">Estudiantes</SelectItem>
                <SelectItem value="parent">Padres</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Usuario</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Rol</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Contacto</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Último Acceso</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                        {user.role === 'student' && user.grade && (
                          <div className="text-xs text-gray-500">Grado: {user.grade}</div>
                        )}
                        {user.role === 'teacher' && user.subjects && (
                          <div className="text-xs text-gray-500">
                            {user.subjects.length} materias
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getRoleColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-sm">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">{user.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={user.isActive ? 'success' : 'destructive'}>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600">
                        {formatDate(user.lastLogin)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className={user.isActive ? 'text-red-600' : 'text-green-600'}
                        >
                          {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;