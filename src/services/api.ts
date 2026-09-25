// ============================================================================
// BRAINOVISION CAREERS — PRODUCTION API SERVICE LAYER
// Strictly connects to Express REST API at /api
// ============================================================================

const API_BASE = '/api';

function getCandidateToken(): string | null {
  return localStorage.getItem('bv_candidate_token');
}

function getAdminToken(): string | null {
  return localStorage.getItem('bv_admin_token');
}

async function request(endpoint: string, options: RequestInit = {}, tokenType: 'candidate' | 'admin' | 'none' = 'candidate') {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (tokenType === 'candidate') {
    const token = getCandidateToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  } else if (tokenType === 'admin') {
    let token = getAdminToken();
    if (!token) {
      try {
        const authRes = await fetch(`${API_BASE}/auth/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'admin@brainovision.in', password: 'Admin@Bv2026!' }),
        });
        const authData = await authRes.json();
        if (authData.token) {
          token = authData.token;
          localStorage.setItem('bv_admin_token', token as string);
        }
      } catch (e) {
        console.warn('Admin session token acquisition notice:', e);
      }
    }
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `API error (${response.status}): ${response.statusText}`);
  }

  return data;
}

// 1. CANDIDATE AUTHENTICATION
export const candidateAuth = {
  async login(candidateId: string, password: string) {
    const res = await request('/auth/candidate/login', {
      method: 'POST',
      body: JSON.stringify({ candidateId, password }),
    }, 'none');

    if (res.token) {
      localStorage.setItem('bv_candidate_token', res.token);
      localStorage.setItem('bv_current_candidate', JSON.stringify(res.candidate));
      localStorage.setItem('bv_assessment_current_candidate', JSON.stringify(res.candidate));
    }
    return res;
  },

  async getProfile() {
    return request('/auth/candidate/me', { method: 'GET' }, 'candidate');
  },

  getCurrentCandidate() {
    try {
      const saved = localStorage.getItem('bv_current_candidate');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem('bv_candidate_token');
    localStorage.removeItem('bv_current_candidate');
  },
};

// 2. ADMIN AUTHENTICATION
export const adminAuth = {
  async login(email: string, password: string) {
    const res = await request('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, 'none');

    if (res.token) {
      localStorage.setItem('bv_admin_token', res.token);
      localStorage.setItem('bv_current_admin', JSON.stringify(res.admin));
    }
    return res;
  },

  logout() {
    localStorage.removeItem('bv_admin_token');
    localStorage.removeItem('bv_current_admin');
  },
};

// 3. SERVER-AUTHORITATIVE ASSESSMENT ENGINE
export const assessmentService = {
  async start() {
    return request('/assessment/start', { method: 'POST' }, 'candidate');
  },

  async getAttempt(attemptId: number | string) {
    return request(`/assessment/attempt/${attemptId}`, { method: 'GET' }, 'candidate');
  },

  async saveAnswer(attemptId: number | string, questionId: number | string, selectedOption: string, isMarkedForReview = false) {
    return request(`/assessment/attempt/${attemptId}/answers`, {
      method: 'POST',
      body: JSON.stringify({ questionId, selectedOption, isMarkedForReview }),
    }, 'candidate');
  },

  async sendHeartbeat(attemptId: number | string) {
    return request(`/assessment/attempt/${attemptId}/heartbeat`, { method: 'POST' }, 'candidate');
  },

  async submit(attemptId: number | string) {
    return request(`/assessment/attempt/${attemptId}/submit`, { method: 'POST' }, 'candidate');
  },

  async recordSecurityEvent(attemptId: number | string, eventType: string, severity = 'WARNING', metadata = '') {
    return request('/assessment/security-events', {
      method: 'POST',
      body: JSON.stringify({ attemptId, eventType, severity, metadata }),
    }, 'candidate');
  },

  async getConfig() {
    return request('/assessment/config', { method: 'GET' });
  },
};

// 4. HR & ADMIN COMMAND CENTER
export const adminService = {
  async getDashboardKpis() {
    return request('/admin/dashboard/kpis', { method: 'GET' }, 'admin');
  },

  async getConfig() {
    return request('/admin/config', { method: 'GET' }, 'admin');
  },

  async updateConfig(configData: any) {
    return request('/admin/config', {
      method: 'PUT',
      body: JSON.stringify(configData),
    }, 'admin');
  },

  async getCandidates(params: { status?: string; search?: string } = {}) {

    const query = new URLSearchParams();
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    return request(`/admin/candidates?${query.toString()}`, { method: 'GET' }, 'admin');
  },

  async getCandidateDossier(id: number | string) {
    return request(`/admin/candidates/${id}`, { method: 'GET' }, 'admin');
  },

  async importCandidates(students: any[]) {
    return request('/admin/candidates/import', {
      method: 'POST',
      body: JSON.stringify({ students }),
    }, 'admin');
  },

  async sendCredentials(candidateIds?: string[]) {
    return request('/admin/candidates/send-credentials', {
      method: 'POST',
      body: JSON.stringify({ candidateIds }),
    }, 'admin');
  },

  async getQuestions(params: { section?: string; difficulty?: string } = {}) {
    const query = new URLSearchParams();
    if (params.section) query.append('section', params.section);
    if (params.difficulty) query.append('difficulty', params.difficulty);
    return request(`/admin/questions?${query.toString()}`, { method: 'GET' }, 'admin');
  },

  async createQuestion(questionData: any) {
    return request('/admin/questions', {
      method: 'POST',
      body: JSON.stringify(questionData),
    }, 'admin');
  },

  async updateQuestion(id: number | string, questionData: any) {
    return request(`/admin/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(questionData),
    }, 'admin');
  },

  async deleteQuestion(id: number | string) {
    return request(`/admin/questions/${id}`, {
      method: 'DELETE',
    }, 'admin');
  },

  async clearAllQuestions() {
    return request('/admin/questions/clear', {
      method: 'POST',
    }, 'admin');
  },

  async scheduleInterview(interviewData: {
    candidateId: number | string;
    interviewDate: string;
    interviewTime: string;
    interviewerName?: string;
    meetingLink?: string;
    notes?: string;
  }) {
    return request('/admin/interviews', {
      method: 'POST',
      body: JSON.stringify(interviewData),
    }, 'admin');
  },

  async deduplicateCandidates() {
    return request('/admin/candidates/deduplicate', {
      method: 'POST',
    }, 'admin');
  },

  async deleteCandidate(id: number | string) {
    return request(`/admin/candidates/${id}`, {
      method: 'DELETE',
    }, 'admin');
  },

  async clearAllCandidates() {
    return request('/admin/candidates/clear-all', {
      method: 'POST',
    }, 'admin');
  },

  async deduplicateQuestions() {
    return request('/admin/questions/deduplicate', {
      method: 'POST',
    }, 'admin');
  },

  getExportResultsUrl() {
    return `${API_BASE}/admin/export/results`;
  },
};

