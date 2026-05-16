import React from 'react';
import { motion } from 'motion/react';
import { Calculator, User, Weight, Ruler, Clock, Activity, Target, BrainCircuit } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const GoalPlanner = () => {
  const [formData, setFormData] = React.useState({
    weight: 80,
    goalWeight: 75,
    height: 180,
    age: 28,
    gender: 'male',
    activity: 'moderate',
    timeline: '12',
  });

  const [results, setResults] = React.useState<any>(null);

  const calculate = async () => {
    // Simple BMR Harris-Benedict Equation
    let bmr = 0;
    if (formData.gender === 'male') {
      bmr = 88.362 + (13.397 * formData.weight) + (4.799 * formData.height) - (5.677 * formData.age);
    } else {
      bmr = 447.593 + (9.247 * formData.weight) + (3.098 * formData.height) - (4.330 * formData.age);
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const tdee = Math.round(bmr * (activityMultipliers as any)[formData.activity]);
    const protein = Math.round(formData.weight * 2.1);
    
    const weightToLose = formData.weight - formData.goalWeight;
    const weeklyDeficit = (weightToLose > 0) ? 500 : 0;
    const targetCals = tdee - weeklyDeficit;

    const resultData = {
      ...formData,
      bmr: Math.round(bmr),
      tdee,
      targetCals,
      protein,
      deficit: weeklyDeficit,
      updatedAt: new Date().toISOString(),
      userId: auth.currentUser?.uid
    };

    setResults(resultData);

    // PERSIST TO FIRESTORE
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'goals', auth.currentUser.uid), resultData);
        console.log("Goals saved to Firestore!");
      } catch (e) {
        console.error("Error saving goals:", e);
      }
    }
  };

  return (
    <div className="space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-display font-bold mb-4">Precision Goal Planner</h1>
        <p className="text-slate-500 text-lg">Calculate your biometric baseline and define your roadmap to peak performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8 rounded-[2rem]"
        >
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Calculator size={20} />
            </div>
            <h2 className="text-xl font-bold">Biometric Data</h2>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Weight (kg)</label>
              <div className="relative">
                <Weight className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="number" 
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: +e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Goal Weight (kg)</label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                   type="number" 
                   value={formData.goalWeight}
                  onChange={(e) => setFormData({...formData, goalWeight: +e.target.value})}
                   className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Height (cm)</label>
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="number" 
                   value={formData.height}
                  onChange={(e) => setFormData({...formData, height: +e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Age</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="number" 
                   value={formData.age}
                  onChange={(e) => setFormData({...formData, age: +e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase">Activity Level</label>
              <select 
                value={formData.activity}
                onChange={(e) => setFormData({...formData, activity: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="sedentary">Sedentary (Office job)</option>
                <option value="light">Lightly Active (1-2 days/week)</option>
                <option value="moderate">Moderately Active (3-5 days/week)</option>
                <option value="active">Very Active (6-7 days/week)</option>
                <option value="veryActive">Elite Athlete</option>
              </select>
            </div>

            <button 
              onClick={calculate}
              className="w-full py-4 bg-primary text-white text-lg font-bold rounded-2xl hover:bg-primary-dark transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20"
            >
              Analyze Metrics
            </button>
          </div>
        </motion.div>

        {/* Results */}
        <div className="flex flex-col justify-center">
          {results ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="glass-card p-10 rounded-[2.5rem] bg-gradient-to-br from-primary to-blue-600 text-white border-none shadow-2xl relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <h3 className="text-lg font-bold text-white/70 uppercase tracking-widest mb-2">Recommended Daily Intake</h3>
                <div className="flex items-baseline space-x-3 mb-8">
                  <span className="text-6xl font-display font-bold">{results.targetCals}</span>
                  <span className="text-xl opacity-80">kcal / day</span>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-white/60 text-sm font-bold uppercase mb-1">Maintenance</div>
                    <div className="text-2xl font-bold">{results.tdee} kcal</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm font-bold uppercase mb-1">Target Protein</div>
                    <div className="text-2xl font-bold">{results.protein}g</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="glass-card p-6 rounded-3xl">
                  <Activity className="text-primary mb-3" />
                  <div className="text-sm font-bold text-slate-500 uppercase">Basal Met. Rate</div>
                  <div className="text-2xl font-bold">{results.bmr} kcal</div>
                </div>
                <div className="glass-card p-6 rounded-3xl">
                  <BrainCircuit className="text-accent mb-3" />
                  <div className="text-sm font-bold text-slate-500 uppercase">Daily Deficit</div>
                  <div className="text-2xl font-bold">{results.deficit} kcal</div>
                </div>
              </div>
              
              <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-3xl">
                <p className="text-green-600 dark:text-green-400 font-medium text-center">
                  Consistency with this plan will lead to <strong>{formData.goalWeight}kg</strong> within approx. 10 weeks.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-30">
               <Calculator size={80} className="mb-4" />
               <p className="text-xl font-medium">Enter your data to see analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalPlanner;
