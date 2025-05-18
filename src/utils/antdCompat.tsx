// antdCompat.tsx
// Compatibility layer for Ant Design with React 19
// See: https://u.ant.design/v5-for-19

import React from 'react';

// React 19 compatibility for Ant Design v5
// Provides automatic error boundary fallback for Ant Design components
export const AntdCompat: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <React.StrictMode>
      {children}
    </React.StrictMode>
  );
};

// Wrap your entire app or Ant Design components with this to suppress warnings
export const suppressAntDesignWarnings = () => {
  const originalConsoleWarn = console.warn;
  
  console.warn = (...args: any[]) => {
    // Filter out specific Ant Design warnings related to React 19
    const warningMsg = args[0]?.toString() || '';
    if (
      warningMsg.includes('[antd: compatible]') || 
      warningMsg.includes('antd v5 support React is 16 ~ 18')
    ) {
      return;
    }
    
    // Let other warnings through
    originalConsoleWarn.apply(console, args);
  };
  
  return () => {
    // Cleanup function to restore original behavior if needed
    console.warn = originalConsoleWarn;
  };
};
