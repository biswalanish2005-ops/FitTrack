import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Brain, Scale, ChefHat, Leaf, Dumbbell, ArrowRight } from 'lucide-react';
import { getDietRecommendation } from '../lib/gemini';

const DietRecommendation = () => {
  const [loading, setLoading] = React.useState(false);
  const [dietPlan, setDietPlan] = React.useState<string | null>(null);
  const [preference, setPreference] = React.useState('high-protein');

  const generatePlan = async () => {
    setLoading(true);
    // Mock user data for now or get from state
    const userData = {
      weight: 80,
      height: 180,
      age: 28,
      activityLevel: 'moderate',
      goal: 'weight loss',
      preferences: preference
    };
    const res = await getDietRecommendation(userData);
    setDietPlan(res);
    setLoading(false);
  };

  const Salad = ({ size }: { size: number }) => <Leaf size={size} />; // Placeholder fix

  const dietTypes = [
    { id: 'high-protein', label: 'High Protein', icon: Dumbbell },
    { id: 'vegetarian', label: 'Vegetarian', icon: Leaf },
    { id: 'vegan', label: 'Vegan', icon: Salad },
    { id: 'indian', label: 'Indian Diet', icon: ChefHat },
    { id: 'keto', label: 'Keto Friendly', icon: Scale },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-6 border border-accent/20">
            <Brain size={16} />
            <span>AI Brain Active</span>
          </div>
          <h1 className="text-4xl font-display font-bold mb-4 text-primary">AI Diet Concierge</h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            Our Gemini-powered engine crafts dynamic meal plans tailored to your biometric history and palate preferences.
          </p>
        </div>
        <button 
          onClick={generatePlan}
          disabled={loading}
          className="flex items-center justify-center space-x-2 bg-primary text-cream px-8 py-4 rounded-2xl text-lg font-bold hover:bg-primary-dark transition-all shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
              <Sparkles size={20} />
            </motion.div>
          ) : (
            <Sparkles size={20} />
          )}
          <span>{loading ? 'Synthesizing...' : 'Generate AI Plan'}</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {dietTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setPreference(type.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold transition-all ${
              preference === type.id 
              ? 'bg-primary text-cream shadow-lg scale-105' 
              : 'bg-white dark:bg-[#1A1A1A] border border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 text-slate-500'
            }`}
          >
            <type.icon size={18} />
            <span>{type.label}</span>
          </button>
        ))}
      </div>

      {dietPlan ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-10 rounded-[3rem] relative bg-white dark:bg-[#1A1A1A] border border-black/5 dark:border-white/5 shadow-xl"
        >
          <div className="prose dark:prose-invert max-w-none prose-p:text-slate-600 dark:prose-p:text-slate-400">
            <h2 className="text-3xl font-display font-bold mb-8 flex items-center text-primary">
              <Sparkles className="mr-3 text-accent" />
              Your Personalized {preference.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')} Plan
            </h2>
            <div className="whitespace-pre-wrap leading-relaxed text-lg font-medium text-slate-700 dark:text-slate-300">
              {dietPlan}
            </div>
          </div>
          
          <div className="mt-12 flex justify-end space-x-4">
             <button className="px-8 py-4 rounded-2xl border border-black/10 dark:border-white/10 font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-primary">
               Save to Favorites
             </button>
             <button className="px-8 py-4 bg-primary text-cream rounded-2xl font-bold hover:bg-primary-dark transition-colors shadow-lg">
               Apply Plan
             </button>
          </div>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
           <div className="p-12 border-2 border-dashed border-black/10 dark:border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-center bg-white/50 dark:bg-[#111111]/50">
              <Brain size={64} className="text-slate-300 dark:text-slate-700 mb-8" />
              <h3 className="text-2xl font-bold mb-4 text-primary">Ready to Upgrade Your Nutrition?</h3>
              <p className="text-slate-500 mb-8 max-w-sm leading-relaxed">Tap the generate button to create a plan based on your current body metrics.</p>
           </div>
           <div className="glass-card p-10 rounded-[3rem] bg-[#1A1A1A] text-cream border-none flex flex-col justify-between shadow-2xl">
              <div>
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-accent mb-8 border border-white/10">
                  <Star fill="currentColor" size={28} />
                </div>
                <h3 className="text-3xl font-display font-bold mb-6">Why AI Recommendations?</h3>
                <ul className="space-y-5">
                  {[
                    'Based on verified clinical BMR data',
                    'Adapts to your food preferences',
                    'Includes macro-perfect caloric balance',
                    'Cultural and regional food support'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center space-x-4 text-white/70 font-medium">
                      <div className="p-1.5 bg-accent/10 rounded-lg">
                        <ArrowRight size={16} className="text-accent" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-white/40 text-xs mt-10 font-medium tracking-wider uppercase">Powered by Gemini 3 Flash Pro for elite reasoning.</p>
           </div>
        </div>
      )}
    </div>
  );
};

const Star = ({ size, fill }: { size: number, fill: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default DietRecommendation;
