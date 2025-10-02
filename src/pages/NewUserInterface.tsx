import React, { useEffect, useState, useRef, lazy } from 'react';
import { SendIcon, ChevronLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TypingIndicator } from '../components/TypingIndicator';
import { parseAvailabilityFromText } from '../components/utils/availabilityParser';
import { useAgent } from '../components/AgentContext';
// Import specific cards
import { AvailabilityCard } from '../components/cards/AvailabilityCard';
import { DistanceCard } from '../components/cards/DistanceCard';
import { RateMicroCard } from '../components/MicroCards';
import { PreferenceSummary } from '../components/PreferenceSummary';
// Import the new AvailabilityList
import { AvailabilityList } from '../components/AvailabilityList';
// Import onboarding cards
import { BasicInfoCard } from '../components/cards/onboarding/BasicInfoCard';
import { LicenseCard } from '../components/cards/onboarding/LicenseCard';
import { ProfileSummaryCard } from '../components/cards/ProfileSummaryCard';
type Message = {
  id: string;
  sender: 'user' | 'agent';
  text: string | JSX.Element;
  includeCard?: {
    type: 'basicInfo' | 'license' | 'availability' | 'distance' | 'rate' | 'summary';
    data: any;
  };
};
type OnboardingStep = 'basicInfo' | 'license' | 'availability' | 'distance' | 'rate' | 'complete';
export const NewUserInterface = () => {
  const navigate = useNavigate();
  const {
    agentState,
    updateAgentState
  } = useAgent();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('basicInfo');
  const [initialOnboardingComplete, setInitialOnboardingComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  // Initialize the conversation
  useEffect(() => {
    // Start with the first message asking for availability
    setMessages([{
      id: '1',
      sender: 'agent',
      text: "Hi, my name is Mavi, from Arya Health. We have a new shift scheduling and matching system, and I'd love for you to tell me your working preferences."
    }, {
      id: '2',
      sender: 'agent',
      text: 'Could you start by sharing the hours you\'re available for work? (e.g., "I can work Monday–Wednesday 9 am–6 pm, Thursday–Friday 10 am–5 pm, and weekends off")',
      includeCard: {
        type: 'availability',
        data: agentState.availability
      }
    }]);
  }, []);
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  // Generate a random ID for messages
  const mid = () => Math.random().toString(36).slice(2);
  // Detect what field the user wants to edit
  const detectFieldToEdit = (text: string): 'basicInfo' | 'license' | 'availability' | 'distance' | 'rate' | null => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('name') || lowerText.includes('email') || lowerText.includes('phone') || lowerText.includes('contact') || lowerText.includes('basic info')) {
      return 'basicInfo';
    }
    if (lowerText.includes('license') || lowerText.includes('certification') || lowerText.includes('professional') || lowerText.includes('credential')) {
      return 'license';
    }
    if (lowerText.includes('availability') || lowerText.includes('schedule') || lowerText.includes('hours') || lowerText.includes('days') || lowerText.includes('time') || /\b(mon|tue|wed|thu|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday|weekday|weekend)\b/i.test(lowerText)) {
      return 'availability';
    }
    if (lowerText.includes('distance') || lowerText.includes('travel') || lowerText.includes('miles') || lowerText.includes('far')) {
      return 'distance';
    }
    if (lowerText.includes('rate') || lowerText.includes('pay') || lowerText.includes('salary') || lowerText.includes('money') || lowerText.includes('compensation') || lowerText.includes('wage') || lowerText.includes('dollar')) {
      return 'rate';
    }
    return null;
  };
  // Parse rate and distance from free text
  const parseRateDistanceFromText = (text: string): {
    matched: boolean;
    rate?: {
      min?: number;
      max?: number;
    };
    distance?: number;
  } => {
    const lower = text.toLowerCase();
    const out: {
      matched: boolean;
      rate?: {
        min?: number;
        max?: number;
      };
      distance?: number;
    } = {
      matched: false
    };
    // Distance examples: "distance 15", "travel up to 25 miles", "within 10mi", "increase distance to 15 miles", "set distance to 12"
    const distRegexes = [/\b(distance|travel)\s*(up to|to)?\s*(?<num>\d{1,3})\s*(mi|miles)?\b/, /\b(within|to)\s*(?<num>\d{1,3})\s*(mi|miles)\b/, /\b(increase|set)\s*(the\s*)?(travel\s*)?(distance)\s*(to)\s*(?<num>\d{1,3})\b/];
    for (const rx of distRegexes) {
      const m = lower.match(rx as RegExp) as any;
      if (m?.groups?.num) {
        const d = parseInt(m.groups.num, 10);
        if (!isNaN(d)) {
          out.distance = d;
          out.matched = true;
          break;
        }
      }
    }
    // Rate examples: "rate 30-40", "$35-$45", "pay 30 to 40", "min 30", "max 45"
    const rangeRegexes = [/\b(rate|pay|salary)\s*\$?(?<min>\d{2,3})\s*(?:-|to|–|—)\s*\$?(?<max>\d{2,3})\b/, /\$?(?<min>\d{2,3})\s*(?:-|to|–|—)\s*\$?(?<max>\d{2,3})\b/];
    for (const rx of rangeRegexes) {
      const m = lower.match(rx as RegExp) as any;
      if (m?.groups?.min && m?.groups?.max) {
        const min = parseInt(m.groups.min, 10);
        const max = parseInt(m.groups.max, 10);
        if (!isNaN(min) && !isNaN(max)) {
          out.rate = {
            ...(out.rate || {}),
            min,
            max
          };
          out.matched = true;
          break;
        }
      }
    }
    const singleRegexes: Array<[RegExp, 'min' | 'max']> = [[/\b(min\s*(rate)?|at least)\s*\$?(\d{2,3})\b/, 'min'], [/\b(max\s*(rate)?|at most)\s*\$?(\d{2,3})\b/, 'max'], [/\b(rate|pay|salary)\s*\$?(\d{2,3})\b/, 'min']];
    for (const [rx, kind] of singleRegexes) {
      const m = lower.match(rx);
      if (m) {
        const numStr = m[m.length - 1];
        const val = parseInt(numStr, 10);
        if (!isNaN(val)) {
          out.rate = {
            ...(out.rate || {}),
            [kind]: val
          };
          out.matched = true;
        }
      }
    }
    return out;
  };
  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    // Add user message to chat
    const userText = inputText;
    setMessages(prev => [...prev, {
      id: mid(),
      sender: 'user',
      text: userText
    }]);
    setInputText('');
    // Show typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // First, check if the user is asking to edit a specific field
      const fieldToEdit = detectFieldToEdit(userText);
      if (fieldToEdit) {
        // If they want to edit a specific field, show that card
        if (fieldToEdit === 'basicInfo') {
          setMessages(prev => [...prev, {
            id: mid(),
            sender: 'agent',
            text: "Let's update your basic information:",
            includeCard: {
              type: 'basicInfo',
              data: agentState.onboarding
            }
          }]);
        } else if (fieldToEdit === 'license') {
          setMessages(prev => [...prev, {
            id: mid(),
            sender: 'agent',
            text: "Let's update your professional license details:",
            includeCard: {
              type: 'license',
              data: agentState.onboarding
            }
          }]);
        } else if (fieldToEdit === 'availability') {
          // Check if there's a direct availability update in the text
          const parsedAvail = parseAvailabilityFromText(userText);
          if (parsedAvail.matched) {
            handleAvailabilityInput(userText);
          } else {
            // Just show the availability card
            setMessages(prev => [...prev, {
              id: mid(),
              sender: 'agent',
              text: "Let's update your availability:",
              includeCard: {
                type: 'availability',
                data: agentState.availability
              }
            }]);
          }
        } else if (fieldToEdit === 'distance') {
          // Check if there's a direct distance update in the text
          const parsedRD = parseRateDistanceFromText(userText);
          if (parsedRD.matched && typeof parsedRD.distance === 'number') {
            // Update the distance directly
            const updatedPreferences = {
              ...agentState.availability,
              distance: parsedRD.distance
            };
            updateAgentState('availability', updatedPreferences);
            setMessages(prev => [...prev, {
              id: mid(),
              sender: 'agent',
              text: `I've updated your travel distance to ${parsedRD.distance} miles. You can adjust it further if needed:`,
              includeCard: {
                type: 'distance',
                data: updatedPreferences
              }
            }]);
          } else {
            // Just show the distance card
            setMessages(prev => [...prev, {
              id: mid(),
              sender: 'agent',
              text: "Let's update your travel distance:",
              includeCard: {
                type: 'distance',
                data: agentState.availability
              }
            }]);
          }
        } else if (fieldToEdit === 'rate') {
          // Check if there's a direct rate update in the text
          const parsedRD = parseRateDistanceFromText(userText);
          if (parsedRD.matched && parsedRD.rate) {
            // Update the rate directly if we have both min and max
            if (parsedRD.rate.min && parsedRD.rate.max) {
              const updatedPreferences = {
                ...agentState.availability,
                rate: {
                  min: parsedRD.rate.min,
                  max: parsedRD.rate.max
                }
              };
              updateAgentState('availability', updatedPreferences);
              setMessages(prev => [...prev, {
                id: mid(),
                sender: 'agent',
                text: `I've updated your hourly rate to $${parsedRD.rate.min}-$${parsedRD.rate.max}. You can adjust it further if needed:`,
                includeCard: {
                  type: 'rate',
                  data: updatedPreferences
                }
              }]);
            } else {
              // Just show the rate card
              setMessages(prev => [...prev, {
                id: mid(),
                sender: 'agent',
                text: "Let's update your hourly rate:",
                includeCard: {
                  type: 'rate',
                  data: agentState.availability
                }
              }]);
            }
          } else {
            // Just show the rate card
            setMessages(prev => [...prev, {
              id: mid(),
              sender: 'agent',
              text: "Let's update your hourly rate:",
              includeCard: {
                type: 'rate',
                data: agentState.availability
              }
            }]);
          }
        }
        return;
      }
      // If not asking to edit a specific field, follow the normal flow based on current step
      if (currentStep === 'basicInfo') {
        // For basicInfo, we'll handle confirmation in the card submit
      } else if (currentStep === 'license') {
        // For license, we'll handle confirmation in the card submit
      } else if (currentStep === 'availability') {
        handleAvailabilityInput(userText);
      } else if (currentStep === 'distance') {
        // This is just for handling "yes" to confirm availability
        if (userText.toLowerCase().includes('yes')) {
          askForDistance();
        } else {
          // If they said no, ask them to try again
          setMessages(prev => [...prev, {
            id: mid(),
            sender: 'agent',
            text: 'I understand. Could you describe your availability again so I can get it right?'
          }]);
        }
      } else if (currentStep === 'rate') {
        // This is just for handling "yes" to confirm distance
        if (userText.toLowerCase().includes('yes')) {
          askForRate();
        } else {
          // If they said no, show the distance card again
          setMessages(prev => [...prev, {
            id: mid(),
            sender: 'agent',
            text: "Let's adjust your travel distance then:",
            includeCard: {
              type: 'distance',
              data: agentState.availability
            }
          }]);
        }
      } else if (currentStep === 'complete') {
        // This is just for handling "yes" to confirm rate
        if (userText.toLowerCase().includes('yes')) {
          completeOnboarding();
        } else {
          // Check if they're asking to edit something specific
          const fieldToEdit = detectFieldToEdit(userText);
          if (fieldToEdit) {
            setMessages(prev => [...prev, {
              id: mid(),
              sender: 'agent',
              text: `Let's adjust your ${fieldToEdit}:`,
              includeCard: {
                type: fieldToEdit,
                data: fieldToEdit === 'basicInfo' || fieldToEdit === 'license' ? agentState.onboarding : agentState.availability
              }
            }]);
          } else {
            // Default to showing the rate card if we can't determine what they want to edit
            setMessages(prev => [...prev, {
              id: mid(),
              sender: 'agent',
              text: "Let's adjust your hourly rate then:",
              includeCard: {
                type: 'rate',
                data: agentState.availability
              }
            }]);
          }
        }
      }
    }, 1000);
  };
  // Handle card submissions
  const handleCardSubmit = (cardType: string, updatedData: any) => {
    // Handle different card types
    if (cardType === 'basicInfo') {
      // Update basic info in onboarding state
      updateAgentState('onboarding', {
        ...agentState.onboarding,
        basicInfo: updatedData
      });
      // Move to license step
      setCurrentStep('license');
      // Show license card
      setMessages(prev => [...prev, {
        id: mid(),
        sender: 'agent',
        text: "Great! I've saved your basicInfo information. Now, let's add your professional license details:",
        includeCard: {
          type: 'license',
          data: agentState.onboarding
        }
      }]);
    } else if (cardType === 'license') {
      // Update license in onboarding state
      updateAgentState('onboarding', {
        ...agentState.onboarding,
        license: updatedData
      });
      // Move to availability step
      setCurrentStep('availability');
      // Show availability question
      setMessages(prev => [...prev, {
        id: mid(),
        sender: 'agent',
        text: 'Thanks! Now I need to know about your availability. Could you describe your preferred working hours for the week?',
        includeCard: {
          type: 'availability',
          data: agentState.availability
        }
      }]);
    } else if (cardType === 'availability_text') {
      // Handle the text input from AvailabilityList
      handleAvailabilityInput(updatedData);
    } else if (cardType === 'availability') {
      // Update the specific part of preferences
      const updatedPreferences = {
        ...agentState.availability
      };
      updatedPreferences.availability = updatedData;
      // Update agent state
      updateAgentState('availability', updatedPreferences);
      // Show confirmation with the updated availability
      setMessages(prev => [...prev, {
        id: mid(),
        sender: 'agent',
        text: 'Does this summary look correct?',
        includeCard: {
          type: 'availability',
          data: {
            ...agentState.availability,
            availability: updatedData
          },
          isConfirmation: true
        }
      }]);
    } else if (cardType === 'distance') {
      const updatedPreferences = {
        ...agentState.availability,
        distance: updatedData
      };
      // Update agent state
      updateAgentState('availability', updatedPreferences);
      // Complete the flow
      setMessages(prev => [...prev, {
        id: mid(),
        sender: 'agent',
        text: `Awesome, your travel distance has been updated to ${updatedData} miles.
Thank you for sharing your preferences! You should now see shifts that better match your preferences in your portal.
Please let me know if you'd like to change anything else.`
      }]);
      setCurrentStep('complete');
      setInitialOnboardingComplete(true);
    }
  };
  // Handle availability confirmation
  const handleAvailabilityConfirm = (availability: any) => {
    // Move to distance step
    setCurrentStep('distance');
    // Show distance question
    setMessages(prev => [...prev, {
      id: mid(),
      sender: 'agent',
      text: "Great, now could you tell me how far you're willing to travel for shifts? (e.g., 5, 12, 30 miles?)",
      includeCard: {
        type: 'distance',
        data: agentState.availability
      }
    }]);
  };
  // Process availability input
  const handleAvailabilityInput = (text: string) => {
    // Parse the availability from text
    const parsedAvail = parseAvailabilityFromText(text);
    if (parsedAvail.matched) {
      // Update the availability in agent state
      const updatedAvailability = {
        ...agentState.availability.availability
      };
      // Check if we have specific time ranges
      if (parsedAvail.timeRanges.length > 0) {
        // Process specific time ranges
        parsedAvail.timeRanges.forEach(range => {
          const day = range.day as keyof typeof updatedAvailability;
          // Create a TimeRange object
          const timeRangeObject = {
            start: range.start,
            end: range.end
          };
          if (parsedAvail.mode === 'remove') {
            // Remove matching time ranges
            if (Array.isArray(updatedAvailability[day])) {
              updatedAvailability[day] = updatedAvailability[day].filter((slot: any) => {
                // Skip if it's not a TimeRange object
                if (typeof slot !== 'object' || !slot.start || !slot.end) return true;
                // Remove if it matches the range to remove
                return slot.start !== range.start || slot.end !== range.end;
              });
            }
          } else if (parsedAvail.mode === 'only') {
            // Clear all days first if this is the first day we're processing
            if (!updatedAvailability[day] || updatedAvailability[day].length === 0) {
              Object.keys(updatedAvailability).forEach(d => {
                updatedAvailability[d as keyof typeof updatedAvailability] = [];
              });
            }
            // Set to only this time range
            updatedAvailability[day] = [timeRangeObject];
          } else {
            // Check if we're updating an existing time range for this day
            // If the day already has time ranges, replace them instead of adding
            const hasExistingTimeRanges = Array.isArray(updatedAvailability[day]) && updatedAvailability[day].some((slot: any) => typeof slot === 'object' && slot.start && slot.end);
            if (hasExistingTimeRanges) {
              // Replace existing time ranges with the new one
              updatedAvailability[day] = [timeRangeObject];
            } else {
              // Add this time range to any existing ones
              if (!Array.isArray(updatedAvailability[day])) {
                updatedAvailability[day] = [];
              }
              updatedAvailability[day] = [...updatedAvailability[day], timeRangeObject];
            }
          }
        });
      } else {
        // Process the days and slots based on the parsed availability
        if (parsedAvail.mode === 'only') {
          // Clear all days first
          Object.keys(updatedAvailability).forEach(day => {
            updatedAvailability[day as keyof typeof updatedAvailability] = [];
          });
          // Set only the specified days and slots
          parsedAvail.days.forEach(day => {
            updatedAvailability[day as keyof typeof updatedAvailability] = parsedAvail.slots;
          });
        } else if (parsedAvail.mode === 'remove') {
          // Remove availability for specified days
          parsedAvail.days.forEach(day => {
            updatedAvailability[day as keyof typeof updatedAvailability] = [];
          });
        } else {
          // Add availability for specified days and slots
          parsedAvail.days.forEach(day => {
            updatedAvailability[day as keyof typeof updatedAvailability] = parsedAvail.slots;
          });
        }
      }
      // Update agent state
      updateAgentState('availability', {
        ...agentState.availability,
        availability: updatedAvailability
      });
      // Show confirmation with the updated availability
      setMessages(prev => [...prev, {
        id: mid(),
        sender: 'agent',
        text: 'Does this summary look correct?',
        includeCard: {
          type: 'availability',
          data: {
            ...agentState.availability,
            availability: updatedAvailability
          },
          isConfirmation: true
        }
      }]);
    } else {
      // If parsing failed, ask for clarification
      setMessages(prev => [...prev, {
        id: mid(),
        sender: 'agent',
        text: "I'm sorry, I couldn't understand your availability preferences. Could you please specify which days and times you're available? For example: 'Monday to Friday 9am-5pm, weekends off'"
      }]);
    }
  };
  // Ask for distance
  const askForDistance = () => {
    setMessages(prev => [...prev, {
      id: mid(),
      sender: 'agent',
      text: 'Great! Now, could you share how far you can travel?',
      includeCard: {
        type: 'distance',
        data: agentState.availability
      }
    }]);
    setCurrentStep('rate');
  };
  // Ask for rate
  const askForRate = () => {
    setMessages(prev => [...prev, {
      id: mid(),
      sender: 'agent',
      text: 'Thank you! Now, could you share your desired hourly rate?',
      includeCard: {
        type: 'rate',
        data: agentState.availability
      }
    }]);
    setCurrentStep('complete');
  };
  // Complete onboarding
  const completeOnboarding = () => {
    setInitialOnboardingComplete(true);
    setMessages(prev => [...prev, {
      id: mid(),
      sender: 'agent',
      text: "Great! I've saved your preferences. Your profile is complete! Here's a summary:",
      includeCard: {
        type: 'summary',
        data: {
          basicInfo: agentState.onboarding.basicInfo,
          license: agentState.onboarding.license,
          ...agentState.availability
        }
      }
    }]);
    // Add final message
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: mid(),
        sender: 'agent',
        text: "You're all set! You can update these preferences anytime by chatting with me."
      }]);
    }, 1000);
  };
  // Handle profile confirmation
  const handleProfileConfirm = () => {
    // Here you would typically save the profile to a database
    setMessages(prev => [...prev, {
      id: mid(),
      sender: 'agent',
      text: "Your profile has been saved successfully! You're ready to start finding shifts that match your preferences."
    }]);
  };
  // Render the appropriate card based on message
  const renderCard = (message: Message) => {
    if (!message.includeCard) return null;
    switch (message.includeCard.type) {
      case 'basicInfo':
        return <BasicInfoCard value={message.includeCard.data.basicInfo} onChange={value => handleCardSubmit('basicInfo', value)} />;
      case 'license':
        return <LicenseCard value={message.includeCard.data.license} onChange={value => handleCardSubmit('license', value)} />;
      case 'availability':
        return <AvailabilityList data={message.includeCard.data} onSubmit={handleCardSubmit} isConfirmation={message.includeCard.isConfirmation} onConfirm={() => handleAvailabilityConfirm(message.includeCard?.data.availability)} />;
      case 'distance':
        return <DistanceCard value={message.includeCard.data.distance} onChange={value => handleCardSubmit('distance', value)} />;
      case 'rate':
        return <RateMicroCard value={message.includeCard.data.rate} onSubmit={value => handleCardSubmit('rate', value)} />;
      case 'summary':
        return <ProfileSummaryCard basicInfo={message.includeCard.data.basicInfo} license={message.includeCard.data.license} rate={message.includeCard.data.rate} availability={message.includeCard.data.availability} distance={message.includeCard.data.distance} onConfirm={handleProfileConfirm} />;
      default:
        return null;
    }
  };
  return <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between">
        <button className="flex items-center text-gray-600 hover:text-gray-800" onClick={() => navigate('/')}>
          <ChevronLeftIcon size={20} className="mr-1" />
          <span className="text-sm">Back</span>
        </button>
        <div className="flex items-center">
          <a href="/">
            <img src="https://cdn.prod.website-files.com/67877c0b28ab56a6a7d1433c/6787b2bcc2045f3cd146873c_ARYA%20HEALTH.svg" loading="lazy" alt="ARYA HEALTH" className="nav_logo" />
          </a>
        </div>
        <div className="w-20"></div> {/* Spacer to center the logo */}
      </div>

      {/* Chat area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map(message => <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${message.sender === 'user' ? 'bg-green-600 text-white rounded-br-sm' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'}`}>
              {message.text && <p className="text-sm font-light">{message.text}</p>}
              {message.includeCard && <div className={`${message.text ? 'mt-4' : ''} bg-white rounded-xl p-4 border border-gray-200 animate-slide-up shadow-sm`}>
                  {renderCard(message)}
                </div>}
            </div>
          </div>)}
        {isTyping && <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm p-4 shadow-sm">
              <TypingIndicator />
            </div>
          </div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center">
          <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Type a message..." className="flex-1 bg-gray-100 border border-gray-300 text-gray-800 rounded-full py-3 px-4 focus:outline-none focus:ring-1 focus:ring-green-500 placeholder-gray-500" />
          <button onClick={handleSendMessage} className="ml-2 bg-green-600 text-white rounded-full p-3 shadow-sm hover:bg-green-700 transition-all">
            <SendIcon size={18} />
          </button>
        </div>
      </div>
    </div>;
};