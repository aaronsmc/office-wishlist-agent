import React, { useState } from 'react';
type HoursPreferenceProps = {
  value: {
    min: number;
    max: number;
  };
  onChange: (value: {
    min: number;
    max: number;
  }) => void;
};
export const HoursPreference = ({
  value,
  onChange
}: HoursPreferenceProps) => {
  const [selectedOption, setSelectedOption] = useState<'custom' | 'fulltime' | 'parttime' | 'open'>(value.min === 35 && value.max === 40 ? 'fulltime' : value.min === 10 && value.max === 30 ? 'parttime' : value.min === 0 && value.max === 60 ? 'open' : 'custom');
  const handleOptionChange = (option: 'fulltime' | 'parttime' | 'open') => {
    setSelectedOption(option);
    if (option === 'fulltime') {
      onChange({
        min: 35,
        max: 40
      });
    } else if (option === 'parttime') {
      onChange({
        min: 10,
        max: 30
      });
    } else if (option === 'open') {
      onChange({
        min: 0,
        max: 60
      });
    }
  };
  const handleCustomChange = (min: number, max: number) => {
    setSelectedOption('custom');
    onChange({
      min,
      max
    });
  };
  return <div className="space-y-4">
      <p className="text-gray-600">
        Roughly how many hours would you like to work each week?
      </p>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => handleOptionChange('fulltime')} className={`px-4 py-2 rounded-full ${selectedOption === 'fulltime' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
          Full-time (35-40 hrs)
        </button>
        <button onClick={() => handleOptionChange('parttime')} className={`px-4 py-2 rounded-full ${selectedOption === 'parttime' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
          Part-time (10-30 hrs)
        </button>
        <button onClick={() => handleOptionChange('open')} className={`px-4 py-2 rounded-full ${selectedOption === 'open' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
          As many as possible
        </button>
      </div>
      <div className="pt-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>10 hrs</span>
          <span>60 hrs</span>
        </div>
        <div className="relative mt-2">
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="absolute h-2 bg-green-700 rounded-full" style={{
            left: `${value.min / 60 * 100}%`,
            right: `${100 - value.max / 60 * 100}%`
          }}></div>
          </div>
          <input type="range" min="0" max="60" value={value.min} onChange={e => handleCustomChange(parseInt(e.target.value), value.max)} className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer" />
          <input type="range" min="0" max="60" value={value.max} onChange={e => handleCustomChange(value.min, parseInt(e.target.value))} className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer" />
          <div className="absolute w-4 h-4 bg-white border-2 border-green-700 rounded-full top-[-4px] cursor-pointer" style={{
          left: `calc(${value.min / 60 * 100}% - 4px)`
        }}></div>
          <div className="absolute w-4 h-4 bg-white border-2 border-green-700 rounded-full top-[-4px] cursor-pointer" style={{
          left: `calc(${value.max / 60 * 100}% - 4px)`
        }}></div>
        </div>
        <div className="flex justify-between mt-2">
          <div className="text-sm font-medium text-gray-700">
            Min: {value.min} hrs
          </div>
          <div className="text-sm font-medium text-gray-700">
            Max: {value.max} hrs
          </div>
        </div>
      </div>
    </div>;
};