import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import CreateInstitutionModal from '../../components/modals/CreateInstitutionModal';
import { 
  Building2, Users, Shield, Activity, RefreshCw, 
  CheckCircle2, AlertTriangle, ExternalLink, BarChart3, Database
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';


interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  institution?: { id: number; name: string } | null;
}

const SuperAdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [coordinators, setCoordinators] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { token } = useAuthStore();

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        loadInstitutions(),
        loadUsersByRole('COORDINATOR'),
        loadUsersByRole('TEACHER'),
        loadHealth()
      ]);
    } catch (e: any) {
      setError(e?.message || 'Error cargando datos del dashboard');
    } finally {
      setLoading(false);
    }
  };


  const loadInstitutions = async () => {
    const res = await fetch('/api/dashboard/institutions-summary', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      const json = await res.json();
      setInstitutions(json.institutions || []);
    }
  };





  const loadUsersByRole = async (role: 'COORDINATOR' | 'TEACHER') => {
    const res = await fetch(`/api/users/role/${role}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      const json = await res.json();
      if (role === 'COORDINATOR') setCoordinators(json.users || []);
      if (role === 'TEACHER') setTeachers(json.users || []);
    } else {
      if (role === 'COORDINATOR') setCoordinators([]);
      if (role === 'TEACHER') setTeachers([]);
    }
  };

  const loadHealth = async () => {
    const res = await fetch('/api/dashboard/health', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      const json = await res.json();
      setHealth(json.health);
    } else {
      setHealth(null);
    }
  };

  const totalInstitutions = institutions.length;
  const totalCoordinators = coordinators.length;
  const totalTeachers = teachers.length;

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-black flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">⚙️</div>
            Super Admin
          </h1>
          <p className="text-sm sm:text-base text-secondary">
            Gestión global de instituciones, coordinadores, profesores y salud del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadDashboardData} variant="outline" className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2" disabled={loading}>
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Actualizar</span>
          </Button>
          <a href="/swagger-ui.html" target="_blank" rel="noreferrer">
            <Button variant="outline" className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">API Docs</span>
            </Button>
          </a>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700 text-sm">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
                <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Instituciones</p>
                <p className="text-xl sm:text-2xl font-bold text-neutral-black">{loading ? '...' : totalInstitutions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-accent-green/10 rounded-lg">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-accent-green" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Coordinadores</p>
                <p className="text-xl sm:text-2xl font-bold text-neutral-black">{loading ? '...' : totalCoordinators}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-accent-yellow/10 rounded-lg">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-accent-yellow" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Profesores</p>
                <p className="text-xl sm:text-2xl font-bold text-neutral-black">{loading ? '...' : totalTeachers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-secondary/10 rounded-lg">
                <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Estado</p>
                <div className="flex items-center gap-2">
                  {health?.status === 'UP' ? (
                    <Badge variant="success" className="text-xs flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> UP
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs">DOWN</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2 border-secondary-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-neutral-black">
              <Building2 className="h-4 w-4 text-primary" />
              Instituciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            {institutions.length === 0 ? (
              <div className="text-secondary text-sm">Sin instituciones para mostrar</div>
            ) : (
              <div className="space-y-2">
                {institutions.slice(0, 8).map((inst) => (
                  <div key={inst.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-neutral-black">{inst.name}</p>
                      <p className="text-xs text-secondary">{inst.email || inst.phone || inst.nit || '—'}</p>
                    </div>
                    {inst.isActive !== false ? (
                      <Badge variant="success" className="text-xs">Activa</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Inactiva</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-secondary-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-neutral-black">
              <Shield className="h-4 w-4 text-accent-green" />
              Coordinadores
            </CardTitle>
          </CardHeader>
          <CardContent>
            {coordinators.length === 0 ? (
              <div className="text-secondary text-sm">Sin coordinadores</div>
            ) : (
              <div className="space-y-2">
                {coordinators.slice(0, 8).map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-neutral-black">{c.firstName} {c.lastName}</p>
                      <p className="text-xs text-secondary">{c.email} {c.institution?.name ? `• ${c.institution.name}` : ''}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">COORDINATOR</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="border-secondary-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-neutral-black">
              <Users className="h-4 w-4 text-accent-yellow" />
              Profesores
            </CardTitle>
          </CardHeader>
          <CardContent>
            {teachers.length === 0 ? (
              <div className="text-secondary text-sm">Sin profesores</div>
            ) : (
              <div className="space-y-2">
                {teachers.slice(0, 8).map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-neutral-black">{t.firstName} {t.lastName}</p>
                      <p className="text-xs text-secondary">{t.email} {t.institution?.name ? `• ${t.institution.name}` : ''}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">TEACHER</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-secondary-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-neutral-black">
              <BarChart3 className="h-4 w-4 text-primary" />
              Analítica / Power BI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-secondary-200 overflow-hidden bg-neutral-white">
              {/* Placeholder: reemplazar con URL de informe Power BI o similar */}
              <div className="aspect-video w-full bg-secondary-50 flex items-center justify-center text-secondary text-sm">
                Integración BI (iframe) — Configurar URL del reporte
              </div>
            </div>
            <div className="mt-3 text-xs text-secondary flex items-center gap-2">
              <Database className="h-3 w-3" />
              Datos agregados a través de endpoints existentes. Se puede cambiar a una fuente dedicada de analytics.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal para crear nueva institución */}
      <CreateInstitutionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          loadDashboardData();
          setShowCreateModal(false);
        }}
      />
    </div>
  );
};

export default SuperAdminDashboard;
