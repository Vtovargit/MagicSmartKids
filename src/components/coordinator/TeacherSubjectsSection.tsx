import React, { useState, useEffect } from 'react';
import { BookOpen, User } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import axios from 'axios';

interface Subject {
  id: number;
  name: string;
  color: string;
}

interface TeacherWithSubjects {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  subjects: Subject[];
}

const TeacherSubjectsSection: React.FC = () => {
  const { user, token } = useAuthStore();
  const [teachers, setTeachers] = useState<TeacherWithSubjects[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTeachersWithSubjects = async () => {
    try {
      setLoading(true);
      const institutionId = user?.institution?.id || 1;

      console.log('🔍 TeacherSubjectsSection - Cargando datos...');
      console.log('   Institution ID:', institutionId);
      console.log('   Token:', token ? 'Disponible' : 'NO disponible');

      if (!token) {
        console.error('❌ No hay token');
        setError('No hay token de autenticación');
        setLoading(false);
        return;
      }

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      console.log('📡 Llamando a:', `${API_BASE_URL}/subjects/institution/${institutionId}`);

      // Cargar materias
      const subjectsRes = await axios.get(`${API_BASE_URL}/subjects/institution/${institutionId}`, config);
      console.log('✅ Respuesta recibida:', subjectsRes.data);
      
      const subjects = subjectsRes.data.subjects || [];
      console.log('📚 Total materias:', subjects.length);

      // Agrupar materias por profesor
      const teacherMap = new Map<number, TeacherWithSubjects>();

      subjects.forEach((subject: unknown) => {
        if (subject.teacher) {
          const teacherId = subject.teacher.id;
          
          if (!teacherMap.has(teacherId)) {
            teacherMap.set(teacherId, {
              id: teacherId,
              firstName: subject.teacher.firstName,
              lastName: subject.teacher.lastName,
              email: subject.teacher.email,
              subjects: []
            });
          }

          teacherMap.get(teacherId)!.subjects.push({
            id: subject.id,
            name: subject.name,
            color: subject.color
          });
        }
      });

      // Convertir a array y ordenar por cantidad de materias
      const teachersArray = Array.from(teacherMap.values())
        .sort((a, b) => b.subjects.length - a.subjects.length);

      console.log('👥 Total profesores con materias:', teachersArray.length);
      console.log('📊 Profesores:', teachersArray.map(t => `${t.firstName} ${t.lastName}: ${t.subjects.length} materias`));

      setTeachers(teachersArray);
      setError(null);
    } catch (error) {
      console.error('❌ Error cargando profesores con materias:', error);
      if (axios.isAxiosError(error)) {
        console.error('   Status:', error.response?.status);
        console.error('   Data:', error.response?.data);
        setError(`Error ${error.response?.status}: ${error.response?.data?.message || 'Error al cargar datos'}`);
      } else {
        setError('Error al cargar datos');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachersWithSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-600 text-sm">{error}</p>
        <button
          onClick={loadTeachersWithSubjects}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p className="text-sm">No hay profesores con materias asignadas</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto">
      {teachers.map((teacher) => (
        <div
          key={teacher.id}
          className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          {/* Profesor */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-semibold text-xs">
              {teacher.firstName[0]}{teacher.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm truncate">
                {teacher.firstName} {teacher.lastName}
              </p>
              <p className="text-xs text-gray-500">
                {teacher.subjects.length} {teacher.subjects.length === 1 ? 'materia' : 'materias'}
              </p>
            </div>
          </div>

          {/* Materias */}
          <div className="flex flex-wrap gap-1 ml-10">
            {teacher.subjects.map((subject) => (
              <span
                key={subject.id}
                className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-white"
                style={{ backgroundColor: subject.color }}
              >
                <BookOpen className="h-3 w-3" />
                {subject.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeacherSubjectsSection;
