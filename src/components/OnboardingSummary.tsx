import React from 'react';
import { UserIcon, IdCardIcon, BriefcaseIcon, CalendarIcon, MapPinIcon, DollarSignIcon } from 'lucide-react';
type OnboardingData = {
  basicInfo: {
    name: string;
    email: string;
    phone: string;
  };
  license: {
    type: string;
    number: string;
  };
  skills: {
    yearsExperience: number;
    specialties: string[];
  };
  workPreferences: {
    rate: {
      min: number;
      max: number;
    };
    weeklyHours?: {
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
    constraints: string[];
  };
};
type OnboardingSummaryProps = {
  data: OnboardingData;
  onConfirm: () => void;
};
export const OnboardingSummary = ({
  data,
  onConfirm
}: OnboardingSummaryProps) => {
  const formatAvailability = () => {
    const days = [{
      id: 'monday',
      label: 'Mon'
    }, {
      id: 'tuesday',
      label: 'Tue'
    }, {
      id: 'wednesday',
      label: 'Wed'
    }, {
      id: 'thursday',
      label: 'Thu'
    }, {
      id: 'friday',
      label: 'Fri'
    }, {
      id: 'saturday',
      label: 'Sat'
    }, {
      id: 'sunday',
      label: 'Sun'
    }];
    const availableDays = days.filter(day => data.workPreferences.availability[day.id as keyof typeof data.workPreferences.availability]?.length > 0);
    if (availableDays.length === 0) return 'No availability set';
    return availableDays.map(day => {
      const ranges = data.workPreferences.availability[day.id as keyof typeof data.workPreferences.availability];
      const formattedRanges = ranges.map((range: any) => {
        // Check if we're dealing with the TimeRange format
        if (typeof range === 'object' && range !== null && 'start' in range && 'end' in range) {
          const formatTime = (time: string) => {
            const [hours, minutes] = time.split(':').map(Number);
            const period = hours >= 12 ? 'pm' : 'am';
            const displayHours = hours % 12 || 12;
            return `${displayHours}${minutes > 0 ? ':' + minutes.toString().padStart(2, '0') : ''}${period}`;
          };
          return `${formatTime(range.start)}-${formatTime(range.end)}`;
        }
        // Handle legacy string format without converting to time ranges
        else if (typeof range === 'string') {
          return range;
        }
        return String(range);
      });
      return `${day.label} (${formattedRanges.join(', ')})`;
    }).join('; ');
  };
  const formatExperience = (years: number) => {
    if (years === 0) return 'Less than 1 year';
    if (years === 1) return '1 year';
    return `${years} years`;
  };
  return <div className="space-y-4">
      <h3 className="text-sm font-medium text-white/90">Profile Summary</h3>
      <div className="space-y-3">
        <div className="flex items-start">
          <UserIcon size={16} className="mt-0.5 text-teal-400 mr-3 opacity-80" />
          <div className="flex-1">
            <p className="text-xs font-medium text-white/80">
              Basic Information
            </p>
            <p className="text-xs text-white/60">
              {data.basicInfo.name}
              <br />
              {data.basicInfo.email}
              <br />
              {data.basicInfo.phone}
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <IdCardIcon size={16} className="mt-0.5 text-teal-400 mr-3 opacity-80" />
          <div className="flex-1">
            <p className="text-xs font-medium text-white/80">License</p>
            <p className="text-xs text-white/60">
              {data.license.type}
              <br />
              License #: {data.license.number}
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <BriefcaseIcon size={16} className="mt-0.5 text-teal-400 mr-3 opacity-80" />
          <div className="flex-1">
            <p className="text-xs font-medium text-white/80">Experience</p>
            <p className="text-xs text-white/60">
              {formatExperience(data.skills.yearsExperience)}
              {data.skills.specialties.length > 0 && <>
                  <br />
                  Specialties: {data.skills.specialties.join(', ')}
                </>}
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <DollarSignIcon size={16} className="mt-0.5 text-teal-400 mr-3 opacity-80" />
          <div className="flex-1">
            <p className="text-xs font-medium text-white/80">Rate</p>
            <p className="text-xs text-white/60">
              ${data.workPreferences.rate.min}-${data.workPreferences.rate.max}
              /hr
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <CalendarIcon size={16} className="mt-0.5 text-teal-400 mr-3 opacity-80" />
          <div className="flex-1">
            <p className="text-xs font-medium text-white/80">Availability</p>
            <p className="text-xs text-white/60">{formatAvailability()}</p>
          </div>
        </div>
        <div className="flex items-start">
          <MapPinIcon size={16} className="mt-0.5 text-teal-400 mr-3 opacity-80" />
          <div className="flex-1">
            <p className="text-xs font-medium text-white/80">Distance</p>
            <p className="text-xs text-white/60">
              Up to {data.workPreferences.distance} miles
            </p>
          </div>
        </div>
      </div>
      <div className="pt-2">
        <button onClick={onConfirm} className="w-full px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm rounded-full hover:from-teal-400 hover:to-emerald-500 transition-all">
          Confirm & Save Profile
        </button>
      </div>
    </div>;
};