import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div className={`fixed left-0 top-0 w-64 bg-white h-full shadow-lg transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={onClose} className="p-4 text-gray-600 hover:text-gray-800">
          ✕
        </button>
        <nav className="mt-8">
          <ul>
            <li>
              <Link to="/" onClick={onClose} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Home</Link>
            </li>
            <li>
              <Link to="/services" onClick={onClose} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Services</Link>
            </li>
            <li>
              <Link to="/profile" onClick={onClose} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">About</Link>
            </li>
            <li>
              <Link to="/login" onClick={onClose} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Contact</Link>
            </li>
            
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
