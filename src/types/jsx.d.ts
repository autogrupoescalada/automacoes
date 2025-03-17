import type React from 'react';

declare global {
  namespace JSX {
    type IntrinsicElements = Record<string, React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>>;
  }
} 