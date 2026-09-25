import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Briefcase, Globe, FileText, Send, CheckCircle, Loader2 } from 'lucide-react';

// ------------------------------------------------------------
// 1. Job list (matches Google Form dropdown)
// ------------------------------------------------------------
const jobs = [
  { id: 'bv-get-2026', title: 'Graduate Engineering Trainee (GET 2026) - AI & Full Stack' },
  { id: 'bv-ai-trainer-lead', title: 'Lead Technical Trainer (Agentic AI & Quantum Computing)' },
  { id: 'bv-aws-devops-lead', title: 'Senior Cloud Solutions Architect & AWS DevOps Mentor' },
  { id: 'bv-fullstack-dev', title: 'Full Stack Engineer (React, Node.js, WebSockets)' },
  { id: 'bv-campus-hr', title: 'Campus Talent Acquisition Specialist & HR Coordinator' },
  { id: 'bv-ui-ux-designer', title: 'UI/UX Product Designer (Design Systems)' },
  { id: 'digital-marketing-ai-trainer', title: 'Digital Marketing with AI Trainer' },
  { id: 'sales-marketing-executive', title: 'Sales & Marketing Executive' },
  { id: 'technical-training-counselor', title: 'Technical Training Counselor' },
  { id: 'business-development-executive', title: 'Business Development Executive (BDE)' },
  { id: 'prompt-engineer', title: 'Prompt Engineer' },
  { id: 'anchors', title: 'Anchors' },
];

const workModes = ['Work From Office', 'Remote', 'Hybrid', 'Free Launcher', 'Part Time', 'Other'];
const experienceOptions = ['0', '1', '2', '3', '4', '5', 'Other'];
const languageOptions = ['Telugu', 'English', 'Hindi'];
const hostingOptions = ['Educational Sessions', 'Corporate Events', 'Live Shows', 'Webinars', 'YouTube Videos'];

const WEBHOOK_URL = import.meta.env.VITE_GOOGLE_WEBHOOK_URL;

export function ApplyPage() {
  const [searchParams] = useSearchParams();
  const jobIdFromUrl = searchParams.get('jobId');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // ------------------------------------------------------------
  // 2. Form state – includes anchor‑specific fields
  // ------------------------------------------------------------
  const [formData, setFormData] = useState({
    job_id: jobIdFromUrl || '',
    full_name: '',
    mobile_number: '',
    email: '',
    current_city: '',
    linkedin_profile: '',
    years_experience: '',
    preferred_work_mode: '',
    // ----- Anchor fields (only used if job_id === 'anchors') -----
    anchor_languages: [] as string[],
    anchor_hosted: [] as string[],
    anchor_comfortable: '',
    // ------------------------------------------------------------
    resume_url: '',
    declaration: false,
  });

  // ------------------------------------------------------------
  // 3. Handlers
  // ------------------------------------------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleArrayField = (field: 'anchor_languages' | 'anchor_hosted', value: string) => {
    setFormData((prev) => {
      const current = prev[field];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  // ------------------------------------------------------------
  // 4. Validation – includes checks for Anchor fields
  // ------------------------------------------------------------
  const validateForm = () => {
    if (!WEBHOOK_URL || WEBHOOK_URL === 'YOUR_WEBHOOK_URL_HERE') {
      setError('Application system is not properly configured. Please contact support.');
      return false;
    }
    if (!formData.full_name.trim()) {
      setError('Full Name is required.');
      return false;
    }
    if (!formData.mobile_number.trim() || formData.mobile_number.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid mobile number (at least 10 digits).');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!formData.job_id) {
      setError('Please select a position.');
      return false;
    }
    if (!formData.declaration) {
      setError('You must declare that the information provided is true.');
      return false;
    }
    // ----- Anchor validation -----
    if (formData.job_id === 'anchors') {
      if (formData.anchor_languages.length === 0) {
        setError('Please select at least one language you can host in.');
        return false;
      }
      if (formData.anchor_hosted.length === 0) {
        setError('Please select at least one type of event you have hosted.');
        return false;
      }
      if (!formData.anchor_comfortable) {
        setError('Please indicate if you are comfortable in front of a camera.');
        return false;
      }
    }
    return true;
  };

  // ------------------------------------------------------------
  // 5. Submit
  // ------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const selectedJob = jobs.find((job) => job.id === formData.job_id);

      const payload = {
        applied_at: new Date().toISOString(),
        job_id: formData.job_id,
        job_title: selectedJob?.title || '',
        full_name: formData.full_name,
        mobile_number: formData.mobile_number,
        email: formData.email,
        current_city: formData.current_city || '',
        linkedin_profile: formData.linkedin_profile || '',
        years_experience: formData.years_experience || '',
        preferred_work_mode: formData.preferred_work_mode || '',
        // Anchor fields (may be empty for other roles)
        anchor_languages: formData.anchor_languages.join(', '),
        anchor_hosted: formData.anchor_hosted.join(', '),
        anchor_comfortable: formData.anchor_comfortable || '',
        resume_url: formData.resume_url || '',
        declaration: formData.declaration ? 'Yes' : 'No',
      };

      await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });

      // Reset form
      setFormData({
        job_id: '',
        full_name: '',
        mobile_number: '',
        email: '',
        current_city: '',
        linkedin_profile: '',
        years_experience: '',
        preferred_work_mode: '',
        anchor_languages: [],
        anchor_hosted: [],
        anchor_comfortable: '',
        resume_url: '',
        declaration: false,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting application:', err);
      setError('Failed to submit application. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // 6. Success screen
  // ------------------------------------------------------------
  if (submitted) {
    return (
      <main className="pt-20 lg:pt-24 min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full text-center"
        >
          <div className="card p-8 lg:p-12">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Application Submitted!</h2>
            <p className="text-slate-600 mb-6">
              Thank you for your interest. Our HR team will review your application within 3-5 business days.
            </p>
            <Link to="/careers" className="btn-primary inline-block">
              View Other Positions
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  const isAnchor = formData.job_id === 'anchors';

  // ------------------------------------------------------------
  // 7. Main form
  // ------------------------------------------------------------
  return (
    <main className="pt-20 lg:pt-24 min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 py-16 lg:py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-200 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full mb-3">
              Official Candidate Registration
            </span>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-2">Apply for Opportunities</h1>
            <p className="text-blue-100/90 text-base sm:text-lg">Brainovision Solutions India Pvt. Ltd. — Campus & Corporate Recruitment</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Position */}
            <div className="card p-6 lg:p-8">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Position Applied For
              </h3>
              <select
                name="job_id"
                value={formData.job_id}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select a position</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Personal Information */}
            <div className="card p-6 lg:p-8">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Current City</label>
                  <input
                    type="text"
                    name="current_city"
                    value={formData.current_city}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Hyderabad, India"
                  />
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div className="card p-6 lg:p-8">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Professional Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Total years of experience
                  </label>
                  <select
                    name="years_experience"
                    value={formData.years_experience}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select</option>
                    {experienceOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Preferred Work Mode
                  </label>
                  <select
                    name="preferred_work_mode"
                    value={formData.preferred_work_mode}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select</option>
                    {workModes.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedin_profile"
                    value={formData.linkedin_profile}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>
            </div>

            {/* ----------------------------------------------------------------
                ANCHOR-SPECIFIC SECTION – appears only when "Anchors" is selected
                ---------------------------------------------------------------- */}
            {isAnchor && (
              <div className="card p-6 lg:p-8 border-2 border-blue-200 bg-blue-50/50">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Anchor Details
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Which languages can you confidently host or present in?{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {languageOptions.map((lang) => (
                      <label key={lang} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.anchor_languages.includes(lang)}
                          onChange={() => toggleArrayField('anchor_languages', lang)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        {lang}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Have you hosted any of the following? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {hostingOptions.map((event) => (
                      <label key={event} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.anchor_hosted.includes(event)}
                          onChange={() => toggleArrayField('anchor_hosted', event)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        {event}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Are you comfortable speaking in front of a camera?{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="anchor_comfortable"
                        value="Yes"
                        checked={formData.anchor_comfortable === 'Yes'}
                        onChange={handleChange}
                        className="border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="anchor_comfortable"
                        value="No"
                        checked={formData.anchor_comfortable === 'No'}
                        onChange={handleChange}
                        className="border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Resume Upload */}
            <div className="card p-6 lg:p-8">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Resume / CV
              </h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Upload your Resume (link to Google Drive, Dropbox, etc.)
                </label>
                <input
                  type="url"
                  name="resume_url"
                  value={formData.resume_url}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://drive.google.com/file/d/..."
                />
                <p className="text-xs text-slate-500 mt-1">
                  Please share a public link to your resume (PDF or document). Max 10 MB.
                </p>
              </div>
            </div>

            {/* Declaration */}
            <div className="card p-6 lg:p-8">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="declaration"
                  checked={formData.declaration}
                  onChange={handleChange}
                  className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  required
                />
                <span className="text-sm text-slate-700">
                  I hereby declare that the information provided above is true and accurate to the best of my knowledge.
                  <span className="text-red-500"> *</span>
                </span>
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </motion.form>
        </div>
      </section>
    </main>
  );
}