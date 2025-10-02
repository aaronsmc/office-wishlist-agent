import React from 'react';
import { MapPinIcon, DollarSignIcon, CalendarIcon } from 'lucide-react';
type FieldSummaryProps = {
  field: 'availability' | 'distance' | 'rate';
  data: any;
  onEdit?: () => void;
};
export const FieldSummary = ({
  field,
  data,
  onEdit
}: FieldSummaryProps) => {
  const renderFieldContent = () => {
    switch (field) {
      case 'distance':
        return <div className="flex items-start">
            <MapPinIcon size={16} className="mt-0.5 text-teal-400 mr-3 opacity-80" />
            <div className="flex-1">
              <p className="text-xs font-medium text-white/80">
                Travel Distance
              </p>
              <p className="text-xs text-white/60">Up to {data} miles</p>
            </div>
          </div>;
      case 'rate':
        return <div className="flex items-start">
            <DollarSignIcon size={16} className="mt-0.5 text-teal-400 mr-3 opacity-80" />
            <div className="flex-1">
              <p className="text-xs font-medium text-white/80">Hourly Rate</p>
              <p className="text-xs text-white/60">
                ${data.min}-${data.max}/hr
              </p>
            </div>
          </div>;
      case 'availability':
        return <div className="flex items-start">
            <CalendarIcon size={16} className="mt-0.5 text-teal-400 mr-3 opacity-80" />
            <div className="flex-1">
              <p className="text-xs font-medium text-white/80">
                Available Days & Times
              </p>
              <p className="text-xs text-white/60">
                {formatAvailability(data)}
              </p>
            </div>
          </div>;
      default:
        return null;
    }
  };
  const formatAvailability = (availability: Record<string, any[]>) => {
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
    const availableDays = days.filter(day => availability[day.id]?.length > 0);
    if (availableDays.length === 0) return 'No availability set';
    return availableDays.map(day => {
      const ranges = availability[day.id];
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
  return <div className="space-y-3">
      <h3 className="text-sm font-medium text-white/90">Updated Information</h3>
      <div className="space-y-3">{renderFieldContent()}</div>
      {onEdit && <div className="pt-1">
          <button onClick={onEdit} className="text-xs text-teal-400 hover:text-teal-300">
            Edit
          </button>
        </div>}
    </div>;
};