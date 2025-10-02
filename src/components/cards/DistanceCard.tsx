import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';
type DistanceCardProps = {
  value: number;
  onChange: (value: number) => void;
};
export const DistanceCard = ({
  value,
  onChange
}: DistanceCardProps) => {
  const [sliderValue, setSliderValue] = useState(value);
  const {
    theme
  } = useTheme();
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setSliderValue(newValue);
  };
  const handleSliderRelease = () => {
    onChange(sliderValue);
  };
  return <div className="space-y-3">
      <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-white/90' : 'text-gray-800'}`}>
        Travel Distance
      </h3>
      <div className="px-1">
        <input type="range" min="5" max="50" step="1" value={sliderValue} onChange={handleSliderChange} onMouseUp={handleSliderRelease} onTouchEnd={handleSliderRelease} className={`w-full appearance-none h-1.5 ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'} rounded-full outline-none`} style={{
        backgroundImage: `linear-gradient(to right, ${theme === 'dark' ? 'rgb(20, 184, 166)' : 'rgb(21, 128, 61)'} 0%, ${theme === 'dark' ? 'rgb(16, 185, 129)' : 'rgb(22, 163, 74)'} ${(sliderValue - 5) / 45 * 100}%, ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(229, 231, 235, 1)'} ${(sliderValue - 5) / 45 * 100}%)`
      }} />
        <div className={`flex justify-between text-xs ${theme === 'dark' ? 'text-white/40' : 'text-gray-500'} mt-1.5`}>
          <span>5</span>
          <span>10</span>
          <span>15</span>
          <span>20</span>
          <span>30</span>
          <span>50</span>
        </div>
      </div>
      <div className={`text-center text-sm font-light ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'} mt-1`}>
        Up to {sliderValue} miles
      </div>
    </div>;
};