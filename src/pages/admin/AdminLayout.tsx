import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { LayoutDashboard, Briefcase, Users, Calendar, BarChart3, Menu, X, Brain } from 'lucide-react';

const sidebarItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Jobs', path: '/admin/jobs', icon: Briefcase },
  { name: 'Candidates', path: '/admin/candidates', icon: Users },
  { name: 'Interviews', path: '/admin/interviews', icon: Calendar },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-slate-800">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-lg flex items-center justify-center"><Brain className="w-5 h-5 text-white" /></div>
              <span className="text-white font-bold">HR Admin</span>
            </Link>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                  <item.icon className="w-5 h-5" />{item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-slate-800">
            <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm">Back to Website</Link>
          </div>
        </div>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white shadow-sm flex items-center px-4 lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg lg:hidden hover:bg-slate-100"><Menu className="w-5 h-5 text-slate-600" /></button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900">HR Dashboard</p>
              <p className="text-xs text-slate-500">Brainovision Technologies</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">HR</div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">{<Outlet />}</main>
      </div>
    </div>
  );
}
