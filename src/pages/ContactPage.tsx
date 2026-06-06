import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Loader2 } from 'lucide-react';

export function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <main className="pt-20 lg:pt-24 min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">Contact HR</h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">Have questions about opportunities at Brainovision? Our HR team is here to help.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Get in Touch</h2>
              <p className="text-slate-600 mb-8">Reach out to our HR team for any queries regarding careers, applications, or the hiring process. We typically respond within 24 business hours.</p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"><Mail className="w-6 h-6 text-blue-600" /></div>
                  <div><h3 className="font-semibold text-slate-900 mb-1">Email</h3><a href="mailto:hr@brainovision.com" className="text-blue-600 hover:text-blue-700">hr@brainovision.com</a></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"><Phone className="w-6 h-6 text-blue-600" /></div>
                  <div><h3 className="font-semibold text-slate-900 mb-1">Phone</h3><a href="tel:+91-9876543210" className="text-blue-600 hover:text-blue-700">+91 98765 43210</a></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"><MapPin className="w-6 h-6 text-blue-600" /></div>
                  <div><h3 className="font-semibold text-slate-900 mb-1">Address</h3><p className="text-slate-600">Brainovision Technologies Pvt. Ltd.<br />HITEC City, Madhapur<br />Hyderabad, Telangana 500081</p></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"><Clock className="w-6 h-6 text-blue-600" /></div>
                  <div><h3 className="font-semibold text-slate-900 mb-1">Office Hours</h3><p className="text-slate-600">Mon - Fri: 9:00 AM - 6:00 PM IST<br />Sat: 10:00 AM - 2:00 PM IST</p></div>
                </div>
              </div>

              <div className="mt-8 rounded-xl overflow-hidden shadow-lg"><img src="https://images.pexels.com/photos/2660939/pexels-photo-2660939.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Hyderabad Office" className="w-full h-48 object-cover" /></div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <div className="card p-6 lg:p-8">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-10 h-10 text-emerald-600" /></div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Message Sent!</h3>
                    <p className="text-slate-600">Thank you for reaching out. We'll get back to you within 24 business hours.</p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-slate-900 mb-6">Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Your Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} required className="input-field" placeholder="John Doe" /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label><input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field" placeholder="john@example.com" /></div>
                      </div>
                      <div><label className="block text-sm font-medium text-slate-700 mb-1">Subject *</label><input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="input-field" placeholder="Question about job application" /></div>
                      <div><label className="block text-sm font-medium text-slate-700 mb-1">Message *</label><textarea name="message" value={formData.message} onChange={handleChange} required rows={5} className="input-field resize-none" placeholder="Your message..." /></div>
                      <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">{loading ? <><Loader2 className="w-5 h-5 animate-spin" />Sending...</> : <><Send className="w-5 h-5" />Send Message</>}</button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
