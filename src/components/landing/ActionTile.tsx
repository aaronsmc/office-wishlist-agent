import React from 'react';
import { CalendarIcon, UserIcon, FileTextIcon, ArrowRightIcon } from 'lucide-react';
import { useTheme } from '../ThemeContext';
type ActionTileProps = {
  title: string;
  subtitle: string;
  ctaText: string;
  icon: 'calendar' | 'user' | 'file';
  onClick: () => void;
};
export const ActionTile = ({
  title,
  subtitle,
  ctaText,
  icon,
  onClick
}: ActionTileProps) => {
  const {
    theme
  } = useTheme();
  const renderIcon = () => {
    switch (icon) {
      case 'calendar':
        return <CalendarIcon size={24} className={theme === 'dark' ? 'text-teal-500' : 'text-green-700'} />;
      case 'user':
        return <UserIcon size={24} className={theme === 'dark' ? 'text-teal-500' : 'text-green-700'} />;
      case 'file':
        return <FileTextIcon size={24} className={theme === 'dark' ? 'text-teal-500' : 'text-green-700'} />;
    }
  };
  return <button onClick={onClick} className={`w-full ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-md border rounded-2xl p-5 text-left transition-all hover:scale-[1.01] hover:shadow-md focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-teal-700/50' : 'focus:ring-green-700/50'} group overflow-hidden relative`}>
      {/* Inner glow effect on hover */}
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-r from-teal-700/0 via-teal-700/10 to-teal-700/0' : 'bg-gradient-to-r from-green-700/0 via-green-700/10 to-green-700/0'} opacity-0 group-hover:opacity-100 blur-xl transition-opacity`} />
      <div className="flex items-start relative z-10">
        <div className={`${theme === 'dark' ? 'bg-teal-950' : 'bg-green-50'} rounded-xl p-2.5 mr-4`}>
          {renderIcon()}
        </div>
        <div className="flex-1">
          <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} font-medium text-lg`}>
            {title}
          </h3>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm mt-1`}>
            {subtitle}
          </p>
          <div className={`flex items-center mt-4 ${theme === 'dark' ? 'text-teal-400' : 'text-green-700'} text-sm font-medium`}>
            <span>{ctaText}</span>
            <ArrowRightIcon size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </button>;
};