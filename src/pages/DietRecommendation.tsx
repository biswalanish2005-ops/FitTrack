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
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Brain size={16} />
            <span>AI Brain Active</span>
          </div>
          <h1 className="text-4xl font-display font-bold mb-4">AI Diet Concierge</h1>
          <p className="text-slate-500 text-lg">
            Our Gemini-powered engine crafts dynamic meal plans tailored to your biometric history and palate preferences.
          </p>
        </div>
        <button 
          onClick={generatePlan}
          disabled={loading}
          className="flex items-center justify-center space-x-2 bg-primary text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 disabled:opacity-50"
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
            className={`flex items-center space-x-2 px-5 py-3 rounded-2xl font-bold transition-all ${
              preference === type.id 
              ? 'bg-accent text-white scale-105' 
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
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
          className="glass-card p-10 rounded-[3rem] relative"
        >
          <div className="prose dark:prose-invert max-w-none prose-p:text-slate-600 dark:prose-p:text-slate-300">
            <h2 className="text-3xl font-display font-bold mb-8 flex items-center">
              <Sparkles className="mr-3 text-accent" />
              Your Personalized {preference.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')} Plan
            </h2>
            <div className="whitespace-pre-wrap leading-relaxed text-lg">
              {dietPlan}
            </div>
          </div>
          
          <div className="mt-12 flex justify-end space-x-4">
             <button className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold hover:bg-slate-100 dark:hover:bg-slate-800">
               Save to Favorites
             </button>
             <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark">
               Apply Plan
             </button>
          </div>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
           <div className="p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] flex flex-col items-center justify-center text-center">
              <Brain size={64} className="text-slate-300 mb-6" />
              <h3 className="text-xl font-bold mb-2">Ready to Upgrade Your Nutrition?</h3>
              <p className="text-slate-500 mb-8 max-w-xs">Tap the generate button to create a plan based on your current body metrics.</p>
           </div>
           <div className="glass-card p-8 rounded-[3rem] bg-slate-950 text-white border-none flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-accent mb-6">
                  <Star fill="currentColor" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Why AI Recommendations?</h3>
                <ul className="space-y-4">
                  {[
                    'Based on verified clinical BMR data',
                    'Adapts to your food preferences',
                    'Includes macro-perfect caloric balance',
                    'Cultural and regional food support'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center space-x-3 text-white/70">
                      <ArrowRight size={16} className="text-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-white/40 text-xs mt-8">Powered by Gemini 3 Flash Pro for elite reasoning.</p>
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
