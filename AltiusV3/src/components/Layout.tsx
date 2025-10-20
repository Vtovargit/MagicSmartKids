import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Sparkles
} from 'lucide-react';
import Logo from './ui/Logo';
import Header from './ui/Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-magic-blue-50 via-white to-magic-green-50">
      {/* Magic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-magic-yellow-300 rounded-full opacity-20 animate-magic-float"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-magic-orange-400 rounded-full opacity-15 animate-magic-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-magic-green-400 rounded-full opacity-25 animate-magic-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-8 h-8 bg-magic-blue-400 rounded-full opacity-20 animate-magic-float" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Use the new Header component */}
      <Header 
        showMobileMenu={isMobileMenuOpen}
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Content */}
      <main className="relative z-10 magic-container py-6 lg:py-8">
        <div className="magic-content-wrapper">
          {children}
        </div>
      </main>

      {/* Magic Footer */}
      <footer className="relative z-10 bg-gradient-to-r from-magic-blue-600 via-magic-blue-700 to-magic-green-600 text-white mt-auto">
        <div className="magic-container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo and Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Logo size="md" variant="full" className="brightness-0 invert" />
                <Sparkles className="h-5 w-5 text-magic-yellow-300 animate-pulse" />
              </div>
              <p className="text-magic-blue-100 text-sm leading-relaxed">
                Plataforma educativa que transforma el aprendizaje en una experiencia mágica, 
                interactiva y llena de descubrimientos para niños inteligentes.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-magic font-semibold text-lg text-magic-yellow-300 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Enlaces Rápidos
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/about" className="text-magic-blue-100 hover:text-magic-yellow-300 transition-colors duration-200 flex items-center gap-2">
                    <span className="w-1 h-1 bg-magic-yellow-300 rounded-full"></span>
                    Acerca de MagicSmartKids
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-magic-blue-100 hover:text-magic-yellow-300 transition-colors duration-200 flex items-center gap-2">
                    <span className="w-1 h-1 bg-magic-yellow-300 rounded-full"></span>
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="text-magic-blue-100 hover:text-magic-yellow-300 transition-colors duration-200 flex items-center gap-2">
                    <span className="w-1 h-1 bg-magic-yellow-300 rounded-full"></span>
                    Centro de Ayuda
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-magic-blue-100 hover:text-magic-yellow-300 transition-colors duration-200 flex items-center gap-2">
                    <span className="w-1 h-1 bg-magic-yellow-300 rounded-full"></span>
                    Política de Privacidad
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="font-magic font-semibold text-lg text-magic-yellow-300 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Contacto Mágico
              </h3>
              <div className="text-sm text-magic-blue-100 space-y-3">
                <p className="flex items-center gap-2">
                  <span className="text-magic-yellow-300">•</span>
                  <span>info@magicsmartkids.com</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-magic-yellow-300">•</span>
                  <span>+57 (1) 234-5678</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-magic-yellow-300">•</span>
                  <span>Lun - Vie, 8:00 AM - 6:00 PM</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-magic-yellow-300">•</span>
                  <span>Soporte 24/7 para familias</span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-magic-blue-500 mt-8 pt-8 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-magic-blue-100 text-sm flex items-center gap-2">
                <span>© 2024 MagicSmartKids.</span>
                <Sparkles className="h-3 w-3 text-magic-yellow-300" />
                <span>Todos los derechos reservados.</span>
              </p>
              <p className="text-magic-blue-200 text-xs">
                Hecho con amor para niños inteligentes y familias extraordinarias
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;