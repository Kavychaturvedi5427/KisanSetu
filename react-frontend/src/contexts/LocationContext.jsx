import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Try to get location from localStorage first
    const savedLocation = localStorage.getItem('kisanSetuLocation');
    if (savedLocation) {
      setLocation(JSON.parse(savedLocation));
    } else {
      // Set default location
      const defaultLocation = {
        city: 'Delhi',
        state: 'Delhi',
        country: 'India'
      };
      setLocation(defaultLocation);
      localStorage.setItem('kisanSetuLocation', JSON.stringify(defaultLocation));
    }
  }, []);

  const updateLocation = (newLocation) => {
    setLocation(newLocation);
    localStorage.setItem('kisanSetuLocation', JSON.stringify(newLocation));
  };

  return (
    <LocationContext.Provider value={{ location, updateLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within LocationProvider');
  }
  return context;
};