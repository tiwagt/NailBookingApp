import React from 'react';
import { Brush } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const { currentUser } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Brush className="h-8 w-8 text-pink-500" />
              <span className="text-xl font-semibold text-gray-900">Nath Nails</span>
            </Link>
          </div>
          <div className="flex items-center space-x-8">
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
        </div>
      </div>
    </nav>
  );
}