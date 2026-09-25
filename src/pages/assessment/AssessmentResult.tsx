import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Printer,
  FileCheck,
  LogOut,
} from 'lucide-react';
import { getCurrentCandidate, logoutCandidate } from '../../lib/assessmentStore';
import type { AssessmentCandidate } from '../../types/assessment';

export function AssessmentResult() {
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<AssessmentCandidate | null>(null);
  const [evaluating, setEvaluating] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);

  const evaluationSteps = [
    'Answers saved to enterprise store',
    'Responses validated and verified',
    'Sectional score calculated',
    'Eligibility threshold evaluated',
    'Assessment completed successfully',
  ];

  useEffect(() => {
    const current = getCurrentCandidate();
    if (!current) {
      navigate('/assessment/login');
      return;
    }
    setCandidate(current);

    // Stagger submission steps
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < evaluationSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setTimeout(() => setEvaluating(false), 500);
          return prev;
        }
      });
    }, 400);

    return () => clearInterval(stepInterval);
  }, [navigate]);

  if (!candidate) return null;

  const isTerminated = candidate.status === 'terminated';
  const isCleared = candidate.status === 'cleared';

  const handlePrint = () => {
    window.print();
  };

  const handleSignOut = () => {
    logoutCandidate();
    navigate('/assessment/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/70 via-white to-slate-50 text-slate-800 flex flex-col justify-between selection:bg-blue-600 selection:text-white print:bg-white print:text-black">
      {/* Top Header */}
      <header className="border-b border-blue-100 bg-white px-6 py-3.5 shadow-sm print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/bov-yellow.png" alt="Brainovision" className="h-10 w-auto object-contain" />
            <div className="border-l border-slate-200 pl-3">
              <span className="text-sm font-bold tracking-wider uppercase text-slate-900 block">Brainovision Careers</span>
              <span className="text-[11px] text-blue-600 font-semibold block -mt-0.5">Recruitment Assessment Portal</span>
            </div>
          </Link>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-blue-600" />
              <span>Print Scorecard</span>
            </button>
            <button
              onClick={handleSignOut}
              className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium flex items-center gap-1.5 transition-colors border border-blue-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Results Canvas */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <AnimatePresence mode="wait">
          {evaluating ? (
            /* Submitting / Evaluation Animation */
            <motion.div
              key="evaluating"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-slate-200 text-slate-900 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-6">
                <FileCheck className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>

              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                Evaluating Assessment
              </h2>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Processing candidate responses and sectional scores...
              </p>

              <div className="space-y-3 text-left">
                {evaluationSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    {idx <= stepIndex ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0" />
                    )}
                    <span className={idx <= stepIndex ? 'font-semibold text-slate-800' : 'text-slate-400'}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* Actual Result Card */
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 text-slate-900"
            >
              {/* STATUS TOP BANNER */}
              {isTerminated ? (
                /* TERMINATED BANNER */
                <div className="bg-red-600 text-white p-6 sm:p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <AlertOctagon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-red-200 block">
                        Official Action Taken
                      </span>
                      <h1 className="text-2xl font-bold uppercase tracking-tight mt-0.5">
                        ASSESSMENT TERMINATED
                      </h1>
                      <p className="text-xs text-red-100 mt-1">
                        Reason: Security policy violation (Exceeded maximum allowed window/tab exits).
                      </p>
                    </div>
                  </div>
                </div>
              ) : isCleared ? (
                /* CLEARED BANNER */
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 border-b-4 border-emerald-400">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
                      Official Evaluation
                    </span>
                    <span className="text-xs font-mono text-emerald-100">ID: {candidate.candidateId}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white text-emerald-700 flex items-center justify-center shadow-lg flex-shrink-0">
                      <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
                        ASSESSMENT CLEARED
                      </h1>
                      <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                        Congratulations! You have satisfied the eligibility threshold for Phase 2.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* NOT QUALIFIED BANNER */
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 sm:p-8 border-b-4 border-slate-600">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider">
                      Evaluation Result
                    </span>
                    <span className="text-xs font-mono text-slate-300">ID: {candidate.candidateId}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-700 text-slate-200 flex items-center justify-center flex-shrink-0">
                      <XCircle className="w-8 h-8" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold uppercase tracking-tight text-white">
                        ASSESSMENT COMPLETED
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1">
                        Status: <strong className="text-yellow-400">NOT QUALIFIED</strong> (Below Cut-off Threshold)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* RESULTS BODY */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Score Summary Box */}
                {!isTerminated && (
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Aggregate Performance Score
                    </p>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-mono">
                        {candidate.score}
                      </span>
                      <span className="text-xl sm:text-2xl font-bold text-slate-400 font-mono">
                        / {candidate.totalMarks}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-blue-600 mt-1">
                      Percentage: {candidate.percentage}%
                    </p>
                  </div>
                )}

                {/* Candidate Demographics Info */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block">Candidate Name</span>
                    <strong className="text-slate-800 text-sm">{candidate.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Candidate ID</span>
                    <strong className="text-slate-800 font-mono text-sm">{candidate.candidateId}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">College</span>
                    <strong className="text-slate-800 truncate block">{candidate.college}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Branch & Role</span>
                    <strong className="text-slate-800 truncate block">{candidate.branch} • {candidate.position}</strong>
                  </div>
                </div>

                {/* Section-wise breakdown */}
                {candidate.sectionScores && !isTerminated && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Sectional Score Breakdown
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.keys(candidate.sectionScores).map((secKey) => {
                        const sec = candidate.sectionScores![secKey];
                        return (
                          <div key={secKey} className="p-3 bg-white rounded-xl border border-slate-200">
                            <div className="flex justify-between items-center mb-1 text-xs">
                              <span className="font-semibold text-slate-700">{sec.sectionTitle}</span>
                              <span className="font-bold text-slate-900 font-mono">
                                {sec.score} / {sec.total}
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${sec.percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Next Steps Card */}
                {isCleared ? (
                  <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200 text-xs text-emerald-900 space-y-2">
                    <p className="font-bold text-emerald-950 flex items-center gap-1.5 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Next Stage: Technical Interview Round
                    </p>
                    <p className="leading-relaxed text-emerald-800">
                      You are eligible to proceed to the next stage of the Brainovision campus recruitment process. Your technical interview schedule and video meeting link will be communicated directly to <strong>{candidate.email}</strong> by the Talent Acquisition Team.
                    </p>
                    <p className="text-[11px] text-emerald-700 font-medium">
                      Official recruitment correspondence will originate from <strong>hiring@brainovision.in</strong>.
                    </p>
                  </div>
                ) : isTerminated ? (
                  <div className="bg-red-50 rounded-xl p-5 border border-red-200 text-xs text-red-900 space-y-2">
                    <p className="font-bold text-red-950 text-sm">Security Audit Recorded</p>
                    <p className="leading-relaxed text-red-800">
                      {candidate.terminationReason || 'Your assessment was terminated due to exceeding permitted security alerts.'}
                    </p>
                    <p className="text-[11px] text-red-700">
                      All tab switches, focus changes, and timestamps have been compiled and submitted to the Talent Acquisition Team. If you believe this occurred due to a technical failure, write to <strong>hiring@brainovision.in</strong> citing Candidate ID {candidate.candidateId}.
                    </p>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-xs text-slate-700 space-y-2">
                    <p className="font-bold text-slate-900 text-sm">Application Status Notice</p>
                    <p className="leading-relaxed">
                      Thank you for participating in the Brainovision campus recruitment assessment. While your score did not meet the cut-off criteria for this batch, your profile has been archived in our talent pool for future opportunities.
                    </p>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
                  <Link
                    to="/"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 text-center transition-colors"
                  >
                    Return to Brainovision Careers
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold text-center transition-colors shadow-sm"
                  >
                    Complete & Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-100 bg-white px-6 py-4 text-center text-xs text-slate-500 print:hidden">
        <p>Brainovision Solutions India Pvt. Ltd. • Corporate Recruitment Assessment Platform</p>
      </footer>
    </div>
  );
}
