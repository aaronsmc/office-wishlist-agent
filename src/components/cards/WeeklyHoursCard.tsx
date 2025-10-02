import React, { useState } from 'react';
type WeeklyHoursCardProps = {
  value: {
    min: number;
    max: number;
  };
  onChange: (value: {
    min: number;
    max: number;
  }) => void;
};
export const WeeklyHoursCard = ({
  value,
  onChange
}: WeeklyHoursCardProps) => {
  const [localValue, setLocalValue] = useState(value);
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value, 10);
    setLocalValue({
      min: Math.min(newMin, localValue.max),
      max: localValue.max
    });
  };
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value, 10);
    setLocalValue({
      min: localValue.min,
      max: Math.max(newMax, localValue.min)
    });
  };
  const handleSliderRelease = () => {
    onChange(localValue);
  };
  const options = [{
    label: 'Full-time',
    min: 35,
    max: 40
  }, {
    label: 'Part-time',
    min: 10,
    max: 30
  }, {
    label: 'Flexible',
    min: 0,
    max: 60
  }];
  const handleOptionClick = (min: number, max: number) => {
    const newValue = {
      min,
      max
    };
    setLocalValue(newValue);
    onChange(newValue);
  };
  const isSelected = (min: number, max: number) => {
    return localValue.min === min && localValue.max === max;
  };
  return <div className="space-y-3">
      <h3 className="text-sm font-medium text-white/90">Weekly Hours</h3>
      <div className="flex flex-wrap gap-2">
        {options.map(option => <button key={option.label} onClick={() => handleOptionClick(option.min, option.max)} className={`px-3 py-1.5 text-xs rounded-full transition-colors ${isSelected(option.min, option.max) ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
            {option.label}
          </button>)}
      </div>
      <div className="pt-2 px-1">
        <div className="relative h-1.5 bg-white/10 rounded-full mb-6">
          {/* Min-max range highlight */}
          <div className="absolute h-1.5 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full" style={{
          left: `${localValue.min / 60 * 100}%`,
          right: `${100 - localValue.max / 60 * 100}%`
        }}></div>
          {/* Min handle */}
          <input type="range" min="0" max="60" value={localValue.min} onChange={handleMinChange} onMouseUp={handleSliderRelease} onTouchEnd={handleSliderRelease} className="absolute w-full top-0 h-1.5 opacity-0 cursor-pointer" />
          {/* Max handle */}
          <input type="range" min="0" max="60" value={localValue.max} onChange={handleMaxChange} onMouseUp={handleSliderRelease} onTouchEnd={handleSliderRelease} className="absolute w-full top-0 h-1.5 opacity-0 cursor-pointer" />
          {/* Handle visuals */}
          <div className="absolute w-4 h-4 bg-white rounded-full shadow-md top-[-5px] cursor-pointer" style={{
          left: `calc(${localValue.min / 60 * 100}% - 8px)`
        }}>
            <div className="absolute inset-1 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full"></div>
          </div>
          <div className="absolute w-4 h-4 bg-white rounded-full shadow-md top-[-5px] cursor-pointer" style={{
          left: `calc(${localValue.max / 60 * 100}% - 8px)`
        }}>
            <div className="absolute inset-1 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full"></div>
          </div>
          {/* Labels */}
          <div className="absolute text-xs text-white/70 font-medium" style={{
          left: `calc(${localValue.min / 60 * 100}% - 10px)`,
          top: '12px'
        }}>
            {localValue.min}h
          </div>
          <div className="absolute text-xs text-white/70 font-medium" style={{
          left: `calc(${localValue.max / 60 * 100}% - 10px)`,
          top: '12px'
        }}>
            {localValue.max}h
          </div>
        </div>
      </div>
    </div>;
};