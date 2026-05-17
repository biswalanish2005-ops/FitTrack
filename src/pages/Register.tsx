import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, User, UserPlus, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { signUpWithEmail, signInWithGoogle, user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (user) navigate('/goals');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const fullName = `${firstName} ${lastName}`.trim();

    try {
      await signUpWithEmail(email, password, fullName);
      navigate('/goals');
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password auth is disabled. Enable it in your Firebase Console (Build > Authentication > Sign-in method).');
      } else {
        setError(err.message || 'Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 bg-white dark:bg-[#1A1A1A] border border-black/5 dark:border-white/5 w-full max-w-xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none" />
        
        <div className="text-center mb-10 relative z-10">
           <NavLink to="/" className="text-3xl font-display font-bold text-primary mb-4 inline-block">
            FitTrack <span className="text-accent font-light">AI</span>
          </NavLink>
          <h1 className="text-2xl font-display font-bold text-primary">Join the Elite</h1>
          <p className="text-slate-500 mt-2">Start your AI-powered transformation today.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-medium relative z-10">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                 <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      name="firstName"
                      type="text" 
                      placeholder="Anish"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-accent focus:outline-none transition-all font-medium" 
                      required
                    />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                 <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      name="lastName"
                      type="text" 
                      placeholder="Biswal"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-accent focus:outline-none transition-all font-medium" 
                    />
                 </div>
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                   name="email"
                   type="email" 
                   placeholder="biswal.anish@example.com"
                   className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-accent focus:outline-none transition-all font-medium" 
                   required
                 />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                   name="password"
                   type="password" 
                   placeholder="Create a strong password"
                   className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-accent focus:outline-none transition-all font-medium" 
                   required
                 />
              </div>
           </div>

           <div className="flex items-start space-x-3 p-4 bg-slate-50 dark:bg-[#111111] rounded-2xl border border-black/5 dark:border-white/5">
              <ShieldCheck className="text-accent mt-0.5 flex-shrink-0" size={20} />
              <p className="text-xs text-slate-500 leading-normal">
                By signing up, you agree to our <button type="button" className="text-primary dark:text-cream font-bold">Terms of Use</button> and <button type="button" className="text-primary dark:text-cream font-bold">Privacy Policy</button>.
              </p>
           </div>

           <button 
             type="submit"
             disabled={loading}
             className="w-full py-4 bg-primary text-cream text-lg font-bold rounded-2xl hover:bg-black dark:hover:bg-white dark:hover:text-black transition-all transform hover:scale-[1.01] active:scale-95 shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
           >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>Build My Profile</span>
                  <UserPlus size={20} />
                </>
              )}
           </button>

           <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                 <div className="w-full border-t border-black/5 dark:border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                 <span className="bg-white dark:bg-[#1A1A1A] px-3 text-slate-400 font-bold tracking-wider">Or</span>
              </div>
           </div>

           <button 
             type="button"
             onClick={() => signInWithGoogle()}
             className="w-full py-4 bg-slate-50 dark:bg-[#111111] border border-black/5 dark:border-white/5 text-primary rounded-2xl font-bold hover:bg-slate-100 dark:hover:bg-white/5 transition-all flex items-center justify-center space-x-3"
           >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              <span>Sign up with Google</span>
           </button>
        </form>

        <div className="mt-8 text-center text-sm relative z-10">
           <span className="text-slate-500">Already part of the community? </span>
           <NavLink to="/login" className="text-accent font-bold hover:underline">Log in</NavLink>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
