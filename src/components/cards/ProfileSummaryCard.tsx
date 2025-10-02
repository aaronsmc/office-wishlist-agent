import React from 'react';
import { useTheme } from '../../components/ThemeContext';
import { UserIcon, IdCardIcon, BriefcaseIcon, DollarSignIcon, CalendarIcon, MapPinIcon, HomeIcon, CalendarDaysIcon } from 'lucide-react';
type ProfileSummaryCardProps = {
  basicInfo: {
    name: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    zipcode?: string;
  };
  license: {
    type: string;
    number: string;
  };
  skills?: {
    yearsExperience: number;
    specialties: string[];
  };
  rate: {
    min: number;
    max: number;
  };
  availability: any;
  distance: number;
  onConfirm: () => void;
};
export const ProfileSummaryCard = ({
  basicInfo,
  license,
  skills,
  rate,
  availability,
  distance,
  onConfirm
}: ProfileSummaryCardProps) => {
  const {
    theme
  } = useTheme();
  // Check if availability is set
  const hasAvailability = Object.values(availability).some((day: any) => Array.isArray(day) && day.length > 0);
  // Check if address is set
  const hasAddress = basicInfo.addressLine1 || basicInfo.city || basicInfo.zipcode;
  // Format experience
  const formatExperience = (years: number) => {
    if (years === 0) return 'Less than 1 year';
    if (years === 1) return '1-2 years';
    if (years === 3) return '3-5 years';
    if (years === 6) return '6-10 years';
    if (years === 10) return '10+ years';
    return `${years} years`;
  };
  // Format availability into a readable string
  const formatAvailability = () => {
    if (!hasAvailability) return 'No availability set';
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
    return availableDays.map(day => {
      const ranges = availability[day.id];
      const formattedRanges = ranges.map((range: any) => {
        // Handle TimeRange object format
        if (typeof range === 'object' && range !== null && 'start' in range && 'end' in range) {
          const formatTime = (time: string) => {
            const [hours, minutes] = time.split(':').map(Number);
            const period = hours >= 12 ? 'pm' : 'am';
            const displayHours = hours % 12 || 12;
            return `${displayHours}${minutes > 0 ? ':' + minutes.toString().padStart(2, '0') : ''}${period}`;
          };
          return `${formatTime(range.start)}-${formatTime(range.end)}`;
        }
        // Handle string format (morning, afternoon, evening)
        else if (typeof range === 'string') {
          if (range === 'morning') return '6am-12pm';
          if (range === 'afternoon') return '12pm-6pm';
          if (range === 'evening') return '6pm-12am';
          // If it's already a range string like "9:00-17:00", format it
          if (range.includes('-')) {
            const [start, end] = range.split('-');
            const formatTimeStr = (timeStr: string) => {
              const [hours, minutes] = timeStr.split(':').map(Number);
              const period = hours >= 12 ? 'pm' : 'am';
              const displayHours = hours % 12 || 12;
              return `${displayHours}${minutes > 0 ? ':' + minutes.toString().padStart(2, '0') : ''}${period}`;
            };
            return `${formatTimeStr(start)}-${formatTimeStr(end)}`;
          }
          return range;
        }
        return String(range);
      });
      return `${day.label} (${formattedRanges.join(', ')})`;
    }).join(', ');
  };
  return <div className="w-full rounded-lg overflow-hidden">
      <div className="space-y-3 mt-2">
        <div className="flex items-start">
          <div className={`mr-2 ${theme === 'dark' ? 'text-teal-400' : 'text-green-700'}`}>
            <UserIcon size={16} />
          </div>
          <div className="ml-1">
            <div className="text-xs font-medium">Basic Information</div>
            <div className="text-xs text-gray-600">
              {basicInfo.name || 'Not set'}
            </div>
          </div>
        </div>
        {basicInfo.dateOfBirth && <div className="flex items-start">
            <div className={`mr-2 ${theme === 'dark' ? 'text-teal-400' : 'text-green-700'}`}>
              <CalendarDaysIcon size={16} />
            </div>
            <div className="ml-1">
              <div className="text-xs font-medium">Date of Birth</div>
              <div className="text-xs text-gray-600">
                {basicInfo.dateOfBirth}
              </div>
            </div>
          </div>}
        {hasAddress && <div className="flex items-start">
            <div className={`mr-2 ${theme === 'dark' ? 'text-teal-400' : 'text-green-700'}`}>
              <HomeIcon size={16} />
            </div>
            <div className="ml-1">
              <div className="text-xs font-medium">Address</div>
              {basicInfo.addressLine1 && <div className="text-xs text-gray-600">
                  {basicInfo.addressLine1}
                </div>}
              {basicInfo.city && basicInfo.zipcode && <div className="text-xs text-gray-600">
                  {basicInfo.city}, {basicInfo.zipcode}
                </div>}
            </div>
          </div>}
        <div className="flex items-start">
          <div className={`mr-2 ${theme === 'dark' ? 'text-teal-400' : 'text-green-700'}`}>
            <IdCardIcon size={16} />
          </div>
          <div className="ml-1">
            <div className="text-xs font-medium">License</div>
            <div className="text-xs text-gray-600">
              {license.type || 'Not set'}
            </div>
            {license.number && <div className="text-xs text-gray-600">
                License #: {license.number}
              </div>}
          </div>
        </div>
        <div className="flex items-start">
          <div className={`mr-2 ${theme === 'dark' ? 'text-teal-400' : 'text-green-700'}`}>
            <BriefcaseIcon size={16} />
          </div>
          <div className="ml-1">
            <div className="text-xs font-medium">Experience</div>
            <div className="text-xs text-gray-600">
              {skills ? formatExperience(skills.yearsExperience) : 'Less than 1 year'}
            </div>
            {skills && skills.specialties && skills.specialties.length > 0 && <div className="text-xs text-gray-600">
                Specialties: {skills.specialties.join(', ')}
              </div>}
          </div>
        </div>
        <div className="flex items-start">
          <div className={`mr-2 ${theme === 'dark' ? 'text-teal-400' : 'text-green-700'}`}>
            <DollarSignIcon size={16} />
          </div>
          <div className="ml-1">
            <div className="text-xs font-medium">Rate</div>
            <div className="text-xs text-gray-600">
              ${rate.min}-${rate.max}/hr
            </div>
          </div>
        </div>
        <div className="flex items-start">
          <div className={`mr-2 ${theme === 'dark' ? 'text-teal-400' : 'text-green-700'}`}>
            <CalendarIcon size={16} />
          </div>
          <div className="ml-1">
            <div className="text-xs font-medium">Availability</div>
            <div className="text-xs text-gray-600 max-w-[200px]">
              {formatAvailability()}
            </div>
          </div>
        </div>
        <div className="flex items-start">
          <div className={`mr-2 ${theme === 'dark' ? 'text-teal-400' : 'text-green-700'}`}>
            <MapPinIcon size={16} />
          </div>
          <div className="ml-1">
            <div className="text-xs font-medium">Distance</div>
            <div className="text-xs text-gray-600">Up to {distance} miles</div>
          </div>
        </div>
      </div>
    </div>;
};