import React from 'react';
import { motion } from 'motion/react';
import { Search, Plus, Trash2, Salad, Coffee, UtensilsCrossed, Apple, History } from 'lucide-react';

const NutritionTracker = () => {
  const [activeTab, setActiveTab] = React.useState('breakfast');

  const meals = {
    breakfast: [
      { name: 'Oatmeal with Almonds', cal: 320, pro: 12, carb: 45, fat: 8 },
      { name: 'Black Coffee', cal: 5, pro: 0, carb: 1, fat: 0 },
    ],
    lunch: [
      { name: 'Grilled Chicken Salad', cal: 450, pro: 35, carb: 15, fat: 22 },
    ],
    dinner: [],
    snack: [
      { name: 'Greek Yogurt', cal: 150, pro: 15, carb: 8, fat: 4 },
    ],
  };

  const tabs = [
    { id: 'breakfast', label: 'Breakfast', icon: Coffee },
    { id: 'lunch', label: 'Lunch', icon: UtensilsCrossed },
    { id: 'dinner', label: 'Dinner', icon: Salad },
    { id: 'snack', label: 'Snack', icon: Apple },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Nutrition Tracker</h1>
          <p className="text-slate-500">Log your meals and monitor macros.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search 10,000+ foods..." 
            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 rounded-3xl">
             <h3 className="text-lg font-bold mb-6 flex items-center">
                <History className="mr-2 text-primary" size={20} />
                Daily Breakdown
             </h3>
             <div className="space-y-4">
                {[
                  { label: 'Calories', current: 925, max: 2400, unit: 'kcal', color: 'bg-orange-500' },
                  { label: 'Protein', current: 62, max: 165, unit: 'g', color: 'bg-blue-500' },
                  { label: 'Carbs', current: 69, max: 280, unit: 'g', color: 'bg-green-500' },
                  { label: 'Fats', current: 34, max: 80, unit: 'g', color: 'bg-yellow-500' },
                ].map((macro, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{macro.label}</span>
                      <span className="text-slate-500">{macro.current} / {macro.max} {macro.unit}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${macro.color} rounded-full`} 
                        style={{ width: `${(macro.current / macro.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
             </div>
             <button className="w-full mt-6 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-2 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
               Detailed Report
             </button>
          </div>
          
          <div className="glass-card p-6 rounded-3xl bg-indigo-600 text-white border-none">
             <h4 className="font-bold mb-2">Pro Tip</h4>
             <p className="text-white/80 text-sm">Drinking 500ml of water before every meal can increase satiety and help with portion control.</p>
          </div>
        </div>

        {/* Meal Logging */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {(meals as any)[activeTab].length > 0 ? (
              (meals as any)[activeTab].map((meal: any, i: number) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className="glass-card p-5 rounded-2xl flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                      <UtensilsCrossed size={20} className="text-slate-500" />
                    </div>
                    <div>
                      <h4 className="font-bold">{meal.name}</h4>
                      <div className="flex space-x-3 mt-1">
                        <span className="text-xs text-slate-500">P: {meal.pro}g</span>
                        <span className="text-xs text-slate-500">C: {meal.carb}g</span>
                        <span className="text-xs text-slate-500">F: {meal.fat}g</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{meal.cal} kcal</span>
                    <button className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-950 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <UtensilsCrossed size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">Nothing logged for {activeTab} yet.</p>
                <button className="mt-4 text-primary font-bold hover:underline">Add Your First Meal</button>
              </div>
            )}
            
            <button className="w-full py-4 rounded-2xl border-2 border-dashed border-primary/20 text-primary font-bold hover:bg-primary/5 transition-all flex items-center justify-center space-x-2">
              <Plus size={20} />
              <span>Add Meal Manually</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionTracker;
