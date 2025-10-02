import React, { useState } from 'react';
import { CalendarIcon, CheckIcon } from 'lucide-react';
type TimeRange = {
  start: string;
  end: string;
};
type AvailabilityData = {
  monday: Array<string | TimeRange>;
  tuesday: Array<string | TimeRange>;
  wednesday: Array<string | TimeRange>;
  thursday: Array<string | TimeRange>;
  friday: Array<string | TimeRange>;
  saturday: Array<string | TimeRange>;
  sunday: Array<string | TimeRange>;
};
type AvailabilityListProps = {
  data: {
    availability: AvailabilityData;
  };
  onSubmit: (type: string, data: AvailabilityData) => void;
  onConfirm?: () => void;
  isConfirmation?: boolean;
};
export const AvailabilityList = ({
  data,
  onSubmit,
  onConfirm,
  isConfirmation = false
}: AvailabilityListProps) => {
  const [availabilityText, setAvailabilityText] = useState('');
  const [isEditing, setIsEditing] = useState(!isConfirmation);
  // Format a time range for display
  const formatTimeRange = (range: TimeRange | string): string => {
    if (typeof range === 'string') {
      // If it's already a formatted range like "9 am-5 pm", just return it
      if (range.includes('-') || range.includes('–')) {
        return range;
      }
      // Legacy values - convert to time ranges
      if (range === 'morning') return '6 am–12 pm';
      if (range === 'afternoon') return '12 pm–6 pm';
      if (range === 'evening') return '6 pm–12 am';
      return range;
    }
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      const period = hours >= 12 ? 'pm' : 'am';
      const displayHours = hours % 12 || 12;
      return `${displayHours}${minutes > 0 ? ':' + minutes.toString().padStart(2, '0') : ''} ${period}`;
    };
    return `${formatTime(range.start)}–${formatTime(range.end)}`;
  };
  const handleSaveAvailability = () => {
    // We don't modify the data here - the parent will parse the text
    // and update the availability data structure
    onSubmit('availability_text', availabilityText as any);
    setIsEditing(false);
  };
  const handleConfirmAvailability = () => {
    if (onConfirm) {
      onConfirm();
    }
  };
  // Display availability as a simple list
  const renderAvailabilityList = () => {
    const days = [{
      id: 'monday',
      label: 'Monday'
    }, {
      id: 'tuesday',
      label: 'Tuesday'
    }, {
      id: 'wednesday',
      label: 'Wednesday'
    }, {
      id: 'thursday',
      label: 'Thursday'
    }, {
      id: 'friday',
      label: 'Friday'
    }, {
      id: 'saturday',
      label: 'Saturday'
    }, {
      id: 'sunday',
      label: 'Sunday'
    }];
    const availableDays = days.filter(day => data.availability[day.id as keyof AvailabilityData]?.length > 0);
    if (availableDays.length === 0) {
      return <div className="text-gray-500 italic text-sm">
          No availability set yet. Please describe your availability.
        </div>;
    }
    return <ul className="space-y-2 list-disc pl-5">
        {days.map(day => {
        const ranges = data.availability[day.id as keyof AvailabilityData];
        // Combine all ranges for this day into a single string
        let rangeText = 'None';
        if (ranges && ranges.length > 0) {
          rangeText = ranges.map(range => formatTimeRange(range)).join(', ');
        }
        return <li key={day.id} className="text-gray-800">
              <span className="font-medium">{day.label}</span>{' '}
              <span className="text-gray-700">({rangeText})</span>
            </li>;
      })}
      </ul>;
  };
  return <div className="space-y-4">
      <div className="flex items-center mb-2">
        <CalendarIcon size={16} className="text-teal-600 mr-2" />
        <h3 className="text-sm font-medium text-gray-900">Your Availability</h3>
      </div>
      {!isEditing ? <>
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            {renderAvailabilityList()}
          </div>
          {isConfirmation ? <div className="flex space-x-2 pt-2">
              <button onClick={handleConfirmAvailability} className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm rounded-full hover:from-teal-400 hover:to-emerald-500 transition-all">
                <CheckIcon size={14} className="inline mr-1" /> Yes, this is
                correct
              </button>
              <button onClick={() => setIsEditing(true)} className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-full hover:bg-gray-50 transition-all">
                No, make changes
              </button>
            </div> : <button onClick={() => setIsEditing(true)} className="w-full mt-2 px-4 py-2 bg-white border border-teal-500 text-teal-600 text-sm rounded-full hover:bg-teal-50 transition-all">
              Update Availability
            </button>}
        </> : <>
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <textarea value={availabilityText} onChange={e => setAvailabilityText(e.target.value)} placeholder="Describe your availability. For example:
Monday–Wednesday 9 am–6 pm
Thursday–Friday 10 am–5 pm
Weekends off" className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm" />
            <div className="text-xs text-gray-500 mt-2">
              Please tell me when you're available to work. You can specify days
              and times like "Monday 9 am–5 pm" or "Weekdays 8 am–4 pm".
            </div>
          </div>
          <button onClick={handleSaveAvailability} className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm rounded-full hover:from-teal-400 hover:to-emerald-500 transition-all">
            <CheckIcon size={14} className="inline mr-1" /> Save Availability
          </button>
        </>}
    </div>;
};