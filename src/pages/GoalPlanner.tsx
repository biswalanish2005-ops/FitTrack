import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Calculator, User, Weight, Ruler, Clock, Activity, Target, BrainCircuit, Loader2 } from 'lucide-react';
import { auth } from '../lib/firebase';
import { updateUserGoals, getUserGoals, UserGoals } from '../lib/db';

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
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const goals = await getUserGoals();
        if (goals) {
          setFormData(prev => ({
            ...prev,
            weight: goals.startingWeight || prev.weight,
            goalWeight: goals.targetWeight || prev.goalWeight,
          }));
        }
      } catch (err) {
        console.error("Failed to load goals", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGoals();
  }, []);

  const calculate = async () => {
    setIsSaving(true);
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
    const fat = Math.round((tdee * 0.25) / 9); // 25% of calories from fat
    
    const weightToLose = formData.weight - formData.goalWeight;
    const weeklyDeficit = (weightToLose > 0) ? 500 : 0;
    const targetCals = tdee - weeklyDeficit;
    
    const carbs = Math.round((targetCals - (protein * 4) - (fat * 9)) / 4);

    const resultData = {
      ...formData,
      bmr: Math.round(bmr),
      tdee,
      targetCals,
      protein,
      carbs,
      fat,
      deficit: weeklyDeficit,
    };

    setResults(resultData);

    // PERSIST TO FIRESTORE via db utils
    if (auth.currentUser) {
      try {
        const newGoals: Partial<UserGoals> = {
          targetCalories: targetCals,
          targetProtein: protein,
          targetCarbs: carbs,
          targetFat: fat,
          targetWeight: formData.goalWeight,
          startingWeight: formData.weight,
          targetWater: 3, // Default 3L
          targetSteps: 10000,
        };
        await updateUserGoals(newGoals);
      } catch (e) {
        console.error("Error saving goals:", e);
      }
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

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
          className="glass-card p-8"
        >
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2.5 bg-black/5 dark:bg-white/5 rounded-xl text-primary">
              <Calculator size={20} />
            </div>
            <h2 className="text-xl font-bold">Biometric Data</h2>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Weight (kg)</label>
              <div className="relative">
                <Weight className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="number" 
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: +e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-accent focus:outline-none transition-shadow font-medium" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Goal Weight</label>
              <div className="relative">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                   type="number" 
                   value={formData.goalWeight}
                  onChange={(e) => setFormData({...formData, goalWeight: +e.target.value})}
                   className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-accent focus:outline-none transition-shadow font-medium" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Height (cm)</label>
              <div className="relative">
                <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="number" 
                   value={formData.height}
                  onChange={(e) => setFormData({...formData, height: +e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-accent focus:outline-none transition-shadow font-medium" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Age</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="number" 
                   value={formData.age}
                  onChange={(e) => setFormData({...formData, age: +e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-accent focus:outline-none transition-shadow font-medium" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Activity Level</label>
              <select 
                value={formData.activity}
                onChange={(e) => setFormData({...formData, activity: e.target.value})}
                className="w-full px-4 py-3.5 bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-accent focus:outline-none font-medium"
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
              disabled={isSaving}
              className="w-full py-4 bg-primary text-cream text-lg font-bold rounded-2xl hover:bg-primary-dark transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg flex items-center justify-center space-x-2"
            >
              {isSaving ? <Loader2 className="animate-spin" size={24} /> : <span>Analyze Metrics</span>}
            </button>
          </div>
        </motion.div>

        {/* Results */}
        <div className="flex flex-col justify-center">
          {results ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="glass-card p-10 bg-[#1A1A1A] text-white border-none shadow-[0_20px_40px_rgb(0,0,0,0.15)] relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                <h3 className="text-sm font-bold text-accent uppercase tracking-widest mb-4">Recommended Intake</h3>
                <div className="flex items-baseline space-x-3 mb-8">
                  <span className="text-6xl font-display font-bold text-cream">{results.targetCals}</span>
                  <span className="text-xl opacity-60">kcal / day</span>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Maintenance</div>
                    <div className="text-2xl font-bold">{results.tdee} kcal</div>
                  </div>
                  <div>
                    <div className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Target Protein</div>
                    <div className="text-2xl font-bold">{results.protein}g</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <Activity className="text-accent mb-4" size={24} />
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Basal Met. Rate</div>
                  <div className="text-2xl font-bold text-primary">{results.bmr} <span className="text-sm text-slate-400 font-medium">kcal</span></div>
                </div>
                <div className="glass-card p-6">
                  <BrainCircuit className="text-primary mb-4" size={24} />
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Daily Deficit</div>
                  <div className="text-2xl font-bold text-primary">{results.deficit} <span className="text-sm text-slate-400 font-medium">kcal</span></div>
                </div>
              </div>
              
              <div className="p-5 bg-accent/5 border border-accent/20 rounded-2xl">
                <p className="text-primary dark:text-cream font-medium text-center text-sm">
                  Consistency with this plan will lead to <strong>{formData.goalWeight}kg</strong> within approx. 10 weeks.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-30">
               <Calculator size={80} className="mb-6 text-slate-400" />
               <p className="text-xl font-medium text-slate-500">Enter your data to see analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalPlanner;
