/**
 * @author: Harsha Attray
 * @description: Custom hook for managing dark mode state and persistence
 * @version: 1.0.0
 * @date: 2025-05-24
 * @license: MIT
 */

import { useEffect, useState } from 'react';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize from local storage or default to dark mode
    const storedMode = localStorage.getItem('darkMode');
    if (storedMode !== null) {
      return storedMode === 'true';
    }
    // Default to dark mode if no stored preference
    return true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    // Save preference to local storage
    localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return {
    isDarkMode,
    toggleDarkMode,
  };
}; 