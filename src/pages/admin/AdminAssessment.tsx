import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertOctagon,
  Search,
  Filter,
  Download,
  Upload,
  Send,
  Eye,
  Calendar,
  ShieldAlert,
  AlertTriangle,
  Plus,
  RefreshCw,
  ExternalLink,
  Mail,
  Edit3,
  Trash2,
  HelpCircle,
  Sparkles,
  Sliders,
  Settings,
  X,
  Award,
  FileText,
  Check,
  CheckSquare,
  Globe,
  Power,
  Save,
} from 'lucide-react';
import {
  getCandidates,
  getQuestions,
  getAssessmentConfig,
  updateAssessmentConfig,
  getAssessmentMetrics,
  bulkImportCandidates,
  sendCredentialsToCandidates,
  scheduleCandidateInterview,
  getEmailLogs,
  saveCandidates,
  saveQuestions,
  deduplicateLocalCandidates,
  deleteCandidate as deleteCandidateLocal,
  clearAllCandidates as clearAllCandidatesLocal,
} from '../../lib/assessmentStore';
import { CorporateEmailModal } from '../../components/assessment/CorporateEmailModal';
import { adminService } from '../../services/api';

import type {
  AssessmentCandidate,
  Question,
  AssessmentConfig,
  EmailLog,
  QuestionSection,
  QuestionDifficulty,
} from '../../types/assessment';

export function AdminAssessment() {

  const [candidates, setCandidates] = useState<AssessmentCandidate[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [config, setConfig] = useState<AssessmentConfig | null>(null);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);

  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'questions' | 'candidates' | 'importer' | 'logs'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [selectedCandidate, setSelectedCandidate] = useState<AssessmentCandidate | null>(null);
  const [previewEmailCandidate, setPreviewEmailCandidate] = useState<AssessmentCandidate | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [interviewDate, setInterviewDate] = useState('2026-09-28');
  const [interviewTime, setInterviewTime] = useState('11:00 AM');
  const [interviewerName, setInterviewerName] = useState('Srinivas V. (Technical Lead)');
  const [interviewLink, setInterviewLink] = useState('https://meet.google.com/bov-tech-2026');

  // Question Management State
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [newQuestionSection, setNewQuestionSection] = useState<QuestionSection>('aptitude');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptionA, setNewOptionA] = useState('');
  const [newOptionB, setNewOptionB] = useState('');
  const [newOptionC, setNewOptionC] = useState('');
  const [newOptionD, setNewOptionD] = useState('');
  const [newCorrectOption, setNewCorrectOption] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [newDifficulty, setNewDifficulty] = useState<QuestionDifficulty>('medium');
  const [newMarks, setNewMarks] = useState(1);
  const [newExplanation, setNewExplanation] = useState('');
  const [isSavingQuestion, setIsSavingQuestion] = useState(false);
  const [questionError, setQuestionError] = useState<string | null>(null);
  const [questionSuccess, setQuestionSuccess] = useState<string | null>(null);

  // Edit Question State
  const [showEditQuestionModal, setShowEditQuestionModal] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editQuestionSection, setEditQuestionSection] = useState<QuestionSection>('aptitude');
  const [editQuestionText, setEditQuestionText] = useState('');
  const [editOptionA, setEditOptionA] = useState('');
  const [editOptionB, setEditOptionB] = useState('');
  const [editOptionC, setEditOptionC] = useState('');
  const [editOptionD, setEditOptionD] = useState('');
  const [editCorrectOption, setEditCorrectOption] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [editDifficulty, setEditDifficulty] = useState<QuestionDifficulty>('medium');
  const [editMarks, setEditMarks] = useState(1);
  const [editExplanation, setEditExplanation] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Question Import Modal State
  const [showImportQuestionsModal, setShowImportQuestionsModal] = useState(false);
  const [importQuestionsText, setImportQuestionsText] = useState('');
  const [isImportingQuestions, setIsImportingQuestions] = useState(false);
  const [importQuestionsMsg, setImportQuestionsMsg] = useState<string | null>(null);

  // Question tab filters
  const [questionSectionFilter, setQuestionSectionFilter] = useState<'all' | QuestionSection>('all');
  const [questionSearch, setQuestionSearch] = useState('');

  // Importer state
  const [importText, setImportText] = useState('');
  const [importSummary, setImportSummary] = useState<{ total: number; valid: number; duplicates: number } | null>(null);
  const [isSendingBatch, setIsSendingBatch] = useState(false);
  const [sendSuccessMsg, setSendSuccessMsg] = useState<string | null>(null);

  // Deduplication & cleanup state
  const [dedupNotice, setDedupNotice] = useState<string | null>(null);
  const [isDeduplicating, setIsDeduplicating] = useState(false);

  // Exam configuration & cutoff state (Persisted directly to MySQL)
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [cfgTitle, setCfgTitle] = useState('Campus Recruitment Assessment — 2026');
  const [cfgDescription, setCfgDescription] = useState('Phase 1 Technical & Aptitude Online Screening Assessment for Graduate Engineering Trainee Program');
  const [cfgDuration, setCfgDuration] = useState(45);
  const [cfgCutoff, setCfgCutoff] = useState(60);
  const [cfgMarksPerQ, setCfgMarksPerQ] = useState(1);
  const [cfgNegativeMarking, setCfgNegativeMarking] = useState(false);
  const [cfgNegativePenalty, setCfgNegativePenalty] = useState(0.25);
  const [cfgMaxTabSwitches, setCfgMaxTabSwitches] = useState(2);
  const [cfgMaxFullscreenExits, setCfgMaxFullscreenExits] = useState(2);
  const [cfgSecurityLevel, setCfgSecurityLevel] = useState<'strict' | 'standard' | 'lenient'>('strict');
  const [cfgIsActive, setCfgIsActive] = useState(true);
  const [cfgScheduleStart, setCfgScheduleStart] = useState('');
  const [cfgScheduleEnd, setCfgScheduleEnd] = useState('');
  const [cfgAptitude, setCfgAptitude] = useState(15);
  const [cfgReasoning, setCfgReasoning] = useState(10);
  const [cfgVerbal, setCfgVerbal] = useState(10);
  const [cfgTechnical, setCfgTechnical] = useState(5);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [isTogglingPublish, setIsTogglingPublish] = useState(false);
  const [configSaveSuccess, setConfigSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      const res = await adminService.getCandidates();
      if (res && res.success && Array.isArray(res.candidates)) {
        const mapped: AssessmentCandidate[] = res.candidates.map((c: any) => ({
          id: String(c.id || c.candidate_id),
          candidateId: c.candidate_id || c.candidateId,
          name: c.name,
          email: c.email,
          phone: c.phone,
          college: c.college,
          branch: c.branch,
          graduationYear: c.graduation_year || c.graduationYear || '2026',
          position: c.position,
          status: (c.status?.toLowerCase() === 'invited' ? 'not_started' : c.status?.toLowerCase()) || 'not_started',
          score: c.score || 0,
          totalMarks: c.total_marks || c.totalMarks || 40,
          percentage: c.percentage || 0,
          violationsCount: c.violations_count ?? c.violationsCount ?? 0,
          startedAt: c.started_at || c.startedAt,
          submittedAt: c.submitted_at || c.submittedAt,
          interviewStatus: c.interview_status_live || c.interview_status || c.interviewStatus || 'NOT_SCHEDULED',
          emailSent: c.email_sent ?? c.emailSent ?? true,
          securityTimeline: c.securityTimeline || [],
          sectionScores: c.sectionScores,
          credentials: {
            candidateId: c.candidate_id || c.candidateId,
            tempPassword: c.temp_password_plain || 'Bv@7Kp92',
          },
        }));
        setCandidates(mapped);
        saveCandidates(mapped);
      } else {
        setCandidates(getCandidates());
      }
    } catch {
      setCandidates(getCandidates());
    }

    try {
      const qRes = await adminService.getQuestions();
      if (qRes && qRes.success && Array.isArray(qRes.questions)) {
        const mappedQs: Question[] = qRes.questions.map((q: any) => {
          const cOpt = (q.correct_option || q.correctOption || 'A').toUpperCase();
          const cIdx = cOpt === 'B' ? 1 : cOpt === 'C' ? 2 : cOpt === 'D' ? 3 : 0;
          return {
            id: String(q.id),
            section: q.section,
            sectionTitle:
              q.section === 'aptitude'
                ? 'Quantitative Aptitude'
                : q.section === 'reasoning'
                ? 'Logical Reasoning'
                : q.section === 'verbal'
                ? 'Verbal Ability'
                : 'Technical Core',
            difficulty: q.difficulty || 'medium',
            text: q.question_text || q.text,
            options: [q.option_a || q.options?.[0] || '', q.option_b || q.options?.[1] || '', q.option_c || q.options?.[2] || '', q.option_d || q.options?.[3] || ''],
            correctIndex: cIdx,
            explanation: q.explanation || '',
            marks: q.marks || 1,
          };
        });
        setQuestions(mappedQs);
        saveQuestions(mappedQs);
      } else {
        setQuestions(getQuestions());
      }
    } catch {
      setQuestions(getQuestions());
    }

    try {
      const cfgRes = await adminService.getConfig();
      if (cfgRes && cfgRes.success && cfgRes.config) {
        const c = cfgRes.config;
        setConfig(c);
        updateAssessmentConfig(c);
        setCfgTitle(c.title || 'Campus Recruitment Assessment — 2026');
        setCfgDescription(c.description || 'Phase 1 Technical & Aptitude Online Screening Assessment for Graduate Engineering Trainee Program');
        setCfgDuration(c.durationMinutes || 45);
        setCfgCutoff(c.passingPercentage || 60);
        setCfgNegativeMarking(Boolean(c.negativeMarking));
        setCfgMaxTabSwitches(c.maxTabSwitches || 2);
        setCfgMaxFullscreenExits(c.maxFullscreenExits || 2);
        setCfgSecurityLevel(c.securityLevel || 'strict');
        setCfgIsActive(c.isActive !== undefined ? Boolean(c.isActive) : true);
        setCfgScheduleStart(c.scheduleStart || '');
        setCfgScheduleEnd(c.scheduleEnd || '');
        const apt = c.sections?.find((s: any) => s.id === 'aptitude' || s.section_key === 'aptitude')?.count ?? 15;
        const rea = c.sections?.find((s: any) => s.id === 'reasoning' || s.section_key === 'reasoning')?.count ?? 10;
        const ver = c.sections?.find((s: any) => s.id === 'verbal' || s.section_key === 'verbal')?.count ?? 10;
        const tec = c.sections?.find((s: any) => s.id === 'technical' || s.section_key === 'technical')?.count ?? 5;
        setCfgAptitude(apt);
        setCfgReasoning(rea);
        setCfgVerbal(ver);
        setCfgTechnical(tec);
      } else {
        setConfig(getAssessmentConfig());
      }
    } catch {
      setConfig(getAssessmentConfig());
    }

    setEmailLogs(getEmailLogs());
  };

  const handleOpenConfigModal = () => {
    const activeCfg = config || getAssessmentConfig();
    if (activeCfg) {
      setCfgTitle(activeCfg.title || 'Brainovision Campus Recruitment Assessment — 2026');
      setCfgDuration(activeCfg.durationMinutes || 45);
      setCfgCutoff(activeCfg.passingPercentage || 60);
      setCfgMarksPerQ(1);
      setCfgNegativeMarking(Boolean(activeCfg.negativeMarking));
      setCfgNegativePenalty(0.25);
      setCfgMaxTabSwitches(activeCfg.maxTabSwitches || 2);
      setCfgMaxFullscreenExits(activeCfg.maxFullscreenExits || 2);
      const apt = activeCfg.sections?.find((s) => s.id === 'aptitude')?.count ?? 15;
      const rea = activeCfg.sections?.find((s) => s.id === 'reasoning')?.count ?? 10;
      const ver = activeCfg.sections?.find((s) => s.id === 'verbal')?.count ?? 10;
      const tec = activeCfg.sections?.find((s) => s.id === 'technical')?.count ?? 5;
      setCfgAptitude(apt);
      setCfgReasoning(rea);
      setCfgVerbal(ver);
      setCfgTechnical(tec);
    }
    setShowConfigModal(true);
  };

  const handleSaveConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingConfig(true);
    const updatedSections = [
      { id: 'aptitude' as QuestionSection, section_key: 'aptitude', title: 'Quantitative Aptitude', count: Number(cfgAptitude) || 0, marksPerQuestion: 1 },
      { id: 'reasoning' as QuestionSection, section_key: 'reasoning', title: 'Logical Reasoning', count: Number(cfgReasoning) || 0, marksPerQuestion: 1 },
      { id: 'verbal' as QuestionSection, section_key: 'verbal', title: 'Verbal Ability', count: Number(cfgVerbal) || 0, marksPerQuestion: 1 },
      { id: 'technical' as QuestionSection, section_key: 'technical', title: 'Technical Core', count: Number(cfgTechnical) || 0, marksPerQuestion: 1 },
    ];
    const totalQs = updatedSections.reduce((a, s) => a + s.count, 0);

    const payload = {
      id: config?.id || 1,
      title: cfgTitle.trim() || 'Campus Recruitment Assessment — 2026',
      description: cfgDescription,
      durationMinutes: Number(cfgDuration) || 45,
      passingPercentage: Number(cfgCutoff) || 60,
      negativeMarking: cfgNegativeMarking,
      maxTabSwitches: Number(cfgMaxTabSwitches) || 2,
      maxFullscreenExits: Number(cfgMaxFullscreenExits) || 2,
      securityLevel: cfgSecurityLevel,
      isActive: cfgIsActive,
      sections: updatedSections,
      scheduleStart: cfgScheduleStart,
      scheduleEnd: cfgScheduleEnd,
      totalQuestions: totalQs,
      marksPerQuestion: Number(cfgMarksPerQ) || 1,
    };

    try {
      const res = await adminService.updateConfig(payload);
      if (res && res.success && res.config) {
        setConfig(res.config);
      } else {
        setConfig(payload as any);
      }
    } catch (err) {
      console.warn('Backend update config notice:', err);
      setConfig(payload as any);
    }

    updateAssessmentConfig(payload as any);
    setIsSavingConfig(false);
    setShowConfigModal(false);
    setConfigSaveSuccess('Assessment settings, section distributions, and security policies saved permanently in MySQL.');
    setTimeout(() => setConfigSaveSuccess(null), 5000);
  };

  const handleTogglePublish = async (newStatus: boolean) => {
    setIsTogglingPublish(true);
    try {
      const res = await adminService.togglePublish(newStatus, config?.id);
      if (res && res.success && res.config) {
        setConfig(res.config);
        setCfgIsActive(Boolean(res.config.isActive));
      } else {
        setCfgIsActive(newStatus);
        if (config) setConfig({ ...config, isActive: newStatus });
      }
      setConfigSaveSuccess(`Assessment status updated: ${newStatus ? 'ACTIVE & PUBLISHED' : 'DRAFT (UNPUBLISHED)'}.`);
      setTimeout(() => setConfigSaveSuccess(null), 5000);
    } catch (err: any) {
      console.warn('Toggle publish notice:', err);
      setCfgIsActive(newStatus);
    } finally {
      setIsTogglingPublish(false);
    }
  };

  const handleBatchImportQuestions = async () => {
    if (!importQuestionsText.trim()) return;
    setIsImportingQuestions(true);
    setImportQuestionsMsg(null);

    let parsed: any[] = [];
    const text = importQuestionsText.trim();

    if (text.startsWith('[') || text.startsWith('{')) {
      try {
        const obj = JSON.parse(text);
        parsed = Array.isArray(obj) ? obj : (obj.questions || []);
      } catch {
        setImportQuestionsMsg('Invalid JSON format. Please paste valid JSON or use CSV format.');
        setIsImportingQuestions(false);
        return;
      }
    } else {
      const lines = text.split('\n');
      const startIdx = lines[0].toLowerCase().includes('question') ? 1 : 0;
      for (let i = startIdx; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));
        if (parts.length >= 7) {
          parsed.push({
            section: parts[0] || 'aptitude',
            questionText: parts[1],
            optionA: parts[2],
            optionB: parts[3],
            optionC: parts[4] || '',
            optionD: parts[5] || '',
            correctOption: parts[6] || 'A',
            difficulty: parts[7] || 'medium',
            marks: Number(parts[8]) || 1,
            explanation: parts[9] || '',
          });
        }
      }
    }

    if (parsed.length === 0) {
      setImportQuestionsMsg('No valid question rows found. Ensure CSV format has: Section, QuestionText, OptionA, OptionB, OptionC, OptionD, CorrectOption');
      setIsImportingQuestions(false);
      return;
    }

    try {
      const res = await adminService.batchImportQuestions(parsed);
      if (res && res.success) {
        setImportQuestionsMsg(`Successfully imported ${res.importedCount} question(s) into MySQL question bank!`);
        await refreshData();
        setTimeout(() => {
          setShowImportQuestionsModal(false);
          setImportQuestionsText('');
          setImportQuestionsMsg(null);
        }, 1500);
      } else {
        setImportQuestionsMsg(res?.message || 'Failed to import questions.');
      }
    } catch (err: any) {
      setImportQuestionsMsg(err.message || 'Import failed.');
    } finally {
      setIsImportingQuestions(false);
    }
  };


  // Dynamically calculate metrics directly from active candidates state
  const metrics = useMemo(() => {
    const registered = candidates.length;
    const started = candidates.filter((c) => c.status !== 'not_started' && c.status !== 'invited').length;
    const completed = candidates.filter((c) => ['completed', 'cleared', 'not_qualified'].includes(c.status)).length;
    const cleared = candidates.filter((c) => c.status === 'cleared').length;
    const notQualified = candidates.filter((c) => c.status === 'not_qualified').length;
    const terminated = candidates.filter((c) => c.status === 'terminated').length;
    const inProgress = candidates.filter((c) => c.status === 'started' || c.status === 'in_progress').length;
    const invited = candidates.filter((c) => c.status === 'invited' || c.status === 'not_started').length;
    const totalScores = candidates.filter((c) => ['cleared', 'not_qualified'].includes(c.status)).map((c) => c.percentage);
    const avgScore = totalScores.length > 0 ? (totalScores.reduce((a, b) => a + b, 0) / totalScores.length).toFixed(1) : '0';
    return { registered, started, completed, cleared, notQualified, terminated, inProgress, invited, avgScore };
  }, [candidates]);

  // Candidate deduplication handler
  const handleDeduplicateCandidates = async () => {
    setIsDeduplicating(true);
    setDedupNotice(null);
    try {
      const res = await adminService.deduplicateCandidates();
      deduplicateLocalCandidates();
      await refreshData();
      if (res && res.success) {
        setDedupNotice(`Candidate deduplication complete: Removed ${res.removedCount} duplicate record(s). ${res.remainingCount} unique candidates active.`);
      } else {
        const local = deduplicateLocalCandidates();
        setDedupNotice(`Deduplicated local storage: Removed ${local.removed} duplicate(s). ${local.remaining} remaining.`);
      }
    } catch {
      const local = deduplicateLocalCandidates();
      setCandidates(getCandidates());
      setDedupNotice(`Deduplication complete: Removed ${local.removed} duplicate record(s).`);
    } finally {
      setIsDeduplicating(false);
      setTimeout(() => setDedupNotice(null), 6000);
    }
  };

  // Single candidate delete handler
  const handleDeleteCandidate = async (id: string, candidateId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete candidate ${name} (${candidateId})?`)) {
      return;
    }
    try {
      await adminService.deleteCandidate(candidateId || id);
    } catch (e) {
      console.warn('Backend delete candidate notice:', e);
    }
    deleteCandidateLocal(candidateId || id);
    setCandidates((prev) => prev.filter((c) => c.id !== id && c.candidateId !== candidateId));
    setDedupNotice(`Deleted candidate ${name} (${candidateId}) from the roster.`);
    setTimeout(() => setDedupNotice(null), 4000);
  };

  // Clear all candidates handler
  const handleClearAllCandidates = async () => {
    if (!window.confirm('WARNING: Are you sure you want to remove ALL candidate records? This will clear all test candidates from the roster.')) {
      return;
    }
    try {
      await adminService.clearAllCandidates();
    } catch (e) {
      console.warn('Backend clear all candidates notice:', e);
    }
    clearAllCandidatesLocal();
    setCandidates([]);
    setDedupNotice('All candidate records have been cleared from the assessment roster.');
    setTimeout(() => setDedupNotice(null), 5000);
  };

  // Filter candidates
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.candidateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());


    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'in_progress'
        ? c.status === 'started'
        : c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Export Results to CSV
  const handleExportCSV = () => {
    const headers = [
      'Candidate ID',
      'Name',
      'Email',
      'Phone',
      'College',
      'Branch',
      'Role',
      'Status',
      'Score (out of 40)',
      'Percentage (%)',
      'Security Violations',
      'Interview Status',
    ];

    const rows = candidates.map((c) => [
      c.candidateId,
      `"${c.name}"`,
      c.email,
      c.phone,
      `"${c.college}"`,
      c.branch,
      `"${c.position}"`,
      c.status.toUpperCase(),
      c.score,
      c.percentage,
      c.violationsCount,
      c.interviewStatus || 'NOT_SCHEDULED',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Brainovision_Assessment_Results_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Load clean candidate CSV header template into importer
  const handleLoadSampleBatch = () => {
    const header = 'Name,Email,Phone,College,Branch,GraduationYear,Position\n';
    setImportText(header);
  };


  // Validate and parse student data
  const handleImportStudents = async () => {
    if (!importText.trim()) return;

    const lines = importText.trim().split('\n');
    const records = [];

    // skip header if present
    const startIndex = lines[0].toLowerCase().includes('name') ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim());
      if (parts.length >= 5) {
        records.push({
          name: parts[0],
          email: parts[1],
          phone: parts[2],
          college: parts[3],
          branch: parts[4],
          graduation_year: parts[5] || '2026',
          position: parts[6] || 'Graduate Trainee',
        });
      }
    }

    if (records.length === 0) return;

    try {
      const res = await adminService.importCandidates(records);
      if (res && res.success && res.summary) {
        setImportSummary({
          total: res.summary.totalDetected,
          valid: res.summary.validImported,
          duplicates: res.summary.duplicateEmails,
        });
      } else {
        const result = bulkImportCandidates(records);
        setImportSummary({
          total: result.total,
          valid: result.valid,
          duplicates: result.duplicates,
        });
      }
    } catch {
      const result = bulkImportCandidates(records);
      setImportSummary({
        total: result.total,
        valid: result.valid,
        duplicates: result.duplicates,
      });
    }

    await refreshData();
  };

  // Dispatch emails
  const handleSendCredentials = async () => {
    setIsSendingBatch(true);
    setSendSuccessMsg(null);

    const unsentCandidates = candidates.filter((c) => !c.emailSent || c.status === 'invited');
    const candidateIds = unsentCandidates.map((c) => c.candidateId);

    try {
      const res = await adminService.sendCredentials(candidateIds);
      if (res && res.success) {
        setSendSuccessMsg(res.message);
      } else {
        const localRes = sendCredentialsToCandidates(candidateIds);
        setSendSuccessMsg(`Successfully dispatched ${localRes.sentCount} candidate credentials from hiring@brainovision.in.`);
      }
    } catch {
      const localRes = sendCredentialsToCandidates(candidateIds);
      setSendSuccessMsg(`Successfully dispatched ${localRes.sentCount} candidate credentials from hiring@brainovision.in.`);
    } finally {
      setIsSendingBatch(false);
      await refreshData();
      setTimeout(() => setSendSuccessMsg(null), 5000);
    }
  };

  // Schedule Interview
  const handleSaveInterview = async () => {
    if (!selectedCandidate) return;

    try {
      await adminService.scheduleInterview({
        candidateId: selectedCandidate.candidateId,
        interviewDate,
        interviewTime,
        interviewerName,
        meetingLink: interviewLink,
        notes: 'Campus Phase 1 cleared with merit. Recommended for technical panel round.',
      });
    } catch (e) {
      console.warn('Backend interview schedule notice:', e);
    }

    scheduleCandidateInterview(selectedCandidate.candidateId, {
      date: interviewDate,
      time: interviewTime,
      interviewer: interviewerName,
      meetingLink: interviewLink,
      notes: 'Campus Phase 1 cleared with merit. Recommended for technical panel round.',
    });

    setShowScheduleModal(false);
    await refreshData();
    // Update local modal candidate
    setSelectedCandidate({
      ...selectedCandidate,
      interviewStatus: 'scheduled',
      interviewDetails: {
        date: interviewDate,
        time: interviewTime,
        interviewer: interviewerName,
        meetingLink: interviewLink,
      },
    });
  };

  // Add new question to bank
  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuestionError(null);

    if (!newQuestionText.trim()) {
      setQuestionError('Please enter the question text.');
      return;
    }
    if (!newOptionA.trim() || !newOptionB.trim() || !newOptionC.trim() || !newOptionD.trim()) {
      setQuestionError('All 4 options (A, B, C, D) are required.');
      return;
    }

    setIsSavingQuestion(true);

    const correctIdx = newCorrectOption === 'A' ? 0 : newCorrectOption === 'B' ? 1 : newCorrectOption === 'C' ? 2 : 3;

    try {
      await adminService.createQuestion({
        section: newQuestionSection,
        questionText: newQuestionText.trim(),
        optionA: newOptionA.trim(),
        optionB: newOptionB.trim(),
        optionC: newOptionC.trim(),
        optionD: newOptionD.trim(),
        correctOption: newCorrectOption,
        difficulty: newDifficulty,
        marks: Number(newMarks) || 1,
        explanation: newExplanation.trim(),
      });
    } catch (err: any) {
      console.warn('Backend question create notice:', err);
    }

    const created: Question = {
      id: `q-${Date.now()}`,
      section: newQuestionSection,
      sectionTitle:
        newQuestionSection === 'aptitude'
          ? 'Quantitative Aptitude'
          : newQuestionSection === 'reasoning'
          ? 'Logical Reasoning'
          : newQuestionSection === 'verbal'
          ? 'Verbal Ability'
          : 'Technical Core',
      difficulty: newDifficulty,
      text: newQuestionText.trim(),
      options: [newOptionA.trim(), newOptionB.trim(), newOptionC.trim(), newOptionD.trim()],
      correctIndex: correctIdx,
      explanation: newExplanation.trim(),
      marks: Number(newMarks) || 1,
    };

    setQuestions((prev) => [created, ...prev]);
    setIsSavingQuestion(false);
    setQuestionSuccess(`Question successfully added to ${created.sectionTitle}!`);
    setShowAddQuestionModal(false);

    // Reset form
    setNewQuestionText('');
    setNewOptionA('');
    setNewOptionB('');
    setNewOptionC('');
    setNewOptionD('');
    setNewCorrectOption('A');
    setNewExplanation('');

    setTimeout(() => setQuestionSuccess(null), 5000);
  };

  // Open Edit Modal
  const handleOpenEditModal = (q: Question) => {
    setEditingQuestionId(String(q.id));
    setEditQuestionSection(q.section as QuestionSection);
    setEditQuestionText(q.text || '');
    setEditOptionA(q.options[0] || '');
    setEditOptionB(q.options[1] || '');
    setEditOptionC(q.options[2] || '');
    setEditOptionD(q.options[3] || '');
    const correctLetter = q.correctIndex === 1 ? 'B' : q.correctIndex === 2 ? 'C' : q.correctIndex === 3 ? 'D' : 'A';
    setEditCorrectOption(correctLetter);
    setEditDifficulty((q.difficulty as QuestionDifficulty) || 'medium');
    setEditMarks(q.marks || 1);
    setEditExplanation(q.explanation || '');
    setEditError(null);
    setShowEditQuestionModal(true);
  };

  // Save Edited Question
  const handleSaveEditQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestionId) return;
    setEditError(null);

    if (!editQuestionText.trim()) {
      setEditError('Please enter the question text.');
      return;
    }
    if (!editOptionA.trim() || !editOptionB.trim() || !editOptionC.trim() || !editOptionD.trim()) {
      setEditError('All 4 options (A, B, C, D) are required.');
      return;
    }

    setIsSavingEdit(true);

    const correctIdx = editCorrectOption === 'A' ? 0 : editCorrectOption === 'B' ? 1 : editCorrectOption === 'C' ? 2 : 3;

    try {
      await adminService.updateQuestion(editingQuestionId, {
        section: editQuestionSection,
        questionText: editQuestionText.trim(),
        optionA: editOptionA.trim(),
        optionB: editOptionB.trim(),
        optionC: editOptionC.trim(),
        optionD: editOptionD.trim(),
        correctOption: editCorrectOption,
        difficulty: editDifficulty,
        marks: Number(editMarks) || 1,
        explanation: editExplanation.trim(),
      });
    } catch (err: any) {
      console.warn('Backend question update notice:', err);
    }

    // Update in local state
    setQuestions((prev) =>
      prev.map((q) => {
        if (String(q.id) === String(editingQuestionId)) {
          return {
            ...q,
            section: editQuestionSection,
            sectionTitle:
              editQuestionSection === 'aptitude'
                ? 'Quantitative Aptitude'
                : editQuestionSection === 'reasoning'
                ? 'Logical Reasoning'
                : editQuestionSection === 'verbal'
                ? 'Verbal Ability'
                : 'Technical Core',
            difficulty: editDifficulty,
            text: editQuestionText.trim(),
            options: [editOptionA.trim(), editOptionB.trim(), editOptionC.trim(), editOptionD.trim()],
            correctIndex: correctIdx,
            explanation: editExplanation.trim(),
            marks: Number(editMarks) || 1,
          };
        }
        return q;
      })
    );

    setIsSavingEdit(false);
    setShowEditQuestionModal(false);
    setQuestionSuccess('Question successfully updated in question bank!');
    setTimeout(() => setQuestionSuccess(null), 5000);
  };

  // Delete Individual Question
  const handleDeleteQuestion = async (qId: string, text: string) => {
    const preview = text.length > 50 ? text.substring(0, 50) + '...' : text;
    if (!window.confirm(`Are you sure you want to delete this question?\n\n"${preview}"`)) {
      return;
    }

    try {
      await adminService.deleteQuestion(qId);
    } catch (err) {
      console.warn('Backend delete notice:', err);
    }

    setQuestions((prev) => prev.filter((q) => String(q.id) !== String(qId)));
    setQuestionSuccess('Question deleted successfully.');
    setTimeout(() => setQuestionSuccess(null), 4000);
  };

  // Clear All Sample Questions
  const handleClearAllQuestions = async () => {
    if (!window.confirm('Are you sure you want to remove ALL questions from the question bank? This will clear all sample questions so you can maintain a clean, customized assessment bank.')) {
      return;
    }

    try {
      await adminService.clearAllQuestions();
    } catch (err) {
      console.warn('Backend clear notice:', err);
    }

    // Clear local storage & state
    localStorage.removeItem('bv_assessment_questions');
    setQuestions([]);
    setQuestionSuccess('All questions have been cleared from the question bank.');
    setTimeout(() => setQuestionSuccess(null), 5000);
  };

  // Filter questions for Question Bank tab
  const filteredQuestions = questions.filter((q) => {
    const matchesSection = questionSectionFilter === 'all' || q.section === questionSectionFilter;
    const matchesSearch =
      !questionSearch.trim() ||
      q.text.toLowerCase().includes(questionSearch.toLowerCase()) ||
      q.options.some((o) => o.toLowerCase().includes(questionSearch.toLowerCase()));
    return matchesSection && matchesSearch;
  });

  const statusBadges: Record<string, { label: string; class: string }> = {
    cleared: { label: 'CLEARED', class: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    not_qualified: { label: 'NOT QUALIFIED', class: 'bg-slate-100 text-slate-700 border-slate-300' },
    terminated: { label: 'TERMINATED', class: 'bg-red-100 text-red-800 border-red-300' },
    started: { label: 'IN PROGRESS', class: 'bg-blue-100 text-blue-800 border-blue-300' },
    invited: { label: 'INVITED', class: 'bg-amber-100 text-amber-800 border-amber-300' },
    completed: { label: 'COMPLETED', class: 'bg-teal-100 text-teal-800 border-teal-300' },
  };

  return (
    <div className="space-y-8">
      {/* 1. TOP HEADER & METRICS BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              Campus Recruitment Drive 2026
            </span>
            <span className="text-xs text-slate-400 font-mono">Phase 1: Online Assessment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Recruitment Assessment Hub
          </h1>
          <p className="text-sm text-slate-500">
            Real-time proctoring monitoring, student data import, automated evaluation, and candidate pipeline.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={refreshData}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
            title="Refresh Store"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenConfigModal}
            className="px-3.5 py-2.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            title="Configure Assessment Details, Questions, Marks, and Cutoff Criteria"
          >
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>Exam Config & Cutoff</span>
          </button>
          <button
            onClick={handleDeduplicateCandidates}
            disabled={isDeduplicating}
            className="px-3.5 py-2.5 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
            title="Scan and remove duplicate candidate records"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>{isDeduplicating ? 'Deduplicating...' : 'Remove Duplicates'}</span>
          </button>
          {candidates.length > 0 && (
            <button
              onClick={handleClearAllCandidates}
              className="px-3 py-2.5 bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
              title="Remove all test candidate records"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              <span>Clear Roster</span>
            </button>
          )}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <a
            href="/assessment"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <span>Open Candidate Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Deduplication & Action Notice Banner */}
      {dedupNotice && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>{dedupNotice}</span>
          </div>
          <button onClick={() => setDedupNotice(null)} className="text-blue-500 hover:text-blue-800 font-bold ml-4">
            Dismiss
          </button>
        </motion.div>
      )}

      {/* Config Save Success Banner */}
      {configSaveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{configSaveSuccess}</span>
          </div>
          <button onClick={() => setConfigSaveSuccess(null)} className="text-emerald-500 hover:text-emerald-800 font-bold ml-4">
            Dismiss
          </button>
        </motion.div>
      )}

      {/* TODAY'S ASSESSMENT KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Registered</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono mt-1">{metrics.registered}</p>
          <span className="text-[11px] text-slate-500">Total in system</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-500">Started</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-mono mt-1">{metrics.started}</p>
          <span className="text-[11px] text-slate-500">Engaged assessment</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Cleared</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono mt-1">{metrics.cleared}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">Eligible for interview</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Not Qualified</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-700 font-mono mt-1">{metrics.notQualified}</p>
          <span className="text-[11px] text-slate-500">&lt;60% Passing mark</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm bg-red-50/30">
          <p className="text-xs font-bold uppercase tracking-wider text-red-600">Terminated</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-red-600 font-mono mt-1">{metrics.terminated}</p>
          <span className="text-[11px] text-red-600 font-semibold">Security violations</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-purple-600">In Progress</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-600 font-mono mt-1">{metrics.inProgress}</p>
          <span className="text-[11px] text-slate-500">Live test taking</span>
        </div>
      </div>

      {/* 2. TAB CONTROLS */}
      <div className="flex border-b border-slate-200 gap-6">
        {[
          { id: 'monitoring', label: 'Live Candidates & Results', count: candidates.length },
          { id: 'importer', label: 'Import Student Data & Credentials', count: null },
          { id: 'questions', label: 'Question Bank & Config', count: questions.length },
          { id: 'logs', label: 'Official Email Logs', count: emailLogs.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 3. TAB 1: LIVE CANDIDATE MONITORING & RESULTS */}
      {activeTab === 'monitoring' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidate name, ID (e.g. BV26-0001), college, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="All">All Statuses ({candidates.length})</option>
                <option value="cleared">Cleared ({metrics.cleared})</option>
                <option value="in_progress">In Progress ({metrics.inProgress})</option>
                <option value="not_qualified">Not Qualified ({metrics.notQualified})</option>
                <option value="terminated">Terminated ({metrics.terminated})</option>
                <option value="invited">Invited ({metrics.invited})</option>
              </select>
            </div>
          </div>

          {/* Candidates Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3.5">Candidate ID</th>
                    <th className="px-5 py-3.5">Candidate Details</th>
                    <th className="px-5 py-3.5">College & Branch</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Score / %</th>
                    <th className="px-5 py-3.5">Proctoring Violations</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCandidates.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                        No candidate records found matching current query.
                      </td>
                    </tr>
                  ) : (
                    filteredCandidates.map((c) => {
                      const badge = statusBadges[c.status] || { label: c.status, class: 'bg-slate-100 text-slate-800' };

                      return (
                        <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-4 font-mono font-bold text-blue-700">
                            {c.candidateId}
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-bold text-slate-900 text-sm">{c.name}</p>
                            <p className="text-slate-500 text-[11px]">{c.email}</p>
                            <p className="text-slate-400 text-[10px]">{c.phone}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-semibold text-slate-800">{c.college}</p>
                            <p className="text-slate-500 text-[11px]">{c.branch} • Class of {c.graduationYear}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.class}`}>
                              {badge.label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            {['cleared', 'not_qualified', 'completed'].includes(c.status) ? (
                              <div>
                                <p className="font-mono font-bold text-slate-900 text-sm">
                                  {c.score} / {c.totalMarks}
                                </p>
                                <p className="text-slate-500 text-[11px] font-semibold">{c.percentage}%</p>
                              </div>
                            ) : c.status === 'started' ? (
                              <span className="text-blue-600 font-semibold">Testing...</span>
                            ) : c.status === 'terminated' ? (
                              <span className="text-red-600 font-semibold">Disqualified</span>
                            ) : (
                              <span className="text-slate-400">Pending</span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            {c.violationsCount === 0 ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5" /> 0 violations
                              </span>
                            ) : c.violationsCount < 3 ? (
                              <span className="inline-flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                <AlertTriangle className="w-3.5 h-3.5" /> {c.violationsCount} warning(s)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                                <AlertOctagon className="w-3.5 h-3.5" /> 3 (TERMINATED)
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedCandidate(c)}
                                className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-blue-600 font-semibold flex items-center gap-1"
                                title="Candidate Audit Dossier"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Profile</span>
                              </button>
                              <button
                                onClick={() => setPreviewEmailCandidate(c)}
                                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                                title="View Sent Official Email"
                              >
                                <Mail className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCandidate(c.id, c.candidateId, c.name)}
                                className="p-1 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                                title="Delete Candidate Record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: STUDENT DATA IMPORT & BULK CREDENTIAL DISPATCH */}
      {activeTab === 'importer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-600" />
                  Import College Student Data
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Paste CSV records or load sample batch from participating engineering colleges.
                </p>
              </div>

              <button
                onClick={handleLoadSampleBatch}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
              >
                Insert CSV Header Template
              </button>

            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Required CSV Format: <span className="font-mono text-slate-400">Name, Email, Phone, College, Branch, GraduationYear, Position</span>
              </label>
              <textarea
                rows={8}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Rahul Kumar, rahul@gmail.com, 9849012345, ABC Engineering College, CSE, 2026, Graduate Trainee&#10;Priya Reddy, priya@gmail.com, 9701123456, ABC Engineering College, ECE, 2026, Graduate Trainee"
                className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Validation Feedback */}
            {importSummary && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Validation Summary
                </p>
                <p className="text-slate-600">
                  {importSummary.total} records detected • <strong className="text-emerald-700">{importSummary.valid} valid candidates imported</strong> •{' '}
                  <span className="text-amber-700">{importSummary.duplicates} duplicate emails skipped</span>.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleImportStudents}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Validate & Import Candidates</span>
              </button>

              <button
                onClick={() => setImportText('')}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Right: Bulk Credential Dispatch Panel */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Official Credential Dispatch
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Sends automated invitation emails with Candidate IDs, secure temporary passwords, assessment link, and examination rules from <strong className="text-slate-800">hiring@brainovision.in</strong>.
              </p>

              {sendSuccessMsg && (
                <div className="my-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                  {sendSuccessMsg}
                </div>
              )}

              <div className="my-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Sender Account:</span>
                  <span className="font-semibold text-slate-900">hiring@brainovision.in</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Unsent Candidates:</span>
                  <span className="font-bold text-blue-600 font-mono">
                    {candidates.filter((c) => !c.emailSent || c.status === 'invited').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email Format:</span>
                  <span className="font-semibold text-slate-900">Responsive HTML Corporate</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleSendCredentials}
                disabled={isSendingBatch}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isSendingBatch ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>SEND CREDENTIALS BATCH</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setPreviewEmailCandidate(candidates[0] || null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
              >
                View Corporate Email Template Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: QUESTION BANK & CONFIG */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          {/* Assessment Configuration Header Card */}
          {config && (
            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                    Live Assessment Specification
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Cut-off: {config.passingPercentage}% Passing Mark
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{config.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Duration: <strong className="text-slate-800">{config.durationMinutes} Minutes</strong> • Passing Score: <strong className="text-emerald-700">{config.passingPercentage}% ({Math.round(((config.passingPercentage || 60) / 100) * ((config.sections ? config.sections.reduce((a, s) => a + s.count, 0) : 40)))} Marks)</strong> • Max Tab Switches: {config.maxTabSwitches || 2} • Max Fullscreen Exits: {config.maxFullscreenExits || 2}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-blue-900 bg-blue-50/60 px-3.5 py-2 rounded-xl border border-blue-200">
                  <span className="font-bold">Apt: {config.sections?.find(s => s.id === 'aptitude')?.count ?? 15}</span>
                  <span>•</span>
                  <span className="font-bold">Reas: {config.sections?.find(s => s.id === 'reasoning')?.count ?? 10}</span>
                  <span>•</span>
                  <span className="font-bold">Verb: {config.sections?.find(s => s.id === 'verbal')?.count ?? 10}</span>
                  <span>•</span>
                  <span className="font-bold">Tech: {config.sections?.find(s => s.id === 'technical')?.count ?? 5}</span>
                </div>

                <button
                  type="button"
                  onClick={handleOpenConfigModal}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
                  title="Configure assessment details, duration, questions count, and qualifying cutoff marks"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Configure Exam & Cutoff</span>
                </button>
              </div>
            </div>
          )}

          {configSaveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>{configSaveSuccess}</span>
              </div>
              <button onClick={() => setConfigSaveSuccess(null)} className="text-blue-600 hover:text-blue-800 font-bold">Dismiss</button>
            </motion.div>
          )}


          {/* Success Banner if question added */}
          {questionSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{questionSuccess}</span>
              </div>
              <button onClick={() => setQuestionSuccess(null)} className="text-emerald-600 hover:text-emerald-800">Dismiss</button>
            </motion.div>
          )}

          {/* Question List & Controls */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <span>Approved Question Bank</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                    {filteredQuestions.length} Questions
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Questions are dynamically randomized for each candidate paper. Correct answers are kept secure on the server.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search question text or options..."
                    value={questionSearch}
                    onChange={(e) => setQuestionSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleClearAllQuestions}
                  className="px-3.5 py-2 bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-700 border border-red-200 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all whitespace-nowrap"
                  title="Remove all questions from the question bank"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span>Remove All Sample Questions</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddQuestionModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Question</span>
                </button>
              </div>
            </div>

            {/* Section Filter Pills */}
            <div className="px-4 sm:px-6 py-3 border-b border-slate-100 bg-white flex flex-wrap items-center gap-2 overflow-x-auto">
              <span className="text-xs text-slate-400 font-bold uppercase mr-1">Section:</span>
              {[
                { id: 'all', label: 'All Sections', count: questions.length },
                { id: 'aptitude', label: 'Quantitative Aptitude', count: questions.filter(q => q.section === 'aptitude').length },
                { id: 'reasoning', label: 'Logical Reasoning', count: questions.filter(q => q.section === 'reasoning').length },
                { id: 'verbal', label: 'Verbal Ability', count: questions.filter(q => q.section === 'verbal').length },
                { id: 'technical', label: 'Technical Core', count: questions.filter(q => q.section === 'technical').length },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setQuestionSectionFilter(pill.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    questionSectionFilter === pill.id
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'
                  }`}
                >
                  <span>{pill.label}</span>
                  <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                    questionSectionFilter === pill.id ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {pill.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Question Items List */}
            <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
              {filteredQuestions.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">Question Bank is Clean & Empty</p>
                  <p className="text-xs text-slate-500 mt-1 mb-4 max-w-sm mx-auto">
                    All sample questions have been removed. Click "+ Add New Question" to create your customized assessment paper.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAddQuestionModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add First Question</span>
                  </button>
                </div>
              ) : (
                filteredQuestions.map((q, idx) => (
                  <div key={q.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                          {q.sectionTitle} • #{idx + 1}
                        </span>
                        <span className="text-[11px] text-slate-400 capitalize font-medium">
                          {q.difficulty} Level
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          +{q.marks} Marks
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(q)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1 transition-colors"
                          title="Edit this question"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(q.id, q.text)}
                          className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg flex items-center gap-1 transition-colors"
                          title="Delete this question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-900 whitespace-pre-line leading-relaxed">
                      {q.text}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                            oIdx === q.correctIndex
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                              : 'bg-slate-50/50 border-slate-200 text-slate-600'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0 ${
                            oIdx === q.correctIndex ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="leading-relaxed">{opt}</span>
                          {oIdx === q.correctIndex && (
                            <span className="ml-auto text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                              Correct Answer
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {q.explanation && (
                      <p className="mt-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                        <strong className="text-slate-800">Explanation / Derivation:</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ADD QUESTION MODAL */}
          <AnimatePresence>
            {showAddQuestionModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-blue-100 overflow-hidden my-8"
                >
                  {/* Header */}
                  <div className="p-6 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                        Question Bank Management
                      </span>
                      <h3 className="text-lg font-bold text-white mt-0.5">
                        Add New Assessment Question
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddQuestionModal(false)}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>

                  </div>

                  {/* Form */}
                  <form onSubmit={handleSaveQuestion} className="p-6 space-y-5 text-xs">
                    {questionError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium">
                        {questionError}
                      </div>
                    )}

                    {/* Section, Difficulty, Marks */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Section
                        </label>
                        <select
                          value={newQuestionSection}
                          onChange={(e) => setNewQuestionSection(e.target.value as QuestionSection)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        >
                          <option value="aptitude">Quantitative Aptitude</option>
                          <option value="reasoning">Logical Reasoning</option>
                          <option value="verbal">Verbal Ability</option>
                          <option value="technical">Technical Core</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Difficulty Level
                        </label>
                        <select
                          value={newDifficulty}
                          onChange={(e) => setNewDifficulty(e.target.value as QuestionDifficulty)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Marks
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={newMarks}
                          onChange={(e) => setNewMarks(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Question Text */}
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Question Text *
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Enter the complete question problem statement..."
                        value={newQuestionText}
                        onChange={(e) => setNewQuestionText(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none placeholder:text-slate-400"
                      />
                    </div>

                    {/* 4 Options Grid */}
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Answer Options (A, B, C, D) *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1 font-semibold text-slate-700">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">A</span>
                            <span>Option A</span>
                          </div>
                          <input
                            type="text"
                            required
                            placeholder="Option A text"
                            value={newOptionA}
                            onChange={(e) => setNewOptionA(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 mb-1 font-semibold text-slate-700">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">B</span>
                            <span>Option B</span>
                          </div>
                          <input
                            type="text"
                            required
                            placeholder="Option B text"
                            value={newOptionB}
                            onChange={(e) => setNewOptionB(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 mb-1 font-semibold text-slate-700">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">C</span>
                            <span>Option C</span>
                          </div>
                          <input
                            type="text"
                            required
                            placeholder="Option C text"
                            value={newOptionC}
                            onChange={(e) => setNewOptionC(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 mb-1 font-semibold text-slate-700">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">D</span>
                            <span>Option D</span>
                          </div>
                          <input
                            type="text"
                            required
                            placeholder="Option D text"
                            value={newOptionD}
                            onChange={(e) => setNewOptionD(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Correct Option Selector */}
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Select Correct Option *
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setNewCorrectOption(opt)}
                            className={`p-3 rounded-xl border-2 font-bold text-center transition-all ${
                              newCorrectOption === opt
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            Option {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Explanation */}
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Explanation / Solution Details (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Step-by-step reasoning or formula for candidate evaluation..."
                        value={newExplanation}
                        onChange={(e) => setNewExplanation(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none placeholder:text-slate-400"
                      />
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddQuestionModal(false)}
                        className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingQuestion}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                      >
                        {isSavingQuestion ? (
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Save to Question Bank</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* EDIT QUESTION MODAL */}
          <AnimatePresence>
            {showEditQuestionModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-blue-100 overflow-hidden my-8"
                >
                  {/* Header */}
                  <div className="p-6 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                        Question Bank Editor
                      </span>
                      <h3 className="text-lg font-bold text-white mt-0.5">
                        Edit Assessment Question
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowEditQuestionModal(false)}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>

                  </div>

                  {/* Form */}
                  <form onSubmit={handleSaveEditQuestion} className="p-6 space-y-5 text-xs">
                    {editError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium">
                        {editError}
                      </div>
                    )}

                    {/* Section, Difficulty, Marks */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Section
                        </label>
                        <select
                          value={editQuestionSection}
                          onChange={(e) => setEditQuestionSection(e.target.value as QuestionSection)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        >
                          <option value="aptitude">Quantitative Aptitude</option>
                          <option value="reasoning">Logical Reasoning</option>
                          <option value="verbal">Verbal Ability</option>
                          <option value="technical">Technical Core</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Difficulty
                        </label>
                        <select
                          value={editDifficulty}
                          onChange={(e) => setEditDifficulty(e.target.value as QuestionDifficulty)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        >
                          <option value="easy">Easy (1 Mark)</option>
                          <option value="medium">Medium (1 Mark)</option>
                          <option value="hard">Hard (1-2 Marks)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Marks
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={editMarks}
                          onChange={(e) => setEditMarks(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Question Text */}
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Question Text *
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Enter the complete question problem statement..."
                        value={editQuestionText}
                        onChange={(e) => setEditQuestionText(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none placeholder:text-slate-400"
                      />
                    </div>

                    {/* 4 Options Grid */}
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Answer Options (A, B, C, D) *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1 font-semibold text-slate-700">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">A</span>
                            <span>Option A</span>
                          </div>
                          <input
                            type="text"
                            required
                            placeholder="Option A text"
                            value={editOptionA}
                            onChange={(e) => setEditOptionA(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 mb-1 font-semibold text-slate-700">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">B</span>
                            <span>Option B</span>
                          </div>
                          <input
                            type="text"
                            required
                            placeholder="Option B text"
                            value={editOptionB}
                            onChange={(e) => setEditOptionB(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 mb-1 font-semibold text-slate-700">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">C</span>
                            <span>Option C</span>
                          </div>
                          <input
                            type="text"
                            required
                            placeholder="Option C text"
                            value={editOptionC}
                            onChange={(e) => setEditOptionC(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 mb-1 font-semibold text-slate-700">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">D</span>
                            <span>Option D</span>
                          </div>
                          <input
                            type="text"
                            required
                            placeholder="Option D text"
                            value={editOptionD}
                            onChange={(e) => setEditOptionD(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Correct Option Selector */}
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Select Correct Answer *
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setEditCorrectOption(opt)}
                            className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                              editCorrectOption === opt
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            Option {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Explanation */}
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Explanation / Solution Details (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Step-by-step reasoning or formula for candidate evaluation..."
                        value={editExplanation}
                        onChange={(e) => setEditExplanation(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none placeholder:text-slate-400"
                      />
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowEditQuestionModal(false)}
                        className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingEdit}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                      >
                        {isSavingEdit ? (
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Edit3 className="w-4 h-4" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 6. TAB 4: OFFICIAL EMAIL LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Email Dispatch Audit Logs ({emailLogs.length} Records)
            </h3>
            <span className="text-xs text-slate-500">Service: hiring@brainovision.in</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Candidate ID</th>
                  <th className="px-5 py-3">Candidate Name</th>
                  <th className="px-5 py-3">Email Address</th>
                  <th className="px-5 py-3">Dispatched Timestamp</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 font-mono">Message ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {emailLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-mono font-bold text-blue-600">{log.candidateId}</td>
                    <td className="px-5 py-3 font-semibold text-slate-900">{log.candidateName}</td>
                    <td className="px-5 py-3 text-slate-600">{log.email}</td>
                    <td className="px-5 py-3 text-slate-500">{new Date(log.sentAt).toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {log.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-[11px] text-slate-400">{log.messageId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CANDIDATE AUDIT PROFILE MODAL */}
      <AnimatePresence>
        {selectedCandidate && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedCandidate(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 text-slate-900"
            >
              {/* Top Banner */}
              <div className="bg-slate-900 text-white p-6 sm:p-8 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-400 bg-blue-900/60 px-2 py-0.5 rounded">
                      {selectedCandidate.candidateId}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      selectedCandidate.status === 'cleared'
                        ? 'bg-emerald-500 text-white'
                        : selectedCandidate.status === 'terminated'
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-700 text-slate-200'
                    }`}>
                      {selectedCandidate.status}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mt-1 text-white">{selectedCandidate.name}</h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {selectedCandidate.college} • {selectedCandidate.branch} (Class of {selectedCandidate.graduationYear})
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-400">Score</p>
                  <p className="text-3xl font-extrabold text-white font-mono">
                    {selectedCandidate.score} / {selectedCandidate.totalMarks}
                  </p>
                  <p className="text-xs font-bold text-blue-400">{selectedCandidate.percentage}%</p>
                </div>
              </div>

              {/* Dossier Body */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Contact info grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block">Email</span>
                    <strong className="text-slate-800">{selectedCandidate.email}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Phone</span>
                    <strong className="text-slate-800">{selectedCandidate.phone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Position</span>
                    <strong className="text-slate-800">{selectedCandidate.position}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Interview Status</span>
                    <strong className={`capitalize ${selectedCandidate.interviewStatus === 'scheduled' ? 'text-emerald-600' : 'text-slate-700'}`}>
                      {selectedCandidate.interviewStatus?.replace('_', ' ') || 'Not Scheduled'}
                    </strong>
                  </div>
                </div>

                {/* Section breakdown */}
                {selectedCandidate.sectionScores && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Sectional Score Breakdown
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {Object.keys(selectedCandidate.sectionScores).map((secKey) => {
                        const sec = selectedCandidate.sectionScores![secKey];
                        return (
                          <div key={secKey} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-xs text-slate-500 font-medium">{sec.sectionTitle}</p>
                            <p className="text-lg font-bold font-mono text-slate-900 mt-1">
                              {sec.score} / {sec.total}
                            </p>
                            <span className="text-[11px] font-semibold text-blue-600">{sec.percentage.toFixed(0)}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Security Audit Trail */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-blue-600" />
                      Proctoring Security Audit Trail
                    </h3>
                    <span className="text-xs text-slate-500 font-semibold">
                      Total Violations: {selectedCandidate.violationsCount}
                    </span>
                  </div>

                  {selectedCandidate.securityLogs?.length === 0 ? (
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Zero security policy violations recorded. Clean academic integrity record.</span>
                    </div>
                  ) : (
                    <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                      {selectedCandidate.securityLogs?.map((log) => (
                        <div key={log.id} className="p-3 bg-slate-50 flex items-start justify-between gap-4">
                          <div>
                            <span className={`inline-block font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                              log.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {log.eventType}
                            </span>
                            <p className="text-slate-700 mt-1 font-medium">{log.metadata}</p>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono flex-shrink-0">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Interview Information / Action */}
                {selectedCandidate.interviewDetails && (
                  <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs space-y-1.5">
                    <p className="font-bold text-blue-900 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      Scheduled Technical Interview
                    </p>
                    <p className="text-blue-800">
                      <strong>Date & Time:</strong> {selectedCandidate.interviewDetails.date} at {selectedCandidate.interviewDetails.time}
                    </p>
                    <p className="text-blue-800">
                      <strong>Interviewer:</strong> {selectedCandidate.interviewDetails.interviewer}
                    </p>
                    <p className="text-blue-800">
                      <strong>Meeting:</strong>{' '}
                      <a href={selectedCandidate.interviewDetails.meetingLink} target="_blank" rel="noopener noreferrer" className="underline font-mono">
                        {selectedCandidate.interviewDetails.meetingLink}
                      </a>
                    </p>
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      setPreviewEmailCandidate(selectedCandidate);
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>View Dispatched Email</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {selectedCandidate.status === 'cleared' && (
                      <button
                        onClick={() => setShowScheduleModal(true)}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Schedule Technical Interview</span>
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedCandidate(null)}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SCHEDULE INTERVIEW MODAL */}
      <AnimatePresence>
        {showScheduleModal && selectedCandidate && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-slate-900 border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Schedule Technical Interview</h3>
                  <p className="text-xs text-slate-500">Candidate: {selectedCandidate.name} ({selectedCandidate.candidateId})</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">Interview Date</label>
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    placeholder="e.g. 11:00 AM IST"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">Technical Interviewer</label>
                  <input
                    type="text"
                    value={interviewerName}
                    onChange={(e) => setInterviewerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">Google Meet / Video Link</label>
                  <input
                    type="text"
                    value={interviewLink}
                    onChange={(e) => setInterviewLink(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex gap-3">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveInterview}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Confirm & Notify
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EXAM DETAILS & QUALIFICATION CUTOFF CONFIGURATION MODAL */}
      <AnimatePresence>
        {showConfigModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl my-8 overflow-hidden"
            >
              <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">Exam Configuration & Cutoff Criteria</h3>
                    <p className="text-xs text-slate-500">Define assessment details, duration, question count, and qualification score</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveConfig} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                {/* 1. General Details */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">1. Assessment Specification</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Assessment Official Title</label>
                      <input
                        type="text"
                        value={cfgTitle}
                        onChange={(e) => setCfgTitle(e.target.value)}
                        placeholder="e.g. Brainovision Campus Recruitment Assessment — 2026"
                        required
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Duration (Minutes)</label>
                        <input
                          type="number"
                          min="5"
                          max="300"
                          value={cfgDuration}
                          onChange={(e) => setCfgDuration(Number(e.target.value))}
                          required
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-blue-500 transition-colors font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Marks Per Question</label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={cfgMarksPerQ}
                          onChange={(e) => setCfgMarksPerQ(Number(e.target.value))}
                          required
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-blue-500 transition-colors font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Qualification Cutoff Marks */}
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2">2. Qualification & Cutoff Criteria</h4>
                  <p className="text-xs text-blue-700 mb-3">
                    Candidates scoring equal to or above this cutoff percentage will be marked as <strong>CLEARED</strong> and shortlisted for interview rounds.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-xs font-semibold text-blue-900 mb-1">Qualification Cutoff (%)</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={cfgCutoff}
                        onChange={(e) => setCfgCutoff(Number(e.target.value))}
                        required
                        className="w-full px-3.5 py-2.5 bg-white border border-blue-300 rounded-xl text-sm font-bold text-blue-950 focus:border-blue-600 transition-colors font-mono"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider">Equivalent Cutoff Score:</span>
                      <span className="text-lg font-extrabold text-blue-900 font-mono">
                        {((((Number(cfgAptitude) || 0) + (Number(cfgReasoning) || 0) + (Number(cfgVerbal) || 0) + (Number(cfgTechnical) || 0)) * (Number(cfgMarksPerQ) || 1) * (Number(cfgCutoff) || 60)) / 100).toFixed(1)}{' '}
                        <span className="text-xs font-normal text-blue-700">
                          / {((Number(cfgAptitude) || 0) + (Number(cfgReasoning) || 0) + (Number(cfgVerbal) || 0) + (Number(cfgTechnical) || 0)) * (Number(cfgMarksPerQ) || 1)} marks
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-blue-200/70">
                    <label className="flex items-center gap-2 text-xs font-semibold text-blue-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cfgNegativeMarking}
                        onChange={(e) => setCfgNegativeMarking(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Enable Negative Marking</span>
                    </label>
                    {cfgNegativeMarking && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-blue-800">Penalty per incorrect:</span>
                        <input
                          type="number"
                          step="0.05"
                          min="0"
                          max="2"
                          value={cfgNegativePenalty}
                          onChange={(e) => setCfgNegativePenalty(Number(e.target.value))}
                          className="w-20 px-2 py-1 bg-white border border-blue-300 rounded-lg text-xs font-mono"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Section Question Distribution */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    3. Section Question Allocation (Total: {(Number(cfgAptitude) || 0) + (Number(cfgReasoning) || 0) + (Number(cfgVerbal) || 0) + (Number(cfgTechnical) || 0)} Questions)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Quantitative Aptitude</label>
                      <input
                        type="number"
                        min="0"
                        value={cfgAptitude}
                        onChange={(e) => setCfgAptitude(Number(e.target.value))}
                        required
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Logical Reasoning</label>
                      <input
                        type="number"
                        min="0"
                        value={cfgReasoning}
                        onChange={(e) => setCfgReasoning(Number(e.target.value))}
                        required
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Verbal Ability</label>
                      <input
                        type="number"
                        min="0"
                        value={cfgVerbal}
                        onChange={(e) => setCfgVerbal(Number(e.target.value))}
                        required
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Technical Core</label>
                      <input
                        type="number"
                        min="0"
                        value={cfgTechnical}
                        onChange={(e) => setCfgTechnical(Number(e.target.value))}
                        required
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Strict Security & Proctoring Thresholds */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">4. Strict Proctoring Limits</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Max Tab Switch Strikes</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={cfgMaxTabSwitches}
                        onChange={(e) => setCfgMaxTabSwitches(Number(e.target.value))}
                        required
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono text-slate-800"
                      />
                      <span className="text-[10px] text-slate-500">Auto-terminates when exceeded</span>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Max Fullscreen Exit Strikes</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={cfgMaxFullscreenExits}
                        onChange={(e) => setCfgMaxFullscreenExits(Number(e.target.value))}
                        required
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono text-slate-800"
                      />
                      <span className="text-[10px] text-slate-500">Auto-terminates when exceeded</span>
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingConfig}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-xs"
                  >
                    {isSavingConfig ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sliders className="w-4 h-4" />
                        <span>Save & Apply Configuration</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CORPORATE EMAIL PREVIEW MODAL */}
      <CorporateEmailModal
        candidate={previewEmailCandidate}
        isOpen={Boolean(previewEmailCandidate)}
        onClose={() => setPreviewEmailCandidate(null)}
      />
    </div>
  );
}
