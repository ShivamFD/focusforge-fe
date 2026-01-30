import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout } = useAuthContext();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">FocusForge</span>
            </Link>
            <div className="animate-pulse text-gray-500">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">FocusForge</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/"
                className="text-gray-500 hover:text-gray-700 px-1 pt-1 font-medium"
              >
                Home
              </Link>
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="text-gray-500 hover:text-gray-700 px-1 pt-1 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-gray-500 hover:text-gray-700 px-1 pt-1 font-medium"
                  >
                    Register
                  </Link>
                </>
              )}
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className="text-gray-500 hover:text-gray-700 px-1 pt-1 font-medium"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 hidden md:block">
                  Welcome, {user.publicProfile?.alias || user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;