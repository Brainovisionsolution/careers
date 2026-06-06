import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ExternalLink, Star, Mail, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Application } from '../../types/database';

const statusOptions = ['All', 'pending', 'screening', 'technical', 'demo', 'hr', 'offered', 'hired', 'rejected'];

export function AdminCandidates() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    const { data } = await supabase.from('applications').select('*, job:jobs(title, category)').order('applied_at', { ascending: false });
    if (data) setApplications(data);
    setLoading(false);
  };

  const updateStatus = async (appId: string, newStatus: string) => {
    const { error } = await supabase.from('applications').update({ status: newStatus }).eq('id', appId);
    if (!error) setApplications((prev) => prev.map((app) => app.id === appId ? { ...app, status: newStatus as any } : app));
  };

  const updateRating = async (appId: string, rating: number) => {
    const { error } = await supabase.from('applications').update({ rating }).eq('id', appId);
    if (!error) setApplications((prev) => prev.map((app) => app.id === appId ? { ...app, rating } : app));
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch = app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || app.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-800', screening: 'bg-blue-100 text-blue-800', technical: 'bg-cyan-100 text-cyan-800', demo: 'bg-orange-100 text-orange-800', hr: 'bg-emerald-100 text-emerald-800', offered: 'bg-green-100 text-green-800', hired: 'bg-emerald-100 text-emerald-800', rejected: 'bg-red-100 text-red-800' };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Candidates</h1>
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search candidates..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-auto">{statusOptions.map((status) => (<option key={status} value={status}>{status === 'All' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}</option>))}</select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? <div className="p-8 text-center"><div className="animate-pulse space-y-4">{[1, 2, 3].map((i) => (<div key={i} className="h-16 bg-slate-200 rounded"></div>))}</div></div> : filteredApps.length === 0 ? <div className="p-8 text-center text-slate-500">No candidates found</div> : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Candidate</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Position</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Rating</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Applied</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map((app, index) => (
                <motion.tr key={app.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">{app.full_name.charAt(0)}</div>
                      <div><p className="font-medium text-slate-900">{app.full_name}</p><p className="text-sm text-slate-500">{app.email}</p></div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><p className="text-sm font-medium text-slate-900">{app.job?.title || 'Unknown'}</p><p className="text-xs text-slate-500">{app.job?.category}</p></td>
                  <td className="px-6 py-4">
                    <select value={app.status} onChange={(e) => updateStatus(app.id, e.target.value)} className={`px-2.5 py-1 text-xs font-medium rounded-full border-0 cursor-pointer ${statusColors[app.status]}`}>
                      {statusOptions.slice(1).map((status) => (<option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">{[1, 2, 3, 4, 5].map((star) => (<button key={star} onClick={() => updateRating(app.id, star)} className="p-0.5"><Star className={`w-4 h-4 ${star <= (app.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} /></button>))}</div>
                  </td>
                  <td className="px-6 py-4"><span className="text-sm text-slate-600">{new Date(app.applied_at).toLocaleDateString()}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setSelectedApp(app)} className="p-2 hover:bg-slate-100 rounded-lg"><User className="w-5 h-5 text-blue-600" /></button>
                      <a href={`mailto:${app.email}`} className="p-2 hover:bg-slate-100 rounded-lg"><Mail className="w-5 h-5 text-emerald-600" /></a>
                      {app.linkedin_url && <a href={app.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-100 rounded-lg"><ExternalLink className="w-5 h-5 text-blue-600" /></a>}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedApp(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100"><h2 className="text-xl font-bold text-slate-900">Candidate Details</h2></div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">{selectedApp.full_name.charAt(0)}</div>
                <div><h3 className="text-lg font-semibold text-slate-900">{selectedApp.full_name}</h3><p className="text-sm text-slate-500">{selectedApp.email}</p><p className="text-sm text-slate-500">{selectedApp.phone}</p></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><p className="text-sm text-slate-500">Location</p><p className="font-medium text-slate-900">{selectedApp.location}</p></div>
                <div><p className="text-sm text-slate-500">Experience</p><p className="font-medium text-slate-900">{selectedApp.years_experience} years</p></div>
                <div><p className="text-sm text-slate-500">Current Company</p><p className="font-medium text-slate-900">{selectedApp.current_company || 'N/A'}</p></div>
                <div><p className="text-sm text-slate-500">Applied For</p><p className="font-medium text-slate-900">{selectedApp.job?.title}</p></div>
              </div>
              {selectedApp.expertise_areas?.length > 0 && (<div><p className="text-sm text-slate-500 mb-2">Expertise Areas</p><div className="flex flex-wrap gap-2">{selectedApp.expertise_areas.map((area) => (<span key={area} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">{area}</span>))}</div></div>)}
              {selectedApp.cover_letter && (<div><p className="text-sm text-slate-500 mb-2">Cover Letter</p><p className="text-slate-700 whitespace-pre-wrap">{selectedApp.cover_letter}</p></div>)}
              <div className="flex flex-wrap gap-3">
                {selectedApp.resume_url && <a href={selectedApp.resume_url} target="_blank" rel="noopener noreferrer" className="btn-outline flex items-center gap-2">View Resume <ExternalLink className="w-4 h-4" /></a>}
                {selectedApp.demo_video_url && <a href={selectedApp.demo_video_url} target="_blank" rel="noopener noreferrer" className="btn-outline flex items-center gap-2">Watch Demo <ExternalLink className="w-4 h-4" /></a>}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
