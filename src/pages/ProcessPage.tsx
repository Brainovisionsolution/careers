import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Search, Code, Presentation, Users, CheckCircle, Clock, MessageCircle, ArrowRight } from 'lucide-react';

const steps = [
  { title: 'Application', icon: FileText, description: 'Submit your application with resume, demo video, and cover letter', details: ['Complete the online application form', 'Upload your latest resume', 'Share a trainer demo video (5-10 mins)', 'Write a brief cover letter about your training philosophy'], duration: '5-10 minutes' },
  { title: 'Resume Screening', icon: Search, description: 'Our HR team reviews your application for role fit', details: ['Evaluation of education and experience', 'Assessment of technical background', 'Review of certifications and achievements', 'Initial role matching'], duration: '3-5 business days' },
  { title: 'Technical Evaluation', icon: Code, description: 'Demonstrate your domain expertise through assessment', details: ['Technical interview with subject matter experts', 'Problem-solving scenarios related to your domain', 'Discussion of past projects and publications', 'Evaluation of depth and breadth of knowledge'], duration: '60 minutes' },
  { title: 'Demo Teaching', icon: Presentation, description: 'Showcase your teaching style and communication skills', details: ['Prepare a 30-minute teaching demo', 'Interactive session with evaluation panel', 'Assessment of presentation skills', 'Feedback on teaching methodology'], duration: '45 minutes' },
  { title: 'HR Discussion', icon: Users, description: 'Discuss career goals, compensation, and culture fit', details: ['In-depth conversation about your aspirations', 'Discussion on salary and benefits', 'Understanding of Brainovision culture', 'Q&A about the role'], duration: '30-45 minutes' },
  { title: 'Offer Letter', icon: CheckCircle, description: 'Welcome to the Brainovision family!', details: ['Receive your offer letter via email', 'Review compensation and benefits', 'Complete onboarding paperwork', 'Begin your journey as a Trainer'], duration: 'Within 2 business days' },
];

const tips = ['Research Brainovision and our training programs before applying', 'Tailor your cover letter to the specific role', 'Choose a demo topic that showcases your expertise', 'Prepare questions about the role and our organization', 'Be authentic and show your passion for education'];

export function ProcessPage() {
  return (
    <main className="pt-20 lg:pt-24 min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">Our Hiring Process</h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">A transparent 6-step journey designed to find the perfect match</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-slate-200" />
            {steps.map((step, index) => (
              <motion.div key={step.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className={`relative mb-12 lg:mb-16 last:mb-0 ${index % 2 === 0 ? 'lg:pr-[calc(50%+2rem)]' : 'lg:pl-[calc(50%+2rem)]'}`}>
                <div className="hidden lg:flex absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full items-center justify-center text-white font-bold text-lg z-10">{index + 1}</div>
                <div className="card p-6 lg:p-8 lg:max-w-md ml-12 lg:ml-0">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{step.description}</p>
                  <ul className="space-y-2 mb-4">{step.details.map((detail, i) => (<li key={i} className="flex items-start gap-2 text-sm text-slate-600"><CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />{detail}</li>))}</ul>
                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-2 rounded-lg inline-flex"><Clock className="w-4 h-4" />{step.duration}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-6"><MessageCircle className="w-6 h-6 text-blue-600" /><h2 className="text-2xl font-bold text-slate-900">Interview Tips</h2></div>
            <div className="space-y-3">{tips.map((tip, index) => (<motion.div key={index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.1 }} className="flex items-start gap-3 bg-slate-50 p-4 rounded-lg"><div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">{index + 1}</div><p className="text-slate-700">{tip}</p></motion.div>))}</div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Start Your Application</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">Ready to take the first step? Apply now and begin your journey with Brainovision.</p>
            <Link to="/apply" className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center gap-2">Apply Now <ArrowRight className="w-5 h-5" /></Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
