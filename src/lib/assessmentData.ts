import type { Question, AssessmentCandidate, AssessmentConfig } from '../types/assessment';

export const DEFAULT_ASSESSMENT_CONFIG: AssessmentConfig = {
  id: 'campus-2026-phase1',
  title: 'Campus Recruitment Assessment — 2026',
  durationMinutes: 45,
  passingPercentage: 60,
  negativeMarking: false,
  maxTabSwitches: 2,
  maxFullscreenExits: 2,
  securityLevel: 'strict',
  sections: [
    { id: 'aptitude', title: 'Quantitative Aptitude', count: 15 },
    { id: 'reasoning', title: 'Logical Reasoning', count: 10 },
    { id: 'verbal', title: 'Verbal Ability', count: 10 },
    { id: 'technical', title: 'Technical Core', count: 5 },
  ],
};

// Initial sample questions and dummy candidates removed per recruitment administrator configuration.
// Candidates and questions are managed authoritatively via the backend API and Admin Hub.
export const QUESTION_BANK: Question[] = [];
export const INITIAL_CANDIDATES: AssessmentCandidate[] = [];

export const SAMPLE_STUDENT_BATCH: any[] = [];

