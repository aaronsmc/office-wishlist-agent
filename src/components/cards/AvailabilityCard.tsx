import React, { useState } from 'react';
import { DistanceCard } from './DistanceCard';
import { RateCard } from './RateCard';
import { ConstraintsCard } from './ConstraintsCard';
import { useTheme } from '../ThemeContext';
type AvailabilityCardProps = {
  type: 'availability' | 'distance' | 'rate' | 'constraints';
  data: any;
  onSubmit: (type: string, data: any) => void;
};
export const AvailabilityCard = ({
  type,
  data,
  onSubmit
}: AvailabilityCardProps) => {
  const [availability, setAvailability] = useState(data.availability);
  const [distance, setDistance] = useState(data.distance);
  const [rate, setRate] = useState(data.rate);
  const [constraints, setConstraints] = useState(data.constraints);
  const {
    theme
  } = useTheme();
  const handleSubmit = () => {
    switch (type) {
      case 'availability':
        onSubmit('availability', availability);
        break;
      case 'distance':
        onSubmit('distance', distance);
        break;
      case 'rate':
        onSubmit('rate', rate);
        break;
      case 'constraints':
        onSubmit('constraints', constraints);
        break;
    }
  };
  return <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800/40 border-gray-700/50' : 'bg-white/90 border-gray-200/50'} border shadow-sm`}>
      {type === 'availability' && <div className="space-y-3">
          <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-white/90' : 'text-gray-800'}`}>
            Weekly Availability
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {/* Availability days grid here */}
          </div>
          <button onClick={handleSubmit} className={`mt-3 w-full py-2 px-4 rounded-lg font-medium text-sm ${theme === 'dark' ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-green-700 hover:bg-green-800 text-white'}`}>
            Save
          </button>
        </div>}
      {type === 'distance' && <DistanceCard value={distance} onChange={value => setDistance(value)} />}
      {type === 'rate' && <RateCard value={rate} onChange={value => setRate(value)} />}
      {type === 'constraints' && <div className="space-y-3">
          <ConstraintsCard constraints={constraints} onChange={value => setConstraints(value)} />
          <button onClick={handleSubmit} className={`mt-3 w-full py-2 px-4 rounded-lg font-medium text-sm ${theme === 'dark' ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-green-700 hover:bg-green-800 text-white'}`}>
            Save
          </button>
        </div>}
      {/* Only show Save button for distance and rate card types */}
      {(type === 'distance' || type === 'rate') && <button onClick={handleSubmit} className={`mt-3 w-full py-2 px-4 rounded-lg font-medium text-sm ${theme === 'dark' ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-green-700 hover:bg-green-800 text-white'}`}>
          Save
        </button>}
    </div>;
};