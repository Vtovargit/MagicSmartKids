import React from 'react';
import { Users, School, TrendingUp, BarChart3, Award, BookOpen, Target, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

const VisitorDashboard: React.FC = () => {
  const publicStats = {
    totalStudents: 15847,
    totalInstitutions: 456,
    averageImprovement: '+0.6',
    successRate: 89,
    totalTeachers: 1203,
    completedAssignments: 45623
  };

  const institutionHighlights = [
    {
      name: 'I.E. San José',
      location: 'Bogotá',
      students: 485,
      improvement: '+0.8',
      averageGrade: 4.2,
      highlight: 'Mejor mejora en Matemáticas'
    },
    {
      name: 'Colegio Santa María',
      location: 'Medellín',
      students: 623,
      improvement: '+0.7',
      averageGrade: 4.1,
      highlight: 'Excelencia en Español'
    },
    {
      name: 'I.E. Simón Bolívar',
      location: 'Cali',
      students: 412,
      improvement: '+0.9',
      averageGrade: 4.0,
      highlight: 'Mayor progreso general'
    }
  ];

  const subjectStats = [
    {
      subject: 'Matemáticas',
      beforeAverage: 2.7,
      afterAverage: 3.8,
      improvement: '+1.1',
      studentsImpacted: 15847,
      color: '#3B82F6'
    },
    {
      subject: 'Español',
      beforeAverage: 3.2,
      afterAverage: 4.0,
      improvement: '+0.8',
      studentsImpacted: 15847,
      color: '#10B981'
    },
    {
      subject: 'Ciencias',
      beforeAverage: 3.0,
      afterAverage: 3.9,
      improvement: '+0.9',
      studentsImpacted: 15847,
      color: '#8B5CF6'
    },
    {
      subject: 'Sociales',
      beforeAverage: 3.1,
      afterAverage: 3.8,
      improvement: '+0.7',
      studentsImpacted: 15847,
      color: '#F59E0B'
    }
  ];

  const monthlyProgress = [
    { month: 'Sep 2024', average: 2.8, students: 12450 },
    { month: 'Oct 2024', average: 3.2, students: 13890 },
    { month: 'Nov 2024', average: 3.5, students: 14567 },
    { month: 'Dic 2024', average: 3.7, students: 15234 },
    { month: 'Ene 2025', average: 3.9, students: 15847 }
  ];

  const getImprovementColor = (improvement: string) => {
    const value = parseFloat(improvement.replace('+', ''));
    if (value >= 1.0) return 'text-green-600';
    if (value >= 0.5) return 'text-blue-600';
    return 'text-yellow-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Altius Academy</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Iniciar Sesión</Button>
              </Link>
              <Link to="/register">
                <Button>Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center py-12 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl text-white">
          <h1 className="text-4xl font-bold mb-4">
            Transformando la Educación Primaria 🚀
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Descubre el impacto real de nuestro programa de refuerzo académico en instituciones educativas de todo el país
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{publicStats.totalStudents.toLocaleString()}</p>
              <p className="text-blue-200">Estudiantes Beneficiados</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{publicStats.totalInstitutions}</p>
              <p className="text-blue-200">Instituciones Participantes</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-300">{publicStats.averageImprovement}</p>
              <p className="text-blue-200">Mejora Promedio</p>
            </div>
          </div>
        </div>

        {/* Global Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{publicStats.totalStudents.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Estudiantes</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <School className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{publicStats.totalInstitutions}</p>
                <p className="text-sm text-gray-600">Instituciones</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{publicStats.totalTeachers.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Profesores</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{publicStats.averageImprovement}</p>
                <p className="text-sm text-gray-600">Mejora Promedio</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Target className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{publicStats.completedAssignments.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Tareas Completadas</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{publicStats.successRate}%</p>
                <p className="text-sm text-gray-600">Tasa de Éxito</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Improvement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Mejora por Materia - Comparativa Nacional</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subjectStats.map((subject, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                      <span className="font-medium text-gray-900">{subject.subject}</span>
                    </div>
                    <Badge variant="success">{subject.improvement}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Antes: {subject.beforeAverage}</span>
                      <span>Después: {subject.afterAverage}</span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full transition-all duration-500"
                          style={{ 
                            backgroundColor: subject.color,
                            width: `${(subject.afterAverage / 5) * 100}%` 
                          }}
                        />
                      </div>
                      <div 
                        className="absolute top-0 h-3 w-1 bg-gray-400 rounded-full"
                        style={{ left: `${(subject.beforeAverage / 5) * 100}%` }}
                        title={`Promedio anterior: ${subject.beforeAverage}`}
                      />
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    {subject.studentsImpacted.toLocaleString()} estudiantes beneficiados
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Institution Highlights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <School className="w-5 h-5 text-green-600" />
              <span>Instituciones Destacadas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {institutionHighlights.map((institution, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{institution.name}</h4>
                      <p className="text-sm text-gray-600">{institution.location}</p>
                    </div>
                    <Badge variant="secondary">{institution.averageGrade}</Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estudiantes:</span>
                      <span className="font-medium">{institution.students}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mejora:</span>
                      <span className={`font-medium ${getImprovementColor(institution.improvement)}`}>
                        {institution.improvement}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                    🏆 {institution.highlight}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>Progreso Mensual del Programa</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyProgress.map((month, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{month.month}</h4>
                      <p className="text-sm text-gray-600">
                        {month.students.toLocaleString()} estudiantes activos
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="text-lg">
                      {month.average}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">Promedio Nacional</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center py-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl text-white">
          <Globe className="w-16 h-16 mx-auto mb-4 text-white" />
          <h2 className="text-3xl font-bold mb-4">
            ¿Quieres ser parte del cambio?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Únete a cientos de instituciones que ya están transformando la educación con Altius Academy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/institution-register">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
                Registrar Institución
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700">
                Crear Cuenta
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorDashboard;