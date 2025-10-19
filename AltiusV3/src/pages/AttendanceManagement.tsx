import React, { useState, useEffect } from 'react';
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  institutionId: number;
}

interface Attendance {
  id: number;
  studentId: number;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  notes?: string;
}

interface AttendanceRecord extends Attendance {
  student: Student;
}

const AttendanceManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
    fetchAttendanceForDate(selectedDate);
  }, [selectedDate]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Error al cargar estudiantes');
    }
  };

  const fetchAttendanceForDate = async (date: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/attendance/date/${date}`);
      if (response.ok) {
        const data = await response.json();
        setAttendanceRecords(data);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setError('Error al cargar asistencia');
    } finally {
      setLoading(false);
    }
  };

  const updateAttendanceStatus = async (studentId: number, status: 'PRESENT' | 'ABSENT' | 'LATE', notes?: string) => {
    try {
      const attendanceData = {
        studentId,
        date: selectedDate,
        status,
        notes: notes || ''
      };

      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceData),
      });

      if (response.ok) {
        fetchAttendanceForDate(selectedDate);
      } else {
        setError('Error al actualizar asistencia');
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      setError('Error al actualizar asistencia');
    }
  };

  const getAttendanceForStudent = (studentId: number) => {
    return attendanceRecords.find(record => record.studentId === studentId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'text-green-600 bg-green-50';
      case 'ABSENT':
        return 'text-red-600 bg-red-50';
      case 'LATE':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Asistencia</h1>
        <p className="text-gray-600">Registra y gestiona la asistencia de los estudiantes</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="mb-6 bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <div>
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-48"
            />
          </div>
          <Button 
            onClick={() => fetchAttendanceForDate(selectedDate)}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Actualizar'}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Lista de Estudiantes - {new Date(selectedDate).toLocaleDateString('es-ES')}
          </h2>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">Cargando asistencia...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => {
                  const attendance = getAttendanceForStudent(student.id);
                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          attendance ? getStatusColor(attendance.status) : 'text-gray-500 bg-gray-100'
                        }`}>
                          {attendance ? attendance.status : 'Sin registrar'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {attendance?.notes || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Select
                            value={attendance?.status || ''}
                            onValueChange={(value) => updateAttendanceStatus(student.id, value as 'PRESENT' | 'ABSENT' | 'LATE')}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PRESENT">Presente</SelectItem>
                              <SelectItem value="ABSENT">Ausente</SelectItem>
                              <SelectItem value="LATE">Tardanza</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {students.length === 0 && !loading && (
          <div className="p-6 text-center">
            <p className="text-gray-500">No hay estudiantes registrados</p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Día</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{students.length}</div>
            <div className="text-sm text-blue-600">Total Estudiantes</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {attendanceRecords.filter(r => r.status === 'PRESENT').length}
            </div>
            <div className="text-sm text-green-600">Presentes</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {attendanceRecords.filter(r => r.status === 'ABSENT').length}
            </div>
            <div className="text-sm text-red-600">Ausentes</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {attendanceRecords.filter(r => r.status === 'LATE').length}
            </div>
            <div className="text-sm text-yellow-600">Tardanzas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement;