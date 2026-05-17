import React from 'react';
import { motion } from 'motion/react';
import { Search, Plus, Trash2, Salad, Coffee, UtensilsCrossed, Apple, History, ScanBarcode } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { FoodSearch } from '../components/nutrition/FoodSearch';
import { BarcodeScanner } from '../components/nutrition/BarcodeScanner';
import { NutritionData } from '../lib/nutritionApi';

const NutritionTracker = () => {
  const [activeTab, setActiveTab] = React.useState('breakfast');
  const [meals, setMeals] = React.useState<any[]>([]);
  const [showScanner, setShowScanner] = React.useState(false);

  React.useEffect(() => {
    if (!auth.currentUser) return;
    
    const q = query(
      collection(db, 'meals'), 
      where('userId', '==', auth.currentUser.uid),
      orderBy('timestamp', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      setMeals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const handleAddFood = async (item: NutritionData) => {
    if (!auth.currentUser) return;
    await addDoc(collection(db, 'meals'), {
      userId: auth.currentUser.uid,
      name: item.name,
      cal: Math.round(item.calories),
      pro: Math.round(item.protein),
      carb: Math.round(item.carbs),
      fat: Math.round(item.fat),
      category: activeTab,
      date: new Date().toISOString().split('T')[0],
      timestamp: serverTimestamp()
    });
  };

  const addTestMeal = async () => {
    if (!auth.currentUser) return;
    await addDoc(collection(db, 'meals'), {
      userId: auth.currentUser.uid,
      name: 'Sample High Protein Meal',
      cal: 450,
      pro: 35,
      carb: 20,
      fat: 15,
      category: activeTab,
      date: new Date().toISOString().split('T')[0],
      timestamp: serverTimestamp()
    });
  };

  const filteredMeals = meals.filter(m => m.category === activeTab);

  const tabs = [
    { id: 'breakfast', label: 'Breakfast', icon: Coffee },
    { id: 'lunch', label: 'Lunch', icon: UtensilsCrossed },
    { id: 'dinner', label: 'Dinner', icon: Salad },
    { id: 'snack', label: 'Snack', icon: Apple },
  ];

  return (
    <div className="space-y-8 relative">
      {showScanner && (
        <BarcodeScanner 
          onClose={() => setShowScanner(false)} 
          onScanSuccess={(item) => handleAddFood(item)} 
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Nutrition Tracker</h1>
          <p className="text-slate-500">Log your meals and monitor macros.</p>
        </div>
        <div className="flex gap-2 w-full md:w-[400px] z-40 relative items-center">
          <button 
            onClick={() => setShowScanner(true)}
            className="p-4 bg-white dark:bg-[#1A1A1A] rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors border border-black/5 dark:border-white/5 hover:border-accent/30 group shrink-0 shadow-sm"
            title="Scan Barcode"
          >
            <ScanBarcode className="text-primary group-hover:text-accent transition-colors" size={20} />
          </button>
          <div className="flex-1 relative">
            <FoodSearch onAddFood={handleAddFood} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-black/5 dark:border-white/5 shadow-sm">
             <h3 className="text-lg font-bold mb-6 flex items-center text-primary">
                <History className="mr-2 text-accent" size={20} />
                Daily Breakdown
             </h3>
             <div className="space-y-5">
                {[
                  { label: 'Calories', current: 925, max: 2400, unit: 'kcal', color: 'bg-accent' },
                  { label: 'Protein', current: 62, max: 165, unit: 'g', color: 'bg-primary' },
                  { label: 'Carbs', current: 69, max: 280, unit: 'g', color: 'bg-emerald-500' },
                  { label: 'Fats', current: 34, max: 80, unit: 'g', color: 'bg-blue-500' },
                ].map((macro, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                      <span className="text-slate-500">{macro.label}</span>
                      <span className="text-primary">{macro.current} <span className="text-slate-400 font-medium">/ {macro.max} {macro.unit}</span></span>
                    </div>
                    <div className="w-full h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${macro.color} rounded-full`} 
                        style={{ width: `${(macro.current / macro.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
             </div>
             <button className="w-full mt-8 bg-black/5 dark:bg-white/5 text-primary py-3 rounded-xl font-bold text-sm hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
               Detailed Report
             </button>
          </div>
          
          <div className="glass-card p-6 rounded-3xl bg-[#1A1A1A] text-cream border-none shadow-lg">
             <h4 className="font-bold mb-2 text-accent">Pro Tip</h4>
             <p className="text-white/70 text-sm leading-relaxed">Drinking 500ml of water before every meal can increase satiety and help with portion control.</p>
          </div>
        </div>

        {/* Meal Logging */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex space-x-2 overflow-x-auto pb-2 custom-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3.5 rounded-2xl font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id 
                  ? 'bg-primary text-cream shadow-lg scale-[1.02]' 
                  : 'bg-white dark:bg-[#1A1A1A] border border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 text-slate-500'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredMeals.length > 0 ? (
              filteredMeals.map((meal: any, i: number) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={meal.id || i}
                  className="glass-card p-5 rounded-2xl flex items-center justify-between group bg-white dark:bg-[#1A1A1A] border border-black/5 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-black/5 dark:bg-white/5 rounded-xl flex items-center justify-center">
                      <UtensilsCrossed size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary">{meal.name}</h4>
                      <div className="flex space-x-3 mt-1">
                        <span className="text-xs font-medium text-slate-500">Pro: <span className="text-primary font-bold">{meal.pro}g</span></span>
                        <span className="text-xs font-medium text-slate-500">Carbs: <span className="text-emerald-500 font-bold">{meal.carb}g</span></span>
                        <span className="text-xs font-medium text-slate-500">Fat: <span className="text-blue-500 font-bold">{meal.fat}g</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-bold text-lg text-primary">{meal.cal} <span className="text-sm font-medium text-slate-400">kcal</span></span>
                    <button className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-white/50 dark:bg-[#111111]/50 rounded-3xl border-2 border-dashed border-black/10 dark:border-white/10">
                <UtensilsCrossed size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                <p className="text-slate-500 font-medium mb-4">Nothing logged for {activeTab} yet.</p>
                <button onClick={addTestMeal} className="text-accent font-bold hover:text-primary transition-colors">Add Sample Meal</button>
              </div>
            )}
            
            <button 
              onClick={addTestMeal}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-black/10 dark:border-white/10 text-primary font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Custom {activeTab}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionTracker;
