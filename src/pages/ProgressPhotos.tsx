import React from 'react';
import { motion } from 'motion/react';
import { Camera, Image as ImageIcon, Plus, Calendar, History, ArrowRightLeft } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot } from 'firebase/firestore';

const ProgressPhotos = () => {
  const [sliderPos, setSliderPos] = React.useState(50);
  const [isComparing, setIsComparing] = React.useState(false);
  const [photos, setPhotos] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, 'progressPhotos'), where('userId', '==', auth.currentUser.uid));
    return onSnapshot(q, (snapshot) => {
      setPhotos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const addSamplePhoto = async () => {
     if (!auth.currentUser) return;
     await addDoc(collection(db, 'progressPhotos'), {
        userId: auth.currentUser.uid,
        photoUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=400',
        type: 'front',
        date: new Date().toISOString().split('T')[0],
        timestamp: serverTimestamp()
     });
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold mb-4 text-primary">Body Progress Gallery</h1>
          <p className="text-slate-500 text-lg">Securely track your physical transformation over time.</p>
        </div>
        <div className="flex space-x-4">
           <button 
             onClick={() => setIsComparing(!isComparing)}
             className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold transition-all ${isComparing ? 'bg-primary text-cream shadow-lg shadow-primary/20 scale-105' : 'bg-white dark:bg-[#1A1A1A] border border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 text-primary'}`}
           >
              <ArrowRightLeft size={18} />
              <span>Compare Modes</span>
           </button>
           <button className="flex items-center space-x-2 bg-primary text-cream px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-black dark:hover:bg-white dark:hover:text-black transition-colors">
              <Camera size={18} />
              <span>Upload Photo</span>
           </button>
        </div>
      </div>

      {isComparing ? (
        <div className="max-w-4xl mx-auto space-y-6">
           <div className="flex justify-between items-center px-4">
              <div className="text-center">
                 <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Before</div>
                 <div className="font-bold text-primary">Apr 15, 2026</div>
              </div>
              <div className="text-center">
                 <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">After</div>
                 <div className="font-bold text-primary">May 15, 2026</div>
              </div>
           </div>
           
           <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl group cursor-ew-resize border border-black/5 dark:border-white/5">
              {/* After Image */}
              <img 
                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=1200" 
                className="absolute inset-0 w-full h-full object-cover"
                alt="After"
              />
              
              {/* Before Image with Clip */}
              <div 
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                <img 
                   src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200" 
                   className="absolute inset-0 w-full h-full object-cover grayscale"
                   alt="Before"
                />
              </div>

              {/* Slider Line */}
              <div 
                 className="absolute inset-y-0 w-1 bg-white shadow-2xl flex items-center justify-center"
                 style={{ left: `${sliderPos}%` }}
              >
                 <div className="w-12 h-12 bg-white rounded-full shadow-2xl flex flex-col items-center justify-center text-primary">
                    <ArrowRightLeft size={18} />
                 </div>
              </div>

              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sliderPos}
                onChange={(e) => setSliderPos(+e.target.value)}
                className="absolute inset-0 opacity-0 cursor-ew-resize z-20"
              />
           </div>
           <p className="text-center text-slate-500 italic text-sm">Drag the slider to compare before (left) and after (right).</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
           <motion.div 
             whileHover={{ scale: 0.98 }}
             onClick={addSamplePhoto}
             className="aspect-[3/4] border-2 border-dashed border-black/10 dark:border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-slate-400 group cursor-pointer hover:border-primary transition-colors bg-white/50 dark:bg-[#111111]/50"
           >
              <div className="w-16 h-16 bg-white dark:bg-[#1A1A1A] shadow-sm rounded-2xl flex items-center justify-center mb-4 group-hover:text-primary transition-colors border border-black/5 dark:border-white/5">
                 <Plus size={32} />
              </div>
              <span className="font-bold uppercase tracking-widest text-xs">Add New Progress</span>
           </motion.div>

           {photos.map((photo, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="glass-card rounded-[3rem] overflow-hidden group shadow-lg bg-white dark:bg-[#1A1A1A] border border-black/5 dark:border-white/5"
             >
                <div className="relative aspect-[3/4] overflow-hidden">
                   <img src={photo.url || photo.photoUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Progress" />
                   <div className="absolute top-5 left-5 bg-white/90 dark:bg-black/90 backdrop-blur-md text-primary dark:text-cream px-4 py-1.5 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider">
                      {photo.type}
                   </div>
                </div>
                <div className="p-6 flex justify-between items-center bg-white dark:bg-[#1A1A1A]">
                   <div className="flex items-center space-x-3">
                      <div className="p-2 bg-black/5 dark:bg-white/5 rounded-lg text-primary">
                        <Calendar size={18} />
                      </div>
                      <span className="font-bold text-primary">{photo.date}</span>
                   </div>
                   <button className="text-slate-400 hover:text-accent transition-colors p-2 hover:bg-accent/10 rounded-lg">
                      <History size={20} />
                   </button>
                </div>
             </motion.div>
           ))}
        </div>
      )}
      
      <div className="bg-white dark:bg-[#1A1A1A] border border-black/5 dark:border-white/5 p-10 rounded-[3rem] shadow-sm">
         <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="p-4 bg-accent/10 rounded-2xl text-accent border border-accent/20">
               <ImageIcon size={32} />
            </div>
            <div>
               <h3 className="text-2xl font-bold mb-3 text-primary">Privacy & Security</h3>
               <p className="text-slate-500 leading-relaxed max-w-3xl text-lg">
                 Your progress photos are encrypted and stored in a private Firebase bucket. They are only visible to you. AI body analysis results are generated locally and never shared with third parties.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ProgressPhotos;
