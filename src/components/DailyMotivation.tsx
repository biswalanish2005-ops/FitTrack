import React from 'react';
import { Quote, Flame, Zap } from 'lucide-react';

const DailyMotivation = () => {
  const quotes = [
    "The only bad workout is the one that didn't happen.",
    "Fitness is not about being better than someone else. It's about being better than you were yesterday.",
    "Don't stop when you're tired. Stop when you're done.",
    "Your body can stand almost anything. It's your mind that you have to convince.",
    "Success starts with self-discipline."
  ];

  const [quote] = React.useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  return (
    <div className="glass-card p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-primary/5 to-accent/5">
       <div className="flex -space-x-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center ${i <= 3 ? 'bg-orange-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
               <Flame size={16} />
            </div>
          ))}
          <div className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-primary text-white flex items-center justify-center text-xs font-bold">
            +19
          </div>
       </div>
       
       <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2 text-primary font-bold text-sm uppercase tracking-widest mb-1">
             <Zap size={14} className="fill-current" />
             <span>Daily Streak: 24 Days</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-medium italic flex items-start">
             <Quote size={16} className="mr-2 opacity-20 flex-shrink-0" />
             "{quote}"
          </p>
       </div>

       <div className="px-4 py-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Consistency</div>
          <div className="text-lg font-bold">92%</div>
       </div>
    </div>
  );
};

export default DailyMotivation;
