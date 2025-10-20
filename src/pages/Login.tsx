import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../services/api';
import { useFormValidation } from '../hooks/useFormValidation';
import LoadingSpinner from '../components/LoadingSpinner';
import { normalizeRole } from '../utils/roleUtils';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const { errors, validateField, validateAll } = useFormValidation({
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      required: true,
      minLength: 6
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    
    if (errors[name]) {
      validateField(name, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAll(formData)) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('🔐 Iniciando login desde frontend:', {
        email: formData.email,
        password: '***' // No mostrar la contraseña en logs
      });

      // Llamada real a la API del backend
      const response = await authApi.login(formData.email, formData.password);
      
      console.log('✅ Respuesta del login:', response.data);

      // Verificar que el login fue exitoso
      if (response.data.success) {
        // Crear objeto de usuario con los datos del backend
        const userData = {
          id: response.data.userId.toString(),
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          role: normalizeRole(response.data.role), // Convertir rol del backend al frontend
          institutionId: response.data.institution?.id?.toString() || null,
          institution: response.data.institution ?? null, // ✅ INSTITUCIÓN (puede ser null)
          academicGrade: response.data.academicGrade ?? null, // ✅ GRADO ACADÉMICO (puede ser null)
          isActive: true,
          createdAt: new Date().toISOString(),
        };

        console.log('👤 Datos del usuario para el store:', userData);

        // Guardar usuario y token en el store de autenticación
        login(userData, response.data.token);
        
        // Navegar al dashboard
        navigate(from, { replace: true });
      } else {
        setError(response.data.message || 'Error en el login');
      }
      
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      
      // Manejar diferentes tipos de errores
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 400) {
        setError('Credenciales inválidas');
      } else if (error.response?.status >= 500) {
        setError('Error del servidor. Intenta más tarde.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        setError('No se puede conectar al servidor. Verifica tu conexión.');
      } else {
        setError('Error al iniciar sesión. Intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Función convertBackendRoleToFrontend removida - ahora usamos normalizeRole



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-white">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold">Altius Academy</span>
          </Link>
          <p className="mt-2 text-blue-100">Ingresa a tu cuenta</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Iniciar Sesión</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    className="pl-10"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Tu contraseña"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-600">Recordarme</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                  Regístrate aquí
                </Link>
              </p>
            </div>

            {/* Demo Accounts */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800 mb-2 font-medium">💡 Para probar el sistema:</p>
              <div className="space-y-1 text-xs text-blue-700">
                <p>1. Primero regístrate con cualquier email</p>
                <p>2. Luego inicia sesión con esas credenciales</p>
                <p className="mt-2">
                  <strong>Usuario de prueba creado:</strong><br/>
                  Email: test@altius.com<br/>
                  Contraseña: 123456
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;