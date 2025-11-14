import { useCallback } from 'react';

export const useUserData = () => {
  const saveFormData = useCallback((formType, data) => {
    try {
      localStorage.setItem(`kisanSetu_${formType}`, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save form data:', error);
    }
  }, []);

  const getSavedFormData = useCallback((formType) => {
    try {
      const saved = localStorage.getItem(`kisanSetu_${formType}`);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.warn('Failed to get saved form data:', error);
      return {};
    }
  }, []);

  const clearFormData = useCallback((formType) => {
    try {
      localStorage.removeItem(`kisanSetu_${formType}`);
    } catch (error) {
      console.warn('Failed to clear form data:', error);
    }
  }, []);

  return {
    saveFormData,
    getSavedFormData,
    clearFormData
  };
};