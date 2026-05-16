import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Target, Award, PieChart, Activity, ExternalLink } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart as RechartsPie, Pie, Cell } from 'recharts';

const Analytics = () => {
  const weightData = [
    { date: 'May 1', weight: 82.5 },
    { date: 'May 4', weight: 82.2 },
    { date: 'May 8', weight: 81.8 },
    { date: 'May 12', weight: 81.5 },
    { date: 'May 16', weight: 81.2 },
  ];

  const nutritionData = [
    { name: 'Mon', protein: 140, carbs: 250, fat: 75 },
    { name: 'Tue', protein: 160, carbs: 220, fat: 70 },
    { name: 'Wed', protein: 155, carbs: 240, fat: 80 },
    { name: 'Thu', protein: 165, carbs: 200, fat: 65 },
    { name: 'Fri', protein: 150, carbs: 260, fat: 85 },
    { name: 'Sat', protein: 130, carbs: 300, fat: 90 },
    { name: 'Sun', protein: 165, carbs: 210, fat: 60 },
  ];

  const macroData = [
    { name: 'Protein', value: 35, color: '#3b82f6' },
    { name: 'Carbs', value: 45, color: '#10b981' },
    { name: 'Fats', value: 20, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Advanced Analytics</h1>
          <p className="text-slate-500">Deeper insights into your biological trends and adherence.</p>
        </div>
        <div className="flex bg-white dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-800">
           {['7 Days', '30 Days', '90 Days', 'All Time'].map((tab) => (
             <button key={tab} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab === '7 Days' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
               {tab}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weight Trend */}
        <div className="lg:col-span-2 glass-card p-8 rounded-[2.5rem]">
           <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold">Weight Trajectory</h3>
                <p className="text-sm text-slate-500">Losing ~0.4kg / week average</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-display font-bold text-primary">-1.3kg</span>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last 15 days</p>
              </div>
           </div>
           <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={weightData}>
                    <defs>
                       <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Macro Distribution */}
        <div className="glass-card p-8 rounded-[2.5rem] flex flex-col items-center">
           <h3 className="text-xl font-bold mb-8 w-full">Macro Composition</h3>
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
                 <PieChart size={32} className="text-slate-300" />
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
        <div className="glass-card p-8 rounded-[2.5rem] bg-indigo-900 text-white border-none lg:col-span-1">
           <div className="flex flex-col h-full justify-between">
              <div>
                 <Award className="text-yellow-400 mb-4" size={40} />
                 <h3 className="text-2xl font-bold mb-2">Consistency Score</h3>
                 <p className="text-indigo-200 text-sm mb-8 leading-relaxed">
                   Based on your meal logging frequency and macro accuracy over the last 30 days.
                 </p>
                 <div className="text-7xl font-display font-bold">92<span className="text-3xl opacity-50">/100</span></div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                 <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-900 bg-indigo-500 flex items-center justify-center text-[10px] font-bold">A</div>)}
                 </div>
                 <span className="text-xs uppercase font-bold tracking-widest text-indigo-300">Top 5% of Users</span>
              </div>
           </div>
        </div>

        {/* Daily Macros Multi-Line Chart */}
        <div className="lg:col-span-2 glass-card p-8 rounded-[2.5rem]">
           <h3 className="text-xl font-bold mb-8">Macro Precision Tracking</h3>
           <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={nutritionData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                    <Line type="monotone" dataKey="protein" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="carbs" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="fat" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                 </LineChart>
              </ResponsiveContainer>
           </div>
           <div className="flex justify-center space-x-8 mt-6">
              <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-blue-500"/> <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Protein</span></div>
              <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-green-500"/> <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Carbs</span></div>
              <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-yellow-500"/> <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Fat</span></div>
           </div>
        </div>
      </div>
      
      <div className="glass-card p-8 rounded-[2.5rem] bg-slate-900 text-white border-none flex flex-col md:flex-row items-center justify-between">
         <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold mb-2">Monthly Performance Report</h3>
            <p className="text-slate-400">Your comprehensive biological report for May is now available for export.</p>
         </div>
         <button className="flex items-center space-x-2 bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-colors">
            <ExternalLink size={20} />
            <span>Download PDF</span>
         </button>
      </div>
    </div>
  );
};

export default Analytics;
