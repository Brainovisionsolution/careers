import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Check, Copy, ExternalLink, ShieldCheck, Clock, Calendar, Key, UserCheck } from 'lucide-react';
import type { AssessmentCandidate } from '../../types/assessment';

interface CorporateEmailModalProps {
  candidate: AssessmentCandidate | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CorporateEmailModal({ candidate, isOpen, onClose }: CorporateEmailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !candidate) return null;

  const handleCopyCredentials = () => {
    const text = `Assessment Portal: careers.brainovision.in\nCandidate ID: ${candidate.candidateId}\nTemporary Password: ${candidate.password}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Email Client Header Bar */}
          <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Official Recruitment Dispatch</p>
                <p className="text-xs text-slate-400">From: hiring@brainovision.in (Brainovision Talent Acquisition)</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>

          {/* Email Content Container */}
          <div className="p-6 sm:p-8 bg-slate-50 max-h-[75vh] overflow-y-auto">
            {/* HTML Email Canvas */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden font-sans">
              {/* Brand Top Header */}
              <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white p-6 sm:p-8 border-b-4 border-yellow-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src="/bov-yellow.png" alt="Brainovision" className="h-10 w-auto object-contain" />
                    <div>
                      <h1 className="text-lg font-bold tracking-tight text-white">BRAINOVISION</h1>
                      <p className="text-xs text-yellow-400 font-medium tracking-wider uppercase">Solutions India Pvt. Ltd.</p>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 bg-white/10 rounded-full text-slate-200 border border-white/10 font-mono">
                    Official Communication
                  </span>
                </div>
                <div className="mt-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Campus Recruitment Assessment — 2026</h2>
                  <p className="text-sm text-slate-300 mt-1">Official Invitation & Secured Candidate Credentials</p>
                </div>
              </div>

              {/* Email Body */}
              <div className="p-6 sm:p-8 space-y-6 text-slate-800">
                <div>
                  <p className="font-semibold text-slate-900 text-base">Dear {candidate.name},</p>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                    Following your initial campus application through <strong>{candidate.college}</strong> ({candidate.branch}), we are pleased to inform you that you have been shortlisted to participate in Phase 1 of the <strong>Brainovision Recruitment Assessment</strong> for the role of <strong>{candidate.position}</strong>.
                  </p>
                </div>

                {/* Assessment Details Box */}
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Assessment Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-blue-600" />
                      <span className="text-slate-500">Candidate ID:</span>
                      <strong className="text-slate-900 font-mono">{candidate.candidateId}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-slate-500">Exam Date:</span>
                      <strong className="text-slate-900">26 September 2026</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-slate-500">Duration:</span>
                      <strong className="text-slate-900">45 Minutes (40 MCQs)</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-slate-500">Proctoring:</span>
                      <strong className="text-emerald-700 font-medium">Secured AI Monitored</strong>
                    </div>
                  </div>
                </div>

                {/* Candidate Access Credentials Card */}
                <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                      <Key className="w-4 h-4 text-blue-600" />
                      Your Secured Login Credentials
                    </h3>
                    <button
                      onClick={handleCopyCredentials}
                      className="text-xs bg-white text-blue-700 hover:bg-blue-100 px-3 py-1 rounded-md font-medium border border-blue-300 flex items-center gap-1 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied!' : 'Copy Credentials'}
                    </button>
                  </div>

                  <div className="space-y-2 font-mono text-sm bg-white p-4 rounded-lg border border-blue-100">
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-sans">Assessment Portal:</span>
                      <span className="text-blue-700 font-semibold">careers.brainovision.in</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-sans">Candidate ID:</span>
                      <span className="text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded">{candidate.candidateId}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500 font-sans">Temporary Password:</span>
                      <span className="text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded">{candidate.password}</span>
                    </div>
                  </div>
                </div>

                {/* Mandatory Rules Checklist */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Important Instructions</p>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5 leading-relaxed">
                    <li>Assessment must be taken on a <strong>laptop or desktop</strong> computer with stable internet.</li>
                    <li>The test is conducted in locked <strong>fullscreen mode</strong>. Tab switches and window unfocus are strictly logged.</li>
                    <li>Copy/Paste, developer shortcuts, and right-click menus are disabled.</li>
                    <li>Once submitted, answers cannot be modified and the test cannot be restarted.</li>
                  </ul>
                </div>

                {/* Footer Signature */}
                <div className="pt-6 border-t border-slate-200 text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-800">Regards,</p>
                  <p className="font-bold text-slate-900">Talent Acquisition Team</p>
                  <p>Brainovision Solutions India Pvt. Ltd.</p>
                  <p className="text-blue-600">Official Inquiries: hiring@brainovision.in</p>
                  <p className="text-slate-400 text-[11px] pt-2">
                    This is an automated recruitment dispatch. Please do not share your confidential candidate credentials.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Bottom Actions */}
          <div className="bg-slate-100 px-6 py-4 flex items-center justify-between border-t border-slate-200">
            <span className="text-xs text-slate-500">
              Message ID: <span className="font-mono text-slate-700">{candidate.messageId || `msg-${candidate.candidateId}`}</span>
            </span>
            <div className="flex items-center gap-3">
              <a
                href="/assessment"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs px-4 py-2 flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-medium"
              >
                Open Assessment Portal <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
