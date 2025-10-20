import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import MagicLogoText from '../components/ui/MagicLogoText';

import { useAuthStore } from '../stores/authStore';
import { authApi } from '../services/api';
import { useFormValidation } from '../hooks/useFormValidation';

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
          institution: response.data.institution ?? null, // INSTITUCIÓN (puede ser null)
          academicGrade: response.data.academicGrade ?? null, // GRADO ACADÉMICO (puede ser null)
          isActive: true,
          createdAt: new Date().toISOString(),
        };

        console.log('Datos del usuario para el store:', userData);

        // Guardar usuario y token en el store de autenticación
        login(userData, response.data.token);
        
        // Navegar al dashboard
        navigate(from, { replace: true });
      } else {
        setError(response.data.message || 'Error en el login');
      }
      
    } catch (error: any) {
      console.error('Error en login:', error);
      
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
    <div className="min-h-screen bg-white">
      {/* Navbar igual al Home */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img
                src="/Logo.png"
                alt="MagicSmartKids"
                className="h-12 w-auto cursor-pointer"
                onClick={() => navigate('/')}
              />
              <MagicLogoText size="sm" layout="inline" showHoverEffects={false} className="hidden md:block" />
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline">Volver al Inicio</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido del formulario */}
      <section className="py-16 bg-gray-50 relative overflow-hidden">
        {/* Animaciones de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-6 h-6 bg-[#00C764] rounded-full top-20 left-10 animate-pulse"></div>
          <div className="absolute w-4 h-4 bg-[#F5A623] rounded-full top-40 right-20 animate-bounce"></div>
          <div className="absolute w-5 h-5 bg-[#2E5BFF] rounded-full bottom-30 left-32 animate-ping"></div>
          <div className="absolute w-3 h-3 bg-[#FF6B35] rounded-full top-60 right-40 animate-pulse delay-1000"></div>
          <div className="absolute w-7 h-7 bg-[#1494DE] rounded-full bottom-20 right-10 animate-bounce delay-500"></div>
        </div>

        <div className="relative z-10 max-w-md mx-auto px-4">

          <Card className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-heading text-[#00368F] mb-2">
                Iniciar Sesión
              </CardTitle>
              <p className="text-gray-600 font-body">
                Accede a tu mundo de aprendizaje mágico
              </p>
            </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-magic">
                <p className="text-sm text-error-700 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-magic-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-magic-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@magicsmartkids.com"
                    className="input-magic pl-12 h-12 text-base"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-error-600 font-medium">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-magic-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-magic-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Tu contraseña mágica"
                    className="input-magic pl-12 pr-12 h-12 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-magic-gray-400 hover:text-primary transition-colors touch-target-magic"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-error-600 font-medium">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-magic-border-medium text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  />
                  <span className="ml-3 text-sm text-magic-gray-600">Recordarme</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary-700 font-medium transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-[#00368F] hover:bg-[#2E5BFF] text-white transition-colors duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Iniciar Sesión Mágica</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-magic-gray-600">
                ¿No tienes una cuenta?{' '}
                <Link 
                  to="/register" 
                  className="text-primary hover:text-primary-700 font-semibold transition-colors"
                >
                  ¡Únete a la magia!
                </Link>
              </p>
            </div>


          </CardContent>
        </Card>
        </div>
      </section>

      {/* Footer igual al Home */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img
                src="/Logo.png"
                alt="MagicSmartKids"
                className="h-8 w-auto"
              />
              <MagicLogoText size="md" layout="inline" showHoverEffects={false} />
            </div>
            <p className="text-gray-600 mb-4 font-body">
              Plataforma educativa mágica para niños inteligentes
            </p>
            
            <div className="flex items-center justify-center gap-6 text-sm mb-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-[#00368F] transition-colors duration-300"
              >
                Inicio
              </Link>
              <Link
                to="/register"
                className="text-gray-600 hover:text-[#00368F] transition-colors duration-300"
              >
                Registrarse
              </Link>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-500 text-sm font-body">
                © 2025 MagicSmartKids. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;