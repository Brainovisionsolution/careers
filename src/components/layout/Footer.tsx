import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Twitter, Youtube } from 'lucide-react';

const quickLinks = [
  { name: 'Open Opportunities', path: '/careers' },
  { name: 'Candidate Assessment Portal', path: '/assessment' },
  { name: 'Our Hiring Process', path: '/process' },
  { name: 'Life & Culture at Brainovision', path: '/life' },
  { name: 'Apply for Openings', path: '/apply' },
  { name: 'Contact Recruitment Team', path: '/contact' },
];

const categories = [
  'Agentic AI & Quantum Computing',
  'AI-Powered Web Development',
  'Generative AI & AWS Cloud',
  'Campus Recruitment 2026'
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#0a1b38] to-[#050e1f] text-white border-t border-blue-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <img
                src="/bov-yellow.png"
                alt="Brainovision Solutions"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-blue-100/70 text-sm leading-relaxed mb-6">
              Brainovision Solutions India Pvt. Ltd. — Shaping the next generation of engineers through advanced AI research, enterprise cloud solutions, and national campus hiring programs.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://www.linkedin.com/company/brainovision" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-blue-900/40 border border-blue-800/60 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors text-blue-200 hover:text-white">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com/brainovision" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-blue-900/40 border border-blue-800/60 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors text-blue-200 hover:text-white">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://youtube.com/@brainovision" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-blue-900/40 border border-blue-800/60 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors text-blue-200 hover:text-white">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-4">Recruitment & Portal</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-blue-100/70 hover:text-white text-sm transition-colors flex items-center gap-1.5">
                    <span className="text-blue-500 font-bold">›</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-4">Strategic Practice Areas</h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category}>
                  <Link to="/careers" className="text-blue-100/70 hover:text-white text-sm transition-colors flex items-center gap-1.5">
                    <span className="text-blue-500 font-bold">›</span>
                    <span>{category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-4">Talent Acquisition Office</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-blue-100/70 text-sm">
                  Madhapur, HITEC City, Hyderabad, Telangana 500081, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a href="mailto:hiring@brainovision.in" className="text-blue-300 hover:text-white text-sm font-medium transition-colors">
                  hiring@brainovision.in
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a href="tel:+914049512345" className="text-blue-100/70 hover:text-white text-sm transition-colors">
                  +91 (040) 4951-2345 / +91 91212 55566
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-blue-900/40">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-blue-200/50 text-xs">
              &copy; {new Date().getFullYear()} Brainovision Solutions India Pvt. Ltd. All rights reserved. Recruitment Assessment System v2.6.
            </p>
            <div className="flex items-center gap-6 text-xs text-blue-200/50">
              <Link to="/assessment" className="hover:text-blue-300 transition-colors">Candidate Test Console</Link>
              <Link to="/admin" className="hover:text-blue-300 transition-colors">HR Command Center</Link>
              <span className="text-slate-600">|</span>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Assessment</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}