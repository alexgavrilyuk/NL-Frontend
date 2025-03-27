// src/core/theme/ThemeProvider.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import themes from './themes';
import { applyThemeToDocument } from './themeUtils';

// Create Theme Context
export const ThemeContext = createContext({
  theme: 'light',
  themeData: themes.light,
  setTheme: () => {},
  toggleTheme: () => {},
});

/**
 * Theme Provider Component
 *
 * Provides theme context to the application and handles theme switching
 * between light and dark modes.
 */
export const ThemeProvider = ({ children }) => {
  // Get initial theme from localStorage or system preference
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('neuroledger-theme');

    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light'; // Default theme
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const themeData = themes[theme] || themes.light;

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Update theme in localStorage and apply CSS variables when theme changes
  useEffect(() => {
    localStorage.setItem('neuroledger-theme', theme);
    applyThemeToDocument(themeData);

    // Add data-theme attribute to document for Tailwind dark mode
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, themeData]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      // Only update if user hasn't manually set a theme
      if (!localStorage.getItem('neuroledger-theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const contextValue = {
    theme,
    themeData,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;