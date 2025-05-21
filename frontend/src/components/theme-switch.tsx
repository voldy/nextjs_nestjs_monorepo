'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from './theme-provider';

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="inline-flex items-center gap-2 px-2 py-1 border rounded bg-background text-foreground hover:bg-muted transition-colors"
      aria-label="Toggle theme"
      type="button"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
