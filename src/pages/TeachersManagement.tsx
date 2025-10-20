import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RefreshCw, Users } from 'lucide-react';

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  institution?: { id: number; name: string } | null;
  isActive?: boolean;
}

const TeachersManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = useMemo(() => (typeof window !== 'undefined' ? localStorage.getItem('token') : null), []);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch('/api/users/teachers', { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setTeachers(json.teachers || []);
    } catch (e: any) {
      setError(e?.message || 'Error cargando profesores');
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-black flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> Profesores
          </h1>
          <p className="text-secondary">Listado de profesores (solo lectura)</p>
        </div>
        <Button onClick={loadTeachers} variant="outline" className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2" disabled={loading}>
          <RefreshCw className="h-4 w-4" />
          Refrescar
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-sm text-red-700">{error}</CardContent>
        </Card>
      )}

      <Card className="border-secondary-200">
        <CardHeader>
          <CardTitle>Profesores ({teachers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <div className="py-6 text-center text-sm text-secondary">Cargando…</div>}
          {!loading && teachers.length === 0 && (
            <div className="py-6 text-center text-sm text-secondary">No hay profesores</div>
          )}
          <div className="space-y-2">
            {teachers.map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div>
                  <div className="font-medium text-neutral-black text-sm">{t.firstName} {t.lastName}</div>
                  <div className="text-xs text-secondary">{t.email} {t.phone ? `• ${t.phone}` : ''}</div>
                </div>
                <div className="text-xs text-secondary">{t.institution?.name || '—'}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeachersManagement;
