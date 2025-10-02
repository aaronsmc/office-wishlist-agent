import React from 'react';
type RateSliderProps = {
  value: {
    min: number;
    max: number;
  };
  onChange: (value: {
    min: number;
    max: number;
  }) => void;
};
export const RateSlider = ({
  value,
  onChange
}: RateSliderProps) => {
  const handleMinChange = (newMin: number) => {
    // Ensure min doesn't exceed max
    onChange({
      min: Math.min(newMin, value.max),
      max: value.max
    });
  };
  const handleMaxChange = (newMax: number) => {
    // Ensure max isn't below min
    onChange({
      min: value.min,
      max: Math.max(newMax, value.min)
    });
  };
  return <div className="space-y-4">
      <p className="text-gray-600">What hourly rate would you like to earn?</p>
      <div className="pt-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>$15/hr</span>
          <span>$60/hr</span>
        </div>
        <div className="relative mt-2">
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="absolute h-2 bg-green-700 rounded-full" style={{
            left: `${(value.min - 15) / 45 * 100}%`,
            right: `${100 - (value.max - 15) / 45 * 100}%`
          }}></div>
          </div>
          <input type="range" min="15" max="60" step="1" value={value.min} onChange={e => handleMinChange(parseInt(e.target.value))} className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer" />
          <input type="range" min="15" max="60" step="1" value={value.max} onChange={e => handleMaxChange(parseInt(e.target.value))} className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer" />
          <div className="absolute w-4 h-4 bg-white border-2 border-green-700 rounded-full top-[-4px] cursor-pointer" style={{
          left: `calc(${(value.min - 15) / 45 * 100}% - 4px)`
        }}></div>
          <div className="absolute w-4 h-4 bg-white border-2 border-green-700 rounded-full top-[-4px] cursor-pointer" style={{
          left: `calc(${(value.max - 15) / 45 * 100}% - 4px)`
        }}></div>
        </div>
        <div className="flex justify-between mt-2">
          <div className="text-sm font-medium text-gray-700">
            Min: ${value.min}/hr
          </div>
          <div className="text-sm font-medium text-gray-700">
            Max: ${value.max}/hr
          </div>
        </div>
      </div>
      <div className="pt-2 flex flex-wrap gap-2">
        <button onClick={() => onChange({
        min: 25,
        max: 35
      })} className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200">
          $25-35/hr
        </button>
        <button onClick={() => onChange({
        min: 30,
        max: 45
      })} className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200">
          $30-45/hr
        </button>
        <button onClick={() => onChange({
        min: 40,
        max: 60
      })} className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200">
          $40+/hr
        </button>
      </div>
    </div>;
};