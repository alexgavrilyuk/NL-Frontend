// src/features/account/components/ThemeSelector.js

import React from 'react';
import { useTheme } from '../../../core/theme/ThemeProvider';

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'light', name: 'Light', icon: '☀️' },
    { id: 'dark', name: 'Dark', icon: '🌙' }
  ];

  return (
    <div className="flex flex-wrap gap-md">
      {themes.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => setTheme(t.id)}
          className={`
            p-md rounded-md border transition-all
            ${theme === t.id
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 ring-2 ring-primary-500'
              : 'border-border-light hover:border-border-normal'
            }
          `}
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-sm">{t.icon}</span>
            <span className="font-medium">{t.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;