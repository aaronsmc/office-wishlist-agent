import React, { useState } from 'react';
type ExtractedDataProps = {
  value: {
    type: string;
    number: string;
    expiryDate: string;
    name: string;
  } | null;
  onChange: (value: {
    type: string;
    number: string;
    expiryDate: string;
    name: string;
  }) => void;
};
export const ExtractedDataCard = ({
  value,
  onChange
}: ExtractedDataProps) => {
  // Provide default values if value is null
  const defaultData = {
    type: 'CPR Certification',
    number: '772-456-1832 ',
    expiryDate: '2026-07-19',
    name: 'Kunal Sarda'
  };
  const [data, setData] = useState(value || defaultData);
  const handleChange = (field: keyof typeof data, newValue: string) => {
    const updated = {
      ...data,
      [field]: newValue
    };
    setData(updated);
    onChange(updated);
  };
  const licenseTypes = ['Registered Nurse (RN)', 'Licensed Practical Nurse (LPN)', 'Certified Nursing Assistant (CNA)', 'CPR Certification', 'Basic Life Support (BLS)', 'Advanced Cardiac Life Support (ACLS)', 'Other'];
  return <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-800">
        Extracted Information
      </h3>
      <p className="text-xs text-gray-600">
        We've extracted the following information from your document. Please
        verify and correct if needed.
      </p>
      <div className="space-y-2">
        <div>
          <label className="text-xs text-gray-600 mb-1 block">
            Credential Type
          </label>
          <select value={data.type} onChange={e => handleChange('type', e.target.value)} className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500">
            <option value="" disabled>
              Select credential type
            </option>
            {licenseTypes.map(type => <option key={type} value={type}>
                {type}
              </option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-600 mb-1 block">
            License/Certificate Number
          </label>
          <input type="text" value={data.number} onChange={e => handleChange('number', e.target.value)} className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500" />
        </div>
        <div>
          <label className="text-xs text-gray-600 mb-1 block">
            Name on Document
          </label>
          <input type="text" value={data.name} onChange={e => handleChange('name', e.target.value)} className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500" />
        </div>
        <div>
          <label className="text-xs text-gray-600 mb-1 block">
            Expiration Date
          </label>
          <input type="date" value={data.expiryDate} onChange={e => handleChange('expiryDate', e.target.value)} className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500" />
        </div>
      </div>
    </div>;
};