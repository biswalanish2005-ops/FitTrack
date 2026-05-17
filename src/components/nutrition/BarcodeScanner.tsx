import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, Loader2, ScanBarcode } from 'lucide-react';
import { NutritionData } from '../../lib/nutritionApi';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface BarcodeScannerProps {
  onClose: () => void;
  onScanSuccess: (item: NutritionData) => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onClose, onScanSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Scanner
    const scanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 150 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true
      },
      false
    );

    const onScan = async (decodedText: string) => {
      // Prevent multiple triggers
      if (scanner.getState() === 2) { // SCANNING
        scanner.pause();
      }
      
      setLoading(true);
      setError(null);

      try {
        // 1. Check Cache
        const cacheRef = doc(db, 'foods', `off_${decodedText}`);
        const cacheSnap = await getDoc(cacheRef);
        
        if (cacheSnap.exists()) {
          onScanSuccess(cacheSnap.data() as NutritionData);
          scanner.clear();
          onClose();
          return;
        }

        // 2. Fetch API
        const response = await fetch(`/api/nutrition/barcode/${decodedText}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Product not found in Open Food Facts database.');
          }
          throw new Error('Failed to fetch barcode data.');
        }

        const data: NutritionData = await response.json();

        // 3. Save to cache
        try {
          await setDoc(doc(db, 'foods', data.id), {
            ...data,
            createdAt: new Date().toISOString()
          });
        } catch (e) {
          console.error("Cache save error:", e);
        }

        onScanSuccess(data);
        scanner.clear();
        onClose();

      } catch (err: any) {
        console.error("Barcode scan error:", err);
        setError(err.message || 'Error processing barcode.');
        
        // Resume scanning after displaying error briefly
        setTimeout(() => {
          if (scanner.getState() === 3) { // PAUSED
            scanner.resume();
          }
          setLoading(false);
          setError(null);
        }, 3000);
      }
    };

    const onError = (err: any) => {
      // Ignored: html5-qrcode continuously fires errors when no barcode is found
    };

    scanner.render(onScan, onError);

    // Cleanup
    return () => {
      try {
        scanner.clear().catch(console.error);
      } catch (e) {
        console.error(e);
      }
    };
  }, [onClose, onScanSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#1A1A1A] border border-black/5 dark:border-white/5 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 p-2.5 rounded-xl text-accent">
              <ScanBarcode className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-primary">Scan Barcode</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-[#1A1A1A] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scanner Area */}
        <div className="p-4 relative min-h-[300px] flex flex-col items-center justify-center bg-slate-50 dark:bg-[#111111]">
          <div id="reader" className="w-full text-slate-800 dark:text-slate-200 html5-qrcode-custom"></div>
          
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-[#111111]/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-2xl">
              <Loader2 className="h-10 w-10 text-accent animate-spin mb-4" />
              <p className="text-primary font-medium animate-pulse">Fetching nutrition data...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="absolute bottom-6 left-6 right-6 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-center py-3 px-4 rounded-xl shadow-lg border border-rose-100 dark:border-rose-900 z-20 animate-in slide-in-from-bottom-4">
              {error}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-5 bg-white dark:bg-[#1A1A1A] border-t border-black/5 dark:border-white/5 text-center text-sm text-slate-500 font-medium">
          Point your camera at a food product's barcode to automatically fetch its nutrition info.
        </div>
      </div>
    </div>
  );
};
