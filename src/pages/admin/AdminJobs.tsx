import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { DEFAULT_JOBS } from '../../data/defaultJobs';
import type { Job } from '../../types/database';

export function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setJobs(data);
      } else {
        setJobs(DEFAULT_JOBS as any);
      }
    } catch {
      setJobs(DEFAULT_JOBS as any);
    }
    setLoading(false);
  };


  const toggleJobStatus = async (job: Job) => {
    const { error } = await supabase.from('jobs').update({ is_active: !job.is_active }).eq('id', job.id);
    if (!error) setJobs((prev) => prev.map((j) => j.id === job.id ? { ...j, is_active: !j.is_active } : j));
  };

  const deleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    const { error } = await supabase.from('jobs').delete().eq('id', jobId);
    if (!error) setJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  const filteredJobs = jobs.filter((job) => job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.category.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Job Management</h1>
        <button className="btn-primary flex items-center gap-2"><Plus className="w-5 h-5" />Add New Job</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="text" placeholder="Search jobs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? <div className="p-8 text-center"><div className="animate-pulse space-y-4">{[1, 2, 3].map((i) => (<div key={i} className="h-12 bg-slate-200 rounded"></div>))}</div></div> : filteredJobs.length === 0 ? <div className="p-8 text-center text-slate-500">No jobs found</div> : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Position</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Positions</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJobs.map((job, index) => (
                <motion.tr key={job.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="hover:bg-slate-50">
                  <td className="px-6 py-4"><div><p className="font-medium text-slate-900">{job.title}</p><p className="text-sm text-slate-500">{job.department}</p></div></td>
                  <td className="px-6 py-4"><span className="text-sm text-slate-600">{job.category}</span></td>
                  <td className="px-6 py-4"><span className="text-sm text-slate-600">{job.positions_available}</span></td>
                  <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${job.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>{job.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => toggleJobStatus(job)} className="p-2 hover:bg-slate-100 rounded-lg">{job.is_active ? <ToggleRight className="w-5 h-5 text-emerald-600" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}</button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg"><Edit className="w-5 h-5 text-blue-600" /></button>
                      <button onClick={() => deleteJob(job.id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5 text-red-600" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
