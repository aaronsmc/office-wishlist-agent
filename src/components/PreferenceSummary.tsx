import React from 'react';
import { MapPinIcon, DollarSignIcon, CalendarIcon, PencilIcon } from 'lucide-react';
type Preferences = {
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
};
type PreferenceSummaryProps = {
  preferences: Preferences;
  onUpdate?: (updatedPreferences: Preferences) => void;
  onConfirm?: () => void;
  onEditField?: (field: 'availability' | 'distance' | 'rate') => void;
};
export const PreferenceSummary = ({
  preferences,
  onUpdate,
  onConfirm,
  onEditField
}: PreferenceSummaryProps) => {
  // Convert time slots to human-readable time ranges
  const getTimeRangesForDay = (daySlots: string[]) => {
    const ranges = [];
    if (daySlots.includes('morning')) ranges.push('6am-12pm');
    if (daySlots.includes('afternoon')) ranges.push('12pm-6pm');
    if (daySlots.includes('evening')) ranges.push('6pm-12am');
    return ranges;
  };
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
    const availableDays = days.filter(day => preferences.availability[day.id]?.length > 0);
    if (availableDays.length === 0) return 'No availability set';
    return availableDays.map(day => {
      const ranges = preferences.availability[day.id];
      let rangeText = '';
      if (ranges && ranges.length > 0) {
        rangeText = ranges.map((range: any) => {
          // Check if we're dealing with the TimeRange format
          if (typeof range === 'object' && range !== null && 'start' in range && 'end' in range) {
            const formatTime = (time: string) => {
              const [hours, minutes] = time.split(':').map(Number);
              const period = hours >= 12 ? 'pm' : 'am';
              const displayHours = hours % 12 || 12;
              return `${displayHours}${minutes > 0 ? ':' + minutes.toString().padStart(2, '0') : ''} ${period}`;
            };
            return `${formatTime(range.start)}–${formatTime(range.end)}`;
          }
          // Handle legacy string format - convert to time ranges
          else if (typeof range === 'string') {
            if (range === 'morning') return '6 am–12 pm';
            if (range === 'afternoon') return '12 pm–6 pm';
            if (range === 'evening') return '6 pm–12 am';
            return range;
          }
          return String(range);
        }).join(', ');
      } else {
        rangeText = 'None';
      }
      return `${day.label} (${rangeText})`;
    }).join('; ');
  };
  return <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900">
        Your Working Preferences
      </h3>
      <div className="space-y-3">
        <div className="flex items-start group">
          <CalendarIcon size={16} className="mt-0.5 text-teal-600 mr-3" />
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-800">
              Available Days & Times
            </p>
            <p className="text-xs text-gray-600">{formatAvailability()}</p>
          </div>
          {onEditField && <button onClick={() => onEditField('availability')} className="p-1.5 rounded-full text-gray-500 hover:bg-teal-50 hover:text-teal-600 transition-colors" aria-label="Edit availability" title="Edit availability">
              <PencilIcon size={14} />
            </button>}
        </div>
        <div className="flex items-start group">
          <MapPinIcon size={16} className="mt-0.5 text-teal-600 mr-3" />
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-800">Distance</p>
            <p className="text-xs text-gray-600">
              Up to {preferences.distance} miles
            </p>
          </div>
          {onEditField && <button onClick={() => onEditField('distance')} className="p-1.5 rounded-full text-gray-500 hover:bg-teal-50 hover:text-teal-600 transition-colors" aria-label="Edit distance" title="Edit distance">
              <PencilIcon size={14} />
            </button>}
        </div>
        <div className="flex items-start group">
          <DollarSignIcon size={16} className="mt-0.5 text-teal-600 mr-3" />
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-800">Rate</p>
            <p className="text-xs text-gray-600">
              ${preferences.rate.min}-${preferences.rate.max}/hr
            </p>
          </div>
          {onEditField && <button onClick={() => onEditField('rate')} className="p-1.5 rounded-full text-gray-500 hover:bg-teal-50 hover:text-teal-600 transition-colors" aria-label="Edit rate" title="Edit rate">
              <PencilIcon size={14} />
            </button>}
        </div>
      </div>
      {/* Only render the Confirm & Save button if onConfirm is provided */}
      {onConfirm && <div className="pt-2">
          <button onClick={onConfirm} className="w-full px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm rounded-full hover:from-teal-400 hover:to-emerald-500 transition-all">
            Confirm & Save
          </button>
        </div>}
    </div>;
};