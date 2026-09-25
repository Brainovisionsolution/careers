import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Opportunities', path: '/careers' },
  { name: 'Assessment', path: '/assessment' },
  { name: 'About Brainovision', path: '/life' },
  { name: 'Hiring Process', path: '/process' },
  { name: 'Contact', path: '/contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white/80 backdrop-blur-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          <Link to="/" className="flex items-center">
            <img
              src="/bov-yellow.png"
              alt="Brainovision"
              className="h-14 lg:h-16 w-auto object-contain"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path 
                    ? 'text-blue-600 font-semibold' 
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link 
              to="/assessment" 
              className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 text-xs font-bold rounded-lg transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>Assessment Portal</span>
            </Link>
            <Link 
              to="/apply" 
              className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all shadow-md hover:shadow-lg"
            >
              Apply Now
            </Link>
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }} 
            className="lg:hidden bg-white border-t border-slate-100"
          >
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`block py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link 
                to="/assessment" 
                className="block w-full py-2.5 mt-4 bg-blue-50 text-blue-700 border border-blue-200 text-center font-bold text-xs rounded-lg hover:bg-blue-100"
              >
                Candidate Assessment Portal
              </Link>
              <Link 
                to="/apply" 
                className="block w-full py-2.5 mt-2 bg-blue-600 text-white text-center font-bold text-xs rounded-lg hover:bg-blue-700"
              >
                Apply Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}