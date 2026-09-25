import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, AlertCircle, ArrowRight, CheckCircle2, Mail } from 'lucide-react';
import { loginCandidate, getCurrentCandidate, setCurrentCandidate, getCandidates } from '../../lib/assessmentStore';
import { candidateAuth } from '../../services/api';
import type { AssessmentCandidate } from '../../types/assessment';

export function AssessmentLogin() {
  const navigate = useNavigate();
  const [candidateId, setCandidateId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [demoCandidates, setDemoCandidates] = useState<AssessmentCandidate[]>([]);

  useEffect(() => {
    // If candidate is already logged in and active, forward to welcome or exam
    const current = getCurrentCandidate();
    if (current) {
      if (current.status === 'completed' || current.status === 'cleared' || current.status === 'not_qualified' || current.status === 'terminated') {
        navigate('/assessment/result');
      } else if (current.status === 'started') {
        navigate('/assessment/exam');
      } else {
        navigate('/assessment/welcome');
      }
    }

    const all = getCandidates();
    setDemoCandidates(all.slice(0, 4));
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!candidateId.trim() || !password.trim()) {
      setError('Please provide both Candidate ID and temporary password.');
      return;
    }

    setLoading(true);
    try {
      const res = await candidateAuth.login(candidateId, password);
      setLoading(false);
      if (res.success && res.candidate) {
        const c = res.candidate;
        const mappedCandidate: AssessmentCandidate = {
          id: String(c.id || c.candidateId),
          candidateId: c.candidateId || c.candidate_id,
          name: c.name,
          email: c.email,
          phone: c.phone || '',
          college: c.college || '',
          branch: c.branch || '',
          graduationYear: c.graduationYear || '2026',
          position: c.position || 'Graduate Trainee',
          status: (c.status?.toLowerCase() === 'invited' ? 'not_started' : c.status?.toLowerCase()) || 'not_started',
          score: c.score || 0,
          totalMarks: c.totalMarks || 40,
          percentage: c.percentage || 0,
          violationsCount: c.violationsCount || 0,
          interviewStatus: 'not_scheduled',
          password: password,
          emailSent: true,
        };
        setCurrentCandidate(mappedCandidate);

        const statusUpper = (c.status || '').toUpperCase();
        if (['COMPLETED', 'CLEARED', 'NOT_QUALIFIED', 'TERMINATED'].includes(statusUpper)) {
          navigate('/assessment/result');
        } else if (statusUpper === 'IN_PROGRESS' || statusUpper === 'STARTED') {
          navigate('/assessment/exam');
        } else {
          navigate('/assessment/welcome');
        }
      }
    } catch (err: any) {
      // Graceful fallback to local store
      const localRes = loginCandidate(candidateId, password);
      setLoading(false);
      if (localRes.success && localRes.candidate) {
        const c = localRes.candidate;
        if (['completed', 'cleared', 'not_qualified', 'terminated'].includes(c.status)) {
          navigate('/assessment/result');
        } else if (c.status === 'started') {
          navigate('/assessment/exam');
        } else {
          navigate('/assessment/welcome');
        }
      } else {
        setError(err.message || 'Authentication failed. Please verify credentials.');
      }
    }
  };

  const handleQuickFill = (c: AssessmentCandidate) => {
    setCandidateId(c.candidateId);
    setPassword(c.password);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/80 via-white to-slate-50 flex flex-col justify-between text-slate-800 selection:bg-blue-600 selection:text-white">
      {/* Top Corporate Nav */}
      <header className="border-b border-blue-100 bg-white/90 backdrop-blur-md px-6 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/bov-yellow.png" alt="Brainovision" className="h-10 w-auto object-contain" />
            <div className="border-l border-slate-200 pl-3">
              <span className="text-sm font-bold tracking-wider uppercase text-slate-900 block">Brainovision Careers</span>
              <span className="text-[11px] text-blue-600 font-semibold block -mt-0.5">Recruitment Assessment Portal</span>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs">
            <span className="hidden sm:flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Proctored Environment
            </span>
            <Link to="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Back to Careers</Link>
          </div>
        </div>
      </header>

      {/* Main Login Card Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Corporate Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-blue-500/5 p-8 sm:p-10 border border-blue-100 text-slate-900">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mb-4 border border-blue-200 shadow-sm">
                <Lock className="w-7 h-7 text-blue-600" />
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">Brainovision</h1>
              <p className="text-xs font-bold tracking-widest uppercase text-blue-600 mt-0.5">Careers & Assessment Portal</p>
              <h2 className="text-base font-semibold text-slate-800 mt-3 pt-3 border-t border-slate-100">
                Recruitment Assessment Sign In
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your official credentials received from <strong className="text-blue-600">hiring@brainovision.in</strong>
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-700"
              >
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Candidate ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BV26-0001"
                  value={candidateId}
                  onChange={(e) => setCandidateId(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Temporary Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter your confidential password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Assistance notice */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Need assistance? Contact Brainovision Talent Acquisition at
              </p>
              <a
                href="mailto:hiring@brainovision.in"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 mt-1 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                hiring@brainovision.in
              </a>
            </div>
          </div>

          {/* Quick Demo Access Pills for testing */}
          <div className="mt-6 bg-blue-50/70 rounded-xl p-4 border border-blue-200 text-xs">
            <div className="flex items-center justify-between text-slate-600 mb-2.5">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                Instant Demo Logins
              </span>
              <span className="text-[11px] text-slate-500">Click to auto-fill</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {demoCandidates.map((c) => (
                <button
                  key={c.candidateId}
                  onClick={() => handleQuickFill(c)}
                  className="text-left p-2.5 rounded-lg bg-white hover:bg-blue-50/80 border border-blue-200 hover:border-blue-400 transition-all shadow-sm group"
                >
                  <p className="font-mono font-bold text-blue-600 text-xs">{c.candidateId}</p>
                  <p className="text-slate-800 text-[11px] truncate font-medium">{c.name}</p>
                  <p className="text-slate-500 text-[10px] truncate">{c.college.split(' ')[0]}</p>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Corporate Assessment Footer */}
      <footer className="border-t border-blue-100 bg-white px-6 py-4 text-center text-xs text-slate-500">
        <p>© 2026 Brainovision Solutions India Pvt. Ltd. All Rights Reserved. • Campus Recruitment Engine</p>
      </footer>
    </div>
  );
}
