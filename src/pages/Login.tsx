import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { signInWithGoogle, user } = useAuth();

  React.useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Social only for this demo per guidelines, or simple redirect if email is used
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
        
        <div className="text-center mb-10">
           <NavLink to="/" className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4 inline-block">
            FitTrack AI
          </NavLink>
          <h1 className="text-3xl font-display font-bold">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Log in to your precision dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                   type="email" 
                   placeholder="alex@example.com"
                   className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
                   required
                 />
              </div>
           </div>
           <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                 <button type="button" className="text-xs text-primary font-bold hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                   type="password" 
                   placeholder="••••••••"
                   className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
                   required
                 />
              </div>
           </div>

           <button 
             type="submit"
             className="w-full py-4 bg-primary text-white text-lg font-bold rounded-2xl hover:bg-primary-dark transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center space-x-2"
           >
              <span>Access Dashboard</span>
              <LogIn size={20} />
           </button>

           <div className="relative">
              <div className="absolute inset-0 flex items-center">
                 <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                 <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 font-bold">Or continue with</span>
              </div>
           </div>

           <button 
             type="button"
             onClick={handleGoogleSignIn}
             className="w-full py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center space-x-2"
           >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              <span>Sign in with Google</span>
           </button>
        </form>

        <div className="mt-8 text-center text-sm">
           <span className="text-slate-500">Don't have an account? </span>
           <NavLink to="/register" className="text-primary font-bold hover:underline">Sign up for free</NavLink>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
