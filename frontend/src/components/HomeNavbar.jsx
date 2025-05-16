import React, { useState, useEffect } from 'react';
import { Menu, X, User, GraduationCap, Users, Home, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function HomeNavbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const handleHome = () => navigate('/');
  const handleAdmin = () => navigate('/admin-login');
  const handleAlumni = () => navigate('/alumni-login');
  const handleStudent = () => navigate('/student-login');
  const handleTp = () => navigate('/tplogin');
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 border-b border-red-300 transition-all duration-500 ease-in-out ${
      scrolled ? 'bg-black shadow-lg' : 'bg-black/90'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="font-extrabold text-xl tracking-tight flex items-center">
              <span className="text-red-500">Prep</span>
              <span className="text-white">Verse</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex">
              <NavButton onClick={handleHome} icon={<Home size={18} />} label="Home" />
              <div className="h-6 w-px bg-white/20 mx-1"></div>
              <NavButton onClick={handleAdmin} icon={<User size={18} />} label="Admin" />
              <div className="h-6 w-px bg-white/20 mx-1"></div>
              <NavButton onClick={handleStudent} icon={<GraduationCap size={18} />} label="Student" />
              <div className="h-6 w-px bg-white/20 mx-1"></div>
              <NavButton onClick={handleAlumni} icon={<Users size={18} />} label="Alumni" />
              <div className="h-6 w-px bg-white/20 mx-1"></div>
              <NavButton onClick={handleTp} icon={<Briefcase size={18} />} label="T&P" />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">            
            <button
              onClick={toggleMenu}
              className="p-2 text-white hover:text-red-500 focus:outline-none transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-500 bg-black ${
          isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-6 border-b border-white/10">
            <h1 className="font-extrabold text-xl tracking-tight flex items-center">
              <span className="text-red-500">Prep</span>
              <span className="text-white">Verse</span>
            </h1>
            <button
              onClick={toggleMenu}
              className="p-2 text-white hover:text-red-500 transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mobile Links */}
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <MobileNavButton 
              onClick={handleHome} 
              icon={<Home size={22} />} 
              label="Home" 
            />
            <div className="w-16 h-px bg-white/10 my-6"></div>
            <MobileNavButton 
              onClick={handleAdmin} 
              icon={<User size={22} />} 
              label="Admin" 
            />
            <div className="w-16 h-px bg-white/10 my-6"></div>
            <MobileNavButton 
              onClick={handleStudent} 
              icon={<GraduationCap size={22} />} 
              label="Student" 
            />
            <div className="w-16 h-px bg-white/10 my-6"></div>
            <MobileNavButton 
              onClick={handleAlumni} 
              icon={<Users size={22} />} 
              label="Alumni" 
            />
            <div className="w-16 h-px bg-white/10 my-6"></div>
            <MobileNavButton 
              onClick={handleTp} 
              icon={<Briefcase size={22} />} 
              label="T&P" 
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

// Desktop Button
function NavButton({ onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className="group relative px-4 py-2"
    >
      <div className="flex items-center gap-2 relative z-10 text-white font-medium tracking-wide uppercase text-sm transition-all duration-300 group-hover:text-red-500">
        {icon}
        <span>{label}</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-red-500 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></div>
    </button>
  );
}

// Mobile Button
function MobileNavButton({ onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className="group w-full max-w-xs transition-all duration-300 flex flex-col items-center gap-3"
    >
      <div className="text-white transition-transform duration-300 group-hover:scale-110 group-hover:text-red-500">
        {icon}
      </div>
      <span className="text-white font-medium tracking-widest uppercase text-sm group-hover:text-red-500 transition-colors duration-300">
        {label}
      </span>
      <div className="h-px w-0 bg-red-500 transition-all duration-300 group-hover:w-16"></div>
    </button>
  );
}

export default HomeNavbar;