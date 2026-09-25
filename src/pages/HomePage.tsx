import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Cpu, Code, Cloud, Lightbulb, TrendingUp, Globe, BookOpen, DollarSign, Home, Award, Mic, MapPin, Briefcase, Clock, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Job, FAQ } from '../types/database';

const positions = [
  { title: 'Agentic AI & Quantum Computing', count: 10, icon: Cpu, color: 'from-blue-500 to-cyan-500', description: 'Lead cutting-edge training in autonomous AI systems and quantum algorithms' },
  { title: 'AI-Powered Web Development', count: 5, icon: Code, color: 'from-emerald-500 to-teal-500', description: 'Build intelligent web experiences with modern AI integration' },
  { title: 'Generative AI & AWS', count: 5, icon: Cloud, color: 'from-orange-500 to-amber-500', description: 'Master cloud-based AI solutions and generative technologies' },
];

const reasons = [
  { title: 'Innovation Driven', description: 'Work at the forefront of AI, Quantum Computing, and Cloud technologies.', icon: Lightbulb, color: 'blue' },
  { title: 'Career Growth', description: 'Clear advancement pathways with regular promotions.', icon: TrendingUp, color: 'emerald' },
  { title: 'Industry Impact', description: 'Train thousands of professionals worldwide.', icon: Globe, color: 'cyan' },
  { title: 'Continuous Learning', description: 'Access to cutting-edge courses and certifications.', icon: BookOpen, color: 'orange' },
];

const benefits = [
  { title: 'Competitive Salary', description: 'Industry-leading compensation with bonuses', icon: DollarSign },
  { title: 'Flexible Work', description: 'Hybrid model with remote options', icon: Home },
  { title: 'Certification Support', description: 'Full reimbursement for certifications', icon: Award },
  { title: 'Learning Budget', description: 'Annual budget for courses and resources', icon: BookOpen },
  { title: 'Career Advancement', description: 'Clear paths with mentorship', icon: TrendingUp },
  { title: 'Conferences', description: 'Attend top tech conferences worldwide', icon: Mic },
];

const galleryItems = [
  { image: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=600', title: 'Workshop Sessions', description: 'Hands-on training with experts', span: 'col-span-2' },
  { image: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=600', title: 'Hackathons', description: 'Innovation-driven challenges', span: 'col-span-1' },
  { image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600', title: 'Team Events', description: 'Building bonds beyond work', span: 'col-span-1' },
  { image: 'https://images.pexels.com/photos/3184611/pexels-photo-3184611.jpeg?auto=compress&cs=tinysrgb&w=600', title: 'Training Sessions', description: 'Empowering the next generation', span: 'col-span-2' },
];

const steps = [
  { title: 'Application', icon: Sparkles, description: 'Submit your application' },
  { title: 'Screening', icon: Lightbulb, description: 'Initial review' },
  { title: 'Technical', icon: Code, description: 'Skills assessment' },
  { title: 'Demo Teaching', icon: Briefcase, description: 'Teaching demonstration' },
  { title: 'HR Discussion', icon: Globe, description: 'Culture fit interview' },
  { title: 'Offer Letter', icon: ArrowRight, description: 'Welcome aboard' },
];

import { defaultJobs } from '../data/defaultJobs';

const defaultFaqs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How does the Brainovision Candidate Assessment process work?',
    answer: 'Once you apply or receive an invitation for a campus drive, you log into our secure Candidate Assessment Portal using your unique Candidate ID. You complete an online proctored test covering Quantitative Aptitude, Logical Reasoning, Verbal Ability, and Technical core concepts.',
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'faq-2',
    question: 'What are the technical and proctoring requirements for the assessment?',
    answer: 'You will need a desktop or laptop running Google Chrome or Edge with an active webcam, microphone, and stable internet connection. The system runs real-time automated proctoring including tab-switch detection, face presence checks, and full-screen enforcement.',
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'faq-3',
    question: 'When will assessment results and interview shortlists be declared?',
    answer: 'Scores and qualification status are computed immediately upon test submission. Eligible candidates receive automated email confirmation and an invitation to schedule technical and HR interview rounds within 24 to 48 hours.',
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'faq-4',
    question: 'Are positions available for fresh graduates (2025 / 2026 batch)?',
    answer: 'Yes! Our Graduate Engineering Trainee (GET) programs are specifically tailored for final-year students and fresh graduates in Computer Science, IT, and related engineering disciplines.',
    display_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: jobsData } = await supabase.from('jobs').select('*').eq('is_active', true).limit(6);
        const { data: faqsData } = await supabase.from('faqs').select('*').eq('is_active', true).order('display_order');
        if (jobsData && jobsData.length > 0) {
          setJobs(jobsData);
        } else {
          setJobs(defaultJobs.slice(0, 6));
        }
        if (faqsData && faqsData.length > 0) {
          setFaqs(faqsData);
        } else {
          setFaqs(defaultFaqs);
        }
      } catch {
        setJobs(defaultJobs.slice(0, 6));
        setFaqs(defaultFaqs);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50/80 via-white to-slate-50 pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-float animation-delay-200" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6 border border-blue-200"
              >
                <Sparkles className="w-4 h-4" />
                <span>Brainovision Solutions • Campus & Lateral Hiring 2026</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight"
              >
                Shape the Future of{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Enterprise AI</span> & Tech Education
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg lg:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                Join Brainovision's distinguished faculty of AI, Cloud, Quantum Computing, and Full-Stack Engineering experts. Build scalable software and empower the next generation of innovators.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link to="/assessment" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <ShieldCheck className="w-5 h-5 text-yellow-300" />
                  <span>Candidate Assessment Portal</span>
                </Link>
                <Link to="/careers" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-blue-700 border-2 border-blue-200 hover:border-blue-600 hover:bg-blue-50 font-bold rounded-xl transition-all shadow-sm">
                  <span>Explore Open Positions</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-12 grid grid-cols-3 gap-6"
              >
                <div className="text-center lg:text-left">
                  <div className="text-3xl lg:text-4xl font-bold text-slate-900">20+</div>
                  <div className="text-sm text-slate-600">Open Roles</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl lg:text-4xl font-bold text-slate-900">50K+</div>
                  <div className="text-sm text-slate-600">Trained Professionals</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl lg:text-4xl font-bold text-slate-900">100+</div>
                  <div className="text-sm text-slate-600">Corporate Partners</div>
                </div>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="rounded-2xl shadow-2xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Technology education and training session"
                  className="w-full h-auto object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hiring Banner - Professional Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 lg:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4" />
              <span>Strategic Expansion</span>
            </div>
            <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl">
              Join Our Faculty of{' '}
              <span className="gradient-text">Industry Experts</span>
            </h2>
            <p className="section-subtitle mx-auto text-slate-600 max-w-2xl mt-4">
              We are seeking accomplished trainers to lead our advanced technology programs.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {positions.map((position, index) => (
              <motion.div
                key={position.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to="/careers" className="block group">
                  <div className="card p-6 lg:p-8 h-full hover:shadow-xl transition-all duration-300 border border-slate-200 rounded-2xl bg-white">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${position.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300 shadow-md`}
                    >
                      <position.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-4xl font-bold text-slate-900 mb-2">
                      {position.count}
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">
                      {position.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                      {position.description}
                    </p>
                    <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-3 gap-2 transition-all">
                      <span>View Positions</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl">
              Why Choose Brainovision?
            </h2>
            <p className="section-subtitle mx-auto text-slate-600 max-w-2xl mt-4">
              Join a team dedicated to transforming technology education globally.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="card p-6 lg:p-8 h-full text-center hover:border-blue-200 transition-all duration-300 bg-white rounded-2xl shadow-sm hover:shadow-md">
                  <div
                    className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 ${
                      reason.color === 'blue'
                        ? 'bg-blue-100 text-blue-600'
                        : reason.color === 'emerald'
                        ? 'bg-emerald-100 text-emerald-600'
                        : reason.color === 'cyan'
                        ? 'bg-cyan-100 text-cyan-600'
                        : 'bg-orange-100 text-orange-600'
                    }`}
                  >
                    <reason.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {reason.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Preview */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 lg:mb-12"
          >
            <div>
              <h2 className="section-title mb-2 text-3xl sm:text-4xl">
                Current Opportunities
              </h2>
              <p className="text-slate-600">
                Discover your next career move with our team.
              </p>
            </div>
            <Link
              to="/careers"
              className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2 transition-colors"
            >
              <span>View All Roles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="p-6 h-full flex flex-col hover:border-blue-300 transition-all duration-300 bg-white rounded-2xl shadow-sm hover:shadow-md border border-blue-100 group">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors leading-snug">
                        <Link to={`/careers/${job.id}`}>{job.title}</Link>
                      </h3>
                      <p className="text-xs font-medium text-slate-500 mt-1">{job.department}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold rounded-full flex-shrink-0">
                      {job.positions_available} Open
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                      <Briefcase className="w-3 h-3 text-blue-600" />
                      <span className="capitalize">{job.employment_type}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                      <Clock className="w-3 h-3 text-blue-600" />
                      <span>{job.experience_min}-{job.experience_max} yrs</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                      <MapPin className="w-3 h-3 text-blue-600" />
                      <span className="truncate max-w-[120px]">{job.location}</span>
                    </span>
                    {job.salary_min && job.salary_max && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg font-semibold">
                        <DollarSign className="w-3 h-3 text-emerald-600" />
                        <span>{job.salary_min}-{job.salary_max} LPA</span>
                      </span>
                    )}
                  </div>
                  <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/apply?jobId=${job.id}`}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
                    >
                      Apply Now
                    </Link>
                    <Link
                      to={`/careers/${job.id}`}
                      className="flex items-center text-blue-600 hover:text-blue-800 font-bold text-xs gap-1.5 transition-all"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl">
              Comprehensive Benefits
            </h2>
            <p className="section-subtitle mx-auto text-slate-600 max-w-2xl mt-4">
              We provide industry-leading compensation and professional development opportunities.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group"
              >
                <div className="card p-6 h-full flex items-start gap-4 hover:border-emerald-200 transition-all duration-300 bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-200">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 flex-shrink-0 group-hover:scale-105 transition-transform">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Life at Brainovision */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 lg:mb-12"
          >
            <div>
              <h2 className="section-title mb-2 text-3xl sm:text-4xl">
                Inside Brainovision
              </h2>
              <p className="text-slate-600">
                Experience our collaborative and innovative work environment.
              </p>
            </div>
            <Link
              to="/life"
              className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2 transition-colors"
            >
              <span>Explore Our Culture</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group ${item.span}`}
              >
                <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden shadow-md">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {item.title}
                    </h3>
                    <p className="text-slate-200 text-sm">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
      {/* Hiring Process */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl">
              Recruitment Process
            </h2>
            <p className="section-subtitle mx-auto text-slate-600 max-w-2xl mt-4">
              A transparent six-stage journey to joining our expert faculty.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-2">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative"
              >
                <div className="card p-5 text-center hover:border-blue-200 transition-all duration-300 bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-200 h-full">
                  <div className="w-12 h-12 mx-auto bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-3 group-hover:scale-105 transition-transform">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-blue-600 mb-1">
                    Step {index + 1}
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link
              to="/process"
              className="btn-secondary inline-flex items-center gap-2 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all px-6 py-3 rounded-xl font-medium"
            >
              <span>Learn About Our Process</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-20 lg:py-28 bg-slate-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-600 mt-4">
                Find answers to common inquiries about joining our team.
              </p>
            </motion.div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    className="w-full text-left"
                  >
                    <div
                      className={`card p-5 transition-all duration-300 bg-white rounded-xl border ${
                        openFaq === faq.id
                          ? 'border-blue-200 bg-blue-50/50 shadow-md'
                          : 'border-slate-200 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="font-semibold text-slate-900 pr-4">
                          {faq.question}
                        </h3>
                        <ArrowRight
                          className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                            openFaq === faq.id ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                      {openFaq === faq.id && (
                        <p className="pt-4 text-slate-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}