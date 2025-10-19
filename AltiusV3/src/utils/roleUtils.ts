// Utilidades para manejo de roles
import type { UserRole } from '../types';

/**
 * Normaliza un rol del backend al formato esperado por el frontend
 */
export const normalizeRole = (role: string): UserRole => {
  if (!role) return 'student';
  
  const normalizedRole = role.toLowerCase();
  
  // Mapeo de roles del backend al frontend
  switch (normalizedRole) {
    case 'student':
    case 'estudiante':
      return 'student';
    case 'teacher':
    case 'profesor':
      return 'teacher';
    case 'coordinator':
    case 'coordinador':
      return 'coordinator';
    case 'parent':
    case 'padre':
      return 'parent';
    case 'secretary':
    case 'secretaria':
      return 'secretary';
    case 'admin':
    case 'administrador':
      return 'admin';
    default:
      console.warn(`Rol no reconocido: ${role}, usando 'student' por defecto`);
      return 'student' as UserRole;
  }
};

/**
 * Obtiene el nombre en español del rol
 */
export const getRoleDisplayName = (role: string): string => {
  const normalizedRole = normalizeRole(role);
  
  switch (normalizedRole) {
    case 'student':
      return 'Estudiante';
    case 'teacher':
      return 'Profesor';
    case 'coordinator':
      return 'Coordinador';
    case 'parent':
      return 'Padre de Familia';
    case 'secretary':
      return 'Secretaria';
    case 'admin':
      return 'Administrador';
    default:
      return 'Usuario';
  }
};