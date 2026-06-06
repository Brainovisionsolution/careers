import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, Plus, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Interview } from '../../types/database';

export function AdminInterviews() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchInterviews(); }, []);

  const fetchInterviews = async () => {
    const { data } = await supabase.from('interviews').select('*, application:applications(full_name, email, job:jobs(title))').order('scheduled_at', { ascending: true });
    if (data) setInterviews(data);
    setLoading(false);
  };

  const statusColors: Record<string, string> = { scheduled: 'bg-blue-100 text-blue-800', completed: 'bg-emerald-100 text-emerald-800', cancelled: 'bg-red-100 text-red-800', rescheduled: 'bg-orange-100 text-orange-800' };
  const typeLabels: Record<string, string> = { screening: 'Resume Screening', technical: 'Technical Evaluation', demo: 'Demo Teaching', hr: 'HR Discussion' };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Interviews</h1>
        <button className="btn-primary flex items-center gap-2"><Plus className="w-5 h-5" />Schedule Interview</button>
      </div>
      {loading ? <div className="bg-white rounded-xl shadow-sm p-8"><div className="animate-pulse space-y-6">{[1, 2, 3].map((i) => (<div key={i} className="flex gap-4"><div className="w-20 h-20 bg-slate-200 rounded-lg"></div><div className="flex-1 space-y-2"><div className="h-4 bg-slate-200 rounded w-1/3"></div><div className="h-3 bg-slate-200 rounded w-1/2"></div></div></div>))}</div></div> : interviews.length === 0 ? <div className="bg-white rounded-xl shadow-sm p-8 text-center"><Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" /><p className="text-slate-500">No interviews scheduled</p></div> : (
        <div className="space-y-4">
          {interviews.map((interview, index) => (
            <motion.div key={interview.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-lg flex flex-col items-center justify-center text-blue-600">
                    <span className="text-xs font-medium">{interview.scheduled_at ? new Date(interview.scheduled_at).toLocaleDateString('en-US', { month: 'short' }) : 'TBD'}</span>
                    <span className="text-lg font-bold">{interview.scheduled_at ? new Date(interview.scheduled_at).getDate() : '--'}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900">{typeLabels[interview.interview_type]}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[interview.status]}`}>{interview.status}</span>
                    </div>
                    <p className="text-slate-600 mb-2">Candidate: <span className="font-medium">{interview.application?.full_name}</span></p>
                    <p className="text-sm text-slate-500">Position: {interview.application?.job?.title}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
                  <div className="flex items-center gap-2 text-sm text-slate-600"><Clock className="w-4 h-4 text-slate-400" />{interview.scheduled_at ? new Date(interview.scheduled_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Not scheduled'} ({interview.duration_minutes} min)</div>
                  {interview.interviewer_name && <div className="flex items-center gap-2"><div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 text-xs font-medium">{interview.interviewer_name.charAt(0)}</div><span className="text-sm text-slate-600">{interview.interviewer_name}</span></div>}
                  <div className="flex items-center gap-2">
                    {interview.meeting_link && <a href={interview.meeting_link} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2"><Video className="w-4 h-4" />Join</a>}
                    <button className="p-2 hover:bg-slate-100 rounded-lg"><Edit className="w-5 h-5 text-slate-600" /></button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
