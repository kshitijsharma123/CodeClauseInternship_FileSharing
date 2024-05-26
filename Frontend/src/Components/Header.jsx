import React from 'react';


const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <a href="/" className="text-2xl font-bold">Sharing</a>
      </div>
      <nav className="hidden md:flex space-x-4">
        
        {/* Add more links based on your website functionalities */}
      </nav>
    </header>
  );
};

export default Header;
