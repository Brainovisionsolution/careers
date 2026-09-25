import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Building2, GraduationCap, Briefcase, Clock, CheckCircle2, ArrowRight, LogOut } from 'lucide-react';
import { getCurrentCandidate, logoutCandidate } from '../../lib/assessmentStore';
import type { AssessmentCandidate } from '../../types/assessment';

export function AssessmentWelcome() {
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<AssessmentCandidate | null>(null);

  useEffect(() => {
    const current = getCurrentCandidate();
    if (!current) {
      navigate('/assessment/login');
      return;
    }
    setCandidate(current);
  }, [navigate]);

  if (!candidate) return null;

  const handleLogout = () => {
    logoutCandidate();
    navigate('/assessment/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/70 via-white to-slate-50 text-slate-800 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Bar */}
      <header className="border-b border-blue-100 bg-white/90 px-6 py-3.5 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/bov-yellow.png" alt="Brainovision" className="h-10 w-auto object-contain" />
            <div className="border-l border-slate-200 pl-3">
              <span className="text-sm font-bold tracking-wider uppercase text-slate-900 block">Brainovision Careers</span>
              <span className="text-[11px] text-blue-600 font-semibold block -mt-0.5">Recruitment Assessment Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-900">{candidate.name}</p>
              <p className="text-[11px] font-mono text-blue-600 font-bold">{candidate.candidateId}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-slate-600 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Verification Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-xl shadow-blue-500/5 overflow-hidden border border-blue-100 text-slate-900"
        >
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 sm:p-8 border-b-4 border-blue-400">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm">
                Step 1 of 3: Identity Verification
              </span>
              <span className="text-xs text-blue-200 font-mono">Session ID: {candidate.candidateId}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome, {candidate.name}
            </h1>
            <p className="text-sm text-blue-100 mt-1">
              Please review your candidate verification profile before initiating the pre-assessment check.
            </p>
          </div>

          {/* Profile Details Grid */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Candidate Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500">Candidate Name</p>
                  <p className="font-bold text-slate-900 mt-0.5">{candidate.name}</p>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500">Candidate ID</p>
                  <p className="font-mono font-bold text-blue-700 mt-0.5">{candidate.candidateId}</p>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500">Institution / College</p>
                  <p className="font-semibold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    {candidate.college}
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500">Engineering Branch & Batch</p>
                  <p className="font-semibold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    {candidate.branch} • Class of {candidate.graduationYear}
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500">Target Role</p>
                  <p className="font-semibold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    {candidate.position}
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500">Assessment Phase</p>
                  <p className="font-semibold text-emerald-700 mt-0.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    Phase 1: Online Screening Test
                  </p>
                </div>
              </div>
            </div>

            {/* Assessment Structure Overview */}
            <div className="border border-slate-200 rounded-xl p-5 bg-blue-50/50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Assessment Structure Summary
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-white p-3 rounded-lg border border-blue-100">
                  <p className="text-lg font-bold text-slate-900">45</p>
                  <p className="text-xs text-slate-500">Minutes</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-blue-100">
                  <p className="text-lg font-bold text-slate-900">40</p>
                  <p className="text-xs text-slate-500">Questions</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-blue-100">
                  <p className="text-lg font-bold text-slate-900">4</p>
                  <p className="text-xs text-slate-500">Sections</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-blue-100">
                  <p className="text-lg font-bold text-blue-600">60%</p>
                  <p className="text-xs text-slate-500">Passing Cut-off</p>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="pt-2">
              <button
                onClick={() => navigate('/assessment/system-check')}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span>Continue to System Readiness Check</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-100 bg-white px-6 py-4 text-center text-xs text-slate-500">
        <p>Brainovision Solutions India Pvt. Ltd. • All sessions are monitored for candidate integrity</p>
      </footer>
    </div>
  );
}
