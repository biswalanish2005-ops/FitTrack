import React from 'react';
import { motion } from 'motion/react';
import { Activity, Flame, Droplets, Target, Calendar, TrendingUp, ChevronRight, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import DailyMotivation from '../components/DailyMotivation';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const data = [
    { name: 'Mon', cal: 2100 },
    { name: 'Tue', cal: 2300 },
    { name: 'Wed', cal: 1950 },
    { name: 'Thu', cal: 2400 },
    { name: 'Fri', cal: 2200 },
    { name: 'Sat', cal: 2600 },
    { name: 'Sun', cal: 2100 },
  ];

  const weightData = [
    { date: '1 May', weight: 82.5 },
    { date: '8 May', weight: 81.8 },
    { date: '15 May', weight: 81.2 },
  ];

  const stats = [
    { label: 'Calories', value: '1,840', target: '2,400', unit: 'kcal', icon: Flame, color: 'text-orange-500' },
    { label: 'Protein', value: '125', target: '165', unit: 'g', icon: Activity, color: 'text-blue-500' },
    { label: 'Water', value: '2.5', target: '4.0', unit: 'L', icon: Droplets, color: 'text-cyan-500' },
    { label: 'Steps', value: '8,420', target: '10,000', unit: '', icon: TrendingUp, color: 'text-green-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Hello, {user?.displayName?.split(' ')[0] || 'Fitness Pro'}! 👋</h1>
          <p className="text-slate-500">Here's your fitness update for today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl">
            <Calendar size={18} className="mr-2 text-primary" />
            <span className="font-medium">May 16, 2026</span>
          </div>
          <button className="flex items-center bg-primary text-white px-4 py-2 rounded-xl font-bold hover:bg-primary-dark transition-colors">
            <Plus size={18} className="mr-1" />
            Log Meal
          </button>
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
            className="glass-card p-6 rounded-3xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Goal: {stat.target}{stat.unit}</span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-bold">{stat.value}</span>
              <span className="text-sm font-medium text-slate-500">{stat.unit}</span>
            </div>
            <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
            <div className="mt-4 w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: parseInt(stat.value.replace(',', '')) / parseInt(stat.target.replace(',', '')) * 100 + '%' }}
                 className={`h-full bg-primary rounded-full transition-all duration-1000`} 
               />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Weekly Calorie Consumption</h3>
            <button className="text-primary font-bold text-sm flex items-center">
              View History <ChevronRight size={16} />
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="cal" fill="#3b82f6" radius={[4, 4, 4, 4]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goal Card */}
        <div className="glass-card p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 border-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target size={120} />
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
                className="text-slate-200 dark:text-slate-800"
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
                animate={{ strokeDashoffset: 440 - (440 * 0.65) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-primary"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">65%</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center px-4 leading-tight">Remaining 5.2kg</span>
            </div>
          </div>
          <p className="text-center text-slate-500 text-sm mb-6">You're losing roughly 0.6kg per week. Keep it up!</p>
          <button className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-3 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
            View Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
