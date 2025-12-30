/**
 * Navbar Component - Enhanced header
 */

import { Menu, X, LogOut, Settings, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartMenu from './CartMenu';

const Navbar = ({ user = null, onLogout, isDarkMode = false, toggleTheme = () => {} }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    if (onLogout) onLogout();
    navigate('/');
  };

  return (
    <nav className={`${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'} border-b shadow-sm sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-r from-red-500 to-orange-500 rounded-lg" />
            <span className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Off<span className="text-red-500">Shore</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}>Home</Link>
            {user ? (
              <>
                <Link to="/dashboard" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}>Dashboard</Link>
                <Link to="/categories" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}>Shop</Link>
                <Link to="/orders" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}>Orders</Link>
                <Link to="/profile" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}>Profile</Link>
              </>
            ) : (
              <>
                <Link to="/login" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}>Login</Link>
                <Link to="/signup" className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition ${isDarkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user && (
              <button
                onClick={handleLogout}
                className={`p-2 rounded-lg ${isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-500'} transition`}
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-gray-600"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className={`md:hidden pb-4 border-t ${isDarkMode ? 'border-gray-800 bg-gray-800' : 'border-gray-200'}`}>
            <Link to="/" className={`block px-4 py-2 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
              Home
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className={`block px-4 py-2 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                  Dashboard
                </Link>
                <Link to="/categories" className={`block px-4 py-2 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                  Shop
                </Link>
                <Link to="/orders" className={`block px-4 py-2 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                  Orders
                </Link>
                <Link to="/profile" className={`block px-4 py-2 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className={`w-full text-left px-4 py-2 ${isDarkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-50'}`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={`block px-4 py-2 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                  Login
                </Link>
                <Link to="/signup" className={`block px-4 py-2 font-semibold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
