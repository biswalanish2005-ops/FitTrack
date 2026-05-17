import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, setDoc, doc, limit } from 'firebase/firestore';
import { NutritionData } from '../../lib/nutritionApi';
import { NutritionCard } from './NutritionCard';

interface FoodSearchProps {
  onAddFood: (item: NutritionData) => void;
}

export const FoodSearch: React.FC<FoodSearchProps> = ({ onAddFood }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 600);
  const [results, setResults] = useState<NutritionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedSearch.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // 1. Check Firestore Cache (simple prefix match)
        const searchPrefix = debouncedSearch.charAt(0).toUpperCase() + debouncedSearch.slice(1);
        
        const foodsRef = collection(db, 'foods');
        const cacheQuery = query(
          foodsRef, 
          where('name', '>=', searchPrefix), 
          where('name', '<=', searchPrefix + '\uf8ff'),
          limit(10)
        );
        
        const querySnapshot = await getDocs(cacheQuery);
        let cachedFoods: NutritionData[] = [];
        
        querySnapshot.forEach((docSnap) => {
          cachedFoods.push(docSnap.data() as NutritionData);
        });

        // Use cache if we found a good amount of results
        if (cachedFoods.length >= 3) {
          setResults(cachedFoods);
          setLoading(false);
          return;
        }

        // 2. Fetch from USDA API if cache is insufficient
        const response = await fetch(`/api/nutrition/search?q=${encodeURIComponent(debouncedSearch)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch from USDA API');
        }
        
        const apiFoods: NutritionData[] = await response.json();

        // 3. Save new results to Firestore Cache
        const topResults = apiFoods.slice(0, 5);
        for (const food of topResults) {
          try {
            await setDoc(doc(db, 'foods', food.id), {
              ...food,
              createdAt: new Date().toISOString()
            }, { merge: true });
          } catch (e) {
            console.error("Cache save error:", e);
          }
        }

        setResults(apiFoods);

      } catch (err: any) {
        console.error("Search error:", err);
        setError("Failed to search foods. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearch]);

  return (
    <div className="w-full flex flex-col gap-4 relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search foods (e.g. Apple, Chicken Breast)..."
          className="block w-full pl-12 pr-4 py-4 border border-black/5 dark:border-white/5 rounded-2xl bg-white dark:bg-[#1A1A1A] text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent sm:text-sm transition-all shadow-sm"
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <Loader2 className="h-5 w-5 text-accent animate-spin" />
          </div>
        )}
      </div>

      {error && (
        <div className="text-rose-500 text-sm px-4 py-3 bg-rose-50 rounded-xl border border-rose-100">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="absolute top-[110%] left-0 right-0 z-50 bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-2xl shadow-[0_20px_40px_rgb(0,0,0,0.08)] overflow-hidden flex flex-col max-h-[400px]">
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 custom-scrollbar">
            {results.map((item) => (
              <NutritionCard key={item.id} item={item} onAdd={(item) => {
                setSearchTerm('');
                setResults([]);
                onAddFood(item);
              }} />
            ))}
          </div>
        </div>
      )}

      {debouncedSearch && !loading && results.length === 0 && !error && (
        <div className="absolute top-[110%] left-0 right-0 z-50 bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-2xl shadow-[0_20px_40px_rgb(0,0,0,0.08)] p-6 text-center text-slate-500">
          No foods found for "{debouncedSearch}". Try a different search.
        </div>
      )}
    </div>
  );
};
