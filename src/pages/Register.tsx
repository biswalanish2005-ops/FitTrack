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
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
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

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                 <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      name="firstName"
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
                      name="lastName"
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
                   name="email"
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
                   name="password"
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
                By signing up, you agree to our <button type="button" className="text-primary font-bold">Terms of Use</button> and <button type="button" className="text-primary font-bold">Privacy Policy</button>.
              </p>
           </div>

           <button 
             type="submit"
             disabled={loading}
             className="w-full py-4 bg-primary text-white text-lg font-bold rounded-2xl hover:bg-primary-dark transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center space-x-2 disabled:opacity-50"
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
                 <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                 <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 font-bold">Or</span>
              </div>
           </div>

           <button 
             type="button"
             onClick={() => signInWithGoogle()}
             className="w-full py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center space-x-2"
           >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              <span>Sign up with Google</span>
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
