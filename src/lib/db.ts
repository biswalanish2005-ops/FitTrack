import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, orderBy, limit, Timestamp, writeBatch } from 'firebase/firestore';
import { db, auth } from './firebase';

export interface UserGoals {
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetWater: number;
  targetSteps: number;
  targetWeight: number;
  startingWeight: number;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  steps: number;
  weight?: number;
}

// Fetch user goals
export const getUserGoals = async (): Promise<UserGoals | null> => {
  if (!auth.currentUser) return null;
  const docRef = doc(db, 'users', auth.currentUser.uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().goals as UserGoals;
  }
  return null;
};

// Update user goals
export const updateUserGoals = async (goals: Partial<UserGoals>) => {
  if (!auth.currentUser) return;
  const docRef = doc(db, 'users', auth.currentUser.uid);
  await setDoc(docRef, { goals }, { merge: true });
};

// Get a specific day's log
export const getDailyLog = async (dateStr: string): Promise<DailyLog | null> => {
  if (!auth.currentUser) return null;
  const docRef = doc(db, `users/${auth.currentUser.uid}/dailyLogs`, dateStr);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as DailyLog;
  }
  return null;
};

// Update a specific day's log
export const updateDailyLog = async (dateStr: string, logUpdate: Partial<DailyLog>) => {
  if (!auth.currentUser) return;
  const docRef = doc(db, `users/${auth.currentUser.uid}/dailyLogs`, dateStr);
  
  // ensure the doc exists or create it
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    const newLog: DailyLog = {
      date: dateStr,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      water: 0,
      steps: 0,
      ...logUpdate
    };
    await setDoc(docRef, newLog);
  } else {
    await updateDoc(docRef, logUpdate);
  }
};

// Get recent daily logs for analytics
export const getRecentLogs = async (days: number): Promise<DailyLog[]> => {
  if (!auth.currentUser) return [];
  const logsRef = collection(db, `users/${auth.currentUser.uid}/dailyLogs`);
  const q = query(logsRef, orderBy('date', 'desc'), limit(days));
  const querySnapshot = await getDocs(q);
  
  const logs: DailyLog[] = [];
  querySnapshot.forEach((doc) => {
    logs.push(doc.data() as DailyLog);
  });
  
  return logs.reverse(); // Return in chronological order
};
