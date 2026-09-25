import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Users, Lightbulb, Coffee } from 'lucide-react';

const culturePoints = [
  { title: 'Innovation First', description: 'We encourage experimentation and welcome bold ideas.', icon: Lightbulb, color: 'blue' },
  { title: 'Collaborative Spirit', description: 'Work alongside industry experts and passionate educators.', icon: Users, color: 'emerald' },
  { title: 'Work-Life Balance', description: 'Flexible hours, remote options, and generous PTO.', icon: Coffee, color: 'orange' },
  { title: 'Making an Impact', description: 'Your work directly impacts thousands of learners worldwide.', icon: Heart, color: 'cyan' },
];

const galleryImages = [
  { src: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Interactive Workshops', description: 'Hands-on learning with real-world projects' },
  { src: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Annual Hackathons', description: '48-hour innovation challenges with exciting prizes' },
  { src: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Team Building', description: 'Regular events, outings, and celebrations' },
  { src: 'https://images.pexels.com/photos/3184611/pexels-photo-3184611.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Expert Sessions', description: 'Learn from industry leaders and guest speakers' },
  { src: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Global Conferences', description: 'Represent Brainovision at top tech conferences' },
  { src: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Certification Days', description: 'Achieve industry certifications with our support' },
];

const stats = [{ value: '150+', label: 'Team Members' }, { value: '12+', label: 'Years of Excellence' }, { value: '50K+', label: 'Students Trained' }, { value: '100+', label: 'Corporate Partners' }];

export function LifePage() {
  return (
    <main className="pt-20 lg:pt-24 min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 py-16 lg:py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-200 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full mb-3">
              Brainovision Culture & Team
            </span>
            <h1 className="text-3xl lg:text-5xl font-extrabold text-white mb-4">Life at Brainovision</h1>
            <p className="text-blue-100/90 text-lg max-w-2xl mx-auto">More than just a workplace — a community of innovators, educators, and technology leaders</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => (<motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }} className="text-center"><div className="text-3xl lg:text-4xl font-bold text-slate-900">{stat.value}</div><div className="text-sm text-slate-600 mt-1">{stat.label}</div></motion.div>))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <h2 className="section-title">Our Culture</h2>
            <p className="section-subtitle mx-auto">Built on collaboration, innovation, and a passion for education</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
            {culturePoints.map((point, index) => (
              <motion.div key={point.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <div className="card p-6 lg:p-8 h-full">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${point.color === 'blue' ? 'bg-blue-100 text-blue-600' : point.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' : point.color === 'orange' ? 'bg-orange-100 text-orange-600' : 'bg-cyan-100 text-cyan-600'}`}><point.icon className="w-7 h-7" /></div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{point.title}</h3>
                  <p className="text-slate-600">{point.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <h2 className="section-title">A Day at Brainovision</h2>
            <p className="section-subtitle mx-auto">From workshops to hackathons, every day brings new opportunities</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <motion.div key={image.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="group">
                <div className="relative h-64 lg:h-72 rounded-xl overflow-hidden">
                  <img src={image.src} alt={image.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white font-semibold text-lg mb-1">{image.title}</h3>
                    <p className="text-slate-300 text-sm">{image.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Join Us?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">Start your journey with Brainovision and help shape the future of technology education</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/careers" className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">View Open Positions</Link>
              <Link to="/apply" className="px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors inline-flex items-center justify-center gap-2">Apply Now <ArrowRight className="w-5 h-5" /></Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
