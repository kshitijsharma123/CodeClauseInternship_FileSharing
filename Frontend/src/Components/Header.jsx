import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold">Sharing</Link>
      </div>
      <nav className="hidden md:flex space-x-4">
        <Link to="/upload" className="text-gray-300 hover:text-white">
          Upload
        </Link>
        <Link to="/files" className="text-gray-300 hover:text-white">
          Files
        </Link>
        {/* Add more links based on your website functionalities */}
      </nav>
    </header>
  );
};

export default Header;
