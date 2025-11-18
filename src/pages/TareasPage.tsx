import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';

/**
 * Página de Tareas - Redirige a la nueva vista de tareas por grado
 */
export default function TareasPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir automáticamente a la nueva página de tareas
    navigate('/student/grade-tasks', { replace: true });
  }, [navigate]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Tareas"
        description="Cargando tus tareas..."
        icon={FileText}
      />
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirigiendo a tus tareas...</p>
        </div>
      </div>
    </div>
  );
}
