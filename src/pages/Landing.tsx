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
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles size={16} />
              <span>AI-Powered Fitness Evolution</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              Unlock Your <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Peak Potential</span> with FitTrack AI
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-lg">
              The only health platform that combines precision tracking with Gemini-powered elite diet recommendations and body progress analysis.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <NavLink to="/register" className="flex items-center justify-center space-x-2 bg-primary text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-primary-dark transition-all transform hover:scale-105 shadow-lg shadow-primary/25">
                <span>Start Free Trial</span>
                <ArrowRight size={20} />
              </NavLink>
              <NavLink to="/login" className="flex items-center justify-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                <span>Sign In</span>
              </NavLink>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="md:w-1/2 relative"
          >
            <div className="w-full aspect-square glass-card rounded-[3rem] overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
              {/* Mock Dashboard UI */}
              <div className="absolute top-10 left-10 p-6 glass-card rounded-2xl w-48 shadow-2xl">
                 <div className="text-slate-500 text-xs font-bold uppercase mb-2">Calories</div>
                 <div className="text-2xl font-bold">2,450</div>
                 <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-primary w-[75%]" />
                 </div>
              </div>
              <div className="absolute bottom-10 right-10 p-6 glass-card rounded-2xl w-56 shadow-2xl">
                 <div className="text-slate-500 text-xs font-bold uppercase mb-2">Protein Target</div>
                 <div className="flex items-end space-x-2">
                    <div className="text-3xl font-bold">165g</div>
                    <div className="text-green-500 text-sm font-bold pb-1 underline">Completed</div>
                 </div>
              </div>
              {/* Central Abstract Shape */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/30 blur-[100px] rounded-full animate-pulse" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Trusted by 50,000+ fitness enthusiasts</p>
          <div className="flex flex-wrap justify-center gap-12 grayscale opacity-50">
             <div className="text-2xl font-bold font-display italic">VOGUE</div>
             <div className="text-2xl font-bold font-display">Men'sHealth</div>
             <div className="text-2xl font-bold font-display uppercase">Forbes</div>
             <div className="text-2xl font-bold font-display">Women'sHealth</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-slate-100/50 dark:bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Everything You Need</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">One platform to track your body, nutrition, and goals with intelligence.</p>
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
                className="p-8 glass-card rounded-3xl"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
