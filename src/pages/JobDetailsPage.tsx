import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Clock, ArrowLeft, CheckCircle, Building, DollarSign } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Job } from '../types/database';

export function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (id) fetchJob(); }, [id]);

  const fetchJob = async () => {
    const { data } = await supabase.from('jobs').select('*').eq('id', id).single();
    if (data) setJob(data);
    setLoading(false);
  };

  if (loading) return <main className="pt-20 lg:pt-24 min-h-screen bg-slate-50"><div className="max-w-4xl mx-auto px-4 py-12"><div className="animate-pulse"><div className="h-8 bg-slate-200 rounded w-1/2 mb-4"></div><div className="h-4 bg-slate-200 rounded w-1/3 mb-8"></div></div></div></main>;
  if (!job) return <main className="pt-20 lg:pt-24 min-h-screen bg-slate-50 flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold text-slate-900 mb-4">Position Not Found</h1><Link to="/careers" className="text-blue-600 hover:text-blue-700">View All Positions</Link></div></main>;

  return (
    <main className="pt-20 lg:pt-24 min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"><ArrowLeft className="w-4 h-4" />Back to Positions</button>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">{job.category}</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">{job.positions_available} Openings</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{job.title}</h1>
                <p className="text-slate-300">{job.department}</p>
              </div>
              <Link to={`/apply?jobId=${job.id}`} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">Apply Now</Link>
            </div>
            <div className="flex flex-wrap gap-4 mt-6 text-slate-300">
              <span className="inline-flex items-center gap-2 text-sm"><MapPin className="w-4 h-4" />{job.location}</span>
              <span className="inline-flex items-center gap-2 text-sm"><Briefcase className="w-4 h-4" />{job.employment_type}</span>
              <span className="inline-flex items-center gap-2 text-sm"><Clock className="w-4 h-4" />{job.experience_min}-{job.experience_max} years</span>
              {job.salary_min && job.salary_max && <span className="inline-flex items-center gap-2 text-sm"><DollarSign className="w-4 h-4" />LPA: {job.salary_min}L - {job.salary_max}L</span>}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-md p-6 lg:p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2"><Building className="w-5 h-5 text-blue-600" />Overview</h2>
              <p className="text-slate-700 leading-relaxed">{job.description}</p>
            </div>
            {job.responsibilities?.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 lg:p-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Responsibilities</h2>
                <ul className="space-y-3">{job.responsibilities.map((item, index) => (<li key={index} className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" /><span className="text-slate-700">{item}</span></li>))}</ul>
              </div>
            )}
            {job.requirements?.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 lg:p-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Requirements</h2>
                <ul className="space-y-3">{job.requirements.map((item, index) => (<li key={index} className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" /><span className="text-slate-700">{item}</span></li>))}</ul>
              </div>
            )}
            {job.preferred_skills?.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 lg:p-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Preferred Skills</h2>
                <ul className="space-y-3">{job.preferred_skills.map((item, index) => (<li key={index} className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" /><span className="text-slate-700">{item}</span></li>))}</ul>
              </div>
            )}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="font-semibold text-slate-900 mb-4">Apply for this Position</h3>
              <p className="text-slate-600 text-sm mb-6">Ready to join our team? Submit your application today.</p>
              <Link to={`/apply?jobId=${job.id}`} className="btn-primary w-full text-center block">Apply Now</Link>
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h4 className="font-medium text-slate-900 mb-3 text-sm">Share this job</h4>
                <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="flex-1 px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors w-full">Copy Link</button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
