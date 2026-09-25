import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Clock, ArrowLeft, CheckCircle, Building, DollarSign, Share2, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { defaultJobs } from '../data/defaultJobs';
import type { Job } from '../types/database';

export function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const { data } = await supabase.from('jobs').select('*').eq('id', id).single();
      if (data) {
        setJob(data);
      } else {
        const fallback = defaultJobs.find((j) => j.id === id);
        if (fallback) setJob(fallback);
      }
    } catch {
      const fallback = defaultJobs.find((j) => j.id === id);
      if (fallback) setJob(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <main className="pt-20 lg:pt-24 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 py-12 w-full animate-pulse space-y-4">
          <div className="h-8 bg-blue-100 rounded w-1/2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-32 bg-white rounded-2xl shadow-sm"></div>
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="pt-20 lg:pt-24 min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full">
          <Building className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Position Not Found</h1>
          <p className="text-slate-500 text-sm mb-6">
            The opening you are looking for might have been filled or updated.
          </p>
          <Link
            to="/careers"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl inline-block transition-colors"
          >
            Explore All Open Roles
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 lg:pt-24 min-h-screen bg-slate-50/70">
      {/* Hero Header - White & Royal Blue Mixed Theme */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-6 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Positions</span>
            </button>

            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-bold rounded-full">
                    {job.category}
                  </span>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold rounded-full">
                    {job.positions_available} {job.positions_available === 1 ? 'Opening' : 'Openings Available'}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                  {job.title}
                </h1>
                <p className="text-blue-100/90 text-sm sm:text-base font-medium flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-300" />
                  <span>{job.department} • Brainovision Solutions India Pvt. Ltd.</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to={`/apply?jobId=${job.id}`}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-400 active:bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Apply for this Role
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-blue-800/60 text-blue-100 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-300" />
                <span>{job.location}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 capitalize">
                <Briefcase className="w-4 h-4 text-blue-300" />
                <span>{job.employment_type} ({job.work_mode || 'Hybrid'})</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-300" />
                <span>{job.experience_min}-{job.experience_max} years experience</span>
              </span>
              {job.salary_min && job.salary_max && (
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-300 bg-emerald-950/40 border border-emerald-400/30 px-2.5 py-0.5 rounded-lg">
                  <DollarSign className="w-4 h-4 text-emerald-300" />
                  <span>Annual Package: {job.salary_min}L - {job.salary_max}L CTC</span>
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Details */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 lg:p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>Role Overview</span>
              </h2>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                {job.description}
              </p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 lg:p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  Key Responsibilities
                </h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 lg:p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  Candidate Requirements
                </h2>
                <ul className="space-y-3">
                  {job.requirements.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits & Perks */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 lg:p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  Benefits & Growth at Brainovision
                </h2>
                <ul className="space-y-3">
                  {job.benefits.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>

          {/* Right Sticky Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 sticky top-24 space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                  Active Application Window
                </span>
                <h3 className="font-extrabold text-slate-900 text-lg mt-3 mb-1">
                  Ready to Apply?
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Join our Hyderabad campus or pan-India technology team. All candidates take our online aptitude and coding assessment.
                </p>
              </div>

              <Link
                to={`/apply?jobId=${job.id}`}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl text-center block shadow-md hover:shadow-lg transition-all"
              >
                Start Application Form
              </Link>

              <Link
                to="/assessment"
                className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs rounded-xl text-center block transition-all"
              >
                Go to Candidate Test Console
              </Link>

              <div className="pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Share this opportunity</span>
                  {copied && <span className="text-emerald-600 font-bold">Link copied!</span>}
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Copy Job Link</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
