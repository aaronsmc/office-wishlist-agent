import React, { useEffect, useRef } from 'react';
import { XIcon } from 'lucide-react';
import { useTheme } from '../ThemeContext';
type AboutSheetProps = {
  onClose: () => void;
};
export const AboutSheet = ({
  onClose
}: AboutSheetProps) => {
  const {
    theme
  } = useTheme();
  const sheetRef = useRef<HTMLDivElement>(null);
  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  // Handle escape key to close
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);
  return <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up">
      <div ref={sheetRef} className={`${theme === 'dark' ? 'bg-gray-900/90 border-white/10' : 'bg-white/90 border-black/10'} backdrop-blur-xl border rounded-2xl w-full max-w-md p-6 shadow-glow`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`${theme === 'dark' ? 'text-white/90' : 'text-gray-800'} text-lg font-medium`}>
            About Mavi
          </h2>
          <button onClick={onClose} className={`${theme === 'dark' ? 'text-white/60 hover:text-white/90' : 'text-gray-500 hover:text-gray-700'} transition-colors`} aria-label="Close">
            <XIcon size={20} />
          </button>
        </div>
        <p className={`${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} text-sm`}>
          Mavi is Arya Health's assistant. It helps you update availability,
          finish onboarding, and keep credentials current so you see the right
          shifts.
        </p>
        <div className="flex justify-end mt-6">
          <button onClick={onClose} className={`px-4 py-2 ${theme === 'dark' ? 'bg-white/10 hover:bg-white/15 text-white/90 border-white/20' : 'bg-black/5 hover:bg-black/10 text-gray-800 border-black/10'} rounded-full border text-sm transition-all`}>
            Got it
          </button>
        </div>
      </div>
    </div>;
};