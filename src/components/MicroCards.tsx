import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
type RateMicroCardProps = {
  value: {
    min: number;
    max: number;
  };
  onSubmit: (value: {
    min: number;
    max: number;
  }) => void;
};
export const RateMicroCard = ({
  value,
  onSubmit
}: RateMicroCardProps) => {
  const [localValue, setLocalValue] = useState(value);
  const {
    theme
  } = useTheme();
  const handleMinChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const min = parseInt(e.target.value, 10);
    setLocalValue({
      min,
      max: Math.max(min, localValue.max)
    });
  };
  const handleMaxChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const max = parseInt(e.target.value, 10);
    setLocalValue({
      min: Math.min(localValue.min, max),
      max
    });
  };
  const handleSubmit = () => {
    onSubmit(localValue);
  };
  return <div className="space-y-3">
      <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-white/90' : 'text-gray-800'}`}>
        Hourly Rate
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mb-1 block`}>
            Minimum
          </label>
          <select value={localValue.min} onChange={handleMinChange} className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-gray-300 text-gray-800'} border rounded-lg py-1.5 px-2 text-sm focus:outline-none focus:ring-1 ${theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-green-700/50'}`}>
            {Array.from({
            length: 36
          }, (_, i) => i + 15).map(rate => <option key={`min-${rate}`} value={rate} disabled={rate > localValue.max}>
                ${rate}
              </option>)}
          </select>
        </div>
        <div>
          <label className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mb-1 block`}>
            Maximum
          </label>
          <select value={localValue.max} onChange={handleMaxChange} className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-gray-300 text-gray-800'} border rounded-lg py-1.5 px-2 text-sm focus:outline-none focus:ring-1 ${theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-green-700/50'}`}>
            {Array.from({
            length: 36
          }, (_, i) => i + 15).map(rate => <option key={`max-${rate}`} value={rate} disabled={rate < localValue.min}>
                ${rate}
              </option>)}
          </select>
        </div>
      </div>
      <div className={`text-center text-sm font-light ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`}>
        ${localValue.min} - ${localValue.max} per hour
      </div>
      <div className="pt-2 flex justify-end">
        <button onClick={handleSubmit} className={`px-4 py-2 ${theme === 'dark' ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500' : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600'} text-white text-sm rounded-full transition-all`}>
          Save
        </button>
      </div>
    </div>;
};
type DistanceMicroCardProps = {
  value: number;
  onSubmit: (value: number) => void;
};
export const DistanceMicroCard = ({
  value,
  onSubmit
}: DistanceMicroCardProps) => {
  const [distance, setDistance] = useState(value);
  const {
    theme
  } = useTheme();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setDistance(isNaN(val) ? 0 : val);
  };
  const handleSubmit = () => {
    onSubmit(distance);
  };
  return <div className="space-y-3">
      <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-white/90' : 'text-gray-800'}`}>
        Travel Distance
      </h3>
      <div>
        <label className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mb-1 block`}>
          Maximum miles willing to travel
        </label>
        <input type="number" value={distance} onChange={handleChange} min="1" max="100" className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-gray-300 text-gray-800'} border rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-1 ${theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-green-700/50'}`} />
      </div>
      <div className="pt-2 flex justify-end">
        <button onClick={handleSubmit} className={`px-4 py-2 ${theme === 'dark' ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500' : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600'} text-white text-sm rounded-full transition-all`}>
          Save
        </button>
      </div>
    </div>;
};
type PhoneMicroCardProps = {
  value: string;
  onSubmit: (value: string) => void;
};
export const PhoneMicroCard = ({
  value,
  onSubmit
}: PhoneMicroCardProps) => {
  const [phone, setPhone] = useState(value);
  const {
    theme
  } = useTheme();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };
  const handleSubmit = () => {
    onSubmit(phone);
  };
  return <div className="space-y-3">
      <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-white/90' : 'text-gray-800'}`}>
        Phone Number
      </h3>
      <div>
        <input type="tel" value={phone} onChange={handleChange} placeholder="(555) 123-4567" className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder-white/40' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'} border rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-1 ${theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-green-700/50'}`} />
      </div>
      <div className="pt-2 flex justify-end">
        <button onClick={handleSubmit} className={`px-4 py-2 ${theme === 'dark' ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500' : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600'} text-white text-sm rounded-full transition-all`}>
          Save
        </button>
      </div>
    </div>;
};
type EmailMicroCardProps = {
  value: string;
  onSubmit: (value: string) => void;
};
export const EmailMicroCard = ({
  value,
  onSubmit
}: EmailMicroCardProps) => {
  const [email, setEmail] = useState(value);
  const {
    theme
  } = useTheme();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleSubmit = () => {
    onSubmit(email);
  };
  return <div className="space-y-3">
      <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-white/90' : 'text-gray-800'}`}>
        Email Address
      </h3>
      <div>
        <input type="email" value={email} onChange={handleChange} placeholder="your.email@example.com" className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder-white/40' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'} border rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-1 ${theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-green-700/50'}`} />
      </div>
      <div className="pt-2 flex justify-end">
        <button onClick={handleSubmit} className={`px-4 py-2 ${theme === 'dark' ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500' : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600'} text-white text-sm rounded-full transition-all`}>
          Save
        </button>
      </div>
    </div>;
};
type NameMicroCardProps = {
  value: string;
  onSubmit: (value: string) => void;
};
export const NameMicroCard = ({
  value,
  onSubmit
}: NameMicroCardProps) => {
  const [name, setName] = useState(value);
  const {
    theme
  } = useTheme();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleSubmit = () => {
    onSubmit(name);
  };
  return <div className="space-y-3">
      <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-white/90' : 'text-gray-800'}`}>
        Full Name
      </h3>
      <div>
        <input type="text" value={name} onChange={handleChange} placeholder="Enter your full name" className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder-white/40' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'} border rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-1 ${theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-green-700/50'}`} />
      </div>
      <div className="pt-2 flex justify-end">
        <button onClick={handleSubmit} className={`px-4 py-2 ${theme === 'dark' ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500' : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600'} text-white text-sm rounded-full transition-all`}>
          Save
        </button>
      </div>
    </div>;
};
type BasicInfoMicroCardProps = {
  field: string;
  value: string;
  onSubmit: (field: string, value: string) => void;
};
export const BasicInfoMicroCard = ({
  field,
  value,
  onSubmit
}: BasicInfoMicroCardProps) => {
  const [inputValue, setInputValue] = useState(value);
  const {
    theme
  } = useTheme();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleSubmit = () => {
    onSubmit(field, inputValue);
  };
  const getLabel = () => {
    switch (field) {
      case 'name':
        return 'Full Name';
      case 'email':
        return 'Email Address';
      case 'phone':
        return 'Phone Number';
      default:
        return field.charAt(0).toUpperCase() + field.slice(1);
    }
  };
  const getInputType = () => {
    switch (field) {
      case 'email':
        return 'email';
      case 'phone':
        return 'tel';
      default:
        return 'text';
    }
  };
  const getPlaceholder = () => {
    switch (field) {
      case 'name':
        return 'Enter your full name';
      case 'email':
        return 'your.email@example.com';
      case 'phone':
        return '(555) 123-4567';
      default:
        return `Enter your ${field}`;
    }
  };
  return <div className="space-y-3">
      <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-white/90' : 'text-gray-800'}`}>
        {getLabel()}
      </h3>
      <div>
        <input type={getInputType()} value={inputValue} onChange={handleChange} placeholder={getPlaceholder()} className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder-white/40' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'} border rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-1 ${theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-green-700/50'}`} />
      </div>
      <div className="pt-2 flex justify-end">
        <button onClick={handleSubmit} className={`px-4 py-2 ${theme === 'dark' ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500' : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600'} text-white text-sm rounded-full transition-all`}>
          Save
        </button>
      </div>
    </div>;
};