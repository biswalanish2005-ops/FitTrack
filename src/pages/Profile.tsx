import React from 'react';
import { motion } from 'motion/react';
import { User, Mail, Bell, Shield, LogOut, ChevronRight, Camera, CreditCard, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 pb-8 border-b border-black/5 dark:border-white/5">
         <div className="relative group">
            <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_rgb(0,0,0,0.1)] relative">
               <img src={user?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400"} className="w-full h-full object-cover" alt="Profile" />
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Camera className="text-white" />
               </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-accent p-2 rounded-xl shadow-lg border-4 border-cream dark:border-[#111111]">
               <Award size={20} className="text-white" />
            </div>
         </div>
         <div className="text-center md:text-left">
            <h1 className="text-3xl font-display font-bold text-primary">{user?.displayName || 'User'}</h1>
            <p className="text-slate-500 font-medium">{user?.email}</p>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
               <span className="px-3 py-1 rounded-full bg-white dark:bg-[#1A1A1A] border border-black/5 dark:border-white/5 text-xs font-bold uppercase tracking-wider text-primary">Level 12</span>
               <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider border border-accent/20">24 Day Streak 🔥</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Settings Sections */}
         <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Settings</h3>
            <div className="glass-card rounded-3xl overflow-hidden divide-y divide-black/5 dark:divide-white/5 bg-white dark:bg-[#1A1A1A] border border-black/5 dark:border-white/5 shadow-sm">
               {[
                 { icon: User, label: 'Personal Information', sub: 'Name, email, biological data' },
                 { icon: Bell, label: 'Notifications', sub: 'Meal alerts, goal updates' },
                 { icon: Shield, label: 'Privacy & Security', sub: 'Biometrics, visibility settings' },
                 { icon: CreditCard, label: 'Subscription', sub: 'Manage AI Pro features' },
               ].map((item, i) => (
                 <button key={i} className="w-full p-5 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors group text-left">
                    <div className="flex items-center space-x-4">
                       <div className="p-2.5 bg-black/5 dark:bg-white/5 rounded-xl group-hover:bg-accent/10 group-hover:text-accent transition-colors text-primary">
                          <item.icon size={20} />
                       </div>
                       <div>
                          <p className="font-bold text-primary">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.sub}</p>
                       </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
                 </button>
               ))}
            </div>
         </div>

         {/* Goals Summary */}
         <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Your Stats</h3>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'Start Weight', val: '86.4 kg', change: '+0%' },
                 { label: 'Current Weight', val: '81.2 kg', change: '-6.02%' },
                 { label: 'Goal Weight', val: '75.0 kg', change: '6.2kg left' },
                 { label: 'Days Active', val: '45 Days', change: 'Elite' },
               ].map((stat, i) => (
                 <div key={i} className="glass-card p-5 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-black/5 dark:border-white/5 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-xl font-bold text-primary">{stat.val}</p>
                    <p className={`text-[10px] font-bold mt-2 ${stat.change.startsWith('-') ? 'text-emerald-500' : 'text-accent'}`}>{stat.change}</p>
                 </div>
               ))}
            </div>
            
            <button 
               onClick={() => logout()}
               className="w-full flex items-center justify-center space-x-2 p-5 rounded-3xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-500 hover:text-white transition-all shadow-sm"
            >
               <LogOut size={20} />
               <span>Log Out of All Devices</span>
            </button>
         </div>
      </div>
    </div>
  );
};

export default Profile;
