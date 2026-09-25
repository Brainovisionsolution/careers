import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { CareersPage } from './pages/CareersPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { LifePage } from './pages/LifePage';
import { ProcessPage } from './pages/ProcessPage';
import { ApplyPage } from './pages/ApplyPage';
import { ContactPage } from './pages/ContactPage';

// Assessment Platform Pages (Distraction-Free)
import { AssessmentLogin } from './pages/assessment/AssessmentLogin';
import { AssessmentWelcome } from './pages/assessment/AssessmentWelcome';
import { AssessmentSystemCheck } from './pages/assessment/AssessmentSystemCheck';
import { AssessmentRules } from './pages/assessment/AssessmentRules';
import { AssessmentExam } from './pages/assessment/AssessmentExam';
import { AssessmentResult } from './pages/assessment/AssessmentResult';

// Admin / HR Management
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminAssessment } from './pages/admin/AdminAssessment';
import { AdminJobs } from './pages/admin/AdminJobs';
import { AdminCandidates } from './pages/admin/AdminCandidates';
import { AdminInterviews } from './pages/admin/AdminInterviews';

function MainLayout({ children }: { children: React.ReactNode }) {
  return <><Navbar />{children}<Footer /></>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Corporate Careers Pages */}
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/careers" element={<MainLayout><CareersPage /></MainLayout>} />
        <Route path="/careers/:id" element={<MainLayout><JobDetailsPage /></MainLayout>} />
        <Route path="/life" element={<MainLayout><LifePage /></MainLayout>} />
        <Route path="/process" element={<MainLayout><ProcessPage /></MainLayout>} />
        <Route path="/apply" element={<MainLayout><ApplyPage /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />

        {/* Brainovision Recruitment Assessment Candidate Engine (Clean, No Website Navbar) */}
        <Route path="/assessment" element={<AssessmentLogin />} />
        <Route path="/assessment/login" element={<AssessmentLogin />} />
        <Route path="/assessment/welcome" element={<AssessmentWelcome />} />
        <Route path="/assessment/system-check" element={<AssessmentSystemCheck />} />
        <Route path="/assessment/rules" element={<AssessmentRules />} />
        <Route path="/assessment/exam" element={<AssessmentExam />} />
        <Route path="/assessment/result" element={<AssessmentResult />} />

        {/* HR & Recruiter Administration */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="assessment" element={<AdminAssessment />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="candidates" element={<AdminCandidates />} />
          <Route path="interviews" element={<AdminInterviews />} />
          <Route path="analytics" element={<AdminDashboard />} />
        </Route>

        {/* Catch-all redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
