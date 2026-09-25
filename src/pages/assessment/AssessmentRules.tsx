import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckSquare,
  Square,
  AlertTriangle,
  Play,
  ArrowLeft,
  FileText,
  Clock,
  Award,
  Layers,
  ShieldAlert,
} from 'lucide-react';
import { getCurrentCandidate, startAssessmentAttempt, getAssessmentConfig } from '../../lib/assessmentStore';
import { assessmentService } from '../../services/api';
import { SecurityEngine } from '../../lib/securityEngine';
import type { AssessmentCandidate, AssessmentConfig } from '../../types/assessment';

const ASSESSMENT_RULES = [
  {
    id: 1,
    rule: 'Ensure you have a stable internet connection with adequate power backup for your machine.',
  },
  {
    id: 2,
    rule: 'Use a laptop or desktop computer. Mobile phones and handheld tablets are prohibited.',
  },
  {
    id: 3,
    rule: 'Do not refresh, reload, or navigate away from the assessment page during the examination.',
  },
  {
    id: 4,
    rule: 'Do not switch browser tabs, minimize the test window, or engage external messaging apps.',
  },
  {
    id: 5,
    rule: 'Do not exit fullscreen mode. Exiting fullscreen triggers immediate security warnings.',
  },
  {
    id: 6,
    rule: 'Copy, cut, paste, text selection, and right-click context menus are completely disabled.',
  },
  {
    id: 7,
    rule: 'Do not use external reference materials, search engines, or generative AI assistants.',
  },
  {
    id: 8,
    rule: 'The assessment must be completed in one single continuous session. Pausing is not permitted.',
  },
  {
    id: 9,
    rule: 'The countdown timer runs continuously on the server. On expiration, answers are auto-submitted.',
  },
  {
    id: 10,
    rule: 'Once submitted or if terminated due to security violations, the test cannot be restarted.',
  },
];

export function AssessmentRules() {
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<AssessmentCandidate | null>(null);
  const [config, setConfig] = useState<AssessmentConfig | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const current = getCurrentCandidate();
    if (!current) {
      navigate('/assessment/login');
      return;
    }
    setCandidate(current);

    const localCfg = getAssessmentConfig();
    setConfig(localCfg);

    assessmentService.getConfig().then((res) => {
      if (res && res.success && res.config) {
        setConfig(res.config);
      }
    }).catch(() => {});
  }, [navigate]);

  const handleStartAssessment = async () => {
    if (!agreed || !candidate) return;

    setStarting(true);

    // Request fullscreen mode
    await SecurityEngine.enterFullscreen();

    // Start assessment attempt in store
    startAssessmentAttempt(candidate.candidateId);

    // Navigate to locked exam view
    navigate('/assessment/exam');
  };

  if (!candidate) return null;

  const totalQuestions = config?.totalQuestions || (config?.sections?.reduce((a, s) => a + s.count, 0) || 40);
  const durationMins = config?.durationMinutes || 45;
  const cutoffPercentage = config?.passingPercentage || 60;
  const marksPerQ = config?.marksPerQuestion || 1;
  const totalMarks = totalQuestions * marksPerQ;
  const cutoffMarks = ((totalMarks * cutoffPercentage) / 100).toFixed(1);

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

          <div className="flex items-center gap-4 text-xs">
            <span className="font-mono text-blue-600 font-bold">{candidate.candidateId}</span>
            <span className="text-slate-800 font-semibold">{candidate.name}</span>
          </div>
        </div>
      </header>

      {/* Main Rules Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl bg-white rounded-2xl shadow-xl shadow-blue-500/5 overflow-hidden border border-blue-100 text-slate-900"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 sm:p-8 border-b-4 border-blue-400">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm">
                Step 3 of 3: Examination Undertaking
              </span>
              <span className="text-xs text-blue-200 font-mono">Duration: {durationMins}:00 Mins</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <FileText className="w-7 h-7 text-blue-300" />
              {config?.title || 'Assessment Rules & Code of Conduct'}
            </h1>
            <p className="text-sm text-blue-100 mt-1">
              Carefully review the official examination parameters and binding proctoring guidelines below.
            </p>
          </div>

          {/* Exam Details & Cutoff Criteria Overview */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-blue-50/70 p-4 rounded-xl border border-blue-200 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 font-semibold uppercase text-[10px] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Duration
                </span>
                <p className="text-base font-extrabold text-blue-950 font-mono">{durationMins} Mins</p>
                <span className="text-[10px] text-slate-500">Continuous timer</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 font-semibold uppercase text-[10px] flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  Total Questions
                </span>
                <p className="text-base font-extrabold text-blue-950 font-mono">{totalQuestions} Qs</p>
                <span className="text-[10px] text-slate-500">4 Sections</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 font-semibold uppercase text-[10px] flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                  Total Marks
                </span>
                <p className="text-base font-extrabold text-blue-950 font-mono">{totalMarks} Marks</p>
                <span className="text-[10px] text-slate-500">{marksPerQ} mark / question</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 font-semibold uppercase text-[10px] flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  Qualifying Cutoff
                </span>
                <p className="text-base font-extrabold text-emerald-700 font-mono">{cutoffPercentage}%</p>
                <span className="text-[10px] text-emerald-800 font-semibold">Min {cutoffMarks} marks</span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950">Mandatory Automated Proctoring Enforcement</p>
                <p className="mt-0.5 leading-relaxed text-amber-800">
                  This examination operates under automated proctoring surveillance. Any tab switch, window unfocus, or exit from fullscreen mode generates an official violation alert. Maximum strikes allowed: {config?.maxTabSwitches || 2} tab switches or {config?.maxFullscreenExits || 2} fullscreen exits before immediate disqualification.
                </p>
              </div>
            </div>

            {/* Rules Cards */}
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-2">
              {ASSESSMENT_RULES.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {item.id}
                  </span>
                  <p className="text-xs font-medium text-slate-800 leading-relaxed">
                    {item.rule}
                  </p>
                </div>
              ))}
            </div>

            {/* Agreement Checkbox */}
            <div className="pt-4 border-t border-slate-200">
              <label
                onClick={() => setAgreed(!agreed)}
                className="flex items-start gap-3 p-4 rounded-xl border-2 border-slate-300 hover:border-blue-500 bg-slate-50/50 cursor-pointer select-none transition-all"
              >
                <button
                  type="button"
                  className={`mt-0.5 text-blue-600 focus:outline-none ${agreed ? 'text-blue-600' : 'text-slate-400'}`}
                >
                  {agreed ? (
                    <CheckSquare className="w-5 h-5 fill-blue-600 text-white" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    I have read, understood, and agree to the Brainovision Assessment Rules
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    I pledge complete academic and professional integrity. I agree to launch the test in locked fullscreen mode.
                  </p>
                </div>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <button
                onClick={() => navigate('/assessment/system-check')}
                className="w-full sm:w-auto px-5 py-3 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to System Check</span>
              </button>

              <button
                onClick={handleStartAssessment}
                disabled={!agreed || starting}
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {starting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>START ASSESSMENT</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-100 bg-white px-6 py-4 text-center text-xs text-slate-500">
        <p>Brainovision Solutions India Pvt. Ltd. • Strict Proctored Environment</p>
      </footer>
    </div>
  );
}
