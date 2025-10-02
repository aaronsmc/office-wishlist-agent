import React from 'react';
import { useTheme } from '../ThemeContext';
type RateCardProps = {
  value: {
    min: number;
    max: number;
  };
  onChange: (value: {
    min: number;
    max: number;
  }) => void;
};
export const RateCard = ({
  value,
  onChange
}: RateCardProps) => {
  const {
    theme
  } = useTheme();
  const handleMinChange = (min: number) => {
    onChange({
      ...value,
      min
    });
  };
  const handleMaxChange = (max: number) => {
    onChange({
      ...value,
      max
    });
  };
  return <div className="space-y-3">
      <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-white/90' : 'text-gray-800'}`}>
        Hourly Rate
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mb-1 block`}>
            Minimum
          </label>
          <select value={value.min} onChange={e => handleMinChange(Number(e.target.value))} className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-gray-300 text-gray-800'} border rounded-lg py-1.5 px-2 text-sm focus:outline-none focus:ring-1 ${theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-green-700/50'}`}>
            {Array.from({
            length: 36
          }, (_, i) => i + 15).map(rate => <option key={`min-${rate}`} value={rate} disabled={rate > value.max} className={theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}>
                ${rate}
              </option>)}
          </select>
        </div>
        <div>
          <label className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mb-1 block`}>
            Maximum
          </label>
          <select value={value.max} onChange={e => handleMaxChange(Number(e.target.value))} className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-gray-300 text-gray-800'} border rounded-lg py-1.5 px-2 text-sm focus:outline-none focus:ring-1 ${theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-green-700/50'}`}>
            {Array.from({
            length: 36
          }, (_, i) => i + 15).map(rate => <option key={`max-${rate}`} value={rate} disabled={rate < value.min} className={theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}>
                ${rate}
              </option>)}
          </select>
        </div>
      </div>
      <div className={`text-center text-sm font-light ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`}>
        ${value.min} - ${value.max} per hour
      </div>
    </div>;
};