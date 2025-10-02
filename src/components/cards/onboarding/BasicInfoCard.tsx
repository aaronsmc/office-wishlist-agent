import React, { useState } from 'react';
import { useTheme } from '../../ThemeContext';
type BasicInfoProps = {
  value: {
    name: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    zipcode?: string;
  };
  onChange: (value: {
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    zipcode: string;
  }) => void;
};
export const BasicInfoCard = ({
  value,
  onChange
}: BasicInfoProps) => {
  const [info, setInfo] = useState({
    name: value.name || '',
    email: value.email || '',
    phone: value.phone || '',
    dateOfBirth: value.dateOfBirth || '',
    addressLine1: value.addressLine1 || '',
    addressLine2: value.addressLine2 || '',
    city: value.city || '',
    zipcode: value.zipcode || ''
  });
  const {
    theme
  } = useTheme();
  const handleChange = (field: keyof typeof info, newValue: string) => {
    const updated = {
      ...info,
      [field]: newValue
    };
    setInfo(updated);
  };
  const handleSave = () => {
    onChange(info);
  };
  return <div className="space-y-3">
      <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-white/90' : 'text-gray-800'}`}>
        Basic Information
      </h3>
      <div className="space-y-2">
        <div>
          <label className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mb-1 block`}>
            Full Name
          </label>
          <input type="text" value={info.name} onChange={e => handleChange('name', e.target.value)} placeholder="Enter your full name" className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder-white/40' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'} border rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-1 ${theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-green-700/50'}`} />
        </div>
        <div>
          <label className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mb-1 block`}>
            Email
          </label>
          <input type="email" value={info.email} onChange={e => handleChange('email', e.target.value)} placeholder="your.email@example.com" className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder-white/40' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'} border rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-1 ${theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-green-700/50'}`} />
        </div>
        <div>
          <label className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mb-1 block`}>
            Phone
          </label>
          <input type="tel" value={info.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="(555) 123-4567" className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder-white/40' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'} border rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-1 ${theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-green-700/50'}`} />
        </div>
        <div>
          <label className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mb-1 block`}>
            Date of Birth (MM/DD/YYYY)
          </label>
          <input type="text" value={info.dateOfBirth} onChange={e => handleChange('dateOfBirth', e.target.value)} placeholder="01/01/1990" className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder-white/40' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'} border rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-1 ${theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-green-700/50'}`} />
        </div>
        {/* Address Fields */}
        <div>
          <label className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mb-1 block`}>
            Address Line 1
          </label>
          <input type="text" value={info.addressLine1} onChange={e => handleChange('addressLine1', e.target.value)} placeholder="123 Main St" className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder-white/40' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'} border rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-1 ${theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-green-700/50'}`} />
        </div>
        <div>
          <label className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mb-1 block`}>
            Address Line 2 (Optional)
          </label>
          <input type="text" value={info.addressLine2} onChange={e => handleChange('addressLine2', e.target.value)} placeholder="Apt 4B, Suite 100, etc." className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder-white/40' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'} border rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-1 ${theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-green-700/50'}`} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mb-1 block`}>
              City
            </label>
            <input type="text" value={info.city} onChange={e => handleChange('city', e.target.value)} placeholder="New York" className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder-white/40' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'} border rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-1 ${theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-green-700/50'}`} />
          </div>
          <div>
            <label className={`text-xs ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'} mb-1 block`}>
              Zipcode
            </label>
            <input type="text" value={info.zipcode} onChange={e => handleChange('zipcode', e.target.value)} placeholder="10001" className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder-white/40' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'} border rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-1 ${theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-green-700/50'}`} />
          </div>
        </div>
      </div>
      <div className="pt-2 flex justify-end">
        <button onClick={handleSave} className={`px-4 py-2 ${theme === 'dark' ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500' : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600'} text-white text-sm rounded-full transition-all`}>
          Save
        </button>
      </div>
    </div>;
};