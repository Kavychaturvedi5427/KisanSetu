export const INDIAN_CITIES = [
  { city: 'Delhi', state: 'Delhi', pincode: '110001', lat: 28.6139, lng: 77.2090 },
  { city: 'Mumbai', state: 'Maharashtra', pincode: '400001', lat: 19.0760, lng: 72.8777 },
  { city: 'Bangalore', state: 'Karnataka', pincode: '560001', lat: 12.9716, lng: 77.5946 },
  { city: 'Chennai', state: 'Tamil Nadu', pincode: '600001', lat: 13.0827, lng: 80.2707 },
  { city: 'Kolkata', state: 'West Bengal', pincode: '700001', lat: 22.5726, lng: 88.3639 },
  { city: 'Hyderabad', state: 'Telangana', pincode: '500001', lat: 17.3850, lng: 78.4867 },
  { city: 'Pune', state: 'Maharashtra', pincode: '411001', lat: 18.5204, lng: 73.8567 },
  { city: 'Ahmedabad', state: 'Gujarat', pincode: '380001', lat: 23.0225, lng: 72.5714 },
  { city: 'Jaipur', state: 'Rajasthan', pincode: '302001', lat: 26.9124, lng: 75.7873 },
  { city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226001', lat: 26.8467, lng: 80.9462 },
  { city: 'Chandigarh', state: 'Punjab', pincode: '160001', lat: 30.7333, lng: 76.7794 },
  { city: 'Bhopal', state: 'Madhya Pradesh', pincode: '462001', lat: 23.2599, lng: 77.4126 },
  { city: 'Indore', state: 'Madhya Pradesh', pincode: '452001', lat: 22.7196, lng: 75.8577 },
  { city: 'Patna', state: 'Bihar', pincode: '800001', lat: 25.5941, lng: 85.1376 },
  { city: 'Nagpur', state: 'Maharashtra', pincode: '440001', lat: 21.1458, lng: 79.0882 },
  { city: 'Surat', state: 'Gujarat', pincode: '395001', lat: 21.1702, lng: 72.8311 },
  { city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641001', lat: 11.0168, lng: 76.9558 },
  { city: 'Kochi', state: 'Kerala', pincode: '682001', lat: 9.9312, lng: 76.2673 },
  { city: 'Visakhapatnam', state: 'Andhra Pradesh', pincode: '530001', lat: 17.6868, lng: 83.2185 },
  { city: 'Agra', state: 'Uttar Pradesh', pincode: '282001', lat: 27.1767, lng: 78.0081 }
];

export const getRandomIndianCity = () => {
  return INDIAN_CITIES[Math.floor(Math.random() * INDIAN_CITIES.length)];
};

export const getLocationFromIP = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    return {
      latitude: data.latitude || 28.6139,
      longitude: data.longitude || 77.2090,
      city: data.city || 'Delhi',
      state: data.region || 'Delhi',
      country: data.country_name || 'India',
      pincode: data.postal || '110001',
      district: data.region || 'Delhi'
    };
  } catch (error) {
    const fallbackCity = getRandomIndianCity();
    return {
      latitude: fallbackCity.lat,
      longitude: fallbackCity.lng,
      city: fallbackCity.city,
      state: fallbackCity.state,
      country: 'India',
      pincode: fallbackCity.pincode,
      district: fallbackCity.state
    };
  }
};