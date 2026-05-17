import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Target, Award, PieChart, Activity, ExternalLink } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart as RechartsPie, Pie, Cell } from 'recharts';
import { format, subDays } from 'date-fns';
import { getUserGoals, getRecentLogs, UserGoals, DailyLog } from '../lib/db';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7 Days');
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [goals, setGoals] = useState<UserGoals | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const days = timeRange === '7 Days' ? 7 : timeRange === '30 Days' ? 30 : 90;
        const [fetchedLogs, fetchedGoals] = await Promise.all([
          getRecentLogs(days),
          getUserGoals()
        ]);
        setLogs(fetchedLogs);
        setGoals(fetchedGoals);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [timeRange]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Derived Data
  const weightData = logs.filter(l => l.weight).map(l => ({
    date: format(new Date(l.date), 'MMM d'),
    weight: l.weight
  }));

  const nutritionData = logs.map(l => ({
    name: format(new Date(l.date), 'EEE'),
    protein: l.protein,
    carbs: l.carbs,
    fat: l.fat
  }));

  const totalProtein = logs.reduce((sum, l) => sum + (l.protein || 0), 0);
  const totalCarbs = logs.reduce((sum, l) => sum + (l.carbs || 0), 0);
  const totalFat = logs.reduce((sum, l) => sum + (l.fat || 0), 0);
  const totalMacros = totalProtein + totalCarbs + totalFat || 1; // avoid div by 0

  const macroData = [
    { name: 'Protein', value: Math.round((totalProtein / totalMacros) * 100) || 0, color: 'var(--color-primary)' },
    { name: 'Carbs', value: Math.round((totalCarbs / totalMacros) * 100) || 0, color: '#10b981' },
    { name: 'Fats', value: Math.round((totalFat / totalMacros) * 100) || 0, color: 'var(--color-accent)' },
  ];

  // Simple Consistency Score logic (0-100)
  const consistencyScore = logs.length > 0 ? Math.min(100, Math.round((logs.filter(l => l.calories > 0).length / logs.length) * 100)) : 0;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Advanced Analytics</h1>
          <p className="text-slate-500">Deeper insights into your biological trends and adherence.</p>
        </div>
        <div className="flex bg-white dark:bg-[#1A1A1A] rounded-xl p-1 border border-black/5 dark:border-white/5">
           {['7 Days', '30 Days', '90 Days'].map((tab) => (
             <button key={tab} 
                onClick={() => setTimeRange(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${timeRange === tab ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-[#111111]'}`}>
               {tab}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weight Trend */}
        <div className="lg:col-span-2 glass-card p-8">
           <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold">Weight Trajectory</h3>
                <p className="text-sm text-slate-500">Track your progress over time</p>
              </div>
           </div>
           <div className="h-72 w-full">
              {weightData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={weightData}>
                      <defs>
                         <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                      <YAxis domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="weight" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                   </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">Not enough weight data to show chart.</div>
              )}
           </div>
        </div>

        {/* Macro Distribution */}
        <div className="glass-card p-8 flex flex-col items-center">
           <h3 className="text-xl font-bold mb-8 w-full">Average Macro Split</h3>
           <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                 <RechartsPie>
                    <Pie
                       data={macroData}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={5}
                       dataKey="value"
                    >
                       {macroData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Pie>
                    <Tooltip />
                 </RechartsPie>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <PieChart size={32} className="text-slate-300 dark:text-slate-600" />
              </div>
           </div>
           <div className="w-full space-y-4 mt-4">
              {macroData.map((macro) => (
                <div key={macro.name} className="flex justify-between items-center">
                   <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: macro.color }} />
                      <span className="font-bold text-sm">{macro.name}</span>
                   </div>
                   <span className="font-bold">{macro.value}%</span>
                </div>
              ))}
           </div>
        </div>

        {/* Consistency Score */}
        <div className="glass-card p-8 bg-[#1A1A1A] text-white border-none lg:col-span-1">
           <div className="flex flex-col h-full justify-between">
              <div>
                 <Award className="text-accent mb-4" size={40} />
                 <h3 className="text-2xl font-bold mb-2">Consistency Score</h3>
                 <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                   Based on your meal logging frequency over the selected time range.
                 </p>
                 <div className="text-7xl font-display font-bold text-cream">{consistencyScore}<span className="text-3xl opacity-50">/100</span></div>
              </div>
           </div>
        </div>

        {/* Daily Macros Multi-Line Chart */}
        <div className="lg:col-span-2 glass-card p-8">
           <h3 className="text-xl font-bold mb-8">Macro Precision Tracking</h3>
           <div className="h-72 w-full">
             {nutritionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={nutritionData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#888'}} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', background: 'var(--color-cream)', color: '#1A1A1A' }} />
                    <Line type="monotone" dataKey="protein" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="carbs" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="fat" stroke="var(--color-accent)" strokeWidth={3} dot={{ r: 4 }} />
                 </LineChart>
              </ResponsiveContainer>
             ) : (
                <div className="flex items-center justify-center h-full text-slate-400">No nutrition data available.</div>
             )}
           </div>
           <div className="flex justify-center space-x-8 mt-6">
              <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-[var(--color-primary)]"/> <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Protein</span></div>
              <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-emerald-500"/> <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Carbs</span></div>
              <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-[var(--color-accent)]"/> <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Fat</span></div>
           </div>
        </div>
      </div>
      
      <div className="glass-card p-8 bg-[#111111] text-white border-none flex flex-col md:flex-row items-center justify-between">
         <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold mb-2 text-cream">Performance Report</h3>
            <p className="text-slate-400">Your comprehensive biological report is available for export.</p>
         </div>
         <button className="flex items-center space-x-2 bg-cream text-black px-8 py-4 rounded-2xl font-bold hover:bg-white transition-colors">
            <ExternalLink size={20} />
            <span>Download PDF</span>
         </button>
      </div>
    </div>
  );
};

export default Analytics;
