import React, { useEffect, useState, useRef, lazy, Component } from 'react';
import { SendIcon, CheckIcon, XIcon, CalendarIcon, MapPinIcon, ClockIcon, HeartPulseIcon } from 'lucide-react';
// Define types for our chat
type MessageType = 'user' | 'bot';
type ChatStep = 'INTRO' | 'CONFIRM_AVAILABILITY' | 'TRAVEL_DISTANCE' | 'SUMMARY' | 'CLOSING';
type TimeRange = string; // e.g. "9 am-6 pm"
interface Message {
  id: string;
  type: MessageType;
  text: string;
  includeAvailability?: boolean;
  includeTravelDistance?: boolean;
  includeSummary?: boolean;
  includeExample?: boolean;
}
interface Availability {
  monday: TimeRange | null;
  tuesday: TimeRange | null;
  wednesday: TimeRange | null;
  thursday: TimeRange | null;
  friday: TimeRange | null;
  saturday: TimeRange | null;
  sunday: TimeRange | null;
}
// Helper to parse availability from text
const parseAvailabilityFromText = (text: string): Availability => {
  // Create empty availability object - we'll only fill in what's mentioned in this input
  const availability: Availability = {
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null
  };
  // Common patterns for days
  const dayPatterns = {
    monday: /\b(monday|mon)\b/i,
    tuesday: /\b(tuesday|tue|tues)\b/i,
    wednesday: /\b(wednesday|wed)\b/i,
    thursday: /\b(thursday|thu|thurs)\b/i,
    friday: /\b(friday|fri)\b/i,
    saturday: /\b(saturday|sat)\b/i,
    sunday: /\b(sunday|sun)\b/i
  };
  // Check for removal patterns like "I can't work Wednesday anymore" or "Remove Wednesday"
  const removalPattern = /\b(can't|cannot|cant|don't|dont|won't|wont|no longer|not|remove|delete|take off|off|unavailable)\b.*?\b(work|available)/i;
  const isRemoval = removalPattern.test(text.toLowerCase());
  // Check for day ranges like "Monday-Friday" or "Mon-Fri"
  const dayRangePattern = /(monday|mon|tuesday|tue|tues|wednesday|wed|thursday|thu|thurs|friday|fri|saturday|sat|sunday|sun)\s*(?:-|to|–|through)\s*(monday|mon|tuesday|tue|tues|wednesday|wed|thursday|thu|thurs|friday|fri|saturday|sat|sunday|sun)/gi;
  const dayRanges = [...text.matchAll(dayRangePattern)];
  for (const range of dayRanges) {
    const startDay = normalizeDay(range[1].toLowerCase());
    const endDay = normalizeDay(range[2].toLowerCase());
    if (startDay && endDay) {
      const days = getDaysInRange(startDay, endDay);
      // Look for time ranges near this day range
      const timeRangePattern = /(\d{1,2})(?::(\d{1,2}))?\s*(am|pm)?\s*(?:-|to|–)\s*(\d{1,2})(?::(\d{1,2}))?\s*(am|pm)/i;
      const nearbyText = text.substring(Math.max(0, range.index - 30), Math.min(text.length, range.index + 50));
      const timeMatch = nearbyText.match(timeRangePattern);
      if (timeMatch) {
        const timeRange = formatTimeRange(timeMatch);
        days.forEach(day => {
          availability[day as keyof Availability] = isRemoval ? 'None' : timeRange;
        });
      } else if (isRemoval) {
        // If this is a removal request and no time specified, mark the entire days as unavailable
        days.forEach(day => {
          availability[day as keyof Availability] = 'None';
        });
      }
    }
  }
  // Check for individual days with time ranges or removal
  for (const [day, pattern] of Object.entries(dayPatterns)) {
    if (pattern.test(text)) {
      // Find position of day mention
      const match = text.match(pattern);
      if (match && match.index !== undefined) {
        if (isRemoval) {
          // For removal requests, set the day to "None"
          availability[day as keyof Availability] = 'None';
        } else {
          // Look for time ranges near this day mention
          const timeRangePattern = /(\d{1,2})(?::(\d{1,2}))?\s*(am|pm)?\s*(?:-|to|–)\s*(\d{1,2})(?::(\d{1,2}))?\s*(am|pm)/i;
          const nearbyText = text.substring(Math.max(0, match.index - 10), Math.min(text.length, match.index + 40));
          const timeMatch = nearbyText.match(timeRangePattern);
          if (timeMatch) {
            const timeRange = formatTimeRange(timeMatch);
            availability[day as keyof Availability] = timeRange;
          } else {
            // If no time range specified for a non-removal request, assume standard hours
            availability[day as keyof Availability] = '9 am–5 pm';
          }
        }
      }
    }
  }
  // Check for specific removal statements without time ranges
  // For example: "I can't work Wednesday anymore"
  if (isRemoval) {
    for (const [day, pattern] of Object.entries(dayPatterns)) {
      if (pattern.test(text)) {
        availability[day as keyof Availability] = 'None';
      }
    }
  }
  // Check for weekdays and weekends
  if (/\b(weekday|weekdays)\b/i.test(text)) {
    if (isRemoval) {
      availability.monday = 'None';
      availability.tuesday = 'None';
      availability.wednesday = 'None';
      availability.thursday = 'None';
      availability.friday = 'None';
    } else {
      const timeRangePattern = /(\d{1,2})(?::(\d{1,2}))?\s*(am|pm)?\s*(?:-|to|–)\s*(\d{1,2})(?::(\d{1,2}))?\s*(am|pm)/i;
      const match = text.match(timeRangePattern);
      if (match) {
        const timeRange = formatTimeRange(match);
        availability.monday = timeRange;
        availability.tuesday = timeRange;
        availability.wednesday = timeRange;
        availability.thursday = timeRange;
        availability.friday = timeRange;
      } else {
        // Default working hours if no time specified
        const defaultHours = '9 am–5 pm';
        availability.monday = defaultHours;
        availability.tuesday = defaultHours;
        availability.wednesday = defaultHours;
        availability.thursday = defaultHours;
        availability.friday = defaultHours;
      }
    }
  }
  if (/\b(weekend|weekends)\b/i.test(text)) {
    if (isRemoval || /\b(off|unavailable)\b/i.test(text)) {
      availability.saturday = 'None';
      availability.sunday = 'None';
    } else {
      const timeRangePattern = /(\d{1,2})(?::(\d{1,2}))?\s*(am|pm)?\s*(?:-|to|–)\s*(\d{1,2})(?::(\d{1,2}))?\s*(am|pm)/i;
      const match = text.match(timeRangePattern);
      if (match) {
        const timeRange = formatTimeRange(match);
        availability.saturday = timeRange;
        availability.sunday = timeRange;
      } else {
        // Default weekend hours if no time specified
        const defaultHours = '10 am–4 pm';
        availability.saturday = defaultHours;
        availability.sunday = defaultHours;
      }
    }
  }
  // Check for explicit mentions of "off" or "no"
  for (const [day, pattern] of Object.entries(dayPatterns)) {
    const offPattern = new RegExp(`${pattern.source}\\s*(?:off|no)`, 'i');
    if (offPattern.test(text)) {
      availability[day as keyof Availability] = 'None';
    }
  }
  if (/\b(weekends?\s*off|no\s*weekends?)\b/i.test(text)) {
    availability.saturday = 'None';
    availability.sunday = 'None';
  }
  return availability;
};
// Helper to normalize day names
const normalizeDay = (day: string): string | null => {
  if (/^(mon)/i.test(day)) return 'monday';
  if (/^(tue)/i.test(day)) return 'tuesday';
  if (/^(wed)/i.test(day)) return 'wednesday';
  if (/^(thu)/i.test(day)) return 'thursday';
  if (/^(fri)/i.test(day)) return 'friday';
  if (/^(sat)/i.test(day)) return 'saturday';
  if (/^(sun)/i.test(day)) return 'sunday';
  return null;
};
// Helper to get all days in a range (e.g., "Monday-Friday")
const getDaysInRange = (startDay: string, endDay: string): string[] => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const startIndex = days.indexOf(startDay);
  const endIndex = days.indexOf(endDay);
  if (startIndex === -1 || endIndex === -1) return [];
  // Handle wrapping around the week
  if (startIndex <= endIndex) {
    return days.slice(startIndex, endIndex + 1);
  } else {
    return [...days.slice(startIndex), ...days.slice(0, endIndex + 1)];
  }
};
// Helper to format time ranges
const formatTimeRange = (match: RegExpMatchArray): string => {
  const startHour = parseInt(match[1]);
  const startMin = match[2] ? parseInt(match[2]) : 0;
  const startAmPm = match[3]?.toLowerCase() || (startHour < 12 ? 'am' : 'pm');
  const endHour = parseInt(match[4]);
  const endMin = match[5] ? parseInt(match[5]) : 0;
  const endAmPm = match[6]?.toLowerCase() || (endHour < 12 ? 'am' : 'pm');
  const formatTime = (hour: number, min: number, ampm: string) => {
    let displayHour = hour;
    if (ampm === 'pm' && hour < 12) displayHour += 12;
    if (ampm === 'am' && hour === 12) displayHour = 0;
    displayHour = displayHour % 12 || 12;
    return `${displayHour}${min > 0 ? ':' + min.toString().padStart(2, '0') : ''} ${ampm}`;
  };
  const start = formatTime(startHour, startMin, startAmPm);
  const end = formatTime(endHour, endMin, endAmPm);
  return `${start}–${end}`;
};
// Parse distance from text
const parseDistanceFromText = (text: string): number | null => {
  const distancePattern = /\b(\d+)\s*(miles?|mi)\b/i;
  const match = text.match(distancePattern);
  if (match) {
    return parseInt(match[1]);
  }
  // Just look for a number if no explicit mention of miles
  const numberPattern = /\b(\d+)\b/;
  const numMatch = text.match(numberPattern);
  if (numMatch) {
    return parseInt(numMatch[1]);
  }
  return null;
};
// Component to display example format
const ExampleFormat: React.FC = () => {
  return <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-500 mt-2">
      <p className="text-sm text-gray-600 font-medium mb-2">
        Examples you can try:
      </p>
      <div className="space-y-2 text-sm text-gray-700">
        <p className="italic">
          "I can work Monday–Wednesday 9 am–6 pm, Thursday–Friday 10 am–5 pm"
        </p>
        <p className="italic">
          "I'm available weekdays 8 am–4 pm and Saturdays 10 am–2 pm"
        </p>
        <p className="italic">
          "Monday 8 am–12 pm and 4 pm–8 pm, weekends off"
        </p>
      </div>
    </div>;
};
// Component to display availability
const AvailabilityDisplay: React.FC<{
  availability: Availability;
}> = ({
  availability
}) => {
  return <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm space-y-3">
      <div className="flex items-center mb-2">
        <CalendarIcon size={18} className="text-green-600 mr-2" />
        <h3 className="text-sm font-semibold text-gray-900">
          Your Availability
        </h3>
      </div>
      <div className="bg-gray-50 rounded-lg p-3">
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="w-28 font-medium text-gray-700 text-sm">
              Monday:
            </span>
            <span className="text-gray-700 text-sm">
              {availability.monday || 'None'}
            </span>
          </li>
          <li className="flex items-start">
            <span className="w-28 font-medium text-gray-700 text-sm">
              Tuesday:
            </span>
            <span className="text-gray-700 text-sm">
              {availability.tuesday || 'None'}
            </span>
          </li>
          <li className="flex items-start">
            <span className="w-28 font-medium text-gray-700 text-sm">
              Wednesday:
            </span>
            <span className="text-gray-700 text-sm">
              {availability.wednesday || 'None'}
            </span>
          </li>
          <li className="flex items-start">
            <span className="w-28 font-medium text-gray-700 text-sm">
              Thursday:
            </span>
            <span className="text-gray-700 text-sm">
              {availability.thursday || 'None'}
            </span>
          </li>
          <li className="flex items-start">
            <span className="w-28 font-medium text-gray-700 text-sm">
              Friday:
            </span>
            <span className="text-gray-700 text-sm">
              {availability.friday || 'None'}
            </span>
          </li>
          <li className="flex items-start">
            <span className="w-28 font-medium text-gray-700 text-sm">
              Saturday:
            </span>
            <span className="text-gray-700 text-sm">
              {availability.saturday || 'None'}
            </span>
          </li>
          <li className="flex items-start">
            <span className="w-28 font-medium text-gray-700 text-sm">
              Sunday:
            </span>
            <span className="text-gray-700 text-sm">
              {availability.sunday || 'None'}
            </span>
          </li>
        </ul>
      </div>
    </div>;
};
// Component to display travel distance
const TravelDistanceDisplay: React.FC<{
  distance: number;
}> = ({
  distance
}) => {
  return <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
      <div className="flex items-center mb-2">
        <MapPinIcon size={18} className="text-green-600 mr-2" />
        <h3 className="text-sm font-semibold text-gray-900">
          Your Travel Distance
        </h3>
      </div>
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-gray-700 text-sm">Up to {distance} miles</p>
      </div>
    </div>;
};
// Component to display the complete summary
const SummaryDisplay: React.FC<{
  availability: Availability;
  distance: number;
}> = ({
  availability,
  distance
}) => {
  return <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm space-y-4">
      <h3 className="text-base font-semibold text-gray-900 flex items-center">
        <ClockIcon size={18} className="text-green-600 mr-2" />
        Your Working Preferences
      </h3>
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center">
            <CalendarIcon size={16} className="mr-2" />
            Availability
          </h4>
          <ul className="space-y-1.5 ml-2">
            <li className="flex items-start">
              <span className="w-28 font-medium text-gray-700 text-sm">
                Monday:
              </span>
              <span className="text-gray-700 text-sm">
                {availability.monday || 'None'}
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-28 font-medium text-gray-700 text-sm">
                Tuesday:
              </span>
              <span className="text-gray-700 text-sm">
                {availability.tuesday || 'None'}
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-28 font-medium text-gray-700 text-sm">
                Wednesday:
              </span>
              <span className="text-gray-700 text-sm">
                {availability.wednesday || 'None'}
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-28 font-medium text-gray-700 text-sm">
                Thursday:
              </span>
              <span className="text-gray-700 text-sm">
                {availability.thursday || 'None'}
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-28 font-medium text-gray-700 text-sm">
                Friday:
              </span>
              <span className="text-gray-700 text-sm">
                {availability.friday || 'None'}
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-28 font-medium text-gray-700 text-sm">
                Saturday:
              </span>
              <span className="text-gray-700 text-sm">
                {availability.saturday || 'None'}
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-28 font-medium text-gray-700 text-sm">
                Sunday:
              </span>
              <span className="text-gray-700 text-sm">
                {availability.sunday || 'None'}
              </span>
            </li>
          </ul>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center">
            <MapPinIcon size={16} className="mr-2" />
            Travel Distance
          </h4>
          <p className="text-sm text-gray-700 ml-2">Up to {distance} miles</p>
        </div>
      </div>
    </div>;
};
export const WorkPreferencesChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentStep, setCurrentStep] = useState<ChatStep>('INTRO');
  const [isTyping, setIsTyping] = useState(false);
  const [availability, setAvailability] = useState<Availability>({
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null
  });
  const [travelDistance, setTravelDistance] = useState<number>(0);
  const [hasExistingPreferences, setHasExistingPreferences] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Initialize the chat with intro message
  useEffect(() => {
    // Check if user has existing preferences (could be from localStorage or API)
    const checkExistingPreferences = () => {
      // For demo, we'll just check if there's anything in localStorage
      const savedPrefs = localStorage.getItem('workPreferences');
      if (savedPrefs) {
        try {
          const prefs = JSON.parse(savedPrefs);
          setAvailability(prefs.availability);
          setTravelDistance(prefs.travelDistance);
          setHasExistingPreferences(true);
          return true;
        } catch (e) {
          return false;
        }
      }
      return false;
    };
    const hasPrefs = checkExistingPreferences();
    // Initialize with the appropriate intro message
    if (hasPrefs) {
      // Working Preferences Already Set flow
      setMessages([{
        id: '1',
        type: 'bot',
        text: "Hey there, here are the working preferences you currently have set. If you'd like to make any changes, just let me know!",
        includeSummary: true
      }]);
    } else {
      // No Working Preferences Set Yet flow
      setMessages([{
        id: '1',
        type: 'bot',
        text: "Hi, I'm Mavi from Arya Health! We've developed a personalized patient-matching system designed specifically for healthcare professionals like you. By sharing your availability preferences, we can create a schedule that respects your work-life balance and professional well-being."
      }, {
        id: '2',
        type: 'bot',
        text: "Could you share when you're available to work? This will help us match you with opportunities that align with your lifestyle and preferences.",
        includeExample: true
      }]);
    }
  }, []);
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages]);
  // Helper to add a new message
  const addMessage = (text: string, type: MessageType, options: any = {}) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      text,
      ...options
    };
    setMessages(prev => [...prev, newMessage]);
  };
  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    // Add user message
    addMessage(inputText, 'user');
    // Clear input and show typing indicator
    setInputText('');
    setIsTyping(true);
    // Process the message based on current step
    setTimeout(() => {
      setIsTyping(false);
      if (currentStep === 'INTRO' || hasExistingPreferences) {
        // Parse availability from text
        const parsedAvailability = parseAvailabilityFromText(inputText);
        // Check if we're updating travel distance
        if (inputText.toLowerCase().includes('travel') || inputText.toLowerCase().includes('distance') || inputText.toLowerCase().includes('miles')) {
          const parsedDistance = parseDistanceFromText(inputText);
          if (parsedDistance) {
            setTravelDistance(parsedDistance);
            addMessage(`Perfect! I've updated your travel distance to ${parsedDistance} miles.`, 'bot');
            // Save the updated preferences
            savePreferences({
              availability,
              travelDistance: parsedDistance
            });
            addMessage("Your preferences are now set! You'll start seeing patient profiles that better match your schedule and location. Please let me know if you need to make any other changes.", 'bot');
            return;
          }
        }
        // Check if any availability was parsed
        const hasAvailability = Object.values(parsedAvailability).some(v => v !== null);
        if (hasAvailability) {
          // IMPORTANT CHANGE: Merge the parsed availability with existing availability
          // instead of replacing it entirely
          const mergedAvailability = {
            ...availability
          };
          // Only update days that were mentioned in the current input
          Object.entries(parsedAvailability).forEach(([day, value]) => {
            if (value !== null) {
              mergedAvailability[day as keyof Availability] = value;
            }
          });
          // Update availability with merged values
          setAvailability(mergedAvailability);
          // Detect if this is an "also" or additional availability message
          const isAdditionalAvailability = inputText.toLowerCase().includes('also') || inputText.toLowerCase().includes('additional') || inputText.toLowerCase().includes('add') || inputText.toLowerCase().includes('and');
          // Show confirmation with appropriate wording
          const confirmationMessage = isAdditionalAvailability ? "I've updated your availability. Does this schedule look right to you?" : "Thanks! I've recorded your availability. Does this schedule look right to you?";
          addMessage(confirmationMessage, 'bot', {
            includeAvailability: true
          });
          setCurrentStep('CONFIRM_AVAILABILITY');
        } else if (inputText.toLowerCase().includes('yes') && hasExistingPreferences) {
          // User is confirming existing preferences
          addMessage("Great! Your preferences are all set. You'll now see patient that better align with your schedule and location preferences. This personalized matching should help you maintain better work-life balance.", 'bot');
        } else {
          // Couldn't parse availability
          addMessage("I'm having trouble understanding your availability. Could you phrase it like one of these examples?", 'bot', {
            includeExample: true
          });
        }
      } else if (currentStep === 'CONFIRM_AVAILABILITY') {
        if (inputText.toLowerCase().includes('yes') || inputText.toLowerCase().includes('correct') || inputText.toLowerCase().includes('looks good')) {
          // User confirmed availability, move to travel distance
          addMessage('Perfect! Now, how far are you willing to travel to see patients, in miles? This helps us find opportunities within your preferred commute distance.', 'bot');
          setCurrentStep('TRAVEL_DISTANCE');
        } else if (inputText.toLowerCase().includes('no')) {
          // User wants to change availability
          addMessage('What would you like to change about your availability?', 'bot');
          setCurrentStep('INTRO');
        } else {
          // Try to parse changes to availability
          const updatedAvailability = parseAvailabilityFromText(inputText);
          const hasUpdates = Object.entries(updatedAvailability).some(([day, value]) => value !== null && value !== availability[day as keyof Availability]);
          if (hasUpdates) {
            // Merge the updates with existing availability
            const mergedAvailability = {
              ...availability
            };
            Object.entries(updatedAvailability).forEach(([day, value]) => {
              if (value !== null) {
                mergedAvailability[day as keyof Availability] = value;
              }
            });
            setAvailability(mergedAvailability);
            addMessage("I've updated your schedule. Does this look better now?", 'bot', {
              includeAvailability: true
            });
          } else {
            // Couldn't understand the changes
            addMessage("I'm not sure what changes you'd like to make. Could you please specify which days or times need adjustment?", 'bot');
          }
        }
      } else if (currentStep === 'TRAVEL_DISTANCE') {
        const parsedDistance = parseDistanceFromText(inputText);
        if (parsedDistance) {
          setTravelDistance(parsedDistance);
          // Save preferences
          savePreferences({
            availability,
            travelDistance: parsedDistance
          });
          // Show final confirmation
          addMessage(`Great! I've set your travel radius to ${parsedDistance} miles.`, 'bot');
          addMessage('Your preferences are now complete! You should see better matched opportunities in your portal. Feel free to let me know if you want to make any changes now or come back to this chat anytime to update your preferences.', 'bot', {
            includeSummary: true
          });
          setCurrentStep('CLOSING');
        } else {
          addMessage('I need a specific distance in miles. For example, "15 miles" or just "10".', 'bot');
        }
      }
    }, 1000);
  };
  // Save preferences (could be to localStorage or API)
  const savePreferences = (prefs: {
    availability: Availability;
    travelDistance: number;
  }) => {
    localStorage.setItem('workPreferences', JSON.stringify(prefs));
    setHasExistingPreferences(true);
  };
  return <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-gray-200 shadow-sm border-b p-4 flex items-center justify-center">
        <img src="/Line_Stack__Name_Health__Color_black-removebg-preview.png" loading="lazy" alt="ARYA HEALTH" className="h-10" />
      </div>
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${message.type === 'user' ? 'bg-gradient-to-br from-green-600 to-green-700 text-white rounded-br-sm' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'}`}>
              <p className="text-sm">{message.text}</p>
              {message.includeExample && <div className="mt-3">
                  <ExampleFormat />
                </div>}
              {message.includeAvailability && <div className="mt-3">
                  <AvailabilityDisplay availability={availability} />
                </div>}
              {message.includeTravelDistance && <div className="mt-3">
                  <TravelDistanceDisplay distance={travelDistance} />
                </div>}
              {message.includeSummary && <div className="mt-3">
                  <SummaryDisplay availability={availability} distance={travelDistance} />
                </div>}
            </div>
          </div>)}
        {isTyping && <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm p-4 shadow-sm max-w-[85%]">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{
              animationDelay: '0ms'
            }}></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{
              animationDelay: '150ms'
            }}></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{
              animationDelay: '300ms'
            }}></div>
              </div>
            </div>
          </div>}
        <div ref={messagesEndRef} />
      </div>
      {/* Input area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex">
          <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Type your availability here..." className="flex-1 bg-gray-100 border border-gray-300 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500" />
          <button onClick={handleSendMessage} className="ml-2 bg-green-600 text-white rounded-full p-3 hover:bg-green-700 transition-colors shadow-sm">
            <SendIcon size={18} />
          </button>
        </div>
      </div>
    </div>;
};