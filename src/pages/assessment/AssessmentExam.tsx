import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Clock,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  RotateCcw,
  Send,
  User,
  Check,
  AlertOctagon,
  HelpCircle,
  Maximize,
} from 'lucide-react';
import {
  getCurrentCandidate,
  getQuestions,
  getAssessmentConfig,
  saveCandidateAnswer,
  clearCandidateAnswer,
  toggleMarkForReview,
  submitAssessment,
} from '../../lib/assessmentStore';
import { assessmentService } from '../../services/api';
import { SecurityEngine, type SecurityViolationNotice } from '../../lib/securityEngine';
import type { AssessmentCandidate, Question, QuestionSection, AssessmentConfig } from '../../types/assessment';

export function AssessmentExam() {
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<AssessmentCandidate | null>(null);
  const [config, setConfig] = useState<AssessmentConfig>(() => getAssessmentConfig());
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<string[]>([]);
  const [selectedSection, setSelectedSection] = useState<QuestionSection>('aptitude');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(Boolean(document.fullscreenElement));

  // Dynamic timer initialized from admin assessment config
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const cfg = getAssessmentConfig();
    return (cfg.durationMinutes || 45) * 60;
  });
  const [lastSaved, setLastSaved] = useState<string>('Just now');

  // Modals
  const [violationNotice, setViolationNotice] = useState<SecurityViolationNotice | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const securityEngineRef = useRef<SecurityEngine | null>(null);

  // Auto-submit handler
  const handleFinalSubmit = useCallback(async () => {
    if (!candidate) return;
    setIsSubmitting(true);

    if (securityEngineRef.current) {
      securityEngineRef.current.deactivate();
    }
    SecurityEngine.exitFullscreen();

    try {
      await assessmentService.submit(candidate.candidateId);
    } catch {
      // Local fallback
      submitAssessment(candidate.candidateId);
    }

    setTimeout(() => {
      navigate('/assessment/result');
    }, 600);
  }, [candidate, navigate]);

  // Handle security violations from security engine
  const handleSecurityViolation = useCallback((notice: SecurityViolationNotice) => {
    setViolationNotice(notice);

    if (candidate) {
      assessmentService.recordSecurityEvent(
        candidate.candidateId,
        notice.eventType,
        notice.level === 3 ? 'CRITICAL' : 'WARNING',
        notice.message
      ).catch(() => {});
    }

    if (notice.isTerminated) {
      setTimeout(() => {
        SecurityEngine.exitFullscreen();
        navigate('/assessment/result');
      }, 3500);
    }
  }, [candidate, navigate]);

  useEffect(() => {
    const current = getCurrentCandidate();
    if (!current) {
      navigate('/assessment/login');
      return;
    }

    if (current.status === 'completed' || current.status === 'cleared' || current.status === 'not_qualified' || current.status === 'terminated') {
      navigate('/assessment/result');
      return;
    }

    setCandidate(current);
    setAnswers(current.answers || {});
    setMarkedForReview(current.markedForReview || []);

    // Load server-authoritative randomized question set based on active MySQL assessment
    assessmentService.start().then((startRes) => {
      if (startRes && startRes.success && Array.isArray(startRes.questions) && startRes.questions.length > 0) {
        setQuestions(startRes.questions);
        if (startRes.remainingSeconds) {
          setTimeLeft(startRes.remainingSeconds);
        }
      } else {
        const loadedQuestions = getQuestions();
        setQuestions(loadedQuestions);
      }
    }).catch((err) => {
      console.warn('Backend startAssessment notice, using store fallback:', err);
      const loadedQuestions = getQuestions();
      setQuestions(loadedQuestions);
    });

    // Initialize Security Engine
    const sec = new SecurityEngine(current.candidateId, handleSecurityViolation);
    sec.activate();
    securityEngineRef.current = sec;

    // Countdown Timer
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const handleFullscreenSync = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenSync);

    return () => {
      clearInterval(timerInterval);
      document.removeEventListener('fullscreenchange', handleFullscreenSync);
      if (securityEngineRef.current) {
        securityEngineRef.current.deactivate();
      }
    };
  }, [navigate, handleSecurityViolation, handleFinalSubmit]);

  if (!candidate) return null;

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center border border-blue-100">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-200">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Assessment Paper in Preparation</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            The question bank is currently being finalized by the recruitment panel. No active questions have been published yet for this test session.
          </p>
          <div className="p-3 bg-blue-50 rounded-xl text-blue-800 text-xs font-medium mb-6">
            Please check back shortly or notify your recruitment coordinator at <strong className="font-semibold">hiring@brainovision.in</strong>.
          </div>
          <button
            onClick={() => navigate('/assessment')}
            className="w-full py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            Back to Assessment Portal
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  // Helper for formatted time: MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Option selection
  const handleSelectOption = (optionIndex: number) => {
    const qId = currentQuestion.id;
    const optionChar = String.fromCharCode(65 + optionIndex);
    const newAnswers = { ...answers, [qId]: optionIndex };
    setAnswers(newAnswers);
    saveCandidateAnswer(candidate.candidateId, qId, optionIndex);

    assessmentService.saveAnswer(candidate.candidateId, qId, optionChar, markedForReview.includes(qId)).catch(() => {});
    setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  const handleClearResponse = () => {
    const qId = currentQuestion.id;
    const newAnswers = { ...answers };
    delete newAnswers[qId];
    setAnswers(newAnswers);
    clearCandidateAnswer(candidate.candidateId, qId);
    setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  const handleToggleReview = () => {
    const qId = currentQuestion.id;
    const isMarked = markedForReview.includes(qId);
    const updated = isMarked ? markedForReview.filter((id) => id !== qId) : [...markedForReview, qId];
    setMarkedForReview(updated);
    toggleMarkForReview(candidate.candidateId, qId);
    handleNext();
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedSection(questions[nextIdx].section);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setSelectedSection(questions[prevIdx].section);
    }
  };

  const handleJumpToQuestion = (idx: number) => {
    setCurrentIndex(idx);
    setSelectedSection(questions[idx].section);
  };

  const handleSectionTabClick = (section: QuestionSection) => {
    setSelectedSection(section);
    const firstIdx = questions.findIndex((q) => q.section === section);
    if (firstIdx !== -1) {
      setCurrentIndex(firstIdx);
    }
  };

  // Summary counts
  const answeredCount = Object.keys(answers).length;
  const markedCount = markedForReview.length;
  const unansweredCount = questions.length - answeredCount;

  // Determine palette item status
  const getQuestionPaletteStatus = (q: Question) => {
    const isAnswered = answers[q.id] !== undefined;
    const isMarked = markedForReview.includes(q.id);

    if (isAnswered && isMarked) return 'answered-marked';
    if (isAnswered) return 'answered';
    if (isMarked) return 'marked';
    return 'unvisited';
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col justify-between selection:bg-none select-none">
      {/* 1. TOP LOCKED TEST BAR */}
      <header className="border-b border-blue-100 bg-white px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <img src="/bov-yellow.png" alt="Brainovision" className="h-8 w-auto object-contain" />
            <div className="hidden md:block border-l border-slate-200 pl-3">
              <span className="text-xs font-extrabold tracking-wider uppercase text-slate-900 block">Brainovision</span>
              <span className="text-[10px] text-blue-600 font-semibold block">Campus Recruitment Assessment 2026</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg text-xs">
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-slate-800 font-semibold">{candidate.name}</span>
            <span className="font-mono text-blue-700 font-bold">({candidate.candidateId})</span>
          </div>
        </div>

        {/* Center: Proctoring Active Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          Proctoring Engine: Active
        </div>

        {/* Right: Countdown Timer & Submit */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm sm:text-base ${
              timeLeft < 300
                ? 'bg-red-50 border-red-300 text-red-600 animate-pulse'
                : timeLeft < 600
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}
          >
            <Clock className="w-4 h-4 text-blue-600" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Test</span>
          </button>
        </div>
      </header>

      {/* 2. SECTION SWITCHER STRIP */}
      <div className="bg-white/95 border-b border-blue-100 px-4 sm:px-6 py-2.5 overflow-x-auto shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 hidden sm:inline">Sections:</span>
          {[
            { id: 'aptitude', name: 'Quantitative Aptitude', count: 15 },
            { id: 'reasoning', name: 'Logical Reasoning', count: 10 },
            { id: 'verbal', name: 'Verbal Ability', count: 10 },
            { id: 'technical', name: 'Technical Core', count: 5 },
          ].map((sec) => {
            const isActive = selectedSection === sec.id;
            const secQuestions = questions.filter((q) => q.section === sec.id);
            const secAnswered = secQuestions.filter((q) => answers[q.id] !== undefined).length;

            return (
              <button
                key={sec.id}
                onClick={() => handleSectionTabClick(sec.id as QuestionSection)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 border ${
                  isActive
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'
                }`}
              >
                <span>{sec.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-600'}`}>
                  {secAnswered}/{sec.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN EXAM BODY (Split: Question Area & Palette) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Question Card (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-xl border border-slate-200 text-slate-900 flex flex-col justify-between min-h-[580px]">
          <div>
            {/* Question Top Info Bar */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  {currentQuestion.sectionTitle}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  Question {currentIndex + 1} of {questions.length}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase bg-slate-100 text-slate-600">
                  Marks: +{currentQuestion.marks} | -0
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Auto-saved</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="p-6 sm:p-8">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed whitespace-pre-line">
                {currentQuestion.text}
              </h2>

              {/* Options */}
              <div className="mt-8 space-y-3">
                {currentQuestion.options.map((opt, optIdx) => {
                  const isSelected = answers[currentQuestion.id] === optIdx;

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 text-slate-900 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-sm font-medium leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-white active:bg-slate-100 disabled:opacity-40 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleClearResponse}
                disabled={answers[currentQuestion.id] === undefined}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 disabled:opacity-30 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleToggleReview}
                className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  markedForReview.includes(currentQuestion.id)
                    ? 'bg-purple-100 border-purple-300 text-purple-800'
                    : 'bg-white border-slate-300 text-purple-700 hover:bg-purple-50'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{markedForReview.includes(currentQuestion.id) ? 'Marked' : 'Mark for Review'}</span>
              </button>

              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>Save & Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Question Palette & Section Details (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Question Palette Box */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-5 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Question Palette</h3>
              <span className="text-[11px] font-mono text-slate-500">Total: 40</span>
            </div>

            {/* Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] py-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500" />
                <span className="text-slate-600">Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-purple-500" />
                <span className="text-slate-600">Review ({markedCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-200 border border-slate-300" />
                <span className="text-slate-600">Unanswered ({unansweredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded ring-2 ring-blue-600 bg-white" />
                <span className="text-slate-600">Current</span>
              </div>
            </div>

            {/* Interactive Grid 1 to 40 */}
            <div className="pt-4">
              <p className="text-[11px] text-slate-400 font-semibold mb-2.5">CLICK NUMBER TO JUMP:</p>
              <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-2 max-h-[280px] overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const status = getQuestionPaletteStatus(q);
                  const isCurrent = idx === currentIndex;

                  let bgClass = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';
                  if (status === 'answered') {
                    bgClass = 'bg-emerald-600 text-white font-bold border-emerald-600';
                  } else if (status === 'answered-marked') {
                    bgClass = 'bg-amber-500 text-white font-bold border-amber-600';
                  } else if (status === 'marked') {
                    bgClass = 'bg-purple-600 text-white font-bold border-purple-600';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => handleJumpToQuestion(idx)}
                      className={`h-9 rounded-lg text-xs font-semibold border flex items-center justify-center transition-all ${bgClass} ${
                        isCurrent ? 'ring-2 ring-blue-600 ring-offset-2 scale-105 z-10' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resilience / Local Save Info */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Auto-save active</span>
              <span className="font-mono text-slate-600">{lastSaved}</span>
            </div>
          </div>

          {/* Quick Instructions Card */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 text-xs text-slate-300 space-y-2">
            <p className="font-bold text-white flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-yellow-400" />
              Proctoring Security Rules
            </p>
            <ul className="space-y-1 text-[11px] text-slate-400 list-disc pl-4">
              <li>Do not leave fullscreen mode or switch browser tabs.</li>
              <li>Reaching 3 violations leads to immediate auto-termination.</li>
              <li>Your answers are saved securely after each question.</li>
            </ul>
          </div>
        </div>
      </main>

      {/* 4. SUBMIT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-slate-900 border border-slate-200"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                  <Send className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Submit Assessment?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Once submitted, your responses will be locked and automatically evaluated.
                </p>
              </div>

              {/* Assessment Summary Stats */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5 mb-6 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-600">Total Questions:</span>
                  <span className="font-bold text-slate-900 font-mono">40</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-600">Answered Questions:</span>
                  <span className="font-bold text-emerald-600 font-mono">{answeredCount}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-600">Unanswered Questions:</span>
                  <span className="font-bold text-slate-600 font-mono">{unansweredCount}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-600">Marked for Review:</span>
                  <span className="font-bold text-purple-600 font-mono">{markedCount}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Return to Test
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Yes, Final Submit</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. SECURITY VIOLATION OVERLAY MODAL */}
      <AnimatePresence>
        {violationNotice && (
          <div className="fixed inset-0 z-50 bg-red-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 text-slate-900 border-4 border-red-600 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-4">
                <AlertOctagon className="w-8 h-8 text-red-600 animate-bounce" />
              </div>

              <span className="text-xs font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                Security Violation Notice
              </span>

              <h3 className="text-xl font-bold text-slate-950 mt-3">{violationNotice.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{violationNotice.message}</p>

              <div className="my-6 p-4 rounded-xl bg-red-50 border border-red-200 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-600">Event Type:</span>
                  <span className="font-mono font-bold text-red-700">{violationNotice.eventType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Accumulated Violations:</span>
                  <span className="font-bold text-red-700">{violationNotice.violationsCount} of 3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Policy:</span>
                  <span className="font-medium text-slate-800">Threshold is 3 violations</span>
                </div>
              </div>

              {violationNotice.isTerminated ? (
                <div className="p-3 bg-red-600 text-white rounded-xl text-xs font-bold animate-pulse">
                  Assessment Terminated. Redirecting to official report...
                </div>
              ) : (
                <button
                  type="button"
                  onClick={async () => {
                    await SecurityEngine.enterFullscreen();
                    setViolationNotice(null);
                  }}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  I Understand — Return to Assessment Fullscreen
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. FULLSCREEN LOCKDOWN OVERLAY */}
      <AnimatePresence>
        {!isFullscreen && !violationNotice && !isSubmitting && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center border border-blue-200"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-4 border border-blue-200">
                <Maximize className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Mandatory Fullscreen Mode</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                This recruitment assessment operates under automated proctoring surveillance. Fullscreen mode must remain active throughout the examination.
              </p>
              <div className="my-5 p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 text-left space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Strict Proctoring Rules Active</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Exiting fullscreen, switching browser tabs, or unfocusing the window generates an automated violation strike. Exceeding strike limits triggers automatic disqualification.
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await SecurityEngine.enterFullscreen();
                  setIsFullscreen(Boolean(document.fullscreenElement));
                }}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Maximize className="w-4 h-4" />
                <span>Enter Fullscreen & Resume Assessment</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Strip */}
      <footer className="border-t border-blue-100 bg-white px-6 py-2.5 text-center text-[11px] text-slate-500">
        Candidate Session: <span className="font-mono text-blue-600 font-bold">{candidate.candidateId}</span> • Secure Proctored Examination
      </footer>
    </div>
  );
}
