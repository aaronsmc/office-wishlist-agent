import React from 'react';
import { CalendarIcon, SunIcon, CloudIcon, MoonIcon, CheckIcon, PlusIcon } from 'lucide-react';
type TimeSlot = 'morning' | 'afternoon' | 'evening';
type DayAvailability = Record<string, string[]>;
type ScheduleGridProps = {
  value: DayAvailability;
  onChange: (value: DayAvailability) => void;
};
export const ScheduleGrid = ({
  value,
  onChange
}: ScheduleGridProps) => {
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
  const timeSlots = [{
    id: 'morning',
    label: 'Morning',
    time: '6am-12pm',
    icon: SunIcon
  }, {
    id: 'afternoon',
    label: 'Afternoon',
    time: '12pm-6pm',
    icon: CloudIcon
  }, {
    id: 'evening',
    label: 'Evening',
    time: '6pm-12am',
    icon: MoonIcon
  }];
  const toggleTimeSlot = (day: string, timeSlot: TimeSlot) => {
    const newValue = {
      ...value
    };
    if (newValue[day].includes(timeSlot)) {
      newValue[day] = newValue[day].filter(slot => slot !== timeSlot);
    } else {
      newValue[day] = [...newValue[day], timeSlot];
    }
    onChange(newValue);
  };
  const isSelected = (day: string, timeSlot: TimeSlot) => {
    return value[day]?.includes(timeSlot) || false;
  };
  const selectAllDay = (day: string) => {
    const allTimeSlots = timeSlots.map(slot => slot.id) as TimeSlot[];
    const newValue = {
      ...value
    };
    if (allTimeSlots.every(slot => isSelected(day, slot))) {
      newValue[day] = [];
    } else {
      newValue[day] = allTimeSlots;
    }
    onChange(newValue);
  };
  const selectAllTimeSlot = (timeSlot: TimeSlot) => {
    const newValue = {
      ...value
    };
    const allDays = days.map(day => day.id);
    if (allDays.every(day => isSelected(day, timeSlot))) {
      allDays.forEach(day => {
        newValue[day] = newValue[day].filter(slot => slot !== timeSlot);
      });
    } else {
      allDays.forEach(day => {
        if (!newValue[day].includes(timeSlot)) {
          newValue[day] = [...newValue[day], timeSlot];
        }
      });
    }
    onChange(newValue);
  };
  return <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-2">
        <CalendarIcon size={20} className="text-green-600" />
        <p className="text-gray-700 font-medium">Select your availability</p>
      </div>
      <p className="text-gray-600 text-sm pl-7">
        Pick the days and times you'd like to work. This helps us match you with
        suitable shifts.
      </p>
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100 mt-4">
        <table className="w-full">
          <thead>
            <tr className="bg-green-50">
              <th className="w-28 py-3 px-2"></th>
              {days.map(day => <th key={day.id} className="text-center">
                  <button onClick={() => selectAllDay(day.id)} className="w-full py-2 px-1 text-sm font-medium text-green-800 hover:bg-green-100 rounded-md transition-colors">
                    {day.label}
                  </button>
                </th>)}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(timeSlot => {
            const TimeIcon = timeSlot.icon;
            return <tr key={timeSlot.id} className="border-t border-gray-100">
                  <td className="py-3 px-2">
                    <button onClick={() => selectAllTimeSlot(timeSlot.id as TimeSlot)} className="text-left text-sm font-medium text-gray-700 hover:text-green-700 flex items-center space-x-2 transition-colors">
                      <TimeIcon size={16} className="text-green-600" />
                      <div>
                        <div>{timeSlot.label}</div>
                        <div className="text-xs text-gray-500">
                          {timeSlot.time}
                        </div>
                      </div>
                    </button>
                  </td>
                  {days.map(day => <td key={`${day.id}-${timeSlot.id}`} className="text-center py-2">
                      <button onClick={() => toggleTimeSlot(day.id, timeSlot.id as TimeSlot)} className={`w-9 h-9 rounded-full transition-all ${isSelected(day.id, timeSlot.id as TimeSlot) ? 'bg-green-600 text-white shadow-md shadow-green-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                        {isSelected(day.id, timeSlot.id as TimeSlot) ? <CheckIcon size={16} className="mx-auto" /> : <PlusIcon size={16} className="mx-auto opacity-60" />}
                      </button>
                    </td>)}
                </tr>;
          })}
          </tbody>
        </table>
      </div>
      <div className="pt-2 pl-1">
        <button className="text-sm text-green-700 hover:text-green-800 hover:underline flex items-center space-x-2">
          <CalendarIcon size={14} />
          <span>I have the same schedule every day</span>
        </button>
      </div>
    </div>;
};