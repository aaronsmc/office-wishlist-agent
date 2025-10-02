import React from 'react';
import { SunIcon } from 'lucide-react';
interface ThemeToggleProps {
  className?: string;
}
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = ''
}) => {
  // No need to use theme context anymore, always light mode
  // This is now a no-op function
  const toggleTheme = () => {
    // Does nothing, we always stay in light mode
  };
  return <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 ${className}`} aria-label="Light mode enabled">
      <SunIcon size={20} />
    </button>;
};