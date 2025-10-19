import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, MapPin, Phone, Mail, User, Users, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { useFormValidation } from '../hooks/useFormValidation';

const InstitutionRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    institutionName: '',
    address: '',
    phone: '',
    email: '',
    director: '',
    type: '',
    studentsCount: '',
    teachersCount: '',
    description: '',
    coordinatorFirstName: '',
    coordinatorLastName: '',
    coordinatorEmail: '',
    coordinatorPhone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const { errors, validateField, validateAll } = useFormValidation({
    institutionName: { required: true, minLength: 3 },
    address: { required: true, minLength: 10 },
    phone: { required: true, minLength: 7 },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    director: { required: true, minLength: 3 },
    type: { required: true },
    studentsCount: { required: true },
    teachersCount: { required: true },
    coordinatorFirstName: { required: true, minLength: 2 },
    coordinatorLastName: { required: true, minLength: 2 },
    coordinatorEmail: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    coordinatorPhone: { required: true, minLength: 7 }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    
    if (errors[name]) {
      validateField(name, value);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAll(formData)) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success response
      alert('¡Institución registrada exitosamente! El coordinador recibirá un email con las credenciales de acceso.');
      navigate('/');
      
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al registrar la institución');
    } finally {
      setIsLoading(false);
    }
  };

  const institutionTypes = [
    { value: 'public', label: 'Institución Pública' },
    { value: 'private', label: 'Institución Privada' },
    { value: 'mixed', label: 'Institución Mixta' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <School className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Registro de Institución</h1>
          <p className="text-gray-600 mt-2">
            Registra tu institución educativa en Altius Academy
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información de la Institución</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Institution Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la Institución *
                  </label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="institutionName"
                      name="institutionName"
                      value={formData.institutionName}
                      onChange={handleChange}
                      placeholder="Ej: Institución Educativa San José"
                      className="pl-10"
                    />
                  </div>
                  {errors.institutionName && (
                    <p className="mt-1 text-xs text-red-600">{errors.institutionName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Institución *
                  </label>
                  <Select onValueChange={(value) => handleSelectChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {institutionTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="mt-1 text-xs text-red-600">{errors.type}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección Completa *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Dirección completa de la institución"
                    className="pl-10"
                  />
                </div>
                {errors.address && (
                  <p className="mt-1 text-xs text-red-600">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Teléfono de la institución"
                      className="pl-10"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Institucional *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="contacto@institucion.edu.co"
                      className="pl-10"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="director" className="block text-sm font-medium text-gray-700 mb-1">
                  Director/Rector *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="director"
                    name="director"
                    value={formData.director}
                    onChange={handleChange}
                    placeholder="Nombre completo del director"
                    className="pl-10"
                  />
                </div>
                {errors.director && (
                  <p className="mt-1 text-xs text-red-600">{errors.director}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="studentsCount" className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Estudiantes *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="studentsCount"
                      name="studentsCount"
                      type="number"
                      value={formData.studentsCount}
                      onChange={handleChange}
                      placeholder="Cantidad aproximada"
                      className="pl-10"
                    />
                  </div>
                  {errors.studentsCount && (
                    <p className="mt-1 text-xs text-red-600">{errors.studentsCount}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="teachersCount" className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Profesores *
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="teachersCount"
                      name="teachersCount"
                      type="number"
                      value={formData.teachersCount}
                      onChange={handleChange}
                      placeholder="Cantidad aproximada"
                      className="pl-10"
                    />
                  </div>
                  {errors.teachersCount && (
                    <p className="mt-1 text-xs text-red-600">{errors.teachersCount}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción (Opcional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Breve descripción de la institución..."
                />
              </div>

              {/* Coordinator Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Información del Coordinador
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Esta persona será el coordinador principal y tendrá acceso completo al sistema.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="coordinatorFirstName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombres del Coordinador *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="coordinatorFirstName"
                        name="coordinatorFirstName"
                        value={formData.coordinatorFirstName}
                        onChange={handleChange}
                        placeholder="Nombres"
                        className="pl-10"
                      />
                    </div>
                    {errors.coordinatorFirstName && (
                      <p className="mt-1 text-xs text-red-600">{errors.coordinatorFirstName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="coordinatorLastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Apellidos del Coordinador *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="coordinatorLastName"
                        name="coordinatorLastName"
                        value={formData.coordinatorLastName}
                        onChange={handleChange}
                        placeholder="Apellidos"
                        className="pl-10"
                      />
                    </div>
                    {errors.coordinatorLastName && (
                      <p className="mt-1 text-xs text-red-600">{errors.coordinatorLastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label htmlFor="coordinatorEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Email del Coordinador *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="coordinatorEmail"
                        name="coordinatorEmail"
                        type="email"
                        value={formData.coordinatorEmail}
                        onChange={handleChange}
                        placeholder="coordinador@institucion.edu.co"
                        className="pl-10"
                      />
                    </div>
                    {errors.coordinatorEmail && (
                      <p className="mt-1 text-xs text-red-600">{errors.coordinatorEmail}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="coordinatorPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono del Coordinador *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="coordinatorPhone"
                        name="coordinatorPhone"
                        value={formData.coordinatorPhone}
                        onChange={handleChange}
                        placeholder="Teléfono personal"
                        className="pl-10"
                      />
                    </div>
                    {errors.coordinatorPhone && (
                      <p className="mt-1 text-xs text-red-600">{errors.coordinatorPhone}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Información importante:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• El coordinador recibirá un email con las credenciales de acceso</li>
                  <li>• Podrá crear cuentas para profesores y estudiantes</li>
                  <li>• Tendrá acceso a todos los reportes y estadísticas</li>
                  <li>• La institución será revisada antes de la activación</li>
                </ul>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Registrando...
                    </div>
                  ) : (
                    'Registrar Institución'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstitutionRegistration;