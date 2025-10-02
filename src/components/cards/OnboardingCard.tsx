import React, { useState } from 'react';
import { BasicInfoCard } from './onboarding/BasicInfoCard';
import { LicenseCard } from './onboarding/LicenseCard';
import { SkillsCard } from './onboarding/SkillsCard';
import { AvailabilityDaysCard } from './AvailabilityDaysCard';
import { DistanceCard } from './DistanceCard';
import { RateCard } from './RateCard';
import { ConstraintsCard } from './ConstraintsCard';
type OnboardingCardProps = {
  type: 'basicInfo' | 'license' | 'skills' | 'workPreferences';
  data: any;
  onSubmit: (type: string, data: any) => void;
};
export const OnboardingCard = ({
  type,
  data,
  onSubmit
}: OnboardingCardProps) => {
  const [localData, setLocalData] = useState(data);
  const handleChange = (newData: any) => {
    setLocalData(newData);
  };
  const handleSubmit = () => {
    onSubmit(type, localData[type]);
  };
  const renderCard = () => {
    switch (type) {
      case 'basicInfo':
        return <BasicInfoCard value={localData.basicInfo} onChange={value => handleChange({
          ...localData,
          basicInfo: value
        })} />;
      case 'license':
        return <LicenseCard value={localData.license} onChange={value => handleChange({
          ...localData,
          license: value
        })} />;
      case 'skills':
        return <SkillsCard value={localData.skills} onChange={value => handleChange({
          ...localData,
          skills: value
        })} />;
      case 'workPreferences':
        return <div className="space-y-4">
            <RateCard value={localData.workPreferences.rate} onChange={value => handleChange({
            ...localData,
            workPreferences: {
              ...localData.workPreferences,
              rate: value
            }
          })} />
            <AvailabilityDaysCard value={localData.workPreferences.availability} onChange={value => handleChange({
            ...localData,
            workPreferences: {
              ...localData.workPreferences,
              availability: value
            }
          })} />
            <DistanceCard value={localData.workPreferences.distance} onChange={value => handleChange({
            ...localData,
            workPreferences: {
              ...localData.workPreferences,
              distance: value
            }
          })} />
            <ConstraintsCard value={localData.workPreferences.constraints} onChange={value => handleChange({
            ...localData,
            workPreferences: {
              ...localData.workPreferences,
              constraints: value
            }
          })} />
          </div>;
      default:
        return <div>Unknown card type</div>;
    }
  };
  return <div className="space-y-4">
      {renderCard()}
      <div className="pt-2 flex justify-end">
        <button onClick={handleSubmit} className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm rounded-full hover:from-teal-400 hover:to-emerald-500 transition-all">
          Save
        </button>
      </div>
    </div>;
};