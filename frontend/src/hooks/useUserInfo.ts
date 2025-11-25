import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

interface UserInfo {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  institution?: {
    id: number;
    name: string;
    address?: string;
    phone?: string;
    email?: string;
  };
}

export const useUserInfo = () => {
  const { user } = useAuthStore();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        console.log('🔍 Cargando información completa del usuario...');
        
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No hay token de autenticación');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/debug/user-info', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('📥 Información del usuario recibida:', data);

        if (data.success) {
          setUserInfo(data.user);
          console.log('✅ Usuario cargado:', data.user.firstName, data.user.lastName);
          if (data.user.institution) {
            console.log('🏛️ Institución:', data.user.institution.name);
          } else {
            console.log('⚠️ Usuario sin institución');
          }
        } else {
          setError(data.message || 'Error al cargar información del usuario');
        }
      } catch (err) {
        console.error('❌ Error cargando información del usuario:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserInfo();
    } else {
      setLoading(false);
    }
  }, [user]);

  return { userInfo, loading, error };
};