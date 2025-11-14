import { useState } from 'react';
import { useLocationContext } from '../../contexts/LocationContext';
import { MapPin, X } from 'lucide-react';

const LocationPrompt = ({ isOpen, onClose }) => {
  const { updateLocation } = useLocationContext();
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city && state) {
      updateLocation({
        city,
        state,
        country: 'India'
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-bold text-gray-800">Set Your Location</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-4">
          Help us provide better local recommendations by setting your location.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter your city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
          <input
            type="text"
            placeholder="Enter your state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Skip
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationPrompt;