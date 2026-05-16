import React from 'react';
import { motion } from 'motion/react';
import { Camera, Image as ImageIcon, Plus, Calendar, History, ArrowRightLeft } from 'lucide-react';

const ProgressPhotos = () => {
  const [sliderPos, setSliderPos] = React.useState(50);
  const [isComparing, setIsComparing] = React.useState(false);

  const photos = [
    { date: 'May 15, 2026', type: 'Front', url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=400' },
    { date: 'May 1, 2026', type: 'Front', url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2ec617?auto=format&fit=crop&q=80&w=400' },
    { date: 'Apr 15, 2026', type: 'Front', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold mb-4">Body Progress Gallery</h1>
          <p className="text-slate-500 text-lg">Securely track your physical transformation over time.</p>
        </div>
        <div className="flex space-x-4">
           <button 
             onClick={() => setIsComparing(!isComparing)}
             className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${isComparing ? 'bg-accent text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}`}
           >
              <ArrowRightLeft size={18} />
              <span>Compare Modes</span>
           </button>
           <button className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20">
              <Camera size={18} />
              <span>Upload Photo</span>
           </button>
        </div>
      </div>

      {isComparing ? (
        <div className="max-w-4xl mx-auto space-y-6">
           <div className="flex justify-between items-center px-4">
              <div className="text-center">
                 <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Before</div>
                 <div className="font-bold">Apr 15, 2026</div>
              </div>
              <div className="text-center">
                 <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">After</div>
                 <div className="font-bold">May 15, 2026</div>
              </div>
           </div>
           
           <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl group cursor-ew-resize">
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
                 className="absolute inset-y-0 w-1 bg-white shadow-xl flex items-center justify-center"
                 style={{ left: `${sliderPos}%` }}
              >
                 <div className="w-10 h-10 bg-white rounded-full shadow-2xl flex flex-col items-center justify-center text-primary">
                    <ArrowRightLeft size={16} />
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
           <p className="text-center text-slate-500 italic">Drag the slider to compare before (left) and after (right).</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
           <motion.div 
             whileHover={{ scale: 0.98 }}
             className="aspect-[3/4] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-400 group cursor-pointer hover:border-primary transition-colors"
           >
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 group-hover:text-primary">
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
               className="glass-card rounded-[2.5rem] overflow-hidden group shadow-lg"
             >
                <div className="relative aspect-[3/4] overflow-hidden">
                   <img src={photo.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Progress" />
                   <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold">
                      {photo.type}
                   </div>
                </div>
                <div className="p-6 flex justify-between items-center">
                   <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-primary" />
                      <span className="font-bold">{photo.date}</span>
                   </div>
                   <button className="text-slate-400 hover:text-primary transition-colors">
                      <History size={18} />
                   </button>
                </div>
             </motion.div>
           ))}
        </div>
      )}
      
      <div className="bg-slate-100 dark:bg-slate-900/40 p-8 rounded-[2.5rem]">
         <div className="flex items-start space-x-4">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-primary">
               <ImageIcon size={24} />
            </div>
            <div>
               <h3 className="text-xl font-bold mb-2">Privacy & Security</h3>
               <p className="text-slate-500 leading-relaxed max-w-2xl">
                 Your progress photos are encrypted and stored in a private Firebase bucket. They are only visible to you. AI body analysis results are generated locally and never shared with third parties.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ProgressPhotos;
