import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, LayoutDashboard, CheckSquare, MessageSquare, Key, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Calendar', path: '/calendar', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare className="w-5 h-5" /> },
    { name: 'Chat', path: '/chat', icon: <MessageSquare className="w-5 h-5" /> },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen ? 'bg-white dark:bg-gray-800 shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <LayoutDashboard className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">TaskAI</span>
          </Link>

          {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:text-indigo-600 dark:hover:text-indigo-400 ${
                  location.pathname === link.path
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* User Menu - Desktop Only */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4 relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name}</span>
                </button>
                
                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-700'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
            
              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2">
                      <div className="flex items-center space-x-2 mb-2">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center space-x-2 px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Key className="w-5 h-5" />
                      <span>Log In</span>
                    </Link>
                    <Link
                      to="/signup"
                      className="flex items-center space-x-2 px-3 py-3 rounded-md text-base font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;