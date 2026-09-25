import {
  QUESTION_BANK,
  INITIAL_CANDIDATES,
  DEFAULT_ASSESSMENT_CONFIG,
} from './assessmentData';
import type {
  AssessmentCandidate,
  Question,
  SecurityEvent,
  SecurityEventType,
  EmailLog,
  AssessmentConfig,
  CandidateSectionScore,
} from '../types/assessment';

const STORAGE_KEYS = {
  CANDIDATES: 'bv_assessment_candidates',
  CURRENT_CANDIDATE: 'bv_assessment_current_candidate',
  CONFIG: 'bv_assessment_config',
  EMAIL_LOGS: 'bv_assessment_email_logs',
  QUESTION_BANK: 'bv_assessment_questions',
};

// Helper to safely access localStorage
function getLocalItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

// Initialize default store if empty
export function initAssessmentStore(): void {
  if (!localStorage.getItem(STORAGE_KEYS.CANDIDATES)) {
    setLocalItem(STORAGE_KEYS.CANDIDATES, INITIAL_CANDIDATES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONFIG)) {
    setLocalItem(STORAGE_KEYS.CONFIG, DEFAULT_ASSESSMENT_CONFIG);
  }
  if (!localStorage.getItem(STORAGE_KEYS.QUESTION_BANK)) {
    setLocalItem(STORAGE_KEYS.QUESTION_BANK, QUESTION_BANK);
  }
  if (!localStorage.getItem(STORAGE_KEYS.EMAIL_LOGS)) {
    const initialEmailLogs: EmailLog[] = INITIAL_CANDIDATES.filter(c => c.emailSent).map(c => ({
      id: `log-${c.id}`,
      candidateId: c.candidateId,
      candidateName: c.name,
      email: c.email,
      type: 'CAMPUS_ASSESSMENT_INVITATION',
      sentAt: c.emailSentAt || new Date().toISOString(),
      status: 'delivered',
      messageId: c.messageId || `msg-${c.candidateId}`,
    }));
    setLocalItem(STORAGE_KEYS.EMAIL_LOGS, initialEmailLogs);
  }
}

// Candidate operations
export function getCandidates(): AssessmentCandidate[] {
  initAssessmentStore();
  return getLocalItem<AssessmentCandidate[]>(STORAGE_KEYS.CANDIDATES, INITIAL_CANDIDATES);
}

export function saveCandidates(candidates: AssessmentCandidate[]): void {
  setLocalItem(STORAGE_KEYS.CANDIDATES, candidates);
}

export function deduplicateLocalCandidates(): { removed: number; remaining: number } {
  const current = getCandidates();
  const seenEmails = new Set<string>();
  const seenPhones = new Set<string>();
  const seenIds = new Set<string>();
  const unique: AssessmentCandidate[] = [];
  let removed = 0;

  for (const c of current) {
    const email = (c.email || '').toLowerCase().trim();
    const phone = (c.phone || '').trim();
    const cid = (c.candidateId || '').trim();

    const isDup =
      (email && seenEmails.has(email)) ||
      (phone && seenPhones.has(phone)) ||
      (cid && seenIds.has(cid));

    if (isDup) {
      removed++;
    } else {
      if (email) seenEmails.add(email);
      if (phone) seenPhones.add(phone);
      if (cid) seenIds.add(cid);
      unique.push(c);
    }
  }

  saveCandidates(unique);
  return { removed, remaining: unique.length };
}

export function deleteCandidate(id: string): AssessmentCandidate[] {
  const current = getCandidates();
  const filtered = current.filter(c => c.id !== id && c.candidateId !== id);
  saveCandidates(filtered);
  return filtered;
}

export function clearAllCandidates(): void {
  saveCandidates([]);
}


export function getCurrentCandidate(): AssessmentCandidate | null {
  initAssessmentStore();
  const c = getLocalItem<AssessmentCandidate | null>(STORAGE_KEYS.CURRENT_CANDIDATE, null);
  if (c) return c;
  try {
    const fallback = localStorage.getItem('bv_current_candidate');
    if (fallback) {
      return JSON.parse(fallback);
    }
  } catch {}
  return null;
}

export function setCurrentCandidate(candidate: AssessmentCandidate | null): void {
  setLocalItem(STORAGE_KEYS.CURRENT_CANDIDATE, candidate);
  try {
    if (candidate) {
      localStorage.setItem('bv_current_candidate', JSON.stringify(candidate));
    } else {
      localStorage.removeItem('bv_current_candidate');
    }
  } catch {}
}

export function loginCandidate(candidateId: string, password: string): { success: boolean; candidate?: AssessmentCandidate; error?: string } {
  const candidates = getCandidates();
  const found = candidates.find(
    c => c.candidateId.trim().toUpperCase() === candidateId.trim().toUpperCase()
  );

  if (!found) {
    return { success: false, error: 'Candidate ID not found. Please verify your credentials received via email.' };
  }

  if (found.password !== password.trim()) {
    return { success: false, error: 'Incorrect temporary password. Please re-enter or check your official invitation email.' };
  }

  if (found.status === 'terminated') {
    return { success: false, error: 'Your assessment session was terminated due to security policy violations. Contact hiring@brainovision.in for assistance.' };
  }

  setCurrentCandidate(found);
  return { success: true, candidate: found };
}

export function logoutCandidate(): void {
  setCurrentCandidate(null);
}

export function getQuestions(): Question[] {
  initAssessmentStore();
  return getLocalItem<Question[]>(STORAGE_KEYS.QUESTION_BANK, QUESTION_BANK);
}

export function saveQuestions(questions: Question[]): void {
  setLocalItem(STORAGE_KEYS.QUESTION_BANK, questions);
}

export function updateQuestion(id: string, updated: Partial<Question>): Question[] {
  const current = getQuestions();
  const index = current.findIndex((q) => String(q.id) === String(id));
  if (index !== -1) {
    current[index] = { ...current[index], ...updated };
    saveQuestions(current);
  }
  return current;
}

export function deleteQuestion(id: string): Question[] {
  const current = getQuestions();
  const filtered = current.filter((q) => String(q.id) !== String(id));
  saveQuestions(filtered);
  return filtered;
}

export function clearQuestions(): void {
  saveQuestions([]);
}

export function getAssessmentConfig(): AssessmentConfig {
  initAssessmentStore();
  return getLocalItem<AssessmentConfig>(STORAGE_KEYS.CONFIG, DEFAULT_ASSESSMENT_CONFIG);
}

export function updateAssessmentConfig(config: AssessmentConfig): void {
  setLocalItem(STORAGE_KEYS.CONFIG, config);
}

// Assessment attempt operations
export function startAssessmentAttempt(candidateId: string): AssessmentCandidate | null {
  const candidates = getCandidates();
  const index = candidates.findIndex(c => c.candidateId === candidateId);
  if (index === -1) return null;

  const candidate = candidates[index];
  candidate.status = 'started';
  candidate.startedAt = candidate.startedAt || new Date().toISOString();
  candidates[index] = candidate;

  saveCandidates(candidates);
  setCurrentCandidate(candidate);
  return candidate;
}

export function saveCandidateAnswer(candidateId: string, questionId: string, optionIndex: number): void {
  const candidates = getCandidates();
  const index = candidates.findIndex(c => c.candidateId === candidateId);
  if (index === -1) return;

  const candidate = candidates[index];
  candidate.answers = {
    ...(candidate.answers || {}),
    [questionId]: optionIndex,
  };

  candidates[index] = candidate;
  saveCandidates(candidates);
  setCurrentCandidate(candidate);
}

export function toggleMarkForReview(candidateId: string, questionId: string): void {
  const candidates = getCandidates();
  const index = candidates.findIndex(c => c.candidateId === candidateId);
  if (index === -1) return;

  const candidate = candidates[index];
  const list = candidate.markedForReview || [];
  if (list.includes(questionId)) {
    candidate.markedForReview = list.filter(id => id !== questionId);
  } else {
    candidate.markedForReview = [...list, questionId];
  }

  candidates[index] = candidate;
  saveCandidates(candidates);
  setCurrentCandidate(candidate);
}

export function clearCandidateAnswer(candidateId: string, questionId: string): void {
  const candidates = getCandidates();
  const index = candidates.findIndex(c => c.candidateId === candidateId);
  if (index === -1) return;

  const candidate = candidates[index];
  if (candidate.answers && candidate.answers[questionId] !== undefined) {
    const newAnswers = { ...candidate.answers };
    delete newAnswers[questionId];
    candidate.answers = newAnswers;
  }

  candidates[index] = candidate;
  saveCandidates(candidates);
  setCurrentCandidate(candidate);
}

// Security violation logger & policy enforcement
export function recordSecurityViolation(
  candidateId: string,
  eventType: SecurityEventType,
  metadata: string,
  severity: 'warning' | 'critical' = 'warning'
): { updatedCandidate: AssessmentCandidate; violationsCount: number; isTerminated: boolean } {
  const candidates = getCandidates();
  const index = candidates.findIndex(c => c.candidateId === candidateId);
  const candidate = index !== -1 ? candidates[index] : getCurrentCandidate();

  if (!candidate) {
    throw new Error('Candidate not found');
  }

  const newEvent: SecurityEvent = {
    id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    candidateId,
    attemptId: `att-${candidateId}`,
    eventType,
    timestamp: new Date().toISOString(),
    severity,
    metadata,
  };

  candidate.securityLogs = [...(candidate.securityLogs || []), newEvent];
  candidate.violationsCount = (candidate.violationsCount || 0) + 1;

  const isTerminated = candidate.violationsCount >= 3;
  if (isTerminated) {
    candidate.status = 'terminated';
    candidate.terminationReason = `Assessment terminated automatically due to repeated violations: ${eventType}.`;
    candidate.completedAt = new Date().toISOString();
  }

  if (index !== -1) {
    candidates[index] = candidate;
    saveCandidates(candidates);
  }
  setCurrentCandidate(candidate);

  return {
    updatedCandidate: candidate,
    violationsCount: candidate.violationsCount,
    isTerminated,
  };
}

// Automatic evaluation engine
export function submitAssessment(candidateId: string): AssessmentCandidate {
  const candidates = getCandidates();
  const index = candidates.findIndex(c => c.candidateId === candidateId);
  const candidate = index !== -1 ? candidates[index] : getCurrentCandidate();

  if (!candidate) {
    throw new Error('Candidate not found for submission');
  }

  const questions = getQuestions();
  const config = getAssessmentConfig();

  // Dynamic sectional totals
  const sectionCounts: Record<string, number> = {
    aptitude: 0,
    reasoning: 0,
    verbal: 0,
    technical: 0,
  };

  questions.forEach((q) => {
    if (sectionCounts[q.section] !== undefined) {
      sectionCounts[q.section] += q.marks || 1;
    }
  });

  // Fallback to config sections if question bank is currently loaded dynamically
  if (config.sections) {
    config.sections.forEach((s) => {
      if (sectionCounts[s.id] === 0 && s.count > 0) {
        sectionCounts[s.id] = s.count;
      }
    });
  }

  let totalScore = 0;
  const sectionScores: Record<string, CandidateSectionScore> = {
    aptitude: { section: 'aptitude', sectionTitle: 'Quantitative Aptitude', score: 0, total: sectionCounts.aptitude || 15, percentage: 0 },
    reasoning: { section: 'reasoning', sectionTitle: 'Logical Reasoning', score: 0, total: sectionCounts.reasoning || 10, percentage: 0 },
    verbal: { section: 'verbal', sectionTitle: 'Verbal Ability', score: 0, total: sectionCounts.verbal || 10, percentage: 0 },
    technical: { section: 'technical', sectionTitle: 'Technical Core', score: 0, total: sectionCounts.technical || 5, percentage: 0 },
  };

  questions.forEach(q => {
    const selected = candidate.answers ? candidate.answers[q.id] : undefined;
    if (selected !== undefined) {
      if (selected === q.correctIndex) {
        const marks = q.marks || 1;
        totalScore += marks;
        if (sectionScores[q.section]) {
          sectionScores[q.section].score += marks;
        }
      } else if (config.negativeMarking) {
        const penalty = 0.25;
        totalScore = Math.max(0, totalScore - penalty);
        if (sectionScores[q.section]) {
          sectionScores[q.section].score = Math.max(0, sectionScores[q.section].score - penalty);
        }
      }
    }
  });

  // Calculate percentages
  Object.keys(sectionScores).forEach(secKey => {
    const sec = sectionScores[secKey];
    sec.percentage = sec.total > 0 ? parseFloat(((sec.score / sec.total) * 100).toFixed(1)) : 0;
  });

  const totalPossibleMarks = questions.reduce((sum, q) => sum + (q.marks || 1), 0) || (config.sections?.reduce((a, s) => a + s.count, 0) || 40);
  const percentage = totalPossibleMarks > 0 ? (totalScore / totalPossibleMarks) * 100 : 0;
  const isCleared = percentage >= (config.passingPercentage || 60);

  candidate.score = totalScore;
  candidate.totalMarks = totalPossibleMarks;
  candidate.percentage = parseFloat(percentage.toFixed(1));
  candidate.sectionScores = sectionScores;
  candidate.completedAt = new Date().toISOString();

  if (candidate.status !== 'terminated') {
    candidate.status = isCleared ? 'cleared' : 'not_qualified';
  }

  if (index !== -1) {
    candidates[index] = candidate;
    saveCandidates(candidates);
  }
  setCurrentCandidate(candidate);

  return candidate;
}

// Bulk candidate generation
export function bulkImportCandidates(
  studentList: {
    name: string;
    email: string;
    phone: string;
    college: string;
    branch: string;
    graduationYear: string;
    position: string;
  }[]
): { total: number; valid: number; duplicates: number; added: AssessmentCandidate[] } {
  const existingCandidates = getCandidates();
  const existingEmails = new Set(existingCandidates.map(c => c.email.toLowerCase().trim()));
  const seenBatchEmails = new Set<string>();

  let duplicates = 0;
  const added: AssessmentCandidate[] = [];

  let nextIndex = existingCandidates.length + 1;

  studentList.forEach(student => {
    const normEmail = student.email.toLowerCase().trim();
    if (existingEmails.has(normEmail) || seenBatchEmails.has(normEmail)) {
      duplicates++;
      return;
    }

    seenBatchEmails.add(normEmail);

    const padNum = String(nextIndex).padStart(4, '0');
    const candidateId = `BV26-${padNum}`;
    const password = generateSecurePassword();

    const newCandidate: AssessmentCandidate = {
      id: `cand-${Date.now()}-${nextIndex}`,
      candidateId,
      password,
      name: student.name,
      email: student.email,
      phone: student.phone,
      college: student.college,
      branch: student.branch,
      graduationYear: student.graduationYear || '2026',
      position: student.position || 'Graduate Trainee',
      status: 'invited',
      score: 0,
      totalMarks: 40,
      percentage: 0,
      violationsCount: 0,
      securityLogs: [],
      answers: {},
      markedForReview: [],
      interviewStatus: 'not_scheduled',
      emailSent: false,
    };

    added.push(newCandidate);
    nextIndex++;
  });

  const allCandidates = [...existingCandidates, ...added];
  saveCandidates(allCandidates);

  return {
    total: studentList.length,
    valid: added.length,
    duplicates,
    added,
  };
}

export function generateSecurePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  const symbols = '@#$';
  let pwd = 'Bv@';
  for (let i = 0; i < 5; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  pwd += symbols.charAt(Math.floor(Math.random() * symbols.length));
  return pwd;
}

// Bulk email dispatch simulation
export function sendCredentialsToCandidates(candidateIds: string[]): { sentCount: number; logs: EmailLog[] } {
  const candidates = getCandidates();
  const existingLogs = getLocalItem<EmailLog[]>(STORAGE_KEYS.EMAIL_LOGS, []);
  const newLogs: EmailLog[] = [];

  const updatedCandidates = candidates.map(c => {
    if (candidateIds.includes(c.candidateId)) {
      const now = new Date().toISOString();
      const messageId = `msg-bv-${Date.now()}-${c.candidateId}`;
      const log: EmailLog = {
        id: `log-${Date.now()}-${c.candidateId}`,
        candidateId: c.candidateId,
        candidateName: c.name,
        email: c.email,
        type: 'CAMPUS_ASSESSMENT_INVITATION',
        sentAt: now,
        status: 'delivered',
        messageId,
      };
      newLogs.push(log);
      return {
        ...c,
        emailSent: true,
        emailSentAt: now,
        messageId,
      };
    }
    return c;
  });

  saveCandidates(updatedCandidates);
  setLocalItem(STORAGE_KEYS.EMAIL_LOGS, [...existingLogs, ...newLogs]);

  return {
    sentCount: newLogs.length,
    logs: newLogs,
  };
}

export function getEmailLogs(): EmailLog[] {
  initAssessmentStore();
  return getLocalItem<EmailLog[]>(STORAGE_KEYS.EMAIL_LOGS, []);
}

// Schedule interview for candidate
export function scheduleCandidateInterview(
  candidateId: string,
  details: { date: string; time: string; interviewer: string; meetingLink: string; notes?: string }
): void {
  const candidates = getCandidates();
  const index = candidates.findIndex(c => c.candidateId === candidateId);
  if (index === -1) return;

  candidates[index].interviewStatus = 'scheduled';
  candidates[index].interviewDetails = details;

  saveCandidates(candidates);
}

// Analytics and metrics calculation
export function getAssessmentMetrics() {
  const candidates = getCandidates();
  const registered = candidates.length;
  const started = candidates.filter(c => c.status !== 'invited').length;
  const completed = candidates.filter(c => ['completed', 'cleared', 'not_qualified'].includes(c.status)).length;
  const cleared = candidates.filter(c => c.status === 'cleared').length;
  const notQualified = candidates.filter(c => c.status === 'not_qualified').length;
  const terminated = candidates.filter(c => c.status === 'terminated').length;
  const inProgress = candidates.filter(c => c.status === 'started').length;
  const invited = candidates.filter(c => c.status === 'invited').length;

  const totalScores = candidates.filter(c => ['cleared', 'not_qualified'].includes(c.status)).map(c => c.percentage);
  const avgScore = totalScores.length > 0 ? (totalScores.reduce((a, b) => a + b, 0) / totalScores.length).toFixed(1) : '0';

  return {
    registered,
    started,
    completed,
    cleared,
    notQualified,
    terminated,
    inProgress,
    invited,
    avgScore,
  };
}
