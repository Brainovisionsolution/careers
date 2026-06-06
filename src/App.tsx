import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { CareersPage } from './pages/CareersPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { LifePage } from './pages/LifePage';
import { ProcessPage } from './pages/ProcessPage';
import { ApplyPage } from './pages/ApplyPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
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
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/careers" element={<MainLayout><CareersPage /></MainLayout>} />
        <Route path="/careers/:id" element={<MainLayout><JobDetailsPage /></MainLayout>} />
        <Route path="/life" element={<MainLayout><LifePage /></MainLayout>} />
        <Route path="/process" element={<MainLayout><ProcessPage /></MainLayout>} />
        <Route path="/apply" element={<MainLayout><ApplyPage /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="candidates" element={<AdminCandidates />} />
          <Route path="interviews" element={<AdminInterviews />} />
          <Route path="analytics" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
