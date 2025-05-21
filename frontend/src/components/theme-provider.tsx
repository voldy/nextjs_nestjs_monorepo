'use client';

import * as React from 'react';

const ThemeContext = React.createContext({
  theme: 'light' as 'light' | 'dark',
  setTheme: (_theme: 'light' | 'dark') => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  // Set theme on client after mount
  React.useEffect(() => {
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    setTheme(preferred);
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return React.useContext(ThemeContext);
}
