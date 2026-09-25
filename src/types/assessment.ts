export type QuestionSection = 'aptitude' | 'reasoning' | 'verbal' | 'technical';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type CandidateStatus = 'invited' | 'started' | 'completed' | 'cleared' | 'not_qualified' | 'terminated';

export type SecurityEventType =
  | 'TAB_SWITCH'
  | 'WINDOW_BLUR'
  | 'FULLSCREEN_EXIT'
  | 'COPY_ATTEMPT'
  | 'PASTE_ATTEMPT'
  | 'CUT_ATTEMPT'
  | 'RIGHT_CLICK'
  | 'KEYBOARD_SHORTCUT'
  | 'REFRESH_ATTEMPT'
  | 'NAVIGATION_ATTEMPT'
  | 'SESSION_DISCONNECT';

export interface SecurityEvent {
  id: string;
  candidateId: string;
  attemptId: string;
  eventType: SecurityEventType;
  timestamp: string;
  severity: 'warning' | 'critical' | 'informational';
  metadata: string;
}

export interface Question {
  id: string;
  section: QuestionSection;
  sectionTitle: string;
  difficulty: QuestionDifficulty;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  marks: number;
}

export interface CandidateSectionScore {
  section: QuestionSection;
  sectionTitle: string;
  score: number;
  total: number;
  percentage: number;
}

export interface AssessmentCandidate {
  id: string;
  candidateId: string; // e.g. BV26-0001
  password: string;    // e.g. Bv@7Kp92
  name: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  graduationYear: string;
  position: string;
  status: CandidateStatus;
  score: number;
  totalMarks: number;
  percentage: number;
  sectionScores?: Record<string, CandidateSectionScore>;
  violationsCount: number;
  securityLogs: SecurityEvent[];
  answers: Record<string, number>; // questionId -> selectedOptionIndex
  markedForReview: string[];      // questionId[]
  startedAt?: string;
  completedAt?: string;
  terminationReason?: string;
  interviewStatus?: 'not_scheduled' | 'scheduled' | 'completed';
  interviewDetails?: {
    date: string;
    time: string;
    interviewer: string;
    meetingLink: string;
    notes?: string;
  };
  emailSent: boolean;
  emailSentAt?: string;
  messageId?: string;
}

export interface AssessmentConfig {
  id: string;
  title: string;
  durationMinutes: number;
  passingPercentage: number;
  negativeMarking: boolean;
  maxTabSwitches: number;
  maxFullscreenExits: number;
  securityLevel: 'strict' | 'standard' | 'lenient';
  sections: {
    id: QuestionSection;
    title: string;
    count: number;
  }[];
}

export interface EmailLog {
  id: string;
  candidateId: string;
  candidateName: string;
  email: string;
  type: string;
  sentAt: string;
  status: 'delivered' | 'sent' | 'failed';
  messageId: string;
}
