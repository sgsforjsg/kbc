import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, userData } = useAuth();

  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-white text-xl font-bold">
          <Link to="/">MyApp</Link>
        </div>
        
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-300 hover:text-white">
            Home
          </Link>

          {user && userData?.role === 'admin' && (
            <Link to="/admin" className="text-gray-300 hover:text-white">
              Admin
            </Link>
          )}

          {user ? (
            <>
              <span className="text-gray-300">{userData?.name || user.email}</span>
              <button 
                onClick={logout} 
                className="bg-red-500 text-white px-3 py-2 rounded-md text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white">
                Login
              </Link>
              <Link to="/signup" className="text-gray-300 hover:text-white">
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          <button id="menu-btn" className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Items */}
      <div id="mobile-menu" className="hidden md:hidden">
        <Link to="/" className="block px-4 py-2 text-sm text-gray-300 hover:text-white">
          Home
        </Link>
        {user && userData?.role === 'admin' && (
          <Link to="/admin" className="block px-4 py-2 text-sm text-gray-300 hover:text-white">
            Admin
          </Link>
        )}
        {user ? (
          <>
            <span className="block px-4 py-2 text-sm text-gray-300">{userData?.name || user.email}</span>
            <button 
              onClick={logout} 
              className="block w-full text-left px-4 py-2 text-sm bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="block px-4 py-2 text-sm text-gray-300 hover:text-white">
              Login
            </Link>
            <Link to="/signup" className="block px-4 py-2 text-sm text-gray-300 hover:text-white">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
