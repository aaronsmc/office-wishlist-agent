import React, { useEffect, useState } from 'react';
import { SunIcon } from 'lucide-react';
interface SimpleThemeToggleProps {
  className?: string;
}
export const SimpleThemeToggle: React.FC<SimpleThemeToggleProps> = ({
  className = ''
}) => {
  // Always use light theme
  const [theme] = useState<'light' | 'dark'>('light');
  // Toggle theme function is now a no-op (does nothing)
  const toggleTheme = () => {
    // This function no longer changes the theme
    localStorage.setItem('arya-theme', 'light');
  };
  // Apply theme to body
  useEffect(() => {
    document.body.className = 'light';
    document.documentElement.setAttribute('data-theme', 'light');
    // Force light theme in localStorage to ensure persistence
    localStorage.setItem('arya-theme', 'light');
  }, []);
  // We only show the sun icon since we're always in light mode
  return <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 ${className}`} aria-label="Light mode enabled">
      <SunIcon size={20} />
    </button>;
};