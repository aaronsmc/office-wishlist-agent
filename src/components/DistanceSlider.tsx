import React from 'react';
import { MapPinIcon } from 'lucide-react';
type DistanceSliderProps = {
  value: number;
  onChange: (value: number) => void;
};
export const DistanceSlider = ({
  value,
  onChange
}: DistanceSliderProps) => {
  const distances = [0]; // this is being weird right now
  return <div className="space-y-4">
  <p className="text-gray-600">How far are you willing to travel for a shift?</p>
  

  <input type="range" min={5} max={50} step={5} value={value} onChange={e => onChange(Number(e.target.value))} className="w-full accent-green-700" />

  <div className="flex justify-between text-xs text-gray-500 mt-2">
    {[5, 10, 15, 20, 30, 50].map(d => <span key={d}>{d} mi</span>)}
  </div>

  <div className="text-center text-lg font-medium text-gray-800">
    Up to {value} miles
  </div>
  </div>;
};