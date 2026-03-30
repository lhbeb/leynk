'use client';

import { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ children, text, position = 'top' }: TooltipProps) {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-text-primary',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-text-primary',
    left: 'left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-text-primary',
    right: 'right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-text-primary',
  };

  return (
    <div className="relative group">
      {children}
      <div
        className={`absolute ${positionClasses[position]} px-3 py-1.5 bg-text-primary text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-lg`}
      >
        {text}
        <div className={`absolute ${arrowClasses[position]}`}></div>
      </div>
    </div>
  );
}

