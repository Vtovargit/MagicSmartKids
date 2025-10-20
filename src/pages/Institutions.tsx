import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { RefreshCw, Plus, Building2 } from 'lucide-react';
import CreateInstitutionModal from '../components/CreateInstitutionModal';

interface Institution {
  id: number | string;
  name: string;
  email?: string;
  phone?: string;
  nit?: string;
  isActive?: boolean;
}

const Institutions: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const token = useMemo(() => (typeof window !== 'undefined' ? localStorage.getItem('token') : null), []);

  useEffect(() => {
    loadInstitutions();
  }, []);

  const loadInstitutions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/institutions');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setInstitutions(json.institutions || []);
    } catch (e: any) {
      setError(e?.message || 'Error cargando instituciones');
      setInstitutions([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: number | string, makeActive: boolean) => {
    try {
      const res = await fetch(`/api/institutions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ isActive: makeActive })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const updated = json.institution ?? json;
      setInstitutions(prev => prev.map(i => String(i.id) === String(updated.id) ? { ...i, isActive: updated.isActive } : i));
    } catch (e) {
      console.error('Error toggling institution', e);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-black flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            Instituciones
          </h1>
          <p className="text-sm sm:text-base text-secondary">
            Gestión de instituciones del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadInstitutions} variant="outline" className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2" disabled={loading}>
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Actualizar</span>
          </Button>
          <Button onClick={() => setIsCreateOpen(true)} className="bg-primary hover:bg-primary-600 text-neutral-white border-0 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nueva Institución
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-sm text-red-700">{error}</CardContent>
        </Card>
      )}

      <Card className="border-secondary-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg text-neutral-black">Listado</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="py-6 text-center text-sm text-secondary">Cargando…</div>
          )}
          {!loading && institutions.length === 0 && (
            <div className="py-6 text-center text-sm text-secondary">No hay instituciones</div>
          )}
          <div className="space-y-2">
            {institutions.map((inst) => (
              <div key={String(inst.id)} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-neutral-black">{inst.name}</p>
                  <p className="text-xs text-secondary">{inst.email || inst.phone || inst.nit || '—'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={inst.isActive === false ? 'secondary' : 'success'} className="text-xs">
                    {inst.isActive === false ? 'Inactiva' : 'Activa'}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-secondary-300 text-secondary hover:bg-secondary-50 text-xs"
                    onClick={() => toggleActive(inst.id, inst.isActive === false)}
                  >
                    {inst.isActive === false ? 'Activar' : 'Desactivar'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <CreateInstitutionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onInstitutionCreated={(i) => {
          setInstitutions(prev => [{ id: i.id, name: i.name, email: i.email, phone: i.phone, nit: i.nit, isActive: i.isActive }, ...prev]);
          setIsCreateOpen(false);
        }}
      />
    </div>
  );
};

export default Institutions;
