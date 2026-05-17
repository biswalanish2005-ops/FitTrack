import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Flame, Droplets, Target, Calendar, TrendingUp, ChevronRight, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import DailyMotivation from '../components/DailyMotivation';
import { useAuth } from '../context/AuthContext';
import { getUserGoals, getDailyLog, getRecentLogs, UserGoals, DailyLog } from '../lib/db';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<UserGoals | null>(null);
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [recentLogs, setRecentLogs] = useState<DailyLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fetchedGoals, fetchedDaily, fetchedRecent] = await Promise.all([
          getUserGoals(),
          getDailyLog(todayStr),
          getRecentLogs(7)
        ]);
        setGoals(fetchedGoals);
        setDailyLog(fetchedDaily);
        setRecentLogs(fetchedRecent);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [todayStr]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Format data for chart
  const chartData = recentLogs.length > 0 ? recentLogs.map(log => ({
    name: format(new Date(log.date), 'EEE'),
    cal: log.calories || 0
  })) : [
    { name: 'Mon', cal: 0 }, { name: 'Tue', cal: 0 }, { name: 'Wed', cal: 0 },
    { name: 'Thu', cal: 0 }, { name: 'Fri', cal: 0 }, { name: 'Sat', cal: 0 }, { name: 'Sun', cal: 0 }
  ];

  const defaultGoals: UserGoals = { targetCalories: 2000, targetProtein: 150, targetCarbs: 200, targetFat: 65, targetWater: 3, targetSteps: 10000, targetWeight: 75, startingWeight: 80 };
  const activeGoals = goals || defaultGoals;

  const currentLog = dailyLog || { calories: 0, protein: 0, carbs: 0, fat: 0, water: 0, steps: 0, date: todayStr };

  const stats = [
    { label: 'Calories', value: currentLog.calories.toLocaleString(), target: activeGoals.targetCalories.toLocaleString(), unit: 'kcal', icon: Flame, color: 'text-accent' },
    { label: 'Protein', value: currentLog.protein.toString(), target: activeGoals.targetProtein.toString(), unit: 'g', icon: Activity, color: 'text-primary' },
    { label: 'Water', value: currentLog.water.toString(), target: activeGoals.targetWater.toString(), unit: 'L', icon: Droplets, color: 'text-blue-500' },
    { label: 'Steps', value: currentLog.steps.toLocaleString(), target: activeGoals.targetSteps.toLocaleString(), unit: '', icon: TrendingUp, color: 'text-green-500' },
  ];

  const goalProgress = activeGoals.startingWeight && activeGoals.targetWeight && currentLog.weight
    ? Math.max(0, Math.min(100, ((activeGoals.startingWeight - currentLog.weight) / (activeGoals.startingWeight - activeGoals.targetWeight)) * 100))
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Hello, {user?.displayName?.split(' ')[0] || 'Fitness Pro'}! 👋</h1>
          <p className="text-slate-500 dark:text-slate-400">Here's your fitness update for today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-white dark:bg-[#1A1A1A] border border-black/5 dark:border-white/5 px-4 py-2 rounded-xl">
            <Calendar size={18} className="mr-2 text-primary" />
            <span className="font-medium">{format(new Date(), 'MMM d, yyyy')}</span>
          </div>
          <Link to="/tracker" className="flex items-center bg-primary text-white px-4 py-2 rounded-xl font-bold hover:bg-primary-dark transition-colors">
            <Plus size={18} className="mr-1" />
            Log Meal
          </Link>
        </div>
      </div>

      <DailyMotivation />

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-slate-50 dark:bg-black/20 shadow-sm ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Goal: {stat.target}{stat.unit}</span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-bold">{stat.value}</span>
              <span className="text-sm font-medium text-slate-500">{stat.unit}</span>
            </div>
            <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
            <div className="mt-4 w-full h-2 bg-slate-100 dark:bg-black/20 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${Math.min(100, (parseInt(stat.value.replace(/,/g, '')) / parseInt(stat.target.replace(/,/g, ''))) * 100)}%` }}
                 className={`h-full bg-primary rounded-full transition-all duration-1000`} 
               />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Weekly Calorie Consumption</h3>
            <Link to="/analytics" className="text-primary font-bold text-sm flex items-center hover:underline">
              View History <ChevronRight size={16} />
            </Link>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <RechartsTooltip 
                  cursor={{fill: 'rgba(0,0,0,0.05)'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', background: 'var(--color-cream)', color: '#1A1A1A' }}
                />
                <Bar dataKey="cal" fill="var(--color-primary)" radius={[6, 6, 6, 6]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goal Card */}
        <div className="glass-card p-6 bg-gradient-to-br from-primary/5 to-accent/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target size={120} className="text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-6">Goal Progress</h3>
          <div className="relative w-40 h-40 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                className="text-slate-200 dark:text-black/20"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={440}
                initial={{ strokeDashoffset: 440 }}
                animate={{ strokeDashoffset: 440 - (440 * (goalProgress / 100)) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-accent"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">{Math.round(goalProgress)}%</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center px-4 leading-tight mt-1">Completion</span>
            </div>
          </div>
          <p className="text-center text-slate-500 text-sm mb-6">Keep logging your meals and weight to track your progress.</p>
          <Link to="/progress" className="block text-center w-full bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 py-3 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-[#1a1a1a] transition-colors shadow-sm">
            View Journey
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

