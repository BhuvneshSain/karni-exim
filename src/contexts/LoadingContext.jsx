import { createContext, useContext, useState, useCallback } from 'react';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});

  const setLoading = useCallback((key, isLoading, text = 'Loading...') => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading ? { loading: true, text } : undefined
    }));
  }, []);

  const isAnyLoading = Object.values(loadingStates).some(state => state?.loading);
  const loadingText = Object.values(loadingStates).find(state => state?.loading)?.text || 'Loading...';

  return (
    <LoadingContext.Provider value={{ 
      setLoading, 
      isAnyLoading, 
      loadingText,
      loadingStates 
    }}>
      {children}
    </LoadingContext.Provider>
  );
};
