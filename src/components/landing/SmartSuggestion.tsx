import React from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { useTheme } from '../ThemeContext';
type SmartSuggestionProps = {
  text: string;
  onClick: () => void;
};
export const SmartSuggestion = ({
  text,
  onClick
}: SmartSuggestionProps) => {
  const {
    theme
  } = useTheme();
  return <button onClick={onClick} className={`w-full ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'} backdrop-blur-md border rounded-xl p-3 text-left transition-all focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-teal-700/50' : 'focus:ring-green-700/50'} group`}>
      <div className="flex items-center justify-between">
        <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-sm`}>
          {text}
        </span>
        <ArrowRightIcon size={14} className={`${theme === 'dark' ? 'text-teal-400' : 'text-green-700'} transition-transform group-hover:translate-x-1`} />
      </div>
    </button>;
};