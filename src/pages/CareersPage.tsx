import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Clock, Filter, Search, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Job } from '../types/database';

const categories = ['All', 'Agentic AI & Quantum Computing', 'AI-Powered Web Development', 'Generative AI & AWS'];

export function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchJobs(); }, []);
  useEffect(() => { filterJobs(); }, [jobs, selectedCategory, searchQuery]);

  const fetchJobs = async () => {
    const { data } = await supabase.from('jobs').select('*').eq('is_active', true).order('created_at', { ascending: false });
    if (data) { setJobs(data); setFilteredJobs(data); }
    setLoading(false);
  };

  const filterJobs = () => {
    let filtered = jobs;
    if (selectedCategory !== 'All') filtered = filtered.filter((job) => job.category === selectedCategory);
    if (searchQuery) filtered = filtered.filter((job) => job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredJobs(filtered);
  };

  return (
    <main className="pt-20 lg:pt-24 min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">Open Positions</h1>
            <p className="text-slate-300 text-lg max-w-2xl">Find your perfect role and join our mission to transform technology education</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" placeholder="Search positions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="input-field w-auto">
                {categories.map((category) => (<option key={category} value={category}>{category}</option>))}
              </select>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600">Showing <span className="font-semibold">{filteredJobs.length}</span> {filteredJobs.length === 1 ? 'position' : 'positions'}</p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">{[1, 2, 3, 4].map((i) => (<div key={i} className="card p-6 animate-pulse"><div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div><div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div><div className="h-3 bg-slate-200 rounded w-full mb-2"></div><div className="h-8 bg-slate-200 rounded w-1/3"></div></div>))}</div>
        ) : filteredJobs.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <p className="text-slate-600 text-lg">No positions found</p>
            <p className="text-slate-500 mt-2">Try adjusting your filters</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredJobs.map((job, index) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }}>
                <Link to={`/careers/${job.id}`} className="block group">
                  <div className="card p-6 h-full hover:border-blue-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{job.title}</h3>
                        <p className="text-sm text-slate-500">{job.department}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex-shrink-0">{job.positions_available} Open</span>
                    </div>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{job.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded"><Briefcase className="w-3 h-3" />{job.employment_type}</span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded"><Clock className="w-3 h-3" />{job.experience_min}-{job.experience_max} years</span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded"><MapPin className="w-3 h-3" />{job.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">{job.category}</span>
                      <span className="flex items-center text-blue-600 font-medium text-sm gap-1 group-hover:gap-2 transition-all">View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
