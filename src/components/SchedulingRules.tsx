import React, { useState } from 'react';
import { ClockIcon, PlusIcon, XIcon, CheckIcon } from 'lucide-react';
type SchedulingRulesProps = {
  value: string[];
  onChange: (value: string[]) => void;
};
export const SchedulingRules = ({
  value,
  onChange
}: SchedulingRulesProps) => {
  const [customRule, setCustomRule] = useState('');
  const commonRules = ['No back-to-back shifts', 'No Mondays after working weekends', 'Only weekend shifts', 'No night shifts on consecutive days', 'At least 12 hours between shifts', 'No more than 3 consecutive days'];
  const toggleRule = (rule: string) => {
    if (value.includes(rule)) {
      onChange(value.filter(r => r !== rule));
    } else {
      onChange([...value, rule]);
    }
  };
  const addCustomRule = () => {
    if (customRule.trim() && !value.includes(customRule.trim())) {
      onChange([...value, customRule.trim()]);
      setCustomRule('');
    }
  };
  return <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-2">
        <ClockIcon size={20} className="text-green-600" />
        <p className="text-gray-700 font-medium">Scheduling Rules</p>
      </div>
      <p className="text-gray-600 text-sm pl-7">
        Any scheduling preferences we should follow?
      </p>
      <div className="space-y-2 mt-3 pl-1">
        {commonRules.map(rule => <div key={rule} className="flex items-center bg-white border border-gray-100 rounded-lg p-2 hover:border-green-200 transition-colors">
            <div onClick={() => toggleRule(rule)} className={`w-5 h-5 flex-shrink-0 rounded border ${value.includes(rule) ? 'bg-green-600 border-green-600 flex items-center justify-center' : 'border-gray-300 hover:border-green-400'} cursor-pointer transition-colors`}>
              {value.includes(rule) && <CheckIcon size={14} className="text-white" />}
            </div>
            <label onClick={() => toggleRule(rule)} className="ml-3 text-gray-700 cursor-pointer text-sm flex-1">
              {rule}
            </label>
          </div>)}
      </div>
      <div className="pt-2">
        <div className="flex items-center">
          <input type="text" value={customRule} onChange={e => setCustomRule(e.target.value)} placeholder="Add a custom rule..." className="flex-1 px-3 py-2.5 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm" onKeyPress={e => e.key === 'Enter' && addCustomRule()} />
          <button onClick={addCustomRule} disabled={!customRule.trim()} className={`px-4 py-2.5 rounded-r-lg flex items-center justify-center transition-colors ${customRule.trim() ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
            <PlusIcon size={18} />
          </button>
        </div>
      </div>
      {value.length > 0 && <div className="pt-2">
          <p className="font-medium text-gray-700 mb-2 flex items-center">
            <ClockIcon size={16} className="text-green-600 mr-2" />
            Your rules:
          </p>
          <div className="space-y-2">
            {value.map((rule, index) => <div key={index} className="flex items-center justify-between bg-green-50 px-3 py-2.5 rounded-lg border border-green-100">
                <span className="text-gray-800 text-sm">{rule}</span>
                <button onClick={() => toggleRule(rule)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <XIcon size={16} />
                </button>
              </div>)}
          </div>
        </div>}
    </div>;
};