import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Clock, Filter, Search, ArrowRight, Sparkles, DollarSign, Building } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { defaultJobs } from '../data/defaultJobs';
import type { Job } from '../types/database';

const categories = [
  'All',
  'AI-Powered Web Development',
  'Agentic AI & Quantum Computing',
  'Generative AI & AWS',
  'Campus Recruitment',
];

export function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, selectedCategory, searchQuery]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setJobs(data);
        setFilteredJobs(data);
      } else {
        // Fallback to rich curated default Brainovision openings
        setJobs(defaultJobs);
        setFilteredJobs(defaultJobs);
      }
    } catch {
      setJobs(defaultJobs);
      setFilteredJobs(defaultJobs);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((job) => job.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(q) ||
          job.department?.toLowerCase().includes(q) ||
          job.location?.toLowerCase().includes(q) ||
          job.description?.toLowerCase().includes(q)
      );
    }
    setFilteredJobs(filtered);
  };

  return (
    <main className="pt-20 lg:pt-24 min-h-screen bg-slate-50/70">
      {/* Hero Header - White & Royal Blue Mixed Theme */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Brainovision Solutions India Pvt. Ltd. • Hiring 2026</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
              Career Opportunities
            </h1>
            <p className="text-blue-100/90 text-base sm:text-lg max-w-2xl leading-relaxed">
              Explore open engineering, AI research, cloud architecture, and academic leadership positions. Join a dynamic team advancing technology education across India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Search & Filter Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by role title, technology, department, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600 ml-1" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full lg:w-auto px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Counter Bar */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="text-slate-600 text-sm">
            Showing <span className="font-bold text-slate-900">{filteredJobs.length}</span>{' '}
            {filteredJobs.length === 1 ? 'position' : 'active positions'}
          </p>
          <div className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Pan-India & Hyderabad Openings
          </div>
        </div>

        {/* Job Listings Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-pulse space-y-4">
                <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-3 bg-slate-200 rounded w-full"></div>
                <div className="h-8 bg-slate-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8"
          >
            <Building className="w-12 h-12 text-blue-300 mx-auto mb-3" />
            <p className="text-slate-700 font-bold text-lg">No matching positions found</p>
            <p className="text-slate-500 text-sm mt-1 mb-4">
              Try adjusting your search criteria or domain filter.
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <div className="bg-white rounded-2xl p-6 h-full flex flex-col border border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors leading-snug">
                        <Link to={`/careers/${job.id}`}>{job.title}</Link>
                      </h3>
                      <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-blue-600" />
                        <span>{job.department}</span>
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold rounded-full flex-shrink-0">
                      {job.positions_available} {job.positions_available === 1 ? 'Opening' : 'Openings'}
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-lg">
                      <Briefcase className="w-3 h-3 text-blue-600" />
                      <span className="capitalize">{job.employment_type}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-lg">
                      <Clock className="w-3 h-3 text-blue-600" />
                      <span>{job.experience_min}-{job.experience_max} yrs exp</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-lg">
                      <MapPin className="w-3 h-3 text-blue-600" />
                      <span className="truncate max-w-[140px]">{job.location}</span>
                    </span>
                    {job.salary_min && job.salary_max && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg font-semibold">
                        <DollarSign className="w-3 h-3 text-emerald-600" />
                        <span>{job.salary_min} - {job.salary_max} LPA</span>
                      </span>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                      {job.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/apply?jobId=${job.id}`}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
                      >
                        Apply
                      </Link>
                      <Link
                        to={`/careers/${job.id}`}
                        className="px-3.5 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
