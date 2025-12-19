/**
 * Navbar Component - Enhanced header
 */

import { Menu, X, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user = null, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    if (onLogout) onLogout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg" />
            <span className="font-bold text-xl text-gray-900">
              Off<span className="text-red-500">Shore</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition">Home</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition">Dashboard</Link>
                <Link to="/profile" className="text-gray-600 hover:text-gray-900 transition">Profile</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 transition">Login</Link>
                <Link to="/signup" className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden md:flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-500 transition"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
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
          <div className="md:hidden pb-4 border-t border-gray-200">
            <Link to="/" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
              Home
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
                  Dashboard
                </Link>
                <Link to="/profile" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
                  Login
                </Link>
                <Link to="/signup" className="block px-4 py-2 text-red-600 font-semibold">
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
