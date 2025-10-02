import React, { useState, Component } from 'react';
import { HoursPreference } from './HoursPreference';
import { ScheduleGrid } from './ScheduleGrid';
import { DistanceSlider } from './DistanceSlider';
import { RateSlider } from './RateSlider';
type Preferences = {
  weeklyHours: {
    min: number;
    max: number;
  };
  availability: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
  };
  distance: number;
  rate: {
    min: number;
    max: number;
  };
  constraints: string[];
};
type AvailabilityFormProps = {
  initialPreferences: Preferences;
  onSubmit: (preferences: Preferences) => void;
  initialStep?: number;
};
export const AvailabilityForm = ({
  initialPreferences,
  onSubmit,
  initialStep
}: AvailabilityFormProps) => {
  const [preferences, setPreferences] = useState<Preferences>(initialPreferences);
  const [currentStep, setCurrentStep] = useState(initialStep ?? 0);
  const mappings: Record<string, keyof Preferences> = {
    'Weekly Hours': 'weeklyHours',
    Availability: 'availability',
    Distance: 'distance',
    Rate: 'rate'
  };
  const steps = [{
    title: 'Weekly Hours',
    component: HoursPreference
  }, {
    title: 'Availability',
    component: ScheduleGrid
  }, {
    title: 'Distance',
    component: DistanceSlider
  }, {
    title: 'Rate',
    component: RateSlider
  }];
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit(preferences);
    }
  };
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  const updatePreferences = (key: keyof Preferences, value: any) => {
    setPreferences({
      ...preferences,
      [key]: value
    });
  };
  const getCurrentValue = (stepTitle: string): any => {
    const key = mappings[stepTitle];
    return preferences[key];
  };
  const CurrentStepComponent = steps[currentStep].component;
  return <div className="space-y-4">
      <div className="flex justify-between mb-4">
        {steps.map((step, index) => <div key={index} className={`h-2 rounded-full ${index < currentStep ? 'bg-green-700' : index === currentStep ? 'bg-[#BCD5B4]' : 'bg-gray-200'} ${index === 0 ? 'w-1/6' : 'w-1/6'}`} />)}
      </div>
      <h3 className="text-lg font-medium text-gray-900">
        {steps[currentStep].title}
      </h3>
      <CurrentStepComponent value={getCurrentValue(steps[currentStep].title)} onChange={(value: any) => updatePreferences(mappings[steps[currentStep].title], value)} />
      <div className="flex justify-between pt-4">
        <button onClick={handleBack} disabled={currentStep === 0} className={`px-4 py-2 rounded ${currentStep === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
          Back
        </button>
        <button onClick={handleNext} className="px-4 py-2 bg-green-800 text-white rounded hover:bg-green-700">
          {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>;
};