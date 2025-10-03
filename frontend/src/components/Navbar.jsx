import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all transform group-hover:scale-105">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
              BookNest
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link to="/" className="text-gray-700 hover:text-orange-600 font-semibold transition-colors">
                  Browse
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-orange-600 font-semibold transition-colors">
                  Profile
                </Link>
                <Link to="/add-book" className="text-gray-700 hover:text-orange-600 font-semibold transition-colors">
                  Add Book
                </Link>
                
                {/* User Avatar */}
                <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">Member</p>
                  </div>
                </div>

                <button onClick={handleLogout} className="text-gray-700 hover:text-orange-600 font-semibold transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="text-gray-700 hover:text-orange-600 font-semibold transition-colors">
                  Browse Books
                </Link>
                <Link to="/login" className="text-gray-700 hover:text-orange-600 font-semibold transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="space-y-3">
                {/* User Info */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-rose-50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>

                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl font-semibold transition-colors">
                  Browse Books
                </Link>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl font-semibold transition-colors">
                  My Profile
                </Link>
                <Link to="/add-book" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl font-semibold transition-colors">
                  Add Book
                </Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl font-semibold transition-colors">
                  Browse Books
                </Link>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl font-semibold transition-colors">
                  Login
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-bold text-center shadow-lg">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
