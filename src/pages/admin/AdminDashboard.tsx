import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Briefcase, Calendar, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Application, Interview } from '../../types/database';

export function AdminDashboard() {
  const [stats, setStats] = useState({ totalJobs: 0, activeJobs: 0, totalApplications: 0, pendingApplications: 0, scheduledInterviews: 0, hiredThisMonth: 0 });
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: jobs } = await supabase.from('jobs').select('*');
      const { data: applications } = await supabase.from('applications').select('*, job:jobs(title)').order('applied_at', { ascending: false }).limit(5);
      const { data: interviews } = await supabase.from('interviews').select('*, application:applications(full_name, job:jobs(title))').eq('status', 'scheduled').order('scheduled_at', { ascending: true }).limit(5);

      const activeJobs = jobs?.filter((j) => j.is_active).length || 0;
      const pendingApps = applications?.filter((a) => a.status === 'pending').length || 0;
      const hiredThisMonth = applications?.filter((a) => a.status === 'hired' && new Date(a.updated_at).getMonth() === new Date().getMonth()).length || 0;

      setStats({ totalJobs: jobs?.length || 0, activeJobs, totalApplications: applications?.length || 0, pendingApplications: pendingApps, scheduledInterviews: interviews?.length || 0, hiredThisMonth });
      setRecentApplications(applications || []);
      setUpcomingInterviews(interviews || []);
    } catch (err) { console.error('Error fetching dashboard data:', err); }
    finally { setLoading(false); }
  };

  const statusColors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-800', screening: 'bg-blue-100 text-blue-800', technical: 'bg-cyan-100 text-cyan-800', demo: 'bg-orange-100 text-orange-800', hr: 'bg-emerald-100 text-emerald-800', offered: 'bg-green-100 text-green-800', hired: 'bg-emerald-100 text-emerald-800', rejected: 'bg-red-100 text-red-800' };

  if (loading) return <div className="animate-pulse"><div className="h-8 bg-slate-200 rounded w-48 mb-8"></div><div className="grid md:grid-cols-4 gap-6 mb-8">{[1, 2, 3, 4].map((i) => (<div key={i} className="h-32 bg-white rounded-xl"></div>))}</div></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-6 shadow-sm"><div className="flex items-center justify-between mb-4"><div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Briefcase className="w-6 h-6 text-blue-600" /></div><span className="text-sm text-emerald-600 font-medium">Active</span></div><div className="text-3xl font-bold text-slate-900">{stats.activeJobs}</div><div className="text-sm text-slate-500">Open Positions</div></motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-6 shadow-sm"><div className="flex items-center justify-between mb-4"><div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-emerald-600" /></div><span className="text-sm text-yellow-600 font-medium flex items-center gap-1"><AlertCircle className="w-4 h-4" />{stats.pendingApplications} Pending</span></div><div className="text-3xl font-bold text-slate-900">{stats.totalApplications}</div><div className="text-sm text-slate-500">Total Applications</div></motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-6 shadow-sm"><div className="flex items-center justify-between mb-4"><div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"><Calendar className="w-6 h-6 text-orange-600" /></div></div><div className="text-3xl font-bold text-slate-900">{stats.scheduledInterviews}</div><div className="text-sm text-slate-500">Scheduled Interviews</div></motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl p-6 shadow-sm"><div className="flex items-center justify-between mb-4"><div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center"><TrendingUp className="w-6 h-6 text-cyan-600" /></div><span className="text-sm text-cyan-600 font-medium">This Month</span></div><div className="text-3xl font-bold text-slate-900">{stats.hiredThisMonth}</div><div className="text-sm text-slate-500">Hired Candidates</div></motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm"><div className="p-6 border-b border-slate-100"><h2 className="text-lg font-semibold text-slate-900">Recent Applications</h2></div><div className="divide-y divide-slate-100">{recentApplications.length === 0 ? <div className="p-6 text-center text-slate-500">No applications yet</div> : recentApplications.map((app) => (<div key={app.id} className="p-4 flex items-center justify-between hover:bg-slate-50"><div><p className="font-medium text-slate-900">{app.full_name}</p><p className="text-sm text-slate-500">Applied for {app.job?.title || 'Unknown'}</p></div><span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[app.status]}`}>{app.status}</span></div>))}</div><div className="p-4 border-t border-slate-100"><Link to="/admin/candidates" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All Candidates</Link></div></div>
        <div className="bg-white rounded-xl shadow-sm"><div className="p-6 border-b border-slate-100"><h2 className="text-lg font-semibold text-slate-900">Upcoming Interviews</h2></div><div className="divide-y divide-slate-100">{upcomingInterviews.length === 0 ? <div className="p-6 text-center text-slate-500">No scheduled interviews</div> : upcomingInterviews.map((interview) => (<div key={interview.id} className="p-4 flex items-center justify-between hover:bg-slate-50"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><Clock className="w-5 h-5" /></div><div><p className="font-medium text-slate-900">{interview.application?.full_name}</p><p className="text-sm text-slate-500">{interview.interview_type} - {interview.scheduled_at ? new Date(interview.scheduled_at).toLocaleDateString() : 'TBD'}</p></div></div><span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">{interview.status}</span></div>))}</div><div className="p-4 border-t border-slate-100"><Link to="/admin/interviews" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All Interviews</Link></div></div>
      </div>
    </div>
  );
}
