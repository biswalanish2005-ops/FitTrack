import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle, Shield, Zap, Sparkles } from 'lucide-react';

const Landing = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:w-1/2 mb-10 md:mb-0"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-8 border border-accent/20">
              <Sparkles size={16} />
              <span>AI-Powered Fitness Evolution</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6 text-primary">
              Unlock Your <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Peak Potential</span> with FitTrack AI
            </h1>
            <p className="text-xl text-slate-500 mb-10 max-w-lg leading-relaxed">
              The only health platform that combines precision tracking with Gemini-powered elite diet recommendations and body progress analysis.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <NavLink to="/register" className="flex items-center justify-center space-x-2 bg-primary text-cream px-8 py-4 rounded-2xl text-lg font-bold hover:bg-black dark:hover:bg-white dark:hover:text-black transition-all transform hover:scale-[1.02] shadow-xl">
                <span>Start Free Trial</span>
                <ArrowRight size={20} />
              </NavLink>
              <NavLink to="/login" className="flex items-center justify-center space-x-2 bg-white dark:bg-[#1A1A1A] border border-black/5 dark:border-white/5 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-primary shadow-sm">
                <span>Sign In</span>
              </NavLink>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="md:w-1/2 relative"
          >
            <div className="w-full aspect-square glass-card rounded-[3rem] overflow-hidden relative border border-black/5 dark:border-white/5 bg-white dark:bg-[#1A1A1A]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
              {/* Mock Dashboard UI */}
              <div className="absolute top-10 left-10 p-6 glass-card bg-white dark:bg-[#111111] rounded-2xl w-48 shadow-2xl border border-black/5 dark:border-white/5">
                 <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Calories</div>
                 <div className="text-2xl font-bold text-primary">2,450</div>
                 <div className="w-full h-1.5 bg-black/5 dark:bg-white/5 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-accent w-[75%]" />
                 </div>
              </div>
              <div className="absolute bottom-10 right-10 p-6 glass-card bg-white dark:bg-[#111111] rounded-2xl w-56 shadow-2xl border border-black/5 dark:border-white/5">
                 <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Protein Target</div>
                 <div className="flex items-end space-x-2">
                    <div className="text-3xl font-bold text-primary">165g</div>
                    <div className="text-emerald-500 text-sm font-bold pb-1 underline">Completed</div>
                 </div>
              </div>
              {/* Central Abstract Shape */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/20 blur-[100px] rounded-full animate-pulse" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-black/5 dark:border-white/5 overflow-hidden bg-black/5 dark:bg-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">Trusted by 50,000+ fitness enthusiasts</p>
          <div className="flex flex-wrap justify-center gap-12 grayscale opacity-40">
             <div className="text-2xl font-bold font-display italic">VOGUE</div>
             <div className="text-2xl font-bold font-display">Men'sHealth</div>
             <div className="text-2xl font-bold font-display uppercase">Forbes</div>
             <div className="text-2xl font-bold font-display">Women'sHealth</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-primary">Everything You Need</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">One platform to track your body, nutrition, and goals with intelligence.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'AI Diet Coach', desc: 'Gemini-powered meal plans tailored to your BMI and food preferences.', icon: Sparkles },
              { title: 'Advanced Tracker', desc: 'Log meals and see real-time macro breakdowns with ease.', icon: Zap },
              { title: 'Progress Timeline', desc: 'Visualize your journey with secure photo comparison and analytics.', icon: Shield },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-10 glass-card bg-white dark:bg-[#1A1A1A] border border-black/5 dark:border-white/5 rounded-[3rem] shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-2xl flex items-center justify-center text-primary mb-8 border border-black/5 dark:border-white/5">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-primary">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-lg">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
