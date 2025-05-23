
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Car, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">AutoPremium</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Início
            </Link>
            <Link to="/catalog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Catálogo
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Sobre
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Contato
            </Link>
          </div>

          {/* Admin Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/admin">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </Button>
            </Link>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <User className="h-4 w-4 mr-2" />
              Entrar
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Início
              </Link>
              <Link 
                to="/catalog" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Catálogo
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sobre
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contato
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <Link to="/admin" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 w-full">
                  <User className="h-4 w-4 mr-2" />
                  Entrar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
