import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Home, Info, Clock, BookOpen } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: '/', label: 'Predictor', icon: <Home className="w-5 h-5" /> },
    { to: '/about', label: 'How it Works', icon: <Info className="w-5 h-5" /> },
    { to: '/history', label: 'History', icon: <Clock className="w-5 h-5" /> },
    { to: '/docs', label: 'API Docs', icon: <BookOpen className="w-5 h-5" /> },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0f0f0f]/80 backdrop-blur-md border-b border-gray-800">
        <NavLink to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain drop-shadow-md" />
          <span className="font-bold text-lg text-white tracking-tight hidden sm:block">
            Ad Predictor
          </span>
        </NavLink>

        {/* Hamburger Icon */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Overlay Menu */}
      <div 
        className={`fixed inset-0 z-40 bg-[#0f0f0f]/95 backdrop-blur-xl flex flex-col pt-24 px-8 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="max-w-md w-full mx-auto flex flex-col gap-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeMenu}
              className={({ isActive }) => 
                `flex items-center gap-4 px-6 py-4 rounded-xl text-xl font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#4da5fc]/10 text-[#4da5fc] border border-[#4da5fc]/20' 
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}
