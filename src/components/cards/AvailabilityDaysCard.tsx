import React, { useState } from 'react';
import { ClockIcon, PlusIcon, XIcon } from 'lucide-react';
import { useTheme } from '../ThemeContext';
type TimeRange = {
  start: string;
  end: string;
};
type AvailabilityDaysCardProps = {
  value: {
    monday: string[] | TimeRange[];
    tuesday: string[] | TimeRange[];
    wednesday: string[] | TimeRange[];
    thursday: string[] | TimeRange[];
    friday: string[] | TimeRange[];
    saturday: string[] | TimeRange[];
    sunday: string[] | TimeRange[];
  };
  onChange: (value: any) => void;
};
export const AvailabilityDaysCard = ({
  value,
  onChange
}: AvailabilityDaysCardProps) => {
  const {
    theme
  } = useTheme();
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
  // Improved function to handle both old format and time range objects
  const convertToTimeRanges = (dayData: any[]): string[] => {
    if (!dayData || !Array.isArray(dayData) || dayData.length === 0) return [];
    const ranges: string[] = [];
    for (const item of dayData) {
      // Handle TimeRange objects
      if (typeof item === 'object' && item !== null && 'start' in item && 'end' in item) {
        ranges.push(`${item.start}-${item.end}`);
      }
      // Handle old string format
      else if (typeof item === 'string') {
        if (item === 'morning') ranges.push('06:00-12:00');else if (item === 'afternoon') ranges.push('12:00-18:00');else if (item === 'evening') ranges.push('18:00-24:00');
        // If it's already a range string, add it directly
        else if (item.includes('-')) ranges.push(item);
      }
    }
    return ranges;
  };
  // Initialize state with converted time ranges
  const [timeRanges, setTimeRanges] = useState(() => {
    const initialRanges: Record<string, string[]> = {};
    days.forEach(day => {
      initialRanges[day.id] = convertToTimeRanges(value[day.id]);
    });
    return initialRanges;
  });
  const isDayAvailable = (day: string) => {
    return timeRanges[day] && timeRanges[day].length > 0;
  };
  const formatTimeRange = (range: string) => {
    const [start, end] = range.split('-');
    return `${formatTime(start)} - ${formatTime(end)}`;
  };
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}${minutes > 0 ? ':' + minutes.toString().padStart(2, '0') : ''} ${period}`;
  };
  return <div className="space-y-3">
      <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-white/90' : 'text-gray-800'}`}>
        Availability
      </h3>
      {/* Day selector - read-only view */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => <div key={day.id} className={`px-2 py-1.5 text-xs rounded-lg transition-colors text-center ${isDayAvailable(day.id) ? theme === 'dark' ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white' : 'bg-gradient-to-r from-green-600 to-green-700 text-white' : theme === 'dark' ? 'bg-white/10 text-white/70' : 'bg-gray-100 text-gray-500'}`}>
            {day.label}
          </div>)}
      </div>
      {/* Time ranges for each day - read-only view */}
      <div className="space-y-2 mt-4">
        {days.filter(day => isDayAvailable(day.id)).map(day => <div key={day.id} className={`${theme === 'dark' ? 'bg-white/5 rounded-lg p-2' : 'bg-gray-50 rounded-lg p-2'}`}>
              <div className="flex items-center justify-between mb-1">
                <div className={`text-xs ${theme === 'dark' ? 'text-white/80' : 'text-gray-600'} font-medium`}>
                  {day.label}
                </div>
              </div>
              {timeRanges[day.id].map((range, idx) => <div key={idx} className={`flex items-center justify-between ${theme === 'dark' ? 'bg-white/10 rounded px-2 py-1 mb-1' : 'bg-white rounded px-2 py-1 mb-1 border border-gray-200'}`}>
                  <div className={`flex items-center text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                    <ClockIcon size={12} className="mr-1" />
                    {formatTimeRange(range)}
                  </div>
                </div>)}
            </div>)}
      </div>
      {/* Empty state message */}
      {days.every(day => !isDayAvailable(day.id)) && <div className={`text-center py-4 ${theme === 'dark' ? 'text-white/50' : 'text-gray-400'} text-xs`}>
          Type your availability to set your schedule
        </div>}
      <div className={`text-xs ${theme === 'dark' ? 'text-white/50' : 'text-gray-400'} mt-2 text-center`}>
        Try typing: "I'm available Monday to Friday 9-5" or "I work weekends
        10am-8pm"
      </div>
    </div>;
};