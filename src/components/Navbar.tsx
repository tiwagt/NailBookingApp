import { useState } from 'react';
import { Brush } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


export function Navbar() {
  const { currentUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenuAndNavigate = (path) => {
    setMobileMenuOpen(false); // Close the menu
    navigate(path); // Navigate to the new page
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Brush className="h-8 w-8 text-pink-500" />
              <span className="text-xl font-semibold text-gray-900">Nath Nails</span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-pink-500">Home</Link>
            <Link to="/services" className="text-gray-700 hover:text-pink-500">Services</Link>
            {currentUser ? (
              <>
                <Link to="/profile" className="text-gray-700 hover:text-pink-500">Profile</Link>
                <Link to="/book" className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600">
                  Book Now
                </Link>
              </>
            ) : (
              <Link to="/login" className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 hover:text-pink-500 focus:outline-none"
          >
            <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
            {mobileMenuOpen ? (
              // "X" Icon
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger Icon
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-4 pt-4 pb-4 space-y-4">
            <Link to="/" className="block text-gray-700 hover:text-pink-500">Home</Link>
            <Link to="/services" className="block text-gray-700 hover:text-pink-500">Services</Link>
            {currentUser ? (
              <>
                 <button
              onClick={() => closeMenuAndNavigate("/")}
              className="block text-gray-700 hover:text-pink-500 w-full text-left"
            >
              Home
            </button>

                <Link
                  to="/book"
                  className="block bg-pink-500 text-white px-4 py-2 rounded-md text-center hover:bg-pink-600"
                  onClick={handleLinkClick}
                >
                  Book Now
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="block bg-pink-500 text-white px-4 py-2 rounded-md text-center hover:bg-pink-600"
                onClick={handleLinkClick}
              >
                Sign In
              </Link>
            )}



          </div>
        </div>
      )}
    </nav>
  );
}
