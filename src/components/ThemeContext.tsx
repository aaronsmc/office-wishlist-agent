import React, { useEffect, useState, createContext, useContext } from 'react';
type Theme = 'light' | 'dark';
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
interface ThemeProviderProps {
  children: ReactNode;
}
export const ThemeProvider = ({
  children
}: ThemeProviderProps) => {
  // Always use light theme, ignoring localStorage
  const [theme] = useState<Theme>('light');
  // Toggle theme function is now a no-op (does nothing)
  const toggleTheme = () => {
    // This function no longer changes the theme
    // We keep it to maintain API compatibility with existing components
    localStorage.setItem('arya-theme', 'light');
  };
  // Apply theme to body
  useEffect(() => {
    document.body.className = 'light';
    document.documentElement.setAttribute('data-theme', 'light');
    // Force light theme in localStorage to ensure persistence
    localStorage.setItem('arya-theme', 'light');
  }, []);
  return <ThemeContext.Provider value={{
    theme,
    toggleTheme
  }}>
      {children}
    </ThemeContext.Provider>;
};