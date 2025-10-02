import React, { useState } from 'react';
import { CalendarIcon, ClockIcon, XIcon, PlusIcon } from 'lucide-react';
type TimeRange = {
  start: string;
  end: string;
};
type DayAvailability = Record<string, TimeRange[]>;
type AvailabilitySelectorProps = {
  value: DayAvailability;
  onChange: (value: DayAvailability) => void;
};
export const AvailabilitySelector = ({
  value,
  onChange
}: AvailabilitySelectorProps) => {
  const [view, setView] = useState<'patterns' | 'calendar' | 'exceptions'>('patterns');
  const [exception, setException] = useState<string>('');
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
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
  // Apply a common pattern to the availability
  const applyPattern = (pattern: string) => {
    const newValue: DayAvailability = {};
    // Reset all days first
    days.forEach(day => {
      newValue[day.id] = [];
    });
    switch (pattern) {
      case 'weekdays':
        // Monday to Friday, 9-5
        ;
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
          newValue[day] = [{
            start: '09:00',
            end: '17:00'
          }];
        });
        break;
      case 'weekends':
        // Saturday and Sunday, all day
        ;
        ['saturday', 'sunday'].forEach(day => {
          newValue[day] = [{
            start: '08:00',
            end: '20:00'
          }];
        });
        break;
      case 'evenings':
        // Every day, evenings only
        days.forEach(day => {
          newValue[day.id] = [{
            start: '18:00',
            end: '00:00'
          }];
        });
        break;
      case 'mornings':
        // Every day, mornings only
        days.forEach(day => {
          newValue[day.id] = [{
            start: '06:00',
            end: '12:00'
          }];
        });
        break;
      case 'afternoons':
        // Every day, afternoons only
        days.forEach(day => {
          newValue[day.id] = [{
            start: '12:00',
            end: '18:00'
          }];
        });
        break;
      case 'allday':
        // Every day, all times
        days.forEach(day => {
          newValue[day.id] = [{
            start: '00:00',
            end: '23:59'
          }];
        });
        break;
      case 'clear':
        // Already cleared
        break;
    }
    onChange(newValue);
    // After applying a pattern, switch to calendar view to let user refine
    setView('calendar');
  };
  const addTimeRange = () => {
    if (!editingDay) return;
    // Validate time range
    const start = startTime.split(':').map(Number);
    const end = endTime.split(':').map(Number);
    const startMinutes = start[0] * 60 + start[1];
    const endMinutes = end[0] * 60 + end[1];
    if (startMinutes >= endMinutes) return;
    const newValue = {
      ...value
    };
    newValue[editingDay] = [...(newValue[editingDay] || []), {
      start: startTime,
      end: endTime
    }];
    onChange(newValue);
    setEditingDay(null);
  };
  const removeTimeRange = (day: string, index: number) => {
    const newValue = {
      ...value
    };
    newValue[day] = [...(newValue[day] || [])];
    newValue[day].splice(index, 1);
    onChange(newValue);
  };
  const isDayAvailable = (day: string) => {
    return value[day] && value[day].length > 0;
  };
  // Add an exception (simplified for demo)
  const addException = () => {
    if (!exception.trim()) return;
    // This is a simplified parser that handles a few common patterns
    const lowerException = exception.toLowerCase();
    if (lowerException.includes('no monday')) {
      const newValue = {
        ...value
      };
      newValue.monday = [];
      onChange(newValue);
    } else if (lowerException.includes('no weekends')) {
      const newValue = {
        ...value
      };
      newValue.saturday = [];
      newValue.sunday = [];
      onChange(newValue);
    } else if (lowerException.includes('no evenings')) {
      const newValue = {
        ...value
      };
      days.forEach(day => {
        newValue[day.id] = (newValue[day.id] || []).filter(range => {
          const startHour = parseInt(range.start.split(':')[0]);
          return startHour < 17; // Filter out ranges that start in the evening
        });
      });
      onChange(newValue);
    }
    setException('');
    // After adding an exception, show the calendar to see the results
    setView('calendar');
  };
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}${minutes > 0 ? ':' + minutes.toString().padStart(2, '0') : ''} ${period}`;
  };
  const formatTimeRange = (range: TimeRange) => {
    return `${formatTime(range.start)} - ${formatTime(range.end)}`;
  };
  // Calculate the summary text
  const getSummaryText = () => {
    // Count days with any availability
    const activeDays = days.filter(day => isDayAvailable(day.id));
    if (activeDays.length === 0) {
      return 'No availability set';
    }
    if (activeDays.length === 7) {
      // Check if it's the same pattern every day
      const firstDay = JSON.stringify(value[activeDays[0].id]);
      const allSame = days.every(day => JSON.stringify(value[day.id]) === firstDay);
      if (allSame && value[activeDays[0].id].length === 1) {
        const range = value[activeDays[0].id][0];
        return `Available all days, ${formatTime(range.start)} - ${formatTime(range.end)}`;
      }
    }
    // Check for weekday/weekend patterns
    const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const weekends = ['saturday', 'sunday'];
    const hasAllWeekdays = weekdays.every(day => isDayAvailable(day));
    const hasAllWeekends = weekends.every(day => isDayAvailable(day));
    if (hasAllWeekdays && !hasAllWeekends) {
      return 'Available weekdays only';
    }
    if (!hasAllWeekdays && hasAllWeekends) {
      return 'Available weekends only';
    }
    // Default case: list the days
    return `Available ${activeDays.length} days per week`;
  };
  return <div className="space-y-4">
      <p className="text-gray-600">
        Select when you're typically available to work. You'll still get to
        choose specific shifts later.
      </p>
      {/* Toggle between views */}
      <div className="flex rounded-lg overflow-hidden border border-gray-200">
        <button onClick={() => setView('patterns')} className={`flex-1 py-2 text-sm font-medium ${view === 'patterns' ? 'bg-green-700 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
          Quick Patterns
        </button>
        <button onClick={() => setView('calendar')} className={`flex-1 py-2 text-sm font-medium ${view === 'calendar' ? 'bg-green-700 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
          Calendar View
        </button>
        <button onClick={() => setView('exceptions')} className={`flex-1 py-2 text-sm font-medium ${view === 'exceptions' ? 'bg-green-700 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
          Exceptions
        </button>
      </div>
      {/* Current selection summary */}
      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
        <div className="flex items-center">
          <CalendarIcon className="text-green-700 mr-2" size={18} />
          <span className="text-sm font-medium text-gray-700">
            {getSummaryText()}
          </span>
        </div>
      </div>
      {/* Pattern selection view */}
      {view === 'patterns' && <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">
            Select a starting pattern:
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => applyPattern('weekdays')} className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <div className="font-medium text-gray-800">Weekdays</div>
              <div className="text-xs text-gray-500">Mon-Fri, 9am-5pm</div>
            </button>
            <button onClick={() => applyPattern('weekends')} className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <div className="font-medium text-gray-800">Weekends</div>
              <div className="text-xs text-gray-500">Sat-Sun, 8am-8pm</div>
            </button>
            <button onClick={() => applyPattern('evenings')} className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <div className="font-medium text-gray-800">Evenings Only</div>
              <div className="text-xs text-gray-500">All days, 6pm-12am</div>
            </button>
            <button onClick={() => applyPattern('mornings')} className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <div className="font-medium text-gray-800">Mornings Only</div>
              <div className="text-xs text-gray-500">All days, 6am-12pm</div>
            </button>
            <button onClick={() => applyPattern('allday')} className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <div className="font-medium text-gray-800">Always Available</div>
              <div className="text-xs text-gray-500">All days, all times</div>
            </button>
            <button onClick={() => applyPattern('clear')} className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <div className="font-medium text-gray-800">Clear All</div>
              <div className="text-xs text-gray-500">Start from scratch</div>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            After selecting a pattern, you can refine it in the Calendar view.
          </p>
        </div>}
      {/* Calendar view with specific time ranges */}
      {view === 'calendar' && <div className="space-y-4">
          {/* Day selector */}
          <div className="grid grid-cols-7 gap-1">
            {days.map(day => <button key={day.id} onClick={() => isDayAvailable(day.id) ? null : setEditingDay(day.id)} className={`px-2 py-1.5 text-sm rounded-lg transition-colors ${isDayAvailable(day.id) ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {day.label}
              </button>)}
          </div>
          {/* Time ranges for each day */}
          <div className="space-y-2">
            {days.filter(day => isDayAvailable(day.id)).map(day => <div key={day.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-700">
                      {day.label}
                    </div>
                    <button onClick={() => setEditingDay(day.id)} className="text-xs text-green-700 hover:text-green-800">
                      Add time
                    </button>
                  </div>
                  {value[day.id].map((range, idx) => <div key={idx} className="flex items-center justify-between bg-white rounded px-3 py-2 mb-1 border border-gray-100">
                      <div className="flex items-center text-sm text-gray-600">
                        <ClockIcon size={14} className="mr-1 text-green-700" />
                        {formatTimeRange(range)}
                      </div>
                      <button onClick={() => removeTimeRange(day.id, idx)} className="text-gray-400 hover:text-gray-600">
                        <XIcon size={16} />
                      </button>
                    </div>)}
                </div>)}
          </div>
          {/* Time range editor */}
          {editingDay && <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-3">
              <div className="text-sm font-medium text-gray-700 mb-3">
                Add time for {days.find(d => d.id === editingDay)?.label}
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <select value={startTime} onChange={e => setStartTime(e.target.value)} className="bg-white border border-gray-300 text-gray-700 text-sm rounded px-3 py-2 w-28">
                  {Array.from({
              length: 24
            }).map((_, i) => <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                      {formatTime(`${i.toString().padStart(2, '0')}:00`)}
                    </option>)}
                </select>
                <span className="text-gray-500">to</span>
                <select value={endTime} onChange={e => setEndTime(e.target.value)} className="bg-white border border-gray-300 text-gray-700 text-sm rounded px-3 py-2 w-28">
                  {Array.from({
              length: 24
            }).map((_, i) => <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                      {formatTime(`${i.toString().padStart(2, '0')}:00`)}
                    </option>)}
                </select>
              </div>
              <div className="flex justify-between">
                <button onClick={() => setEditingDay(null)} className="text-sm text-gray-500 hover:text-gray-700">
                  Cancel
                </button>
                <button onClick={addTimeRange} className="bg-green-700 text-white px-4 py-1 rounded text-sm font-medium hover:bg-green-800 flex items-center">
                  <PlusIcon size={14} className="mr-1" />
                  Add
                </button>
              </div>
            </div>}
          {/* Add new day prompt when none selected */}
          {days.every(day => !isDayAvailable(day.id)) && !editingDay && <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
              Select a day to add your availability
            </div>}
        </div>}
      {/* Exceptions view */}
      {view === 'exceptions' && <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">
            Add exceptions to your availability:
          </h3>
          <div className="flex">
            <input type="text" value={exception} onChange={e => setException(e.target.value)} placeholder="e.g., 'No Monday evenings' or 'No weekends'" className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm" />
            <button onClick={addException} className="bg-green-700 text-white px-4 py-2 rounded-r-lg text-sm font-medium">
              Add
            </button>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              Type natural language exceptions like:
            </p>
            <ul className="text-xs text-gray-500 mt-1 space-y-1">
              <li>• "No Monday evenings"</li>
              <li>• "No weekends"</li>
              <li>• "Not available Thursdays"</li>
              <li>• "Only mornings on Friday"</li>
            </ul>
          </div>
          {/* Here you would show a list of applied exceptions */}
          <div className="space-y-2 mt-3">
            <h4 className="text-xs font-medium text-gray-700">
              Applied Exceptions:
            </h4>
            {/* This would be dynamically generated based on exceptions */}
            <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-700">
                No availability on Mondays
              </span>
              <button className="text-gray-400 hover:text-gray-600">
                <XIcon size={16} />
              </button>
            </div>
          </div>
        </div>}
    </div>;
};