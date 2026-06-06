import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Building, Globe, FileText, Send, CheckCircle, Loader2 } from 'lucide-react';

const expertiseOptions = ['Agentic AI', 'Quantum Computing', 'Machine Learning', 'Deep Learning', 'Generative AI', 'AWS Cloud', 'Azure Cloud', 'GCP Cloud', 'Full Stack Development', 'React/Node.js', 'Python', 'Data Science', 'MLOps', 'DevOps'];

// Static job list
const jobs = [
  {
    id: "agentic-ai-trainer",
    title: "Senior Agentic AI Trainer",
    category: "AI Training"
  },
  {
    id: "genai-trainer",
    title: "Generative AI Trainer",
    category: "AI Training"
  },
  {
    id: "aws-cloud-trainer",
    title: "AWS Cloud Trainer",
    category: "Cloud Training"
  },
  {
    id: "fullstack-trainer",
    title: "Full Stack Trainer",
    category: "Development Training"
  },
  {
    id: "mlops-trainer",
    title: "MLOps Trainer",
    category: "DevOps Training"
  },
  {
    id: "data-science-trainer",
    title: "Data Science Trainer",
    category: "Data Science Training"
  }
];

// Get webhook URL from environment variables
const WEBHOOK_URL = import.meta.env.VITE_GOOGLE_WEBHOOK_URL;

export function ApplyPage() {
  const [searchParams] = useSearchParams();
  const jobIdFromUrl = searchParams.get('jobId');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    job_id: jobIdFromUrl || '',
    full_name: '',
    email: '',
    phone: '',
    location: '',
    years_experience: '',
    current_company: '',
    current_designation: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    resume_url: '',
    certifications: '',
    expertise_areas: [] as string[],
    cover_letter: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleExpertise = (expertise: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      expertise_areas: prev.expertise_areas.includes(expertise) 
        ? prev.expertise_areas.filter((e) => e !== expertise) 
        : [...prev.expertise_areas, expertise] 
    }));
  };

  const validateForm = () => {
    // Webhook URL check
    if (!WEBHOOK_URL || WEBHOOK_URL === 'YOUR_WEBHOOK_URL_HERE') {
      setError('Application system is not properly configured. Please contact support.');
      return false;
    }
    
    // Email validation with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Phone validation (at least 10 digits)
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setError('Please enter a valid phone number (at least 10 digits)');
      return false;
    }
    
    // Name validation
    if (formData.full_name.trim().length < 2) {
      setError('Please enter your full name');
      return false;
    }
    
    // Job selection validation
    if (!formData.job_id) {
      setError('Please select a position');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Get selected job title
      const selectedJob = jobs.find(job => job.id === formData.job_id);
      
      // Prepare data for webhook with exact column structure
      const payload = {
        applied_at: new Date().toISOString(),
        job_id: formData.job_id,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location || '',
        years_experience: formData.years_experience ? parseInt(formData.years_experience) : null,
        current_company: formData.current_company || '',
        current_designation: formData.current_designation || '',
        linkedin_url: formData.linkedin_url || '',
        github_url: formData.github_url || '',
        portfolio_url: formData.portfolio_url || '',
        resume_url: formData.resume_url || '',
        certifications: formData.certifications
          ? formData.certifications.split(',').map(c => c.trim()).join(', ')
          : '',
        expertise_areas: formData.expertise_areas.join(', '),
        cover_letter: formData.cover_letter || ''
      };
      
      // CORS-safe fetch for Google Apps Script
      await fetch(WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(payload),
      });
      
      // Reset form on success
      setFormData({
        job_id: '',
        full_name: '',
        email: '',
        phone: '',
        location: '',
        years_experience: '',
        current_company: '',
        current_designation: '',
        linkedin_url: '',
        github_url: '',
        portfolio_url: '',
        resume_url: '',
        certifications: '',
        expertise_areas: [],
        cover_letter: ''
      });
      
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting application:', err);
      setError('Failed to submit application. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="pt-20 lg:pt-24 min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="max-w-md w-full text-center">
          <div className="card p-8 lg:p-12">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Application Submitted!</h2>
            <p className="text-slate-600 mb-6">Thank you for your interest. Our HR team will review your application within 3-5 business days.</p>
            <Link to="/careers" className="btn-primary inline-block">View Other Positions</Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="pt-20 lg:pt-24 min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">Apply Now</h1>
            <p className="text-slate-300 text-lg">Take the first step towards an exciting career in technology education</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} onSubmit={handleSubmit} className="space-y-6">
            <div className="card p-6 lg:p-8">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Position Applied For
              </h3>
              <select name="job_id" value={formData.job_id} onChange={handleChange} required className="input-field">
                <option value="">Select a position</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} - {job.category}
                  </option>
                ))}
              </select>
            </div>

            <div className="card p-6 lg:p-8">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                  <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required className="input-field" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="input-field" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} className="input-field" placeholder="Hyderabad, India" />
                </div>
              </div>
            </div>

            <div className="card p-6 lg:p-8">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                Professional Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience</label>
                  <input type="number" name="years_experience" value={formData.years_experience} onChange={handleChange} min="0" className="input-field" placeholder="5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Current Company</label>
                  <input type="text" name="current_company" value={formData.current_company} onChange={handleChange} className="input-field" placeholder="Company Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Current Designation</label>
                  <input type="text" name="current_designation" value={formData.current_designation} onChange={handleChange} className="input-field" placeholder="Senior AI Trainer" />
                </div>
              </div>
            </div>

            <div className="card p-6 lg:p-8">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Profiles & Links
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL</label>
                  <input type="url" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} className="input-field" placeholder="https://linkedin.com/in/..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">GitHub Profile</label>
                  <input type="url" name="github_url" value={formData.github_url} onChange={handleChange} className="input-field" placeholder="https://github.com/username" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Portfolio/Website URL</label>
                  <input type="url" name="portfolio_url" value={formData.portfolio_url} onChange={handleChange} className="input-field" placeholder="https://yourportfolio.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Resume/CV URL</label>
                  <input type="url" name="resume_url" value={formData.resume_url} onChange={handleChange} className="input-field" placeholder="Google Drive or Dropbox link" />
                  <p className="text-xs text-slate-500 mt-1">Please share a public link to your resume (Google Drive, Dropbox, etc.)</p>
                </div>
              </div>
            </div>

            <div className="card p-6 lg:p-8">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Certifications
              </h3>
              <input type="text" name="certifications" value={formData.certifications} onChange={handleChange} className="input-field" placeholder="AWS, Azure, GCP (comma-separated)" />
              <p className="text-xs text-slate-500 mt-1">Separate multiple certifications with commas</p>
            </div>

            <div className="card p-6 lg:p-8">
              <h3 className="font-semibold text-slate-900 mb-4">Areas of Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {expertiseOptions.map((expertise) => (
                  <button
                    key={expertise}
                    type="button"
                    onClick={() => toggleExpertise(expertise)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      formData.expertise_areas.includes(expertise) 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {expertise}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">Select all that apply</p>
            </div>

            <div className="card p-6 lg:p-8">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Cover Letter
              </h3>
              <textarea 
                name="cover_letter" 
                value={formData.cover_letter} 
                onChange={handleChange} 
                rows={6} 
                className="input-field resize-none" 
                placeholder="Tell us about your training philosophy, experience, and why you want to join Brainovision..." 
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="flex justify-end">
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" />Submitting...</>
                ) : (
                  <><Send className="w-5 h-5" />Submit Application</>
                )}
              </button>
            </div>
          </motion.form>
        </div>
      </section>
    </main>
  );
}