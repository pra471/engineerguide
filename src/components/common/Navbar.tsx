import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, BookOpen, User, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-blue-900 to-pink-900 transition-all duration-300 py-4"
    >
      <div className="flex justify-between items-center w-full max-w-none">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-extrabold text-gradient drop-shadow-lg tracking-wide">EngineerGuide</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`hover:text-blue-400 transition-colors ${
              location.pathname === '/' ? 'text-white font-bold' : 'text-blue-200'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/resources" 
            className={`hover:text-blue-400 transition-colors ${
              location.pathname.includes('/resources') ? 'text-white font-bold' : 'text-blue-200'
            }`}
          >
            Resources
          </Link>
          <Link 
            to="/help" 
            className={`hover:text-blue-400 transition-colors ${
              location.pathname === '/help' ? 'text-white font-bold' : 'text-blue-200'
            }`}
          >
            Help
          </Link>
          <Link 
            to="/admission" 
            className={`hover:text-blue-400 transition-colors ${
              location.pathname === '/admission' ? 'text-white font-bold' : 'text-blue-200'
            }`}
          >
            Admission
          </Link>
          {user && user.role === 'admin' && (
            <Link 
              to="/assiste" 
              className={`hover:text-blue-400 transition-colors ${
                location.pathname === '/assiste' ? 'text-white font-bold' : 'text-blue-200'
              }`}
            >
              Assiste
            </Link>
          )}
          
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-1 hover:text-blue-600 focus:outline-none transition-colors"
              >
                <span>{user.username}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 glass-card rounded-xl py-1 z-10"
                  >
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 hover:bg-white/50 transition-colors flex items-center"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="block px-4 py-2 hover:bg-white/50 transition-colors flex items-center"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Link>
                    )}
                    <button 
                      onClick={() => {
                        handleLogout();
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-white/50 transition-colors flex items-center text-red-600"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Button 
                variant="glass"
                className="bg-gradient-to-r from-yellow-700 via-pink-800 to-blue-900 text-blue-100 font-bold shadow hover:from-yellow-600 hover:to-blue-800"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
              <Button 
                variant="glass"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden focus:outline-none" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4"
          >
            <div className="flex flex-col space-y-4 py-2">
              <Link 
                to="/" 
                className="hover:text-blue-600 transition-colors px-2 py-2"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/resources" 
                className="hover:text-pink-400 transition-colors px-2 py-2"
                onClick={() => setIsOpen(false)}
              >
                Resources
              </Link>
              <Link 
                to="/help"
                className="hover:text-blue-600 transition-colors px-2 py-2"
                onClick={() => setIsOpen(false)}
              >
                Help
              </Link>
              <Link 
                to="/admission"
                className="hover:text-blue-600 transition-colors px-2 py-2"
                onClick={() => setIsOpen(false)}
              >
                Admission
              </Link>
              {user && user.role === 'admin' && (
                <Link 
                  to="/assiste"
                  className="hover:text-blue-600 transition-colors px-2 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Assiste
                </Link>
              )}
              
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className="hover:text-blue-600 transition-colors px-2 py-2 flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="hover:text-blue-600 transition-colors px-2 py-2 flex items-center"
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-red-600 hover:text-red-700 transition-colors px-2 py-2 flex items-center w-full text-left"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Button 
                    variant="glass"
                    onClick={() => {
                      navigate('/login');
                      setIsOpen(false);
                    }}
                    fullWidth
                    className="mb-2"
                  >
                    Sign In
                  </Button>
                  <Button 
                    variant="glass"
                    onClick={() => {
                      navigate('/signup');
                      setIsOpen(false);
                    }}
                    fullWidth
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;