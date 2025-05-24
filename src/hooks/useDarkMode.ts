import { useEffect, useState } from 'react';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize from local storage or system preference
    const storedMode = localStorage.getItem('darkMode');
    if (storedMode !== null) {
      return storedMode === 'true';
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light'); // Optional: if you explicitly use a light class
    } else {
      root.classList.remove('dark');
      root.classList.add('light'); // Optional: if you explicitly use a light class
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