import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { LayoutDashboard, Briefcase, Users, Calendar, BarChart3, Menu, X, Award, ArrowLeft, ShieldCheck } from 'lucide-react';

const sidebarItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Campus Assessment', path: '/admin/assessment', icon: Award },
  { name: 'Jobs & Openings', path: '/admin/jobs', icon: Briefcase },
  { name: 'Candidates', path: '/admin/candidates', icon: Users },
  { name: 'Interviews', path: '/admin/interviews', icon: Calendar },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f8faff] flex">
      {/* Sidebar - White & Blue Mixed Theme */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-blue-100 shadow-sm transform transition-transform duration-300 lg:translate-x-0 lg:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo & Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-blue-100/80 bg-white">
            <Link to="/admin" className="flex items-center gap-3">
              <img
                src="/bov-yellow.png"
                alt="Brainovision"
                className="h-10 w-auto object-contain"
              />
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 block">
                  HR Admin
                </span>
                <span className="text-[10px] text-slate-400 font-medium block">
                  Careers Portal
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Recruitment System
            </div>
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/80'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom link to main website */}
          <div className="p-4 border-t border-blue-100 bg-slate-50/50">
            <Link
              to="/"
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-blue-700 hover:bg-white rounded-lg border border-transparent hover:border-blue-200 transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-blue-600" />
              <span>Back to Public Website</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-blue-100/80 shadow-xs flex items-center px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl lg:hidden hover:bg-blue-50 text-slate-600"
          >
            <Menu className="w-5 h-5 text-blue-700" />
          </button>

          <div className="flex items-center gap-2 ml-2 lg:ml-0">
            <ShieldCheck className="w-4 h-4 text-blue-600 hidden sm:block" />
            <span className="text-xs font-bold text-slate-700 hidden sm:inline">
              Brainovision Solutions India Pvt. Ltd.
            </span>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900">Talent Acquisition Lead</p>
              <p className="text-[10px] text-blue-600 font-semibold">admin@brainovision.in</p>
            </div>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
              BV
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
