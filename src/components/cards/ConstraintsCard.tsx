import React, { useState } from 'react';
import { XIcon } from 'lucide-react';
import { useTheme } from '../ThemeContext';
type ConstraintsCardProps = {
  value: string[];
  onChange: (value: string[]) => void;
};
export const ConstraintsCard = ({
  value,
  onChange
}: ConstraintsCardProps) => {
  const [newConstraint, setNewConstraint] = useState('');
  const {
    theme
  } = useTheme();
  const addConstraint = () => {
    if (newConstraint.trim() && !value.includes(newConstraint.trim())) {
      onChange([...value, newConstraint.trim()]);
      setNewConstraint('');
    }
  };
  const removeConstraint = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };
  const commonConstraints = ['No overnight shifts', 'No weekends', 'No split shifts', 'Prefer morning shifts'];
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addConstraint();
    }
  };
  return <div className="space-y-3">
      <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-white/90' : 'text-gray-800'}`}>
        Scheduling Rules
      </h3>
      <div className="flex flex-wrap gap-2">
        {commonConstraints.map(constraint => <button key={constraint} onClick={() => {
        if (!value.includes(constraint)) {
          onChange([...value, constraint]);
        }
      }} className={`px-3 py-1.5 text-xs rounded-full transition-colors ${value.includes(constraint) ? theme === 'dark' ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white' : 'bg-gradient-to-r from-green-700 to-green-800 text-white' : theme === 'dark' ? 'bg-white/10 text-white/70 hover:bg-white/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {constraint}
          </button>)}
      </div>
      <div className="flex mt-2">
        <input type="text" value={newConstraint} onChange={e => setNewConstraint(e.target.value)} onKeyPress={handleKeyPress} placeholder="Add custom rule..." className={`flex-1 ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder-white/40' : 'bg-gray-100 border-gray-200 text-gray-800 placeholder-gray-400'} border rounded-l-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-1 ${theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-green-600/50'}`} />
        <button onClick={addConstraint} className={`${theme === 'dark' ? 'bg-gradient-to-r from-teal-500 to-teal-600' : 'bg-gradient-to-r from-green-700 to-green-800'} text-white px-3 py-1.5 rounded-r-lg text-sm`}>
          Add
        </button>
      </div>
      {value.length > 0 && <div className="space-y-1.5 mt-2">
          {value.map((rule, index) => <div key={index} className={`flex justify-between items-center ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} px-3 py-1.5 rounded-lg`}>
              <span className={`text-xs ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`}>
                {rule}
              </span>
              <button onClick={() => removeConstraint(index)} className={theme === 'dark' ? 'text-white/50 hover:text-white/80' : 'text-gray-400 hover:text-gray-600'}>
                <XIcon size={14} />
              </button>
            </div>)}
        </div>}
    </div>;
};