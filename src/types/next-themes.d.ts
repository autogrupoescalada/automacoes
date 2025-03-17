declare module 'next-themes' {
  import { type ReactNode } from 'react';

  export interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: string;
    storageKey?: string;
    themes?: string[];
    forcedTheme?: string;
    disableTransitionOnChange?: boolean;
    enableSystem?: boolean;
    enableColorScheme?: boolean;
    attribute?: string;
    value?: Record<string, string>;
  }

  export interface UseThemeProps {
    themes: string[];
    forcedTheme?: string;
    setTheme: (theme: string) => void;
    theme?: string;
    resolvedTheme?: string;
    systemTheme?: 'dark' | 'light';
  }

  export function useTheme(): UseThemeProps;
  
  export const ThemeProvider: React.FC<ThemeProviderProps>;
} 