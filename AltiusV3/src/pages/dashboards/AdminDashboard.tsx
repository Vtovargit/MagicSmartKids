import React, { useState, useEffect } from 'react';
import { 
  Users, 
  School, 
  BarChart3, 
  Settings, 
  Plus,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Database,
  Shield,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { translateRole, getRoleIcon } from '../../utils/roleTranslations';

interface AdminStats {
  totalUsers: number;
  totalInstitutions: number;
  activeStudents: number;
  activeTeachers: number;
  monthlyGrowth: string;
  systemUptime: string;
  pendingApprovals: number;
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
  loading: boolean;
}

interface RecentActivity {
  id: string;
  type: 'user_created' | 'institution_added' | 'system_update' | 'report_generated';
  message: string;
  time: string;
  timestamp: Date;
}

interface InstitutionStat {
  id: string;
  name: string;
  students: number;
  teachers: number;
  avgGrade: number;
  status: 'active' | 'warning' | 'inactive';
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalInstitutions: 0,
    activeStudents: 0,
    activeTeachers: 0,
    monthlyGrowth: '+0%',
    systemUptime: '0%',
    pendingApprovals: 0,
    systemHealth: 'good',
    loading: true
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [institutionStats, setInstitutionStats] = useState<InstitutionStat[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    await Promise.all([
      loadStats(),
      loadRecentActivity(),
      loadInstitutionStats()
    ]);
  };

  const loadStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));
      
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalUsers: data.totalUsers || 0,
          totalInstitutions: data.totalInstitutions || 0,
          activeStudents: data.activeStudents || 0,
          activeTeachers: data.activeTeachers || 0,
          monthlyGrowth: data.monthlyGrowth || '+0%',
          systemUptime: data.systemUptime || '0%',
          pendingApprovals: data.pendingApprovals || 0,
          systemHealth: data.systemHealth || 'good',
          loading: false
        });
      } else {
        // Datos de fallback
        setStats({
          totalUsers: 15847,
          totalInstitutions: 456,
          activeStudents: 12583,
          activeTeachers: 1203,
          monthlyGrowth: '+12.5%',
          systemUptime: '99.9%',
          pendingApprovals: 23,
          systemHealth: 'excellent',
          loading: false
        });
      }
    } catch (error) {
      console.error('Error loading admin stats:', error);
      setStats({
        totalUsers: 15847,
        totalInstitutions: 456,
        activeStudents: 12583,
        activeTeachers: 1203,
        monthlyGrowth: '+12.5%',
        systemUptime: '99.9%',
        pendingApprovals: 23,
        systemHealth: 'excellent',
        loading: false
      });
    }
  };

  const loadRecentActivity = async () => {
    try {
      setLoadingActivity(true);
      const response = await fetch('/api/admin/recent-activity', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecentActivity(data.activities || []);
      } else {
        // Datos de fallback
        setRecentActivity([
          { id: '1', type: 'user_created', message: 'Nuevo profesor registrado: Carlos García', time: '2 min', timestamp: new Date() },
          { id: '2', type: 'institution_added', message: 'Nueva institución: Colegio San Martín', time: '15 min', timestamp: new Date() },
          { id: '3', type: 'system_update', message: 'Actualización del sistema completada', time: '1 hora', timestamp: new Date() },
          { id: '4', type: 'report_generated', message: 'Reporte mensual generado', time: '2 horas', timestamp: new Date() },
        ]);
      }
    } catch (error) {
      console.error('Error loading recent activity:', error);
      setRecentActivity([
        { id: '1', type: 'user_created', message: 'Nuevo profesor registrado: Carlos García', time: '2 min', timestamp: new Date() },
        { id: '2', type: 'institution_added', message: 'Nueva institución: Colegio San Martín', time: '15 min', timestamp: new Date() },
        { id: '3', type: 'system_update', message: 'Actualización del sistema completada', time: '1 hora', timestamp: new Date() },
        { id: '4', type: 'report_generated', message: 'Reporte mensual generado', time: '2 horas', timestamp: new Date() },
      ]);
    } finally {
      setLoadingActivity(false);
    }
  };

  const loadInstitutionStats = async () => {
    try {
      const response = await fetch('/api/admin/institutions/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setInstitutionStats(data.institutions || []);
      } else {
        // Datos de fallback
        setInstitutionStats([
          { id: '1', name: 'I.E. San José', students: 485, teachers: 28, avgGrade: 4.2, status: 'active' },
          { id: '2', name: 'Colegio Santa María', students: 623, teachers: 35, avgGrade: 3.8, status: 'active' },
          { id: '3', name: 'I.E. Bolívar', students: 412, teachers: 24, avgGrade: 4.0, status: 'warning' },
          { id: '4', name: 'Colegio Moderno', students: 356, teachers: 22, avgGrade: 4.1, status: 'active' },
        ]);
      }
    } catch (error) {
      console.error('Error loading institution stats:', error);
      setInstitutionStats([
        { id: '1', name: 'I.E. San José', students: 485, teachers: 28, avgGrade: 4.2, status: 'active' },
        { id: '2', name: 'Colegio Santa María', students: 623, teachers: 35, avgGrade: 3.8, status: 'active' },
        { id: '3', name: 'I.E. Bolívar', students: 412, teachers: 24, avgGrade: 4.0, status: 'warning' },
        { id: '4', name: 'Colegio Moderno', students: 356, teachers: 22, avgGrade: 4.1, status: 'active' },
      ]);
    }
  };



  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_created':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'institution_added':
        return <School className="w-4 h-4 text-green-600" />;
      case 'system_update':
        return <Settings className="w-4 h-4 text-purple-600" />;
      case 'report_generated':
        return <BarChart3 className="w-4 h-4 text-orange-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Activo</Badge>;
      case 'warning':
        return <Badge variant="warning">Atención</Badge>;
      case 'inactive':
        return <Badge variant="destructive">Inactivo</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-black flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              🛠️
            </div>
            Panel de Administración
          </h1>
          <p className="text-sm sm:text-base text-secondary">
            Bienvenido, {user?.firstName}. Control total del sistema Altius Academy
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <Button 
            onClick={loadAdminData}
            variant="outline"
            className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2 justify-center"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Actualizar</span>
          </Button>
          <Button 
            variant="outline" 
            className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2 justify-center"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Configuración</span>
            <span className="sm:hidden">Config</span>
          </Button>
          <Button className="bg-primary hover:bg-primary-600 text-neutral-white border-0 flex items-center gap-2 justify-center">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nueva Institución</span>
            <span className="sm:hidden">Crear</span>
          </Button>
        </div>
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
              {stats.pendingApprovals > 0 && (
                <Badge variant="warning" className="text-xs">
                  {stats.pendingApprovals} pendientes
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

      {/* System Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-2 sm:mb-3">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              {stats.loading ? (
                <div className="animate-pulse">
                  <div className="h-6 sm:h-8 bg-secondary-200 rounded mb-2"></div>
                  <div className="h-4 bg-secondary-200 rounded"></div>
                </div>
              ) : (
                <>
                  <p className="text-xl sm:text-2xl font-bold text-neutral-black">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-secondary">Total Usuarios</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <div className="p-2 sm:p-3 bg-accent-green/10 rounded-lg w-fit mx-auto mb-2 sm:mb-3">
                <School className="w-6 h-6 sm:w-8 sm:h-8 text-accent-green" />
              </div>
              {stats.loading ? (
                <div className="animate-pulse">
                  <div className="h-6 sm:h-8 bg-secondary-200 rounded mb-2"></div>
                  <div className="h-4 bg-secondary-200 rounded"></div>
                </div>
              ) : (
                <>
                  <p className="text-xl sm:text-2xl font-bold text-neutral-black">{stats.totalInstitutions}</p>
                  <p className="text-xs sm:text-sm text-secondary">Instituciones</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <div className="p-2 sm:p-3 bg-secondary/10 rounded-lg w-fit mx-auto mb-2 sm:mb-3">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" />
              </div>
              {stats.loading ? (
                <div className="animate-pulse">
                  <div className="h-6 sm:h-8 bg-secondary-200 rounded mb-2"></div>
                  <div className="h-4 bg-secondary-200 rounded"></div>
                </div>
              ) : (
                <>
                  <p className="text-xl sm:text-2xl font-bold text-neutral-black">{stats.activeStudents.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-secondary">Estudiantes</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <div className="p-2 sm:p-3 bg-accent-yellow/10 rounded-lg w-fit mx-auto mb-2 sm:mb-3">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-accent-yellow" />
              </div>
              {stats.loading ? (
                <div className="animate-pulse">
                  <div className="h-6 sm:h-8 bg-secondary-200 rounded mb-2"></div>
                  <div className="h-4 bg-secondary-200 rounded"></div>
                </div>
              ) : (
                <>
                  <p className="text-xl sm:text-2xl font-bold text-neutral-black">{stats.activeTeachers.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-secondary">Profesores</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <div className="p-2 sm:p-3 bg-accent-green/10 rounded-lg w-fit mx-auto mb-2 sm:mb-3">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-accent-green" />
              </div>
              {stats.loading ? (
                <div className="animate-pulse">
                  <div className="h-6 sm:h-8 bg-secondary-200 rounded mb-2"></div>
                  <div className="h-4 bg-secondary-200 rounded"></div>
                </div>
              ) : (
                <>
                  <p className="text-xl sm:text-2xl font-bold text-accent-green">{stats.monthlyGrowth}</p>
                  <p className="text-xs sm:text-sm text-secondary">Crecimiento</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-2 sm:mb-3">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              {stats.loading ? (
                <div className="animate-pulse">
                  <div className="h-6 sm:h-8 bg-secondary-200 rounded mb-2"></div>
                  <div className="h-4 bg-secondary-200 rounded"></div>
                </div>
              ) : (
                <>
                  <p className="text-xl sm:text-2xl font-bold text-neutral-black">{stats.systemUptime}</p>
                  <p className="text-xs sm:text-sm text-secondary">Uptime</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <Card className="border-secondary-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-neutral-black">
              <div className="p-1 bg-primary/10 rounded">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <span>Actividad Reciente</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loadingActivity ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="w-8 h-8 bg-secondary-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
                      <div className="h-3 bg-secondary-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                  <div className="p-1 bg-neutral-white rounded">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-black">{activity.message}</p>
                    <p className="text-xs text-secondary mt-1">Hace {activity.time}</p>
                  </div>
                </div>
              ))
            )}
            <Button 
              className="w-full border-secondary-300 text-secondary hover:bg-secondary-50" 
              variant="outline"
            >
              Ver Actividad Completa
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-secondary-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-neutral-black">
              <div className="p-1 bg-primary/10 rounded">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <span>Acciones Rápidas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3">
            <Button className="w-full justify-start border-secondary-300 text-secondary hover:bg-secondary-50" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Gestionar Usuarios
            </Button>
            <Button className="w-full justify-start border-secondary-300 text-secondary hover:bg-secondary-50" variant="outline">
              <School className="w-4 h-4 mr-2" />
              Administrar Instituciones
            </Button>
            <Button className="w-full justify-start border-secondary-300 text-secondary hover:bg-secondary-50" variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Generar Reportes
            </Button>
            <Button className="w-full justify-start border-secondary-300 text-secondary hover:bg-secondary-50" variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Configuración del Sistema
            </Button>
            <Button className="w-full justify-start border-secondary-300 text-secondary hover:bg-secondary-50" variant="outline">
              <Shield className="w-4 h-4 mr-2" />
              Monitoreo del Sistema
            </Button>
            <Button className="w-full justify-start border-secondary-300 text-secondary hover:bg-secondary-50" variant="outline">
              <Database className="w-4 h-4 mr-2" />
              Backup y Restauración
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Institution Overview */}
      <Card className="border-secondary-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-neutral-black">
            <div className="p-1 bg-accent-green/10 rounded">
              <School className="w-4 h-4 sm:w-5 sm:h-5 text-accent-green" />
            </div>
            <span>Resumen de Instituciones</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200">
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-secondary text-sm">Institución</th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-secondary text-sm">Estudiantes</th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-secondary text-sm">Profesores</th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-secondary text-sm">Promedio</th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-secondary text-sm">Estado</th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-secondary text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {institutionStats.map((institution) => (
                  <tr key={institution.id} className="border-b border-secondary-100 hover:bg-secondary-50 transition-colors">
                    <td className="py-3 px-2 sm:px-4">
                      <div className="font-medium text-neutral-black text-sm">{institution.name}</div>
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-secondary text-sm">{institution.students}</td>
                    <td className="py-3 px-2 sm:px-4 text-secondary text-sm">{institution.teachers}</td>
                    <td className="py-3 px-2 sm:px-4">
                      <Badge 
                        variant={
                          institution.avgGrade >= 4.0 ? 'success' :
                          institution.avgGrade >= 3.0 ? 'warning' :
                          'destructive'
                        }
                        className="text-xs"
                      >
                        {institution.avgGrade.toFixed(1)}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 sm:px-4">
                      {getStatusBadge(institution.status)}
                    </td>
                    <td className="py-3 px-2 sm:px-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-secondary-300 text-secondary hover:bg-secondary-50 text-xs"
                      >
                        Ver Detalles
                      </Button>
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

export default AdminDashboard;