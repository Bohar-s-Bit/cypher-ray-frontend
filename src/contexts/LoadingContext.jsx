import React, { createContext, useContext, useState, useEffect } from 'react';
import MatrixLoader from '../components/ui/MatrixLoader';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  // Show loader briefly on initial load
  useEffect(() => {
    // Just show loader for a short duration without preloading
    // Images will lazy load with OptimizedImage component
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 800); // Quick 800ms splash

    return () => clearTimeout(timer);
  }, []);

  const value = {
    isInitialLoading,
    isRouteLoading,
    setIsRouteLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {isInitialLoading && <MatrixLoader fullscreen />}
      {isRouteLoading && <MatrixLoader fullscreen />}
      <div style={{ display: isInitialLoading ? 'none' : 'block' }}>
        {children}
      </div>
    </LoadingContext.Provider>
  );
};
