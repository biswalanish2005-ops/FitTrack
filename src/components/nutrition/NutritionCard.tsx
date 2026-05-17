import React from 'react';
import { PlusCircle } from 'lucide-react';
import { NutritionData } from '../../lib/nutritionApi';

interface NutritionCardProps {
  item: NutritionData;
  onAdd: (item: NutritionData) => void;
}

export const NutritionCard: React.FC<NutritionCardProps> = ({ item, onAdd }) => {
  return (
    <div className="bg-white/50 dark:bg-[#1A1A1A]/50 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-2xl p-4 flex flex-col hover:border-accent/30 transition-all shadow-sm hover:shadow-md group">
      <div className="flex justify-between items-start mb-3">
        <div className="pr-4">
          <h3 className="font-semibold text-lg text-primary line-clamp-1">{item.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.servingSize} • {item.source}</p>
        </div>
        <button 
          onClick={() => onAdd(item)}
          className="text-accent hover:text-accent/80 transition-colors p-1.5 rounded-full hover:bg-accent/10 md:opacity-0 group-hover:opacity-100 flex-shrink-0"
        >
          <PlusCircle size={22} />
        </button>
      </div>
      
      <div className="mt-auto grid grid-cols-4 gap-2">
        <div className="bg-slate-50 dark:bg-black/20 px-2 py-2 rounded-xl flex flex-col items-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Cals</span>
          <span className="text-sm font-bold text-accent">{Math.round(item.calories)}</span>
        </div>
        <div className="bg-slate-50 dark:bg-black/20 px-2 py-2 rounded-xl flex flex-col items-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Pro</span>
          <span className="text-sm font-bold text-primary">{Math.round(item.protein)}g</span>
        </div>
        <div className="bg-slate-50 dark:bg-black/20 px-2 py-2 rounded-xl flex flex-col items-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Carbs</span>
          <span className="text-sm font-bold text-emerald-500">{Math.round(item.carbs)}g</span>
        </div>
        <div className="bg-slate-50 dark:bg-black/20 px-2 py-2 rounded-xl flex flex-col items-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Fat</span>
          <span className="text-sm font-bold text-blue-500">{Math.round(item.fat)}g</span>
        </div>
      </div>
    </div>
  );
};

