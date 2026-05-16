import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, User, UserPlus, ShieldCheck } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    navigate('/goals');
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 rounded-[2.5rem] w-full max-w-xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl -ml-24 -mb-24" />
        
        <div className="text-center mb-10">
           <NavLink to="/" className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4 inline-block">
            FitTrack AI
          </NavLink>
          <h1 className="text-3xl font-display font-bold">Join the Elite</h1>
          <p className="text-slate-500 mt-2">Start your AI-powered transformation today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                 <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Anish"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
                      required
                    />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                 <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Biswal"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
                    />
                 </div>
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                   type="email" 
                   placeholder="biswal.anish@example.com"
                   className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
                   required
                 />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                   type="password" 
                   placeholder="Create a strong password"
                   className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
                   required
                 />
              </div>
           </div>

           <div className="flex items-start space-x-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <ShieldCheck className="text-green-500 mt-1 flex-shrink-0" size={20} />
              <p className="text-xs text-slate-500 leading-normal">
                By signing up, you agree to our <button className="text-primary font-bold">Terms of Use</button> and <button className="text-primary font-bold">Privacy Policy</button>, including our biometric data handling disclosure.
              </p>
           </div>

           <button 
             type="submit"
             className="w-full py-4 bg-primary text-white text-lg font-bold rounded-2xl hover:bg-primary-dark transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center space-x-2"
           >
              <span>Build My Profile</span>
              <UserPlus size={20} />
           </button>
        </form>

        <div className="mt-8 text-center text-sm">
           <span className="text-slate-500">Already part of the community? </span>
           <NavLink to="/login" className="text-primary font-bold hover:underline">Log in</NavLink>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
